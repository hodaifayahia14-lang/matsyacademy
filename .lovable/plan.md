

# Course Player + Design Fixes + Missing Pages Plan

## What Needs to Be Done

1. **Build Course Player page** (`/learn/:courseId/:lessonId`) — the main missing feature
2. **Fix missing page designs** — several pages linked in the nav (Blog detail `/blog/:id`, Terms `/terms`) have no route/component
3. **Add Login/SignUp buttons** to navbar when user is NOT logged in (currently only shows "Contact Us")
4. **Add course hover overlay improvements** — ensure the hover effect works smoothly on course cards
5. **Complete i18n** — add `coursePlayer.*` and `terms.*` keys to all three language files

## Phase 1: Course Player Page (`/learn/:courseId/:lessonId`)

Create `src/pages/CoursePlayer.tsx` with:
- **Left sidebar**: Collapsible course outline with sections/lessons, progress checkmarks, current lesson highlighted in green
- **Main area**: Video player (iframe embed for video lessons), text content renderer, or quiz modal
- **Below player**: Lesson title, "Mark as Complete" button, Notes textarea, Discussion/comments section
- **Top bar**: Course title, overall progress bar, back to course link
- **Auto-advance**: After marking complete, navigate to next lesson
- **Quiz modal**: For quiz-type lessons, show questions one-by-one with MCQ options, submit, show score
- Uses mock data for now (same `mockCourses` structure)
- Protected route (requires enrollment — for now just require auth)

Add route in `App.tsx`: `/learn/:courseId/:lessonId` wrapped in the public layout (with Navbar/Footer hidden — full-screen player layout)

## Phase 2: Missing Pages

### Blog Detail (`/blog/:id`)
- Create `src/pages/BlogDetail.tsx` — article view with title, author, date, full content, back link
- Add route `/blog/:id` in App.tsx

### Terms Page (`/terms`)
- Create `src/pages/Terms.tsx` — static terms of service page
- Add route `/terms` in App.tsx

## Phase 3: Navbar Fix
- When user is NOT logged in, show both "Login" and "Sign Up" buttons alongside "Contact Us" (currently only Contact Us shows for unauthenticated users on desktop)

## Phase 4: i18n Updates

Add new keys to all three files:
- `coursePlayer.markComplete`, `coursePlayer.notes`, `coursePlayer.notesPlaceholder`, `coursePlayer.nextLesson`, `coursePlayer.backToCourse`, `coursePlayer.quizTitle`, `coursePlayer.submit`, `coursePlayer.score`, `coursePlayer.retry`, `coursePlayer.passed`, `coursePlayer.failed`
- `terms.title`, `terms.content`
- `blog.readMore`, `blog.backToBlog`

## Files to Create
- `src/pages/CoursePlayer.tsx`
- `src/pages/BlogDetail.tsx`
- `src/pages/Terms.tsx`

## Files to Modify
- `src/App.tsx` — add 3 new routes (CoursePlayer outside Navbar/Footer layout, BlogDetail and Terms inside public layout)
- `src/components/Navbar.tsx` — show Login/SignUp for unauthenticated desktop users
- `src/i18n/en.json`, `fr.json`, `ar.json` — add new translation keys

