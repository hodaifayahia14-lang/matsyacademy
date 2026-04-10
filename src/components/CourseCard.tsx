import { Star, Users, BookOpen, Book, GraduationCap, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import type { DBCourse } from "@/hooks/useCourses";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function CourseCard({ course }: { course: DBCourse }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const title = course.title || "";
  const categoryName = getLocalized(course, "category_name", lang);
  const isBook = course.type === "book";

  const enrollText = isBook
    ? (lang === "ar" ? "اشتري الآن" : lang === "fr" ? "Acheter" : "Buy Now")
    : (lang === "ar" ? "سجّل الآن" : lang === "fr" ? "S'inscrire" : "Enroll Now");

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    navigate(`/courses/${course.id}`);
  };

  const priceFormatted = course.price > 0
    ? `${Number(course.price).toLocaleString()} ${lang === "ar" ? "د.ج" : "DZD"}`
    : (lang === "ar" ? "مجاني" : lang === "fr" ? "Gratuit" : "Free");

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.cover_image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge top-start */}
        {categoryName && (
          <div className="absolute top-3 start-3 z-10 rounded-md bg-primary/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
            {categoryName}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground leading-snug">{title}</h3>

        {/* Instructor & Rating */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          {course.instructor_name && (
            <span className="flex items-center gap-1 truncate">
              <Users className="h-3 w-3" /> {course.instructor_name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" /> 4.8/5
          </span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-base font-bold text-primary">{priceFormatted}</span>
          <Button size="sm" onClick={handleEnroll}
            className="gradient-gold text-accent-foreground text-xs font-semibold hover:opacity-90 px-4">
            {enrollText}
          </Button>
        </div>
      </div>
    </Link>
  );
}
