import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LogOut, Bell, Home, Search, ChevronLeft, ChevronRight, Menu, X,
  LayoutDashboard, ClipboardList, BookOpen, Users, Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import maisyLogo from "@/assets/maisy-logo-v2.png";
import type { LucideIcon } from "lucide-react";

function useIsRTL() {
  const { i18n } = useTranslation();
  return i18n.language === "ar";
}

export interface NavItem { title: string; url: string; icon: LucideIcon; }
interface DashboardLayoutProps { items: NavItem[]; groupLabel: string; }

function DashboardSidebar({ items, groupLabel, collapsed, setCollapsed, mobileOpen, setMobileOpen }: DashboardLayoutProps & {
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = useIsRTL();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const isActive = (url: string) => {
    if (url === location.pathname) return true;
    if (url !== "/dashboard/admin" && url !== "/dashboard/agent" && location.pathname.startsWith(url)) return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: "#1A0A3C" }}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src={maisyLogo} alt="Maisy" className="h-8 w-8 rounded-lg object-contain flex-shrink-0" />
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
              <span className="font-display text-sm font-bold text-white block truncate">أكاديمية مايسي</span>
              <span className="block text-[10px] text-white/40">Maisy Academy</span>
            </motion.div>
          )}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          {collapsed ? (isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : (isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)}
        </button>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2" style={{ ringColor: "hsl(42, 72%, 45%)" }}>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-xs font-bold" style={{ background: "hsl(42, 72%, 45%)", color: "#1A0A3C" }}>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{profile?.name || "User"}</p>
              <p className="truncate text-xs text-white/40">{profile?.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back to website */}
      <div className="border-b border-white/10 px-3 py-2">
        <Link to="/" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Home className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{isRTL ? "العودة للموقع" : "Back to Website"}</span>}
        </Link>
      </div>

      {/* Nav group */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && <p className="mb-3 px-3 text-[10px] uppercase tracking-widest font-bold" style={{ color: "hsl(42, 72%, 55%)" }}>{groupLabel}</p>}
        <nav className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <Link key={item.url} to={item.url}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-white shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                } ${collapsed ? "justify-center" : ""}`}
                style={active ? { background: "linear-gradient(135deg, hsl(270, 52%, 34%), hsl(42, 72%, 45%))" } : {}}>
                <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : "text-white/40 group-hover:text-white"}`} />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors w-full ${collapsed ? "justify-center" : ""}`}
          onClick={async () => { await signOut(); navigate("/"); }}>
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{isRTL ? "تسجيل الخروج" : "Sign Out"}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 z-50 ${isRTL ? "right-0" : "left-0"}`}
        style={{ background: "#1A0A3C" }}>
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: isRTL ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 280 : -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed top-0 bottom-0 z-50 w-[260px] lg:hidden ${isRTL ? "right-0" : "left-0"}`}
              style={{ background: "#1A0A3C" }}>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DashboardLayout({ items, groupLabel }: DashboardLayoutProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { profile } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  // Find current page title
  const currentItem = items.find(item => {
    if (item.url === location.pathname) return true;
    if (item.url !== "/dashboard/admin" && item.url !== "/dashboard/agent" && location.pathname.startsWith(item.url)) return true;
    return false;
  });
  const pageTitle = currentItem?.title || groupLabel;

  return (
    <div className="min-h-screen flex w-full" style={{ background: "#F4F6FA" }}>
      <DashboardSidebar items={items} groupLabel={groupLabel}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${isRTL ? (collapsed ? "mr-[72px]" : "mr-[260px]") : (collapsed ? "ml-[72px]" : "ml-[260px]")} max-lg:!ms-0 max-lg:!me-0`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-white/95 backdrop-blur-md px-4 md:px-6 shadow-sm">
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}
          <div className="hidden md:block">
            <h1 className="font-display text-lg font-bold text-foreground">{pageTitle}</h1>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex max-w-xs">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder={t("common.search") + "..."}
                className="rounded-xl border border-border bg-secondary/50 ps-10 pe-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-56" />
            </div>
          </div>

          {/* Language */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">3</span>
          </button>

          {/* Avatar */}
          <Avatar className="h-8 w-8 ring-2 ring-border cursor-pointer">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 start-0 end-0 z-40 flex items-center justify-around border-t border-border bg-white/95 backdrop-blur-md h-14 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          {items.slice(0, 5).map((item) => {
            const active = location.pathname === item.url || (item.url !== "/dashboard/admin" && item.url !== "/dashboard/agent" && location.pathname.startsWith(item.url));
            return (
              <Link key={item.url} to={item.url}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
