import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X, Book, BookOpen, GraduationCap, ChevronLeft, ChevronRight, Code, BarChart3, Palette, Briefcase, Database, Globe, Tag, Flame, Award, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories } from "@/hooks/useCourses";
import { motion } from "framer-motion";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

const levels = ["beginner", "intermediate", "advanced"];
const levelLabels: Record<string, Record<string, string>> = {
  beginner: { en: "Beginner", fr: "Débutant", ar: "مبتدئ" },
  intermediate: { en: "Intermediate", fr: "Intermédiaire", ar: "متوسط" },
  advanced: { en: "Advanced", fr: "Avancé", ar: "متقدم" },
};

const categoryIcons: Record<string, React.ElementType> = {
  "تطوير الويب": Code,
  "التسويق الرقمي": BarChart3,
  "اللغات": Globe,
  "التصميم": Palette,
  "الأعمال": Briefcase,
  "البيانات": Database,
};

const popularTags = [
  { labelAr: "جديد", labelFr: "Nouveau", labelEn: "New", icon: Flame },
  { labelAr: "شائع", labelFr: "Populaire", labelEn: "Popular", icon: TrendingUp },
  { labelAr: "الأفضل مبيعاً", labelFr: "Best-seller", labelEn: "Best Seller", icon: Award },
  { labelAr: "منشياول", labelFr: "Tendance", labelEn: "Trending", icon: Star },
  { labelAr: "الأنسب مبيعاً", labelFr: "Top ventes", labelEn: "Top Sales", icon: Tag },
];

export default function CourseCatalog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [searchParams] = useSearchParams();
  const { courses: dbCourses, loading } = useCourses();
  const dbCategories = useCategories();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [page, setPage] = useState(1);
  const perPage = 9;

  const maxPrice = Math.max(...dbCourses.map(c => Number(c.price)), 50000);

  const filtered = useMemo(() => {
    let result = [...dbCourses];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((c) => selectedCategories.includes(c.category_name));
    }
    if (selectedLevels.length > 0) {
      result = result.filter((c) => selectedLevels.includes(c.level));
    }
    result = result.filter((c) => Number(c.price) >= priceRange[0] && Number(c.price) <= priceRange[1]);
    return result;
  }, [search, selectedCategories, selectedLevels, priceRange, dbCourses]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const hasFilters = selectedCategories.length > 0 || selectedLevels.length > 0 || search || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange([0, maxPrice]);
    setPage(1);
  };

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    setPage(1);
  };

  // Categories sidebar
  const CategoriesSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 font-display text-base font-semibold text-foreground">
          {lang === "ar" ? "الفئات" : lang === "fr" ? "Catégories" : "Categories"}
        </h4>
        <ul className="space-y-1">
          {dbCategories.map((cat: any) => {
            const IconComp = categoryIcons[cat.name] || BookOpen;
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <li key={cat.id}>
                <button
                  onClick={() => toggleFilter(selectedCategories, cat.name, setSelectedCategories)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <IconComp className="h-4 w-4 shrink-0" />
                  <span>{getLocalized(cat, "name", lang)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 font-display text-base font-semibold text-foreground">
          {lang === "ar" ? "الأوسمة الشائعة" : lang === "fr" ? "Tags populaires" : "Popular Tags"}
        </h4>
        <div className="space-y-1">
          {popularTags.map((tag, i) => {
            const label = lang === "ar" ? tag.labelAr : lang === "fr" ? tag.labelFr : tag.labelEn;
            return (
              <button key={i} className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors">
                <tag.icon className="h-4 w-4 shrink-0 text-accent" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level filter */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 font-display text-base font-semibold text-foreground">{t("catalog.level")}</h4>
        <div className="space-y-2">
          {levels.map((lvl) => (
            <label key={lvl} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedLevels.includes(lvl)}
                onCheckedChange={() => toggleFilter(selectedLevels, lvl, setSelectedLevels)} />
              <span className="text-foreground">{levelLabels[lvl][lang] || lvl}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 font-display text-base font-semibold text-foreground">{t("catalog.price")}</h4>
        <Slider min={0} max={maxPrice} step={500} value={priceRange}
          onValueChange={(v) => { setPriceRange(v); setPage(1); }} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString()} {lang === "ar" ? "د.ج" : "DZD"}</span>
          <span>{priceRange[1].toLocaleString()} {lang === "ar" ? "د.ج" : "DZD"}</span>
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="w-full gap-1 text-muted-foreground" onClick={clearFilters}>
          <X className="h-3 w-3" /> {t("catalog.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Top bar: search + filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={lang === "ar" ? "بحث عن دورة..." : lang === "fr" ? "Rechercher un cours..." : "Search for a course..."}
              className="w-full rounded-lg border border-border bg-card py-2.5 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {/* Filter chips */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 text-sm">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {lang === "ar" ? "الفئات" : lang === "fr" ? "Catégories" : "Categories"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-sm">
              {t("catalog.level")}
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-sm">
              {t("catalog.price")}
            </Button>
          </div>

          {/* Mobile filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-80 overflow-y-auto">
              <h3 className="mb-4 text-lg font-semibold">{t("catalog.filters")}</h3>
              <CategoriesSidebar />
            </SheetContent>
          </Sheet>

          {/* Pagination nav (top) */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 ms-auto">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="gap-1">
                {lang === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {lang === "ar" ? "السابق" : lang === "fr" ? "Précédent" : "Previous"}
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                {lang === "ar" ? `إلى ${page}` : `${page}`}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="gap-1">
                {lang === "ar" ? "التالي" : lang === "fr" ? "Suivant" : "Next"}
                {lang === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Course grid — main content */}
          <div className="flex-1">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground">{t("common.loading")}</div>
            ) : paged.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paged.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <CourseCard course={c} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <h3 className="mb-2 font-display text-lg font-semibold">{t("catalog.noResults")}</h3>
                <p className="text-sm text-muted-foreground">{t("catalog.noResultsDesc")}</p>
              </div>
            )}

            {/* Bottom pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  {lang === "ar" ? "السابق" : lang === "fr" ? "Précédent" : "Previous"}
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <Button key={p} variant={p === page ? "default" : "outline"} size="sm"
                    className={p === page ? "gradient-purple text-primary-foreground" : ""}
                    onClick={() => setPage(p)}>
                    {p}
                  </Button>
                ))}
                {totalPages > 5 && <span className="text-muted-foreground">...</span>}
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  {lang === "ar" ? "التالي" : lang === "fr" ? "Suivant" : "Next"}
                </Button>
              </div>
            )}
          </div>

          {/* Desktop sidebar — right side */}
          <aside className="hidden lg:block w-72 shrink-0">
            <CategoriesSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
