import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(t("contact.sent"));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("contact.title")}</h1>
          <p className="text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("contact.address")}</h3>
                <p className="text-sm text-muted-foreground">123 Academy Street, Education City</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("contact.phone")}</h3>
                <p className="text-sm text-muted-foreground">+01 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("contact.email")}</h3>
                <p className="text-sm text-muted-foreground">info@maisyacademy.com</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6">
            <input type="text" placeholder={t("contact.namePlaceholder")} required
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" placeholder={t("contact.emailPlaceholder")} required
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <textarea placeholder={t("contact.messagePlaceholder")} rows={5} required
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? t("common.loading") : t("contact.send")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
