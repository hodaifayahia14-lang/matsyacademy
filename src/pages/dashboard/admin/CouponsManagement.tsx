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
import { Plus, Trash2 } from "lucide-react";

export default function CouponsManagement() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(10);
  const [expiryDate, setExpiryDate] = useState("");
  const [maxUses, setMaxUses] = useState<number | "">("");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("coupons").insert({
        code,
        discount_type: discountType,
        value,
        expiry_date: expiryDate || null,
        max_uses: maxUses || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created");
      setOpen(false);
      setCode(""); setValue(10); setExpiryDate(""); setMaxUses("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.admin.coupons")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> {t("dashboard.admin.addCoupon")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("dashboard.admin.addCoupon")}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.couponCode")}</label><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} /></div>
              <div>
                <label className="mb-1 block text-sm font-medium">{t("dashboard.admin.discountType")}</label>
                <select className="w-full rounded-lg border bg-card px-3 py-2 text-sm" value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}>
                  <option value="percentage">{t("dashboard.admin.percentage")}</option>
                  <option value="fixed">{t("dashboard.admin.fixed")}</option>
                </select>
              </div>
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.discountValue")}</label><Input type="number" value={value} onChange={(e) => setValue(+e.target.value)} /></div>
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.expiryDate")}</label><Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} /></div>
              <div><label className="mb-1 block text-sm font-medium">{t("dashboard.admin.maxUses")}</label><Input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value ? +e.target.value : "")} /></div>
              <Button onClick={() => createMutation.mutate()} disabled={!code}>{t("common.save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.admin.couponCode")}</TableHead>
              <TableHead>{t("dashboard.admin.discountType")}</TableHead>
              <TableHead>{t("dashboard.admin.discountValue")}</TableHead>
              <TableHead>{t("dashboard.admin.usesCount")}</TableHead>
              <TableHead>{t("dashboard.admin.expiryDate")}</TableHead>
              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                <TableCell className="capitalize">{c.discount_type}</TableCell>
                <TableCell>{c.discount_type === "percentage" ? `${c.value}%` : `$${c.value}`}</TableCell>
                <TableCell>{c.uses_count}{c.max_uses ? `/${c.max_uses}` : ""}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
