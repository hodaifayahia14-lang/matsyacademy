import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Mail, Eye, Trash2, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MessagesManagement() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("contact_messages").update({ status: "read" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); },
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-messages"] }); toast.success(t("تم الحذف", "Supprimé", "Deleted")); },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;

  const unread = messages?.filter((m: any) => m.status === "unread") || [];
  const read = messages?.filter((m: any) => m.status !== "unread") || [];

  const MsgTable = ({ items }: { items: any[] }) => (
    <div className="rounded-2xl bg-white border border-border/50 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs">{t("الاسم", "Nom", "Name")}</TableHead>
            <TableHead className="text-xs">{t("البريد", "Email", "Email")}</TableHead>
            <TableHead className="text-xs">{t("الموضوع", "Sujet", "Subject")}</TableHead>
            <TableHead className="text-xs">{t("التاريخ", "Date", "Date")}</TableHead>
            <TableHead className="text-xs">{t("الحالة", "Statut", "Status")}</TableHead>
            <TableHead className="text-xs">{t("إجراءات", "Actions", "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((m: any) => (
            <TableRow key={m.id} className={`hover:bg-purple-50/30 cursor-pointer ${m.status === "unread" ? "font-semibold" : ""}`}>
              <TableCell className="text-sm">{m.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{m.subject || "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {m.status === "unread"
                  ? <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{t("غير مقروءة", "Non lu", "Unread")}</Badge>
                  : <Badge variant="outline" className="text-xs">{t("مقروءة", "Lu", "Read")}</Badge>}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setSelected(m); if (m.status === "unread") markRead.mutate(m.id); }}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMsg.mutate(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow><TableCell colSpan={6} className="py-12 text-center">
              <Mail className="mx-auto mb-2 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">{t("لا توجد رسائل", "Aucun message", "No messages")}</p>
            </TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" /> {t("الرسائل", "Messages", "Messages")}
          {unread.length > 0 && <Badge className="bg-destructive text-white border-0">{unread.length}</Badge>}
        </h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-white border border-border/50 rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg text-xs">{t("الكل", "Tout", "All")} ({messages?.length || 0})</TabsTrigger>
          <TabsTrigger value="unread" className="rounded-lg text-xs">{t("غير مقروءة", "Non lu", "Unread")} ({unread.length})</TabsTrigger>
          <TabsTrigger value="read" className="rounded-lg text-xs">{t("مقروءة", "Lu", "Read")} ({read.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><MsgTable items={messages || []} /></TabsContent>
        <TabsContent value="unread"><MsgTable items={unread} /></TabsContent>
        <TabsContent value="read"><MsgTable items={read} /></TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>{t("تفاصيل الرسالة", "Détails du message", "Message Details")}</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-secondary/30 p-4 space-y-2">
                <p className="text-sm"><span className="font-medium">{t("الاسم", "Nom", "Name")}:</span> {selected.name}</p>
                <p className="text-sm"><span className="font-medium">{t("البريد", "Email", "Email")}:</span> <a href={`mailto:${selected.email}`} className="text-primary">{selected.email}</a></p>
                {selected.phone && <p className="text-sm"><span className="font-medium">{t("الهاتف", "Tél", "Phone")}:</span> {selected.phone}</p>}
                {selected.subject && <p className="text-sm"><span className="font-medium">{t("الموضوع", "Sujet", "Subject")}:</span> {selected.subject}</p>}
                <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
