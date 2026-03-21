import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, Target, Eye } from "lucide-react";

const team = [
  { name: "Dr. Ahmed Matsy", role: "Founder & CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
  { name: "Sarah Benali", role: "Head of Education", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Marc Dupont", role: "CTO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="bg-matsy-light py-20">
        <div className="container text-center">
          <h1 className="mb-4 font-display text-4xl font-bold" style={{ color: "hsl(var(--bg-light-foreground))" }}>{t("about.title")}</h1>
          <p className="mx-auto max-w-2xl text-lg" style={{ color: "hsl(var(--bg-light-foreground) / 0.7)" }}>{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container grid gap-12 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="rounded-xl border border-border bg-card p-8">
            <Target className="mb-4 h-10 w-10 text-gold" />
            <h2 className="mb-3 font-display text-2xl font-bold text-gold">{t("about.mission")}</h2>
            <p className="text-muted-foreground">{t("about.missionText")}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="rounded-xl border border-border bg-card p-8">
            <Eye className="mb-4 h-10 w-10 text-gold" />
            <h2 className="mb-3 font-display text-2xl font-bold text-gold">{t("about.vision")}</h2>
            <p className="text-muted-foreground">{t("about.visionText")}</p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-gold">{t("about.team")}</h2>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
            {team.map((m, i) => (
              <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 text-center">
                <img src={m.avatar} alt="" className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-gold/30" />
                <h3 className="font-display font-semibold text-gold">{m.name}</h3>
                <span className="text-xs font-medium text-primary">{m.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-8">
            {[
              { icon: Users, value: "50,000+", label: t("stats.students") },
              { icon: BookOpen, value: "2,400+", label: t("stats.courses") },
              { icon: Award, value: "35,000+", label: t("stats.certificates") },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto mb-2 h-8 w-8 text-gold" />
                <p className="font-display text-2xl font-bold text-gold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
