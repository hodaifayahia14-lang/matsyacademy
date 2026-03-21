import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Check, X } from "lucide-react";

export default function CoursesModeration() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses-pending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, profiles:instructor_id(name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("courses").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses-pending"] });
      toast.success("Course updated");
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.courses")} — {t("dashboard.admin.pendingApprovals")}</h1>
      {!courses?.length ? (
        <p className="text-muted-foreground">No pending courses.</p>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>{t("courseDetail.instructor")}</TableHead>
                <TableHead>{t("catalog.level")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>{(c.profiles as any)?.name}</TableCell>
                  <TableCell className="capitalize">{c.level}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus.mutate({ id: c.id, status: "published" })}>
                        <Check className="mr-1 h-4 w-4" /> {t("dashboard.admin.approve")}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate({ id: c.id, status: "draft" })}>
                        <X className="mr-1 h-4 w-4" /> {t("dashboard.admin.reject")}
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
