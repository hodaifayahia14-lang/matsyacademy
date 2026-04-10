
CREATE TABLE public.agent_compensation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pay_type TEXT NOT NULL DEFAULT 'per_confirmation' CHECK (pay_type IN ('per_month', 'per_confirmation')),
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (agent_id)
);

ALTER TABLE public.agent_compensation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage compensation" ON public.agent_compensation
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Agents view own compensation" ON public.agent_compensation
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

CREATE TRIGGER update_agent_compensation_updated_at
  BEFORE UPDATE ON public.agent_compensation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
