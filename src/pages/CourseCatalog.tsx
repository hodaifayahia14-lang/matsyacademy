import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search, SlidersHorizontal, X, BookOpen, GraduationCap,
  ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, List,
  Star, Clock, Users, Globe, Shield, Heart, Play, ArrowRight,
  Filter, RotateCcw, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories, type DBCourse } from "@/hooks/useCourses";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════ HELPERS ═══════ */
const T = (l: string, ar: string, fr: string, en: string) =>
  l === "ar" ? ar : l === "fr" ? fr : en;

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

const levels = ["beginner", "intermediate", "advanced"] as const;
const levelLabels: Record<string, Record<string, string>> = {
  beginner: { en: "Beginner", fr: "Débutant", ar: "مبتدئ" },
  intermediate: { en: "Intermediate", fr: "Intermédiaire", ar: "متوسط" },
  advanced: { en: "Advanced", fr: "Avancé", ar: "متقدم" },
};

const sortOptions = [
  { value: "newest", ar: "الأحدث", fr: "Plus récent", en: "Newest" },
  { value: "popular", ar: "الأكثر شعبية", fr: "Populaire", en: "Most Popular" },
  { value: "rating", ar: "الأعلى تقييماً", fr: "Mieux noté", en: "Highest Rated" },
  { value: "price_asc", ar: "السعر ↑", fr: "Prix ↑", en: "Price ↑" },
  { value: "price_desc", ar: "السعر ↓", fr: "Prix ↓", en: "Price ↓" },
];

const priceFilters = [
  { value: "all", ar: "الكل", fr: "Tous", en: "All" },
  { value: "free", ar: "مجاني", fr: "Gratuit", en: "Free" },
  { value: "paid", ar: "مدفوع", fr: "Payant", en: "Paid" },
  { value: "under1000", ar: "أقل من 1000 د.ج", fr: "Moins de 1000 DZD", en: "Under 1000 DZD" },
  { value: "1000_3000", ar: "1000 - 3000 د.ج", fr: "1000 - 3000 DZD", en: "1000 – 3000 DZD" },
];

const PER_PAGE = 12;

