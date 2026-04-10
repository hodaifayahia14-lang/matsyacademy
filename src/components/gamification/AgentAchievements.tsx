import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import ProgressRing from "./ProgressRing";

export default function AgentAchievements() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const confettiFired = useRef(false);

  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["milestone-rules"],
    queryFn: async () => {
      const { data } = await supabase.from("milestone_rules").select("*").eq("is_active", true).eq("show_on_agent_dashboard", true).order("sort_order");
      return data || [];
    },
  });

  const { data: earnedBadges, isLoading: badgesLoading } = useQuery({
    queryKey: ["my-badges", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("agent_badges").select("*").eq("agent_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: agentStats } = useQuery({
    queryKey: ["agent-confirmation-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("orders").select("*", { count: "exact", head: true })
        .or(`confirmed_by.eq.${user!.id},assigned_agent_id.eq.${user!.id}`)
        .eq("order_status", "confirmed");
      return { totalConfirmed: count || 0 };
    },
    enabled: !!user,
  });

  const earnedIds = new Set(earnedBadges?.map(b => b.milestone_rule_id) || []);

  // Find next unearned milestone
  const nextMilestone = rules?.filter(r => r.milestone_type === "total_confirmations" && !earnedIds.has(r.id))
    .sort((a, b) => a.target_value - b.target_value)[0];

  const current = agentStats?.totalConfirmed || 0;
  const percent = nextMilestone ? Math.min((current / nextMilestone.target_value) * 100, 100) : 0;

  // Confetti when milestone just reached
  useEffect(() => {
    if (percent >= 100 && !confettiFired.current) {
      confettiFired.current = true;
      import("canvas-confetti").then(mod => {
        mod.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      });
    }
  }, [percent]);

  const motivational = percent < 40
    ? (lang === "ar" ? "استمر! أنت تبني زخمًا 💪" : lang === "fr" ? "Continuez ! Vous prenez de l'élan 💪" : "Keep going! You're building momentum 💪")
    : percent < 80
    ? (lang === "ar" ? "أوشكت! لا تتوقف الآن 🔥" : lang === "fr" ? "Presque là ! N'arrêtez pas 🔥" : "Almost there! Don't stop now 🔥")
    : percent < 100
    ? (lang === "ar" ? "قريب جدًا! بضعة أخرى فقط! ⚡" : lang === "fr" ? "SI proche ! Encore quelques-uns ! ⚡" : "SO close! Just a few more! ⚡")
    : (lang === "ar" ? "🎉 تم تحقيق الإنجاز! تحقق من مكافآتك!" : lang === "fr" ? "🎉 Jalon atteint ! Vérifiez vos récompenses !" : "🎉 Milestone reached! Check your rewards!");

  if (rulesLoading || badgesLoading) return <Skeleton className="h-60 rounded-xl" />;

  const getName = (r: any) => lang === "ar" ? r.name_ar : lang === "fr" ? r.name_fr : r.name_en;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">
        {lang === "ar" ? "إنجازاتي وتقدمي" : lang === "fr" ? "Mes Réalisations" : "My Achievements & Progress"}
      </h2>

      {/* Earned Badges Row */}
      <Card>
        <CardHeader><CardTitle className="text-base">
          {lang === "ar" ? "شاراتي" : lang === "fr" ? "Mes Badges" : "My Badges"}
        </CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {rules?.map(r => {
              const earned = earnedIds.has(r.id);
              return (
                <div key={r.id} className={`flex flex-col items-center gap-1 rounded-xl p-3 min-w-[72px] ${!earned ? "opacity-30" : ""}`}>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: r.color + "22" }}>
                    {r.icon}
                    {!earned && <Lock className="absolute -bottom-1 -end-1 h-4 w-4 text-muted-foreground" />}
                  </div>
                  <span className="text-[10px] text-center truncate w-16">{getName(r) || r.name_en}</span>
                </div>
              );
            })}
          </div>
          {!rules?.length && <p className="text-center text-muted-foreground py-4">No milestones configured yet</p>}
        </CardContent>
      </Card>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card>
          <CardContent className="flex items-center gap-6 py-6">
            <ProgressRing current={current} target={nextMilestone.target_value} size={120} />
            <div className="flex-1">
              <p className="font-semibold text-lg">{getName(nextMilestone) || nextMilestone.name_en}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-10 w-10 flex items-center justify-center rounded-full text-xl" style={{ backgroundColor: nextMilestone.color + "22" }}>{nextMilestone.icon}</div>
                <span className="text-sm text-muted-foreground">{nextMilestone.reward_config?.badge_name}</span>
              </div>
              <p className="mt-3 text-sm">{motivational}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Milestones Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="all">
          <AccordionTrigger>
            {lang === "ar" ? "عرض جميع الإنجازات" : lang === "fr" ? "Voir tous les jalons" : "View All Milestones"}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {rules?.map(r => {
                const earned = earnedIds.has(r.id);
                const prog = r.milestone_type === "total_confirmations" ? Math.min((current / r.target_value) * 100, 100) : 0;
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm" style={{ backgroundColor: r.color + "22" }}>{r.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{getName(r) || r.name_en}</p>
                      <Progress value={prog} className="h-2 mt-1" />
                    </div>
                    <span className="text-xs text-muted-foreground">{r.target_value}</span>
                    {earned ? <CheckCircle className="h-5 w-5 text-green-500" /> : prog > 0 ? <RotateCw className="h-4 w-4 text-muted-foreground" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
