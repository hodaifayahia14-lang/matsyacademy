import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import maisyLogo from "@/assets/maisy-logo-v2.png";
import type { LucideIcon } from "lucide-react";

function useIsRTL() {
  const { i18n } = useTranslation();
  return i18n.language === "ar";
}

interface NavItem { title: string; url: string; icon: LucideIcon; }
interface DashboardLayoutProps { items: NavItem[]; groupLabel: string; }

function DashboardSidebar({ items, groupLabel }: DashboardLayoutProps) {
  const { state } = useSidebar();
  const { t } = useTranslation();
  const collapsed = state === "collapsed";
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isRTL = useIsRTL();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <Sidebar collapsible="icon" side={isRTL ? "right" : "left"} className="border-none">
      <SidebarContent className="flex flex-col gradient-purple text-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={maisyLogo} alt="Maisy" className="h-8 w-8 rounded-lg object-contain" />
            {!collapsed && (
              <div>
                <span className="font-display text-sm font-bold text-white">أكاديمية مايسي</span>
                <span className="block text-[10px] text-white/50">Maisy Academy</span>
              </div>
            )}
          </Link>
        </div>

        {/* User profile */}
        {!collapsed && (
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Avatar className="h-9 w-9 ring-2 ring-accent/50">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-accent text-accent-foreground text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{profile?.name || "User"}</p>
              <p className="truncate text-xs text-white/50">{profile?.email}</p>
            </div>
          </div>
        )}

        {/* Back to website */}
        <div className="border-b border-white/10 px-2 py-2">
          <Button variant="ghost" size={collapsed ? "icon" : "sm"} asChild
            className="w-full justify-start text-white/70 hover:text-accent hover:bg-white/5">
            <Link to="/">
              <Home className="h-4 w-4" />
              {!collapsed && <span className="ms-2">{t("navbar.home")}</span>}
            </Link>
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-accent text-xs uppercase tracking-wider">{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end
                      className="text-white/70 hover:bg-white/10 hover:text-white transition-colors rounded-lg"
                      activeClassName="bg-accent/20 text-accent border-s-2 border-accent font-medium">
                      <item.icon className="me-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-white/10 p-2">
          <Button variant="ghost" size={collapsed ? "icon" : "sm"}
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10"
            onClick={async () => { await signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ms-2">{t("navbar.signOut")}</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ items, groupLabel }: DashboardLayoutProps) {
  const { t } = useTranslation();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar items={items} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card/95 backdrop-blur-md px-4 md:px-6">
            <SidebarTrigger />
            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder={t("catalog.searchPlaceholder", "Search...")}
                  className="w-full rounded-lg border border-border bg-secondary/50 ps-10 pe-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="flex-1 md:hidden" />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bell className="h-4 w-4" />
            </Button>
            <LanguageSwitcher />
          </header>
          <main className="flex-1 p-4 md:p-6 bg-secondary/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
