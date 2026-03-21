import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";
import { motion } from "framer-motion";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const priceFilters = ["All", "Free", "Paid"];
const languages = ["All", "English", "French", "Arabic"];
const sortOptions = ["Newest", "Most Popular", "Highest Rated"];

const PER_PAGE = 21;

export default function CourseCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [level, setLevel] = useState("All Levels");
  const [price, setPrice] = useState("All");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockCourses];
    if (search) result = result.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((c) => c.category === category);
    if (level !== "All Levels") result = result.filter((c) => c.level === level);
    if (price === "Free") result = result.filter((c) => c.isFree);
    if (price === "Paid") result = result.filter((c) => !c.isFree);
    if (language !== "All") result = result.filter((c) => c.language === language);
    if (sort === "Most Popular") result.sort((a, b) => b.studentCount - a.studentCount);
    if (sort === "Highest Rated") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, category, level, price, language, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasFilters = category !== "All" || level !== "All Levels" || price !== "All" || language !== "All" || search;

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setLevel("All Levels"); setPrice("All"); setLanguage("All"); setPage(1);
    setSearchParams({});
  };

  const Select = ({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => { onChange(e.target.value); setPage(1); }}
        className="w-full rounded-lg border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-hero-gradient py-12">
        <div className="container text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-primary-foreground">Course Catalog</h1>
          <p className="text-primary-foreground/70">Discover {mockCourses.length}+ courses to boost your skills</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search courses..."
                className="w-full rounded-lg border bg-card py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <Button variant="outline" className="gap-2 md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <div className={`grid grid-cols-2 gap-3 md:flex md:gap-3 ${showFilters ? "" : "hidden md:flex"}`}>
            <Select value={category} onChange={setCategory} options={["All", ...mockCategories.map((c) => c.name)]} label="Category" />
            <Select value={level} onChange={setLevel} options={levels} label="Level" />
            <Select value={price} onChange={setPrice} options={priceFilters} label="Price" />
            <Select value={language} onChange={setLanguage} options={languages} label="Language" />
            <Select value={sort} onChange={setSort} options={sortOptions} label="Sort By" />
          </div>
        </div>

        {hasFilters && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3 w-3" /> Clear all filters
            </Button>
          </div>
        )}

        {/* Results */}
        <p className="mb-6 text-sm text-muted-foreground">{filtered.length} courses found</p>

        {paginated.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-2 font-display text-lg font-semibold">No courses found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
