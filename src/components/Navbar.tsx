import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown, Search, LogOut, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = [
  "IT & Software", "Business", "Languages", "Health", "Law", "Arts",
  "Science", "Marketing", "Design", "Cooking", "Education", "Sport",
];

const pages = [
  { label: "About Us", to: "/about" },
  { label: "Q&A", to: "/qa" },
  { label: "Instructions", to: "/instructions" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-header" : "bg-background"}`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-primary">
            Matsy<span className="text-foreground"> Academy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">{t("navbar.home")}</Button>
          </Link>

          {/* Courses dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                {t("navbar.courses")} <ChevronDown className="ms-1 h-3 w-3" />
              </Button>
            </Link>
            <AnimatePresence>
              {catOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute start-0 top-full w-56 rounded-lg border bg-card p-2 shadow-lg">
                  {categories.map((c) => (
                    <Link key={c} to={`/courses?category=${encodeURIComponent(c)}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
                      {c}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/instructors">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">{t("navbar.instructors")}</Button>
          </Link>

          <Link to="/blog">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">{t("navbar.blog")}</Button>
          </Link>

          {/* Pages dropdown */}
          <div className="relative" onMouseEnter={() => setPagesOpen(true)} onMouseLeave={() => setPagesOpen(false)}>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
              {t("navbar.pages")} <ChevronDown className="ms-1 h-3 w-3" />
            </Button>
            <AnimatePresence>
              {pagesOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute start-0 top-full w-48 rounded-lg border bg-card p-2 shadow-lg">
                  {pages.map(({ label, to }) => (
                    <Link key={to} to={to}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary">
                      {label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>+01 123 456 7890</span>
          </div>
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
                <DropdownMenuSeparator />
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
            <Link to="/contact">
              <Button size="sm" className="gap-1">
                {t("navbar.contactUs")} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-background lg:hidden">
            <div className="container flex flex-col gap-2 py-4">
              <Link to="/" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.home")}</Link>
              <Link to="/courses" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.courses")}</Link>
              <Link to="/instructors" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.instructors")}</Link>
              <Link to="/blog" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.blog")}</Link>
              <Link to="/about" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.about")}</Link>
              <Link to="/qa" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.qa")}</Link>
              <Link to="/contact" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.contactUs")}</Link>
              <LanguageSwitcher />
              {user ? (
                <>
                  <Link to={dashboardPath} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.dashboard")}</Link>
                  <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-start text-sm text-destructive hover:bg-secondary">{t("navbar.signOut")}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">{t("navbar.login")}</Link>
                  <Link to="/register"><Button className="w-full" size="sm">{t("navbar.signUp")}</Button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
