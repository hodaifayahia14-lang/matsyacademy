import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Save } from "lucide-react";

const defaultKeys = [
  { key: "about_mission", label: "Mission Statement" },
  { key: "about_vision", label: "Vision Statement" },
  { key: "about_stats_students", label: "Stat: Students Count" },
  { key: "about_stats_courses", label: "Stat: Courses Count" },
  { key: "about_stats_fields", label: "Stat: Specialization Fields" },
  { key: "about_accreditation", label: "Accreditation Text" },
];

export default function AboutManagement() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, { value_en: string; value_fr: string; value_ar: string }>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      const map: Record<string, any> = {};
      defaultKeys.forEach(({ key }) => {
        const existing = data.find((d) => d.key === key);
        map[key] = {
          value_en: existing?.value_en || "",
          value_fr: existing?.value_fr || "",
          value_ar: existing?.value_ar || "",
        };
      });
      setForm(map);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      for (const { key } of defaultKeys) {
        const values = form[key];
        if (!values) continue;
        const existing = data?.find((d) => d.key === key);
        if (existing) {
          await supabase.from("site_content").update(values).eq("id", existing.id);
        } else {
          await supabase.from("site_content").insert({ key, ...values });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-site-content"] });
      toast.success("Content saved");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const update = (key: string, lang: "value_en" | "value_fr" | "value_ar") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: e.target.value } }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">About Page Content</h1>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          <Save className="mr-1 h-4 w-4" /> {t("common.save")}
        </Button>
      </div>

      <div className="space-y-4">
        {defaultKeys.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {key.includes("stats") ? (
                  <>
                    <Input placeholder="English" value={form[key]?.value_en || ""} onChange={update(key, "value_en")} />
                    <Input placeholder="Français" value={form[key]?.value_fr || ""} onChange={update(key, "value_fr")} />
                    <Input placeholder="العربية" value={form[key]?.value_ar || ""} onChange={update(key, "value_ar")} dir="rtl" />
                  </>
                ) : (
                  <>
                    <Textarea placeholder="English" rows={3} value={form[key]?.value_en || ""} onChange={update(key, "value_en")} />
                    <Textarea placeholder="Français" rows={3} value={form[key]?.value_fr || ""} onChange={update(key, "value_fr")} />
                    <Textarea placeholder="العربية" rows={3} value={form[key]?.value_ar || ""} onChange={update(key, "value_ar")} dir="rtl" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
