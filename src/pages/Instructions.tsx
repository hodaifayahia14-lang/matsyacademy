import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { CheckCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import i18n from "@/i18n";

export default function Instructions() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const lang = i18n.language as "en" | "fr" | "ar";

  const { data: instructions, isLoading } = useQuery({
    queryKey: ["instructions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("instructions").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["instruction-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("instruction_progress").select("*").eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  const markComplete = useMutation({
    mutationFn: async (instructionId: string) => {
      const { error } = await supabase.from("instruction_progress").upsert({
        user_id: user!.id,
        instruction_id: instructionId,
        completed: true,
        read_at: new Date().toISOString(),
      }, { onConflict: "user_id,instruction_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instruction-progress"] });
      toast.success(t("instructions.completed"));
    },
  });

  const getTitle = (item: any) => item[`title_${lang}`] || item.title_en;
  const getBody = (item: any) => item[`body_${lang}`] || item.body_en;
  const isCompleted = (id: string) => progress?.some((p) => p.instruction_id === id && p.completed);

  return (
    <div className="min-h-screen">
      <section className="py-12">
        <div className="container text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-gold">{t("instructions.title")}</h1>
          <p className="text-muted-foreground">{t("instructions.subtitle")}</p>
        </div>
      </section>

      <div className="container pb-20">
        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : !instructions?.length ? (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-semibold">{t("instructions.noInstructions")}</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {instructions.map((item: any, idx: number) => (
              <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-gold/30">
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="flex w-full items-center gap-4 p-6 text-start"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-gold">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-display text-lg font-semibold text-foreground">{getTitle(item)}</span>
                  <div className="flex items-center gap-2">
                    {isCompleted(item.id) && <CheckCircle className="h-5 w-5 text-gold" />}
                    {openId === item.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-s-4 border-primary mx-6 mb-6 rounded-lg bg-secondary p-6">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{getBody(item)}</p>
                        {user && !isCompleted(item.id) && (
                          <Button size="sm" className="mt-4 bg-primary border border-gold/30" onClick={() => markComplete.mutate(item.id)}>
                            <CheckCircle className="me-1 h-4 w-4" /> {t("instructions.markComplete")}
                          </Button>
                        )}
                        {isCompleted(item.id) && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-gold">
                            <CheckCircle className="h-4 w-4" /> {t("instructions.completed")}
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
