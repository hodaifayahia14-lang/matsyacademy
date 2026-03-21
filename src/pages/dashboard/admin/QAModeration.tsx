import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Search, Trash2, CheckCircle, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";

export default function QAModeration() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

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

  const postAnswer = useMutation({
    mutationFn: async (questionId: string) => {
      if (!user || !answerText.trim()) return;
      const { error } = await supabase.from("qa_answers").insert({
        question_id: questionId,
        user_id: user.id,
        body: answerText.trim(),
      });
      if (error) throw error;
      // mark as answered
      await supabase.from("qa_questions").update({ is_answered: true }).eq("id", questionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-qa"] });
      qc.invalidateQueries({ queryKey: ["admin-qa-answers"] });
      setAnswerText("");
      toast.success("Answer posted");
    },
  });

  const filtered = questions?.filter((q) =>
    !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.body.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const allQ = filtered;
  const answeredQ = filtered.filter((q) => q.is_answered);
  const unansweredQ = filtered.filter((q) => !q.is_answered);

  const getAnswersForQ = (qId: string) => answers?.filter((a: any) => a.question_id === qId) || [];

  const QuestionList = ({ items }: { items: typeof filtered }) => (
    <div className="space-y-3">
      {items.map((q: any) => {
        const isExpanded = expandedQ === q.id;
        const qAnswers = getAnswersForQ(q.id);
        return (
          <Card key={q.id} className="overflow-hidden">
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold leading-tight">{q.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{q.body}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Badge variant={q.is_answered ? "default" : "outline"} className="text-xs">
                      {q.is_answered ? t("qa.answered") : t("qa.unanswered")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(q.profiles as any)?.name || "Unknown"} • {new Date(q.created_at).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary" className="text-xs">{qAnswers.length} {t("qa.title").split(" ")[0]}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toggleAnswered.mutate({ id: q.id, answered: !q.is_answered }); }}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); deleteQuestion.mutate(q.id); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="pt-0 space-y-4">
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">{q.body}</p>
                  
                  {/* Existing answers */}
                  {qAnswers.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-semibold">Answers ({qAnswers.length})</h4>
                      {qAnswers.map((a: any) => (
                        <div key={a.id} className="rounded-lg bg-secondary/50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{(a.profiles as any)?.name || "Unknown"}</span>
                              {a.is_accepted && <Badge className="text-xs">✓ Accepted</Badge>}
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => deleteAnswer.mutate(a.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{a.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Post answer form */}
                  <div className="rounded-lg border bg-background p-3">
                    <h4 className="text-sm font-semibold mb-2">Post an Answer</h4>
                    <Textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your answer..."
                      className="mb-2 min-h-[80px]"
                    />
                    <Button
                      size="sm"
                      onClick={() => postAnswer.mutate(q.id)}
                      disabled={!answerText.trim() || postAnswer.isPending}
                    >
                      <Send className="me-1 h-3.5 w-3.5" /> Post Answer
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
      {!items.length && (
        <div className="py-12 text-center text-muted-foreground">No questions found</div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("qa.title")}</h1>
        <Badge variant="outline"><MessageSquare className="me-1 h-3.5 w-3.5" />{questions?.length || 0} questions</Badge>
      </div>

      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search questions..." className="ps-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({allQ.length})</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered ({unansweredQ.length})</TabsTrigger>
          <TabsTrigger value="answered">Answered ({answeredQ.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all"><QuestionList items={allQ} /></TabsContent>
        <TabsContent value="unanswered"><QuestionList items={unansweredQ} /></TabsContent>
        <TabsContent value="answered"><QuestionList items={answeredQ} /></TabsContent>
      </Tabs>
    </div>
  );
}
