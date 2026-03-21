import { Star, Users, BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Course } from "@/data/mockData";

function getLocalized(course: any, field: string, lang: string): string {
  return course[`${field}_${lang}`] || course[`${field}_en`] || course[field] || "";
}

export default function CourseCard({ course }: { course: Course }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const title = getLocalized(course, "title", lang);
  const description = getLocalized(course, "description", lang);
  const badge = getLocalized(course, "badge", lang);
  const format = getLocalized(course, "format", lang);
  const categoryName = getLocalized(course, "category", lang);
  const whatsappUrl = "https://wa.me/213554275994";
  const contactText = lang === "ar" ? "اتصل بنا للسعر" : lang === "fr" ? "Contactez-nous" : "Contact for Price";
  const enrollText = lang === "ar" ? "سجّل الآن" : lang === "fr" ? "S'inscrire" : "Enroll Now";

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
    >
      {/* Badge Ribbon */}
      {badge && (
        <div className="absolute top-3 start-3 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
          {badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        {/* Format tag */}
        <div className="absolute bottom-2 end-2 rounded bg-accent/90 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          {format}
        </div>
      </div>

      {/* Default content */}
      <div className="flex flex-1 flex-col p-4 transition-opacity duration-300 group-hover:opacity-0">
        <span className="mb-1.5 inline-block w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
          {categoryName}
        </span>

        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
          {title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">(</span>
          <span className="font-semibold text-accent">{course.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">/</span>
          <span>{course.reviewCount} {lang === "ar" ? "تقييم" : lang === "fr" ? "avis" : "Ratings"})</span>
        </div>

        <div className="mb-2 flex items-center gap-2 text-sm">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            <MessageCircle className="h-3.5 w-3.5" />
            {contactText}
          </a>
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

      {/* Hover overlay */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-card border-t border-accent/30 p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
          {title}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>(</span>
          <span className="font-semibold text-accent">{course.rating.toFixed(1)}</span>
          <span>/</span>
          <span>{course.reviewCount} {lang === "ar" ? "تقييم" : lang === "fr" ? "avis" : "Ratings"})</span>
        </div>

        <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">
          {description}
        </p>

        <div className="mb-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
            <MessageCircle className="h-3.5 w-3.5" />
            {contactText}
          </a>
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/90">
          {enrollText}
        </span>
      </div>
    </Link>
  );
}
