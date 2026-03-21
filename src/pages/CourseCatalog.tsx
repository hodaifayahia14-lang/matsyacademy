import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X, Book, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";
import { motion } from "framer-motion";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

const levels = ["Beginner", "Intermediate", "Advanced"];
const levelLabels: Record<string, Record<string, string>> = {
  Beginner: { en: "Beginner", fr: "Débutant", ar: "مبتدئ" },
  Intermediate: { en: "Intermediate", fr: "Intermédiaire", ar: "متوسط" },
  Advanced: { en: "Advanced", fr: "Avancé", ar: "متقدم" },
};

export default function CourseCatalog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 25000]);

  const maxPrice = Math.max(...mockCourses.map(c => c.price), 25000);

  const filtered = useMemo(() => {
    let result = [...mockCourses];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.title_en.toLowerCase().includes(q) ||
        c.title_fr.toLowerCase().includes(q) ||
        c.title_ar.includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((c) => selectedCategories.includes(c.category));
    }
    if (selectedTypes.length > 0) {
      result = result.filter((c) => selectedTypes.includes(c.type));
    }
    if (selectedLevels.length > 0) {
      result = result.filter((c) => selectedLevels.includes(c.level));
    }
    result = result.filter((c) => c.price >= priceRange[0] && c.price <= priceRange[1]);
    return result;
  }, [search, selectedCategories, selectedTypes, selectedLevels, priceRange]);

  const hasFilters = selectedCategories.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0 || search || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedLevels([]);
    setPriceRange([0, maxPrice]);
  };

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          {lang === "ar" ? "النوع" : lang === "fr" ? "Type" : "Type"}
        </h4>
        <div className="space-y-2">
          {[
            { val: "course", icon: GraduationCap, label: lang === "ar" ? "دورات" : lang === "fr" ? "Cours" : "Courses" },
            { val: "book", icon: Book, label: lang === "ar" ? "كتب" : lang === "fr" ? "Livres" : "Books" },
          ].map(({ val, icon: Icon, label }) => (
            <label key={val} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedTypes.includes(val)}
                onCheckedChange={() => toggleFilter(selectedTypes, val, setSelectedTypes)} />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{label}</span>
              <span className="ms-auto text-xs text-muted-foreground">
                ({mockCourses.filter(c => c.type === val).length})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("catalog.category")}</h4>
        <div className="space-y-2">
          {mockCategories.map((cat) => (
            <label key={cat.name} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={selectedCategories.includes(cat.name)}
                onCheckedChange={() => toggleFilter(selectedCategories, cat.name, setSelectedCategories)} />
              <span className="text-foreground">{getLocalized(cat, "name", lang)}</span>
              <span className="ms-auto text-xs text-muted-foreground">({cat.courseCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("catalog.price")}</h4>
        <Slider min={0} max={maxPrice} step={500} value={priceRange}
          onValueChange={setPriceRange} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString()} {lang === "ar" ? "د.ج" : "DZD"}</span>
          <span>{priceRange[1].toLocaleString()} {lang === "ar" ? "د.ج" : "DZD"}</span>
        </div>
      </div>

      {/* Level */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("catalog.level")}</h4>
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

      {hasFilters && (
        <Button variant="ghost" size="sm" className="w-full gap-1 text-muted-foreground" onClick={clearFilters}>
          <X className="h-3 w-3" /> {t("catalog.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="container text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground">
            {lang === "ar" ? "الدورات والكتب" : lang === "fr" ? "Cours & Livres" : "Courses & Books"}
          </h1>
          <p className="text-primary-foreground/70">
            {t("catalog.subtitle", { count: mockCourses.length })}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search + mobile filter toggle */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full rounded-lg border border-border bg-card py-2.5 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-80 overflow-y-auto">
              <h3 className="mb-4 text-lg font-semibold">{t("catalog.filters")}</h3>
              <FilterPanel />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">{t("catalog.filters")}</h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-muted-foreground">
              {t("catalog.coursesFound", { count: filtered.length })}
            </p>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c, i) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
