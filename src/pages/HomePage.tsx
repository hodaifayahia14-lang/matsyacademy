import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, Shield, Star, Search,
  GraduationCap, Clock, Headphones, BadgeCheck, Briefcase,
  Globe, Play, ChevronRight, Sparkles, TrendingUp, Zap,
  Mail, CheckCircle, Heart, Target, Lightbulb, Trophy,
  Calendar, MapPin, Phone, MessageCircle, Instagram, Facebook, Twitter,
  Rocket, Crown, Diamond, Flame, Eye, ThumbsUp, Quote,
  BarChart3, Award as AwardIcon, Users as UsersIcon,
  BookOpen as BookIcon, GraduationCap as GradIcon, Clock as ClockIcon,
  Headphones as SupportIcon, Shield as SecurityIcon, Globe as WorldIcon,
  Camera, Video, Mic, Monitor, Smartphone, Laptop, Tablet,
  CheckCircle2, XCircle, AlertCircle, Info, Download, Upload,
  Settings, User, Bell, Home, Search as SearchIcon, Filter,
  Grid, List, Calendar as CalendarIcon, MapPin as LocationIcon,
  Phone as PhoneIcon, Mail as MailIcon, MessageSquare, Share,
  Bookmark, Heart as HeartIcon, Star as StarIcon, Eye as EyeIcon,
  PlayCircle, PauseCircle, Volume2, VolumeX, SkipBack, SkipForward,
  RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize, Minimize,
  MoreHorizontal, MoreVertical, ChevronUp, ChevronDown, ChevronLeft,
  ArrowUp, ArrowDown, ArrowLeft, Move, Copy, Trash, Edit, Save,
  Plus, Minus, X, Check, Loader, Loader2, RefreshCw, RefreshCcw,
  HelpCircle,
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

  // Enhanced scroll effects
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.8]);
  const springHeroY = useSpring(heroY, { stiffness: 400, damping: 40 });

  // Interactive states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const student = useCounter(5000, true);
  const course = useCounter(120, true);
  const instructor = useCounter(35, true);
  const cert = useCounter(2800, true);
  const successRate = useCounter(95, true);
  const avgSalary = useCounter(45000, true);

  

  const stats = [
    { value: `${student.count.toLocaleString()}+`, label: lang === "ar" ? "طالب نشط" : lang === "fr" ? "Étudiants Actifs" : "Active Students", icon: Users, color: "from-[hsl(270,52%,34%)] to-[hsl(280,45%,50%)]", ref: student.ref },
    { value: `${course.count}+`, label: lang === "ar" ? "دورة تدريبية" : lang === "fr" ? "Cours Disponibles" : "Courses Available", icon: BookOpen, color: "from-[hsl(42,72%,45%)] to-[hsl(40,76%,55%)]", ref: course.ref },
    { value: `${instructor.count}+`, label: lang === "ar" ? "مدرب محترف" : lang === "fr" ? "Formateurs Experts" : "Expert Instructors", icon: GraduationCap, color: "from-[hsl(153,62%,30%)] to-[hsl(153,62%,40%)]", ref: instructor.ref },
    { value: `${cert.count.toLocaleString()}+`, label: lang === "ar" ? "شهادة ممنوحة" : lang === "fr" ? "Certificats Délivrés" : "Certificates Issued", icon: Award, color: "from-[hsl(350,70%,36%)] to-[hsl(350,70%,50%)]", ref: cert.ref },
  ];

  // Enhanced achievements data
  const achievements = [
    {
      value: `${successRate.count}%`,
      label: lang === "ar" ? "معدل النجاح" : "Success Rate",
      icon: Trophy,
      color: "from-green-500 to-emerald-600",
      description: lang === "ar" ? "طلابنا يحققون النجاح" : "Our students achieve success"
    },
    {
      value: `$${avgSalary.count.toLocaleString()}`,
      label: lang === "ar" ? "متوسط الراتب" : "Avg Salary Increase",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      description: lang === "ar" ? "زيادة في الراتب بعد التخرج" : "Salary increase after graduation"
    },
    {
      value: "24/7",
      label: lang === "ar" ? "دعم فني" : "Support",
      icon: Headphones,
      color: "from-purple-500 to-pink-600",
      description: lang === "ar" ? "دعم متواصل للطلاب" : "Continuous student support"
    },
    {
      value: "50+",
      label: lang === "ar" ? "شركاء" : "Partners",
      icon: Globe,
      color: "from-orange-500 to-red-600",
      description: lang === "ar" ? "شركات تتعاون معنا" : "Partner companies"
    }
  ];

  // Interactive features showcase
  const features = [
    {
      icon: Video,
      title: lang === "ar" ? "فيديوهات HD" : "HD Videos",
      description: lang === "ar" ? "محتوى فيديو عالي الجودة مع إمكانية التحميل" : "High-quality video content with download option",
      color: "from-blue-500 to-cyan-500",
      stats: "1080p Quality"
    },
    {
      icon: BookOpen,
      title: lang === "ar" ? "مواد شاملة" : "Comprehensive Materials",
      description: lang === "ar" ? "ملفات PDF، أمثلة عملية، ومشاريع تطبيقية" : "PDF files, practical examples, and hands-on projects",
      color: "from-green-500 to-emerald-500",
      stats: "500+ Resources"
    },
    {
      icon: Users,
      title: lang === "ar" ? "مجتمع الطلاب" : "Student Community",
      description: lang === "ar" ? "انضم إلى آلاف الطلاب في مجموعات الدراسة" : "Join thousands of students in study groups",
      color: "from-purple-500 to-pink-500",
      stats: "10K+ Members"
    },
    {
      icon: Award,
      title: lang === "ar" ? "شهادات معتمدة" : "Certified Diplomas",
      description: lang === "ar" ? "شهادات معترف بها دولياً في مجالك" : "Internationally recognized certificates in your field",
      color: "from-orange-500 to-red-500",
      stats: "ISO Certified"
    },
    {
      icon: Smartphone,
      title: lang === "ar" ? "تطبيق الموبايل" : "Mobile App",
      description: lang === "ar" ? "تعلم في أي مكان مع تطبيقنا المخصص" : "Learn anywhere with our dedicated mobile app",
      color: "from-indigo-500 to-purple-500",
      stats: "iOS & Android"
    },
    {
      icon: Clock,
      title: lang === "ar" ? "مرونة زمنية" : "Flexible Timing",
      description: lang === "ar" ? "تعلم بالسرعة التي تناسبك مع الوصول مدى الحياة" : "Learn at your own pace with lifetime access",
      color: "from-teal-500 to-cyan-500",
      stats: "Lifetime Access"
    }
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
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={heroStudents} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(270,60%,12%)]/90 via-[hsl(270,52%,20%)]/80 to-[hsl(270,52%,34%)]/60" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full bg-accent/20"
              style={{ width: 6 + i * 4, height: 6 + i * 4, top: `${15 + i * 14}%`, left: `${10 + i * 15}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container relative z-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent/30 px-4 py-1.5 text-accent text-sm font-semibold mb-6">
                  <Sparkles className="h-4 w-4" />
                  {lang === "ar" ? "أكاديمية مايسي" : "Maisy Academy"}
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
                className="mb-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.15] text-white">
                {lang === "ar" ? (
                  <>ابدأ <span className="text-gradient-gold relative">
                    رحلتك التعليمية
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 to-accent/30 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </span> اليوم مع أفضل المدربين</>
                ) : lang === "fr" ? (
                  <>Commencez Votre <span className="text-gradient-gold relative">
                    Parcours Éducatif
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 to-accent/30 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </span> Aujourd'hui</>
                ) : (
                  <>Start Your <span className="text-gradient-gold relative">
                    Learning Journey
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent/50 to-accent/30 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    />
                  </span> Today with the Best</>
                )}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 text-white/70 text-base md:text-lg leading-relaxed max-w-lg">
                {lang === "ar"
                  ? "اكتشف مئات الدورات التدريبية المعتمدة في البرمجة والتصميم والأعمال وأكثر. تعلّم من خبراء واحصل على شهادات معترف بها."
                  : lang === "fr"
                  ? "Découvrez des centaines de cours certifiés en développement, design et business. Apprenez des experts et obtenez des certificats reconnus."
                  : "Discover hundreds of certified courses in development, design and business. Learn from experts and earn recognized certificates."}
              </motion.p>

              {/* Search bar */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="mb-8 max-w-md">
                <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all focus-within:bg-white/15 focus-within:border-accent/40">
                  <input type="text"
                    placeholder={lang === "ar" ? "ابحث عن دورة..." : lang === "fr" ? "Rechercher un cours..." : "Search for a course..."}
                    className="flex-1 px-5 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none bg-transparent" />
                  <button className="flex items-center justify-center px-4 text-accent hover:text-accent/80 transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>

              {/* CTA buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4">
                <Link to="/courses">
                  <Button size="lg" className="gradient-gold text-accent-foreground font-bold text-sm px-8 py-6 rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 hover:shadow-accent/30 transition-all">
                    {lang === "ar" ? "استكشف الدورات" : lang === "fr" ? "Découvrir les Cours" : "Explore Courses"}
                    <ArrowRight className="h-4 w-4 ms-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary font-bold text-sm px-8 py-6 rounded-xl shadow-lg hover:bg-white/90 transition-all">
                    <Play className="h-4 w-4 me-2" />
                    {lang === "ar" ? "شاهد الفيديو" : lang === "fr" ? "Voir la Vidéo" : "Watch Video"}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: floating glass stats card */}
            <motion.div initial={{ opacity: 0, scale: 0.9, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }} className="hidden lg:block">
              <div className="glass-card rounded-3xl p-8 relative">
                <div className="absolute -top-4 -end-4 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
                <div className="absolute -bottom-6 -start-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {stats.map(({ value, label, icon: Icon, ref }, i) => (
                    <motion.div key={i} ref={ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.12 }}
                      className="text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
                      <p className="text-xs text-white/60">{label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACHIEVEMENTS SHOWCASE ═══════════════════ */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background patterns */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gold/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
          </div>
        </div>

        <div className="container relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-accent text-sm font-semibold mb-4">
              <Trophy className="h-4 w-4" />
              {lang === "ar" ? "إنجازاتنا" : "Our Achievements"}
            </div>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-purple">
                {lang === "ar" ? "أرقام تتحدث عن النجاح" : lang === "fr" ? "Des Chiffres Qui Parlent de Succès" : "Numbers That Speak Success"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {lang === "ar" ? "نحن فخورون بمساعدة آلاف الطلاب في تحقيق أهدافهم المهنية وتطوير مهاراتهم" : "We are proud to help thousands of students achieve their career goals and develop their skills"}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map(({ value, label, icon: Icon, color, description }, i) => (
              <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}
                className="group relative text-center p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

                {/* Icon with enhanced animation */}
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Value with counter animation */}
                <div className="mb-2">
                  <p className="text-3xl font-extrabold text-foreground mb-1">{value}</p>
                  <p className="text-sm font-semibold text-primary">{label}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={4} viewport={{ once: true }}
            className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-6">
              {lang === "ar" ? "انضم إلى مجتمع النجاح اليوم" : "Join our success community today"}
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-purple text-white font-semibold px-8 py-4 hover:opacity-90 rounded-xl shadow-lg shadow-primary/20">
                {lang === "ar" ? "ابدأ رحلتك الآن" : lang === "fr" ? "Commencer Maintenant" : "Start Your Journey Now"}
                <Rocket className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      {dbCategories.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
              className="mb-10 text-center">
              <h2 className="mb-3 font-display text-2xl sm:text-3xl font-bold">
                <span className="text-gradient-purple">{lang === "ar" ? "استكشف التصنيفات" : lang === "fr" ? "Explorer les Catégories" : "Explore Categories"}</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {lang === "ar" ? "اختر المجال الذي يناسبك وابدأ التعلم" : "Choose your field and start learning"}
              </p>
              <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {dbCategories.slice(0, 6).map((cat, i) => {
                const name = cat[`name_${lang}` as keyof typeof cat] || cat.name;
                return (
                  <motion.div key={cat.id} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                    viewport={{ once: true }}>
                    <Link to={`/courses?category=${cat.slug}`}
                      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden"
                    >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon with enhanced animation */}
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {cat.icon || "📚"}
                        <div className="absolute inset-0 rounded-2xl bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      </div>

                      {/* Title with underline animation */}
                      <span className="relative text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                        {name}
                        <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent group-hover:w-full group-hover:left-0 transition-all duration-300" />
                      </span>

                      {/* Subtle sparkle effect */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Sparkles className="h-3 w-3 text-accent animate-pulse" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ INTERACTIVE FEATURES SHOWCASE ═══════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary/20 via-background to-primary/5">
        <div className="container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-accent text-sm font-semibold mb-4">
              <Lightbulb className="h-4 w-4" />
              {lang === "ar" ? "مميزات تفاعلية" : "Interactive Features"}
            </div>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-purple">
                {lang === "ar" ? "تجربة تعليمية متطورة" : lang === "fr" ? "Une Expérience Éducative Avancée" : "Advanced Learning Experience"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {lang === "ar" ? "نقدم لك أدوات ومميزات تفاعلية تجعل التعلم ممتعاً وفعالاً أكثر من أي وقت مضى" : "We provide interactive tools and features that make learning more enjoyable and effective than ever"}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color, stats }, i) => (
              <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}
                className={`group relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 cursor-pointer ${
                  hoveredFeature === i ? 'ring-2 ring-primary/50' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />

                {/* Floating particles on hover */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(3)].map((_, j) => (
                    <motion.div
                      key={j}
                      className={`absolute w-2 h-2 bg-current rounded-full opacity-0 group-hover:opacity-60`}
                      style={{
                        top: `${20 + j * 30}%`,
                        left: `${10 + j * 30}%`,
                      }}
                      animate={hoveredFeature === i ? {
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.5, 1],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: hoveredFeature === i ? Infinity : 0,
                        delay: j * 0.2
                      }}
                    />
                  ))}
                </div>

                {/* Icon with enhanced animations */}
                <div className={`relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${color} shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className="h-10 w-10 text-white transition-transform group-hover:scale-110" />
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="mb-3 font-display text-lg font-bold text-foreground text-center group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center mb-4">
                    {description}
                  </p>

                  {/* Stats badge */}
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${color} text-white shadow-lg`}>
                      <BarChart3 className="h-3 w-3" />
                      {stats}
                    </span>
                  </div>
                </div>

                {/* Interactive border animation */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${color} p-[2px]`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredFeature === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-full w-full rounded-3xl bg-card/95" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Interactive demo section */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={6} viewport={{ once: true }}
            className="mt-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="mb-4 font-display text-xl font-bold text-foreground">
                {lang === "ar" ? "جرب التجربة التفاعلية" : "Try the Interactive Experience"}
              </h3>
              <p className="text-muted-foreground text-sm mb-8">
                {lang === "ar" ? "استكشف منصتنا التفاعلية وتعرف على كيفية عمل الدورات" : "Explore our interactive platform and see how our courses work"}
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer group">
                  <Monitor className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-2">
                    {lang === "ar" ? "منصة التعلم" : "Learning Platform"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? "واجهة سهلة الاستخدام" : "User-friendly interface"}
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer group">
                  <Video className="h-8 w-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-2">
                    {lang === "ar" ? "فيديوهات HD" : "HD Videos"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? "جودة عالية وواضحة" : "High quality and clear"}
                  </p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer group">
                  <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-2">
                    {lang === "ar" ? "دعم فوري" : "Instant Support"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? "مساعدة على مدار الساعة" : "24/7 assistance"}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 lg:py-24">
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

      {/* ═══════════════════ SUCCESS STORIES ═══════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-purple-deep/5 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gold/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '6s' }} />
        </div>

        <div className="container relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-accent text-sm font-semibold mb-4">
              <Target className="h-4 w-4" />
              {lang === "ar" ? "قصص النجاح" : "Success Stories"}
            </div>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-purple">
                {lang === "ar" ? "تحولات حقيقية" : lang === "fr" ? "Transformations Réelles" : "Real Transformations"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {lang === "ar" ? "شاهد كيف غيرت دوراتنا حياة آلاف الطلاب ومهنهم إلى الأفضل" : "See how our courses have transformed the lives and careers of thousands of students"}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Before/After Story 1 */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  {/* Before/After indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-medium text-red-600">
                        {lang === "ar" ? "قبل" : "Before"}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-600">
                        {lang === "ar" ? "بعد" : "After"}
                      </span>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  {/* Story content */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                      <p className="text-sm text-red-800 font-medium mb-2">
                        {lang === "ar" ? "بدون خبرة في البرمجة" : "No programming experience"}
                      </p>
                      <p className="text-xs text-red-600">
                        {lang === "ar" ? "راتب: 25,000 دج/شهر" : "Salary: $25,000/month"}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-primary rounded-full text-white text-sm font-medium">
                        <Rocket className="h-4 w-4" />
                        {lang === "ar" ? "6 أشهر مع مايسي" : "6 months with Maisy"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                      <p className="text-sm text-green-800 font-medium mb-2">
                        {lang === "ar" ? "مطور ويب محترف" : "Professional Web Developer"}
                      </p>
                      <p className="text-xs text-green-600">
                        {lang === "ar" ? "راتب: 85,000 دج/شهر" : "Salary: $85,000/month"}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">
                          {lang === "ar" ? "زيادة 240%" : "240% increase"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Success quote */}
                  <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Quote className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-foreground italic">
                      "{lang === "ar" ? "مايسي غيرت حياتي تماماً. الآن أعمل في شركة تقنية كبرى!" : "Maisy completely changed my life. Now I work at a major tech company!"}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      - {lang === "ar" ? "سارة، 28 عاماً" : "Sarah, 28 years old"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Before/After Story 2 */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  {/* Before/After indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-medium text-red-600">
                        {lang === "ar" ? "قبل" : "Before"}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-600">
                        {lang === "ar" ? "بعد" : "After"}
                      </span>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  {/* Story content */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                      <p className="text-sm text-red-800 font-medium mb-2">
                        {lang === "ar" ? "مصمم جرافيك مبتدئ" : "Beginner Graphic Designer"}
                      </p>
                      <p className="text-xs text-red-600">
                        {lang === "ar" ? "راتب: 20,000 دج/شهر" : "Salary: $20,000/month"}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-primary rounded-full text-white text-sm font-medium">
                        <Lightbulb className="h-4 w-4" />
                        {lang === "ar" ? "4 أشهر مع مايسي" : "4 months with Maisy"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                      <p className="text-sm text-green-800 font-medium mb-2">
                        {lang === "ar" ? "مصمم UI/UX خبير" : "Senior UI/UX Designer"}
                      </p>
                      <p className="text-xs text-green-600">
                        {lang === "ar" ? "راتب: 70,000 دج/شهر" : "Salary: $70,000/month"}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">
                          {lang === "ar" ? "زيادة 250%" : "250% increase"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Success quote */}
                  <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Quote className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-foreground italic">
                      "{lang === "ar" ? "الدورات عملية جداً وأعطتني المهارات المطلوبة في سوق العمل!" : "The courses are very practical and gave me the skills needed in the job market!"}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      - {lang === "ar" ? "أحمد، 25 عاماً" : "Ahmed, 25 years old"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Before/After Story 3 */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  {/* Before/After indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-medium text-red-600">
                        {lang === "ar" ? "قبل" : "Before"}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-green-600">
                        {lang === "ar" ? "بعد" : "After"}
                      </span>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  {/* Story content */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                      <p className="text-sm text-red-800 font-medium mb-2">
                        {lang === "ar" ? "طالب جامعي" : "University Student"}
                      </p>
                      <p className="text-xs text-red-600">
                        {lang === "ar" ? "بدون دخل" : "No income"}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-primary rounded-full text-white text-sm font-medium">
                        <Crown className="h-4 w-4" />
                        {lang === "ar" ? "8 أشهر مع مايسي" : "8 months with Maisy"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                      <p className="text-sm text-green-800 font-medium mb-2">
                        {lang === "ar" ? "مؤسس شركة تقنية" : "Tech Company Founder"}
                      </p>
                      <p className="text-xs text-green-600">
                        {lang === "ar" ? "دخل: 150,000 دج/شهر" : "Income: $150,000/month"}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">
                          {lang === "ar" ? "نجاح كامل" : "Complete success"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Success quote */}
                  <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <Quote className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-foreground italic">
                      "{lang === "ar" ? "بدأت من الصفر وأصبحت الآن مؤسسة شركة تقنية ناجحة!" : "I started from zero and now I'm the founder of a successful tech company!"}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      - {lang === "ar" ? "فاطمة، 22 عاماً" : "Fatima, 22 years old"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={3} viewport={{ once: true }}
            className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-primary rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-shadow">
              <Target className="h-5 w-5" />
              {lang === "ar" ? "كن التالي في قصة النجاح" : "Be the next success story"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ PRICING PREVIEW ═══════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-primary text-sm font-semibold mb-4">
              <Diamond className="h-4 w-4" />
              {lang === "ar" ? "الأسعار" : "Pricing"}
            </div>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-primary">
                {lang === "ar" ? "استثمار في مستقبلك" : lang === "fr" ? "Investir dans Votre Avenir" : "Invest in Your Future"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {lang === "ar" ? "دورات عالية الجودة بأسعار تنافسية مع ضمان رضا 100%" : "High-quality courses at competitive prices with 100% satisfaction guarantee"}
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-white text-xs font-semibold shadow-lg">
                    {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    {lang === "ar" ? "الباقة الأساسية" : "Basic Package"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {lang === "ar" ? "مثالي للمبتدئين" : "Perfect for beginners"}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-primary">15,000</span>
                      <span className="text-muted-foreground">دج</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "ar" ? "لمدة 3 أشهر" : "for 3 months"}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "5 دورات أساسية" : "5 basic courses"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "دعم فني 24/7" : "24/7 technical support"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "شهادات معتمدة" : "Certified certificates"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "مجتمع الطلاب" : "Student community"}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    {lang === "ar" ? "ابدأ الآن" : "Start Now"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 scale-105">
                {/* Best Value badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-2 bg-gradient-to-r from-gold to-yellow-500 rounded-full text-white text-xs font-semibold shadow-lg">
                    <Crown className="h-3 w-3 inline mr-1" />
                    {lang === "ar" ? "أفضل قيمة" : "Best Value"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold/10 to-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="h-8 w-8 text-gold" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    {lang === "ar" ? "الباقة المتقدمة" : "Pro Package"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {lang === "ar" ? "للمتعلمين الجادين" : "For serious learners"}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gold">35,000</span>
                      <span className="text-muted-foreground">دج</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "ar" ? "لمدة 6 أشهر" : "for 6 months"}
                    </p>
                    <div className="mt-2 px-3 py-1 bg-gold/10 rounded-full text-gold text-xs font-medium">
                      {lang === "ar" ? "توفير 25%" : "Save 25%"}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "15 دورة متقدمة" : "15 advanced courses"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "دعم فني 24/7" : "24/7 technical support"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "شهادات معتمدة" : "Certified certificates"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "مشروعات عملية" : "Real projects"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "جلسات استشارية" : "Consultation sessions"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "مجتمع الطلاب الخاص" : "Private student community"}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-white">
                    {lang === "ar" ? "اختر الباقة المتقدمة" : "Choose Pro Package"}
                    <Crown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true }}
              className="group relative">
              <div className="relative p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                {/* Premium badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-semibold shadow-lg">
                    <Diamond className="h-3 w-3 inline mr-1" />
                    {lang === "ar" ? "بريميوم" : "Premium"}
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Diamond className="h-8 w-8 text-purple-500" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    {lang === "ar" ? "الباقة المميزة" : "Premium Package"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {lang === "ar" ? "للمهنيين" : "For professionals"}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-purple-500">65,000</span>
                      <span className="text-muted-foreground">دج</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === "ar" ? "لمدة سنة كاملة" : "for 1 full year"}
                    </p>
                    <div className="mt-2 px-3 py-1 bg-purple-500/10 rounded-full text-purple-500 text-xs font-medium">
                      {lang === "ar" ? "توفير 45%" : "Save 45%"}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "جميع الدورات المتاحة" : "All available courses"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "دعم فني 24/7" : "24/7 technical support"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "شهادات معتمدة" : "Certified certificates"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "مشروعات عملية متقدمة" : "Advanced real projects"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "جلسات استشارية شهرية" : "Monthly consultation sessions"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "دورات مخصصة" : "Custom courses"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        {lang === "ar" ? "VIP مجتمع الطلاب" : "VIP student community"}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                    {lang === "ar" ? "تواصل معنا" : "Contact Us"}
                    <MessageCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Money back guarantee */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={3} viewport={{ once: true }}
            className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-2xl">
              <Shield className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <p className="text-green-800 font-semibold text-sm">
                  {lang === "ar" ? "ضمان استرداد الأموال 100%" : "100% Money Back Guarantee"}
                </p>
                <p className="text-green-600 text-xs">
                  {lang === "ar" ? "غير راضٍ؟ استرد أموالك في غضون 30 يوماً" : "Not satisfied? Get your money back within 30 days"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }} />
        </div>

        <div className="container relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-blue-600 text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" />
              {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
            </div>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-gradient-blue">
                {lang === "ar" ? "كل ما تحتاج معرفته" : lang === "fr" ? "Tout ce que vous devez savoir" : "Everything You Need to Know"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {lang === "ar" ? "إجابات على الأسئلة الأكثر شيوعاً حول دوراتنا ومنصتنا التعليمية" : "Answers to the most common questions about our courses and learning platform"}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {/* FAQ Item 1 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "هل الدورات مناسبة للمبتدئين تماماً؟" : "Are the courses suitable for complete beginners?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 0 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "نعم! جميع دوراتنا مصممة بعناية لتناسب المبتدئين تماماً. نبدأ من الأساسيات ونتقدم تدريجياً مع شرح مفصل لكل مفهوم. كما نوفر دعماً فنياً على مدار 24 ساعة لمساعدتك في أي استفسار."
                              : "Yes! All our courses are carefully designed for complete beginners. We start from the basics and progress gradually with detailed explanations of each concept. We also provide 24/7 technical support to help you with any questions."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* FAQ Item 2 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "كم من الوقت يستغرق إكمال دورة واحدة؟" : "How long does it take to complete one course?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 1 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 1 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "يعتمد الوقت على مستواك ووقت الدراسة المتاح. عادةً تستغرق الدورات الأساسية 2-4 أسابيع بدراسة 5-10 ساعات أسبوعياً، بينما الدورات المتقدمة قد تستغرق 6-8 أسابيع. يمكنك الدراسة بالسرعة التي تناسبك."
                              : "The time depends on your level and available study time. Basic courses usually take 2-4 weeks with 5-10 hours of study per week, while advanced courses may take 6-8 weeks. You can study at your own pace."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* FAQ Item 3 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "هل الشهادات معتمدة من جهات رسمية؟" : "Are the certificates officially recognized?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 2 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 2 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "نعم، جميع شهاداتنا معتمدة وتحمل ختم الأكاديمية الرسمي. كما يمكنك مشاركتها على LinkedIn ووسائل التواصل الاجتماعي. الشهادات تثبت إكمالك للدورة بنجاح ومهاراتك المكتسبة."
                              : "Yes, all our certificates are accredited and bear the official academy seal. You can also share them on LinkedIn and social media. The certificates prove your successful completion of the course and acquired skills."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* FAQ Item 4 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={3} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "هل يمكنني الوصول للدورات من الهاتف؟" : "Can I access courses from my phone?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 3 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 3 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "بالتأكيد! منصتنا متجاوبة بالكامل وتعمل على جميع الأجهزة. يمكنك الدراسة من هاتفك، جهازك اللوحي، أو الحاسوب. كما نوفر تطبيق جوال لتجربة أفضل على الهواتف الذكية."
                              : "Absolutely! Our platform is fully responsive and works on all devices. You can study from your phone, tablet, or computer. We also provide a mobile app for a better experience on smartphones."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* FAQ Item 5 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={4} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "ماذا لو لم أفهم شيئاً في الدورة؟" : "What if I don't understand something in the course?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 4 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 4 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "لا تقلق! لدينا دعم فني على مدار 24 ساعة من خلال الدردشة المباشرة، البريد الإلكتروني، والمنتديات. كما يمكنك إعادة مشاهدة الدروس غير المحدودة وطرح أسئلتك على المجتمع. نحن ملتزمون بنجاحك التعليمي."
                              : "Don't worry! We have 24/7 technical support through live chat, email, and forums. You can also rewatch lessons unlimited times and ask questions in the community. We are committed to your educational success."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* FAQ Item 6 */}
              <motion.div variants={scaleIn} initial="hidden" whileInView="visible" custom={5} viewport={{ once: true }}
                className="group">
                <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === 5 ? null : 5)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {lang === "ar" ? "هل يمكنني إلغاء الاشتراك في أي وقت؟" : "Can I cancel my subscription anytime?"}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${activeFaq === 5 ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === 5 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {lang === "ar"
                              ? "نعم، يمكنك إلغاء اشتراكك في أي وقت دون رسوم إضافية. كما نوفر ضمان استرداد الأموال خلال 30 يوماً إذا لم تكن راضياً عن الخدمة. رضاك التام هو أولويتنا."
                              : "Yes, you can cancel your subscription at any time without additional fees. We also provide a 30-day money-back guarantee if you're not satisfied with the service. Your complete satisfaction is our priority."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Contact CTA */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={6} viewport={{ once: true }}
              className="text-center mt-12">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-primary font-semibold text-sm">
                    {lang === "ar" ? "لم تجد إجابة سؤالك؟" : "Didn't find the answer to your question?"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {lang === "ar" ? "تواصل معنا وسنساعدك فوراً" : "Contact us and we'll help you immediately"}
                  </p>
                </div>
                <Button size="sm" className="ml-4">
                  {lang === "ar" ? "تواصل معنا" : "Contact Us"}
                </Button>
              </div>
            </motion.div>
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
