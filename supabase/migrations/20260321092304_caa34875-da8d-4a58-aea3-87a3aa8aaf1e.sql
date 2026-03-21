
-- Q&A tables
CREATE TABLE public.qa_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  upvotes integer NOT NULL DEFAULT 0,
  is_answered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.qa_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.qa_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  is_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Instructions tables
CREATE TABLE public.instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  body_fr text NOT NULL DEFAULT '',
  body_ar text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.instruction_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instruction_id uuid NOT NULL REFERENCES public.instructions(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, instruction_id)
);

-- Enable RLS
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruction_progress ENABLE ROW LEVEL SECURITY;

-- Q&A Questions policies
CREATE POLICY "QA questions public read" ON public.qa_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users create questions" ON public.qa_questions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own questions" ON public.qa_questions FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own questions" ON public.qa_questions FOR DELETE TO authenticated USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- Q&A Answers policies
CREATE POLICY "QA answers public read" ON public.qa_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users create answers" ON public.qa_answers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own answers" ON public.qa_answers FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own answers" ON public.qa_answers FOR DELETE TO authenticated USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- Instructions policies
CREATE POLICY "Instructions public read" ON public.instructions FOR SELECT USING (true);
CREATE POLICY "Admins manage instructions" ON public.instructions FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Instruction progress policies
CREATE POLICY "Users view own progress" ON public.instruction_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own progress" ON public.instruction_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own progress" ON public.instruction_progress FOR UPDATE TO authenticated USING (user_id = auth.uid());
