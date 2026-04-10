import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, Shield, Star, Mail,
  CheckCircle, Sparkles, Search,
  GraduationCap, Clock, Headphones, BadgeCheck, Book,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories } from "@/hooks/useCourses";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns";

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

function StatCounter({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const count = useCounter(numericValue, inView);
  const prefix = value.startsWith('+') ? '+' : '';
  const isCheck = value === '✓';

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="font-display text-3xl font-bold text-primary">
        {isCheck ? '✓' : `${prefix}${count}`}
      </span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [activeCat, setActiveCat] = useState("All");
  const { courses: dbCourses, loading: coursesLoading } = useCourses();
  const dbCategories = useCategories();

  const stats = [
    { icon: Users, value: "+500", labelKey: "stats.students" },
    { icon: BookOpen, value: "12", labelKey: "stats.courses" },
    { icon: Shield, value: "4", labelKey: "stats.fields" },
    { icon: Award, value: "✓", labelKey: "stats.accredited" },
  ];

  const testimonials: Testimonial[] = [
    { name: "Karim Bouzid", role: lang === "ar" ? "متخصص في السلامة" : lang === "fr" ? "Spécialiste Sécurité" : "Safety Specialist", text: lang === "ar" ? "أكاديمية مايسي غيرت مساري المهني." : lang === "fr" ? "Maisy Academy a transformé ma carrière." : "Maisy Academy transformed my career.", image: "https://randomuser.me/api/portraits/men/11.jpg", rating: 5 },
    { name: "Amina Belhadj", role: lang === "ar" ? "مفتشة أمن" : lang === "fr" ? "Inspectrice Sécurité" : "Safety Inspector", text: lang === "ar" ? "المنصة سهلة الاستخدام والمحتوى محدث." : lang === "fr" ? "La plateforme est intuitive et le contenu à jour." : "The platform is intuitive and content up to date.", image: "https://randomuser.me/api/portraits/women/21.jpg", rating: 5 },
    { name: "Youcef Hamdi", role: lang === "ar" ? "مرشد حج وعمرة" : lang === "fr" ? "Guide Hajj" : "Hajj Guide", text: lang === "ar" ? "دورة شاملة ومفيدة جداً." : lang === "fr" ? "Un cours complet et très utile." : "A comprehensive and very useful course.", image: "https://randomuser.me/api/portraits/men/45.jpg", rating: 5 },
    { name: "Fatima Zerhouni", role: lang === "ar" ? "مديرة الجودة" : lang === "fr" ? "Responsable Qualité" : "Quality Manager", text: lang === "ar" ? "منصة رائعة مع دورات منظمة." : lang === "fr" ? "Excellente plateforme avec des cours structurés." : "Great platform with well-structured courses.", image: "https://randomuser.me/api/portraits/women/33.jpg", rating: 5 },
    { name: "Mohamed Saidi", role: lang === "ar" ? "مهندس سلامة" : lang === "fr" ? "Ingénieur Sécurité" : "Safety Engineer", text: lang === "ar" ? "مدرب استثنائي ودورة ممتازة." : lang === "fr" ? "Formateur exceptionnel et cours excellent." : "Exceptional instructor and excellent course.", image: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5 },
    { name: "Nadia Boudiaf", role: lang === "ar" ? "طالبة" : lang === "fr" ? "Étudiante" : "Student", text: lang === "ar" ? "المحتوى ممتاز والشهادة معتمدة." : lang === "fr" ? "Contenu excellent et certificat reconnu." : "Excellent content and recognized certificate.", image: "https://randomuser.me/api/portraits/women/56.jpg", rating: 5 },
    { name: "Hassan Mebarki", role: lang === "ar" ? "مشرف أمن" : lang === "fr" ? "Superviseur Sécurité" : "Safety Supervisor", text: lang === "ar" ? "أفضل منصة تعليمية عربية." : lang === "fr" ? "La meilleure plateforme éducative arabe." : "The best Arabic educational platform.", image: "https://randomuser.me/api/portraits/men/67.jpg", rating: 5 },
    { name: "Salima Kaddour", role: lang === "ar" ? "مرشدة دينية" : lang === "fr" ? "Guide Religieuse" : "Religious Guide", text: lang === "ar" ? "ساعدتني في تطوير مهاراتي المهنية." : lang === "fr" ? "M'a aidé à développer mes compétences." : "Helped me develop my skills.", image: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5 },
    { name: "Rachid Benmoussa", role: lang === "ar" ? "عون أمن" : lang === "fr" ? "Agent de Sécurité" : "Safety Agent", text: lang === "ar" ? "حصلت على شهادتي بفضل هذه الأكاديمية." : lang === "fr" ? "J'ai obtenu mon certificat grâce à cette académie." : "I earned my certificate thanks to this academy.", image: "https://randomuser.me/api/portraits/men/36.jpg", rating: 5 },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const whyChooseUs = [
    { icon: BadgeCheck, titleKey: "whyChoose.certified", descKey: "whyChoose.certifiedDesc" },
    { icon: Clock, titleKey: "whyChoose.flexible", descKey: "whyChoose.flexibleDesc" },
    { icon: GraduationCap, titleKey: "whyChoose.certificate", descKey: "whyChoose.certificateDesc" },
    { icon: Headphones, titleKey: "whyChoose.support", descKey: "whyChoose.supportDesc" },
    { icon: BookOpen, titleKey: "whyChoose.quality", descKey: "whyChoose.qualityDesc" },
    { icon: Shield, titleKey: "whyChoose.accredited", descKey: "whyChoose.accreditedDesc" },
  ];

  const filteredCourses = activeCat === "All" ? dbCourses : dbCourses.filter((c) => c.category_name === activeCat);

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════ HERO — Purple-Gold Gradient ═══════════════════ */}
      <section className="relative min-h-[70vh] flex items-center gradient-purple-gold overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute top-8 end-[15%] opacity-30">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-accent" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-12 start-[10%] opacity-20">
          <div className="h-20 w-20 rotate-45 border-2 border-accent rounded-lg" />
        </div>

        <div className="container relative z-10 py-16 lg:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-accent font-semibold text-lg">
              {lang === "ar" ? "أكاديمية مايسي" : lang === "fr" ? "Maisy Academy" : "Maisy Academy"}
            </p>
            <h1 className="mb-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم" 
                : lang === "fr" ? "Commencez Votre Parcours\nÉducatif Aujourd'hui" 
                : "Start Your Learning\nJourney Today"}
            </h1>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mx-auto max-w-xl mb-8">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-xl">
              <input type="text" placeholder={lang === "ar" ? "ابحث عن دورة..." : lang === "fr" ? "Rechercher un cours..." : "Search for a course..."}
                className="flex-1 px-6 py-3.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none" />
              <button className="flex items-center justify-center h-full px-5 text-muted-foreground hover:text-primary">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/courses">
              <Button size="lg" className="gradient-gold text-accent-foreground font-semibold text-base px-8 py-5 rounded-lg shadow-lg hover:opacity-90">
                {lang === "ar" ? "استكشف الدورات" : lang === "fr" ? "Découvrir les Cours" : "Explore Courses"}
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-base px-8 py-5 rounded-lg">
                {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenir Formateur" : "Become Instructor"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="py-12">
        <div className="container">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg -mt-16 relative z-20">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map(({ icon, value, labelKey }) => (
                <StatCounter key={labelKey} icon={icon} value={value} label={t(labelKey)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED COURSES ═══════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="mb-2 font-display text-2xl sm:text-3xl font-bold">
                <span className="text-foreground">{lang === "ar" ? "الدورات الأكثر" : lang === "fr" ? "Les Cours les Plus" : "Most"} </span>
                <span className="text-primary">{lang === "ar" ? "شعبية" : lang === "fr" ? "Populaires" : "Popular Courses"}</span>
              </h2>
              <div className="h-1 w-16 rounded-full bg-accent" />
            </div>
            <Link to="/courses" className="shrink-0">
              <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/5">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2 overflow-x-auto pb-2">
            {[{ name: "All", name_en: "All", name_fr: "Tous", name_ar: "الكل" }, ...dbCategories].map((cat: any) => {
              const catLabel = getLocalized(cat, "name", lang);
              return (
                <button key={cat.name} onClick={() => setActiveCat(cat.name)}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeCat === cat.name
                      ? "gradient-purple text-white shadow-md"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}>
                  {catLabel}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PARTNERS ═══════════════════ */}
      <section className="py-10 border-y border-border bg-secondary/30">
        <div className="container">
          <h3 className="mb-6 text-center font-display text-xl font-bold text-foreground">
            {lang === "ar" ? "شركاؤنا" : lang === "fr" ? "Nos Partenaires" : "Our Partners"}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {["UZBH", "BROVORA", "Camelot", "Basma Creative"].map((p) => (
              <span key={p} className="text-lg font-bold text-muted-foreground">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12 text-center">
            <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
              <span className="text-foreground">{lang === "ar" ? "لماذا تختار" : lang === "fr" ? "Pourquoi Choisir" : "Why Choose"} </span>
              <span className="text-primary">{lang === "ar" ? "أكاديمية مايسي؟" : lang === "fr" ? "Maisy Academy ?" : "Maisy Academy?"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BECOME INSTRUCTOR CTA ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop"
                alt="Instructor" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenez Formateur" : "Become an Instructor"}
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {lang === "ar" 
                  ? "هل ترغب بالانضمام إلى فريقنا؟ شارك خبرتك وساعد الآلاف من المتعلمين في تحقيق أهدافهم المهنية."
                  : lang === "fr"
                  ? "Rejoignez notre équipe ! Partagez votre expertise et aidez des milliers d'apprenants à atteindre leurs objectifs."
                  : "Join our team! Share your expertise and help thousands of learners achieve their professional goals."}
              </p>
              <Link to="/register">
                <Button size="lg" className="gradient-purple text-white font-semibold px-8 hover:opacity-90">
                  {lang === "ar" ? "كن مدرباً" : lang === "fr" ? "Devenir Formateur" : "Become Instructor"}
                  <ArrowRight className="ms-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BECOME PARTNER CTA ═══════════════════ */}
      <section className="py-16 gradient-purple">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl sm:text-3xl font-bold text-white">
            {lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenez Partenaire" : "Become a Partner"}
          </h2>
          <p className="mb-8 text-white/70 max-w-xl mx-auto">
            {lang === "ar" 
              ? "كن شريكنا وساهم في المنصة والمحتوى وفي المشروع والمشروبات بين فعالية على التطبيق."
              : lang === "fr"
              ? "Devenez notre partenaire et contribuez à la plateforme éducative."
              : "Partner with us and contribute to the educational platform."}
          </p>
          <Button size="lg" className="gradient-gold text-accent-foreground font-semibold px-8 hover:opacity-90">
            {lang === "ar" ? "كن شريكاً" : lang === "fr" ? "Devenir Partenaire" : "Become Partner"}
          </Button>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-10 text-center">
            <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
              <span className="text-foreground">{lang === "ar" ? "ماذا يقول" : lang === "fr" ? "Ce que disent" : "What Our"} </span>
              <span className="text-primary">{lang === "ar" ? "طلابنا" : lang === "fr" ? "nos Étudiants" : "Students Say"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <TestimonialsColumn testimonials={firstColumn} duration={18} />
            <TestimonialsColumn testimonials={secondColumn} duration={22} className="hidden md:block" />
            <TestimonialsColumn testimonials={thirdColumn} duration={16} className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-20 overflow-hidden gradient-purple">
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم" : lang === "fr" ? "Commencez Votre Parcours Aujourd'hui" : "Start Your Learning Journey Today"}
            </h2>
            <p className="mb-8 text-lg text-white/70 max-w-xl mx-auto">
              {lang === "ar" ? "سجّل مجاناً واحصل على وصول فوري لدوراتنا المعتمدة" : lang === "fr" ? "Inscrivez-vous et accédez à nos formations certifiées" : "Register and get access to our certified courses"}
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-gold text-accent-foreground font-semibold text-lg px-10 py-6 shadow-xl hover:opacity-90">
                {lang === "ar" ? "ابدأ التعلم" : lang === "fr" ? "Commencer" : "Start Learning"} <ArrowRight className="ms-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ NEWSLETTER ═══════════════════ */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground">{t("newsletter.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder={t("newsletter.placeholder")}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <Button type="submit" className="gradient-gold text-accent-foreground hover:opacity-90">{t("newsletter.subscribe")}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
