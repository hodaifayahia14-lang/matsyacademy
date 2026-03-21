import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { ThumbsUp, MessageSquare, CheckCircle, Plus, ChevronDown, ChevronUp, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QA() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"recent" | "popular" | "unanswered">("recent");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["qa-questions", filter],
    queryFn: async () => {
      let query = supabase.from("qa_questions").select("*, profiles:user_id(name, avatar_url)");
      if (filter === "popular") query = query.order("upvotes", { ascending: false });
      else if (filter === "unanswered") query = query.eq("is_answered", false).order("created_at", { ascending: false });
      else query = query.order("created_at", { ascending: false });
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: answers } = useQuery({
    queryKey: ["qa-answers", expandedQ],
    queryFn: async () => {
      if (!expandedQ) return [];
      const { data, error } = await supabase
        .from("qa_answers")
        .select("*, profiles:user_id(name, avatar_url)")
        .eq("question_id", expandedQ)
        .order("is_accepted", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!expandedQ,
  });

  const createQuestion = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("qa_questions").insert({ user_id: user!.id, title, body });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["qa-questions"] });
      toast.success(t("qa.questionPosted"));
      setShowForm(false);
      setTitle("");
      setBody("");
    },
    onError: () => toast.error("Error posting question"),
  });

  const createAnswer = useMutation({
    mutationFn: async (questionId: string) => {
      const { error } = await supabase.from("qa_answers").insert({ question_id: questionId, user_id: user!.id, body: answerText });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["qa-answers"] });
      toast.success(t("qa.answerPosted") || "Answer posted!");
      setAnswerText("");
    },
    onError: () => toast.error("Error posting answer"),
  });

  const filters = [
    { key: "recent" as const, label: t("qa.recent") },
    { key: "popular" as const, label: t("qa.popular") },
    { key: "unanswered" as const, label: t("qa.unanswered") },
  ];

  const toggleExpand = (id: string) => {
    setExpandedQ(expandedQ === id ? null : id);
    setAnswerText("");
  };

  return (
    <div className="min-h-screen">
      <section className="bg-secondary/50 py-12">
        <div className="container text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">{t("qa.title")}</h1>
          <p className="text-muted-foreground">{t("qa.subtitle")}</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button key={f.key} variant={filter === f.key ? "default" : "outline"} size="sm" onClick={() => setFilter(f.key)}>
                {f.label}
              </Button>
            ))}
          </div>
          {user && (
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="me-1 h-4 w-4" /> {t("qa.askQuestion")}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden rounded-xl border bg-card p-6">
              <Input placeholder={t("qa.titlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />
              <Textarea placeholder={t("qa.bodyPlaceholder")} value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mb-3" />
              <Button onClick={() => createQuestion.mutate()} disabled={!title.trim() || !body.trim()}>
                {t("qa.submit")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : !questions?.length ? (
          <div className="py-20 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-semibold text-foreground">{t("qa.noQuestions")}</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q: any) => (
              <div key={q.id} className="rounded-xl border bg-card transition-all hover:shadow-sm">
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="flex w-full items-start gap-4 p-6 text-start"
                >
                  <div className="flex flex-col items-center gap-1 text-center">
                    <ThumbsUp className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-primary">{q.upvotes}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">{q.title}</h3>
                      {q.is_answered && (
                        <Badge variant="secondary" className="text-primary">
                          <CheckCircle className="me-1 h-3 w-3" /> {t("qa.answered")}
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{q.body}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{q.profiles?.name}</span>
                      <span>•</span>
                      <span>{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {expandedQ === q.id ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                </button>

                <AnimatePresence>
                  {expandedQ === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t"
                    >
                      <div className="p-6 space-y-4">
                        {/* Answers */}
                        {answers && answers.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground">
                              {answers.length} {answers.length === 1 ? (t("qa.answer") || "Answer") : (t("qa.answers") || "Answers")}
                            </h4>
                            {answers.map((a: any) => (
                              <div key={a.id} className={`rounded-lg p-4 ${a.is_accepted ? "border-2 border-primary/30 bg-primary/5" : "border bg-secondary/30"}`}>
                                {a.is_accepted && (
                                  <Badge variant="default" className="mb-2 text-xs">
                                    <CheckCircle className="me-1 h-3 w-3" /> {t("qa.acceptedAnswer") || "Accepted Answer"}
                                  </Badge>
                                )}
                                <p className="text-sm text-foreground leading-relaxed">{a.body}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{a.profiles?.name || "—"}</span>
                                  <span>•</span>
                                  <span>{new Date(a.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            {t("qa.noAnswersYet") || "No answers yet. Be the first to answer!"}
                          </p>
                        )}

                        {/* Answer form */}
                        {user && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Textarea
                              placeholder={t("qa.writeAnswer") || "Write your answer..."}
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                              rows={2}
                              className="flex-1"
                            />
                            <Button
                              size="icon"
                              className="shrink-0 self-end"
                              disabled={!answerText.trim()}
                              onClick={() => createAnswer.mutate(q.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
