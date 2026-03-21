import { Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Course } from "@/data/mockData";

export default function CourseCard({ course }: { course: Course }) {
  const { t } = useTranslation();
  const oldPrice = course.isFree ? course.price || 99 : Math.round(course.price * 1.3);

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Default content — visible normally */}
      <div className="flex flex-1 flex-col p-4 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
          {course.title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">(</span>
          <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">/</span>
          <span>{course.reviewCount > 1000 ? `${(course.reviewCount / 1000).toFixed(1)}k` : course.reviewCount} Ratings)</span>
        </div>

        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="font-bold text-foreground">
            {course.isFree ? t("catalog.free") : `$${course.price.toFixed(0)}`}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ${oldPrice}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course.studentCount} {t("stats.students")}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonCount} {t("catalog.lessons")}
          </span>
        </div>
      </div>

      {/* Hover overlay — slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-card border-t border-border p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
          {course.title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>(</span>
          <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
          <span>/</span>
          <span>{course.reviewCount > 1000 ? `${(course.reviewCount / 1000).toFixed(1)}k` : course.reviewCount} Ratings)</span>
        </div>

        <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
          {course.description}
        </p>

        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="font-bold text-foreground">
            {course.isFree ? t("catalog.free") : `$${course.price.toFixed(0)}`}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ${oldPrice}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          {t("common.viewAll")}
        </span>
      </div>
    </Link>
  );
}
