
-- Blog posts table with trilingual fields
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  excerpt_fr text NOT NULL DEFAULT '',
  excerpt_ar text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_fr text NOT NULL DEFAULT '',
  content_ar text NOT NULL DEFAULT '',
  cover_image text
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts public read"
ON public.blog_posts FOR SELECT
USING (status = 'published' OR is_admin(auth.uid()));

CREATE POLICY "Admins manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Site content table for editable page content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value_en text NOT NULL DEFAULT '',
  value_fr text NOT NULL DEFAULT '',
  value_ar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content public read"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins manage site content"
ON public.site_content FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
