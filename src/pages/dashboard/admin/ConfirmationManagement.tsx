import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { UserPlus, Eye, EyeOff, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ConfirmationManagement() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch agents with their compensation
  const { data: agents, isLoading } = useQuery({
    queryKey: ["confirmation-agents"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "confirmation_agent" as any);

      if (!roles?.length) return [];

      const agentIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", agentIds);

      // Fetch compensation - use any to bypass type check since table is new
      const { data: compensations } = await (supabase as any)
        .from("agent_compensation")
        .select("*")
        .in("agent_id", agentIds);

      // Fetch confirmed orders count per agent
      const { data: orders } = await supabase
        .from("orders")
        .select("confirmed_by")
        .eq("order_status", "confirmed")
        .in("confirmed_by", agentIds);

      return profiles?.map(p => ({
        ...p,
        compensation: compensations?.find((c: any) => c.agent_id === p.id) || null,
        confirmed_count: orders?.filter(o => o.confirmed_by === p.id).length || 0,
      })) || [];
    },
  });

  const upsertCompensation = useMutation({
    mutationFn: async ({ agentId, payType, amount }: { agentId: string; payType: string; amount: number }) => {
      const { error } = await (supabase as any)
        .from("agent_compensation")
        .upsert({ agent_id: agentId, pay_type: payType, amount }, { onConflict: "agent_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["confirmation-agents"] });
      toast.success(t("تم تحديث التعويض ✅", "Compensation mise à jour ✅", "Compensation updated ✅"));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleCreateAgent = async () => {
    if (!newName || !newEmail || !newPassword) {
      toast.error(t("جميع الحقول مطلوبة", "Tous les champs requis", "All fields required"));
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newEmail)) {
      toast.error(t("بريد إلكتروني غير صالح", "Email invalide", "Invalid email format"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("كلمة المرور 6 أحرف على الأقل", "Mot de passe min 6 caractères", "Password min 6 chars"));
      return;
    }
    setCreating(true);
    try {
      const res = await supabase.functions.invoke("create-user", {
        body: { email: newEmail, password: newPassword, name: newName, role: "confirmation_agent" },
      });
      if (res.error || res.data?.error) throw new Error(res.data?.error || res.error?.message);
      toast.success(t("تم إنشاء الوكيل ✅", "Agent créé ✅", "Agent created ✅"));
      setAddOpen(false);
      setNewName(""); setNewEmail(""); setNewPassword("");
      qc.invalidateQueries({ queryKey: ["confirmation-agents"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  const initials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "A";

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20 rounded-xl" /><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          {t("إدارة وكلاء التأكيد", "Gestion des agents", "Confirmation Agents")}
        </h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white">
              <UserPlus className="h-4 w-4" />
              {t("إضافة وكيل", "Ajouter un agent", "Add Agent")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("إنشاء وكيل تأكيد", "Créer un agent", "Create Confirmation Agent")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>{t("الاسم الكامل", "Nom complet", "Full Name")}</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ahmed Ben Ali" />
              </div>
              <div>
                <Label>{t("البريد الإلكتروني", "Email", "Email")}</Label>
                <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="agent@example.com" />
              </div>
              <div>
                <Label>{t("كلمة المرور", "Mot de passe", "Password")}</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••" />
                  <Button type="button" variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white" onClick={handleCreateAgent} disabled={creating}>
                {creating ? t("جارٍ الإنشاء...", "Création...", "Creating...") : t("إنشاء الوكيل", "Créer l'agent", "Create Agent")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3"><UserPlus className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("إجمالي الوكلاء", "Total agents", "Total Agents")}</p>
              <p className="text-2xl font-bold">{agents?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("إجمالي التأكيدات", "Total confirmations", "Total Confirmations")}</p>
              <p className="text-2xl font-bold">{agents?.reduce((s, a) => s + a.confirmed_count, 0) || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3"><DollarSign className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{t("وكلاء بتعويض", "Agents avec salaire", "Agents with Pay")}</p>
              <p className="text-2xl font-bold">{agents?.filter(a => a.compensation).length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("الوكلاء والتعويضات", "Agents et compensations", "Agents & Compensation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("الوكيل", "Agent", "Agent")}</TableHead>
                <TableHead>{t("التأكيدات", "Confirmations", "Confirmations")}</TableHead>
                <TableHead>{t("نوع الدفع", "Type de paiement", "Pay Type")}</TableHead>
                <TableHead>{t("المبلغ (د.ج)", "Montant (DZD)", "Amount (DZD)")}</TableHead>
                <TableHead>{t("إجراءات", "Actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents?.map((agent) => (
                <AgentRow key={agent.id} agent={agent} t={t} initials={initials} onSave={upsertCompensation.mutate} />
              ))}
              {!agents?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("لا يوجد وكلاء تأكيد", "Aucun agent", "No confirmation agents")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AgentRow({ agent, t, initials, onSave }: any) {
  const [payType, setPayType] = useState(agent.compensation?.pay_type || "per_confirmation");
  const [amount, setAmount] = useState(agent.compensation?.amount?.toString() || "0");
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    onSave({ agentId: agent.id, payType, amount: parseFloat(amount) || 0 });
    setDirty(false);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={agent.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(agent.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{agent.name}</p>
            <p className="text-xs text-muted-foreground">{agent.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">{agent.confirmed_count}</Badge>
      </TableCell>
      <TableCell>
        <Select value={payType} onValueChange={(v) => { setPayType(v); setDirty(true); }}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_month">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{t("شهري", "Mensuel", "Monthly")}</span>
            </SelectItem>
            <SelectItem value="per_confirmation">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{t("لكل تأكيد", "Par confirmation", "Per Confirmation")}</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          className="w-28 h-8 text-xs"
          value={amount}
          onChange={e => { setAmount(e.target.value); setDirty(true); }}
          min={0}
        />
      </TableCell>
      <TableCell>
        <Button size="sm" className="h-7 text-xs bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white" disabled={!dirty} onClick={handleSave}>
          {t("حفظ", "Enregistrer", "Save")}
        </Button>
      </TableCell>
    </TableRow>
  );
}
