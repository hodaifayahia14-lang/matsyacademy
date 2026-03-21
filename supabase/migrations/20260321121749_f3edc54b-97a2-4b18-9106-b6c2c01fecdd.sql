
-- Allow admins to also insert courses
DROP POLICY IF EXISTS "Instructors create courses" ON public.courses;
CREATE POLICY "Instructors and admins create courses"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (
  (instructor_id = auth.uid() AND has_role(auth.uid(), 'instructor'::app_role))
  OR is_admin(auth.uid())
);
