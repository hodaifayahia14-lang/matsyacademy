import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { LucideIcon } from "lucide-react";

function useIsRTL() {
  const { i18n } = useTranslation();
  return i18n.language === "ar";
}

interface NavItem { title: string; url: string; icon: LucideIcon; }
interface DashboardLayoutProps { items: NavItem[]; groupLabel: string; }

function DashboardSidebar({ items, groupLabel }: DashboardLayoutProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <Sidebar collapsible="icon" side={useIsRTL() ? "right" : "left"} className="border-e">
      <SidebarContent className="flex flex-col bg-background">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            {!collapsed ? (
              <span className="font-display text-lg font-bold text-primary">Matsy<span className="text-foreground"> Academy</span></span>
            ) : (
              <span className="font-display text-lg font-bold text-primary">M</span>
            )}
          </Link>
        </div>
        {!collapsed && (
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{profile?.name || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-xs uppercase tracking-wider">{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end
                      className="text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                      activeClassName="bg-primary/10 text-primary border-s-2 border-primary font-medium">
                      <item.icon className="me-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto border-t p-2">
          <Button variant="ghost" size={collapsed ? "icon" : "sm"}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={async () => { await signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ms-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ items, groupLabel }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar items={items} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-md px-4">
            <SidebarTrigger />
            <div className="flex-1" />
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
