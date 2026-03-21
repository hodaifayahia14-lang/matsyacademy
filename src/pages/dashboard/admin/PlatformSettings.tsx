import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function PlatformSettings() {
  const { t, i18n } = useTranslation();
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.settings")}</h1>
      <div className="max-w-lg space-y-6">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <Label htmlFor="dark-mode">{t("common.darkMode")}</Label>
          <Switch id="dark-mode" checked={dark} onCheckedChange={setDark} />
        </div>
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
      </div>
    </div>
  );
}
