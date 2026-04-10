import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Youtube, Instagram, Phone, MapPin, Mail } from "lucide-react";
import maisyLogo from "@/assets/maisy-logo-v2.png";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const quickLinks = [
    { label: t("navbar.courses"), to: "/courses" },
    { label: t("navbar.becomeInstructor"), to: "/register" },
    { label: t("footer.partnerships"), to: "/about" },
    { label: t("navbar.contactUs"), to: "/contact" },
  ];

  return (
    <footer className="gradient-purple text-white">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <img src={maisyLogo} alt="Maisy Academy" className="h-10 w-10 rounded-lg object-contain" />
              <div>
                <span className="font-display text-lg font-bold text-white">أكاديمية مايسي</span>
                <span className="block text-xs text-white/50">Maisy Academy</span>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm text-white/60 leading-relaxed">
              {lang === "ar" ? "أكاديمية مايسي لمنصة التعلم الرقمي لتطوير المهارات المهنية." 
                : lang === "fr" ? "Maisy Academy, plateforme d'apprentissage numérique pour le développement professionnel."
                : "Maisy Academy, digital learning platform for professional skills development."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">
              {lang === "ar" ? "الرئيسية" : lang === "fr" ? "Accueil" : "Home"}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/60 transition-colors hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">
              {lang === "ar" ? "التواصل" : lang === "fr" ? "Contact" : "Contact"}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+23123559375" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> +23 123559375
                </a>
              </li>
              <li>
                <a href="mailto:main@maacboos.com" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> main@maacboos.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> Maisy Academy
              </li>
            </ul>
          </div>

          {/* Social + About */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-accent">
              {lang === "ar" ? "الاجتماعي" : lang === "fr" ? "Réseaux" : "Social"}
            </h4>
            <p className="mb-4 text-sm text-white/60 leading-relaxed">
              {lang === "ar" ? "تابعنا على منصات التواصل الاجتماعي والمنصات الاجتماعية التعليمية." 
                : lang === "fr" ? "Suivez-nous sur les réseaux sociaux pour les dernières mises à jour."
                : "Follow us on social media for the latest updates."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="text-white/50 hover:text-accent transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-white/40">
            Maisy Academy • أكاديمية مايسي © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
