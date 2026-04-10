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

const milestoneTypes = [
  { value: "total_confirmations", label: "Total Confirmations" },
  { value: "monthly_confirmations", label: "This Month" },
  { value: "weekly_confirmations", label: "This Week" },
  { value: "confirmation_rate", label: "Rate %" },
  { value: "streak", label: "Streak" },
  { value: "speed", label: "Speed" },
];

const presetColors = ["#3b82f6", "#f97316", "#8b5cf6", "#eab308", "#22c55e", "#14b8a6", "#ef4444", "#ec4899"];

const emojiList = ["🏅", "🌟", "🔥", "💪", "⚡", "🏆", "🎯", "📅", "⭐", "🎖️", "🚀", "💎", "👑", "🎉", "🦁"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (rule: Partial<MilestoneRule>) => void;
  editingRule?: MilestoneRule | null;
}

export default function MilestoneFormDrawer({ open, onClose, onSave, editingRule }: Props) {
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

  const unitLabel = form.milestone_type === "confirmation_rate" ? "%" : form.milestone_type === "streak" ? "days" : form.milestone_type === "speed" ? "hours" : "confirmations";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{editingRule ? "Edit Milestone" : "New Milestone"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Name tabs */}
          <div>
            <Label className="mb-2 block font-semibold">Milestone Name</Label>
            <Tabs defaultValue="en">
              <TabsList className="mb-2"><TabsTrigger value="en">EN</TabsTrigger><TabsTrigger value="fr">FR</TabsTrigger><TabsTrigger value="ar">AR</TabsTrigger></TabsList>
              <TabsContent value="en"><Input value={form.name_en} onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))} placeholder="e.g. First Streak" /></TabsContent>
              <TabsContent value="fr"><Input value={form.name_fr} onChange={e => setForm(p => ({ ...p, name_fr: e.target.value }))} placeholder="ex. Premier Exploit" /></TabsContent>
              <TabsContent value="ar"><Input value={form.name_ar} onChange={e => setForm(p => ({ ...p, name_ar: e.target.value }))} placeholder="مثال: الشرارة الأولى" dir="rtl" /></TabsContent>
            </Tabs>
          </div>

          {/* Milestone Type */}
          <div>
            <Label className="mb-2 block font-semibold">Milestone Type</Label>
            <div className="flex flex-wrap gap-2">
              {milestoneTypes.map(t => (
                <Badge key={t.value} variant={form.milestone_type === t.value ? "default" : "outline"}
                  className="cursor-pointer" onClick={() => setForm(p => ({ ...p, milestone_type: t.value }))}>
                  {t.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target */}
          <div>
            <Label className="mb-2 block font-semibold">Target Value</Label>
            <div className="flex items-center gap-2">
              <Input type="number" min={1} value={form.target_value} onChange={e => setForm(p => ({ ...p, target_value: Number(e.target.value) }))} className="w-28" />
              <span className="text-sm text-muted-foreground">{unitLabel}</span>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <Label className="block font-semibold">Rewards</Label>

            {/* Badge */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🏅</span><Label>Badge Name (EN)</Label>
              </div>
              <Input value={rc.badge_name || ""} onChange={e => setRc("badge_name", e.target.value)} placeholder="Badge name" />
            </div>

            {/* Points */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>⭐</span><Label>Bonus Points</Label>
              </div>
              <Input type="number" value={rc.points_bonus || ""} onChange={e => setRc("points_bonus", Number(e.target.value) || 0)} placeholder="0" />
            </div>

            {/* Title */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>🎖️</span><Label>Title / Rank</Label>
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
                <span>🎁</span><Label>Gift</Label>
              </div>
              <Input value={rc.gift_name || ""} onChange={e => setRc("gift_name", e.target.value)} placeholder="Gift name" className="mb-2" />
              <Textarea value={rc.gift_description || ""} onChange={e => setRc("gift_description", e.target.value)} placeholder="Gift description" rows={2} />
            </div>

            {/* Notification */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-2">
                <span>📢</span><Label>Notification Message (EN)</Label>
              </div>
              <Textarea value={rc.notification_en || ""} onChange={e => setRc("notification_en", e.target.value)} placeholder="🎉 Congratulations!" rows={2} />
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label className="block font-semibold">Visibility</Label>
            <div className="flex items-center justify-between"><span className="text-sm">Show on leaderboard</span><Switch checked={form.show_on_leaderboard} onCheckedChange={v => setForm(p => ({ ...p, show_on_leaderboard: v }))} /></div>
            <div className="flex items-center justify-between"><span className="text-sm">Show on agent dashboard</span><Switch checked={form.show_on_agent_dashboard} onCheckedChange={v => setForm(p => ({ ...p, show_on_agent_dashboard: v }))} /></div>
          </div>

          {/* Repeatable */}
          <div>
            <Label className="mb-2 block font-semibold">Frequency</Label>
            <RadioGroup value={form.is_repeatable ? "repeatable" : "one_time"} onValueChange={v => setForm(p => ({ ...p, is_repeatable: v === "repeatable" }))}>
              <div className="flex items-center gap-2"><RadioGroupItem value="one_time" id="one_time" /><Label htmlFor="one_time">One-Time</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="repeatable" id="repeatable" /><Label htmlFor="repeatable">Repeatable</Label></div>
            </RadioGroup>
            {form.is_repeatable && (
              <select className="mt-2 rounded-md border bg-background px-3 py-2 text-sm" value={form.repeat_period || "monthly"} onChange={e => setForm(p => ({ ...p, repeat_period: e.target.value }))}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          {/* Icon & Color */}
          <div className="space-y-3">
            <Label className="block font-semibold">Icon & Color</Label>
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
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Preview</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl" style={{ backgroundColor: (form.color || "#3b82f6") + "22" }}>{form.icon}</div>
              <div>
                <p className="font-semibold">{form.name_en || "Milestone Name"}</p>
                <p className="text-xs text-muted-foreground">Target: {form.target_value} {unitLabel}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pb-6">
            <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80" onClick={() => onSave(form)}>
              {editingRule ? "Update Milestone" : "Save Milestone"}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
