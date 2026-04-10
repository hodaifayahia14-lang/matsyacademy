import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { Trophy, Gift, Medal, TrendingUp, Users, Award, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentStat { id: string; name: string; total: number; confirmed: number; confirmedWeek: number; confirmedMonth: number; rate: number; }

export default function Leaderboard() {
  const { roles, user } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const isAdmin = roles.includes("admin");
  const qc = useQueryClient();
  const [giftAgent, setGiftAgent] = useState<{ id: string; name: string } | null>(null);
  const [giftName, setGiftName] = useState("");
  const [giftDesc, setGiftDesc] = useState("");
  const [period, setPeriod] = useState<"week" | "month" | "all">("all");

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data: agentRoles } = await supabase.from("user_roles").select("user_id, profiles:user_id(id, name)").eq("role", "confirmation_agent");
      if (!agentRoles?.length) return [];
      const agentIds = agentRoles.map(r => (r.profiles as any).id);
      const { data: orders } = await supabase.from("orders").select("assigned_agent_id, order_status, confirmed_at").in("assigned_agent_id", agentIds);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const stats: AgentStat[] = agentRoles.map(r => {
        const profile = r.profiles as any;
        const agentOrders = (orders || []).filter(o => o.assigned_agent_id === profile.id);
        const confirmed = agentOrders.filter(o => o.order_status === "confirmed");
        return {
          id: profile.id, name: profile.name || "Agent", total: agentOrders.length, confirmed: confirmed.length,
          confirmedWeek: confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= weekAgo).length,
          confirmedMonth: confirmed.filter(o => o.confirmed_at && new Date(o.confirmed_at) >= monthAgo).length,
          rate: agentOrders.length > 0 ? Math.round((confirmed.length / agentOrders.length) * 100) : 0,
        };
      });
      return stats.sort((a, b) => b.confirmed - a.confirmed);
    },
  });

  const awardGift = useMutation({
    mutationFn: async () => {
      if (!giftAgent) return;
      const { error } = await supabase.from("agent_rewards").insert({ agent_id: giftAgent.id, gift_name: giftName, description: giftDesc, awarded_by: user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success(t("تم منح المكافأة! 🎁", "Récompense attribuée! 🎁", "Reward awarded! 🎁")); setGiftAgent(null); setGiftName(""); setGiftDesc(""); qc.invalidateQueries({ queryKey: ["leaderboard"] }); },
  });

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>;

  const sorted = leaderboard ? [...leaderboard].sort((a, b) => {
    if (period === "week") return b.confirmedWeek - a.confirmedWeek;
    if (period === "month") return b.confirmedMonth - a.confirmedMonth;
    return b.confirmed - a.confirmed;
  }) : [];
  const top3 = sorted.slice(0, 3);
  const podiumColors = [
    { bg: "linear-gradient(135deg, #C9971C, #E5B84C)", shadow: "0 8px 30px rgba(201,151,28,0.3)" },
    { bg: "linear-gradient(135deg, #9CA3AF, #D1D5DB)", shadow: "0 8px 20px rgba(156,163,175,0.3)" },
    { bg: "linear-gradient(135deg, #B45309, #D97706)", shadow: "0 8px 20px rgba(180,83,9,0.3)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" style={{ color: "#C9971C" }} /> {t("لوحة المتصدرين", "Classement", "Leaderboard")}
        </h1>
        <Tabs value={period} onValueChange={v => setPeriod(v as any)}>
          <TabsList className="bg-white border border-border/50 rounded-xl p-1">
            <TabsTrigger value="week" className="rounded-lg text-xs">{t("هذا الأسبوع", "Cette semaine", "This Week")}</TabsTrigger>
            <TabsTrigger value="month" className="rounded-lg text-xs">{t("هذا الشهر", "Ce mois", "This Month")}</TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg text-xs">{t("الكل", "Tout", "All Time")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Podium */}
      {top3.length >= 1 && (
        <div className="flex items-end justify-center gap-4 py-6">
          {[1, 0, 2].map(idx => {
            const agent = top3[idx];
            if (!agent) return <div key={idx} className="w-28" />;
            const isFirst = idx === 0;
            const val = period === "week" ? agent.confirmedWeek : period === "month" ? agent.confirmedMonth : agent.confirmed;
            return (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center">
                {isFirst && <Crown className="h-6 w-6 mb-1" style={{ color: "#C9971C" }} />}
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-full text-white font-bold text-lg shadow-lg ${isFirst ? "h-20 w-20" : ""}`}
                  style={{ background: podiumColors[idx]?.bg, boxShadow: podiumColors[idx]?.shadow }}>
                  {agent.name?.charAt(0) || "A"}
                </div>
                <p className="mt-2 text-sm font-bold text-foreground text-center">{agent.name}</p>
                <p className="text-2xl font-bold" style={{ color: "#C9971C" }}>{val}</p>
                <p className="text-xs text-muted-foreground">{t("مؤكد", "confirmés", "confirmed")}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs w-12">#</TableHead>
              <TableHead className="text-xs">{t("الوكيل", "Agent", "Agent")}</TableHead>
              <TableHead className="text-xs">{t("هذا الأسبوع", "Semaine", "Week")}</TableHead>
              <TableHead className="text-xs">{t("هذا الشهر", "Mois", "Month")}</TableHead>
              <TableHead className="text-xs">{t("الكل", "Total", "All Time")}</TableHead>
              <TableHead className="text-xs">{t("المعدل", "Taux", "Rate")}</TableHead>
              {isAdmin && <TableHead className="text-xs">{t("مكافأة", "Récompense", "Reward")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((agent, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const isMe = agent.id === user?.id;
              return (
                <TableRow key={agent.id} className={`${isMe ? "bg-primary/5 border-s-4 border-primary" : ""} ${i < 3 ? "bg-amber-50/30" : ""} hover:bg-purple-50/30`}>
                  <TableCell className="font-bold text-lg">{i < 3 ? medals[i] : i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{agent.name?.charAt(0)}</AvatarFallback></Avatar>
                      <span className="font-medium text-sm">{agent.name}</span>
                      {isMe && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{lang === "ar" ? "👈 أنت" : "You 👈"}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{agent.confirmedWeek}</TableCell>
                  <TableCell className="text-sm">{agent.confirmedMonth}</TableCell>
                  <TableCell className="font-bold text-sm">{agent.confirmed}</TableCell>
                  <TableCell className="text-sm">{agent.rate}%</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Dialog open={giftAgent?.id === agent.id} onOpenChange={open => { if (!open) setGiftAgent(null); }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-xs rounded-lg" onClick={() => setGiftAgent({ id: agent.id, name: agent.name })}>
                            <Gift className="me-1 h-3 w-3" /> {t("مكافأة", "Récompenser", "Reward")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader><DialogTitle>{t("منح مكافأة لـ", "Récompenser", "Award Gift to")} {giftAgent?.name}</DialogTitle></DialogHeader>
                          <div className="space-y-3">
                            <Input placeholder={t("اسم الهدية", "Nom du cadeau", "Gift name")} value={giftName} onChange={e => setGiftName(e.target.value)} className="rounded-xl" />
                            <Textarea placeholder={t("الوصف", "Description", "Description")} value={giftDesc} onChange={e => setGiftDesc(e.target.value)} className="rounded-xl" />
                            <Button className="w-full gradient-purple-gold text-white rounded-xl" onClick={() => awardGift.mutate()} disabled={!giftName.trim()}>
                              {t("منح المكافأة 🎁", "Attribuer 🎁", "Award Gift 🎁")}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {!sorted.length && (
              <TableRow><TableCell colSpan={isAdmin ? 7 : 6} className="py-12 text-center">
                <Trophy className="mx-auto mb-2 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">{t("لا يوجد وكلاء بعد", "Aucun agent", "No agents yet")}</p>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
