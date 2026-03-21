import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/mockData";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {course.category}
        </span>
        {course.isFree && (
          <span className="absolute right-3 top-3 rounded-md bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <div className="mb-3 flex items-center gap-2">
          <img src={course.instructorAvatar} alt="" className="h-5 w-5 rounded-full" />
          <span className="text-xs text-muted-foreground">{course.instructor}</span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <span className="text-sm font-semibold text-warning">{course.rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(course.rating)
                    ? "fill-warning text-warning"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({course.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{course.duration}</span>
            <span>{course.lessonCount} lessons</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            {course.isFree ? "Free" : `$${course.price.toFixed(0)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
