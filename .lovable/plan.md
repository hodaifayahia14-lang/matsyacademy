

# Seed Complete Maisy Academy Course Catalog (12 Courses, 4 Categories)

## Overview
Replace existing 3 categories with the 4 real Maisy Academy categories, then seed all 12 courses with trilingual titles, descriptions, cover images, and proper pricing.

## Step 1: Update Categories in Database
Delete old categories and insert the 4 real ones:

| Slug | name_en | name_fr | name_ar |
|------|---------|---------|---------|
| body-care | Body Care | Soins Corporels | العناية الجسدية |
| early-childhood | Early Childhood Education | Éducation de la Petite Enfance | التعليم وتربية الأطفال |
| hse-safety | Workplace Safety (HSE) | Sécurité HSE | الأمن والوقاية |
| religious-guidance | Religious Guidance | Guidage Religieux | الإرشاد الديني |

## Step 2: Insert 12 Courses
Using the existing user profile as `instructor_id`, insert all 12 courses with:
- Trilingual titles (stored in `title` as Arabic primary)
- Descriptions in Arabic
- Cover images from Unsplash (relevant professional photos)
- Prices in DZD (realistic range 5000-25000)
- Proper `category_id` references
- `status: 'published'`, `type: 'course'`
- Learning outcomes, requirements, tags
- Badges info in description field

Courses 4 and 5 (camps/bundles) will have higher prices to reflect bundled value.

## Step 3: Update Navbar Category Links
Update `src/components/Navbar.tsx` category dropdown links to match new category names.

## Step 4: Add Contact Phone Numbers
Add WhatsApp/phone numbers to:
- `src/components/Footer.tsx` — phone section with the 3 numbers
- `src/pages/HomePage.tsx` — contact strip section near bottom
- `src/components/CourseCard.tsx` — small WhatsApp icon linking to primary number

Phone numbers: 0669 79 95 16, 0554 27 59 94, 0799 10 92 95

## Step 5: Update HomePage Hero Text
Update subtitle to reflect all 4 categories instead of just HSE + religious.

## Database Operations
1. Delete existing categories and courses (clean slate for real data)
2. Insert 4 categories
3. Insert 12 courses with cover images

## Files to Modify
- `src/components/Navbar.tsx` — update category links to new names
- `src/components/Footer.tsx` — add phone numbers
- `src/pages/HomePage.tsx` — update hero subtitle, add contact section
- `src/components/CourseCard.tsx` — add WhatsApp link

## Technical Notes
- Existing courses (web dev, 3 books) will be deleted and replaced with real catalog
- All course IDs will be new UUIDs from the database
- The `useCourses` hook already fetches from DB so storefront will auto-update
- Category filter in CourseCatalog already reads from DB categories

