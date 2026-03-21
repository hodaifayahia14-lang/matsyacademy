

# Seed Data + Fix Navbar Pages Dropdown + Generate Hero Image

## Tasks

### 1. Seed Q&A Questions & Answers
Insert seed data into `qa_questions` and `qa_answers` tables via a database migration. Since these tables require `user_id` (FK to auth.users), we'll create an edge function to seed the data using the admin API to find existing test users, or insert with a service-role bypass.

**Alternative (simpler):** Create the seed data directly in the QA page as static fallback content when the DB is empty — but that defeats the purpose. Better approach: use a migration to insert with `user_id` set to NULL or use a temporary seeder edge function.

**Issue:** `qa_questions.user_id` is NOT NULL (likely). Let me check — actually the schema shows `user_id uuid` without NOT NULL explicitly visible. We'll use a seeder edge function that:
- Finds the existing test users (admin@matsy.test, student@matsy.test, instructor@matsy.test)
- Inserts 6 Q&A questions with realistic HSE/Hajj content in Arabic-style names
- Inserts 2-3 answers per question
- Marks some as answered

**Seed content (6 questions):**
1. "How to prepare for the HSE certification exam?" — answered
2. "What PPE is required for industrial inspections?" — answered
3. "Hajj guide course — is it suitable for beginners?" — unanswered
4. "Can I get the certificate before completing all modules?" — answered
5. "What is the difference between Agent and Inspector courses?" — unanswered
6. "Are there group discounts for companies?" — unanswered

### 2. Seed Instructions
Insert 6 trilingual instructions into the `instructions` table via migration:
1. How to create an account (EN/FR/AR)
2. How to enroll in a course
3. How to access course materials
4. How to complete quizzes and assignments
5. How to download your certificate
6. How to contact support

### 3. Fix Navbar Pages Dropdown Languages
The `pages` array in `Navbar.tsx` is hardcoded in English:
```js
const pages = [
  { label: "About Us", to: "/about" },
  ...
];
```
Fix by using `t()` keys for each label instead of static English strings.

### 4. Fix Courses Dropdown
The `categories` array is also hardcoded English generic categories (IT & Software, Business, etc.) that don't match Matsy's real courses. Replace with the real categories using `t()`.

### 5. Improve About Us Page
- Replace dicebear avatar URLs with `randomuser.me` professional photos
- Add a "Why Choose Us" section with 4 feature cards (Certified Training, Expert Instructors, Flexible Learning, Ministry Accredited)
- Add a CTA section at the bottom

### 6. Generate Hero Image
Use the AI image generation script to create a hero image that combines HSE safety (helmets, PPE) and Hajj/Umrah (Kaaba) themes — representing both course categories.

## Files to Create
- `supabase/functions/seed-content/index.ts` — one-time seeder for Q&A + Instructions

## Files to Modify
- `src/components/Navbar.tsx` — fix pages dropdown to use `t()`, fix courses dropdown to show real categories
- `src/pages/About.tsx` — improve design with better avatars, Why Choose Us section, CTA
- `src/pages/HomePage.tsx` — update hero image reference after generation

## Database Changes
- Migration to insert 6 instructions (trilingual) directly — these don't need user_id
- Edge function to seed Q&A questions/answers (needs user_id from auth)

