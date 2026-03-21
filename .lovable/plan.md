

# Fix CourseDetail: Mobile Responsiveness & Scroll-to-Top

## Problems
1. **No scroll-to-top on navigation**: When clicking a course from the bottom of a page, the new page stays scrolled down.
2. **Not responsive on mobile (390px viewport)**: The sidebar stacks below content via `lg:grid-cols-3` but several elements are cramped — tabs overflow, breadcrumb wraps poorly, and the aspect-video takes too much space.

## Changes — `src/pages/CourseDetail.tsx`

### 1. Scroll to top on mount/route change
Add a `useEffect` that scrolls to top when `id` changes:
```ts
useEffect(() => { window.scrollTo(0, 0); }, [id]);
```

### 2. Mobile-responsive tab bar
Change the tab bar from `flex gap-1` (4 tabs crammed in 390px) to a horizontally scrollable strip:
- Add `overflow-x-auto` and `flex-nowrap` to the tab container
- Use `whitespace-nowrap` and `min-w-fit` on each tab button so text doesn't wrap
- Reduce padding on small screens: `px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm`

### 3. Breadcrumb truncation
Add `truncate max-w-[150px] sm:max-w-none` on the course title span in the breadcrumb so it doesn't wrap on mobile.

### 4. Reduce vertical spacing on mobile
- Container padding: `py-4 sm:py-8`
- Heading size: `text-xl sm:text-2xl lg:text-3xl`
- Sidebar card: reduce padding on mobile `p-4 sm:p-6`

### 5. Instructor tab layout
The instructor card uses `flex items-start gap-6` with a large avatar — on mobile, stack vertically: `flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6` and center text on mobile.

## File
- `src/pages/CourseDetail.tsx` — all changes in this single file

