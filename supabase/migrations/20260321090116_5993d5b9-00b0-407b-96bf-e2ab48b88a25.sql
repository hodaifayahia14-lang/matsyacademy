
-- Add is_active to profiles for admin ban/activate
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Add learning_outcomes and requirements to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_outcomes text[] DEFAULT '{}';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requirements text[] DEFAULT '{}';

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Instructors can see enrollments for their courses
CREATE POLICY "Instructors view enrollments for their courses" ON public.enrollments FOR SELECT TO authenticated USING (
  is_instructor_of_course(auth.uid(), course_id)
);

-- Allow all authenticated users to read all profiles (for instructor names, etc.)
DROP POLICY IF EXISTS "Public profiles readable" ON public.profiles;
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
