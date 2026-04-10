import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from "lucide-react";
import logo from "@/assets/maisy-logo.png";

export default function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const quickLinks = [
    { label: lang === "ar" ? "الرئيسية" : "Home", to: "/" },
    { label: lang === "ar" ? "الدورات" : "Courses", to: "/courses" },
    { label: lang === "ar" ? "المدرّبون" : "Instructors", to: "/instructors" },
    { label: lang === "ar" ? "المدونة" : "Blog", to: "/blog" },
  ];

  const supportLinks = [
    { label: lang === "ar" ? "من نحن" : "About Us", to: "/about" },
    { label: lang === "ar" ? "تواصل معنا" : "Contact", to: "/contact" },
    { label: lang === "ar" ? "الشروط والأحكام" : "Terms", to: "/terms" },
    { label: lang === "ar" ? "الأسئلة الشائعة" : "FAQ", to: "/qa" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient strip */}
      <div className="h-1 gradient-purple-gold" />

      {/* Main footer */}
      <div className="gradient-purple text-primary-foreground">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 start-[10%] w-2 h-2 rounded-full bg-current" />
          <div className="absolute top-20 start-[30%] w-1.5 h-1.5 rounded-full bg-current" />
          <div className="absolute top-12 end-[20%] w-2.5 h-2.5 rounded-full bg-current" />
          <div className="absolute bottom-16 start-[60%] w-2 h-2 rounded-full bg-current" />
          <div className="absolute bottom-10 end-[15%] w-1.5 h-1.5 rounded-full bg-current" />
        </div>

        <div className="container relative z-10 py-14 lg:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-5">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="Maisy Academy" className="h-10 w-10 rounded-lg" />
                <span className="text-xl font-bold font-display">Maisy Academy</span>
              </Link>
              <p className="text-sm leading-relaxed text-primary-foreground/70">
                {lang === "ar"
                  ? "منصة تعليمية رائدة تقدم أفضل الدورات التدريبية باللغة العربية لتطوير مهاراتك المهنية"
                  : "A leading educational platform offering top-quality courses to develop your professional skills"}
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Youtube, href: "#" },
                  { icon: Send, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground/80 transition-all hover:bg-accent hover:text-accent-foreground hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
                {lang === "ar" ? "روابط سريعة" : "Quick Links"}
              </h5>
              <ul className="space-y-3">
                {quickLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                      <span className="h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
                {lang === "ar" ? "الدعم" : "Support"}
              </h5>
              <ul className="space-y-3">
                {supportLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent">
                      <span className="h-1 w-1 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </h5>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                  {lang === "ar" ? "الجزائر العاصمة، الجزائر" : "Algiers, Algeria"}
                </li>
                <li>
                  <a href="tel:+213555000000" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    <Phone className="h-4 w-4 shrink-0 text-accent" />
                    +213 555 000 000
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@maisy.academy" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                    <Mail className="h-4 w-4 shrink-0 text-accent" />
                    contact@maisy.academy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10">
          <div className="container flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
            <p className="text-xs text-primary-foreground/50">
              © {new Date().getFullYear()} Maisy Academy. {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved."}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-foreground/50">
              {lang === "ar" ? "صنع بـ" : "Made with"}
              <span className="text-red-400 mx-0.5">♥</span>
              {lang === "ar" ? "في الجزائر" : "in Algeria"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
