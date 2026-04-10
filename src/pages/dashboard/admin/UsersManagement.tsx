import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Search, ShieldCheck, ShieldX, UserPlus, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersManagement() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("student");
  const [showPw, setShowPw] = useState(false);
  const [creating, setCreating] = useState(false);
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
      toast.success(t("تم تحديث المستخدم", "Utilisateur mis à jour", "User updated"));
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("role", role as any);
      if (existing && existing.length > 0) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(t("تم تحديث الدور", "Rôle mis à jour", "Role updated"));
    },
    onError: (e) => toast.error(e.message),
  });

  const handleCreateUser = async () => {
    if (!newName || !newEmail || !newPassword) {
      toast.error(t("جميع الحقول مطلوبة", "Tous les champs sont requis", "All fields are required"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("كلمة المرور 6 أحرف على الأقل", "Mot de passe min 6 caractères", "Password min 6 characters"));
      return;
    }
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-user", {
        body: { email: newEmail, password: newPassword, name: newName, role: newRole },
      });
      if (res.error || res.data?.error) throw new Error(res.data?.error || res.error?.message);
      toast.success(t("تم إنشاء المستخدم ✅", "Utilisateur créé ✅", "User created ✅"));
      setAddOpen(false);
      setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("student");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreating(false);
    }
  };

  const filtered = users?.filter((u) => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.roles.includes(roleFilter as any);
    return matchSearch && matchRole;
  }) || [];

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const initials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{t("إدارة المستخدمين", "Gestion des utilisateurs", "Users Management")}</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white">
              <UserPlus className="h-4 w-4" />
              {t("إضافة مستخدم", "Ajouter un utilisateur", "Add User")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("إنشاء مستخدم جديد", "Créer un utilisateur", "Create New User")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>{t("الاسم الكامل", "Nom complet", "Full Name")}</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ahmed Ben Ali" />
              </div>
              <div>
                <Label>{t("البريد الإلكتروني", "Email", "Email")}</Label>
                <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@example.com" />
              </div>
              <div>
                <Label>{t("كلمة المرور", "Mot de passe", "Password")}</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••" />
                  <Button type="button" variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label>{t("الدور", "Rôle", "Role")}</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">{t("طالب", "Étudiant", "Student")}</SelectItem>
                    <SelectItem value="confirmation_agent">{t("وكيل تأكيد", "Agent de confirmation", "Confirmation Agent")}</SelectItem>
                    <SelectItem value="admin">{t("مسؤول", "Administrateur", "Admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#5B2D8E] to-[#F5A623] text-white" onClick={handleCreateUser} disabled={creating}>
                {creating ? t("جارٍ الإنشاء...", "Création...", "Creating...") : t("إنشاء المستخدم", "Créer l'utilisateur", "Create User")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("بحث بالاسم أو البريد...", "Rechercher par nom ou email...", "Search by name or email...")} className="ps-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("جميع الأدوار", "Tous les rôles", "All Roles")}</SelectItem>
            <SelectItem value="student">{t("طالب", "Étudiant", "Student")}</SelectItem>
            <SelectItem value="confirmation_agent">{t("وكيل تأكيد", "Agent", "Agent")}</SelectItem>
            <SelectItem value="admin">{t("مسؤول", "Admin", "Admin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("المستخدم", "Utilisateur", "User")}</TableHead>
              <TableHead>{t("الدور", "Rôle", "Role")}</TableHead>
              <TableHead>{t("الحالة", "Statut", "Status")}</TableHead>
              <TableHead>{t("تعيين الدور", "Assigner un rôle", "Assign Role")}</TableHead>
              <TableHead>{t("إجراءات", "Actions", "Actions")}</TableHead>
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
                  <div className="flex gap-1 flex-wrap">
                    {u.roles.map((r: string) => (
                      <Badge key={r} variant="outline" className="text-xs capitalize">{r}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.is_active ? "outline" : "destructive"} className="text-xs">
                    {u.is_active ? t("نشط", "Actif", "Active") : t("محظور", "Banni", "Banned")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {["confirmation_agent", "admin"].map((role) => (
                      <Button key={role} size="sm" variant={u.roles.includes(role) ? "default" : "outline"}
                        className="text-xs capitalize h-7 px-2"
                        onClick={() => assignRole.mutate({ userId: u.id, role })}>
                        {u.roles.includes(role) ? <ShieldX className="me-1 h-3 w-3" /> : <ShieldCheck className="me-1 h-3 w-3" />}
                        {role === "confirmation_agent" ? t("وكيل", "Agent", "Agent") : t("مسؤول", "Admin", "Admin")}
                      </Button>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant={u.is_active ? "destructive" : "default"}
                    onClick={() => toggleActive.mutate({ id: u.id, active: !u.is_active })}>
                    {u.is_active ? t("حظر", "Bannir", "Ban") : t("تفعيل", "Activer", "Activate")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {t("لا يوجد مستخدمون", "Aucun utilisateur", "No users found")}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
