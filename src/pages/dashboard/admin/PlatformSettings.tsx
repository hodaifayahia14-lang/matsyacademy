import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Facebook, Twitter, Linkedin, Youtube, Save } from "lucide-react";

const socialFields = [
  { key: "social_facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/maisyacademy" },
  { key: "social_twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/maisyacademy" },
  { key: "social_linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/maisyacademy" },
  { key: "social_youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@maisyacademy" },
];

export default function PlatformSettings() {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const [socials, setSocials] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const { data: siteContent } = useQuery({
    queryKey: ["site-content-socials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .in("key", socialFields.map((f) => f.key));
      return data || [];
    },
  });

  useEffect(() => {
    if (siteContent) {
      const map: Record<string, string> = {};
      siteContent.forEach((item: any) => {
        map[item.key] = item.value_en || "";
      });
      setSocials(map);
    }
  }, [siteContent]);

  const saveSocials = useMutation({
    mutationFn: async () => {
      for (const field of socialFields) {
        const val = socials[field.key] || "";
        const existing = siteContent?.find((s: any) => s.key === field.key);
        if (existing) {
          await supabase.from("site_content").update({ value_en: val, value_fr: val, value_ar: val }).eq("id", existing.id);
        } else {
          await supabase.from("site_content").insert({ key: field.key, value_en: val, value_fr: val, value_ar: val });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-content-socials"] });
      toast.success(t("common.save") + " ✓");
    },
    onError: () => toast.error("Error saving"),
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.settings")}</h1>
      <div className="max-w-lg space-y-6">
        {/* Theme */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <Label htmlFor="dark-mode">{t("common.darkMode")}</Label>
          <Switch id="dark-mode" checked={dark} onCheckedChange={setDark} />
        </div>

        {/* Language */}
        <div className="rounded-xl border bg-card p-4">
          <Label className="mb-2 block">{t("common.language")}</Label>
          <div className="flex gap-2">
            {[
              { code: "en", label: "English" },
              { code: "fr", label: "Français" },
              { code: "ar", label: "العربية" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  i18n.language === lang.code ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-xl border bg-card p-4">
          <Label className="mb-4 block text-base font-semibold">
            {i18n.language === "ar" ? "روابط التواصل الاجتماعي" : i18n.language === "fr" ? "Réseaux sociaux" : "Social Media Links"}
          </Label>
          <div className="space-y-3">
            {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input
                  placeholder={placeholder}
                  value={socials[key] || ""}
                  onChange={(e) => setSocials((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={() => saveSocials.mutate()} disabled={saveSocials.isPending}>
            <Save className="me-2 h-4 w-4" />
            {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
