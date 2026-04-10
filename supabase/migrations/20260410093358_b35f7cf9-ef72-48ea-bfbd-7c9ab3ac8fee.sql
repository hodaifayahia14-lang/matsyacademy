
-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  wilaya_code integer NOT NULL,
  wilaya_name text NOT NULL,
  status_label text NOT NULL DEFAULT 'other',
  order_status text NOT NULL DEFAULT 'pending',
  assigned_agent_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  confirmed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  confirmed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins manage orders"
ON public.orders FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Agents view assigned orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'confirmation_agent'));

CREATE POLICY "Agents update assigned orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'confirmation_agent') AND assigned_agent_id = auth.uid());

-- Create agent_rewards table
CREATE TABLE public.agent_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_name text NOT NULL,
  description text DEFAULT '',
  awarded_at timestamptz NOT NULL DEFAULT now(),
  awarded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.agent_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage rewards"
ON public.agent_rewards FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Agents view own rewards"
ON public.agent_rewards FOR SELECT
TO authenticated
USING (agent_id = auth.uid());

-- Enable realtime on orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
