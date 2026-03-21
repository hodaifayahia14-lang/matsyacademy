import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface BlogForm {
  title_en: string; title_fr: string; title_ar: string;
  excerpt_en: string; excerpt_fr: string; excerpt_ar: string;
  content_en: string; content_fr: string; content_ar: string;
  cover_image: string;
}

const emptyForm: BlogForm = {
  title_en: "", title_fr: "", title_ar: "",
  excerpt_en: "", excerpt_fr: "", excerpt_ar: "",
  content_en: "", content_fr: "", content_ar: "",
  cover_image: "",
};

export default function BlogManagement() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles:author_id(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("blog_posts").update({ ...form }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert({ ...form, author_id: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success(editId ? "Post updated" : "Post created");
      setOpen(false);
      setForm(emptyForm);
      setEditId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({
        status: published ? "published" : "draft",
        published_at: published ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Status updated");
    },
  });

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Post deleted");
    },
  });

  const openEdit = (post: any) => {
    setEditId(post.id);
    setForm({
      title_en: post.title_en, title_fr: post.title_fr, title_ar: post.title_ar,
      excerpt_en: post.excerpt_en, excerpt_fr: post.excerpt_fr, excerpt_ar: post.excerpt_ar,
      content_en: post.content_en, content_fr: post.content_fr, content_ar: post.content_ar,
      cover_image: post.cover_image || "",
    });
    setOpen(true);
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const set = (k: keyof BlogForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("navbar.blog")} Management</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input placeholder="Title (EN)" value={form.title_en} onChange={set("title_en")} />
                <Input placeholder="Titre (FR)" value={form.title_fr} onChange={set("title_fr")} />
                <Input placeholder="العنوان (AR)" value={form.title_ar} onChange={set("title_ar")} dir="rtl" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input placeholder="Excerpt (EN)" value={form.excerpt_en} onChange={set("excerpt_en")} />
                <Input placeholder="Extrait (FR)" value={form.excerpt_fr} onChange={set("excerpt_fr")} />
                <Input placeholder="المقتطف (AR)" value={form.excerpt_ar} onChange={set("excerpt_ar")} dir="rtl" />
              </div>
              <Input placeholder="Cover Image URL" value={form.cover_image} onChange={set("cover_image")} />
              <Textarea placeholder="Content (EN)" rows={5} value={form.content_en} onChange={set("content_en")} />
              <Textarea placeholder="Contenu (FR)" rows={5} value={form.content_fr} onChange={set("content_fr")} />
              <Textarea placeholder="المحتوى (AR)" rows={5} value={form.content_ar} onChange={set("content_ar")} dir="rtl" />
              <Button onClick={() => upsert.mutate()} disabled={!form.title_en} className="w-full">
                {editId ? "Update" : "Create"} Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead>{t("common.date")}</TableHead>
              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-xs">
                  <p className="truncate font-medium">{p.title_en || p.title_fr || p.title_ar}</p>
                </TableCell>
                <TableCell className="text-sm">{(p.profiles as any)?.name || "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "published" ? "default" : "outline"} className="text-xs capitalize">
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => togglePublish.mutate({ id: p.id, published: p.status !== "published" })}>
                      {p.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteBlog.mutate(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) || []}
            {!posts?.length && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No blog posts yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
