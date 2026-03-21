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
  const description = course.description || "";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    addToCart(course.id);
  };

  const inCart = isInCart(course.id);

  const priceFormatted = course.price > 0
    ? `${Number(course.price).toLocaleString()} ${lang === "ar" ? "د.ج" : "DZD"}`
    : (lang === "ar" ? "مجاني" : lang === "fr" ? "Gratuit" : "Free");

  const levelLabel = course.level === "beginner"
    ? (lang === "ar" ? "مبتدئ" : lang === "fr" ? "Débutant" : "Beginner")
    : course.level === "intermediate"
    ? (lang === "ar" ? "متوسط" : lang === "fr" ? "Intermédiaire" : "Intermediate")
    : (lang === "ar" ? "متقدم" : lang === "fr" ? "Avancé" : "Advanced");

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
    >
      {/* Type badge */}
      <div className="absolute top-3 end-3 z-10 flex items-center gap-1 rounded-md bg-card/90 backdrop-blur-sm px-2 py-1 text-[10px] font-medium text-foreground border border-border">
        {isBook ? <Book className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
        {isBook ? (lang === "ar" ? "كتاب" : lang === "fr" ? "Livre" : "Book") : (lang === "ar" ? "دورة" : lang === "fr" ? "Cours" : "Course")}
      </div>

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.cover_image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 end-2 rounded bg-accent/90 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
          {levelLabel}
        </div>
      </div>

      {/* Default content */}
      <div className="flex flex-1 flex-col p-4 transition-opacity duration-300 group-hover:opacity-0">
        <span className="mb-1.5 inline-block w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
          {categoryName}
        </span>

        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">{title}</h3>

        {/* Price */}
        <div className="mb-2">
          <span className="text-lg font-bold text-primary">{priceFormatted}</span>
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {course.instructor_name && (
            <span className="flex items-center gap-1 truncate">
              <Users className="h-3.5 w-3.5" /> {course.instructor_name}
            </span>
          )}
          {isBook && course.page_count && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> {course.page_count} {lang === "ar" ? "صفحة" : "pages"}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-card border-t border-accent/30 p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">{title}</h3>

        <p className="mb-3 line-clamp-3 text-xs text-muted-foreground">{description}</p>

        <div className="mb-3">
          <span className="text-lg font-bold text-primary">{priceFormatted}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleEnroll}
            className="flex-1 gap-1 bg-accent text-accent-foreground hover:bg-accent/90">
            {enrollText}
          </Button>
          <Button size="sm" variant={inCart ? "secondary" : "outline"} onClick={handleAddToCart}
            className="gap-1" disabled={inCart}>
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
