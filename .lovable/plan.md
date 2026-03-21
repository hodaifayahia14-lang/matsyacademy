

# Cinematic Homepage Redesign — Dark/Gold/Crimson Premium Theme

## Overview
Complete homepage redesign from the current white/green layout to a premium dark cinematic theme using Crimson `#9B1C2E`, Gold `#C9971C`, Light Gold `#E8B84B`, Dark BG `#1E1E1E`. Also enhance the Navbar to match.

## Phase 1: Color System + CSS (`src/index.css`, `tailwind.config.ts`)

Update CSS variables for a dark-first theme:
- `--background`: `#1E1E1E` (dark)
- `--foreground`: `0 0% 95%` (off-white text)
- `--primary`: crimson `350 70% 38%` (#9B1C2E)
- `--card`: `0 0% 14%` (dark card)
- `--secondary`: `0 0% 18%`
- `--muted-foreground`: `0 0% 60%`
- Add `--gold: 42 72% 45%`, `--gold-light: 40 76% 60%` (already exist, just wire them up)
- Add CSS keyframes: `@keyframes shimmer` (for CTA glint), `@keyframes float-particle`, `@keyframes bounce-arrow`, `@keyframes count-up` (number counter stagger)
- Add `@keyframes scroll-left` fix (already in tailwind config but ensure CSS is consistent)
- Add `@media (prefers-reduced-motion: reduce)` block to disable all animations

Add to `tailwind.config.ts`:
- `gold` and `crimson` color tokens referencing CSS vars
- New keyframes: `shimmer`, `bounce`, `float`
- New animations: `shimmer`, `bounce-gentle`, `float`

## Phase 2: Generate Hero Image

Use the Lovable AI image generation (google/gemini-3.1-flash-image-preview) via an edge function to create a cinematic hero image combining:
- Mecca/Kaaba pilgrims in the background
- HSE safety elements (helmets, industrial)
- Dark, moody, professional tone with warm gold lighting
- Save as `src/assets/hero-cinematic.jpg`

## Phase 3: Navbar Enhancement (`src/components/Navbar.tsx`)

- Dark transparent header: `bg-[#1E1E1E]/90 backdrop-blur-md`
- Logo: "Matsy" in gold, "Academy" in white
- Nav links: white text, gold hover/active underline
- Phone number in gold
- Login button: ghost white, SignUp: filled crimson with gold border, scale-up hover glow
- Mobile menu: dark bg matching `#1E1E1E`

## Phase 4: Full Homepage Rebuild (`src/pages/HomePage.tsx`)

### Section 1: Hero
- Full-viewport height dark section with cinematic background image (dark overlay 50%)
- Animated logo: fade-in + scale-up (framer-motion, 0.8s ease-out)
- Headline: large gold text, staggered word-by-word reveal (slide-up + fade)
- Subtitle: fade-in with 0.3s delay
- Two CTA buttons: "سجّل الآن" (crimson filled, gold border, glow hover) + "استعرض الدورات" (transparent, gold border, fill on hover)
- Floating scroll-down arrow with bounce animation
- Subtle radial gradient pulse in background

### Section 2: Stats Bar
- Full-width dark strip (`#1E1E1E` slightly lighter)
- 4 stats with gold icons (Users, BookOpen, Shield, Award)
- Animated number counters using Intersection Observer (count up once)
- Gold dividers between stats

### Section 3: Featured Courses
- Gold underline accent on title, animated draw-in on scroll
- Course cards on dark card bg, gold border glow on hover, translateY(-6px) lift
- Crimson category ribbon (top-left)
- "سجّل الآن" button slides up on hover
- Skeleton loader placeholders

### Section 4: Testimonials
- Dark bg with large decorative gold quotation marks
- Auto-playing slider (4s interval, fade transition) instead of scrolling columns
- Gold ring around avatars, gold star fill animation
- Dot indicators in gold

### Section 5: Why Choose Us (NEW)
- Alternating left/right layout with scroll-triggered slide-in
- 4 value props: Certified, Flexible, Recognized Certificate, Ongoing Support
- Gold icons, 0.15s stagger delay

### Section 6: CTA Banner (NEW, before footer)
- Full-width crimson section with gold decorative pattern overlay
- Bold white heading, light gold subtext
- Large gold CTA button with shimmer/glint animation loop

### Section 7: Newsletter
- Restyle with dark theme, gold accents

## Phase 5: Testimonials Component Update (`src/components/ui/testimonials-columns.tsx`)

Replace scrolling columns with a fade-transition auto-playing slider for the new design. Single testimonial card visible at a time, dots below, auto-advance every 4s.

## Phase 6: i18n Keys

Add to all 3 JSON files:
- `hero.mainTitle`, `hero.subtitle`, `hero.enrollNow`, `hero.browseCourses`
- `whyChoose.title`, `whyChoose.certified`, `whyChoose.flexible`, `whyChoose.certificate`, `whyChoose.support`
- `cta.title`, `cta.subtitle`, `cta.button`

## Animation & UX Rules
- All animations use framer-motion with `whileInView` + `viewport={{ once: true }}`
- `ease-out` curves only
- `prefers-reduced-motion` CSS media query disables all keyframe animations
- RTL: framer-motion `x` values flip via `i18n.dir()` check
- Fixed aspect-ratio containers for images (no CLS)
- Mobile-first: single column on 375px, responsive grid scaling

## Files Summary
- **Create**: `src/assets/hero-cinematic.jpg` (AI-generated), edge function for image gen
- **Modify**: `src/index.css`, `tailwind.config.ts`, `src/pages/HomePage.tsx` (full rewrite), `src/components/Navbar.tsx`, `src/components/ui/testimonials-columns.tsx`, `src/i18n/en.json`, `src/i18n/fr.json`, `src/i18n/ar.json`

