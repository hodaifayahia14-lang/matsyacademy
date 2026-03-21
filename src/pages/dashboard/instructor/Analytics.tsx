import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor-analytics", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, title").eq("instructor_id", user!.id);
      return data || [];
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["instructor-enrollment-stats", user?.id],
    enabled: !!user && !!courses?.length,
    queryFn: async () => {
      const courseIds = courses!.map((c) => c.id);
      const { data } = await supabase.from("enrollments").select("course_id, enrolled_at").in("course_id", courseIds);
      return data || [];
    },
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  // Aggregate enrollments per course
  const chartData = courses?.map((c) => ({
    name: c.title.slice(0, 20),
    enrollments: enrollments?.filter((e) => e.course_id === c.id).length || 0,
  })) || [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.instructor.analytics")}</h1>
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 font-display font-semibold">Enrollments per Course</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground">No data yet.</p>
        )}
      </div>
    </div>
  );
}
