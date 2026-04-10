import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, AlertTriangle } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import MilestoneRuleCard, { type MilestoneRule } from "@/components/gamification/MilestoneRuleCard";
import MilestoneFormDrawer from "@/components/gamification/MilestoneFormDrawer";
import PointsSystemSettings from "@/components/gamification/PointsSystemSettings";
import BadgeGallery from "@/components/gamification/BadgeGallery";
import RewardHistoryLog from "@/components/gamification/RewardHistoryLog";
import { Skeleton } from "@/components/ui/skeleton";

const defaultMilestones: Partial<MilestoneRule>[] = [
  { name_en: "🌟 Rising Star", name_fr: "🌟 Étoile Montante", name_ar: "🌟 نجم صاعد", milestone_type: "total_confirmations", target_value: 1, icon: "🌟", color: "#3b82f6", reward_config: { badge_name: "Rising Star", title_en: "New Closer", title_fr: "Nouveau Closer", title_ar: "المبتدئ" } },
  { name_en: "🔥 On Fire", name_fr: "🔥 En Feu", name_ar: "🔥 مشتعل", milestone_type: "total_confirmations", target_value: 10, icon: "🔥", color: "#f97316", reward_config: { badge_name: "On Fire", points_bonus: 50 } },
  { name_en: "💪 Proven Closer", name_fr: "💪 Closer Confirmé", name_ar: "💪 مؤكد محترف", milestone_type: "total_confirmations", target_value: 30, icon: "💪", color: "#8b5cf6", reward_config: { badge_name: "Proven Closer", points_bonus: 150, title_en: "Confirmed Pro", title_fr: "Pro Confirmé", title_ar: "محترف مؤكد", gift_name: "Special Gift" } },
  { name_en: "⚡ Power Agent", name_fr: "⚡ Agent Puissant", name_ar: "⚡ وكيل خارق", milestone_type: "total_confirmations", target_value: 50, icon: "⚡", color: "#eab308", reward_config: { badge_name: "Power Agent", points_bonus: 200, title_en: "Elite Closer", title_fr: "Closer Élite", title_ar: "نجم التأكيد" } },
  { name_en: "🏆 Century Closer", name_fr: "🏆 Centurion", name_ar: "🏆 المائة", milestone_type: "total_confirmations", target_value: 100, icon: "🏆", color: "#a855f7", reward_config: { badge_name: "Century Closer", points_bonus: 500, title_en: "Legend", title_fr: "Légende", title_ar: "أسطورة", gift_name: "Special Prize" } },
  { name_en: "🎯 Sharp Shooter", name_fr: "🎯 Tireur d'Élite", name_ar: "🎯 القناص", milestone_type: "confirmation_rate", target_value: 90, icon: "🎯", color: "#22c55e", reward_config: { badge_name: "Sharp Shooter", points_bonus: 100 } },
  { name_en: "📅 Streak Master", name_fr: "📅 Maître Séries", name_ar: "📅 سيد السلاسل", milestone_type: "streak", target_value: 7, icon: "📅", color: "#14b8a6", reward_config: { badge_name: "Streak Master", points_bonus: 75 } },
  { name_en: "⚡ Speed Demon", name_fr: "⚡ Démon de Vitesse", name_ar: "⚡ شيطان السرعة", milestone_type: "speed", target_value: 5, icon: "⚡", color: "#ef4444", reward_config: { badge_name: "Speed Demon", points_bonus: 50 } },
];

