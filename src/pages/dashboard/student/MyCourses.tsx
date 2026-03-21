import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function MyCourses() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["student-enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id, title, cover_image, instructor_id, profiles:instructor_id(name))")
        .eq("student_id", user!.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!enrollments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h3 className="mb-2 font-display text-lg font-semibold">{t("dashboard.student.noCourses")}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{t("dashboard.student.noCoursesDesc")}</p>
        <Link to="/courses"><Button>{t("hero.browseCourses")}</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.student.myCourses")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((e: any) => (
          <div key={e.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="aspect-video bg-muted">
              {e.courses?.cover_image && (
                <img src={e.courses.cover_image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-display text-sm font-semibold line-clamp-2">{e.courses?.title}</h3>
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(e.progress_percent)}% {t("dashboard.student.complete")}</span>
                </div>
                <Progress value={e.progress_percent} className="h-2" />
              </div>
              <Link to={`/courses/${e.course_id}`}>
                <Button size="sm" className="w-full">{t("dashboard.student.continueLearning")}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
