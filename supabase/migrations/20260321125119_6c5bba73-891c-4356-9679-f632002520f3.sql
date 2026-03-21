
-- Create cart_items table
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own cart" ON public.cart_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users add to cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users remove from cart" ON public.cart_items FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Create book-files storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('book-files', 'book-files', false);

CREATE POLICY "Authenticated users upload book files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-files');
CREATE POLICY "Authenticated users read book files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'book-files');
CREATE POLICY "Admins delete book files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-files' AND public.is_admin(auth.uid()));
