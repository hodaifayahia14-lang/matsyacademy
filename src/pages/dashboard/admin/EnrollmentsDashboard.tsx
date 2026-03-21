import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, BookOpen } from "lucide-react";

export default function EnrollmentsDashboard() {
  const { t } = useTranslation();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, profiles:student_id(name, email), courses:course_id(title)")
        .order("enrolled_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: payments } = useQuery({
    queryKey: ["admin-payments-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, status, created_at")
        .eq("status", "paid");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const totalRevenue = payments?.reduce((a, p) => a + Number(p.amount), 0) || 0;
  const totalEnrollments = enrollments?.length || 0;
  const avgProgress = enrollments?.length
    ? Math.round(enrollments.reduce((a, e) => a + Number(e.progress_percent), 0) / enrollments.length)
    : 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Enrollments & Revenue</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <Users className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
            <p className="font-display text-2xl font-bold">{totalEnrollments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <DollarSign className="mb-2 h-8 w-8 text-accent" />
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="font-display text-2xl font-bold">{totalRevenue.toLocaleString()} DZD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="mb-2 h-8 w-8 text-green-600" />
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="font-display text-2xl font-bold">{avgProgress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <BookOpen className="mb-2 h-8 w-8 text-blue-600" />
            <p className="text-sm text-muted-foreground">Paid Transactions</p>
            <p className="font-display text-2xl font-bold">{payments?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments?.map((e: any) => (
              <TableRow key={e.id}>
                <TableCell>
                  <p className="font-medium text-sm">{(e.profiles as any)?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{(e.profiles as any)?.email}</p>
                </TableCell>
                <TableCell className="text-sm">{(e.courses as any)?.title || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${e.progress_percent}%` }} />
                    </div>
                    <span className="text-xs">{e.progress_percent}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(e.enrolled_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={e.completed_at ? "default" : "outline"} className="text-xs">
                    {e.completed_at ? "Completed" : "In Progress"}
                  </Badge>
                </TableCell>
              </TableRow>
            )) || []}
            {!enrollments?.length && (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No enrollments yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
