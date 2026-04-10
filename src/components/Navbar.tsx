import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import maisyLogo from "@/assets/maisy-logo-v2.png";

const navLinks = [
  { labelKey: "navbar.home", to: "/" },
  { labelKey: "navbar.courses", to: "/courses" },
  { labelKey: "navbar.instructors", to: "/instructors" },
  { labelKey: "navbar.about", to: "/about" },
  { labelKey: "navbar.contactUs", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, profile, roles, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const dashboardPath = roles.includes("admin") ? "/dashboard/admin"
    : roles.includes("instructor") ? "/dashboard/instructor" : "/dashboard/student";

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 bg-card border-b border-border ${
      scrolled ? "shadow-header" : ""
    }`}>
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={maisyLogo} alt="Maisy Academy" className="h-10 w-10 object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-primary">أكاديمية مايسي</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ labelKey, to }) => (
            <Link key={to} to={to}>
              <Button variant="ghost" size="sm"
                className={`text-sm font-medium transition-colors ${
                  isActive(to)
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}>
                {t(labelKey)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                  <User className="me-2 h-4 w-4" /> {t("navbar.dashboard")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="me-2 h-4 w-4" /> {t("navbar.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5 rounded-lg">
                  {t("navbar.login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="gradient-gold text-accent-foreground font-semibold hover:opacity-90 rounded-lg">
                  {t("navbar.signUp")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          {user && (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(dashboardPath)}>
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-card lg:hidden">
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map(({ labelKey, to }) => (
                <Link key={to} to={to}
                  className={`rounded-lg px-4 py-2.5 text-sm transition-colors ${
                    isActive(to) ? "bg-primary/10 text-primary font-semibold" : "text-foreground/70 hover:bg-secondary hover:text-primary"
                  }`}>
                  {t(labelKey)}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              {!user && (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-primary text-primary">{t("navbar.login")}</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button className="w-full gradient-gold text-accent-foreground font-semibold">{t("navbar.signUp")}</Button>
                  </Link>
                </div>
              )}
              {user && (
                <Button variant="ghost" className="justify-start text-destructive" onClick={handleSignOut}>
                  <LogOut className="me-2 h-4 w-4" /> {t("navbar.signOut")}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
