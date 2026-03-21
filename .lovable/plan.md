

# Fix Instructors Page, Add Cart System, PDF Upload & Payment Methods

## Problem Analysis
1. `/instructors/instructor-3` fails because the Instructors page uses hardcoded fake IDs ("instructor-1", etc.) that don't exist in the `profiles` DB table. The `InstructorDetail` page queries `profiles` by UUID.
2. No cart system exists — users can only enroll directly.
3. Books use external URLs instead of uploaded PDFs.
4. No payment method selection (BaridiMob, CCP) or thank-you page.

## Phase 1: Fix Instructors Page

**`src/pages/Instructors.tsx`** — Make it self-contained. Instead of linking to `/instructors/:id` with fake IDs, either:
- Option A: Make each card expandable in-place showing full details (no separate page needed)
- Option B: Keep the detail page but pass instructor data via URL state

**Best approach**: Rewrite `Instructors.tsx` to fetch real instructor profiles from DB (users with `instructor` role), and link using their real UUIDs. Fallback to hardcoded data if no DB instructors exist yet.

**`src/pages/InstructorDetail.tsx`** — Add fallback: if profile not found in DB, check hardcoded instructor list and display that data instead. Also enhance the design with social links, experience years, and a more polished layout.

## Phase 2: PDF Upload for Books

**Database migration**: Create a `book-files` storage bucket (public: false, authenticated download).

**`src/pages/dashboard/instructor/CreateCourse.tsx`** — Replace the "File URL" text input with a real file upload component that:
- Accepts PDF files only
- Uploads to `book-files` bucket via Supabase Storage
- Saves the storage path in `file_url` column
- Shows upload progress

## Phase 3: Cart System

**Database migration**: Create `cart_items` table:
```sql
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
-- RLS: users manage own cart items
```

**Create `src/contexts/CartContext.tsx`**:
- Provides `cartItems`, `addToCart`, `removeFromCart`, `clearCart`, `cartCount`
- For authenticated users: syncs with `cart_items` table
- For unauthenticated users: redirects to login

**Update `src/components/Navbar.tsx`**:
- Add cart icon with badge count in the header

**Create `src/pages/Cart.tsx`**:
- List cart items with course/book thumbnails, titles, prices
- Remove item button
- Total price calculation
- "Proceed to Checkout" button

**Create `src/pages/Checkout.tsx`**:
- Order summary
- Payment method selection with icons:
  - BaridiMob (with logo/icon)
  - CCP (Poste Algérie) (with logo/icon)
  - Cash on delivery (optional)
- Each method shows payment instructions
- "Confirm Order" button → creates payment records + enrollments → redirects to thank you

**Create `src/pages/ThankYou.tsx`**:
- Success animation
- Order confirmation details
- "Go to My Courses" button

**Update `src/components/CourseCard.tsx`**:
- Add "Add to Cart" button alongside existing "Enroll Now"

**Update `src/pages/CourseDetail.tsx`**:
- Add "Add to Cart" button
- Show cart status if already in cart

**Update `src/App.tsx`**:
- Add routes: `/cart`, `/checkout`, `/thank-you`
- Wrap app with `CartProvider`

## Phase 4: Homepage Payment Methods Strip

**`src/pages/HomePage.tsx`** — Add a "Payment Methods" section near the footer showing accepted payment icons (BaridiMob, CCP) with a trust message.

## Phase 5: Student Dashboard — Show Purchased Courses

**`src/pages/dashboard/student/MyCourses.tsx`** — Already shows enrollments. After checkout creates enrollments, purchased courses will appear automatically.

## Files to Create
- `src/contexts/CartContext.tsx`
- `src/pages/Cart.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/ThankYou.tsx`

## Files to Modify
- `src/pages/Instructors.tsx` — fetch from DB or use fallback
- `src/pages/InstructorDetail.tsx` — fallback + enhanced design
- `src/pages/dashboard/instructor/CreateCourse.tsx` — PDF upload
- `src/components/CourseCard.tsx` — add to cart button
- `src/pages/CourseDetail.tsx` — add to cart button
- `src/components/Navbar.tsx` — cart icon
- `src/pages/HomePage.tsx` — payment methods section
- `src/App.tsx` — new routes + CartProvider

## Database Changes
1. Create `book-files` storage bucket + RLS policies
2. Create `cart_items` table + RLS policies

