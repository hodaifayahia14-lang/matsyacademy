import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClipboardList, BarChart3, Gift, Trophy, LayoutDashboard } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AgentOrders from "./AgentOrders";
import AgentStats from "./AgentStats";
import AgentRewards from "./AgentRewards";
import Leaderboard from "@/pages/dashboard/admin/Leaderboard";

export default function AgentDashboard() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;

  const items = [
    { title: t("طلباتي", "Mes commandes", "My Orders"), url: "/dashboard/agent", icon: ClipboardList },
    { title: t("إحصائياتي", "Mes stats", "My Stats"), url: "/dashboard/agent/stats", icon: BarChart3 },
    { title: t("لوحة المتصدرين", "Classement", "Leaderboard"), url: "/dashboard/agent/leaderboard", icon: Trophy },
    { title: t("مكافآتي", "Mes récompenses", "My Rewards"), url: "/dashboard/agent/rewards", icon: Gift },
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout items={items} groupLabel={t("لوحة تحكم الوكيل", "Agent", "Agent Dashboard")} />}>
        <Route index element={<AgentOrders />} />
        <Route path="stats" element={<AgentStats />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rewards" element={<AgentRewards />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/agent" replace />} />
    </Routes>
  );
}
