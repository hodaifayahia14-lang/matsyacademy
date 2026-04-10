import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { MilestoneRule } from "./MilestoneRuleCard";

const t = (lang: string, ar: string, fr: string, en: string) =>
  lang === "ar" ? ar : lang === "fr" ? fr : en;

const milestoneTypes = (lang: string) => [
  { value: "total_confirmations", label: t(lang, "إجمالي التأكيدات", "Total Confirmations", "Total Confirmations") },
  { value: "monthly_confirmations", label: t(lang, "هذا الشهر", "Ce mois", "This Month") },
  { value: "weekly_confirmations", label: t(lang, "هذا الأسبوع", "Cette semaine", "This Week") },
  { value: "confirmation_rate", label: t(lang, "النسبة %", "Taux %", "Rate %") },
  { value: "streak", label: t(lang, "سلسلة", "Série", "Streak") },
  { value: "speed", label: t(lang, "السرعة", "Vitesse", "Speed") },
];

const presetColors = ["#3b82f6", "#f97316", "#8b5cf6", "#eab308", "#22c55e", "#14b8a6", "#ef4444", "#ec4899"];

const emojiList = ["🏅", "🌟", "🔥", "💪", "⚡", "🏆", "🎯", "📅", "⭐", "🎖️", "🚀", "💎", "👑", "🎉", "🦁"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (rule: Partial<MilestoneRule>) => void;
  editingRule?: MilestoneRule | null;
  lang?: string;
}

