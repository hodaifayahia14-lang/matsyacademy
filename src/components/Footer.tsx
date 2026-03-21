import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import matsyLogo from "@/assets/matsy-logo.png";

const socials = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
];

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    [t("footer.platform")]: [
      { label: t("navbar.courses"), to: "/courses" },
      { label: t("footer.becomeInstructor"), to: "/register" },
      { label: t("navbar.about"), to: "/about" },
    ],
    [t("footer.support")]: [
      { label: t("navbar.qa"), to: "/qa" },
      { label: t("footer.instructions"), to: "/instructions" },
      { label: t("footer.terms"), to: "/terms" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <img src={matsyLogo} alt="Matsy Academy" className="h-10 w-10 rounded-lg object-contain" />
              <span className="font-display text-xl font-bold">
                <span className="text-accent">Matsy</span>
                <span className="text-foreground"> Academy</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">{t("footer.description")}</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-accent">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Matsy Academy — أكاديمية مايسي للتدريب و التطوير
        </div>
      </div>
    </footer>
  );
}
