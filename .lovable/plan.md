

# EduZone Full-Stack Setup Plan

## Overview

Enable Lovable Cloud (Supabase), create the complete database schema with 18 tables, set up RLS policies with security-definer helper functions, implement auth (email/password + Google OAuth), and build Login/Register pages.

## Phase 1: Enable Lovable Cloud

Enable the Supabase backend via Lovable Cloud to get database, auth, and storage capabilities.

## Phase 2: Database Schema (3 migrations)

### Migration 1 — Enums, base tables, trigger

- Create enums: `app_role` (student, instructor, admin), `course_status` (draft, pending, published), `course_level` (beginner, intermediate, advanced), `lesson_type` (video, text, quiz), `discount_type` (percentage, fixed), `payment_status` (pending, paid, failed)
- Create tables: `profiles`, `user_roles`, `categories`, `courses`, `sections`, `lessons`, `enrollments`, `lesson_progress`, `quizzes`, `quiz_questions`, `quiz_attempts`, `reviews`, `certificates`, `payments`, `coupons`, `notifications`, `wishlists`, `comments`
- Create trigger on `auth.users` to auto-create a profile row and assign default "student" role on signup

### Migration 2 — Security-definer helper functions

- `has_role(uuid, app_role)` — check if user has a specific role
- `is_admin(uuid)` — shorthand for admin check
- `is_instructor_of_course(uuid, uuid)` — check if user owns a course
- `is_enrolled_in_course(uuid, uuid)` — check enrollment status
- `is_course_visible(uuid)` — check if course is published

### Migration 3 — RLS policies

Enable RLS on all tables and create policies following the security architecture:
- **profiles**: users read/update own; admins full access
- **user_roles**: admin-only CRUD
- **categories**: public read; admin write
- **courses**: public read published; instructors CRUD own; admins full
- **sections/lessons**: read if course visible; instructors manage own course's content
- **enrollments/lesson_progress**: students manage own
- **reviews/wishlists/quiz_attempts**: students create/read own
- **payments/certificates/notifications**: appropriate per-role access
- **coupons**: public read active; admin manage
- **comments**: authenticated users on accessible lessons

## Phase 3: Seed Data

Insert the 12 categories from the existing mock data into the `categories` table.

## Phase 4: Auth Context & Supabase Client

- Create `src/integrations/supabase/client.ts` with Supabase client
- Create `src/contexts/AuthContext.tsx` with `useAuth` hook providing: user, profile, roles, loading, signIn, signUp, signOut, signInWithGoogle
- Wrap App with `AuthProvider`
- Create protected route wrapper component

## Phase 5: Login & Register Pages

### `/login` page
- Email + password form with validation (zod + react-hook-form)
- Google OAuth button
- "Remember me" checkbox
- "Forgot password" link
- Link to register page
- Styled consistently with EduZone blue/white theme

### `/register` page
- Name, email, password, confirm password fields
- Role toggle: Student / Instructor
- Form validation
- Google OAuth button
- Link to login page

### `/forgot-password` page
- Email input to request password reset

### `/reset-password` page
- New password + confirm password form
- Handles recovery token from URL

## Phase 6: Update Existing Code

- Update `Navbar.tsx` to show user avatar/name when logged in, with dropdown for dashboard/logout
- Update `App.tsx` with new routes (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- Replace mock data imports in catalog/detail pages with Supabase queries (keep mock data as fallback until courses exist)
- Add `onAuthStateChange` listener in AuthContext

## Technical Details

### Table relationships (key foreign keys)
- `profiles.id` → `auth.users.id` (CASCADE)
- `user_roles.user_id` → `profiles.id` (CASCADE)
- `courses.instructor_id` → `profiles.id`
- `courses.category_id` → `categories.id`
- `sections.course_id` → `courses.id` (CASCADE)
- `lessons.section_id` → `sections.id` (CASCADE)
- `comments.parent_id` → `comments.id` (self-referential)

### Auth flow
- `signUp` creates auth.users row → trigger creates profile + student role
- Role toggle on register sets role via a post-signup insert into `user_roles`
- Google OAuth uses Supabase's built-in provider; trigger handles profile creation

### Files to create/modify
- **New**: `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/ForgotPassword.tsx`, `src/pages/ResetPassword.tsx`, `src/components/ProtectedRoute.tsx`
- **Modified**: `src/App.tsx` (routes + AuthProvider), `src/components/Navbar.tsx` (auth-aware UI)
- **3 Supabase migrations** for schema, functions, and RLS

