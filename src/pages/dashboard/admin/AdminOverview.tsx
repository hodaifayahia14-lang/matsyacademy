import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, Clock, MessageSquare, FileText, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminOverview() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [profiles, courses, payments, pending, enrollments, questions, blogs] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "paid"),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
        supabase.from("qa_questions").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);
      const revenue = payments.data?.reduce((a, p) => a + Number(p.amount), 0) || 0;
      return {
        users: profiles.count || 0,
        courses: courses.count || 0,
        revenue,
        pending: pending.count || 0,
        enrollments: enrollments.count || 0,
        questions: questions.count || 0,
        blogs: blogs.count || 0,
      };
    },
  });

  if (isLoading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>;

  const stats = [
    { icon: Users, label: t("dashboard.admin.totalUsers"), value: data?.users, color: "text-primary", bg: "bg-primary/10" },
    { icon: BookOpen, label: t("dashboard.admin.totalCourses"), value: data?.courses, color: "text-green-600", bg: "bg-green-50" },
    { icon: DollarSign, label: t("dashboard.admin.revenueMonth"), value: `${data?.revenue?.toLocaleString()} DZD`, color: "text-accent", bg: "bg-accent/10" },
    { icon: Clock, label: t("dashboard.admin.pendingApprovals"), value: data?.pending, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  const quickActions = [
    { icon: BookOpen, label: "Manage Courses", to: "/dashboard/admin/courses", count: data?.courses },
    { icon: Users, label: "Manage Users", to: "/dashboard/admin/users", count: data?.users },
    { icon: CreditCard, label: "Enrollments", to: "/dashboard/admin/enrollments", count: data?.enrollments },
    { icon: MessageSquare, label: "Q&A Moderation", to: "/dashboard/admin/qa", count: data?.questions },
    { icon: FileText, label: "Blog Posts", to: "/dashboard/admin/blogs", count: data?.blogs },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.overview")}</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className={`mb-3 inline-flex rounded-lg p-2.5 ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-display text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 font-display text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map(({ icon: Icon, label, to, count }) => (
          <Link key={to} to={to}>
            <Card className="transition-all hover:shadow-md hover:border-primary/30">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{count} items</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
