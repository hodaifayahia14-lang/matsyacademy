
-- First update any courses referencing old categories to NULL
UPDATE public.courses SET category_id = NULL WHERE category_id IS NOT NULL;

-- Delete all existing generic categories
DELETE FROM public.categories;

-- Insert the 3 real categories
INSERT INTO public.categories (name, slug, icon) VALUES
  ('HSE Safety', 'hse-safety', 'Shield'),
  ('Religious Guidance', 'religious-guidance', 'BookOpen'),
  ('Certified Training', 'certified-training', 'Award');
