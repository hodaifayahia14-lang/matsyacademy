import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === "ar";
  const [search, setSearch] = useState("");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles:author_id(name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = posts?.filter((p: any) => {
    if (!search) return true;
    const title = getLocalized(p, "title", lang).toLowerCase();
    const excerpt = getLocalized(p, "excerpt", lang).toLowerCase();
    return title.includes(search.toLowerCase()) || excerpt.includes(search.toLowerCase());
  });

  const featured = filtered?.[0];
  const rest = filtered?.slice(1) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]" dir={isRtl ? "rtl" : "ltr"}>
        <Skeleton className="h-80 w-full" />
        <div className="container py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]" dir={isRtl ? "rtl" : "ltr"}>
      {/* Featured Hero */}
      {featured && (
        <div className="relative h-[380px] overflow-hidden bg-gradient-to-br from-[#5B2D8E] to-[#3a1d5e]">
          {featured.cover_image && (
            <img
              src={featured.cover_image}
              alt={getLocalized(featured, "title", lang)}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              loading="eager"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="container relative flex h-full flex-col items-center justify-end pb-10 text-center text-white">
            <h1 className="mb-3 max-w-3xl font-display text-3xl font-bold md:text-4xl" style={{ color: "#C9971C" }}>
              {getLocalized(featured, "title", lang)}
            </h1>
            <p className="mb-5 max-w-2xl text-sm text-white/90">
              {getLocalized(featured, "excerpt", lang)}
            </p>
            <Link to={`/blog/${featured.id}`}>
              <Button className="border-2 border-[#C9971C] bg-transparent px-8 text-[#C9971C] hover:bg-[#C9971C] hover:text-white">
                {isRtl ? "اقرأ المزيد" : lang === "fr" ? "Lire la suite" : "Read More"}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Posts Grid */}
          <div className="flex-1">
            {!filtered?.length && (
              <p className="py-12 text-center text-muted-foreground">
                {isRtl ? "لا توجد مقالات بعد. تحقق لاحقاً!" : "No blog posts yet. Check back soon!"}
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post: any) => {
                const title = getLocalized(post, "title", lang);
                return (
                  <Link key={post.id} to={`/blog/${post.id}`} className="group">
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={post.cover_image || "/placeholder.svg"}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <p className="mb-2 text-xs text-muted-foreground">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString(isRtl ? "ar-DZ" : undefined) : ""}
                        </p>
                        <h3 className="mb-1 text-sm font-bold leading-snug text-foreground group-hover:text-[#5B2D8E] transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <span className="text-xs font-semibold text-[#C9971C]">
                          {isRtl ? "اقرأ المزيد" : lang === "fr" ? "Lire la suite" : "Read More"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72">
            {/* Search */}
            <div className="rounded-xl border bg-white p-4">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={isRtl ? "ابحث في المدونة..." : "Search blog..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-9"
                />
              </div>
            </div>

            {/* Recent Posts */}
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-4 text-center text-lg font-bold text-[#5B2D8E]">
                {isRtl ? "آخر المقالات" : lang === "fr" ? "Articles récents" : "Recent Posts"}
              </h3>
              <div className="space-y-3">
                {posts?.slice(0, 3).map((p: any) => (
                  <Link key={p.id} to={`/blog/${p.id}`} className="flex items-center gap-3 group">
                    <img
                      src={p.cover_image || "/placeholder.svg"}
                      alt=""
                      className="h-12 w-16 shrink-0 rounded-lg object-cover bg-muted"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                    <p className="text-xs font-medium leading-snug text-foreground group-hover:text-[#5B2D8E] line-clamp-2">
                      {getLocalized(p, "title", lang)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories placeholder */}
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 text-center text-lg font-bold text-[#5B2D8E]">
                {isRtl ? "الفئات" : lang === "fr" ? "Catégories" : "Categories"}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="text-center text-xs">{isRtl ? "قريباً..." : "Coming soon..."}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
