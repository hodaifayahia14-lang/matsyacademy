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
import { ThumbsUp, MessageSquare, CheckCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QA() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"recent" | "popular" | "unanswered">("recent");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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

  const createQuestion = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("qa_questions").insert({ user_id: user!.id, title, body });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["qa-questions"] }); toast.success(t("qa.questionPosted")); setShowForm(false); setTitle(""); setBody(""); },
    onError: () => toast.error("Error posting question"),
  });

  const filters = [
    { key: "recent" as const, label: t("qa.recent") },
    { key: "popular" as const, label: t("qa.popular") },
    { key: "unanswered" as const, label: t("qa.unanswered") },
  ];

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
              <div key={q.id} className="rounded-xl border bg-card p-6 transition-all hover:shadow-sm">
                <div className="flex items-start gap-4">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
