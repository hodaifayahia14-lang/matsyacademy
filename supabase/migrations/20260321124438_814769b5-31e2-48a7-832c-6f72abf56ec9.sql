
-- Add multilingual name columns to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_en text NOT NULL DEFAULT '';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_fr text NOT NULL DEFAULT '';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_ar text NOT NULL DEFAULT '';

-- Update existing categories with translations
UPDATE public.categories SET name_en = 'HSE Safety', name_fr = 'Sécurité HSE', name_ar = 'أمن ووقاية' WHERE slug = 'hse-safety';
UPDATE public.categories SET name_en = 'Religious Guidance', name_fr = 'Guide Religieux', name_ar = 'إرشاد ديني' WHERE slug = 'religious-guidance';
UPDATE public.categories SET name_en = 'Certified Training', name_fr = 'Formation Certifiée', name_ar = 'تكوين معتمد' WHERE slug = 'certified-training';