export default function MilestoneFormDrawer({ open, onClose, onSave, editingRule, lang = "en" }: Props) {
  const [form, setForm] = useState<Partial<MilestoneRule>>({
    name_ar: "", name_fr: "", name_en: "",
    milestone_type: "total_confirmations",
    target_value: 1,
    icon: "🏅", color: "#3b82f6",
    is_active: true,
    show_on_leaderboard: true,
    show_on_agent_dashboard: true,
    is_repeatable: false,
    repeat_period: null,
    reward_config: {},
  });

  useEffect(() => {
    if (editingRule) setForm({ ...editingRule });
    else setForm({
      name_ar: "", name_fr: "", name_en: "",
      milestone_type: "total_confirmations", target_value: 1,
      icon: "🏅", color: "#3b82f6", is_active: true,
      show_on_leaderboard: true, show_on_agent_dashboard: true,
      is_repeatable: false, repeat_period: null, reward_config: {},
    });
  }, [editingRule, open]);

  const rc = form.reward_config || {};
  const setRc = (key: string, val: any) => setForm(p => ({ ...p, reward_config: { ...p.reward_config, [key]: val } }));

  const unitLabel = form.milestone_type === "confirmation_rate"
    ? "%" : form.milestone_type === "streak"
    ? t(lang, "أيام", "jours", "days") : form.milestone_type === "speed"
    ? t(lang, "ساعات", "heures", "hours") : t(lang, "تأكيدات", "confirmations", "confirmations");

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side={lang === "ar" ? "left" : "right"} className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {editingRule
              ? t(lang, "تعديل الإنجاز", "Modifier le Jalon", "Edit Milestone")
              : t(lang, "إنجاز جديد", "Nouveau Jalon", "New Milestone")}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Name tabs */}
          <div>
            <Label className="mb-2 block font-semibold">
              {t(lang, "اسم الإنجاز", "Nom du Jalon", "Milestone Name")}
            </Label>
            <Tabs defaultValue="en">
              <TabsList className="mb-2"><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="fr">FR</TabsTrigger><TabsTrigger value="ar">AR</TabsTrigger></TabsList>
              <TabsContent value="en"><Input value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))} placeholder="e.g. First Streak" /></TabsContent>
              <TabsContent value="fr"><Input value={form.name_fr} onChange={e => setForm(p => ({ ...p, name_fr: e.target.value }))} placeholder="ex. Premier Exploit" /></TabsContent>
              <TabsContent value="ar"><Input value={form.name_ar} onChange={e => setForm(p => ({ ...p, name_ar: e.target.value }))} placeholder="مثال: الشرارة الأولى" dir="rtl" /></TabsContent>
            </Tabs>
          </div>

          {/* Milestone Type */}
          <div>
            <Label className="mb-2 block font-semibold">
              {t(lang, "نوع الإنجاز", "Type de Jalon", "Milestone Type")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {milestoneTypes(lang).map(mt => (
                <Badge key={mt.value} variant={form.milestone_type === mt.value ? "default" : "outline"}
                  className="cursor-pointer" onClick={() => setForm(p => ({ ...p, milestone_type: mt.value }))}>
                  {mt.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target */}
          <div>
            <Label className="mb-2 block font-semibold">
              {t(lang, "القيمة المستهدفة", "Valeur Cible", "Target Value")}
            </Label>
            <div className="flex items-center gap-2">
              <Input type="number" min={1} value={form.target_value} onChange={e => setForm(p => ({ ...p, target_value: Number(e.target.value) }))} className="w-28" />
              <span className="text-sm text-muted-foreground">{unitLabel}</span>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <Label className="block font-semibold">
              {t(lang, "المكافآت", "Récompenses", "Rewards")}
            </Label>

            {/* Badge */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🏅</span><Label>{t(lang, "اسم الشارة (EN)", "Nom du Badge (EN)", "Badge Name (EN)")}</Label>
              </div>
              <Input value={rc.badge_name || ""} onChange={e => setRc("badge_name", e.target.value)} placeholder={t(lang, "اسم الشارة", "Nom du badge", "Badge name")} />
            </div>

            {/* Points */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>⭐</span><Label>{t(lang, "نقاط إضافية", "Points Bonus", "Bonus Points")}</Label>
              </div>
              <Input type="number" value={rc.points_bonus || ""} onChange={e => setRc("points_bonus", Number(e.target.value) || 0)} placeholder="0" />
            </div>

            {/* Title */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🎖️</span><Label>{t(lang, "اللقب / الرتبة", "Titre / Rang", "Title / Rank")}</Label>
              </div>
              <Tabs defaultValue="en">
                <TabsList className="mb-2"><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="fr">FR</TabsTrigger><TabsTrigger value="ar">AR</TabsTrigger></TabsList>
                <TabsContent value="en"><Input value={rc.title_en || ""} onChange={e => setRc("title_en", e.target.value)} placeholder="e.g. Elite Closer" /></TabsContent>
                <TabsContent value="fr"><Input value={rc.title_fr || ""} onChange={e => setRc("title_fr", e.target.value)} placeholder="ex. Champion Confirmateur" /></TabsContent>
                <TabsContent value="ar"><Input value={rc.title_ar || ""} onChange={e => setRc("title_ar", e.target.value)} placeholder="نجم التأكيد" dir="rtl" /></TabsContent>
              </Tabs>
            </div>

            {/* Gift */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🎁</span><Label>{t(lang, "الهدية", "Cadeau", "Gift")}</Label>
              </div>
              <Input value={rc.gift_name || ""} onChange={e => setRc("gift_name", e.target.value)} placeholder={t(lang, "اسم الهدية", "Nom du cadeau", "Gift name")} className="mb-2" />
              <Textarea value={rc.gift_description || ""} onChange={e => setRc("gift_description", e.target.value)} placeholder={t(lang, "وصف الهدية", "Description du cadeau", "Gift description")} rows={2} />
            </div>

            {/* Notification */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>📢</span><Label>{t(lang, "رسالة الإشعار (EN)", "Message de Notification (EN)", "Notification Message (EN)")}</Label>
              </div>
              <Textarea value={rc.notification_en || ""} onChange={e => setRc("notification_en", e.target.value)} placeholder="🎉 Congratulations!" rows={2} />
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label className="block font-semibold">{t(lang, "الظهور", "Visibilité", "Visibility")}</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t(lang, "عرض في لوحة المتصدرين", "Afficher sur le classement", "Show on leaderboard")}</span>
              <Switch checked={form.show_on_leaderboard} onCheckedChange={v => setForm(p => ({ ...p, show_on_leaderboard: v }))} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t(lang, "عرض في لوحة الوكيل", "Afficher sur le tableau de bord agent", "Show on agent dashboard")}</span>
              <Switch checked={form.show_on_agent_dashboard} onCheckedChange={v => setForm(p => ({ ...p, show_on_agent_dashboard: v }))} />
            </div>
          </div>

          {/* Repeatable */}
          <div>
            <Label className="mb-2 block font-semibold">{t(lang, "التكرار", "Fréquence", "Frequency")}</Label>
            <RadioGroup value={form.is_repeatable ? "repeatable" : "one_time"} onValueChange={v => setForm(p => ({ ...p, is_repeatable: v === "repeatable" }))}>
              <div className="flex items-center gap-2"><RadioGroupItem value="one_time" id="one_time" /><Label htmlFor="one_time">{t(lang, "مرة واحدة", "Une fois", "One-Time")}</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="repeatable" id="repeatable" /><Label htmlFor="repeatable">{t(lang, "قابل للتكرار", "Répétable", "Repeatable")}</Label></div>
            </RadioGroup>
            {form.is_repeatable && (
              <select className="mt-2 rounded-md border bg-background px-3 py-2 text-sm" value={form.repeat_period || "monthly"} onChange={e => setForm(p => ({ ...p, repeat_period: e.target.value }))}>
                <option value="weekly">{t(lang, "أسبوعياً", "Hebdomadaire", "Weekly")}</option>
                <option value="monthly">{t(lang, "شهرياً", "Mensuel", "Monthly")}</option>
              </select>
            )}
          </div>

          {/* Icon & Color */}
          <div className="space-y-3">
            <Label className="block font-semibold">{t(lang, "الأيقونة واللون", "Icône & Couleur", "Icon & Color")}</Label>
            <div className="flex flex-wrap gap-2">
              {emojiList.map(e => (
                <button key={e} onClick={() => setForm(p => ({ ...p, icon: e }))}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg ${form.icon === e ? "ring-2 ring-primary" : ""}`}>{e}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {presetColors.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`h-8 w-8 rounded-full border-2 ${form.color === c ? "ring-2 ring-primary ring-offset-2" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
              <Input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="w-24" placeholder="#hex" />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{t(lang, "معاينة", "Aperçu", "Preview")}</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: (form.color || "#3b82f6") + "22" }}>{form.icon}</div>
              <div>
                <p className="font-semibold">{(lang === "ar" ? form.name_ar : lang === "fr" ? form.name_fr : form.name_en) || t(lang, "اسم الإنجاز", "Nom du Jalon", "Milestone Name")}</p>
                <p className="text-xs text-muted-foreground">{t(lang, "الهدف:", "Cible:", "Target:")} {form.target_value} {unitLabel}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pb-6">
            <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" onClick={() => onSave(form)}>
              {editingRule ? t(lang, "تحديث الإنجاز", "Mettre à jour", "Update Milestone") : t(lang, "حفظ الإنجاز", "Enregistrer", "Save Milestone")}
            </Button>
            <Button variant="outline" onClick={onClose}>{t(lang, "إلغاء", "Annuler", "Cancel")}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