export default function GamificationSettings() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MilestoneRule | null>(null);

  // Fetch settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["gamification-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("gamification_settings").select("*").limit(1).single();
      return data;
    },
  });

  const [localSettings, setLocalSettings] = useState<any>(null);
  useEffect(() => { if (settings) setLocalSettings(settings); }, [settings]);

  // Fetch rules
  const { data: rules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ["milestone-rules-admin"],
    queryFn: async () => {
      const { data } = await supabase.from("milestone_rules").select("*").order("sort_order");
      return (data || []) as MilestoneRule[];
    },
  });

  // Toggle system
  const toggleSystem = useMutation({
    mutationFn: async (enabled: boolean) => {
      await supabase.from("gamification_settings").update({ enabled }).eq("id", settings!.id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gamification-settings"] }); toast.success(t("تم التحديث", "Mis à jour", "Updated")); },
  });

  // Save settings
  const saveSettings = useMutation({
    mutationFn: async () => {
      const { id, created_at, updated_at, ...rest } = localSettings;
      await supabase.from("gamification_settings").update(rest).eq("id", id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gamification-settings"] }); toast.success(t("تم حفظ الإعدادات", "Paramètres enregistrés", "Settings saved")); },
  });

  // Save rule
  const saveRule = useMutation({
    mutationFn: async (rule: Partial<MilestoneRule>) => {
      if (rule.id) {
        const { id, created_at, updated_at, ...rest } = rule as any;
        await supabase.from("milestone_rules").update(rest).eq("id", id);
      } else {
        const maxOrder = rules.length > 0 ? Math.max(...rules.map(r => r.sort_order)) + 1 : 0;
        await supabase.from("milestone_rules").insert({ ...rule, sort_order: maxOrder } as any);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestone-rules-admin"] });
      setDrawerOpen(false);
      setEditingRule(null);
      toast.success(t("تم حفظ الإنجاز", "Jalon enregistré", "Milestone saved"));
    },
    onError: (e) => toast.error(t("خطأ: ", "Erreur: ", "Error: ") + e.message),
  });

  // Toggle rule active
  const toggleRule = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from("milestone_rules").update({ is_active: active }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["milestone-rules-admin"] }),
  });

  // Delete rule
  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("milestone_rules").delete().eq("id", id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["milestone-rules-admin"] }); toast.success(t("تم الحذف", "Supprimé", "Deleted")); },
  });

  // Duplicate
  const duplicateRule = (rule: MilestoneRule) => {
    const { id, created_at, updated_at, ...rest } = rule as any;
    saveRule.mutate({ ...rest, name_en: rest.name_en + " (copy)", sort_order: rules.length });
  };

  // Reorder
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rules.findIndex(r => r.id === active.id);
    const newIndex = rules.findIndex(r => r.id === over.id);
    const reordered = arrayMove(rules, oldIndex, newIndex);
    // Update sort_order for all
    for (let i = 0; i < reordered.length; i++) {
      await supabase.from("milestone_rules").update({ sort_order: i }).eq("id", reordered[i].id);
    }
    qc.invalidateQueries({ queryKey: ["milestone-rules-admin"] });
  };

  // Seed defaults
  const seedDefaults = useMutation({
    mutationFn: async () => {
      for (let i = 0; i < defaultMilestones.length; i++) {
        await supabase.from("milestone_rules").insert({ ...defaultMilestones[i], sort_order: i } as any);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["milestone-rules-admin"] }); toast.success(t("تم إنشاء الإنجازات الافتراضية", "Jalons par défaut créés", "Default milestones created")); },
  });

  if (settingsLoading || rulesLoading) return <div className="space-y-4"><Skeleton className="h-12" /><Skeleton className="h-60" /><Skeleton className="h-40" /></div>;

  const enabled = settings?.enabled ?? true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold">
            {t("إعدادات نظام المكافآت", "Paramètres de Gamification", "Gamification & Rewards Settings")}
          </h1>
          <p className="text-muted-foreground">
            {t("حدد نقاط التحفيز التلقائية لمكافأة فريق التأكيد", "Définissez des jalons automatiques pour récompenser votre équipe", "Define automatic achievement milestones to reward your confirmation team")}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
          <span className="text-sm font-medium">{t("النظام", "Système", "System")}</span>
          <Switch checked={enabled} onCheckedChange={(v) => toggleSystem.mutate(v)} />
          <span className={`text-sm font-semibold ${enabled ? "text-green-600" : "text-muted-foreground"}`}>{enabled ? "ON" : "OFF"}</span>
        </div>
      </div>

      {!enabled && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("النظام موقوف — لن تُمنح أي مكافآت تلقائية.", "Système en pause — aucune récompense automatique.", "System paused — no automatic rewards will be granted.")}
          </AlertDescription>
        </Alert>
      )}

      {/* Milestone Rules Builder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("قواعد الإنجازات", "Règles de Jalons", "Achievement Milestone Rules")}</CardTitle>
          <div className="flex gap-2">
            {rules.length === 0 && (
              <Button variant="outline" size="sm" onClick={() => seedDefaults.mutate()} disabled={seedDefaults.isPending}>
                Seed Defaults
              </Button>
            )}
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80" onClick={() => { setEditingRule(null); setDrawerOpen(true); }}>
              <Plus className="me-1 h-4 w-4" />{t("إضافة إنجاز", "Ajouter", "Add Milestone")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("لا توجد قواعد بعد. أضف أول إنجاز!", "Aucune règle. Ajoutez votre premier jalon !", "No rules yet. Add your first milestone or seed defaults!")}
            </p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {rules.map(rule => (
                    <MilestoneRuleCard
                      key={rule.id}
                      rule={rule}
                      lang={lang}
                      onEdit={() => { setEditingRule(rule); setDrawerOpen(true); }}
                      onDuplicate={() => duplicateRule(rule)}
                      onDelete={() => deleteRule.mutate(rule.id)}
                      onToggle={(active) => toggleRule.mutate({ id: rule.id, active })}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Points Settings */}
      {localSettings && (
        <PointsSystemSettings
          settings={localSettings}
          onChange={setLocalSettings}
          onSave={() => saveSettings.mutate()}
          saving={saveSettings.isPending}
          lang={lang}
        />
      )}

      {/* Badge Gallery */}
      <BadgeGallery rules={rules} lang={lang} />

      {/* Reward Log */}
      <RewardHistoryLog rules={rules} lang={lang} />

      {/* Form Drawer */}
      <MilestoneFormDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingRule(null); }}
        onSave={(rule) => saveRule.mutate(rule)}
        editingRule={editingRule}
        lang={lang}
      />
    </div>
  );
}
