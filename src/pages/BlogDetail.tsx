import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function BlogDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === "ar";

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

  const { data: relatedPosts } = useQuery({
    queryKey: ["blog-related", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles:author_id(name)")
        .eq("status", "published")
        .neq("id", id!)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen bg-[#f5f0eb]"><Skeleton className="h-96 w-full" /></div>;

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
  const authorName = (post.profiles as any)?.name || "Maisy Academy";
  const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString(isRtl ? "ar-DZ" : undefined) : "";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const renderContent = (text: string) => {
    return text.split("\n\n").map((block: string, i: number) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="mt-8 mb-4 text-xl font-bold" style={{ color: "#C9971C" }}>{block.replace("## ", "")}</h2>;
      }
      if (block.startsWith("> ")) {
        return (
          <blockquote key={i} className="my-6 rounded-xl border-2 border-[#C9971C] bg-[#C9971C]/5 p-5" dir={isRtl ? "rtl" : "ltr"}>
            <span className="text-3xl font-bold text-[#C9971C]">"</span>
            <p className="text-sm font-medium text-foreground">{block.replace("> ", "")}</p>
          </blockquote>
        );
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* "));
        return (
          <ul key={i} className="my-4 space-y-2">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5B2D8E]" />
                {item.replace(/^[-*] /, "")}
              </li>
            ))}
          </ul>
        );
      }
      return <p key={i} className="mb-4 text-sm leading-relaxed text-foreground/80">{block}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]" dir={isRtl ? "rtl" : "ltr"}>
      {/* Purple Header */}
      <div className="bg-[#5B2D8E] py-8 text-center text-white">
        <div className="container max-w-4xl">
          <h1 className="mb-3 font-display text-2xl font-bold md:text-3xl" style={{ color: "#C9971C" }}>
            {title}
          </h1>
          <p className="text-sm text-white/80">
            {isRtl ? `تاريخ النشر: ${publishedDate} - كتب بواسطة: ${authorName}` : `Published: ${publishedDate} - By: ${authorName}`}
          </p>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="container max-w-4xl -mt-0">
          <img src={post.cover_image} alt={title} className="w-full rounded-b-xl object-cover" style={{ maxHeight: 400 }} />
        </div>
      )}

      {/* Content + Sidebar */}
      <div className="container py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <article className="flex-1">
            <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
              {renderContent(content)}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72">
            {/* Most Read */}
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-4 text-center text-lg font-bold" style={{ color: "#C9971C" }}>
                {isRtl ? "الأكثر قراءة" : lang === "fr" ? "Les plus lus" : "Most Read"}
              </h3>
              <div className="space-y-3">
                {relatedPosts?.map((p: any) => (
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

            {/* Newsletter */}
            <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "#C9971C" }}>
              <h3 className="mb-3 text-base font-bold text-white">
                {isRtl ? "اشترك في نشرتنا الإخبارية" : "Subscribe to Newsletter"}
              </h3>
              <Input
                placeholder={isRtl ? "البريد الإلكتروني المعتمد..." : "Your email..."}
                className="mb-3 bg-white text-center text-sm"
              />
              <Button className="w-full bg-white text-[#C9971C] hover:bg-white/90 font-bold">
                {isRtl ? "اشترك" : "Subscribe"}
              </Button>
            </div>

            {/* Share */}
            <div className="rounded-xl border bg-white p-4 text-center">
              <h3 className="mb-3 text-sm font-bold text-foreground">
                {isRtl ? "شارك المقال:" : "Share this article:"}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <a href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href={`https://instagram.com`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white hover:opacity-80">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href={`https://linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
