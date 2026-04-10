import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const t = (lang: string, ar: string, fr: string, en: string) =>
  lang === "ar" ? ar : lang === "fr" ? fr : en;

interface Settings {
  base_points_per_confirmation: number;
  rate_bonus_multiplier: number;
  streak_bonus_points: number;
  points_reset_period: string;
  leaderboard_formula: string;
  weight_points: number;
  weight_rate: number;
  weight_confirmations: number;
}

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onSave: () => void;
  saving: boolean;
  lang?: string;
}

export default function PointsSystemSettings({ settings, onChange, onSave, saving, lang = "en" }: Props) {
  const set = (key: keyof Settings, val: any) => onChange({ ...settings, [key]: val });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⭐ {t(lang, "إعدادات النقاط", "Configuration des Points", "Points Configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t(lang, "النقاط الأساسية لكل تأكيد", "Points de base par confirmation", "Base points per confirmation")}</Label>
            <Input type="number" value={settings.base_points_per_confirmation} onChange={e => set("base_points_per_confirmation", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "مضاعف المكافأة (نسبة ≥ 90%)", "Multiplicateur bonus (taux ≥ 90%)", "Bonus multiplier (rate ≥ 90%)")}</Label>
            <Input type="number" step="0.1" value={settings.rate_bonus_multiplier} onChange={e => set("rate_bonus_multiplier", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "مكافأة السلسلة يومياً", "Bonus série par jour", "Streak bonus per day")}</Label>
            <Input type="number" value={settings.streak_bonus_points} onChange={e => set("streak_bonus_points", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "فترة إعادة تعيين النقاط", "Période de réinitialisation", "Points reset period")}</Label>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={settings.points_reset_period} onChange={e => set("points_reset_period", e.target.value)}>
              <option value="never">{t(lang, "أبداً", "Jamais", "Never")}</option>
              <option value="weekly">{t(lang, "أسبوعياً", "Hebdomadaire", "Weekly")}</option>
              <option value="monthly">{t(lang, "شهرياً", "Mensuel", "Monthly")}</option>
            </select>
          </div>
        </div>

        <div>
          <Label className="mb-2 block font-semibold">
            {t(lang, "صيغة ترتيب المتصدرين", "Formule de classement", "Leaderboard Ranking Formula")}
          </Label>
          <RadioGroup value={settings.leaderboard_formula} onValueChange={v => set("leaderboard_formula", v)}>
            <div className="flex items-center gap-2"><RadioGroupItem value="confirmed_count" id="lf1" /><Label htmlFor="lf1">{t(lang, "حسب الطلبات المؤكدة", "Par commandes confirmées", "By confirmed orders")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="total_points" id="lf2" /><Label htmlFor="lf2">{t(lang, "حسب إجمالي النقاط", "Par total de points", "By total points")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="confirmation_rate" id="lf3" /><Label htmlFor="lf3">{t(lang, "حسب نسبة التأكيد %", "Par taux de confirmation %", "By confirmation rate %")}</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="combined" id="lf4" /><Label htmlFor="lf4">{t(lang, "نتيجة مركبة", "Score combiné", "Combined score")}</Label></div>
          </RadioGroup>
        </div>

        {settings.leaderboard_formula === "combined" && (
          <div className="space-y-3 rounded-lg border p-4">
            <p className="text-sm font-semibold">
              {t(lang, "توزيع الأوزان (يجب أن يكون المجموع 100%)", "Distribution des poids (total = 100%)", "Weight Distribution (must sum to 100%)")}
            </p>
            <div>
              <Label className="text-xs">{t(lang, "النقاط", "Points", "Points")}: {settings.weight_points}%</Label>
              <Slider value={[settings.weight_points]} max={100} step={5} onValueChange={([v]) => set("weight_points", v)} />
            </div>
            <div>
              <Label className="text-xs">{t(lang, "النسبة", "Taux", "Rate")}: {settings.weight_rate}%</Label>
              <Slider value={[settings.weight_rate]} max={100} step={5} onValueChange={([v]) => set("weight_rate", v)} />
            </div>
            <div>
              <Label className="text-xs">{t(lang, "التأكيدات", "Confirmations", "Confirmations")}: {settings.weight_confirmations}%</Label>
              <Slider value={[settings.weight_confirmations]} max={100} step={5} onValueChange={([v]) => set("weight_confirmations", v)} />
            </div>
          </div>
        )}

        <Button onClick={onSave} disabled={saving} className="w-full">
          <Save className="me-2 h-4 w-4" />
          {saving
            ? t(lang, "جاري الحفظ...", "Enregistrement...", "Saving...")
            : t(lang, "حفظ إعدادات النقاط", "Enregistrer les paramètres", "Save Points Settings")}
        </Button>
      </CardContent>
    </Card>
  );
}
