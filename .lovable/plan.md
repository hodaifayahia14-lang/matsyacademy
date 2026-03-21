

# Replace All Placeholder Content with Real Matsy Academy Data

## Overview
Replace all 21 generic placeholder courses, images, categories, and stats with the 3 real Matsy Academy courses (HSE Safety Agent, HSE Safety Inspector, Hajj & Umrah Guide), relevant Unsplash images, real categories, and accurate stats. Add WhatsApp contact-for-price and trilingual course data.

## Phase 1: Rewrite `src/data/mockData.ts`

Replace the entire mock data file:
- **3 real courses** with trilingual titles/descriptions stored as properties (`title_en`, `title_fr`, `title_ar`, etc.)
- **Course interface** updated to include `title_en`, `title_fr`, `title_ar`, `description_en`, `description_fr`, `description_ar`, `badge`, `format`
- **Cover images** from Unsplash:
  - Course 1 (HSE Agent): `photo-1504307651254-35680f356dfd` (safety helmet/PPE)
  - Course 2 (HSE Inspector): `photo-1581092160607-ee22621dd758` (industrial safety)
  - Course 3 (Hajj Guide): `photo-1591604129939-f1efa4d9f7fa` (Kaaba/Mecca)
- **Hero image**: `photo-1523050854058-8df90110c9f1` (graduation ceremony)
- **Categories** replaced with: All, HSE Safety, Religious Guidance, Certified Training, Special Offers
- **mockCategories** reduced to 4 real categories with appropriate icons
- **mockReviews** updated with Arabic-sounding names and relevant comments
- **Instructors** data updated for Matsy Academy context

## Phase 2: Update `src/components/CourseCard.tsx`

- Use `i18n.language` to pick the correct `title_xx` and `description_xx` from course data
- Replace price display with "Contact for Price" / "اتصل بنا للسعر" / "Contactez-nous" + WhatsApp link to `+213554275994`
- Show course `badge` (🔥 Promo, ⭐ Popular, 🎁 Bonus) as a ribbon on the card
- Show `format` tag ("Online" / "عن بعد" / "En ligne")
- CTA button: "Enroll Now" / "سجّل الآن" / "S'inscrire"

## Phase 3: Update `src/pages/HomePage.tsx`

- **Hero**: Update image to graduation/education themed Unsplash photo, change stats to "500+" students, "3" courses
- **Stats section**: `+500 Students`, `3 Certified Courses`, `2 Specialization Fields`, `Accredited` — all translatable
- **Marquee**: Replace items with Matsy-relevant: "⭐ Certified Training", "⭐ HSE Courses", "⭐ Hajj & Umrah Guide", etc.
- **Featured courses**: Show all 3 real courses
- **Categories section**: Show 4 real categories (HSE, Religious Guidance, Certified Training, Special Offers)
- **Learning Focused cards**: Replace eduthink images with relevant Unsplash (safety training, religious guidance, online learning)
- **Mentors section**: Update with Matsy Academy team
- **Testimonials**: Arabic-sounding names with relevant feedback

## Phase 4: Update `src/pages/About.tsx`

- Replace stats: +500 students, 3 certified courses, 2 specialization fields
- Add "Accredited by Ministry of Vocational Training" badge
- All stats translatable via i18n keys

## Phase 5: Update `src/pages/CourseCatalog.tsx`

- Replace category filter options with: All, HSE Safety, Religious Guidance, Certified Training, Special Offers
- Remove language/price/sort filters that don't apply (only 3 courses)
- Simplify since there are only 3 courses

## Phase 6: Update `src/pages/CourseDetail.tsx`

- Read trilingual title/description from course data based on active language
- Replace price section with WhatsApp contact button
- Show course badge and format

## Phase 7: Update `src/pages/Instructors.tsx`

- Replace eduthink mentor images with professional avatars or Unsplash photos of Arab educators

## Phase 8: i18n Updates (`en.json`, `fr.json`, `ar.json`)

Add/update keys:
- `courses.contactPrice` / `courses.enrollNow` / `courses.format.online`
- `categories.hse`, `categories.religious`, `categories.certified`, `categories.offers`
- `stats.students`: "+500 Enrolled Students" / "+500 طالب مسجّل" / "+500 Étudiants inscrits"
- `stats.courses`: "3 Certified Courses" / "3 دورات معتمدة" / "3 Formations certifiées"
- `stats.fields`: "2 Specialization Fields" / etc.
- `stats.accredited`: accreditation text in all 3 languages
- `hero.title` updated to reference Matsy Academy real offering
- Course badge translations

## Files to Modify
- `src/data/mockData.ts` — complete rewrite with 3 real courses
- `src/components/CourseCard.tsx` — trilingual titles, WhatsApp CTA, badges
- `src/pages/HomePage.tsx` — real images, stats, categories, courses
- `src/pages/About.tsx` — real stats
- `src/pages/CourseCatalog.tsx` — real category filters
- `src/pages/CourseDetail.tsx` — trilingual content, WhatsApp pricing
- `src/pages/Instructors.tsx` — replace eduthink images
- `src/i18n/en.json`, `fr.json`, `ar.json` — new keys for real content

