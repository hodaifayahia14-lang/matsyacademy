

# Fix Categories, Seed Blog/Q&A, Fix Hero Section

## 1. Remove Extra Categories from mockData

`src/data/mockData.ts` — Remove "Certified Training" and "Books" from `mockCategories`. Keep only:
- HSE Safety / أمن ووقاية
- Religious Guidance / إرشاد ديني
- Certified Training / تكوين معتمد (keep — matches the screenshot)

Remove "Books" category. The screenshot shows 3 categories: أمن ووقاية, إرشاد ديني, تكوين معتمد. Keep those 3 only.

Update `CourseCatalog.tsx` filter panel to use only `mockCategories` from data (already does). The "Type" filter (course/book) already handles book filtering separately.

## 2. Seed Blog Posts via Migration

Insert 4 blog posts into `blog_posts` table with `status='published'`:
1. HSE topic: "أهمية السلامة المهنية في المؤسسات" / "L'importance de la sécurité HSE" / "Importance of Workplace Safety"
2. Religious: "كيف تصبح مرشد حج محترف" / "Devenir guide Hajj professionnel" / "How to Become a Professional Hajj Guide"
3. HSE: "معدات الحماية الشخصية: دليل شامل" / "Guide complet des EPI" / "Complete PPE Guide"
4. General: "التكوين المعتمد: مفتاح النجاح المهني" / "Formation certifiée: clé du succès" / "Certified Training: Key to Career Success"

## 3. Seed Q&A Questions via Migration

Since `qa_questions.user_id` is NOT NULL, we need a user. We'll create a seeder edge function OR use a migration that references an existing test user. Safer: use an edge function with service role to find test users and insert.

Create `supabase/functions/seed-content/index.ts`:
- Finds existing users (or uses first available)
- Inserts 6 Q&A questions related to HSE and Hajj categories
- Inserts 2-3 answers per question
- Idempotent (checks if data exists first)

## 4. Fix Hero Section

**Fix "استعرض المنتجات" button**: Currently uses `variant="outline"` with `border-white/40 text-white` — the white background issue is likely from the outline variant's default `bg-background`. Fix by adding `bg-transparent` or `bg-white/10`.

**Hero carousel**: Replace single static hero image with a carousel of 3 images (one per category theme):
- Image 1: HSE/Safety themed (hard hat, PPE) — Unsplash `photo-1504307651254-35680f356dfd`
- Image 2: Hajj/Mecca themed — Unsplash `photo-1591604129939-f1efa4d9f7fa`
- Image 3: Education/graduation themed — use the existing uploaded hero image

Auto-scroll left-to-right every 5s with smooth fade transition. Add padding around images. Use framer-motion for transitions.

## Files to Modify
- `src/data/mockData.ts` — remove "Books" category, keep 3 real ones
- `src/pages/HomePage.tsx` — hero carousel with 3 images, fix button bg, add padding
- `src/pages/CourseCatalog.tsx` — no changes needed (already reads from mockCategories)

## Files to Create
- `supabase/functions/seed-content/index.ts` — seed blog + Q&A data

## Database Migration
- Insert 4 blog posts directly (no user_id required, it's nullable)

