import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function InstructorDetail() {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["instructor-profile", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: courses } = useQuery({
    queryKey: ["instructor-courses", id],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").eq("instructor_id", id!).eq("status", "published");
      return data || [];
    },
    enabled: !!id,
  });

  const { data: enrollmentCount } = useQuery({
    queryKey: ["instructor-enrollments", id],
    queryFn: async () => {
      const courseIds = courses?.map((c) => c.id) || [];
      if (!courseIds.length) return 0;
      const { count } = await supabase.from("enrollments").select("*", { count: "exact", head: true }).in("course_id", courseIds);
      return count || 0;
    },
    enabled: !!courses?.length,
  });

  if (isLoading) return <div className="container py-20"><Skeleton className="mx-auto h-96 max-w-2xl rounded-xl" /></div>;
  if (!profile) return <div className="container py-20 text-center"><h2 className="text-2xl font-bold">{t("courseDetail.courseNotFound")}</h2></div>;

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.name}`} alt={profile.name}
              className="h-32 w-32 rounded-full border-4 border-primary/20 object-cover shadow-lg" />
            <div className="flex-1 text-center md:text-start">
              <h1 className="mb-2 font-display text-3xl font-bold text-foreground">{profile.name}</h1>
              {(profile as any).specialization && <p className="mb-2 text-sm font-medium text-primary">{(profile as any).specialization}</p>}
              {profile.bio && <p className="mb-4 text-muted-foreground">{profile.bio}</p>}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> {enrollmentCount || 0} {t("stats.students")}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4 text-primary" /> {courses?.length || 0} {t("stats.courses")}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning fill-warning" /> 4.9</span>
              </div>
            </div>
          </div>
        </motion.div>

        {courses && courses.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-6 font-display text-2xl font-bold">{t("navbar.courses")}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  {course.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={course.cover_image} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="mb-2 font-display font-semibold text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.subtitle || course.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">{course.price > 0 ? `${course.price.toLocaleString()} DZD` : "Free"}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
