import { Routes, Route, Navigate } from "react-router-dom";
import { ClipboardList, BarChart3, Gift, Trophy } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AgentOrders from "./AgentOrders";
import AgentStats from "./AgentStats";
import AgentRewards from "./AgentRewards";
import Leaderboard from "@/pages/dashboard/admin/Leaderboard";

export default function AgentDashboard() {
  const items = [
    { title: "Orders Queue", url: "/dashboard/agent", icon: ClipboardList },
    { title: "My Stats", url: "/dashboard/agent/stats", icon: BarChart3 },
    { title: "Leaderboard", url: "/dashboard/agent/leaderboard", icon: Trophy },
    { title: "My Rewards", url: "/dashboard/agent/rewards", icon: Gift },
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout items={items} groupLabel="Agent Dashboard" />}>
        <Route index element={<AgentOrders />} />
        <Route path="stats" element={<AgentStats />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rewards" element={<AgentRewards />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/agent" replace />} />
    </Routes>
  );
}
