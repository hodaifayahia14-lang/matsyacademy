import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CategoriesManagement() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("categories").update({ name, slug, icon }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({ name, slug, icon });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category saved");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
  });

  const resetForm = () => { setName(""); setSlug(""); setIcon(""); setEditingId(null); setOpen(false); };

  const startEdit = (cat: any) => {
    setName(cat.name); setSlug(cat.slug); setIcon(cat.icon || ""); setEditingId(cat.id); setOpen(true);
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.admin.categories")}</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> {t("dashboard.admin.addCategory")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? t("common.edit") : t("dashboard.admin.addCategory")}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.categoryName")}</label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.categorySlug")}</label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.categoryIcon")}</label><Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Monitor" /></div>
              <Button onClick={() => saveMutation.mutate()} disabled={!name || !slug}>{t("common.save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.admin.categoryName")}</TableHead>
              <TableHead>{t("dashboard.admin.categorySlug")}</TableHead>
              <TableHead>{t("dashboard.admin.categoryIcon")}</TableHead>
              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="text-muted-foreground">{cat.icon}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
