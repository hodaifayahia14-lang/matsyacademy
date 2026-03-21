

# Fix "Enroll Now" for Books — Wrong Navigation

## Problem
When clicking "Enroll Now" on a book (e.g., `/courses/book-2`), the code navigates to `/courses/book-2/player` — a route that doesn't exist. The actual course player route is `/learn/:courseId/:lessonId`, and books have **no sections or lessons** (`sections: []`), so there's nothing to play.

## Solution

**File: `src/pages/CourseDetail.tsx`** (lines 49-55)

Update `handleEnroll` to handle books vs courses differently:
- **Books**: If user is signed in, add to cart and navigate to `/cart`. If not signed in, go to `/login`.
- **Courses**: If user is signed in and course has lessons, navigate to `/learn/${id}/${firstLessonId}`. If no lessons exist, show a toast. If not signed in, go to `/login`.

Also update the button label: books should show "Buy Now" / "اشترِ الآن" instead of "Enroll Now" / "سجّل الآن".

**Changes:**
```
handleEnroll:
  if (!user) → navigate("/login")
  if (course.type === "book") → addToCart(course.id), navigate("/cart")
  if (course.type === "course") → find first lesson from sections[0].lessons[0], navigate("/learn/${id}/${lessonId}")
  if no lessons → toast error
```

**Button text**: Use `course.type === "book" ? buyText : enrollText` where `buyText` = "اشترِ الآن" / "Acheter" / "Buy Now"

## Files to Modify
- `src/pages/CourseDetail.tsx` — fix `handleEnroll` logic + button label

