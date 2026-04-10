import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut, Bell, Home, Search, ChevronLeft, ChevronRight, Menu, X, HelpCircle
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
    <div className="flex flex-col h-full bg-purple-900">
      {/* Logo Header */}
      <div className="px-5 py-6 mb-2">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-inner">
            <img src={maisyLogo} alt="Maisy" className="h-7 w-7 object-contain" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-base font-bold text-white leading-tight">أكاديمية مايسي</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-purple-200/60">Admin Console</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {items.map((item) => {
          const active = isActive(item.url);
          return (
            <Link key={item.url} to={item.url}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "text-amber-400 font-bold border-e-4 border-amber-400 bg-white/5"
                  : "text-purple-100/70 hover:text-white hover:bg-white/10"
              } ${collapsed ? "justify-center px-2" : ""}`}>
              <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-amber-400" : ""}`} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Card at Bottom */}
      <div className="px-5 py-4 mt-auto">
        {!collapsed && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-white/60 text-xs mb-2">Logged in as</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-amber-500/30">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs font-bold bg-amber-500 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white leading-tight truncate">{profile?.name || "Admin"}</p>
                <p className="text-[10px] text-white/40">Super Admin</p>
              </div>
            </div>
          </div>
        )}
        <button
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 mt-2 text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors w-full ${collapsed ? "justify-center" : ""}`}
          onClick={async () => { await signOut(); navigate("/"); }}>
          <LogOut className="h-4 w-4 shrink-0" />
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
        style={{ background: "#581c87" }}>
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
              style={{ background: "#581c87" }}>
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

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="min-h-screen flex w-full" style={{ background: "#F8F9FA" }}>
      <DashboardSidebar items={items} groupLabel={groupLabel}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${isRTL ? (collapsed ? "mr-[72px]" : "mr-[260px]") : (collapsed ? "ml-[72px]" : "ml-[260px]")} max-lg:!ms-0 max-lg:!me-0`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-white/80 backdrop-blur-md px-6 border-b border-slate-100 shadow-sm">
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-purple-50 transition-colors">
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder={isRTL ? "بحث عن الدورات، الطلاب، أو الطلبات..." : "Search for courses, students, or orders..."}
                className="w-full pe-10 ps-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700 hidden sm:block">{profile?.name || "Admin"}</span>
              <Avatar className="h-9 w-9 ring-2 ring-purple-100">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
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
                className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${active ? "text-purple-700" : "text-slate-400"}`}>
                <item.icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
