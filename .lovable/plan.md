

# Matsy Academy — Complete Rebrand & Enhancement Plan

## Overview
Rebrand the entire EduZone LMS to "Matsy Academy" (أكاديمية مايسي للتدريب و التطوير) with a luxurious dark crimson/gold design system, new public pages (About, Q&A, Instructions), and polished dashboard UI.

## Phase 1: Design System — Colors, Typography, CSS Variables

Update `src/index.css` and `tailwind.config.ts`:

**New CSS variables (light = default theme is the dark-luxury look):**
- `--primary`: crimson #9B1C2E
- `--primary-gold`: #C9971C
- `--gold-light`: #E8B84B
- `--background`: #1E1E1E (dark by default for public pages)
- `--bg-light`: #F9F5EE (warm white sections)
- `--card`: #2A2A2A
- `--foreground`: #F5F0E8 (off-white)
- `--text-on-light`: #1E1E1E

**Typography:**
- Import Playfair Display (headings), Inter (body), Cairo (Arabic body)
- `font-display: Playfair Display` for headings
- `font-arabic: Cairo` applied when `lang="ar"`

**Tailwind extend:**
- Add `crimson`, `gold`, `gold-light` color tokens
- Add `bg-matsy-dark`, `bg-matsy-light` utilities

## Phase 2: Rebrand All Components

### Navbar (`src/components/Navbar.tsx`)
- Dark bg (#1E1E1E), gold logo text, crimson accent on active links
- Replace "EduZone" with "Matsy Academy" / "أكاديمية مايسي" based on language
- Language switcher shows: عربي / EN / FR
- Gold icons, crimson hover states

### Footer (`src/components/Footer.tsx`)
- Dark bg, gold logo, soft gold links, crimson social icons
- Update copyright to "Matsy Academy"

### DashboardLayout (`src/components/DashboardLayout.tsx`)
- Dark sidebar (#1E1E1E), gold icons/text, crimson active state
- Gold notification bell, dark top navbar
- Alternating row colors in tables (#1E1E1E / #252525)

### Login/Register pages
- Dark background, centered gold logo, crimson buttons with gold border
- Update all "EduZone" references

### HomePage (`src/pages/HomePage.tsx`)
- Dark hero with gold heading, crimson CTA buttons
- Featured courses: infinite auto-scrolling carousel, dark cards with gold borders
- Testimonials: dark bg, gold quotation marks, auto-playing slider
- Stats: gold numbers on dark background
- Newsletter: dark section, gold accents

## Phase 3: New Public Pages

### About Us (`/about`)
- Mission/vision on warm white (#F9F5EE) with gold dividers
- Team cards with gold names, crimson role badges
- Stats strip (dark bg, gold numbers)

### Q&A Page (`/qa`)
- Public questions with upvote (gold), answered badge (crimson)
- Filter: unanswered, popular, recent
- Requires new `qa_questions` and `qa_answers` tables (migration)

### Instructions Page (`/instructions`)
- Gold numbered steps, expandable panels (crimson left border, dark bg)
- Per-user read history and completion tracking
- Requires new `instructions` and `instruction_progress` tables (migration)

## Phase 4: i18n Updates

Update all three translation files (`en.json`, `fr.json`, `ar.json`):
- Replace "EduZone" → "Matsy Academy" / "أكاديمية مايسي"
- Add keys for About, Q&A, Instructions pages
- Add keys for new nav items

## Phase 5: Database Migrations

### Migration 1: New tables for Q&A and Instructions
```sql
-- Q&A
CREATE TABLE qa_questions (id uuid PK, user_id uuid, course_id uuid NULL, title text, body text, upvotes int DEFAULT 0, is_answered boolean DEFAULT false, created_at timestamptz);
CREATE TABLE qa_answers (id uuid PK, question_id uuid FK, user_id uuid, body text, is_accepted boolean DEFAULT false, created_at timestamptz);

-- Instructions
CREATE TABLE instructions (id uuid PK, title_en text, title_fr text, title_ar text, body_en text, body_fr text, body_ar text, order int, created_at timestamptz);
CREATE TABLE instruction_progress (id uuid PK, user_id uuid, instruction_id uuid FK, completed boolean DEFAULT false, read_at timestamptz);
```

### Migration 2: RLS policies
- Q&A: public read, authenticated create, own update/delete
- Instructions: public read, admin manage
- Instruction progress: users manage own

## Phase 6: Dashboard UI Polish

All three dashboards get the Matsy treatment:
- Dark metric cards (#2A2A2A) with gold border-top accent
- Gold labels, white numbers
- Tables: alternating dark rows, gold headers, crimson action buttons
- Skeleton loaders in dark tones
- Breadcrumb navigation in soft gold
- Charts use crimson and gold color scheme

## Phase 7: RTL & Responsive Polish

- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`)
- Ensure sidebar flips in RTL
- Test all new pages at mobile breakpoints
- Collapsible sidebar animation on mobile

## Files to Create
- `src/pages/About.tsx`
- `src/pages/QA.tsx`
- `src/pages/Instructions.tsx`

## Files to Modify
- `src/index.css` — complete color/typography overhaul
- `tailwind.config.ts` — new color tokens, fonts
- `src/components/Navbar.tsx` — dark theme, rebrand
- `src/components/Footer.tsx` — dark theme, rebrand
- `src/components/DashboardLayout.tsx` — dark sidebar theme
- `src/pages/HomePage.tsx` — dark luxury redesign
- `src/pages/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx` — rebrand
- `src/pages/CourseCatalog.tsx`, `CourseDetail.tsx` — new color scheme
- All dashboard pages (student/instructor/admin) — dark luxury UI
- `src/i18n/en.json`, `fr.json`, `ar.json` — rebrand + new page keys
- `src/App.tsx` — add About, Q&A, Instructions routes
- `src/components/CourseCard.tsx` — dark card styling

