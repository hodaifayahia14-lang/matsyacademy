import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Youtube, Instagram, Phone, MapPin, Mail } from "lucide-react";
import maisyLogo from "@/assets/maisy-logo-v2.png";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <footer className="border-t border-border bg-card">
      {/* Main footer */}
      <div className="container py-10 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <img src={maisyLogo} alt="Maisy Academy" className="h-10 w-10 object-contain" />
              <span className="font-display text-lg font-bold text-primary">أكاديمية مايسي</span>
            </Link>
            <p className="mb-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              {lang === "ar" ? "أكاديمية مايسي دورة أكاديمية مايسي وسنني المعلوماعيات في العمار مقلي الجزائر"
                : lang === "fr" ? "Maisy Academy - Plateforme d'apprentissage numérique pour le développement professionnel en Algérie."
                : "Maisy Academy - Digital learning platform for professional development in Algeria."}
            </p>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {lang === "ar" ? "الدورات" : lang === "fr" ? "Cours" : "Courses"}
            </h4>
            <ul className="space-y-2">
              {[
                { label: lang === "ar" ? "الأفضل مبيعاً" : lang === "fr" ? "Meilleures ventes" : "Best Sellers", to: "/courses" },
                { label: lang === "ar" ? "التسويق الرقمي" : lang === "fr" ? "Marketing Digital" : "Digital Marketing", to: "/courses" },
                { label: lang === "ar" ? "الأعمال" : lang === "fr" ? "Business" : "Business", to: "/courses" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-primary">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {lang === "ar" ? "من نحن" : lang === "fr" ? "À propos" : "About"}
            </h4>
            <ul className="space-y-2">
              {[
                { label: t("navbar.about"), to: "/about" },
                { label: t("navbar.contactUs"), to: "/contact" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-primary">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {lang === "ar" ? "تسجيل الدخول" : lang === "fr" ? "Connexion" : "Login"}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+9821355378" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Phone className="h-3.5 w-3.5 shrink-0" /> +9821355378O
                </a>
              </li>
              <li>
                <a href="mailto:maisyacademy.com" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="h-3.5 w-3.5 shrink-0" /> maisyacademy.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> Maisy Academy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Maisy © أكاديمية Maisy
          </p>
        </div>
      </div>
    </footer>
  );
}
