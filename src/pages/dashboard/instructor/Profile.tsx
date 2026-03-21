import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Camera } from "lucide-react";

export default function InstructorProfile() {
  const { t } = useTranslation();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name, bio }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success(t("common.success")); refreshProfile(); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    toast.success("Avatar updated");
    refreshProfile();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.instructor.profile")}</h1>
      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Camera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="font-display font-semibold">{profile?.name}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium">{t("common.name")}</label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Bio</label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} /></div>
          <Button onClick={handleSave} disabled={saving}>{saving ? t("common.loading") : t("common.save")}</Button>
        </div>
      </div>
    </div>
  );
}
