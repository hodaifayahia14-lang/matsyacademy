import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, PlayCircle, CheckCircle, Clock } from "lucide-react";

export default function MyCourses() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["student-enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id, title, cover_image, type, instructor_id, profiles:instructor_id(name))")
        .eq("student_id", user!.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: lessonProgress } = useQuery({
    queryKey: ["student-lesson-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("student_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
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

  const completedLessons = new Set(lessonProgress?.map((lp) => lp.lesson_id) || []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.student.myCourses")}</h1>
        <Badge variant="outline">{enrollments.length} {lang === "ar" ? "دورة" : "courses"}</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((e: any) => {
          const isCompleted = !!e.completed_at;
          const progressPct = Math.round(e.progress_percent);
          return (
            <div key={e.id} className="group overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted relative">
                {e.courses?.cover_image && (
                  <img src={e.courses.cover_image} alt="" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {isCompleted && (
                  <div className="absolute top-2 end-2">
                    <Badge className="bg-green-600 text-white text-xs gap-1">
                      <CheckCircle className="h-3 w-3" /> {lang === "ar" ? "مكتمل" : "Completed"}
                    </Badge>
                  </div>
                )}
                <Badge variant="secondary" className="absolute top-2 start-2 text-xs capitalize">
                  {e.courses?.type || "course"}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="mb-1 font-display text-sm font-semibold line-clamp-2">{e.courses?.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {(e.courses?.profiles as any)?.name || ""}
                </p>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {progressPct}% {t("dashboard.student.complete")}
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                {/* Enrolled date */}
                <p className="text-xs text-muted-foreground mb-3">
                  {lang === "ar" ? "تم التسجيل: " : "Enrolled: "}
                  {new Date(e.enrolled_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US")}
                </p>
                
                <Link to={`/courses/${e.course_id}`}>
                  <Button size="sm" className="w-full gap-1">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {isCompleted
                      ? (lang === "ar" ? "مراجعة" : lang === "fr" ? "Revoir" : "Review")
                      : t("dashboard.student.continueLearning")
                    }
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
