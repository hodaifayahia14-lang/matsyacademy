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
import { Search, Trash2, CheckCircle, MessageSquare } from "lucide-react";

export default function QAModeration() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-qa"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_questions")
        .select("*, profiles:user_id(name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: answers } = useQuery({
    queryKey: ["admin-qa-answers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qa_answers")
        .select("*, profiles:user_id(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("qa_questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-qa"] });
      toast.success("Question deleted");
    },
  });

  const toggleAnswered = useMutation({
    mutationFn: async ({ id, answered }: { id: string; answered: boolean }) => {
      const { error } = await supabase.from("qa_questions").update({ is_answered: answered }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-qa"] });
      toast.success("Updated");
    },
  });

  const deleteAnswer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("qa_answers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-qa-answers"] });
      toast.success("Answer deleted");
    },
  });

  const filtered = questions?.filter((q) =>
    !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.body.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const allQ = filtered;
  const answeredQ = filtered.filter((q) => q.is_answered);
  const unansweredQ = filtered.filter((q) => !q.is_answered);

  const QuestionTable = ({ items }: { items: typeof filtered }) => (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Upvotes</TableHead>
            <TableHead>{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((q: any) => (
            <TableRow key={q.id}>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium">{q.title}</p>
                <p className="truncate text-xs text-muted-foreground">{q.body.slice(0, 80)}...</p>
              </TableCell>
              <TableCell className="text-sm">{(q.profiles as any)?.name || "Unknown"}</TableCell>
              <TableCell>
                <Badge variant={q.is_answered ? "default" : "outline"} className="text-xs">
                  {q.is_answered ? t("qa.answered") : t("qa.unanswered")}
                </Badge>
              </TableCell>
              <TableCell>{q.upvotes}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => toggleAnswered.mutate({ id: q.id, answered: !q.is_answered })}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteQuestion.mutate(q.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!items.length && (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No questions found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("qa.title")}</h1>
        <Badge variant="outline"><MessageSquare className="mr-1 h-3.5 w-3.5" />{questions?.length || 0} questions</Badge>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search questions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({allQ.length})</TabsTrigger>
          <TabsTrigger value="answered">Answered ({answeredQ.length})</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered ({unansweredQ.length})</TabsTrigger>
          <TabsTrigger value="answers">Answers ({answers?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><QuestionTable items={allQ} /></TabsContent>
        <TabsContent value="answered"><QuestionTable items={answeredQ} /></TabsContent>
        <TabsContent value="unanswered"><QuestionTable items={unansweredQ} /></TabsContent>
        <TabsContent value="answers">
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Answer</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Accepted</TableHead>
                  <TableHead>{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {answers?.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="max-w-sm"><p className="truncate text-sm">{a.body}</p></TableCell>
                    <TableCell className="text-sm">{(a.profiles as any)?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant={a.is_accepted ? "default" : "outline"} className="text-xs">
                        {a.is_accepted ? "Accepted" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => deleteAnswer.mutate(a.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
