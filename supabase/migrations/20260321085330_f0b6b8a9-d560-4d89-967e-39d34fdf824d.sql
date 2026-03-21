
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT TO anon USING (true);

-- USER_ROLES
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- CATEGORIES
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- COURSES
CREATE POLICY "Published courses public read" ON public.courses FOR SELECT USING (status = 'published' OR instructor_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Instructors create courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (instructor_id = auth.uid() AND public.has_role(auth.uid(), 'instructor'));
CREATE POLICY "Instructors update own courses" ON public.courses FOR UPDATE TO authenticated USING (instructor_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Instructors delete own courses" ON public.courses FOR DELETE TO authenticated USING (instructor_id = auth.uid() OR public.is_admin(auth.uid()));

-- SECTIONS
CREATE POLICY "Sections readable with course" ON public.sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin(auth.uid())))
);
CREATE POLICY "Instructors manage own sections" ON public.sections FOR INSERT TO authenticated WITH CHECK (public.is_instructor_of_course(auth.uid(), course_id));
CREATE POLICY "Instructors update own sections" ON public.sections FOR UPDATE TO authenticated USING (public.is_instructor_of_course(auth.uid(), course_id));
CREATE POLICY "Instructors delete own sections" ON public.sections FOR DELETE TO authenticated USING (public.is_instructor_of_course(auth.uid(), course_id));

-- LESSONS
CREATE POLICY "Lessons readable with course" ON public.lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sections s JOIN public.courses c ON c.id = s.course_id WHERE s.id = section_id AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin(auth.uid())))
);
CREATE POLICY "Instructors manage own lessons" ON public.lessons FOR INSERT TO authenticated WITH CHECK (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_section(section_id))
);
CREATE POLICY "Instructors update own lessons" ON public.lessons FOR UPDATE TO authenticated USING (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_section(section_id))
);
CREATE POLICY "Instructors delete own lessons" ON public.lessons FOR DELETE TO authenticated USING (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_section(section_id))
);

-- ENROLLMENTS
CREATE POLICY "Students view own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Students enroll" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students update own enrollment" ON public.enrollments FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- LESSON_PROGRESS
CREATE POLICY "Students view own progress" ON public.lesson_progress FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students mark progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- QUIZZES
CREATE POLICY "Quizzes readable with lesson" ON public.quizzes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.lessons l JOIN public.sections s ON s.id = l.section_id JOIN public.courses c ON c.id = s.course_id WHERE l.id = lesson_id AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin(auth.uid())))
);
CREATE POLICY "Instructors manage quizzes" ON public.quizzes FOR INSERT TO authenticated WITH CHECK (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_lesson(lesson_id))
);
CREATE POLICY "Instructors update quizzes" ON public.quizzes FOR UPDATE TO authenticated USING (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_lesson(lesson_id))
);
CREATE POLICY "Instructors delete quizzes" ON public.quizzes FOR DELETE TO authenticated USING (
  public.is_instructor_of_course(auth.uid(), public.get_course_id_for_lesson(lesson_id))
);

-- QUIZ_QUESTIONS
CREATE POLICY "Quiz questions readable with quiz" ON public.quiz_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quizzes q JOIN public.lessons l ON l.id = q.lesson_id JOIN public.sections s ON s.id = l.section_id JOIN public.courses c ON c.id = s.course_id WHERE q.id = quiz_id AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin(auth.uid())))
);
CREATE POLICY "Instructors manage quiz questions" ON public.quiz_questions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND public.is_instructor_of_course(auth.uid(), public.get_course_id_for_lesson(q.lesson_id)))
);

-- QUIZ_ATTEMPTS
CREATE POLICY "Students view own attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students create attempts" ON public.quiz_attempts FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- REVIEWS
CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Students create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- CERTIFICATES
CREATE POLICY "Students view own certificates" ON public.certificates FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_admin(auth.uid()));

-- PAYMENTS
CREATE POLICY "Students view own payments" ON public.payments FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Students create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- COUPONS
CREATE POLICY "Coupons public read" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- NOTIFICATIONS
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- WISHLISTS
CREATE POLICY "Students view own wishlists" ON public.wishlists FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students manage wishlists" ON public.wishlists FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students delete wishlists" ON public.wishlists FOR DELETE TO authenticated USING (student_id = auth.uid());

-- COMMENTS
CREATE POLICY "Comments readable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own comments" ON public.comments FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own comments" ON public.comments FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
