import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";
import { motion } from "framer-motion";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function CourseCatalog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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
    if (category !== "All") result = result.filter((c) => c.category === category);
    return result;
  }, [search, category]);

  const hasFilters = category !== "All" || search;
  const clearFilters = () => { setSearch(""); setCategory("All"); setPage(1); setSearchParams({}); };

  const categoryOptions = ["All", ...mockCategories.map((c) => c.name)];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12">
        <div className="container text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground">{t("catalog.title")}</h1>
          <p className="text-primary-foreground/70">{t("catalog.subtitle", { count: mockCourses.length })}</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t("catalog.searchPlaceholder")}
                className="w-full rounded-lg border bg-card py-2.5 ps-10 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => {
              const catObj = mockCategories.find((c) => c.name === cat);
              const label = cat === "All" ? t("catalog.all") : (catObj ? getLocalized(catObj, "name", lang) : cat);
              return (
                <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {hasFilters && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3 w-3" /> {t("catalog.clearFilters")}
            </Button>
          </div>
        )}

        <p className="mb-6 text-sm text-muted-foreground">{t("catalog.coursesFound", { count: filtered.length })}</p>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
