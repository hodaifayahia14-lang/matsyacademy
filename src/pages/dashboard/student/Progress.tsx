import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle } from "lucide-react";

export default function Progress() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["student-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id, title)")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.student.progress")}</h1>
      {enrollments?.length === 0 ? (
        <p className="text-muted-foreground">{t("dashboard.student.noCourses")}</p>
      ) : (
        <div className="space-y-4">
          {enrollments?.map((e: any) => (
            <div key={e.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{e.courses?.title}</h3>
                <span className="text-sm font-medium text-primary">{Math.round(e.progress_percent)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${e.progress_percent}%` }} />
              </div>
              {e.completed_at && (
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <Check className="h-3 w-3" /> Completed
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
