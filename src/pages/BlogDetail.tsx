import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function BlogDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles:author_id(name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-12"><Skeleton className="h-96 rounded-xl" /></div>;

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("common.notFound")}</h1>
          <Link to="/blog"><Button className="mt-4">{t("blog.backToBlog")}</Button></Link>
        </div>
      </div>
    );
  }

  const title = getLocalized(post, "title", lang);
  const content = getLocalized(post, "content", lang);

  return (
    <div className="bg-background py-12">
      <div className="container max-w-3xl">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {t("blog.backToBlog")}
        </Link>

        {post.cover_image && (
          <img src={post.cover_image} alt={title} className="mb-6 w-full rounded-xl object-cover" style={{ maxHeight: 400 }} />
        )}

        <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {(post.profiles as any)?.name || "Maisy Academy"}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
        </div>

        <div className="prose prose-green mt-8 max-w-none">
          {content.split("\n\n").map((block: string, i: number) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="mt-6 text-xl font-bold">{block.replace("## ", "")}</h2>
            ) : (
              <p key={i}>{block}</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
