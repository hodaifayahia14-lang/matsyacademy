import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Youtube, Phone, MapPin, Mail } from "lucide-react";
import maisyLogo from "@/assets/maisy-logo.png";

const socialConfig = [
  { key: "social_facebook", icon: Facebook },
  { key: "social_twitter", icon: Twitter },
  { key: "social_youtube", icon: Youtube },
];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: socialLinks } = useQuery({
    queryKey: ["footer-social-links"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_content")
        .select("key, value_en")
        .in("key", socialConfig.map((s) => s.key));
      const map: Record<string, string> = {};
      data?.forEach((item: any) => { map[item.key] = item.value_en || ""; });
      return map;
    },
    staleTime: 60000,
  });

  return (
    <footer className="gradient-purple text-white">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <img src={maisyLogo} alt="Maisy Academy" className="h-10 w-10 rounded-lg object-contain" />
              <div>
                <span className="font-display text-lg font-bold text-white">أكاديمية مايسي</span>
                <span className="block text-xs text-white/60">Maisy Academy</span>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm text-white/70 leading-relaxed">{t("footer.description")}</p>
            <div className="flex gap-3">
              {socialConfig.map(({ key, icon: Icon }) => {
                const href = socialLinks?.[key] || "#";
                return (
                  <a key={key} href={href !== "" ? href : "#"} target={href && href !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">{t("footer.platform")}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("navbar.home"), to: "/" },
                { label: t("navbar.courses"), to: "/courses" },
                { label: t("footer.becomeInstructor"), to: "/register" },
                { label: t("navbar.about"), to: "/about" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/70 transition-colors hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("navbar.qa"), to: "/qa" },
                { label: t("footer.instructions"), to: "/instructions" },
                { label: t("footer.terms"), to: "/terms" },
                { label: t("navbar.contactUs"), to: "/contact" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/70 transition-colors hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">
              {t("footer.contact", "اتصل بنا")}
            </h4>
            <ul className="space-y-3">
              {["0669 79 95 16", "0554 27 59 94", "0799 10 92 95"].map((num) => (
                <li key={num}>
                  <a href={`https://wa.me/213${num.replace(/\s/g, "").slice(1)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> {num}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-3.5 w-3.5 shrink-0" /> info@maisyacademy.dz
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> Maisy Academy
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Maisy Academy — أكاديمية مايسي للتدريب و التطوير</p>
          <div className="flex gap-4 text-xs text-white/50">
            <Link to="/terms" className="hover:text-accent transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
