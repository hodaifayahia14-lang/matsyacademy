

# Add Test Users (Admin, Student, Instructor)

## What's Needed

The navbar already shows "Login" and "Sign Up" buttons when a user is not logged in — no changes needed there.

The main task is to **create three test accounts** in the database so you can log in and test each dashboard.

## Plan

### Create 3 test users via Supabase Auth

Use the database to insert test users directly. Since the `handle_new_user` trigger auto-creates profiles and assigns the "student" role, we need to:

1. **Create 3 auth users** via the Supabase admin API (edge function or direct SQL)
2. **Assign roles** — the trigger gives everyone "student" by default, so we add "instructor" and "admin" roles for the other two accounts

### Test accounts:

| Email | Password | Role |
|---|---|---|
| `admin@matsy.test` | `Admin123!` | admin |
| `instructor@matsy.test` | `Instructor123!` | instructor |
| `student@matsy.test` | `Student123!` | student |

### Implementation

1. **Create an edge function** `create-test-users` that uses the Supabase Admin API (`supabase.auth.admin.createUser`) to create all 3 users with confirmed emails
2. **Call it once** to seed the users
3. **Delete the edge function** after seeding (one-time use)

Alternatively, use a **database migration** to:
- Insert users via `auth.users` (not recommended — triggers may not fire correctly)

The **edge function approach** is cleaner since it uses the proper Auth Admin API, ensuring triggers fire and profiles/roles are created correctly. After seeding, we add the extra roles (admin, instructor) to `user_roles`.

### Files
- **Create**: `supabase/functions/create-test-users/index.ts` — one-time seeder
- **No other file changes needed** — navbar already has login/signup buttons

