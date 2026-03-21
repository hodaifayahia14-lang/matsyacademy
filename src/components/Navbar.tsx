import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown, GraduationCap, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = [
  "IT & Software", "Business", "Languages", "Health", "Law", "Arts",
  "Science", "Marketing", "Design", "Cooking", "Education", "Sport",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, roles, signOut } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath = roles.includes("admin")
    ? "/dashboard/admin"
    : roles.includes("instructor")
    ? "/dashboard/instructor"
    : "/dashboard/student";

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-card/95 backdrop-blur-md shadow-header" : "bg-card"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Edu<span className="text-primary">Zone</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Course Catalog
            </Button>
          </Link>
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Categories <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full w-56 rounded-lg border bg-card p-2 shadow-lg"
                >
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/courses?category=${encodeURIComponent(c)}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                    >
                      {c}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-4 w-4" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
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
                  <User className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-card md:hidden"
          >
            <div className="container flex flex-col gap-2 py-4">
              <Link to="/courses" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">Course Catalog</Link>
              {user ? (
                <>
                  <Link to={dashboardPath} className="rounded-md px-3 py-2 text-sm hover:bg-secondary">Dashboard</Link>
                  <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-left text-sm hover:bg-secondary">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-md px-3 py-2 text-sm hover:bg-secondary">Log In</Link>
                  <Link to="/register">
                    <Button className="w-full" size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
