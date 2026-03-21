
Goal: fix “Add to cart” so products are actually inserted and visible in `/cart`.

Root cause (confirmed from network logs):
- Cart insert sends `course_id: "course-1"` / `"course-2"`.
- `cart_items.course_id` is UUID and references `courses.id`.
- Storefront pages still use `mockCourses` (string IDs), while cart/checkout use backend tables (UUID IDs).  
So the storefront and cart are out of sync.

Implementation plan:

1) Unify storefront product source to backend (published products)
- Replace `mockCourses` usage in:
  - `src/pages/HomePage.tsx`
  - `src/pages/CourseCatalog.tsx`
- Fetch published `courses` (+ category names) from backend and render those items.
- Keep UI design intact, but card data must use real UUID IDs from `courses.id`.

2) Update course detail page to backend-first
- In `src/pages/CourseDetail.tsx`, load product by route `id` from backend using `.maybeSingle()` (not `.single()`).
- Load sections/lessons only when product type is `course`.
- Keep a temporary legacy fallback for old mock URLs (like `/courses/course-1`) so old links don’t hard-fail during transition.

3) Harden cart insert logic
- In `src/contexts/CartContext.tsx`:
  - Validate `courseId` format before insert (UUID guard).
  - Improve error feedback from insert failures (show backend message in toast for debugging instead of generic failure).
  - Keep existing duplicate handling (`23505`).

4) Keep Add-to-cart buttons mapped to real IDs
- `src/components/CourseCard.tsx` and `src/pages/CourseDetail.tsx` should pass backend `course.id` (UUID) to `addToCart`.
- Ensure book and course CTAs both use the same valid backend product ID path.

5) Verify end-to-end flow
- From Home and Catalog: click Add to Cart on a course and a book.
- Confirm successful row creation in `cart_items` and item visibility in `/cart`.
- Confirm checkout still reads joined `courses` data and proceeds normally.

Technical notes:
- No schema migration is required for this fix.
- This resolves the exact UUID mismatch causing the current 400 errors.
- As a side benefit, newly created admin/instructor products will appear in storefront and become purchasable immediately.
