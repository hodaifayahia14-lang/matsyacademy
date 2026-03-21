import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("navbar.blog")}</h1>
          <p className="text-muted-foreground">{t("blog.subtitle")}</p>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        )}

        {!isLoading && !posts?.length && (
          <p className="text-center text-muted-foreground py-12">No blog posts yet. Check back soon!</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {posts?.map((post: any, i: number) => {
            const title = getLocalized(post, "title", lang);
            const excerpt = getLocalized(post, "excerpt", lang);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.cover_image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{(post.profiles as any)?.name || "Maisy Academy"}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground">{excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
