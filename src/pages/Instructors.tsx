import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Instructors() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  const instructors = [
    {
      name: "Dr. Ahmed Matsy",
      role_en: "HSE Expert & Founder", role_fr: "Expert HSE & Fondateur", role_ar: "خبير السلامة والمؤسس",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedMatsy",
      students: 500, courses: 2, rating: 4.9,
    },
    {
      name: "Sheikh Ibrahim Khalil",
      role_en: "Religious Guidance Expert", role_fr: "Expert en Guide Religieux", role_ar: "خبير الإرشاد الديني",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SheikhIbrahim",
      students: 312, courses: 1, rating: 4.9,
    },
    {
      name: "Mme. Sarah Benali",
      role_en: "Education Advisor", role_fr: "Conseillère Éducative", role_ar: "مستشارة تعليمية",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahBenali",
      students: 200, courses: 0, rating: 4.8,
    },
    {
      name: "M. Rachid Toumi",
      role_en: "Certified HSE Inspector", role_fr: "Inspecteur HSE Certifié", role_ar: "مفتش أمن معتمد",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RachidToumi",
      students: 178, courses: 0, rating: 4.8,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("navbar.instructors")}</h1>
          <p className="text-muted-foreground">{t("mentors.subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((m, i) => {
            const role = lang === "ar" ? m.role_ar : lang === "fr" ? m.role_fr : m.role_en;
            return (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-square overflow-hidden">
                  <img src={m.avatar} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{role}</p>
                  <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                    <span>{m.students.toLocaleString()} {t("stats.students")}</span>
                    <span>{m.courses} {t("stats.courses")}</span>
                    <span>⭐ {m.rating}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