/* ═══════ SKELETON CARDS ═══════ */
function SkeletonCard() {
  return (
    <div className="rounded-[14px] border border-border bg-card shadow-sm overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-2 border-t border-border">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ═══════ PREMIUM COURSE CARD ═══════ */
function PremiumCourseCard({ course, lang, view }: { course: DBCourse; lang: string; view: "grid" | "list" }) {
  const [hovered, setHovered] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);
  const categoryName = getLocalized(course, "category_name", lang);
  const price = Number(course.price);
  const oldPrice = Math.round(price / 0.75);
  const priceFormatted = price > 0
    ? `${price.toLocaleString()} ${T(lang, "د.ج", "DZD", "DZD")}`
    : T(lang, "مجاني", "Gratuit", "Free");
  const enrollText = T(lang, "سجّل الآن", "S'inscrire", "Enroll Now");

  if (view === "list") {
    return (
      <Link to={`/courses/${course.id}`}
        className="group flex overflow-hidden rounded-[14px] border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-s-[3px] hover:border-s-accent"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="relative w-[200px] shrink-0 overflow-hidden">
          <img src={course.cover_image || "/placeholder.svg"} alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          {categoryName && (
            <span className="absolute top-3 start-3 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: "#F5A623", color: "#1a1a1a" }}>{categoryName}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="text-base font-bold text-foreground line-clamp-1 mb-1">{course.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {course.instructor_name && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.instructor_name}</span>}
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />4.8</span>
              <span className="flex items-center gap-1 capitalize"><Shield className="h-3 w-3" />{course.level}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">{priceFormatted}</span>
            <Button size="sm" className="rounded-full text-xs font-bold px-4"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
              {enrollText}
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ borderTopColor: hovered ? "#F5A623" : undefined, borderTopWidth: hovered ? 3 : undefined }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img src={course.cover_image || "/placeholder.svg"} alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {/* Category badge */}
        {categoryName && (
          <span className="absolute top-3 start-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{ background: "#F5A623", color: "#1a1a1a" }}>{categoryName}</span>
        )}
        {/* Wishlist heart */}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlistActive(!wishlistActive); }}
          className="absolute top-3 end-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow transition-transform hover:scale-110">
          <Heart className={`h-4 w-4 transition-colors ${wishlistActive ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
        </button>
        {/* Quick preview overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 z-[5]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/90 shadow-lg">
                <Play className="h-5 w-5 text-primary ms-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-[15px] font-bold text-foreground leading-snug line-clamp-2">{course.title}</h3>
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-2">
          {course.instructor_avatar ? (
            <img src={course.instructor_avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-secondary" />
          )}
          <span className="text-xs text-muted-foreground truncate">{course.instructor_name}</span>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-accent">4.8</span>
          <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s<=4 ? "fill-accent text-accent" : "fill-accent/30 text-accent/30"}`} />)}</div>
          <span className="text-[10px] text-muted-foreground">(0)</span>
        </div>
        {/* Info row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1 capitalize"><Shield className="h-3 w-3" />{course.level}</span>
          <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{course.language === "ar" ? T(lang,"عربي","AR","AR") : course.language?.toUpperCase()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{priceFormatted}</span>
          {price > 0 && <span className="text-xs text-muted-foreground line-through">{oldPrice.toLocaleString()}</span>}
        </div>
        <Button size="sm" className="rounded-full text-xs font-bold px-4 hover:scale-105 transition-transform text-primary-foreground"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
          {enrollText}
        </Button>
      </div>
    </Link>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function CourseCatalog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses: dbCourses, loading } = useCourses();
  const dbCategories = useCategories();

  // State from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [langFilter, setLangFilter] = useState(searchParams.get("lang") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLevel) params.set("level", selectedLevel);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (langFilter) params.set("lang", langFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, selectedLevel, priceFilter, langFilter, sortBy, page]);

  const maxPrice = Math.max(...dbCourses.map(c => Number(c.price)), 50000);

  // Filtering
  const filtered = useMemo(() => {
    let result = [...dbCourses];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
    }
    if (selectedCategory) {
      result = result.filter(c => c.category_name === selectedCategory || c.category_id === selectedCategory);
    }
    if (selectedLevel) {
      result = result.filter(c => c.level === selectedLevel);
    }
    if (priceFilter === "free") result = result.filter(c => Number(c.price) === 0);
    else if (priceFilter === "paid") result = result.filter(c => Number(c.price) > 0);
    else if (priceFilter === "under1000") result = result.filter(c => Number(c.price) > 0 && Number(c.price) < 1000);
    else if (priceFilter === "1000_3000") result = result.filter(c => Number(c.price) >= 1000 && Number(c.price) <= 3000);

    if (langFilter) result = result.filter(c => c.language === langFilter);
    result = result.filter(c => Number(c.price) >= priceRange[0] && Number(c.price) <= priceRange[1]);

    // Sort
    if (sortBy === "price_asc") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_desc") result.sort((a, b) => Number(b.price) - Number(a.price));
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [debouncedSearch, selectedCategory, selectedLevel, priceFilter, langFilter, sortBy, priceRange, dbCourses]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Active filter pills
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (selectedCategory) {
    const cat = dbCategories.find((c: any) => c.name === selectedCategory || c.id === selectedCategory);
    activeFilters.push({ label: cat ? getLocalized(cat, "name", lang) : selectedCategory, clear: () => { setSelectedCategory(""); setPage(1); } });
  }
  if (selectedLevel) activeFilters.push({ label: levelLabels[selectedLevel]?.[lang] || selectedLevel, clear: () => { setSelectedLevel(""); setPage(1); } });
  if (priceFilter !== "all") activeFilters.push({ label: priceFilters.find(p => p.value === priceFilter)?.[lang === "ar" ? "ar" : lang === "fr" ? "fr" : "en"] || priceFilter, clear: () => { setPriceFilter("all"); setPage(1); } });
  if (langFilter) activeFilters.push({ label: langFilter === "ar" ? T(lang,"العربية","Arabe","Arabic") : langFilter === "fr" ? T(lang,"الفرنسية","Français","French") : T(lang,"الإنجليزية","Anglais","English"), clear: () => { setLangFilter(""); setPage(1); } });

  const clearAll = () => {
    setSearch(""); setSelectedCategory(""); setSelectedLevel("");
    setPriceFilter("all"); setLangFilter(""); setSortBy("newest");
    setPriceRange([0, maxPrice]); setPage(1);
  };

  const hasFilters = activeFilters.length > 0 || debouncedSearch;

  /* ═══════ SIDEBAR FILTER CONTENT ═══════ */
  const FilterContent = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className="space-y-5">
      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">{T(lang, "الفئات", "Catégories", "Categories")}</h4>
        <ul className="space-y-1">
          {dbCategories.map((cat: any) => {
            const catCount = dbCourses.filter(c => c.category_name === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <li key={cat.id}>
                <button onClick={() => { setSelectedCategory(isSelected ? "" : cat.name); setPage(1); }}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground/70 hover:bg-secondary"
                  }`}>
                  <span>{getLocalized(cat, "name", lang)}</span>
                  <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground">{catCount}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Level */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">{T(lang, "المستوى", "Niveau", "Level")}</h4>
        <div className="space-y-2">
          {levels.map(lvl => (
            <label key={lvl} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedLevel === lvl}
                onCheckedChange={() => { setSelectedLevel(selectedLevel === lvl ? "" : lvl); setPage(1); }} />
              <span>{levelLabels[lvl][lang]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">{T(lang, "السعر", "Prix", "Price")}</h4>
        <div className="space-y-2">
          {priceFilters.map(pf => (
            <label key={pf.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={priceFilter === pf.value}
                onCheckedChange={() => { setPriceFilter(priceFilter === pf.value ? "all" : pf.value); setPage(1); }} />
              <span>{pf[lang === "ar" ? "ar" : lang === "fr" ? "fr" : "en"]}</span>
            </label>
          ))}
        </div>
        <div className="mt-3">
          <Slider min={0} max={maxPrice} step={500} value={priceRange}
            onValueChange={(v) => { setPriceRange(v); setPage(1); }} className="mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} {T(lang,"د.ج","DZD","DZD")}</span>
            <span>{priceRange[1].toLocaleString()} {T(lang,"د.ج","DZD","DZD")}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">{T(lang, "التقييم", "Note", "Rating")}</h4>
        <div className="space-y-2 text-sm">
          {["4.5", "4.0", "3.5"].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <Checkbox />
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {r}+
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-sm font-bold text-foreground">{T(lang, "اللغة", "Langue", "Language")}</h4>
        <div className="space-y-2">
          {[
            { val: "ar", label: T(lang, "العربية", "Arabe", "Arabic") },
            { val: "fr", label: T(lang, "الفرنسية", "Français", "French") },
            { val: "en", label: T(lang, "الإنجليزية", "Anglais", "English") },
          ].map(l => (
            <label key={l.val} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={langFilter === l.val}
                onCheckedChange={() => { setLangFilter(langFilter === l.val ? "" : l.val); setPage(1); }} />
              <span>{l.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {inSheet && (
          <Button onClick={() => setMobileFiltersOpen(false)} className="w-full gradient-gold text-accent-foreground font-bold rounded-xl">
            {T(lang, "تطبيق", "Appliquer", "Apply")}
          </Button>
        )}
        {hasFilters && (
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={clearAll}>
            <RotateCcw className="h-3.5 w-3.5 me-1" /> {T(lang, "مسح الكل", "Tout effacer", "Reset All")}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO BANNER
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #5B2D8E, #1A0A3C)" }}>
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="container relative z-10 py-12 lg:py-14 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3">
            {T(lang, "اكتشف دوراتنا التدريبية", "Découvrez nos formations", "Explore Our Courses")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-primary-foreground/70 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
            {T(lang, "تعلّم من أفضل الخبراء في الجزائر", "Apprenez avec les meilleurs experts d'Algérie", "Learn from Algeria's top experts")}
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-[600px] mx-auto">
            <div className="flex items-center rounded-full bg-primary-foreground shadow-lg overflow-hidden">
              <div className="flex-1 flex items-center ps-5">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={T(lang, "ابحث عن دورة أو موضوع...", "Rechercher un cours ou un sujet...", "Search for a course or topic...")}
                  className="flex-1 bg-transparent px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              </div>
              <button className="h-full px-6 py-4 text-sm font-bold text-primary-foreground shrink-0 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                {T(lang, "بحث", "Chercher", "Search")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — STICKY FILTER BAR
          ═══════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="container py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Active filter pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap flex-1">
              {activeFilters.map((f, i) => (
                <motion.span key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {f.label}
                  <button onClick={f.clear} className="hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
                </motion.span>
              ))}
              {activeFilters.length > 0 && (
                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                  {T(lang, "مسح الكل", "Tout effacer", "Clear All")}
                </button>
              )}
              {activeFilters.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  {filtered.length} {T(lang, "دورة", "cours", "courses")} {T(lang, "متاحة", "trouvés", "found")}
                </span>
              )}
            </div>

            {/* Desktop dropdowns */}
            <div className="hidden md:flex items-center gap-2">
              <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-auto min-w-[140px] rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s[lang === "ar" ? "ar" : lang === "fr" ? "fr" : "en"]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile: filter + sort buttons */}
            <div className="flex md:hidden w-full gap-2">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2 rounded-xl">
                    <Filter className="h-4 w-4" /> {T(lang, "الفلاتر", "Filtres", "Filters")}
                    {activeFilters.length > 0 && (
                      <span className="rounded-full bg-primary text-primary-foreground text-[10px] px-1.5">{activeFilters.length}</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] overflow-y-auto">
                  <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-4">{T(lang, "الفلاتر", "Filtres", "Filters")}</h3>
                  <FilterContent inSheet />
                </SheetContent>
              </Sheet>
              <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(1); }}>
                <SelectTrigger className="flex-1 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s[lang === "ar" ? "ar" : lang === "fr" ? "fr" : "en"]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4 — CATEGORY PILLS
          ═══════════════════════════════════════════ */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1" style={{ maskImage: "linear-gradient(to right, black 90%, transparent)" }}>
            <button onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !selectedCategory ? "text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
              style={!selectedCategory ? { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" } : {}}>
              {T(lang, "الكل", "Tous", "All")}
            </button>
            {dbCategories.map((cat: any) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button key={cat.id} onClick={() => { setSelectedCategory(isActive ? "" : cat.name); setPage(1); }}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    isActive ? "text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  style={isActive ? { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" } : {}}>
                  {getLocalized(cat, "name", lang)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 5 + 6 — GRID + SIDEBAR
          ═══════════════════════════════════════════ */}
      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className={`hidden lg:block shrink-0 transition-all duration-300 ${sidebarOpen ? "w-[280px]" : "w-0 overflow-hidden"}`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-foreground">{T(lang, "الفلاتر", "Filtres", "Filters")}</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Sidebar toggle when closed */}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="hidden lg:flex fixed start-4 top-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
              <Filter className="h-4 w-4" />
            </button>
          )}

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {T(lang, "عرض", "Affichage", "Showing")} {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} {T(lang, "من", "sur", "of")} {filtered.length} {T(lang, "دورة", "cours", "courses")}
              </p>
            </div>

            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paged.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${selectedCategory}-${selectedLevel}-${sortBy}-${page}-${viewMode}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                  {paged.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}>
                      <PremiumCourseCard course={c} lang={lang} view={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="py-20 text-center">
                <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                  {T(lang, "لم يتم العثور على دورات", "Aucun cours trouvé", "No courses found")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {T(lang, "جرّب مصطلح بحث آخر", "Essayez un autre terme", "Try a different search")}
                </p>
                <Button variant="outline" onClick={clearAll} className="rounded-xl">
                  <RotateCcw className="h-4 w-4 me-2" /> {T(lang, "مسح الفلاتر", "Effacer les filtres", "Clear Filters")}
                </Button>
              </div>
            )}

            {/* ═══════ PAGINATION ═══════ */}
            {totalPages > 1 && (
              <div className="mt-10">
                {/* Desktop pagination */}
                <div className="hidden md:flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)} className="rounded-lg gap-1">
                    {lang === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    {T(lang, "السابق", "Précédent", "Previous")}
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-full text-sm font-semibold transition-all ${
                        p === page
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}>
                      {p}
                    </button>
                  ))}
                  {totalPages > 7 && <span className="text-muted-foreground">...</span>}
                  <Button variant="outline" size="sm" disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)} className="rounded-lg gap-1">
                    {T(lang, "التالي", "Suivant", "Next")}
                    {lang === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Mobile load more */}
                <div className="md:hidden text-center">
                  <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                    className="rounded-xl px-8">
                    {T(lang, "تحميل المزيد", "Charger plus", "Load More")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 8 — CTA BANNER
          ═══════════════════════════════════════════ */}
      <section className="container pb-12">
        <div className="mx-auto max-w-3xl rounded-2xl p-8 lg:p-10 text-center"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.08))" }}>
          <Search className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            {T(lang, "لم تجد ما تبحث عنه؟", "Vous ne trouvez pas ce que vous cherchez ?", "Can't find what you're looking for?")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {T(lang, "تواصل معنا أو اقترح دورة جديدة", "Contactez-nous ou suggérez un nouveau cours", "Contact us or suggest a new course")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <Button variant="outline" className="rounded-xl gap-2">
                <MessageCircle className="h-4 w-4" /> {T(lang, "تواصل معنا", "Contactez-nous", "Contact Us")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="rounded-xl gap-2 text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                {T(lang, "اقترح دورة", "Suggérer un cours", "Request a Course")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
