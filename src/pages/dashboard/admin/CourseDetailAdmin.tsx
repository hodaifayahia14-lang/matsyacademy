import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, BookOpen, Star, DollarSign, TrendingUp } from "lucide-react";

export default function CourseDetailAdmin() {
  const { courseId } = useParams();
  const { t } = useTranslation();

  const { data: course, isLoading } = useQuery({
    queryKey: ["admin-course-detail", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, profiles:instructor_id(name, email, avatar_url), categories:category_id(name, name_en, name_ar, name_fr)")
        .eq("id", courseId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["admin-course-enrollments", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, profiles:student_id(name, email, avatar_url)")
        .eq("course_id", courseId!)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: sections } = useQuery({
    queryKey: ["admin-course-sections", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("*, lessons(*)")
        .eq("course_id", courseId!)
        .order("order");
      if (error) throw error;
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["admin-course-reviews", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles:student_id(name, avatar_url)")
        .eq("course_id", courseId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["admin-course-payments", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("course_id", courseId!)
        .eq("status", "paid");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Skeleton className="h-60 rounded-xl" />;
  if (!course) return <div className="py-12 text-center text-muted-foreground">Course not found</div>;

  const totalStudents = enrollments?.length || 0;
  const avgProgress = enrollments?.length
    ? Math.round(enrollments.reduce((sum: number, e: any) => sum + Number(e.progress_percent), 0) / enrollments.length)
    : 0;
  const completedCount = enrollments?.filter((e: any) => e.completed_at).length || 0;
  const totalRevenue = payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const totalLessons = sections?.reduce((sum: number, s: any) => sum + (s.lessons?.length || 0), 0) || 0;

  return (
    <div>
      <Link to="/dashboard/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" /> {t("dashboard.admin.courses")}
      </Link>

      <div className="mb-6 flex items-start gap-4">
        {course.cover_image && (
          <img src={course.cover_image} alt="" className="h-20 w-32 rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{course.title}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize">{course.type || "course"}</Badge>
            <Badge variant={course.status === "published" ? "default" : "secondary"} className="capitalize">{course.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {t("courseDetail.instructor")}: {(course.profiles as any)?.name || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-primary/10 p-2"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">{t("stats.students")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-accent/10 p-2"><TrendingUp className="h-5 w-5 text-accent" /></div>
            <div>
              <p className="text-2xl font-bold">{avgProgress}%</p>
              <p className="text-xs text-muted-foreground">Avg Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-warning/10 p-2"><Star className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold">{avgRating}</p>
              <p className="text-xs text-muted-foreground">{t("courseDetail.rating")} ({reviews?.length || 0})</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-green-500/10 p-2"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} DZD</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.instructor.totalEarnings")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList className="mb-4">
          <TabsTrigger value="students">{t("stats.students")} ({totalStudents})</TabsTrigger>
          <TabsTrigger value="content">{t("courseDetail.curriculum")} ({totalLessons})</TabsTrigger>
          <TabsTrigger value="reviews">{t("courseDetail.reviews")} ({reviews?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                <span>{completedCount} completed</span>
                <span>{totalStudents - completedCount} in progress</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t("dashboard.student.progress")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>{t("common.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments?.map((e: any) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{(e.profiles as any)?.name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{(e.profiles as any)?.email || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={e.progress_percent} className="h-2 w-24" />
                          <span className="text-xs font-medium">{Math.round(e.progress_percent)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={e.completed_at ? "default" : "outline"} className="text-xs">
                          {e.completed_at ? "Completed" : "In Progress"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!enrollments?.length && (
                    <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No students enrolled</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {sections?.map((s: any) => (
                <div key={s.id} className="rounded-lg border">
                  <div className="bg-secondary/50 px-4 py-3 font-semibold text-sm flex justify-between">
                    <span>{s.title}</span>
                    <span className="text-muted-foreground">{s.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="divide-y">
                    {s.lessons?.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">{l.type}</Badge>
                          <span>{l.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{l.duration_minutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!sections?.length && (
                <div className="py-8 text-center text-muted-foreground">No content yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {reviews?.map((r: any) => (
                <div key={r.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-sm">{(r.profiles as any)?.name || "Student"}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
              {!reviews?.length && (
                <div className="py-8 text-center text-muted-foreground">No reviews yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
