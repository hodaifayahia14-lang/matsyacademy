import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, Target, Eye, Shield, CheckCircle } from "lucide-react";

const team = [
  { name: "Dr. Ahmed Matsy", role_en: "Founder & CEO", role_fr: "Fondateur & PDG", role_ar: "المؤسس والرئيس التنفيذي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedMatsy" },
  { name: "Sheikh Ibrahim Khalil", role_en: "Head of Religious Guidance", role_fr: "Responsable Guide Religieux", role_ar: "رئيس الإرشاد الديني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SheikhIbrahim" },
  { name: "Mme. Sarah Benali", role_en: "Education Advisor", role_fr: "Conseillère Éducative", role_ar: "مستشارة تعليمية", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahBenali" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  const statsData = [
    { icon: Users, value: "+500", label: lang === "ar" ? "طالب مسجّل" : lang === "fr" ? "Étudiants inscrits" : "Enrolled Students" },
    { icon: BookOpen, value: "3", label: lang === "ar" ? "دورات معتمدة" : lang === "fr" ? "Formations certifiées" : "Certified Courses" },
    { icon: Shield, value: "2", label: lang === "ar" ? "مجال تخصص" : lang === "fr" ? "Domaines" : "Specialization Fields" },
  ];

  return (
    <div>
      <section className="bg-secondary/50 py-20">
        <div className="container text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">{t("about.title")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("about.subtitle")}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-xl border bg-card p-8">
            <Target className="mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground">{t("about.mission")}</h2>
            <p className="text-muted-foreground">{t("about.missionText")}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="rounded-xl border bg-card p-8">
            <Eye className="mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground">{t("about.vision")}</h2>
            <p className="text-muted-foreground">{t("about.visionText")}</p>
          </motion.div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-10">
        <div className="container">
          <div className="mx-auto max-w-2xl rounded-xl border-2 border-primary/20 bg-primary/5 p-8 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-display text-xl font-bold text-foreground">
              {lang === "ar" ? "مرخصة من وزارة التكوين المهني" : lang === "fr" ? "Agréée par le Ministère de la Formation Professionnelle" : "Accredited by Ministry of Vocational Training"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" ? "أكاديمية مايسي معتمدة رسمياً ومرخصة لتقديم دورات تدريبية معتمدة"
                : lang === "fr" ? "Matsy Academy est officiellement agréée pour dispenser des formations certifiées"
                : "Matsy Academy is officially accredited to deliver certified training programs"}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">{t("about.team")}</h2>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
            {team.map((m, i) => {
              const role = lang === "ar" ? m.role_ar : lang === "fr" ? m.role_fr : m.role_en;
              return (
                <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="rounded-xl border bg-card p-6 text-center">
                  <img src={m.avatar} alt="" className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-primary/20" />
                  <h3 className="font-display font-semibold text-foreground">{m.name}</h3>
                  <span className="text-xs font-medium text-primary">{role}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 rounded-xl border bg-card p-8">
            {statsData.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
