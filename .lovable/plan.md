

# Comprehensive Admin Dashboard + UI/UX Fixes + Content Management

## Overview
Fix RTL sidebar, enhance admin dashboard to a full-featured CMS, add blog management, Q&A moderation, About content management, and fix course enrollment flow.

## Phase 1: Fix RTL Sidebar in Dashboard

**File: `src/components/DashboardLayout.tsx`**
- Detect `dir` from `i18n` and apply `side="right"` on `Sidebar` when RTL
- The shadcn Sidebar component uses `border-e` (logical) which is correct, but the sidebar itself renders on the left by default. Add `side={isRTL ? "right" : "left"}` prop

**File: `src/components/ui/sidebar.tsx`**
- Verify the `Sidebar` component supports a `side` prop — it does (shadcn default). Ensure it's wired through.

## Phase 2: Fix Course Card — Remove WhatsApp, Use Auth Flow

**File: `src/components/CourseCard.tsx`**
- The `handleEnroll` already navigates to `/login` for unauthenticated users — this is correct. Verify no WhatsApp links remain anywhere. The current code looks clean. Check `CourseDetail.tsx` for any remaining WhatsApp links.

**File: `src/pages/CourseDetail.tsx`**
- Replace any WhatsApp CTA with auth-based enrollment button (navigate to `/login` if not signed in).

## Phase 3: Enhanced Admin Dashboard — Full CMS

### New sidebar items (AdminDashboard.tsx):
Add 4 new routes:
- `/dashboard/admin/qa` — Q&A Moderation
- `/dashboard/admin/blogs` — Blog Management (CRUD)
- `/dashboard/admin/about` — About Page Content
- `/dashboard/admin/enrollments` — Enrollment & Revenue tracking

### New Admin Pages:

**`src/pages/dashboard/admin/QAModeration.tsx`** (NEW)
- View all questions, delete inappropriate ones, mark as answered
- View and moderate answers, accept best answers
- Search and filter by status

**`src/pages/dashboard/admin/BlogManagement.tsx`** (NEW)
- Database migration: create `blog_posts` table (id, title, excerpt, content, cover_image, author_id, status, published_at, created_at)
- CRUD for blog posts with rich text editing (textarea for now)
- Publish/unpublish toggle
- Admin-only RLS policies

**`src/pages/dashboard/admin/AboutManagement.tsx`** (NEW)
- Edit about page content stored in a `site_content` table (key-value pairs for mission, vision, team, stats)
- Database migration: create `site_content` table (id, key, value_en, value_fr, value_ar)
- Admin can update mission text, vision text, stats numbers, team members

**`src/pages/dashboard/admin/EnrollmentsDashboard.tsx`** (NEW)
- View all enrollments with student name, course, date, progress
- Revenue summary from payments table
- Charts/stats for enrollment trends

### Enhance Existing Admin Pages:

**`src/pages/dashboard/admin/AdminOverview.tsx`**
- Add recent enrollments list, recent Q&A activity, pending courses count
- Add quick-action cards (Approve Courses, View Users, Manage Blogs)
- Better card design with colored backgrounds and trends
- Show revenue in DZD not USD

**`src/pages/dashboard/admin/CoursesModeration.tsx`**
- Show ALL courses (not just pending) with tabs: All / Pending / Published / Draft
- Add ability to edit course details, change status, delete courses
- Add course creation (admin can add courses/books directly)
- Show price, category, student count per course

**`src/pages/dashboard/admin/UsersManagement.tsx`**
- Add role assignment (promote student to instructor, assign admin)
- Add user detail view
- Better table with avatars

## Phase 4: Blog System (Database-Backed)

**Database Migration:**
```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  title_ar text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  excerpt_fr text NOT NULL DEFAULT '',
  excerpt_ar text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_fr text NOT NULL DEFAULT '',
  content_ar text NOT NULL DEFAULT '',
  cover_image text
);
-- RLS: public read published, admin full access
```

**Update `src/pages/Blog.tsx`** — fetch from `blog_posts` table instead of hardcoded array
**Update `src/pages/BlogDetail.tsx`** — fetch single post from DB

## Phase 5: Update About Page to Use DB Content

**`src/pages/About.tsx`** — optionally fetch from `site_content` table, fallback to current hardcoded content.

## Phase 6: i18n Updates

Add keys for new admin sections:
- `dashboard.admin.qa`, `dashboard.admin.blogs`, `dashboard.admin.about`, `dashboard.admin.enrollments`
- `dashboard.admin.allCourses`, `dashboard.admin.published`, `dashboard.admin.draft`
- Blog management keys

## Database Migrations Summary
1. `blog_posts` table with trilingual fields + RLS
2. `site_content` table for editable page content + RLS

## Files to Create
- `src/pages/dashboard/admin/QAModeration.tsx`
- `src/pages/dashboard/admin/BlogManagement.tsx`
- `src/pages/dashboard/admin/AboutManagement.tsx`
- `src/pages/dashboard/admin/EnrollmentsDashboard.tsx`

## Files to Modify
- `src/components/DashboardLayout.tsx` — RTL sidebar fix
- `src/pages/dashboard/admin/AdminDashboard.tsx` — add new routes
- `src/pages/dashboard/admin/AdminOverview.tsx` — enhanced overview with quick actions
- `src/pages/dashboard/admin/CoursesModeration.tsx` — full course management with tabs
- `src/pages/dashboard/admin/UsersManagement.tsx` — role assignment
- `src/pages/Blog.tsx` — fetch from DB
- `src/pages/BlogDetail.tsx` — fetch from DB
- `src/pages/CourseDetail.tsx` — fix any WhatsApp references
- `src/i18n/en.json`, `fr.json`, `ar.json` — new admin keys

