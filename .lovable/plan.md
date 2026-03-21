

# Hero Image Generation + Testimonials Upgrade + UI Polish

## What's Changing

1. **Hero image**: Use AI image generation (Nano banana) to create a custom Matsy Academy hero image — professional education/graduation themed with dark tones matching the brand
2. **Instructor avatars**: Replace dicebear cartoon SVGs with realistic professional photo URLs from randomuser.me (diverse, professional-looking)
3. **Course category dropdown**: Fix the filter tabs in "Explore Top Courses" section — currently showing raw English category names from mockData. Make them trilingual using `getLocalized` on mockCategories
4. **Testimonials section**: Replace the single-card slider with the `TestimonialsColumn` scrolling columns component (3 columns of testimonials auto-scrolling vertically, like the provided shadcn component)
5. **Expand testimonials data**: Add 9 testimonials (from 3) with realistic names, randomuser.me photos, and trilingual text

## Technical Details

### File: `src/components/ui/testimonials-columns.tsx` (NEW)
- Create the `TestimonialsColumn` component adapted from the provided code
- Uses `framer-motion` (already installed, no need for `motion` package — adapt imports from `motion/react` to `framer-motion`)
- Auto-scrolling vertical columns with `@keyframes` CSS animation

### File: `src/pages/HomePage.tsx`
- **Hero**: Create an edge function to generate image via AI, OR use a high-quality Unsplash photo of professional Arab/Algerian education setting. For speed, use a curated Unsplash photo: `photo-1541339907198-e08756dedf3f` (graduation celebration, dark)
- **Testimonials section** (~lines 372-401): Replace single-card slider with 3-column `TestimonialsColumn` layout. 9 testimonials split into 3 columns, all trilingual
- **Course filter tabs** (~lines 261-269): Use `getLocalized(cat, "name", lang)` instead of raw `cat` name. Need to pass full category objects instead of just name strings
- **Mentor avatars** (~lines 72-77): Replace dicebear URLs with `randomuser.me/api/portraits/men/X.jpg` and `women/X.jpg`
- **Testimonial avatars**: Same — use randomuser.me

### File: `src/pages/Instructors.tsx`
- Replace all `dicebear` avatar URLs with professional `randomuser.me` photos

### File: `src/data/mockData.ts`
- Add `name_en`, `name_fr`, `name_ar` to mockCategories for proper trilingual filter rendering

### File: `src/index.css`
- Add `@keyframes scroll-up` for testimonials column animation

## Files Summary
- **Create**: `src/components/ui/testimonials-columns.tsx`
- **Modify**: `src/pages/HomePage.tsx`, `src/pages/Instructors.tsx`, `src/data/mockData.ts`, `src/index.css`

