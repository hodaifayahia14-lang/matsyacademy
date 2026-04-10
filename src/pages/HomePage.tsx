import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, Shield, Star, Search,
  GraduationCap, Clock, Headphones, BadgeCheck, Briefcase,
  Globe, BarChart3, Lightbulb,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories } from "@/hooks/useCourses";
import heroBg from "@/assets/hero-bg.jpg";
import instructorImg from "@/assets/instructor-cta.jpg";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return count;
}

const partnerLogos = ["UZBH", "BROVORA", "Camelot Ingeniería", "Basba Creative", "المصنع الذكية"];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [activeCat, setActiveCat] = useState("All");
  const { courses: dbCourses, loading: coursesLoading } = useCourses();
  const dbCategories = useCategories();

  const whyChooseUs = [
    { icon: BadgeCheck, titleKey: "whyChoose.certified", descKey: "whyChoose.certifiedDesc" },
    { icon: Clock, titleKey: "whyChoose.flexible", descKey: "whyChoose.flexibleDesc" },
    { icon: GraduationCap, titleKey: "whyChoose.certificate", descKey: "whyChoose.certificateDesc" },
    { icon: Headphones, titleKey: "whyChoose.support", descKey: "whyChoose.supportDesc" },
    { icon: BookOpen, titleKey: "whyChoose.quality", descKey: "whyChoose.qualityDesc" },
    { icon: Shield, titleKey: "whyChoose.accredited", descKey: "whyChoose.accreditedDesc" },
    { icon: Briefcase, titleKey: "whyChoose.practical", descKey: "whyChoose.practicalDesc" },
    { icon: Globe, titleKey: "whyChoose.multilingual", descKey: "whyChoose.multilingualDesc" },
  ];

  const filteredCourses = activeCat === "All" ? dbCourses : dbCourses.filter((c) => c.category_name === activeCat);

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        className="relative min-h-[420px] md:min-h-[480px] flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,60%,22%)]/60 to-[hsl(270,52%,34%)]/40" />

        {/* Decorative dots */}
        <div className="absolute top-8 end-[12%] opacity-40 hidden md:block">
          <div className="grid grid-cols-4 gap-1.5">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-accent" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-10 start-[8%] opacity-20 hidden md:block">
          <div className="h-16 w-16 rotate-45 border-2 border-accent/60 rounded" />
        </div>

        <div className="container relative z-10 py-16 lg:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-3 text-accent font-semibold text-base md:text-lg">
              {lang === "ar" ? "أكاديمية مايسي" : "Maisy Academy"}
            </p>
            <h1 className="mb-8 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight text-white">
              {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم"
                : lang === "fr" ? "Commencez Votre Parcours Éducatif Aujourd'hui"
                : "Start Your Learning Journey Today"}
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mx-auto max-w-lg mb-8">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-xl">
              <input type="text"
                placeholder={lang === "ar" ? "ابحث عن دورة..." : lang === "fr" ? "Rechercher un cours..." : "Search for a course..."}
                className="flex-1 px-6 py-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none bg-transparent" />
              <button className="flex items-center justify-center px-4 text-muted-foreground hover:text-primary">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/courses">
              <Button size="lg" className="gradient-gold text-accent-foreground font-bold text-sm px-6 py-5 rounded-lg shadow-lg hover:opacity-90">
                {lang === "ar" ? "استكشف الدورات" : lang === "fr" ? "Découvrir les Cours" : "Explore Courses"}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-sm px-6 py-5 rounded-lg">
                {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenir Formateur" : "Become Instructor"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED COURSES ═══════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="mb-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {lang === "ar" ? "الدورات الأكثر شعبية" : lang === "fr" ? "Les Cours les Plus Populaires" : "Most Popular Courses"}
              </h2>
              <div className="h-1 w-16 rounded-full bg-accent" />
            </div>
            <Link to="/courses" className="shrink-0">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                {lang === "ar" ? "المزيد" : lang === "fr" ? "Voir tout" : "View All"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Course grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 6).map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PARTNERS ═══════════════════ */}
      <section className="py-10 border-y border-border">
        <div className="container">
          <h3 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
            {lang === "ar" ? "شركاؤنا" : lang === "fr" ? "Nos Partenaires" : "Our Partners"}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partnerLogos.map((p) => (
              <span key={p} className="text-base font-semibold text-muted-foreground/60 tracking-wide">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12 text-center">
            <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
              <span className="text-primary">{lang === "ar" ? "لماذا تختار أكاديمية مايسي؟" : lang === "fr" ? "Pourquoi Choisir Maisy Academy ?" : "Why Choose Maisy Academy?"}</span>
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group text-center p-5"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-foreground">{t(titleKey)}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BECOME INSTRUCTOR ═══════════════════ */}
      <section className="py-14 lg:py-20 bg-secondary/30">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img src={instructorImg} alt="Instructor" className="h-full w-full object-cover" loading="lazy" width={800} height={800} />
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenez Formateur" : "Become an Instructor"}
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? "هل ترغب بالانضمام إلى فريقنا؟ شارك خبرتك وساعد الآلاف من المتعلمين على التسجيل في مجالات الأكاديمية وما لنا في خلفتهم من تقديم المعرفة المتميزة والمحتوى المعمق."
                  : lang === "fr"
                  ? "Rejoignez notre équipe ! Partagez votre expertise et aidez des milliers d'apprenants à atteindre leurs objectifs professionnels."
                  : "Join our team! Share your expertise and help thousands of learners achieve their professional goals."}
              </p>
              <Link to="/register">
                <Button size="lg" className="gradient-purple text-white font-semibold px-8 hover:opacity-90 rounded-lg">
                  {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenir Formateur" : "Become Instructor"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BECOME PARTNER CTA ═══════════════════ */}
      <section className="py-14 gradient-purple">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl sm:text-3xl font-bold text-white">
            {lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenez Partenaire" : "Become a Partner"}
          </h2>
          <p className="mb-8 text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
            {lang === "ar"
              ? "كن شريكنا وساهم في المنصة والمحتوى وفي المشروع والمشروبات بين فعالية على التطبيق."
              : lang === "fr"
              ? "Devenez notre partenaire et contribuez à la plateforme éducative de premier plan."
              : "Partner with us and contribute to the leading educational platform."}
          </p>
          <Button size="lg" className="gradient-gold text-accent-foreground font-bold px-8 hover:opacity-90 rounded-lg">
            {lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenir Partenaire" : "Become Partner"}
          </Button>
        </div>
      </section>
    </div>
  );
}
