import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-10 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand / Title */}
          <div>
            <h4 className="mb-4 font-display text-lg font-bold text-foreground">
              {lang === "ar" ? "الدورة" : "Courses"}
            </h4>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 md:justify-end">
            {[
              { label: lang === "ar" ? "الرئيسية" : "Home", to: "/" },
              { label: lang === "ar" ? "الدورات" : "Courses", to: "/courses" },
              { label: lang === "ar" ? "من نحن" : "About", to: "/about" },
              { label: lang === "ar" ? "كن مدرساً" : "Become Instructor", to: "/register" },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2023 Maisy Academy
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {lang === "ar" ? "إنضمل" : "Login"}
            </Link>
            <Link to="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {lang === "ar" ? "المدونات" : "Blog"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
