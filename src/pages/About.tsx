import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, Target, Eye, Shield, CheckCircle, GraduationCap, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import maisyLogo from "@/assets/maisy-logo-v2.png";

const team = [
  { name: "Dr. Ahmed Maisy", role_en: "Founder & CEO", role_fr: "Fondateur & PDG", role_ar: "المؤسس والرئيس التنفيذي", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sheikh Ibrahim Khalil", role_en: "Head of Religious Guidance", role_fr: "Responsable Guide Religieux", role_ar: "رئيس الإرشاد الديني", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
  { name: "Mme. Sarah Benali", role_en: "Education Advisor", role_fr: "Conseillère Éducative", role_ar: "مستشارة تعليمية", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
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

  const whyChoose = [
    { icon: Award, title_en: "Certified Training", title_fr: "Formation Certifiée", title_ar: "تكوين معتمد", desc_en: "All our courses are accredited by the Ministry of Vocational Training.", desc_fr: "Tous nos cours sont agréés par le Ministère de la Formation Professionnelle.", desc_ar: "جميع دوراتنا معتمدة من وزارة التكوين المهني." },
    { icon: GraduationCap, title_en: "Expert Instructors", title_fr: "Formateurs Experts", title_ar: "مدربون خبراء", desc_en: "Learn from industry professionals with years of practical experience.", desc_fr: "Apprenez de professionnels avec des années d'expérience pratique.", desc_ar: "تعلم من محترفين بسنوات من الخبرة العملية." },
    { icon: Clock, title_en: "Flexible Learning", title_fr: "Apprentissage Flexible", title_ar: "تعلم مرن", desc_en: "Study at your own pace with 24/7 access to recorded courses.", desc_fr: "Étudiez à votre rythme avec un accès 24h/24 aux cours enregistrés.", desc_ar: "ادرس بالسرعة التي تناسبك مع وصول على مدار الساعة." },
    { icon: CheckCircle, title_en: "Recognized Certificates", title_fr: "Certificats Reconnus", title_ar: "شهادات معترف بها", desc_en: "Earn certificates valued by employers across Algeria and the Arab world.", desc_fr: "Obtenez des certificats reconnus par les employeurs en Algérie et dans le monde arabe.", desc_ar: "احصل على شهادات معترف بها من قبل أصحاب العمل في الجزائر والعالم العربي." },
  ];

  const howItWorks = [
    { step: "01", title_en: "Browse Courses", title_fr: "Parcourir les Cours", title_ar: "تصفح الدورات", desc_en: "Explore our certified courses and books", desc_fr: "Explorez nos formations et livres certifiés", desc_ar: "استكشف دوراتنا وكتبنا المعتمدة" },
    { step: "02", title_en: "Enroll & Learn", title_fr: "S'inscrire & Apprendre", title_ar: "سجّل وتعلّم", desc_en: "Sign up and start learning at your pace", desc_fr: "Inscrivez-vous et apprenez à votre rythme", desc_ar: "سجّل وابدأ التعلم بالسرعة التي تناسبك" },
    { step: "03", title_en: "Get Certified", title_fr: "Obtenez le Certificat", title_ar: "احصل على الشهادة", desc_en: "Earn your recognized professional certificate", desc_fr: "Obtenez votre certificat professionnel reconnu", desc_ar: "احصل على شهادتك المهنية المعترف بها" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary/50 py-20">
        <div className="container text-center">
          <img src={maisyLogo} alt="Maisy Academy" className="mx-auto mb-6 h-20 w-20 rounded-2xl object-contain shadow-lg" />
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">{t("about.title")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Mission & Vision */}
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

      {/* How It Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">
            {lang === "ar" ? "كيف يعمل" : lang === "fr" ? "Comment ça marche" : "How It Works"}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                  {lang === "ar" ? item.title_ar : lang === "fr" ? item.title_fr : item.title_en}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar" ? item.desc_ar : lang === "fr" ? item.desc_fr : item.desc_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">
            {lang === "ar" ? "لماذا تختار أكاديمية مايسي؟" : lang === "fr" ? "Pourquoi choisir Maisy Academy ?" : "Why Choose Maisy Academy?"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                    {lang === "ar" ? item.title_ar : lang === "fr" ? item.title_fr : item.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "ar" ? item.desc_ar : lang === "fr" ? item.desc_fr : item.desc_en}
                  </p>
                </motion.div>
              );
            })}
          </div>
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
                : lang === "fr" ? "Maisy Academy est officiellement agréée pour dispenser des formations certifiées"
                : "Maisy Academy is officially accredited to deliver certified training programs"}
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">{t("about.team")}</h2>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
            {team.map((m, i) => {
              const role = lang === "ar" ? m.role_ar : lang === "fr" ? m.role_fr : m.role_en;
              return (
                <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="rounded-xl border bg-card p-6 text-center">
                  <img src={m.avatar} alt={m.name} className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-primary/20 object-cover" />
                  <h3 className="font-display font-semibold text-foreground">{m.name}</h3>
                  <span className="text-xs font-medium text-primary">{role}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
            {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم" : lang === "fr" ? "Commencez votre parcours aujourd'hui" : "Start Your Learning Journey Today"}
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            {lang === "ar" ? "انضم إلى أكثر من 500 طالب في أكاديمية مايسي" : lang === "fr" ? "Rejoignez plus de 500 étudiants à Maisy Academy" : "Join 500+ students at Maisy Academy"}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" variant="secondary" className="gap-2">
                {lang === "ar" ? "تصفح الدورات" : lang === "fr" ? "Parcourir les cours" : "Browse Courses"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                {lang === "ar" ? "سجّل مجاناً" : lang === "fr" ? "Inscrivez-vous" : "Register Free"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
