import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function InstructorCourses() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor-courses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course deleted");
    },
  });

  const statusColor = (s: string) => {
    if (s === "published") return "bg-success/10 text-success border-success/20";
    if (s === "pending") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.instructor.myCourses")}</h1>
        <Link to="/dashboard/instructor/create">
          <Button>{t("dashboard.instructor.createCourse")}</Button>
        </Link>
      </div>

      {!courses?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-2 font-display text-lg font-semibold">{t("dashboard.instructor.noCourses")}</h3>
          <p className="text-sm text-muted-foreground">{t("dashboard.instructor.noCoursesDesc")}</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.instructor.courseTitle")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("catalog.level")}</TableHead>
                <TableHead>{t("catalog.price")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(c.status)}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{c.level}</TableCell>
                  <TableCell>{c.is_free ? t("catalog.free") : `$${c.price}`}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
