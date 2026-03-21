

# EduZone — Full Feature Build Plan

## Overview
Build all three dashboards (Student, Instructor, Admin), set up Google OAuth via Lovable Cloud managed login, and add full i18n support (English, French, Arabic with RTL). Improve overall UI/UX throughout.

## Phase 1: Google OAuth Setup
- Use the **Configure Social Login** tool to set up managed Google OAuth
- Update `Login.tsx` and `Register.tsx` to use `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` instead of `supabase.auth.signInWithOAuth`

## Phase 2: i18n (FR/EN/AR) with RTL Support
- Install `i18next`, `react-i18next`
- Create `src/i18n/` with translation files: `en.json`, `fr.json`, `ar.json`
- Translate all static UI labels (navbar, footer, homepage, course catalog, auth pages, dashboard labels)
- Create a `LanguageSwitcher` component (FR/EN/AR toggle) in Navbar
- Apply `dir="rtl"` on `<html>` when Arabic is selected
- Use Tailwind `rtl:` utilities for spacing/alignment adjustments

## Phase 3: Student Dashboard (`/dashboard/student/*`)
- **Layout**: Sidebar (using shadcn Sidebar) + main content area, wrapped in `ProtectedRoute` with `requiredRole="student"`
- **Sidebar nav**: My Courses, Progress, Certificates, Wishlist, Profile, Settings
- **My Courses**: Fetch from `enrollments` joined with `courses`, show cards with progress bars
- **Progress**: Per-course lesson breakdown with checkmarks from `lesson_progress`
- **Certificates**: Fetch from `certificates`, show downloadable cards (PDF generation via edge function later)
- **Wishlist**: Fetch from `wishlists` joined with `courses`, remove button
- **Profile**: Avatar upload (create `avatars` storage bucket), edit name/bio, change password form
- **Settings**: Dark mode toggle, language preference

## Phase 4: Instructor Dashboard (`/dashboard/instructor/*`)
- **Layout**: Same sidebar pattern, `requiredRole="instructor"`
- **Sidebar nav**: My Courses, Create Course, Students, Analytics, Revenue, Profile
- **My Courses**: Table view with status badges (draft/pending/published), enrolled count, rating, edit/delete actions
- **Create Course**: Multi-step form (6 steps):
  1. Basic info (title, subtitle, category select from DB, level, language, tags)
  2. Cover image upload + promo video URL
  3. Description (rich textarea), learning outcomes (dynamic list), requirements (dynamic list)
  4. Curriculum builder — add sections, add lessons per section (title, type, content, duration), drag-to-reorder
  5. Pricing (free toggle, price input, CPF eligible toggle)
  6. Review & Publish (summary + submit as "pending")
- **Students**: List enrollees per course with progress
- **Analytics**: Charts (enrollments over time, completion rate, avg rating) using recharts
- **Revenue**: Total earnings card, payout history from `payments` table

## Phase 5: Admin Dashboard (`/dashboard/admin/*`)
- **Layout**: Same sidebar pattern, `requiredRole="admin"`
- **Sidebar nav**: Overview, Users, Courses, Categories, Coupons, Settings
- **Overview**: Stats cards (total users, courses, revenue this month, pending approvals), line charts (registrations/week, revenue/month)
- **Users**: Searchable table from `profiles` + `user_roles`, filter by role, ban/activate actions (add `is_active` column to profiles via migration)
- **Courses Moderation**: Pending courses list, approve (set status=published) / reject (set status=draft + feedback)
- **Categories**: CRUD table with icon picker
- **Coupons**: CRUD table with code, discount_type, value, expiry, usage
- **Settings**: Site name, primary color picker (theme), dark mode default

## Phase 6: UI/UX Polish
- Add loading skeletons on all data-fetching pages
- Smooth page transitions with framer-motion
- Consistent card hover effects and shadows
- Mobile-responsive sidebar (collapsible/offcanvas)
- Toast notifications for all CRUD actions
- Empty state illustrations for empty lists

## Database Migration Needed
- Add `is_active boolean DEFAULT true` to `profiles` table (for admin ban/activate)
- Create `avatars` storage bucket with RLS policies
- Add `learning_outcomes text[]` and `requirements text[]` columns to `courses` table (if not present — currently in mock data only)
- Instructors also need SELECT on `enrollments` for their courses (add RLS policy)

## File Structure (new files)
```text
src/i18n/
  index.ts, en.json, fr.json, ar.json
src/components/
  LanguageSwitcher.tsx
  DashboardLayout.tsx
src/pages/dashboard/student/
  StudentDashboard.tsx, MyCourses.tsx, Progress.tsx,
  Certificates.tsx, Wishlist.tsx, Profile.tsx, Settings.tsx
src/pages/dashboard/instructor/
  InstructorDashboard.tsx, InstructorCourses.tsx,
  CreateCourse.tsx, Students.tsx, Analytics.tsx, Revenue.tsx
src/pages/dashboard/admin/
  AdminDashboard.tsx, AdminOverview.tsx, UsersManagement.tsx,
  CoursesModeration.tsx, CategoriesManagement.tsx,
  CouponsManagement.tsx, PlatformSettings.tsx
```

## Technical Notes
- All dashboard routes nested under `/dashboard/*` in App.tsx, each wrapped with `ProtectedRoute`
- Dashboard layouts hide the global Navbar/Footer, using their own sidebar layout
- Google OAuth uses `lovable.auth.signInWithOAuth("google")` — managed by Lovable Cloud, no keys needed
- i18n keys structured as `navbar.courses`, `dashboard.student.myCourses`, etc.
- RTL handled by setting `document.documentElement.dir` and `lang` attribute
- Charts use `recharts` (already common in shadcn projects)

