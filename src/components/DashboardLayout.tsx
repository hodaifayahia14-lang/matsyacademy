import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  items: NavItem[];
  groupLabel: string;
}

function DashboardSidebar({ items, groupLabel }: DashboardLayoutProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Sidebar collapsible="icon" className="border-e border-border">
      <SidebarContent className="flex flex-col bg-background">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Link to="/" className="flex items-center gap-2">
            {!collapsed ? (
              <span className="font-display text-lg font-bold text-gold">
                Matsy<span className="text-primary"> Academy</span>
              </span>
            ) : (
              <span className="font-display text-lg font-bold text-gold">M</span>
            )}
          </Link>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
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
          <SidebarGroupLabel className="text-gold text-xs uppercase tracking-wider">{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground hover:bg-secondary hover:text-gold transition-colors"
                      activeClassName="bg-primary/20 text-gold border-s-2 border-primary font-medium"
                    >
                      <item.icon className="me-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-border p-2">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10"
            onClick={async () => { await signOut(); navigate("/"); }}
          >
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
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-md px-4">
            <SidebarTrigger className="text-gold" />
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="text-gold hover:text-gold-light">
              <Bell className="h-4 w-4" />
            </Button>
            <LanguageSwitcher />
          </header>
          <main className="flex-1 p-4 md:p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
