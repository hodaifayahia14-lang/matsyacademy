import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function Students() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-students", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: courses } = await supabase.from("courses").select("id, title").eq("instructor_id", user!.id);
      if (!courses?.length) return [];
      const courseIds = courses.map((c) => c.id);
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("*, profiles:student_id(name, email), courses:course_id(title)")
        .in("course_id", courseIds)
        .order("enrolled_at", { ascending: false });
      return enrollments || [];
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.instructor.students")}</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">No students enrolled yet.</p>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>{t("dashboard.student.progress")}</TableHead>
                <TableHead>{t("common.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell>{(e.profiles as any)?.name || "Unknown"}</TableCell>
                  <TableCell>{(e.courses as any)?.title}</TableCell>
                  <TableCell><Progress value={e.progress_percent} className="h-2 w-24" /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(e.enrolled_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
