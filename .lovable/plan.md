

# Platform Restructuring: Staff-Only Auth, Public Order Form, Agent Gamification

## Overview
Transform the platform from an LMS with student/instructor/admin roles into a **public course catalog** with a **staff-only backend** (Admin + Confirmation Agent) and a **public order form** (no login required to buy). Add gamification for confirmation agents.

---

## Database Changes

### 1. Add `confirmation_agent` to `app_role` enum
```sql
ALTER TYPE public.app_role ADD VALUE 'confirmation_agent';
```

### 2. Create `orders` table (public order form submissions)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| course_id | uuid | FK to courses |
| full_name | text | required |
| phone | text | required, Algerian format |
| wilaya_code | int | 1-58 |
| wilaya_name | text | |
| status_label | text | Student/Employee/Unemployed/Business Owner/Other |
| order_status | text | pending/called/confirmed/cancelled |
| assigned_agent_id | uuid | nullable, FK to profiles |
| confirmed_by | uuid | nullable |
| confirmed_at | timestamptz | nullable |
| notes | text | nullable |
| created_at | timestamptz | default now() |

RLS: Public can INSERT (no auth). Authenticated admin/agent can SELECT/UPDATE.

### 3. Create `agent_rewards` table
| Column | Type |
|--------|------|
| id | uuid PK |
| agent_id | uuid |
| gift_name | text |
| description | text |
| awarded_at | timestamptz |
| awarded_by | uuid |

RLS: Admin can ALL. Agents can SELECT own.

### 4. Enable realtime on `orders` table

---

## Frontend Changes

### Step 1: Remove public auth pages & student/instructor dashboards
- Remove `/login`, `/register`, `/forgot-password`, `/reset-password` routes from public routes
- Remove `/dashboard/student/*` and `/dashboard/instructor/*` routes from App.tsx
- Remove Login/Register/ForgotPassword links from Navbar
- Keep Cart/Checkout concept but replace with the new Order Form flow

### Step 2: Add staff login at `/admin/login`
- Single login page at `/admin/login` (no signup, no Google, no forgot password)
- Email + password only
- On success, redirect to `/dashboard/admin` (admin) or `/dashboard/agent` (confirmation_agent)
- Update `ProtectedRoute` to redirect unauthenticated to `/admin/login` instead of `/login`

### Step 3: Create public Order Form page (`/order/:courseId`)
- No login required
- Fields: Full Name, Phone (05/06/07 format validation), Wilaya dropdown (58 wilayas), Status dropdown
- Shows course name + price at top
- On submit: insert into `orders` table (anon insert allowed via RLS)
- Success: show thank-you message with order number

### Step 4: Update CourseDetail "Buy/Enroll" button
- Instead of requiring login, navigate to `/order/:courseId`
- Remove cart-based flow for public users

### Step 5: Remove Navbar auth UI for public visitors
- Remove Sign In / Sign Up / Profile dropdown for non-staff
- Keep language switcher, categories, pages links

### Step 6: Create Agent Dashboard (`/dashboard/agent/*`)
- **Orders Queue**: Table of orders assigned to this agent (filterable by status)
- **Call & Confirm**: Agent clicks an order → marks as "called" → marks as "confirmed"
- **My Stats**: Personal confirmation count, rate, rank
- **My Rewards**: List of gifts received

### Step 7: Add Orders Management to Admin Dashboard
- New sidebar item: "Orders" — full list of all orders
- Assign orders to agents (bulk or individual)
- Filter by status, wilaya, date
- View agent performance

### Step 8: Create Gamification/Leaderboard page
- Accessible from both Admin and Agent dashboards
- **Leaderboard table**: Agent name, confirmed count (week/month/all), rate, rank
- **Top performer badge**: 🥇 highlight
- **Admin**: can award gifts from this page (modal: gift name, description)
- **Agent**: read-only view of leaderboard + own rewards

### Step 9: Remove Create Course from Admin Dashboard
- Remove "courses/create" route from AdminDashboard
- Remove "Create Course" button from CoursesModeration page
- Admin can still edit existing courses but not create new ones via wizard

---

## Files to Create
- `src/pages/AdminLogin.tsx` — staff-only login
- `src/pages/OrderForm.tsx` — public order form with wilaya/status dropdowns
- `src/pages/OrderThankYou.tsx` — order confirmation
- `src/pages/dashboard/agent/AgentDashboard.tsx` — agent layout + routes
- `src/pages/dashboard/agent/AgentOrders.tsx` — orders queue
- `src/pages/dashboard/agent/AgentStats.tsx` — personal stats
- `src/pages/dashboard/agent/AgentRewards.tsx` — rewards received
- `src/pages/dashboard/admin/OrdersManagement.tsx` — admin orders view
- `src/pages/dashboard/admin/Leaderboard.tsx` — gamification leaderboard
- `src/data/algerianWilayas.ts` — static list of 58 wilayas

## Files to Modify
- `src/App.tsx` — restructure routes
- `src/components/Navbar.tsx` — remove auth UI for public
- `src/components/ProtectedRoute.tsx` — support `confirmation_agent` role, redirect to `/admin/login`
- `src/pages/CourseDetail.tsx` — change enroll button to go to `/order/:id`
- `src/pages/dashboard/admin/AdminDashboard.tsx` — add Orders + Leaderboard sidebar items, remove CreateCourse route
- `src/contexts/AuthContext.tsx` — update `getDashboardPath` to handle `confirmation_agent`

## Files to Remove/Deprecate (remove routes, keep files for now)
- `/login`, `/register`, `/forgot-password`, `/reset-password` routes
- `/dashboard/student/*`, `/dashboard/instructor/*` routes
- `/cart`, `/checkout`, `/thank-you` routes (replaced by order form)

---

## Technical Notes
- The `orders` table needs an anon INSERT RLS policy so unauthenticated visitors can submit orders
- Agent assignment uses `assigned_agent_id` — admin assigns from the orders management page
- Gamification stats are computed via SQL queries (COUNT, GROUP BY agent) — no separate stats table needed
- The 58 Algerian wilayas are a static constant (01-Adrar through 58-El Bayadh)

