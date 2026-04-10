import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Search, Eye, FileText, Plus } from "lucide-react";
import { algerianWilayas } from "@/data/algerianWilayas";

export default function OrdersManagement() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  // Add order state
  const [addOpen, setAddOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ full_name: "", phone: "", wilaya_code: 0, wilaya_name: "", baladiya: "", course_id: "", order_status: "pending" });
  const [addingOrder, setAddingOrder] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders").select("*, courses(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["all-courses-list"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, title").order("title");
      return data || [];
    },
  });

  const { data: agents } = useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles").select("user_id, profiles:user_id(id, name)")
        .eq("role", "confirmation_agent");
      return data?.map(r => (r.profiles as any)) || [];
    },
  });

  const assignAgent = useMutation({
    mutationFn: async ({ orderId, agentId }: { orderId: string; agentId: string }) => {
      const { error } = await supabase.from("orders").update({ assigned_agent_id: agentId }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success(t("تم تعيين الوكيل ✅", "Agent assigné ✅", "Agent assigned ✅")); },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const update: any = { order_status: status };
      if (status === "confirmed") update.confirmed_at = new Date().toISOString();
      const { error } = await supabase.from("orders").update(update).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success(t("تم تحديث الحالة ✅", "Statut mis à jour ✅", "Status updated ✅")); },
  });

  const saveNote = useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes: string }) => {
      const { error } = await supabase.from("orders").update({ notes }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success(t("تم حفظ الملاحظة", "Note enregistrée", "Note saved")); },
  });

  const handleAddOrder = async () => {
    if (!newOrder.full_name || !newOrder.phone || !newOrder.wilaya_code) {
      toast.error(t("الاسم والهاتف والولاية مطلوبة", "Nom, téléphone et wilaya requis", "Name, phone and wilaya required"));
      return;
    }
    setAddingOrder(true);
    try {
      const { error } = await supabase.from("orders").insert({
        full_name: newOrder.full_name,
        phone: newOrder.phone,
        wilaya_code: newOrder.wilaya_code,
        wilaya_name: newOrder.wilaya_name,
        baladiya: newOrder.baladiya,
        course_id: newOrder.course_id || null,
        order_status: newOrder.order_status,
      });
      if (error) throw error;
      toast.success(t("تم إنشاء الطلب ✅", "Commande créée ✅", "Order created ✅"));
      setAddOpen(false);
      setNewOrder({ full_name: "", phone: "", wilaya_code: 0, wilaya_name: "", baladiya: "", course_id: "", order_status: "pending" });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setAddingOrder(false);
    }
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>;

  const filtered = orders?.filter(o =>
    !search || o.full_name.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search)
  ) || [];

  const byStatus = (s?: string) => s ? filtered.filter(o => o.order_status === s) : filtered;

  const statusBadge = (s: string) => {
    if (s === "confirmed") return <Badge className="bg-green-100 text-green-700 border-0 text-xs">{t("مؤكد", "Confirmé", "Confirmed")}</Badge>;
    if (s === "pending") return <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">{t("قيد الانتظار", "En attente", "Pending")}</Badge>;
    if (s === "cancelled") return <Badge className="bg-red-100 text-red-700 border-0 text-xs">{t("ملغى", "Annulé", "Cancelled")}</Badge>;
    if (s === "called") return <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{t("تم الاتصال", "Appelé", "Called")}</Badge>;
    return <Badge variant="outline" className="text-xs capitalize">{s}</Badge>;
  };

  const OrderTable = ({ items }: { items: typeof filtered }) => (
    <div className="rounded-2xl bg-white border border-border/50 overflow-x-auto shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">{t("الاسم", "Nom", "Name")}</TableHead>
            <TableHead className="text-xs">{t("الهاتف", "Téléphone", "Phone")}</TableHead>
            <TableHead className="text-xs">{t("الدورة", "Cours", "Course")}</TableHead>
            <TableHead className="text-xs">{t("الولاية", "Wilaya", "Wilaya")}</TableHead>
            <TableHead className="text-xs">{t("الحالة", "Statut", "Status")}</TableHead>
            <TableHead className="text-xs">{t("الوكيل", "Agent", "Agent")}</TableHead>
            <TableHead className="text-xs">{t("التاريخ", "Date", "Date")}</TableHead>
            <TableHead className="text-xs">{t("إجراءات", "Actions", "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(o => (
            <TableRow key={o.id} className="hover:bg-purple-50/30">
              <TableCell className="font-medium text-sm">{o.full_name}</TableCell>
              <TableCell dir="ltr" className="text-sm"><a href={`tel:${o.phone}`} className="text-primary hover:underline">{o.phone}</a></TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">{(o.courses as any)?.title || "—"}</TableCell>
              <TableCell className="text-sm">{o.wilaya_name}</TableCell>
              <TableCell>{statusBadge(o.order_status)}</TableCell>
              <TableCell>
                <Select onValueChange={val => assignAgent.mutate({ orderId: o.id, agentId: val })} value={o.assigned_agent_id || ""}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder={t("تعيين", "Assigner", "Assign")} /></SelectTrigger>
                  <SelectContent>{agents?.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => { setSelectedOrder(o); setNoteText(o.notes || ""); }}>
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow><TableCell colSpan={8} className="py-12 text-center">
              <FileText className="mx-auto mb-2 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">{t("لا توجد طلبات", "Aucune commande", "No orders")}</p>
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("إدارة الطلبات", "Gestion des commandes", "Orders Management")}</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white">
              <Plus className="h-4 w-4" />
              {t("إضافة طلب", "Ajouter une commande", "Add Order")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("إنشاء طلب يدوياً", "Créer une commande", "Create Order Manually")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>{t("الاسم الكامل", "Nom complet", "Full Name")} *</Label>
                <Input value={newOrder.full_name} onChange={e => setNewOrder(p => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div>
                <Label>{t("رقم الهاتف", "Téléphone", "Phone")} *</Label>
                <Input dir="ltr" value={newOrder.phone} onChange={e => setNewOrder(p => ({ ...p, phone: e.target.value }))} placeholder="05XXXXXXXX" />
              </div>
              <div>
                <Label>{t("الولاية", "Wilaya", "Wilaya")} *</Label>
                <Select onValueChange={val => {
                  const w = algerianWilayas.find(w => w.code === Number(val));
                  setNewOrder(p => ({ ...p, wilaya_code: Number(val), wilaya_name: w?.name || "" }));
                }}>
                  <SelectTrigger><SelectValue placeholder={t("اختر الولاية", "Choisir la wilaya", "Select Wilaya")} /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {algerianWilayas.map(w => <SelectItem key={w.code} value={String(w.code)}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("البلدية", "Commune", "Baladiya")}</Label>
                <Input value={newOrder.baladiya} onChange={e => setNewOrder(p => ({ ...p, baladiya: e.target.value }))} />
              </div>
              <div>
                <Label>{t("الدورة", "Cours", "Course")}</Label>
                <Select onValueChange={val => setNewOrder(p => ({ ...p, course_id: val }))}>
                  <SelectTrigger><SelectValue placeholder={t("اختر الدورة", "Choisir le cours", "Select Course")} /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {courses?.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("الحالة", "Statut", "Status")}</Label>
                <Select value={newOrder.order_status} onValueChange={val => setNewOrder(p => ({ ...p, order_status: val }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t("قيد الانتظار", "En attente", "Pending")}</SelectItem>
                    <SelectItem value="called">{t("تم الاتصال", "Appelé", "Called")}</SelectItem>
                    <SelectItem value="confirmed">{t("مؤكد", "Confirmé", "Confirmed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white" onClick={handleAddOrder} disabled={addingOrder}>
                {addingOrder ? t("جارٍ الإنشاء...", "Création...", "Creating...") : t("إنشاء الطلب", "Créer la commande", "Create Order")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("بحث بالاسم أو الهاتف...", "Rechercher par nom ou téléphone...", "Search by name or phone...")}
          className="ps-10 rounded-xl bg-white" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="bg-white border border-border/50 rounded-xl p-1">
          <TabsTrigger value="pending" className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            {t("قيد الانتظار", "En attente", "Pending")} ({byStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="called" className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            {t("تم الاتصال", "Appelé", "Called")} ({byStatus("called").length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            {t("مؤكد", "Confirmé", "Confirmed")} ({byStatus("confirmed").length})
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            {t("الكل", "Tout", "All")} ({filtered.length})
          </TabsTrigger>
        </TabsList>
        {["pending", "called", "confirmed", "all"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <OrderTable items={byStatus(tab === "all" ? undefined : tab)} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Detail Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={open => { if (!open) setSelectedOrder(null); }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>{t("تفاصيل الطلب", "Détails de la commande", "Order Details")}</SheetTitle></SheetHeader>
          {selectedOrder && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-secondary/30 p-4 space-y-2">
                <p className="text-sm"><span className="font-medium">{t("الاسم", "Nom", "Name")}:</span> {selectedOrder.full_name}</p>
                <p className="text-sm"><span className="font-medium">{t("الهاتف", "Tél", "Phone")}:</span> <a href={`tel:${selectedOrder.phone}`} className="text-primary">{selectedOrder.phone}</a></p>
                <p className="text-sm"><span className="font-medium">{t("الولاية", "Wilaya", "Wilaya")}:</span> {selectedOrder.wilaya_name}</p>
                <p className="text-sm"><span className="font-medium">{t("البلدية", "Commune", "Baladiya")}:</span> {selectedOrder.baladiya}</p>
                <p className="text-sm"><span className="font-medium">{t("الدورة", "Cours", "Course")}:</span> {(selectedOrder.courses as any)?.title || "—"}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{t("تغيير الحالة", "Changer le statut", "Change Status")}</p>
                <div className="flex gap-2 flex-wrap">
                  {["pending", "called", "confirmed", "cancelled"].map(s => (
                    <Button key={s} size="sm" variant={selectedOrder.order_status === s ? "default" : "outline"}
                      className="text-xs capitalize" onClick={() => { updateStatus.mutate({ orderId: selectedOrder.id, status: s }); setSelectedOrder({ ...selectedOrder, order_status: s }); }}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{t("ملاحظات", "Notes", "Notes")}</p>
                <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} className="rounded-xl" />
                <Button size="sm" className="mt-2 w-full" onClick={() => saveNote.mutate({ orderId: selectedOrder.id, notes: noteText })}>
                  {t("حفظ الملاحظة", "Enregistrer", "Save Note")}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
