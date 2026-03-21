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
import { Plus, Pencil, Trash2, icons } from "lucide-react";
import IconPicker from "@/components/IconPicker";

export default function CategoriesManagement() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const qc = useQueryClient();
  const [nameEn, setNameEn] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
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
      const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = { name: nameEn, name_en: nameEn, name_fr: nameFr, name_ar: nameAr, slug, icon };
      if (editingId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(t("common.success"));
      resetForm();
    },
    onError: () => toast.error(t("common.error")),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(t("common.success"));
    },
  });

  const resetForm = () => { setNameEn(""); setNameFr(""); setNameAr(""); setIcon(""); setEditingId(null); setOpen(false); };

  const startEdit = (cat: any) => {
    setNameEn(cat.name_en || cat.name || "");
    setNameFr(cat.name_fr || "");
    setNameAr(cat.name_ar || "");
    setIcon(cat.icon || "");
    setEditingId(cat.id);
    setOpen(true);
  };

  const getCatName = (cat: any) => {
    if (lang === "ar") return cat.name_ar || cat.name;
    if (lang === "fr") return cat.name_fr || cat.name;
    return cat.name_en || cat.name;
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.admin.categories")}</h1>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="me-1 h-4 w-4" /> {t("dashboard.admin.addCategory")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editingId ? t("common.edit") : t("dashboard.admin.addCategory")}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">English Name</label>
                <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. HSE Safety" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Nom en Français</label>
                <Input value={nameFr} onChange={(e) => setNameFr(e.target.value)} placeholder="e.g. Sécurité HSE" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">الاسم بالعربية</label>
                <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: أمن ووقاية" dir="rtl" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">{t("dashboard.admin.categoryIcon")}</label>
                <IconPicker value={icon} onChange={setIcon} />
              </div>
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={!nameEn} className="w-full">{t("common.save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{lang === "ar" ? "الاسم" : lang === "fr" ? "Nom" : "Name"}</TableHead>
              <TableHead>English</TableHead>
              <TableHead>Français</TableHead>
              <TableHead>العربية</TableHead>
              <TableHead>{t("dashboard.admin.categoryIcon")}</TableHead>
              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{getCatName(cat)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{cat.name_en || cat.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{cat.name_fr || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-sm" dir="rtl">{cat.name_ar || "—"}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cat.icon && icons[cat.icon] ? (() => { const I = icons[cat.icon]; return <span className="inline-flex items-center gap-1"><I className="h-4 w-4" /> {cat.icon}</span>; })() : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!categories?.length && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{t("catalog.noResults")}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
