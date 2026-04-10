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
  { labelKey: "navbar.becomeInstructor", to: "/register" },
  { labelKey: "navbar.partnerships", to: "/about" },
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? "gradient-purple shadow-lg"
        : "gradient-purple"
    }`}>
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={maisyLogo} alt="Maisy Academy" className="h-10 w-10 rounded-lg object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-white">أكاديمية مايسي</span>
            <span className="text-[10px] text-white/50">Maisy Academy</span>
          </div>
        </Link>

        {/* Desktop Nav — center */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ labelKey, to }) => (
            <Link key={to} to={to}>
              <Button variant="ghost" size="sm"
                className={`text-sm transition-colors ${
                  isActive(to)
                    ? "text-accent font-semibold"
                    : "text-white/80 hover:text-accent hover:bg-white/10"
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
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">{initials}</AvatarFallback>
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
            <Link to="/register">
              <Button size="sm" className="gradient-gold text-accent-foreground font-bold hover:opacity-90 rounded-lg px-6">
                {t("navbar.startLearning")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          {user && (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(dashboardPath)}>
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-accent text-accent-foreground text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 gradient-purple lg:hidden">
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map(({ labelKey, to }) => (
                <Link key={to} to={to}
                  className={`rounded-lg px-4 py-2.5 text-sm transition-colors ${
                    isActive(to) ? "bg-white/10 text-accent font-semibold" : "text-white/70 hover:bg-white/5 hover:text-accent"
                  }`}>
                  {t(labelKey)}
                </Link>
              ))}
              <div className="my-2 border-t border-white/10" />
              {!user && (
                <Link to="/register">
                  <Button className="w-full gradient-gold text-accent-foreground font-bold">{t("navbar.startLearning")}</Button>
                </Link>
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
