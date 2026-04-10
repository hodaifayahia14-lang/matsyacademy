import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, ClipboardList, CheckCircle, Clock, ArrowRight, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview-v2"],
    queryFn: async () => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [courses, ordersAll, ordersMonth, confirmedMonth, pendingOrders, recentOrders, agents] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", monthAgo.toISOString()),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "confirmed").gte("created_at", monthAgo.toISOString()),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
        supabase.from("orders").select("*, courses(title)").order("created_at", { ascending: false }).limit(8),
        supabase.from("user_roles").select("user_id, profiles:user_id(id, name)").eq("role", "confirmation_agent"),
      ]);

      // Orders by day for chart
      const { data: ordersChart } = await supabase
        .from("orders").select("created_at").gte("created_at", monthAgo.toISOString());

      const dayMap: Record<string, number> = {};
      ordersChart?.forEach(o => {
        const day = new Date(o.created_at).toISOString().slice(0, 10);
        dayMap[day] = (dayMap[day] || 0) + 1;
      });
      const chartData = Object.entries(dayMap).sort().slice(-14).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US", { month: "short", day: "numeric" }),
        orders: count,
      }));

      // Top courses
      const { data: enrollments } = await supabase.from("enrollments").select("course_id, courses:course_id(title)");
      const courseCount: Record<string, { title: string; count: number }> = {};
      enrollments?.forEach((e: any) => {
        const title = e.courses?.title || "Unknown";
        if (!courseCount[e.course_id]) courseCount[e.course_id] = { title, count: 0 };
        courseCount[e.course_id].count++;
      });
      const topCourses = Object.values(courseCount).sort((a, b) => b.count - a.count).slice(0, 5);

      // Agent leaderboard
      const { data: allOrders } = await supabase.from("orders").select("assigned_agent_id, order_status").not("assigned_agent_id", "is", null);
      const agentStats = agents.data?.map((a: any) => {
        const profile = a.profiles as any;
        const agentOrders = (allOrders || []).filter(o => o.assigned_agent_id === profile.id);
        return {
          id: profile.id,
          name: profile.name || "Agent",
          confirmed: agentOrders.filter(o => o.order_status === "confirmed").length,
        };
      }).sort((a: any, b: any) => b.confirmed - a.confirmed).slice(0, 3) || [];

      return {
        totalCourses: courses.count || 0,
        ordersMonth: ordersMonth.count || 0,
        confirmedMonth: confirmedMonth.count || 0,
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
      <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" /></div>
    </div>
  );

  const kpis = [
    { icon: BookOpen, label: t("إجمالي الدورات", "Total cours", "Total Courses"), value: data?.totalCourses || 0, color: "#5B2D8E", bg: "rgba(91,45,142,0.1)", trend: "+8%" },
    { icon: ClipboardList, label: t("طلبات هذا الشهر", "Commandes ce mois", "Orders This Month"), value: data?.ordersMonth || 0, color: "#C9971C", bg: "rgba(201,151,28,0.1)", trend: "+12%" },
    { icon: CheckCircle, label: t("الطلبات المؤكدة", "Confirmées", "Confirmed"), value: data?.confirmedMonth || 0, color: "#16a34a", bg: "rgba(22,163,74,0.1)", trend: "+5%" },
    { icon: Clock, label: t("قيد الانتظار", "En attente", "Pending"), value: data?.pendingOrders || 0, color: "#ea580c", bg: "rgba(234,88,12,0.1)", trend: null },
  ];

  const statusBadge = (s: string) => {
    if (s === "confirmed") return <Badge className="bg-green-100 text-green-700 border-0 text-xs">{t("مؤكد", "Confirmé", "Confirmed")}</Badge>;
    if (s === "pending") return <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">{t("قيد الانتظار", "En attente", "Pending")}</Badge>;
    if (s === "cancelled") return <Badge className="bg-red-100 text-red-700 border-0 text-xs">{t("ملغى", "Annulé", "Cancelled")}</Badge>;
    return <Badge variant="outline" className="text-xs capitalize">{s}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            className="rounded-2xl bg-white p-5 shadow-sm border border-border/50 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: kpi.bg }}>
                <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
              </div>
              {kpi.trend && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" /> {kpi.trend}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
            <p className="font-display text-3xl font-bold text-foreground">{kpi.value.toLocaleString()}</p>
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: kpi.bg }}>
              <div className="h-full rounded-full transition-all" style={{ background: kpi.color, width: `${Math.min(100, (kpi.value / Math.max(...kpis.map(k => k.value), 1)) * 100)}%` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="rounded-2xl bg-white p-6 shadow-sm border border-border/50">
          <h3 className="font-display text-base font-bold mb-4">{t("الطلبات خلال 14 يوماً", "Commandes sur 14 jours", "Orders Over 14 Days")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.chartData || []}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B2D8E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B2D8E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 11 }} stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="orders" stroke="#5B2D8E" strokeWidth={2} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}
          className="rounded-2xl bg-white p-6 shadow-sm border border-border/50">
          <h3 className="font-display text-base font-bold mb-4">{t("أفضل 5 دورات", "Top 5 cours", "Top 5 Courses")}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.topCourses || []} layout="vertical">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5B2D8E" />
                  <stop offset="100%" stopColor="#C9971C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis dataKey="title" type="category" tick={{ fontSize: 10 }} width={120} stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders + Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}
          className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-border/50 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h3 className="font-display text-base font-bold">{t("أحدث الطلبات", "Commandes récentes", "Recent Orders")}</h3>
            <Link to="/dashboard/admin/orders">
              <Button variant="ghost" size="sm" className="text-primary text-xs">
                {t("عرض الكل", "Voir tout", "View All")} <ArrowRight className="ms-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">{t("الاسم", "Nom", "Name")}</TableHead>
                <TableHead className="text-xs">{t("الدورة", "Cours", "Course")}</TableHead>
                <TableHead className="text-xs">{t("الولاية", "Wilaya", "Wilaya")}</TableHead>
                <TableHead className="text-xs">{t("الحالة", "Statut", "Status")}</TableHead>
                <TableHead className="text-xs">{t("التاريخ", "Date", "Date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentOrders?.map((o: any) => (
                <TableRow key={o.id} className="hover:bg-purple-50/30">
                  <TableCell className="font-medium text-sm">{o.full_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate">{(o.courses as any)?.title || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.wilaya_name}</TableCell>
                  <TableCell>{statusBadge(o.order_status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {!data?.recentOrders?.length && (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">{t("لا توجد طلبات", "Aucune commande", "No orders")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Top agents */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}
          className="rounded-2xl bg-white p-5 shadow-sm border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5" style={{ color: "#C9971C" }} />
            <h3 className="font-display text-base font-bold">{t("أفضل الوكلاء", "Top agents", "Top Agents")}</h3>
          </div>
          <div className="space-y-3">
            {data?.agentStats?.map((agent: any, i: number) => {
              const medals = ["🥇", "🥈", "🥉"];
              const max = data.agentStats[0]?.confirmed || 1;
              return (
                <div key={agent.id} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{medals[i]}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {agent.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(agent.confirmed / max) * 100}%`, background: "linear-gradient(90deg, #5B2D8E, #C9971C)" }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">{agent.confirmed}</span>
                </div>
              );
            })}
            {!data?.agentStats?.length && <p className="text-sm text-muted-foreground text-center py-4">{t("لا يوجد وكلاء", "Aucun agent", "No agents")}</p>}
          </div>
          <Link to="/dashboard/admin/leaderboard" className="block mt-4">
            <Button variant="ghost" size="sm" className="w-full text-primary text-xs">
              {t("عرض لوحة المتصدرين", "Voir le classement", "View Leaderboard")} <ArrowRight className="ms-1 h-3 w-3" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
