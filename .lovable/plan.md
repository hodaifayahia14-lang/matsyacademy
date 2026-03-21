

# Comprehensive UX Enhancement: Course Creation, Ratings, Logo, Dashboard Redirect & Homepage

## Overview
Enhance the course creation flow for instructors/admins, add course ratings/comments for signed-in users, redirect to dashboard after login, add the company logo everywhere, create instructor detail pages, and add new homepage sections.

## Phase 1: Copy Logo Asset
Copy `user-uploads://311124902_497028412274741_7980291339042252149_n.jpg` to `src/assets/matsy-logo.png`. Use it in Navbar, Footer, Login/Register pages, and About page.

## Phase 2: Enhanced Course Creation Flow (`src/pages/dashboard/instructor/CreateCourse.tsx`)
Complete redesign of the 6-step wizard into a polished, intuitive experience:

- **Step labels**: Show descriptive names ("Basic Info", "Media", "Description", "Curriculum", "Pricing", "Review") instead of "step1-6"
- **Progress bar**: Replace numbered circles with a visual progress bar showing step names
- **Step 1 — Basic Info**: Add description helper text, better placeholders
- **Step 2 — Media**: Add image preview when URL is entered, drag-drop zone styling, file upload to Supabase Storage (not just URL)
- **Step 3 — Description**: Add character count, richer layout for outcomes/requirements with drag-to-reorder
- **Step 4 — Curriculum**: Add drag handle icons, lesson content field (URL for video, text for text), collapsible sections
- **Step 5 — Pricing**: Show price in DZD, add discount/original price fields, coupon code input
- **Step 6 — Review**: Full visual preview card showing how course will look, with all details summarized beautifully
- **Validation**: Prevent advancing to next step if required fields are empty (title, description, at least 1 section)
- **Auto-save**: Toast confirmation with "Draft auto-saved" as user progresses

## Phase 3: Admin Course Creation
- Add a "Create Course" button and route in `AdminDashboard.tsx` → reuse `CreateCourse` component
- In `CoursesModeration.tsx`, add a "Create Course/Book" button that navigates to a create form
- Admin bypasses the "pending" status — can publish directly

## Phase 4: Instructor Profile Page (Public)
- **Create** `src/pages/InstructorDetail.tsx` — public page at `/instructors/:id`
- Shows instructor's avatar, name, bio, courses they teach, student count, rating
- Fetches from `profiles` table + `courses` where `instructor_id` matches
- Link from `Instructors.tsx` cards and from course detail instructor tab

## Phase 5: Instructor Dashboard Profile Enhancement
- **Modify** `src/pages/dashboard/instructor/Profile.tsx`
- Add fields: phone, specialization, social links (LinkedIn, Twitter), years of experience, certifications
- These need new columns in `profiles` table OR a separate `instructor_profiles` table

**Database migration**: Add columns to `profiles`: `phone text`, `specialization text`, `social_links jsonb DEFAULT '{}'`, `years_experience int DEFAULT 0`

## Phase 6: Course Ratings & Comments for Signed-in Users
- **Modify** `src/pages/CourseDetail.tsx` — add a "Reviews" tab that:
  - Shows existing reviews from `reviews` table
  - If user is signed in and enrolled, shows a form to rate (1-5 stars) + comment
  - Inserts into `reviews` table (RLS already allows students to create)
- Add star rating component with click-to-rate interaction

## Phase 7: Redirect to Dashboard After Login
- **Modify** `src/pages/Login.tsx` — change `from` default from `/` to the user's dashboard based on roles
- After successful login, fetch roles then navigate to `/dashboard/student`, `/dashboard/instructor`, or `/dashboard/admin`
- Same for `Register.tsx` — after signup confirmation, redirect to dashboard

## Phase 8: Logo Everywhere
- **Navbar**: Replace text "Matsy" with logo image (32px height) + text
- **Footer**: Add logo
- **Login/Register pages**: Show logo above the form
- **About page**: Show logo in hero section

## Phase 9: New Homepage Sections
Add 2 new sections to `HomePage.tsx`:

**"How It Works" section** (between stats and courses):
- 3-step visual: 1) Browse Courses → 2) Enroll & Learn → 3) Get Certified
- Icons + connecting arrows, animated on scroll

**"Comparison Table — Why Choose Us"** (after Why Choose Us cards):
- Table comparing Matsy Academy vs. Others
- Rows: Ministry Certified ✅/❌, Flexible Schedule ✅/❌, Arabic Content ✅/❌, Recognized Certificate ✅/❌, Affordable Pricing ✅/❌
- Styled with gold checkmarks and crimson crosses

## Phase 10: About Page Enhancement
- Add logo in hero section
- Add "How It Works" process steps
- Replace team avatars with more professional ones (higher quality randomuser IDs)
- Add a "Partners & Accreditations" section

## Files to Create
- `src/assets/matsy-logo.png` (copied from upload)
- `src/pages/InstructorDetail.tsx` — public instructor profile

## Files to Modify
- `src/pages/dashboard/instructor/CreateCourse.tsx` — complete UX redesign
- `src/pages/dashboard/instructor/Profile.tsx` — add more fields
- `src/pages/dashboard/instructor/InstructorDashboard.tsx` — no changes needed
- `src/pages/dashboard/admin/AdminDashboard.tsx` — add create course route
- `src/pages/dashboard/admin/CoursesModeration.tsx` — add create button
- `src/pages/CourseDetail.tsx` — add ratings/comments form
- `src/pages/Login.tsx` — redirect to dashboard after login
- `src/pages/Register.tsx` — redirect to dashboard after signup
- `src/pages/HomePage.tsx` — add "How It Works" + comparison table sections
- `src/pages/About.tsx` — logo + enhanced design
- `src/pages/Instructors.tsx` — link cards to `/instructors/:id`
- `src/components/Navbar.tsx` — add logo image
- `src/components/Footer.tsx` — add logo image
- `src/App.tsx` — add `/instructors/:id` route

## Database Migration
- Add columns to `profiles`: `phone`, `specialization`, `social_links`, `years_experience`

