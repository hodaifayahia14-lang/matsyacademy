

# Implement Figma Design from Stitch Export — Full Redesign with Responsiveness, i18n, and RTL

## Overview
Extract the Stitch Figma export, analyze all page designs, and re-implement every page to match the design pixel-perfectly. Add full responsiveness (desktop/tablet/mobile), complete trilingual support (AR/FR/EN), and proper RTL mirroring — all while keeping existing Supabase functionality intact.

## Step 1: Extract and Analyze the Stitch Design Files
- Extract `stitch_3.zip` to `/tmp/stitch_design/`
- List all pages/folders (e.g., `stitch/maisy_academy_home_page/`, etc.)
- Open each page's HTML to understand the exact layout, colors, spacing, typography, and component structure
- Extract all design assets (images, icons) and copy relevant ones to `src/assets/`

## Step 2: Identify Design Tokens and Update Theme
- Extract exact colors, fonts, spacing, border-radius, shadows from the Stitch CSS
- Update `src/index.css` CSS variables to match the Figma design exactly
- Update `tailwind.config.ts` if custom values are needed
- Ensure Cairo font for Arabic, Playfair Display + Inter for EN/FR

## Step 3: Rebuild Public Pages to Match Design
Restyle each page component to faithfully match the Stitch export:
- **HomePage** — Hero, stats, categories, featured courses, testimonials, CTA, newsletter
- **CourseCatalog** — Grid layout, filters, search
- **CourseDetail** — Course info, curriculum, order form sidebar
- **OrderForm** — Standalone order page
- **About** — Mission, vision, team
- **Blog / BlogDetail** — Article grid, detail layout
- **Contact** — Contact form and info
- **Instructors / InstructorDetail** — Instructor cards and profiles
- **QA** — Q&A listing
- **Instructions** — Step-by-step guide
- **Terms** — Legal text

Each page will use:
- Responsive breakpoints: `lg:` (1280+), `md:` (768+), default (375+)
- Single-column grids on mobile, multi-column on desktop
- Horizontal scroll for tables on mobile

## Step 4: Rebuild Navbar and Footer
- Match Stitch design exactly for desktop and mobile layouts
- Mobile: hamburger menu with drawer/sheet
- Language switcher visible in both Navbar and mobile drawer
- Footer: match column layout, collapse to stacked on mobile

## Step 5: Rebuild Dashboard Layouts
- **Admin Dashboard**: Match sidebar design, collapse to drawer on mobile
- **Agent Dashboard**: Same treatment
- All dashboard pages (Orders, Leaderboard, Users, Courses, etc.) restyled to match
- Tables use horizontal scroll on mobile
- Sidebar collapses to icon mode or drawer depending on design

## Step 6: Complete Multilingual Support
Expand all three translation files (`en.json`, `fr.json`, `ar.json`) to cover:
- All new dashboard labels (Orders, Leaderboard, Agent, Rewards)
- Order form fields and validation messages
- Table headers, chart titles, button labels
- Error messages, success toasts
- Every hardcoded string in every component

## Step 7: RTL Layout Perfection
- Verify every `flex`, `grid`, `padding`, `margin` mirrors correctly in RTL
- Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) instead of `ml-`/`mr-`
- Mirror chevrons, arrows, and directional icons
- Test sidebar position (right side in RTL)
- Test mobile drawer direction

## Step 8: Ensure All Functionality Remains Connected
No functionality changes — only visual. Verify:
- Public order form still inserts into `orders` table
- Admin dashboard CRUD operations work
- Agent order queue and confirmation flow work
- Leaderboard and rewards system work
- Course creation with image upload works
- Language persistence in localStorage works

## Technical Notes
- All design changes are CSS/JSX only — no database or API changes needed
- Existing Supabase queries, RLS policies, and auth flow remain untouched
- The Stitch export serves as **visual reference only** — we rebuild in React/Tailwind, not copy raw HTML
- Assets from the Stitch export (images, icons) will be copied to `src/assets/` as needed

## Files Modified (estimated ~25-30 files)
- `src/index.css` — theme variables
- `tailwind.config.ts` — custom design tokens
- `src/components/Navbar.tsx` — full redesign
- `src/components/Footer.tsx` — full redesign
- `src/components/DashboardLayout.tsx` — responsive sidebar
- `src/components/CourseCard.tsx` — card redesign
- All pages in `src/pages/` — visual overhaul
- All dashboard pages — visual overhaul
- `src/i18n/en.json`, `fr.json`, `ar.json` — complete translations

