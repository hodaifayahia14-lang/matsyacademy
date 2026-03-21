import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

export default function Certificates() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: certs, isLoading } = useQuery({
    queryKey: ["student-certificates", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*, courses(title)")
        .eq("student_id", user!.id)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.student.certificates")}</h1>
      {!certs?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Award className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-2 font-display text-lg font-semibold">{t("dashboard.student.noCertificates")}</h3>
          <p className="text-sm text-muted-foreground">{t("dashboard.student.noCertificatesDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((c: any) => (
            <div key={c.id} className="rounded-xl border bg-card p-6 shadow-card">
              <Award className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-1 font-display font-semibold">{c.courses?.title}</h3>
              <p className="mb-2 text-xs text-muted-foreground">
                ID: {c.certificate_uid} • {new Date(c.issued_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
