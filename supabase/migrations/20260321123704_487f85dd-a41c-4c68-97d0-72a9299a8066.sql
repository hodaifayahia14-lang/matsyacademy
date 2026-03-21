
-- Add type column to courses (course or book)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'course';

-- Add page_count for books
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS page_count integer DEFAULT NULL;

-- Add file_url for downloadable books
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS file_url text DEFAULT NULL;
