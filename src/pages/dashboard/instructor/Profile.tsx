import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Camera, Linkedin, Twitter, Phone, Briefcase, Clock } from "lucide-react";

export default function InstructorProfile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      const p = profile as any;
      setPhone(p.phone || "");
      setSpecialization(p.specialization || "");
      setYearsExperience(p.years_experience || 0);
      const social = p.social_links || {};
      setLinkedin(social.linkedin || "");
      setTwitter(social.twitter || "");
    }
  }, [profile]);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name, bio,
      phone, specialization,
      years_experience: yearsExperience,
      social_links: { linkedin, twitter },
    } as any).eq("id", user.id);
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
    toast.success(lang === "ar" ? "تم تحديث الصورة" : "Avatar updated");
    refreshProfile();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">{t("dashboard.instructor.profile")}</h1>

      {/* Avatar section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 end-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Camera className="h-3.5 w-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div>
              <p className="font-display font-semibold">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "ar" ? "المعلومات الأساسية" : "Basic Information"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("common.name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder={lang === "ar" ? "اكتب نبذة عن نفسك..." : "Tell students about yourself..."} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {lang === "ar" ? "التخصص" : "Specialization"}</Label>
              <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder={lang === "ar" ? "مثال: السلامة المهنية" : "e.g. HSE Safety"} />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {lang === "ar" ? "سنوات الخبرة" : "Years of Experience"}</Label>
              <Input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(+e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Social */}
      <Card>
        <CardHeader><CardTitle className="text-base">{lang === "ar" ? "معلومات الاتصال" : "Contact & Social"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {lang === "ar" ? "الهاتف" : "Phone"}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213..." />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</Label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Twitter className="h-3.5 w-3.5" /> Twitter</Label>
            <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? t("common.loading") : t("common.save")}
      </Button>
    </div>
  );
}
