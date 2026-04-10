import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Check, X, Trash2, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoursesModeration() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, profiles:instructor_id(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("courses").update({ status: status as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses-all"] });
      toast.success("Course updated");
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses-all"] });
      toast.success("Course deleted");
    },
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const filtered = courses?.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const byStatus = (status?: string) => status ? filtered.filter((c) => c.status === status) : filtered;

  const statusColor = (s: string) => {
    if (s === "published") return "default";
    if (s === "pending") return "secondary";
    return "outline";
  };

  const CourseTable = ({ items }: { items: typeof filtered }) => (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>{t("courseDetail.instructor")}</TableHead>
            <TableHead>{t("catalog.level")}</TableHead>
            <TableHead>{t("catalog.price")}</TableHead>
            <TableHead>{t("common.status")}</TableHead>
            <TableHead>{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c: any) => (
            <TableRow key={c.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => navigate(`/dashboard/admin/courses/${c.id}`)}>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium text-primary hover:underline">{c.title}</p>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs capitalize">{c.type || "course"}</Badge>
              </TableCell>
              <TableCell className="text-sm">{(c.profiles as any)?.name || "—"}</TableCell>
              <TableCell><Badge variant="outline" className="text-xs capitalize">{c.level}</Badge></TableCell>
              <TableCell className="text-sm">{c.price > 0 ? `${c.price} DZD` : "Free"}</TableCell>
              <TableCell>
                <Badge variant={statusColor(c.status) as any} className="text-xs capitalize">{c.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {c.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus.mutate({ id: c.id, status: "published" })}>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: c.id, status: "draft" })}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                  {c.status === "published" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: c.id, status: "draft" })}>
                      Unpublish
                    </Button>
                  )}
                  {c.status === "draft" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: c.id, status: "published" })}>
                      Publish
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteCourse.mutate(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No courses found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.admin.courses")}</h1>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({byStatus("pending").length})</TabsTrigger>
          <TabsTrigger value="published">Published ({byStatus("published").length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({byStatus("draft").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><CourseTable items={filtered} /></TabsContent>
        <TabsContent value="pending"><CourseTable items={byStatus("pending")} /></TabsContent>
        <TabsContent value="published"><CourseTable items={byStatus("published")} /></TabsContent>
        <TabsContent value="draft"><CourseTable items={byStatus("draft")} /></TabsContent>
      </Tabs>
    </div>
  );
}
