

# Light Mode + Books + Filter Sidebar + Prices + Auth-based Enroll

## Summary

Switch the entire site from dark theme to a clean **light mode**, add **books** as a new product type alongside courses, add a **filter sidebar** to the catalog page with price/level/category filters, show **prices** on cards, replace WhatsApp CTA with **auth-based enrollment** (sign in to enroll), and use the **uploaded hero image**.

## Phase 1: Light Mode Theme (`src/index.css`)

Replace all dark CSS variables with light ones:
- `--background: 0 0% 98%` (near-white)
- `--foreground: 0 0% 10%` (dark text)
- `--card: 0 0% 100%` (white cards)
- `--card-foreground: 0 0% 10%`
- `--secondary: 0 0% 96%`
- `--muted: 0 0% 94%`, `--muted-foreground: 0 0% 45%`
- `--border: 0 0% 88%`, `--input: 0 0% 88%`
- Keep `--primary` (crimson), `--accent` (gold) unchanged
- Update sidebar vars similarly to light
- Update Navbar from `bg-background/95` transparent dark to light white `bg-white/95`

## Phase 2: Copy Uploaded Hero Image

Copy `user-uploads://Cinematic_wide-angle_hero_202603211215.png` to `src/assets/hero-matsy-main.png` and update `HomePage.tsx` to import and use it.

## Phase 3: Add Books to Data (`src/data/mockData.ts`)

Add a `type` field to the `Course` interface: `type: "course" | "book"`. Existing 3 courses keep `type: "course"`.

Add 2-3 books:
- **Book 1**: "HSE Safety Manual" / "Manuel de Sécurité HSE" / "دليل السلامة والصحة المهنية" — price: 2500 DZD
- **Book 2**: "Hajj & Umrah Complete Guide" / "Guide Complet Hajj et Omra" / "الدليل الشامل للحج والعمرة" — price: 1800 DZD
- **Book 3**: "Workplace Inspection Handbook" / "Manuel d'Inspection" / "كتاب التفتيش المهني" — price: 2000 DZD

Set real prices on courses too (e.g., 15000 DZD, 20000 DZD, 12000 DZD) since user wants prices shown.

Add a new category: `{ name: "Books", name_en: "Books", name_fr: "Livres", name_ar: "كتب" }`.

## Phase 4: Course Card Updates (`src/components/CourseCard.tsx`)

- **Show price**: Display `course.price DZD` instead of "Contact for Price" WhatsApp link
- **Remove WhatsApp CTA**: Replace with "Enroll Now" / "Buy Now" button that links to `/login` if not authenticated, or `/courses/:id` if authenticated
- **Book vs Course visual**: Show a small "📚 Book" or "🎓 Course" type badge
- Keep hover overlay but with price and auth-based CTA

## Phase 5: Catalog Filter Sidebar (`src/pages/CourseCatalog.tsx`)

Replace the simple top filter bar with a **sidebar + grid layout**:

```
┌──────────┬──────────────────────────┐
│ Filters  │  Course/Book Grid        │
│          │                          │
│ Type     │  [Card] [Card] [Card]    │
│ ☐ Course │  [Card] [Card] [Card]    │
│ ☐ Book   │                          │
│          │                          │
│ Category │                          │
│ ☐ HSE    │                          │
│ ☐ Relig. │                          │
│ ☐ Books  │                          │
│          │                          │
│ Price    │                          │
│ [slider] │                          │
│          │                          │
│ Level    │                          │
│ ☐ Begin  │                          │
│ ☐ Inter  │                          │
│ ☐ All    │                          │
└──────────┴──────────────────────────┘
```

- Sidebar: collapsible on mobile (sheet/drawer)
- Filters: type (course/book), category checkboxes, price range, level
- Show result count
- Clear all filters button

## Phase 6: Homepage Updates (`src/pages/HomePage.tsx`)

- Update hero to use the new uploaded image
- Add a "Books" section or include books in the featured products carousel
- Update section title from "Our Courses" to "Our Products" / "منتجاتنا" or keep "Courses & Books"
- Light mode compatible colors (dark text on light bg)

## Phase 7: Navbar Light Mode (`src/components/Navbar.tsx`)

- Scrolled state: `bg-white/95 backdrop-blur-md shadow-sm`
- Logo text: dark instead of light
- Links: dark text with crimson/gold hover

## Phase 8: i18n Updates

Add keys:
- `catalog.type`, `catalog.books`, `catalog.courses`, `catalog.priceRange`, `catalog.level`
- `product.book`, `product.course`, `product.buyNow`
- `currency`: "DZD"

## Files to Create
- Copy hero image to `src/assets/hero-matsy-main.png`

## Files to Modify
- `src/index.css` — light mode CSS variables
- `src/data/mockData.ts` — add `type` field, books, prices
- `src/components/CourseCard.tsx` — prices, auth CTA, type badge
- `src/pages/CourseCatalog.tsx` — filter sidebar layout
- `src/pages/HomePage.tsx` — new hero image, books in featured
- `src/components/Navbar.tsx` — light mode styling
- `src/components/Footer.tsx` — light mode styling
- `src/i18n/en.json`, `fr.json`, `ar.json` — new keys

