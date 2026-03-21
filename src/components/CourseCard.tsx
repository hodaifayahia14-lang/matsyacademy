import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/mockData";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-gold/30"
    >
      <div className="relative aspect-video overflow-hidden border-b border-gold/20">
        <img
          src={course.coverImage}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute start-3 top-3 rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {course.category}
        </span>
        {course.isFree && (
          <span className="absolute end-3 top-3 rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 font-display text-sm font-semibold text-foreground group-hover:text-gold transition-colors">
          {course.title}
        </h3>

        <div className="mb-3 flex items-center gap-2">
          <img src={course.instructorAvatar} alt="" className="h-5 w-5 rounded-full" />
          <span className="text-xs text-gold-light">{course.instructor}</span>
        </div>

        <div className="mb-3 flex items-center gap-1">
          <span className="text-sm font-semibold text-gold">{course.rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(course.rating)
                    ? "fill-gold text-gold"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({course.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{course.duration}</span>
            <span>{course.lessonCount} lessons</span>
          </div>
          <span className="font-display text-lg font-bold text-gold">
            {course.isFree ? "Free" : `$${course.price.toFixed(0)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
