import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Users, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackInstructors = [
  { id: "fallback-1", name: "Dr. Ahmed Maisy", role_en: "HSE Expert & Founder", role_fr: "Expert HSE & Fondateur", role_ar: "خبير السلامة والمؤسس", avatar: "https://randomuser.me/api/portraits/men/32.jpg", students: 500, courses: 2, rating: 4.9 },
  { id: "fallback-2", name: "Sheikh Ibrahim Khalil", role_en: "Religious Guidance Expert", role_fr: "Expert en Guide Religieux", role_ar: "خبير الإرشاد الديني", avatar: "https://randomuser.me/api/portraits/men/75.jpg", students: 312, courses: 1, rating: 4.9 },
  { id: "fallback-3", name: "Mme. Sarah Benali", role_en: "Education Advisor", role_fr: "Conseillère Éducative", role_ar: "مستشارة تعليمية", avatar: "https://randomuser.me/api/portraits/women/44.jpg", students: 200, courses: 0, rating: 4.8 },
  { id: "fallback-4", name: "M. Rachid Toumi", role_en: "Certified HSE Inspector", role_fr: "Inspecteur HSE Certifié", role_ar: "مفتش أمن معتمد", avatar: "https://randomuser.me/api/portraits/men/52.jpg", students: 178, courses: 0, rating: 4.8 },
];

export default function Instructors() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  const { data: dbInstructors, isLoading } = useQuery({
    queryKey: ["instructors-list"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "instructor");
      if (!roles?.length) return [];
      const ids = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("id", ids);
      // Get course counts
      const { data: courses } = await supabase.from("courses").select("instructor_id").eq("status", "published");
      const courseCounts: Record<string, number> = {};
      courses?.forEach((c) => { courseCounts[c.instructor_id] = (courseCounts[c.instructor_id] || 0) + 1; });
      return (profiles || []).map((p) => ({
        id: p.id,
        name: p.name,
        role_en: p.specialization || "Instructor",
        role_fr: p.specialization || "Instructeur",
        role_ar: p.specialization || "مدرّب",
        avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`,
        students: 0,
        courses: courseCounts[p.id] || 0,
        rating: 4.9,
      }));
    },
  });

  const instructors = dbInstructors && dbInstructors.length > 0 ? dbInstructors : fallbackInstructors;

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("navbar.instructors")}</h1>
          <p className="text-muted-foreground">{t("mentors.subtitle")}</p>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((m, i) => {
              const role = lang === "ar" ? m.role_ar : lang === "fr" ? m.role_fr : m.role_en;
              const isFallback = m.id.startsWith("fallback");
              const Wrapper = isFallback ? "div" : Link;
              const wrapperProps = isFallback ? {} : { to: `/instructors/${m.id}` };
              return (
                <Wrapper key={m.id} {...(wrapperProps as any)}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="aspect-square overflow-hidden">
                      <img src={m.avatar} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">{role}</p>
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.students}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {m.courses}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {m.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
