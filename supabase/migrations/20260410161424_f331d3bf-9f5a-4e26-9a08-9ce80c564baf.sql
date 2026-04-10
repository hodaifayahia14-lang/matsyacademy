
-- 1. Gamification Settings (single-row config)
CREATE TABLE public.gamification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT true,
  base_points_per_confirmation integer NOT NULL DEFAULT 10,
  rate_bonus_multiplier numeric NOT NULL DEFAULT 1.5,
  streak_bonus_points integer NOT NULL DEFAULT 5,
  points_reset_period text NOT NULL DEFAULT 'never',
  leaderboard_formula text NOT NULL DEFAULT 'confirmed_count',
  weight_points integer NOT NULL DEFAULT 40,
  weight_rate integer NOT NULL DEFAULT 30,
  weight_confirmations integer NOT NULL DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gamification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage gamification settings" ON public.gamification_settings
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Authenticated read gamification settings" ON public.gamification_settings
  FOR SELECT TO authenticated USING (true);

-- Insert default row
INSERT INTO public.gamification_settings (id) VALUES (gen_random_uuid());

-- 2. Milestone Rules
CREATE TABLE public.milestone_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL DEFAULT '',
  name_fr text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  milestone_type text NOT NULL DEFAULT 'total_confirmations',
  target_value integer NOT NULL DEFAULT 1,
  reward_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  icon text NOT NULL DEFAULT '🏅',
  color text NOT NULL DEFAULT '#3b82f6',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  show_on_leaderboard boolean NOT NULL DEFAULT true,
  show_on_agent_dashboard boolean NOT NULL DEFAULT true,
  is_repeatable boolean NOT NULL DEFAULT false,
  repeat_period text DEFAULT null,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.milestone_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage milestone rules" ON public.milestone_rules
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Authenticated read milestone rules" ON public.milestone_rules
  FOR SELECT TO authenticated USING (true);

-- 3. Agent Badges
CREATE TABLE public.agent_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_rule_id uuid NOT NULL REFERENCES public.milestone_rules(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.agent_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent badges" ON public.agent_badges
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Agents view own badges" ON public.agent_badges
  FOR SELECT TO authenticated USING (agent_id = auth.uid());

-- 4. Agent Titles
CREATE TABLE public.agent_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_ar text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  milestone_rule_id uuid REFERENCES public.milestone_rules(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  granted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent titles" ON public.agent_titles
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Agents view own titles" ON public.agent_titles
  FOR SELECT TO authenticated USING (agent_id = auth.uid());

-- 5. Agent Points
CREATE TABLE public.agent_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'milestone',
  milestone_rule_id uuid REFERENCES public.milestone_rules(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage agent points" ON public.agent_points
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Agents view own points" ON public.agent_points
  FOR SELECT TO authenticated USING (agent_id = auth.uid());

-- 6. Reward Distribution Log
CREATE TABLE public.reward_distribution_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_rule_id uuid NOT NULL REFERENCES public.milestone_rules(id) ON DELETE CASCADE,
  reward_type text NOT NULL DEFAULT 'badge',
  delivery_status text NOT NULL DEFAULT 'auto_delivered',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_distribution_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage reward log" ON public.reward_distribution_log
  FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Agents view own reward log" ON public.reward_distribution_log
  FOR SELECT TO authenticated USING (agent_id = auth.uid());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reward_distribution_log;

-- Allow admins to insert notifications (for milestone alerts)
CREATE POLICY "Admins insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

-- Milestone check function
CREATE OR REPLACE FUNCTION public.check_agent_milestones()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _agent_id uuid;
  _total_confirmed bigint;
  _rule RECORD;
  _already_earned boolean;
BEGIN
  -- Only fire when status changes to confirmed
  IF NEW.order_status = 'confirmed' AND (OLD.order_status IS DISTINCT FROM 'confirmed') THEN
    _agent_id := COALESCE(NEW.confirmed_by, NEW.assigned_agent_id);
    
    IF _agent_id IS NULL THEN
      RETURN NEW;
    END IF;

    -- Check gamification is enabled
    IF NOT EXISTS (SELECT 1 FROM gamification_settings WHERE enabled = true LIMIT 1) THEN
      RETURN NEW;
    END IF;

    -- Get agent total confirmations
    SELECT count(*) INTO _total_confirmed
    FROM orders
    WHERE (confirmed_by = _agent_id OR assigned_agent_id = _agent_id)
      AND order_status = 'confirmed';

    -- Loop active milestone rules of type total_confirmations
    FOR _rule IN
      SELECT * FROM milestone_rules
      WHERE is_active = true AND milestone_type = 'total_confirmations'
      ORDER BY target_value ASC
    LOOP
      IF _total_confirmed >= _rule.target_value THEN
        -- Check if already earned
        SELECT EXISTS (
          SELECT 1 FROM agent_badges
          WHERE agent_id = _agent_id AND milestone_rule_id = _rule.id
        ) INTO _already_earned;

        IF NOT _already_earned THEN
          -- Award badge
          INSERT INTO agent_badges (agent_id, milestone_rule_id)
          VALUES (_agent_id, _rule.id);

          -- Award points if configured
          IF (_rule.reward_config->>'points_bonus') IS NOT NULL THEN
            INSERT INTO agent_points (agent_id, points, source, milestone_rule_id)
            VALUES (_agent_id, (_rule.reward_config->>'points_bonus')::int, 'milestone', _rule.id);
          END IF;

          -- Award title if configured
          IF (_rule.reward_config->>'title_en') IS NOT NULL THEN
            INSERT INTO agent_titles (agent_id, title_ar, title_fr, title_en, milestone_rule_id)
            VALUES (
              _agent_id,
              COALESCE(_rule.reward_config->>'title_ar', ''),
              COALESCE(_rule.reward_config->>'title_fr', ''),
              _rule.reward_config->>'title_en',
              _rule.id
            );
          END IF;

          -- Log reward
          INSERT INTO reward_distribution_log (agent_id, milestone_rule_id, reward_type, delivery_status)
          VALUES (_agent_id, _rule.id, 'auto', 'auto_delivered');

          -- Send notification
          INSERT INTO notifications (user_id, type, message)
          VALUES (
            _agent_id,
            'milestone',
            '🎉 ' || COALESCE(_rule.reward_config->>'notification_en', 'You reached a new milestone!')
          );
        END IF;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on orders
CREATE TRIGGER trg_check_agent_milestones
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.check_agent_milestones();
