

# Redesign to Match EduThink Template + Fix All Languages

## Problem Summary

1. **Design mismatch**: Current app uses dark crimson/gold theme. The EduThink template uses a **white/green** clean modern design with `#1D7D57` (forest green) as primary, white backgrounds, and `#222222` dark text.
2. **i18n keys broken**: French and Arabic files use `nav.courses`, `nav.login` etc. but components reference `navbar.courses`, `navbar.login` — so FR/AR translations show fallback English text.
3. **Homepage layout differs**: EduThink has: split hero (text left, people photo right), scrolling marquee stats bar (green), "Learn with 200+" section, "Learning Focused" 3-card section, tabbed courses grid with hover overlay, category cards with green hover, mentor grid, testimonial slider, brand logos marquee.

## Phase 1: Color System Overhaul

Replace the dark crimson/gold CSS variables in `src/index.css` with the EduThink palette:
- `--background`: white `#FFFFFF`
- `--foreground`: dark `#222222`
- `--primary`: green `#1D7D57`
- `--card`: white with subtle border
- `--muted-foreground`: gray `#666666`
- Remove gold/crimson custom utilities, replace with green accents
- Update `tailwind.config.ts`: remove gold/crimson tokens, add `green` tokens
- Typography: keep Inter for body, use a bold serif for hero headings (Cormorant Garamond or similar)

## Phase 2: Homepage Rebuild (`src/pages/HomePage.tsx`)

Rebuild to match EduThink section by section:
1. **Hero**: White bg, left-aligned large serif heading ("Get 2500+ Best Online Courses From Matsy Academy"), subtitle, green "Find Courses" button with arrow, instructor avatar stack. Right side: hero image of people (use EduThink's thumbnail URL or a similar stock photo).
2. **Scrolling stats marquee**: Full-width green bar with star icons + text items (Online Certifications, Top Instructors, 2500+ Online Courses, etc.) scrolling infinitely.
3. **"Learn With 200+" section**: Two-column — image with video play overlay on left, text + bullet points on right.
4. **"Learning Focused on Your Goals"**: 3 image cards (Daily Live Classes, Practice and Revise, Learn Anytime) with descriptions.
5. **"Explore Top Courses"**: Tab filter bar (ALL, categories...), course cards grid with hover effect showing description overlay.
6. **"Courses & Categories"**: 6 category cards with icons, green hover state that fills the card.
7. **"Meet our Mentors"**: Stats sidebar + mentor grid with photos.
8. **Testimonials**: Slider with green accent quote mark, reviewer info.
9. **Brand logos**: Scrolling marquee of partner logos.

## Phase 3: Fix i18n Key Structure

The critical issue: FR and AR json files use `nav.*` keys but components use `navbar.*`. Fix by updating `fr.json` and `ar.json` to match the `en.json` key structure exactly:
- Rename `nav.courses` → `navbar.courses`, `nav.login` → `navbar.login`, etc.
- Rename `categoriesSection.*` → `categories.*`
- Add all missing keys from `en.json` (about, qa, instructions, dashboard sections, catalog, courseDetail, common)
- Update `footer.copyright` to remove "EduZone" references

## Phase 4: Component Updates

- **Navbar**: White bg, clean links in dark text, green hover/active states, green "Contact Us" button with arrow, phone number display. Remove gold/crimson styling.
- **Footer**: Clean white/light bg with green accents, matching EduThink footer style.
- **CourseCard**: White card, image with category badge, title, rating with stars, price with strikethrough old price, student count, lesson count. Hover shows description overlay.
- **LanguageSwitcher**: Keep عربي / EN / FR toggle, style with green.

## Phase 5: Auth & Other Pages

- **Login/Register**: Switch from dark bg to clean white/green theme matching EduThink style.
- **About, QA, Instructions**: Update to white backgrounds with green accents instead of dark theme.
- **CourseCatalog, CourseDetail**: White theme with green filter accents.

## Phase 6: Dashboard Updates

- Sidebar: Switch from dark (#1E1E1E) to white bg with green active states.
- Cards/tables: White backgrounds with green accent borders.
- Keep existing functionality, just restyle colors.

## Files to Modify
- `src/index.css` — complete color overhaul (dark → light/green)
- `tailwind.config.ts` — replace gold/crimson with green tokens
- `src/pages/HomePage.tsx` — full rebuild matching EduThink layout
- `src/components/Navbar.tsx` — white/green clean style
- `src/components/Footer.tsx` — light theme
- `src/components/CourseCard.tsx` — white cards with hover overlay
- `src/i18n/fr.json` — fix ALL keys to match en.json structure
- `src/i18n/ar.json` — fix ALL keys to match en.json structure
- `src/pages/Login.tsx`, `Register.tsx` — green theme
- `src/pages/About.tsx`, `QA.tsx`, `Instructions.tsx` — green theme
- `src/components/DashboardLayout.tsx` — white/green sidebar
- All dashboard pages — restyle to green/white

