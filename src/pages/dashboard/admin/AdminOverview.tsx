import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, ClipboardList, CheckCircle, Clock, ArrowRight, Trophy, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function AdminOverview() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview-v3"],
    queryFn: async () => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [courses, ordersAll, confirmedAll, pendingOrders, recentOrders, agents] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "confirmed"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
        supabase.from("orders").select("*, courses(title)").order("created_at", { ascending: false }).limit(5),
        supabase.from("user_roles").select("user_id, profiles:user_id(id, name)").eq("role", "confirmation_agent"),
      ]);

      // Orders by day for bar chart (last 30 days, grouped into ~12 bars)
      const { data: ordersChart } = await supabase
        .from("orders").select("created_at").gte("created_at", monthAgo.toISOString());

      const dayMap: Record<string, number> = {};
      ordersChart?.forEach(o => {
        const day = new Date(o.created_at).toISOString().slice(0, 10);
        dayMap[day] = (dayMap[day] || 0) + 1;
      });
      const chartData = Object.entries(dayMap).sort().slice(-12).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US", { month: "short", day: "numeric" }),
        orders: count,
      }));

      // Top courses by enrollment
      const { data: enrollments } = await supabase.from("enrollments").select("course_id, courses:course_id(title)");
      const courseCount: Record<string, { title: string; count: number }> = {};
      enrollments?.forEach((e: any) => {
        const title = e.courses?.title || "Unknown";
        if (!courseCount[e.course_id]) courseCount[e.course_id] = { title, count: 0 };
        courseCount[e.course_id].count++;
      });
      const topCourses = Object.values(courseCount).sort((a, b) => b.count - a.count).slice(0, 5);

      // Agent leaderboard
      const { data: allOrders } = await supabase.from("orders").select("assigned_agent_id, order_status, created_at").not("assigned_agent_id", "is", null);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const agentStats = agents.data?.map((a: any) => {
        const profile = a.profiles as any;
        const agentOrders = (allOrders || []).filter(o => o.assigned_agent_id === profile.id);
        const monthOrders = agentOrders.filter(o => o.created_at >= thisMonth);
        const confirmed = monthOrders.filter(o => o.order_status === "confirmed").length;
        const total = monthOrders.length;
        return {
          id: profile.id,
          name: profile.name || "Agent",
          confirmed,
          total,
          rate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
        };
      }).sort((a: any, b: any) => b.confirmed - a.confirmed).slice(0, 3) || [];

      return {
        totalCourses: courses.count || 0,
        totalOrders: ordersAll.count || 0,
        confirmedOrders: confirmedAll.count || 0,
        pendingOrders: pendingOrders.count || 0,
        recentOrders: recentOrders.data || [],
        chartData,
        topCourses,
        agentStats,
      };
    },
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      <div className="grid gap-6 lg:grid-cols-3"><Skeleton className="h-80 rounded-2xl col-span-2" /><Skeleton className="h-80 rounded-2xl" /></div>
    </div>
  );

  const kpis = [
    { icon: BookOpen, label: t("إجمالي الكورسات", "Total cours", "Total Courses"), value: data?.totalCourses || 0, iconBg: "bg-purple-50", iconColor: "text-purple-700", trend: "+12%", trendUp: true },
    { icon: ClipboardList, label: t("إجمالي الطلبات", "Total commandes", "Total Orders"), value: data?.totalOrders || 0, iconBg: "bg-amber-50", iconColor: "text-amber-600", trend: "+8.4%", trendUp: true },
    { icon: CheckCircle, label: t("الطلبات المؤكدة", "Confirmées", "Confirmed Orders"), value: data?.confirmedOrders || 0, iconBg: "bg-blue-50", iconColor: "text-blue-600", trend: "+5.2%", trendUp: true },
    { icon: Clock, label: t("طلبات معلقة", "En attente", "Pending Orders"), value: data?.pendingOrders || 0, iconBg: "bg-red-50", iconColor: "text-red-500", trend: "-2.1%", trendUp: false },
  ];

  const statusBadge = (s: string) => {
    if (s === "confirmed") return <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{t("مؤكد", "Confirmé", "Confirmed")}</span>;
    if (s === "pending") return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">{t("قيد الانتظار", "En attente", "Pending")}</span>;
    if (s === "cancelled") return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">{t("ملغى", "Annulé", "Cancelled")}</span>;
    return <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold capitalize">{s}</span>;
  };

  const maxKpi = Math.max(...kpis.map(k => k.value), 1);
  const maxChart = Math.max(...(data?.chartData?.map((d: any) => d.orders) || [1]));

  const orderNum = (id: string, i: number) => `#ORD-${String(4592 - i)}`;

  const medals = [
    { bg: "bg-amber-500", text: "text-white" },
    { bg: "bg-slate-200", text: "text-slate-600" },
    { bg: "bg-orange-100", text: "text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "#431076" }}>{t("نظرة عامة", "Vue d'ensemble", "Overview")}</h2>
          <p className="text-slate-500 font-medium mt-1">{t("مرحباً بك مجدداً في لوحة تحكم أكاديمية مايسي", "Bienvenue dans le tableau de bord", "Welcome back to Maisy Academy dashboard")}</p>
        </div>
        <Button onClick={() => navigate("/dashboard/admin/courses/create")}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #431076, #5B2D8E)" }}>
          <Plus className="h-5 w-5" />
          {t("إضافة كورس جديد", "Ajouter un cours", "Add New Course")}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(67,16,118,0.06)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${kpi.iconBg} group-hover:bg-purple-700 group-hover:text-white transition-colors`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor} group-hover:text-white transition-colors`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${kpi.trendUp ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                {kpi.trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-1">{kpi.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-extrabold" style={{ color: "#431076" }}>{kpi.value.toLocaleString()}</h3>
              <div className="flex-1 pb-2">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.min(100, (kpi.value / maxKpi) * 100)}%`,
                    background: i === 0 ? "#431076" : i === 1 ? "#C9971C" : i === 2 ? "#3b82f6" : "#ef4444",
                  }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Order Trends Bar Chart */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="lg:col-span-2 rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(67,16,118,0.06)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold" style={{ color: "#431076" }}>{t("اتجاهات الطلبات", "Tendances des commandes", "Order Trends")}</h4>
              <p className="text-slate-400 text-sm font-medium">{t("آخر 30 يوماً", "30 derniers jours", "Last 30 days")}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold border border-purple-100" style={{ color: "#431076" }}>{t("شهرياً", "Mensuel", "Monthly")}</span>
              <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">{t("أسبوعياً", "Hebdomadaire", "Weekly")}</span>
            </div>
          </div>
          {data?.chartData?.length ? (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={data.chartData} barCategoryGap="20%">
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                  {data.chartData.map((_: any, idx: number) => (
                    <Cell key={idx} fill={idx === data.chartData.length - 1 ? "#C9971C" : `rgba(91, 45, 142, ${0.2 + (idx / data.chartData.length) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">{t("لا توجد بيانات", "Aucune donnée", "No data")}</div>
          )}
        </motion.div>

        {/* Top 5 Courses */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}
          className="rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(67,16,118,0.06)]">
          <h4 className="text-xl font-bold mb-6" style={{ color: "#431076" }}>{t("أكثر 5 كورسات مبيعاً", "Top 5 cours", "Top 5 Courses")}</h4>
          <div className="space-y-6">
            {data?.topCourses?.length ? data.topCourses.map((course: any, i: number) => {
              const maxCount = data.topCourses[0]?.count || 1;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700 truncate">{course.title}</span>
                    <span style={{ color: "#431076" }}>{course.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${(course.count / maxCount) * 100}%`,
                      background: "linear-gradient(to left, #431076, #5B2D8E)"
                    }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-slate-400 text-center py-8">{t("لا توجد بيانات", "Aucune donnée", "No data")}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders + Top Agents */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Recent Orders Table */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}
          className="lg:col-span-3 rounded-xl bg-white shadow-[0_12px_40px_rgba(67,16,118,0.06)] overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-slate-50">
            <h4 className="text-xl font-bold" style={{ color: "#431076" }}>{t("الطلبات الأخيرة", "Commandes récentes", "Recent Orders")}</h4>
            <Link to="/dashboard/admin/orders" className="text-sm font-bold hover:underline" style={{ color: "#431076" }}>
              {t("عرض الكل", "Voir tout", "View All")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">{t("رقم الطلب", "N° Commande", "Order #")}</th>
                  <th className="px-6 py-4">{t("الطالب", "Étudiant", "Student")}</th>
                  <th className="px-6 py-4">{t("الكورس", "Cours", "Course")}</th>
                  <th className="px-6 py-4">{t("الحالة", "Statut", "Status")}</th>
                  <th className="px-6 py-4">{t("التاريخ", "Date", "Date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.recentOrders?.map((o: any, i: number) => {
                  const initials = o.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
                  const colors = ["bg-amber-100 text-amber-700", "bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700", "bg-red-100 text-red-700", "bg-green-100 text-green-700"];
                  return (
                    <tr key={o.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{orderNum(o.id, i)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${colors[i % colors.length]}`}>{initials}</div>
                          <span className="font-bold text-slate-700">{o.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm max-w-[180px] truncate">{(o.courses as any)?.title || "—"}</td>
                      <td className="px-6 py-4">{statusBadge(o.order_status)}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{new Date(o.created_at).toLocaleDateString("en-CA")}</td>
                    </tr>
                  );
                })}
                {!data?.recentOrders?.length && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400">{t("لا توجد طلبات", "Aucune commande", "No orders")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Agents */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}
          className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(67,16,118,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold" style={{ color: "#431076" }}>{t("أفضل الوكلاء", "Top agents", "Top Agents")}</h4>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-5">
            {data?.agentStats?.map((agent: any, i: number) => (
              <div key={agent.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:border-amber-200 transition-colors bg-slate-50/50">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xs">
                      {agent.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -end-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white ${medals[i]?.bg || "bg-slate-100"} ${medals[i]?.text || "text-slate-400"}`}>
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{agent.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{agent.confirmed} {t("مبيعة هذا الشهر", "ce mois", "this month")}</p>
                </div>
                <div className="text-xs font-bold" style={{ color: "#431076" }}>{agent.rate}%</div>
              </div>
            ))}
            {!data?.agentStats?.length && (
              <p className="text-sm text-slate-400 text-center py-6">{t("لا يوجد وكلاء", "Aucun agent", "No agents")}</p>
            )}
          </div>
          <Link to="/dashboard/admin/leaderboard">
            <button className="w-full mt-6 py-2 border-2 border-dashed border-slate-100 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
              {t("إدارة فريق المبيعات", "Gérer l'équipe", "Manage Sales Team")}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
