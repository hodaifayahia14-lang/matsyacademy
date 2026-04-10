import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, Shield, Star, Search,
  GraduationCap, Clock, Headphones, BadgeCheck, Briefcase,
  Globe, Play, ChevronRight, Sparkles, TrendingUp, Zap,
  Mail, CheckCircle, Heart, Target, Lightbulb, Trophy,
  Calendar, MapPin, Phone, MessageCircle, Instagram, Facebook, Twitter,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories } from "@/hooks/useCourses";
import heroStudents from "@/assets/hero-students.jpg";
import instructorImg from "@/assets/instructor-woman.jpg";
import patternBg from "@/assets/pattern-bg.jpg";

function useCounter(target: number, startImmediately = false) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const startAnimation = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (startImmediately) {
      const timer = setTimeout(startAnimation, 500);
      return () => clearTimeout(timer);
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { startAnimation(); observer.disconnect(); }
    }, { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, startImmediately]);

  return { count, ref };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } }),
};

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { courses: dbCourses } = useCourses();
  const dbCategories = useCategories();

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.8]);

  const student = useCounter(5000, true);
  const course = useCounter(120, true);
  const instructor = useCounter(35, true);
  const cert = useCounter(2800, true);

  

  const stats = [
    { value: `${student.count.toLocaleString()}+`, label: lang === "ar" ? "طالب نشط" : lang === "fr" ? "Étudiants Actifs" : "Active Students", icon: Users, color: "from-[hsl(270,52%,34%)] to-[hsl(280,45%,50%)]", ref: student.ref },
    { value: `${course.count}+`, label: lang === "ar" ? "دورة تدريبية" : lang === "fr" ? "Cours Disponibles" : "Courses Available", icon: BookOpen, color: "from-[hsl(42,72%,45%)] to-[hsl(40,76%,55%)]", ref: course.ref },
    { value: `${instructor.count}+`, label: lang === "ar" ? "مدرب محترف" : lang === "fr" ? "Formateurs Experts" : "Expert Instructors", icon: GraduationCap, color: "from-[hsl(153,62%,30%)] to-[hsl(153,62%,40%)]", ref: instructor.ref },
    { value: `${cert.count.toLocaleString()}+`, label: lang === "ar" ? "شهادة ممنوحة" : lang === "fr" ? "Certificats Délivrés" : "Certificates Issued", icon: Award, color: "from-[hsl(350,70%,36%)] to-[hsl(350,70%,50%)]", ref: cert.ref },
  ];

  const whyChooseUs = [
    { icon: BadgeCheck, titleKey: "whyChoose.certified", descKey: "whyChoose.certifiedDesc", gradient: "from-[hsl(270,52%,34%)] to-[hsl(280,45%,50%)]" },
    { icon: Clock, titleKey: "whyChoose.flexible", descKey: "whyChoose.flexibleDesc", gradient: "from-[hsl(42,72%,45%)] to-[hsl(40,76%,55%)]" },
    { icon: GraduationCap, titleKey: "whyChoose.certificate", descKey: "whyChoose.certificateDesc", gradient: "from-[hsl(153,62%,30%)] to-[hsl(153,62%,45%)]" },
    { icon: Headphones, titleKey: "whyChoose.support", descKey: "whyChoose.supportDesc", gradient: "from-[hsl(210,70%,45%)] to-[hsl(210,70%,60%)]" },
    { icon: BookOpen, titleKey: "whyChoose.quality", descKey: "whyChoose.qualityDesc", gradient: "from-[hsl(350,70%,36%)] to-[hsl(350,70%,50%)]" },
    { icon: Shield, titleKey: "whyChoose.accredited", descKey: "whyChoose.accreditedDesc", gradient: "from-[hsl(270,60%,22%)] to-[hsl(270,52%,34%)]" },
    { icon: Briefcase, titleKey: "whyChoose.practical", descKey: "whyChoose.practicalDesc", gradient: "from-[hsl(42,72%,45%)] to-[hsl(30,80%,50%)]" },
    { icon: Globe, titleKey: "whyChoose.multilingual", descKey: "whyChoose.multilingualDesc", gradient: "from-[hsl(180,50%,35%)] to-[hsl(180,50%,50%)]" },
  ];

  const testimonials = [
    {
      name: lang === "ar" ? "أحمد بن علي" : "Ahmed B.",
      role: lang === "ar" ? "مطور ويب" : "Web Developer",
      text: lang === "ar" ? "أفضل منصة تعليمية عربية، المحتوى ممتاز والدعم رائع!" : "Best Arab learning platform, excellent content and amazing support!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      course: lang === "ar" ? "تطوير الويب" : "Web Development"
    },
    {
      name: lang === "ar" ? "فاطمة الزهراء" : "Fatima Z.",
      role: lang === "ar" ? "مصممة جرافيك" : "Graphic Designer",
      text: lang === "ar" ? "حصلت على شهادة معتمدة وتحسنت مهاراتي بشكل كبير." : "Got a certified diploma and my skills improved significantly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      course: lang === "ar" ? "التصميم الجرافيكي" : "Graphic Design"
    },
    {
      name: lang === "ar" ? "محمد كريم" : "Mohamed K.",
      role: lang === "ar" ? "طالب جامعي" : "University Student",
      text: lang === "ar" ? "الدورات عملية ومفيدة جداً، أنصح بها الجميع!" : "The courses are practical and very useful, I recommend them to everyone!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      course: lang === "ar" ? "برمجة Python" : "Python Programming"
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background with layered gradient */}
        <div className="absolute inset-0">
          <img src={heroStudents} alt="" className="h-full w-full object-cover scale-105" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,60%,8%)]/95 via-[hsl(270,52%,16%)]/88 to-[hsl(280,45%,28%)]/70" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-[120px] -top-40 -end-40"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute w-[400px] h-[400px] rounded-full bg-primary/[0.08] blur-[100px] bottom-0 -start-20"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          {/* Small sparkling dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full bg-white/30"
              style={{ width: 2 + (i % 3), height: 2 + (i % 3), top: `${8 + i * 7}%`, left: `${5 + i * 8}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container relative z-10 py-20 lg:py-0">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
            {/* Left content */}
            <div className="max-w-2xl">
              {/* Academy badge */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] px-5 py-2 text-sm font-medium mb-8">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
                    <Sparkles className="h-3 w-3 text-accent" />
                  </span>
                  <span className="text-white/80">{lang === "ar" ? "أكاديمية مايسي — منصة التعلم #1" : "Maisy Academy — #1 Learning Platform"}</span>
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-6 font-display text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.08] tracking-tight text-white">
                {lang === "ar" ? (
                  <>ابدأ{" "}
                    <span className="relative inline-block">
                      <span className="text-gradient-gold">رحلتك التعليمية</span>
                      <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }}>
                        <motion.path d="M2 6C50 2 150 2 198 6" stroke="hsl(42,72%,45%)" strokeWidth="3" strokeLinecap="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }} />
                      </motion.svg>
                    </span>
                    <br />اليوم مع أفضل المدربين
                  </>
                ) : lang === "fr" ? (
                  <>Commencez Votre{" "}
                    <span className="relative inline-block">
                      <span className="text-gradient-gold">Parcours Éducatif</span>
                      <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                        <motion.path d="M2 6C50 2 150 2 198 6" stroke="hsl(42,72%,45%)" strokeWidth="3" strokeLinecap="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }} />
                      </motion.svg>
                    </span>
                    <br />Aujourd'hui
                  </>
                ) : (
                  <>Start Your{" "}
                    <span className="relative inline-block">
                      <span className="text-gradient-gold">Learning Journey</span>
                      <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                        <motion.path d="M2 6C50 2 150 2 198 6" stroke="hsl(42,72%,45%)" strokeWidth="3" strokeLinecap="round"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1 }} />
                      </motion.svg>
                    </span>
                    <br />Today with the Best
                  </>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="mb-10 text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
                {lang === "ar"
                  ? "اكتشف مئات الدورات التدريبية المعتمدة في البرمجة والتصميم والأعمال. تعلّم من خبراء واحصل على شهادات معترف بها."
                  : lang === "fr"
                  ? "Découvrez des centaines de cours certifiés en développement, design et business. Apprenez des experts et obtenez des certificats reconnus."
                  : "Discover hundreds of certified courses in development, design and business. Learn from experts and earn recognized certificates."}
              </motion.p>

              {/* Search bar — elevated */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mb-8 max-w-lg">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 to-primary/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl overflow-hidden transition-all focus-within:bg-white/[0.1] focus-within:border-white/25">
                    <Search className="h-5 w-5 text-white/30 ms-5 shrink-0" />
                    <input type="text"
                      placeholder={lang === "ar" ? "ابحث عن دورة، مهارة، أو موضوع..." : lang === "fr" ? "Rechercher un cours, une compétence..." : "Search courses, skills, topics..."}
                      className="flex-1 px-4 py-4 text-white placeholder:text-white/30 text-sm focus:outline-none bg-transparent" />
                    <Button size="sm" className="gradient-gold text-accent-foreground font-semibold rounded-xl me-1.5 my-1.5 px-5 hover:opacity-90">
                      {lang === "ar" ? "بحث" : lang === "fr" ? "Chercher" : "Search"}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="flex flex-wrap items-center gap-4 mb-10">
                <Link to="/courses">
                  <Button size="lg" className="gradient-gold text-accent-foreground font-bold text-sm px-8 py-6 rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300">
                    {lang === "ar" ? "استكشف الدورات" : lang === "fr" ? "Découvrir les Cours" : "Explore Courses"}
                    <ArrowRight className="h-4 w-4 ms-2" />
                  </Button>
                </Link>
                <button className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm group-hover:border-accent/50 group-hover:bg-accent/10 transition-all duration-300">
                    <Play className="h-5 w-5 ms-0.5" />
                  </span>
                  <span className="text-sm font-semibold">{lang === "ar" ? "شاهد الفيديو التعريفي" : lang === "fr" ? "Voir la Vidéo" : "Watch Intro Video"}</span>
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-wrap items-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent/70" />
                  {lang === "ar" ? "شهادات معتمدة" : "Certified Courses"}
                </span>
                <span className="h-4 w-px bg-white/10" />
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent/70" />
                  {lang === "ar" ? "+5000 طالب" : "5,000+ Students"}
                </span>
                <span className="h-4 w-px bg-white/10" />
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent/70 fill-accent/70" />
                  {lang === "ar" ? "تقييم 4.9/5" : "4.9/5 Rating"}
                </span>
              </motion.div>
            </div>

            {/* Right: Modern stats dashboard card */}
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }} className="hidden lg:block w-[380px]">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/15 to-primary/15 rounded-[2rem] blur-2xl" />

                <div className="relative bg-white/[0.06] backdrop-blur-2xl rounded-3xl border border-white/[0.1] p-7 shadow-2xl shadow-black/20">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                        {lang === "ar" ? "إحصائيات مباشرة" : "Live Statistics"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2.5 py-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-[10px] font-semibold text-success">+12%</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ value, label, icon: Icon, color, ref }, i) => (
                      <motion.div key={i} ref={ref}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="group relative p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 cursor-default"
                      >
                        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
                        <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini chart decoration */}
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-white/40">{lang === "ar" ? "نمو شهري" : "Monthly Growth"}</span>
                      <span className="text-[11px] font-semibold text-accent">+24%</span>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      {[35, 50, 40, 65, 55, 75, 60, 80, 70, 90, 85, 95].map((h, i) => (
                        <motion.div key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-accent/40 to-accent/80"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1 + i * 0.06, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60V30C240 5 480 0 720 10C960 20 1200 45 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR (mobile) ═══════════════════ */}
      <section className="lg:hidden py-8 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label, icon: Icon, color }, i) => (
              <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }} className="text-center p-4 rounded-xl border border-border bg-secondary/30">
                <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mb-2">
              <Sparkles className="h-4 w-4" />
              {lang === "ar" ? "مجالات التعلم" : lang === "fr" ? "Domaines" : "Learning Fields"}
            </span>
            <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
              <span className="text-gradient-purple">{lang === "ar" ? "استكشف التصنيفات" : lang === "fr" ? "Explorer les Catégories" : "Explore Categories"}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {lang === "ar" ? "اختر المجال الذي يناسبك وابدأ التعلم" : lang === "fr" ? "Choisissez votre domaine et commencez" : "Choose your field and start learning"}
            </p>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
          </motion.div>

          {dbCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dbCategories.slice(0, 8).map((cat, i) => {
                const name = cat[`name_${lang}` as keyof typeof cat] || cat.name;
                const gradients = [
                  "from-purple-500/10 to-purple-600/5",
                  "from-amber-500/10 to-amber-600/5",
                  "from-emerald-500/10 to-emerald-600/5",
                  "from-blue-500/10 to-blue-600/5",
                  "from-rose-500/10 to-rose-600/5",
                  "from-teal-500/10 to-teal-600/5",
                  "from-indigo-500/10 to-indigo-600/5",
                  "from-orange-500/10 to-orange-600/5",
                ];
                const iconBgs = [
                  "bg-purple-100 dark:bg-purple-900/30",
                  "bg-amber-100 dark:bg-amber-900/30",
                  "bg-emerald-100 dark:bg-emerald-900/30",
                  "bg-blue-100 dark:bg-blue-900/30",
                  "bg-rose-100 dark:bg-rose-900/30",
                  "bg-teal-100 dark:bg-teal-900/30",
                  "bg-indigo-100 dark:bg-indigo-900/30",
                  "bg-orange-100 dark:bg-orange-900/30",
                ];
                return (
                  <motion.div key={cat.id} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                    viewport={{ once: true }}>
                    <Link to={`/courses?category=${cat.slug}`}
                      className={`group relative flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br ${gradients[i % gradients.length]} p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden`}
                    >
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBgs[i % iconBgs.length]} text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {cat.icon || "📚"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lang === "ar" ? "اكتشف الدورات" : lang === "fr" ? "Découvrir les cours" : "Discover courses"}
                        </p>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />

                      <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="h-3 w-3 text-accent animate-pulse" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {lang === "ar" ? "لا توجد تصنيفات حالياً" : "No categories available yet"}
            </p>
          )}
        </div>
      </section>

      {/* Wave separator */}
      <div className="relative -mb-px">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 6 1440 24V48H0Z" className="fill-secondary/30" />
        </svg>
      </div>

      {/* ═══════════════════ FEATURED COURSES ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mb-2">
                <TrendingUp className="h-4 w-4" />
                {lang === "ar" ? "الأكثر رواجاً" : "Trending"}
              </span>
              <h2 className="mb-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
                {lang === "ar" ? "الدورات الأكثر شعبية" : lang === "fr" ? "Les Cours les Plus Populaires" : "Most Popular Courses"}
              </h2>
              <div className="h-1 w-20 rounded-full bg-accent" />
            </motion.div>
            <Link to="/courses" className="shrink-0">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 font-semibold">
                {lang === "ar" ? "عرض الكل" : lang === "fr" ? "Voir tout" : "View All"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dbCourses.slice(0, 6).map((c, i) => (
              <motion.div key={c.id} variants={fadeUp} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>

          {dbCourses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">{lang === "ar" ? "لا توجد دورات حالياً" : "No courses available yet"}</p>
            </div>
          )}
        </div>
      </section>

      {/* Wave separator */}
      <div className="relative -mb-px">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0 0V24C480 48 960 0 1440 24V0H0Z" className="fill-secondary/30" />
        </svg>
      </div>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="mb-14 text-center">
            <span className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mb-2">
              <Zap className="h-4 w-4" />
              {lang === "ar" ? "مميزاتنا" : "Our Features"}
            </span>
            <h2 className="mb-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-purple">
                {lang === "ar" ? "لماذا تختار أكاديمية مايسي؟" : lang === "fr" ? "Pourquoi Choisir Maisy Academy ?" : "Why Choose Maisy Academy?"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              {lang === "ar" ? "نقدم لك تجربة تعليمية متكاملة ومميزة" : "We provide a complete and exceptional learning experience"}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ icon: Icon, titleKey, descKey, gradient }, i) => (
              <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}
                className="group relative text-center p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-2 font-display text-base font-bold text-foreground">{t(titleKey)}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="mb-12 text-center">
            <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
              <span className="text-gradient-purple">{lang === "ar" ? "آراء طلابنا" : lang === "fr" ? "Avis de Nos Étudiants" : "What Our Students Say"}</span>
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 cursor-pointer"
              >
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>

                {/* Course badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    <BookOpen className="h-3 w-3" />
                    {t.course}
                  </span>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="relative">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <Heart className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BECOME INSTRUCTOR ═══════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
              className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <img src={instructorImg} alt="Instructor" className="h-full w-full object-cover aspect-square" loading="lazy" width={800} height={800} />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -end-4 h-32 w-32 rounded-2xl bg-accent/10 -z-10" />
              <div className="absolute -top-4 -start-4 h-24 w-24 rounded-2xl bg-primary/10 -z-10" />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mb-4">
                <GraduationCap className="h-4 w-4" />
                {lang === "ar" ? "انضم إلينا" : "Join Us"}
              </span>
              <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {lang === "ar" ? (
                  <>كن <span className="text-gradient-gold">مدرباً</span> في أكاديمية مايسي</>
                ) : lang === "fr" ? (
                  <>Devenez <span className="text-gradient-gold">Formateur</span> chez Maisy Academy</>
                ) : (
                  <>Become an <span className="text-gradient-gold">Instructor</span> at Maisy Academy</>
                )}
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                {lang === "ar"
                  ? "شارك خبرتك مع آلاف الطلاب حول العالم العربي. نوفر لك الأدوات والدعم اللازم لإنشاء دورات احترافية وتحقيق دخل مستدام."
                  : lang === "fr"
                  ? "Partagez votre expertise avec des milliers d'étudiants. Nous vous fournissons les outils et le soutien nécessaires pour créer des cours professionnels."
                  : "Share your expertise with thousands of students. We provide you with the tools and support needed to create professional courses and earn sustainable income."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {[
                  lang === "ar" ? "دخل مستدام" : "Sustainable Income",
                  lang === "ar" ? "أدوات احترافية" : "Professional Tools",
                  lang === "ar" ? "دعم متواصل" : "Continuous Support",
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-sm text-foreground">
                    <BadgeCheck className="h-4 w-4 text-success" /> {item}
                  </span>
                ))}
              </div>
              <Link to="/register">
                <Button size="lg" className="gradient-purple text-white font-semibold px-10 py-6 hover:opacity-90 rounded-xl shadow-lg shadow-primary/20">
                  {lang === "ar" ? "كن مدرباً الآن" : lang === "fr" ? "Devenir Formateur" : "Become Instructor Now"}
                  <ArrowRight className="h-4 w-4 ms-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ NEWSLETTER SIGNUP ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-purple-deep/5 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-32 right-20 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-deep/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-accent text-sm font-semibold mb-6">
              <Mail className="h-4 w-4" />
              {lang === "ar" ? "ابق على اطلاع" : "Stay Updated"}
            </div>

            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-purple">
                {lang === "ar" ? "اشترك في نشرتنا الإخبارية" : lang === "fr" ? "Abonnez-vous à Notre Newsletter" : "Subscribe to Our Newsletter"}
              </span>
            </h2>

            <p className="mb-8 text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
              {lang === "ar"
                ? "احصل على آخر التحديثات حول الدورات الجديدة، النصائح التعليمية، والعروض الحصرية مباشرة في بريدك الإلكتروني."
                : lang === "fr"
                ? "Recevez les dernières mises à jour sur les nouveaux cours, conseils pédagogiques et offres exclusives directement dans votre boîte mail."
                : "Get the latest updates on new courses, learning tips, and exclusive offers delivered straight to your inbox."}
            </p>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="max-w-md mx-auto mb-6">
              <div className="flex items-center bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg transition-all focus-within:shadow-xl focus-within:border-accent/40">
                <div className="flex-1 flex items-center px-4 py-3">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                  <input type="email"
                    placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني" : lang === "fr" ? "Entrez votre email" : "Enter your email"}
                    className="flex-1 text-sm focus:outline-none bg-transparent placeholder:text-muted-foreground/60" />
                </div>
                <Button className="gradient-purple text-white font-semibold px-6 py-3 rounded-xl m-1 hover:opacity-90 transition-all">
                  {lang === "ar" ? "اشتراك" : lang === "fr" ? "S'abonner" : "Subscribe"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success" />
                {lang === "ar" ? "محتوى مجاني" : "Free Content"}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success" />
                {lang === "ar" ? "إلغاء في أي وقت" : "Cancel Anytime"}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success" />
                {lang === "ar" ? "لا سبام" : "No Spam"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER PREVIEW ═══════════════════ */}
      <section className="py-12 bg-secondary/30 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
              className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
                M
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Maisy Academy</h3>
                <p className="text-sm text-muted-foreground">{lang === "ar" ? "منصة التعليم العربية الأولى" : "Leading Arab Learning Platform"}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
              className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground">
                {lang === "ar" ? "تابعنا على" : "Follow us on"}:
              </span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-600" },
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-600" },
                  { icon: MessageCircle, href: "#", color: "hover:text-green-600" },
                ].map(({ icon: Icon, href, color }, i) => (
                  <motion.a key={i} href={href}
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-white ${color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true }}
              className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {lang === "ar" ? "الجزائر" : "Algeria"}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                +213 XX XX XX XX
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                contact@matsyacademy.com
              </span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
