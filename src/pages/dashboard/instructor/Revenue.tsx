import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, Star } from "lucide-react";

export default function Revenue() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-revenue", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: courses } = await supabase.from("courses").select("id").eq("instructor_id", user!.id);
      if (!courses?.length) return { total: 0, pending: 0, students: 0 };
      const ids = courses.map((c) => c.id);
      const { data: payments } = await supabase.from("payments").select("amount, status").in("course_id", ids);
      const { data: enrollments } = await supabase.from("enrollments").select("id").in("course_id", ids);
      const total = payments?.filter((p) => p.status === "paid").reduce((a, p) => a + Number(p.amount), 0) || 0;
      const pending = payments?.filter((p) => p.status === "pending").reduce((a, p) => a + Number(p.amount), 0) || 0;
      return { total, pending, students: enrollments?.length || 0 };
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const stats = [
    { icon: DollarSign, label: t("dashboard.instructor.totalEarnings"), value: `$${data?.total?.toFixed(2) || "0.00"}` },
    { icon: DollarSign, label: t("dashboard.instructor.pendingBalance"), value: `$${data?.pending?.toFixed(2) || "0.00"}` },
    { icon: Users, label: t("dashboard.instructor.totalStudents"), value: data?.students || 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.instructor.revenue")}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-6 shadow-card">
            <Icon className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-display text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
