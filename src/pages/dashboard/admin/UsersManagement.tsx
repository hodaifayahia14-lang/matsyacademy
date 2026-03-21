import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Search, ShieldCheck, ShieldX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersManagement() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("*");
      return profiles?.map((p) => ({
        ...p,
        roles: roles?.filter((r) => r.user_id === p.id).map((r) => r.role) || [],
      })) || [];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Check if role already exists
      const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("role", role as any);
      if (existing && existing.length > 0) {
        // Remove the role
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
        if (error) throw error;
      } else {
        // Add the role
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role updated");
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = users?.filter((u) => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.roles.includes(roleFilter as any);
    return matchSearch && matchRole;
  }) || [];

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const initials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.admin.users")}</h1>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("dashboard.admin.searchUsers")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rounded-lg border bg-card px-3 py-2 text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">{t("dashboard.admin.allRoles")}</option>
          <option value="student">{t("auth.student")}</option>
          <option value="instructor">{t("auth.instructor")}</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>{t("common.role")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead>Assign Role</TableHead>
              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {u.roles.map((r: string) => (
                      <Badge key={r} variant="outline" className="text-xs capitalize">{r}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.is_active ? "outline" : "destructive"} className="text-xs">
                    {u.is_active ? "Active" : "Banned"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {["instructor", "admin"].map((role) => (
                      <Button key={role} size="sm" variant={u.roles.includes(role) ? "default" : "outline"}
                        className="text-xs capitalize h-7 px-2"
                        onClick={() => assignRole.mutate({ userId: u.id, role })}>
                        {u.roles.includes(role) ? <ShieldX className="mr-1 h-3 w-3" /> : <ShieldCheck className="mr-1 h-3 w-3" />}
                        {role}
                      </Button>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant={u.is_active ? "destructive" : "default"}
                    onClick={() => toggleActive.mutate({ id: u.id, active: !u.is_active })}>
                    {u.is_active ? t("dashboard.admin.ban") : t("dashboard.admin.activate")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
