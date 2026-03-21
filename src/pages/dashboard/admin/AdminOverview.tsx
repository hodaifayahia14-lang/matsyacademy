import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, DollarSign, Clock } from "lucide-react";

export default function AdminOverview() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [profiles, courses, payments, pending] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "paid"),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      const revenue = payments.data?.reduce((a, p) => a + Number(p.amount), 0) || 0;
      return {
        users: profiles.count || 0,
        courses: courses.count || 0,
        revenue,
        pending: pending.count || 0,
      };
    },
  });

  if (isLoading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>;

  const stats = [
    { icon: Users, label: t("dashboard.admin.totalUsers"), value: data?.users, color: "text-primary" },
    { icon: BookOpen, label: t("dashboard.admin.totalCourses"), value: data?.courses, color: "text-success" },
    { icon: DollarSign, label: t("dashboard.admin.revenueMonth"), value: `$${data?.revenue?.toFixed(2)}`, color: "text-warning" },
    { icon: Clock, label: t("dashboard.admin.pendingApprovals"), value: data?.pending, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.overview")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-6 shadow-card">
            <Icon className={`mb-2 h-8 w-8 ${color}`} />
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-display text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
