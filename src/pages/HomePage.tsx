import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowDown, Users, BookOpen, Award, Shield,
  Star, Mail, MessageCircle, CheckCircle, GraduationCap, Clock, Headphones
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";
import heroImage from "@/assets/hero-cinematic.jpg";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

/* Animated counter */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const } }),
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const wordFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";

  const stats = [
    { icon: Users, value: 500, suffix: "+", labelKey: "stats.students" },
    { icon: BookOpen, value: 3, suffix: "", labelKey: "stats.courses" },
    { icon: Shield, value: 2, suffix: "", labelKey: "stats.fields" },
    { icon: Award, value: 0, suffix: "✓", labelKey: "stats.accredited" },
  ];

  const marqueeItems = lang === "ar"
    ? ["⭐ تكوين معتمد", "⭐ دورات السلامة والصحة المهنية", "⭐ مرشد الحج والعمرة", "⭐ +500 طالب", "⭐ شهادات معتمدة", "⭐ تكوين عن بعد"]
    : lang === "fr"
    ? ["⭐ Formation Certifiée", "⭐ Cours HSE", "⭐ Guide Hajj & Omra", "⭐ +500 Étudiants", "⭐ Certificats Reconnus", "⭐ Formation en Ligne"]
    : ["⭐ Certified Training", "⭐ HSE Courses", "⭐ Hajj & Umrah Guide", "⭐ +500 Students", "⭐ Recognized Certificates", "⭐ Online Training"];

  const heroTitle = lang === "ar"
    ? "أكاديمية مايسي للتدريب والتطوير"
    : lang === "fr"
    ? "Matsy Academy — Formation Professionnelle"
    : "Matsy Academy — Professional Training";

  const heroSubtitle = lang === "ar"
    ? "منصة تعليمية معتمدة تقدم دورات في السلامة والصحة المهنية والإرشاد الديني"
    : lang === "fr"
    ? "Plateforme certifiée proposant des formations en sécurité HSE et guidance religieuse"
    : "Certified platform offering HSE safety and religious guidance courses";

  const whyChooseUs = [
    {
      icon: Award,
      title: lang === "ar" ? "تكوين معتمد وزارياً" : lang === "fr" ? "Formation Certifiée" : "Ministry-Certified Training",
      desc: lang === "ar" ? "جميع دوراتنا معتمدة من وزارة التكوين المهني" : lang === "fr" ? "Toutes nos formations sont agréées par le Ministère" : "All courses accredited by the Ministry of Vocational Training",
    },
    {
      icon: Clock,
      title: lang === "ar" ? "تعلّم عن بعد مرن" : lang === "fr" ? "Apprentissage Flexible" : "Flexible Online Learning",
      desc: lang === "ar" ? "تعلم في أي وقت ومن أي مكان بدروس مسجلة عالية الجودة" : lang === "fr" ? "Apprenez à votre rythme avec des cours enregistrés" : "Learn anytime, anywhere with high-quality recorded lessons",
    },
    {
      icon: GraduationCap,
      title: lang === "ar" ? "شهادة معترف بها" : lang === "fr" ? "Certificat Reconnu" : "Recognized Certificate",
      desc: lang === "ar" ? "احصل على شهادة معتمدة عند إتمام الدورة" : lang === "fr" ? "Obtenez un certificat reconnu à la fin de la formation" : "Earn a recognized certificate upon course completion",
    },
    {
      icon: Headphones,
      title: lang === "ar" ? "دعم مستمر" : lang === "fr" ? "Support Continu" : "Ongoing Support",
      desc: lang === "ar" ? "فريق دعم متاح لمساعدتك طوال رحلتك التعليمية" : lang === "fr" ? "Équipe de support disponible tout au long de votre parcours" : "Support team available throughout your learning journey",
    },
  ];

  const testimonials = [
    { name: "Karim Bouzid", role: lang === "ar" ? "متخصص في السلامة" : lang === "fr" ? "Spécialiste Sécurité" : "Safety Specialist", text: lang === "ar" ? "أكاديمية مايسي غيرت مساري المهني. الدورات عملية والمدربون من أعلى مستوى." : lang === "fr" ? "Matsy Academy a transformé ma carrière. Les cours sont pratiques et les formateurs excellents." : "Matsy Academy transformed my career. The courses are practical and the instructors are top-notch.", image: "https://randomuser.me/api/portraits/men/11.jpg", rating: 5 },
    { name: "Amina Belhadj", role: lang === "ar" ? "مفتشة أمن" : lang === "fr" ? "Inspectrice Sécurité" : "Safety Inspector", text: lang === "ar" ? "أكملت دورة التفتيش الأمني. المنصة سهلة الاستخدام والمحتوى دائماً محدث." : lang === "fr" ? "J'ai terminé la formation d'inspection. La plateforme est intuitive." : "I completed the safety inspection course. The platform is intuitive and always up to date.", image: "https://randomuser.me/api/portraits/women/21.jpg", rating: 5 },
    { name: "Youcef Hamdi", role: lang === "ar" ? "مرشد حج وعمرة" : lang === "fr" ? "Guide Hajj" : "Hajj Guide", text: lang === "ar" ? "دورة مرشد الحج والعمرة كانت شاملة ومفيدة جداً." : lang === "fr" ? "Le cours de guide du Hajj était complet. Très recommandé !" : "The Hajj guide course was incredibly comprehensive. Highly recommended!", image: "https://randomuser.me/api/portraits/men/45.jpg", rating: 5 },
    { name: "Fatima Zerhouni", role: lang === "ar" ? "مديرة الجودة" : lang === "fr" ? "Responsable Qualité" : "Quality Manager", text: lang === "ar" ? "منصة رائعة مع دورات منظمة بشكل جيد." : lang === "fr" ? "Excellente plateforme avec des cours bien structurés." : "Great platform with well-structured courses.", image: "https://randomuser.me/api/portraits/women/33.jpg", rating: 5 },
    { name: "Mohamed Saidi", role: lang === "ar" ? "مهندس سلامة" : lang === "fr" ? "Ingénieur Sécurité" : "Safety Engineer", text: lang === "ar" ? "الدكتور أحمد مايسي مدرب استثنائي." : lang === "fr" ? "Dr. Ahmed Matsy est un formateur exceptionnel." : "Dr. Ahmed Matsy is an exceptional instructor.", image: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5 },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="bg-background">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl animate-pulse-glow pointer-events-none" />

        <div className="container relative z-10 text-center py-20">
          {/* Logo reveal */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="font-display text-2xl font-bold text-gold">Matsy</span>
            <span className="font-display text-2xl font-bold text-foreground"> Academy</span>
          </motion.div>

          {/* Headline — staggered word reveal */}
          <motion.h1
            className="mt-8 font-display text-4xl font-bold leading-tight text-gold md:text-5xl lg:text-6xl"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {heroTitle.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordFade} className="inline-block mx-1">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/register">
              <Button size="lg" className="gap-2 border border-gold bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_hsl(var(--gold)/0.3)] hover:scale-105 transition-all duration-300">
                {lang === "ar" ? "سجّل الآن" : lang === "fr" ? "S'inscrire" : "Enroll Now"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="gap-2 border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold transition-all duration-300">
                {lang === "ar" ? "استعرض الدورات" : lang === "fr" ? "Parcourir les cours" : "Browse Courses"}
              </Button>
            </Link>
          </motion.div>

          {/* Student avatars strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {[32, 75, 44, 52].map((id, idx) => (
                <img key={id} src={`https://randomuser.me/api/portraits/${idx === 2 ? 'women' : 'men'}/${id}.jpg`} alt=""
                  className="h-10 w-10 rounded-full border-2 border-gold/50 object-cover" />
              ))}
            </div>
            <div className="text-start">
              <p className="text-sm font-semibold text-foreground">+500 {t("stats.students")}</p>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}
              </div>
            </div>
          </motion.div>

          {/* Scroll arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <ArrowDown className="mx-auto h-6 w-6 text-gold animate-bounce-gentle" />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y border-border bg-secondary py-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ icon: Icon, value, suffix, labelKey }, i) => (
              <motion.div key={labelKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="flex flex-col items-center gap-2 text-center md:border-e md:border-border md:last:border-e-0">
                <Icon className="h-8 w-8 text-gold" />
                <span className="font-display text-3xl font-bold text-foreground">
                  {value > 0 ? <AnimatedCounter value={value} suffix={suffix} /> : suffix}
                </span>
                <p className="text-sm text-muted-foreground">{t(labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCROLLING MARQUEE ===== */}
      <section className="bg-primary py-3 overflow-hidden">
        <div className="flex gap-12 animate-scroll-left" style={{ width: "fit-content" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-semibold text-primary-foreground">{item}</span>
          ))}
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      <section className="py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
              {t("featured.title")}
              <span className="block mx-auto mt-2 h-1 w-16 rounded-full bg-gold" />
            </h2>
            <p className="text-muted-foreground">{t("featured.subtitle")}</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((c, i) => (
              <motion.div key={c.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_hsl(var(--gold)/0.15)]">
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/courses">
              <Button variant="outline" className="gap-2 border-gold text-gold hover:bg-gold hover:text-gold-foreground">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
              {lang === "ar" ? "لماذا تختار أكاديمية مايسي؟" : lang === "fr" ? "Pourquoi choisir Matsy Academy ?" : "Why Choose Matsy Academy?"}
              <span className="block mx-auto mt-2 h-1 w-16 rounded-full bg-gold" />
            </h2>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                  <Icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-8 start-8 text-[120px] leading-none font-display text-gold/10 pointer-events-none select-none">"</div>
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
              {t("testimonials.title")}
              <span className="block mx-auto mt-2 h-1 w-16 rounded-full bg-gold" />
            </h2>
            <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
          </motion.div>

          {/* Slider */}
          <div className="mx-auto max-w-2xl">
            <div className="relative min-h-[200px]">
              {testimonials.map((tm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTestimonial === i ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 flex flex-col items-center text-center ${activeTestimonial === i ? "pointer-events-auto" : "pointer-events-none"}`}
                >
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(tm.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mb-6 text-lg text-foreground italic leading-relaxed">"{tm.text}"</p>
                  <img src={tm.image} alt={tm.name} className="h-14 w-14 rounded-full border-2 border-gold object-cover" />
                  <p className="mt-3 font-semibold text-gold">{tm.name}</p>
                  <p className="text-sm text-muted-foreground">{tm.role}</p>
                </motion.div>
              ))}
            </div>
            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${activeTestimonial === i ? "bg-gold w-6" : "bg-muted-foreground/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(var(--gold)) 20px, hsl(var(--gold)) 21px)" }} />
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم" : lang === "fr" ? "Commencez votre parcours éducatif aujourd'hui" : "Start Your Learning Journey Today"}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gold-light">
              {lang === "ar" ? "انضم إلى أكثر من 500 طالب وابدأ التعلم الآن" : lang === "fr" ? "Rejoignez plus de 500 étudiants et commencez à apprendre" : "Join 500+ students and start learning now"}
            </p>
            <Link to="/register" className="mt-8 inline-block">
              <Button size="lg" className="bg-gold text-gold-foreground font-bold hover:bg-gold-light hover:scale-105 transition-all animate-shimmer"
                style={{ backgroundImage: "linear-gradient(110deg, hsl(var(--gold)) 0%, hsl(var(--gold-light)) 45%, hsl(var(--gold)) 55%, hsl(var(--gold)) 100%)", backgroundSize: "200% auto" }}>
                {lang === "ar" ? "سجّل مجاناً" : lang === "fr" ? "Inscription Gratuite" : "Register Free"}
                <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <Mail className="mx-auto mb-4 h-10 w-10 text-gold" />
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">{t("newsletter.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder={t("newsletter.placeholder")}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold" />
              <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold-light">{t("newsletter.subscribe")}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
