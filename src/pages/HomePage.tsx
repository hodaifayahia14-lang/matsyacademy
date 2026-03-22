import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, Shield, Star, Mail,
  CheckCircle, ChevronDown, Sparkles,
  GraduationCap, Clock, Headphones, BadgeCheck, Book,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import CourseCard from "@/components/CourseCard";
import { useCourses, useCategories } from "@/hooks/useCourses";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns";
import heroEducators from "@/assets/hero-educators.png";

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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <span className="font-display text-3xl font-bold text-accent">
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

  const marqueeItems = lang === "ar"
    ? ["⭐ تكوين معتمد", "⭐ العناية الجسدية", "⭐ تعليم الأطفال", "⭐ الأمن والوقاية", "⭐ إرشاد الحج والعمرة", "⭐ +500 طالب", "⭐ تكوين عن بعد"]
    : lang === "fr"
    ? ["⭐ Formation Certifiée", "⭐ Soins Corporels", "⭐ Petite Enfance", "⭐ Sécurité HSE", "⭐ Guide Hajj & Omra", "⭐ +500 Étudiants", "⭐ Formation en Ligne"]
    : ["⭐ Certified Training", "⭐ Body Care", "⭐ Early Childhood", "⭐ HSE Safety", "⭐ Hajj & Umrah Guide", "⭐ +500 Students", "⭐ Online Training"];

  const testimonials: Testimonial[] = [
    { name: "Karim Bouzid", role: lang === "ar" ? "متخصص في السلامة" : lang === "fr" ? "Spécialiste Sécurité" : "Safety Specialist", text: lang === "ar" ? "أكاديمية مايسي غيرت مساري المهني. الدورات عملية والمدربون من أعلى مستوى." : lang === "fr" ? "Maisy Academy a transformé ma carrière. Les cours sont pratiques et les formateurs excellents." : "Maisy Academy transformed my career. The courses are practical and the instructors are top-notch.", image: "https://randomuser.me/api/portraits/men/11.jpg", rating: 5 },
    { name: "Amina Belhadj", role: lang === "ar" ? "مفتشة أمن" : lang === "fr" ? "Inspectrice Sécurité" : "Safety Inspector", text: lang === "ar" ? "أكملت دورة التفتيش الأمني. المنصة سهلة الاستخدام والمحتوى دائماً محدث." : lang === "fr" ? "J'ai terminé la formation d'inspection. La plateforme est intuitive et le contenu toujours à jour." : "I completed the safety inspection course. The platform is intuitive and content always up to date.", image: "https://randomuser.me/api/portraits/women/21.jpg", rating: 5 },
    { name: "Youcef Hamdi", role: lang === "ar" ? "مرشد حج وعمرة" : lang === "fr" ? "Guide Hajj" : "Hajj Guide", text: lang === "ar" ? "دورة مرشد الحج والعمرة كانت شاملة ومفيدة جداً. أنصح بها لكل من يريد العمل في هذا المجال." : lang === "fr" ? "Le cours de guide du Hajj était incroyablement complet. Très recommandé !" : "The Hajj guide course was incredibly comprehensive. Highly recommended!", image: "https://randomuser.me/api/portraits/men/45.jpg", rating: 5 },
    { name: "Fatima Zerhouni", role: lang === "ar" ? "مديرة الجودة" : lang === "fr" ? "Responsable Qualité" : "Quality Manager", text: lang === "ar" ? "منصة رائعة مع دورات منظمة بشكل جيد. تعلمت الكثير عن التفتيش الأمني." : lang === "fr" ? "Excellente plateforme avec des cours bien structurés." : "Great platform with well-structured courses.", image: "https://randomuser.me/api/portraits/women/33.jpg", rating: 5 },
    { name: "Mohamed Saidi", role: lang === "ar" ? "مهندس سلامة" : lang === "fr" ? "Ingénieur Sécurité" : "Safety Engineer", text: lang === "ar" ? "الدكتور أحمد مايسي مدرب استثنائي. دورة السلامة غيرت مساري المهني." : lang === "fr" ? "Dr. Ahmed Maisy est un formateur exceptionnel." : "Dr. Ahmed Maisy is an exceptional instructor.", image: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5 },
    { name: "Nadia Boudiaf", role: lang === "ar" ? "طالبة" : lang === "fr" ? "Étudiante" : "Student", text: lang === "ar" ? "المحتوى التعليمي ممتاز والشهادة معتمدة من وزارة التكوين المهني." : lang === "fr" ? "Le contenu éducatif est excellent et le certificat est reconnu." : "The educational content is excellent and the certificate is recognized.", image: "https://randomuser.me/api/portraits/women/56.jpg", rating: 5 },
    { name: "Hassan Mebarki", role: lang === "ar" ? "مشرف أمن" : lang === "fr" ? "Superviseur Sécurité" : "Safety Supervisor", text: lang === "ar" ? "أفضل منصة تعليمية عربية في مجال السلامة والصحة المهنية." : lang === "fr" ? "La meilleure plateforme éducative arabe dans le domaine HSE." : "The best Arabic educational platform in workplace safety.", image: "https://randomuser.me/api/portraits/men/67.jpg", rating: 5 },
    { name: "Salima Kaddour", role: lang === "ar" ? "مرشدة دينية" : lang === "fr" ? "Guide Religieuse" : "Religious Guide", text: lang === "ar" ? "دورة مرشد الحج والعمرة ساعدتني كثيراً في تطوير مهاراتي المهنية." : lang === "fr" ? "Le cours de guide du Hajj m'a beaucoup aidé." : "The Hajj guide course helped me greatly.", image: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5 },
    { name: "Rachid Benmoussa", role: lang === "ar" ? "عون أمن" : lang === "fr" ? "Agent de Sécurité" : "Safety Agent", text: lang === "ar" ? "حصلت على شهادة عون أمن ووقاية بفضل هذه الأكاديمية الرائعة." : lang === "fr" ? "J'ai obtenu mon certificat grâce à cette formidable académie." : "I earned my safety agent certificate thanks to this amazing academy.", image: "https://randomuser.me/api/portraits/men/36.jpg", rating: 5 },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const mentors = [
    { name: "Dr. Ahmed Maisy", role: lang === "ar" ? "خبير السلامة والصحة المهنية" : lang === "fr" ? "Expert HSE" : "HSE Expert", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sheikh Ibrahim Khalil", role: lang === "ar" ? "مرشد ديني" : lang === "fr" ? "Guide Religieux" : "Religious Guide", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Mme. Sarah Benali", role: lang === "ar" ? "مستشارة تعليمية" : lang === "fr" ? "Conseillère Éducative" : "Education Advisor", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "M. Rachid Toumi", role: lang === "ar" ? "مفتش أمن معتمد" : lang === "fr" ? "Inspecteur HSE Certifié" : "Certified HSE Inspector", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
  ];

  const whyChooseUs = [
    { icon: BadgeCheck, title: lang === "ar" ? "تكوين معتمد وزارياً" : lang === "fr" ? "Formation Certifiée par le Ministère" : "Ministry-Certified Training", desc: lang === "ar" ? "جميع دوراتنا معتمدة من وزارة التكوين المهني" : lang === "fr" ? "Toutes nos formations sont certifiées par le Ministère" : "All our courses are certified by the Ministry" },
    { icon: Clock, title: lang === "ar" ? "تعلّم عن بعد مرن" : lang === "fr" ? "Apprentissage en Ligne Flexible" : "Flexible Online Learning", desc: lang === "ar" ? "تعلم في أي وقت ومن أي مكان" : lang === "fr" ? "Apprenez à tout moment et n'importe où" : "Learn anytime, anywhere at your own pace" },
    { icon: GraduationCap, title: lang === "ar" ? "شهادة معترف بها" : lang === "fr" ? "Certificat Reconnu" : "Recognized Certificate", desc: lang === "ar" ? "احصل على شهادة مهنية معترف بها" : lang === "fr" ? "Obtenez un certificat professionnel reconnu" : "Earn a recognized professional certificate" },
    { icon: Headphones, title: lang === "ar" ? "دعم مستمر" : lang === "fr" ? "Support Continu" : "Ongoing Support", desc: lang === "ar" ? "فريق دعم متاح لمساعدتك" : lang === "fr" ? "Une équipe de support disponible pour vous aider" : "A support team available to help you" },
  ];

  const filteredCourses = activeCat === "All" ? dbCourses : dbCourses.filter((c) => c.category_name === activeCat);
  const featuredCourses = filteredCourses;

  return (
    <div className="overflow-hidden">
      {/* ═══════════════════ HERO — EduThink Style ═══════════════════ */}
      <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-16 start-[10%] opacity-10">
          <Sparkles className="h-16 w-16 text-accent" />
        </div>
        <div className="absolute top-1/3 end-[35%] opacity-5">
          <Sparkles className="h-24 w-24 text-primary" />
        </div>
        {/* Subtle curved lines behind the image */}
        <div className="absolute end-0 top-0 h-full w-1/2 hidden lg:block">
          <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 500 700" fill="none">
            <circle cx="350" cy="350" r="300" stroke="hsl(var(--accent))" strokeWidth="1" />
            <circle cx="350" cy="350" r="250" stroke="hsl(var(--accent))" strokeWidth="0.5" />
            <circle cx="350" cy="350" r="200" stroke="hsl(var(--accent))" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left — Text Content */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="mb-6 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-foreground">
                  {lang === "ar" ? (
                    <>
                      اكتشف{" "}
                      <span className="text-accent">+12</span>
                      <br />
                      دورة تدريبية معتمدة
                      <br />
                      من{" "}
                      <span className="text-primary">أكاديمية مايسي</span>
                    </>
                  ) : lang === "fr" ? (
                    <>
                      Découvrez{" "}
                      <span className="text-accent">+12</span>
                      <br />
                      Formations Certifiées
                      <br />
                      de{" "}
                      <span className="text-primary">Maisy Academy</span>
                    </>
                  ) : (
                    <>
                      Get{" "}
                      <span className="text-accent">+12</span>
                      <br />
                      Best Certified Courses
                      <br />
                      From{" "}
                      <span className="text-primary">Maisy Academy</span>
                    </>
                  )}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 max-w-lg text-lg text-muted-foreground"
              >
                {lang === "ar"
                  ? "أفضل منصة تعليمية جزائرية تقدم تكوينات مرنة، دورات معتمدة، ومدربين خبراء."
                  : lang === "fr"
                  ? "La meilleure plateforme éducative algérienne offrant des formations flexibles, des cours certifiés et des formateurs experts."
                  : "Best Algerian education platform offering flexible learning, certified courses, and expert instructors."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link to="/courses">
                  <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg">
                    {lang === "ar" ? "تصفح الدورات" : lang === "fr" ? "Trouver des Cours" : "Find Courses"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Instructor avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12"
              >
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {lang === "ar" ? "+500 طالب مسجل" : lang === "fr" ? "+500 Étudiants" : "+500 Students"}
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[32, 75, 44].map((id, idx) => (
                      <img
                        key={id}
                        src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? "men" : "women"}/${id}.jpg`}
                        alt=""
                        className="h-10 w-10 rounded-full border-2 border-background object-cover"
                      />
                    ))}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-secondary text-xs font-semibold text-muted-foreground">
                    +
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — Hero Image */}
            <motion.div
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Decorative colored block behind image */}
                <div className="absolute -bottom-4 -start-4 h-32 w-24 rounded-2xl bg-accent/20" />
                <div className="absolute -top-4 -end-4 h-32 w-24 rounded-2xl bg-primary/10" />
                <img
                  src={heroEducators}
                  alt="Maisy Academy Educators"
                  className="relative z-10 h-auto w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ MARQUEE BAR (Dark Accent) ═══════════════════ */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex gap-16 animate-scroll-left hover:[animation-play-state:paused]" style={{ width: "fit-content" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap text-base font-semibold text-primary-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              {item.replace("⭐ ", "")}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="py-12">
        <div className="container">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map(({ icon, value, labelKey }) => (
                <StatCounter key={labelKey} icon={icon} value={value} label={t(labelKey)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED COURSES & BOOKS ═══════════════════ */}
      <section className="py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-10 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              <span className="text-foreground">{lang === "ar" ? "دوراتنا" : lang === "fr" ? "Nos" : "Our"} </span>
              <span className="text-accent">{lang === "ar" ? "وكتبنا" : lang === "fr" ? "Cours & Livres" : "Courses & Books"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
            <p className="text-muted-foreground">{t("featured.subtitle")}</p>
          </motion.div>

          {/* Category filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {[{ name: "All", name_en: "All", name_fr: "Tous", name_ar: "الكل" }, ...dbCategories].map((cat: any) => {
              const catLabel = getLocalized(cat, "name", lang);
              return (
                <button key={cat.name} onClick={() => setActiveCat(cat.name)}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeCat === cat.name
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                      : "border border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}>
                  {catLabel}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/courses">
              <Button variant="outline" className="gap-2 border-accent/40 text-accent hover:bg-accent/10">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              <span className="text-foreground">{lang === "ar" ? "كيف" : lang === "fr" ? "Comment" : "How It"} </span>
              <span className="text-accent">{lang === "ar" ? "يعمل؟" : lang === "fr" ? "ça Marche ?" : "Works?"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: Book, title: lang === "ar" ? "تصفح الدورات" : lang === "fr" ? "Parcourir les Cours" : "Browse Courses", desc: lang === "ar" ? "اختر من بين دوراتنا وكتبنا المعتمدة" : lang === "fr" ? "Choisissez parmi nos cours et livres certifiés" : "Choose from our certified courses and books" },
              { step: "02", icon: GraduationCap, title: lang === "ar" ? "سجّل وتعلّم" : lang === "fr" ? "Inscrivez-vous" : "Enroll & Learn", desc: lang === "ar" ? "سجّل وابدأ التعلم بالسرعة التي تناسبك" : lang === "fr" ? "Inscrivez-vous et apprenez à votre rythme" : "Sign up and start learning at your own pace" },
              { step: "03", icon: Award, title: lang === "ar" ? "احصل على الشهادة" : lang === "fr" ? "Obtenez le Certificat" : "Get Certified", desc: lang === "ar" ? "احصل على شهادة معتمدة من وزارة التكوين المهني" : lang === "fr" ? "Obtenez un certificat reconnu" : "Earn a ministry-recognized certificate" },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground font-display text-xl font-bold shadow-lg">
                  {step}
                </div>
                <Icon className="mx-auto mb-3 h-8 w-8 text-accent/60" />
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              <span className="text-foreground">{lang === "ar" ? "لماذا" : lang === "fr" ? "Pourquoi" : "Why"} </span>
              <span className="text-accent">{lang === "ar" ? "تختار أكاديمية مايسي؟" : lang === "fr" ? "Choisir Maisy Academy ?" : "Choose Maisy Academy?"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 mx-auto max-w-2xl">
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="grid grid-cols-3 bg-secondary/50 p-4 text-center font-semibold text-sm">
                <span>{lang === "ar" ? "الميزة" : "Feature"}</span>
                <span className="text-accent">Maisy Academy</span>
                <span className="text-muted-foreground">{lang === "ar" ? "منصات أخرى" : lang === "fr" ? "Autres" : "Others"}</span>
              </div>
              {[
                lang === "ar" ? "معتمد وزارياً" : "Ministry Certified",
                lang === "ar" ? "محتوى عربي" : "Arabic Content",
                lang === "ar" ? "شهادة معترف بها" : "Recognized Certificate",
                lang === "ar" ? "أسعار مناسبة" : "Affordable Pricing",
                lang === "ar" ? "دعم مباشر" : "Direct Support",
              ].map((feature, i) => (
                <div key={i} className={`grid grid-cols-3 p-3 text-center text-sm ${i % 2 ? "bg-secondary/20" : ""}`}>
                  <span className="text-foreground">{feature}</span>
                  <span className="text-accent font-bold">✓</span>
                  <span className="text-destructive">✗</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ MENTORS ═══════════════════ */}
      <section className="py-20">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 font-display text-3xl font-bold">
                <span className="text-foreground">{lang === "ar" ? "تعلّم من" : lang === "fr" ? "Apprenez avec" : "Learn from"} </span>
                <span className="text-accent">{lang === "ar" ? "الخبراء" : lang === "fr" ? "les Experts" : "Experts"}</span>
              </h2>
              <p className="mb-6 text-muted-foreground">{t("mentors.subtitle")}</p>
              <div className="space-y-4">
                {[
                  { value: "+500", label: t("stats.students") },
                  { value: "3", label: t("stats.courses") },
                  { value: "99%", label: t("mentors.satisfaction") },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground"><strong className="text-accent">{value}</strong> {label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:grid-cols-4">
              {mentors.map((m, i) => (
                <motion.div key={m.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <div className="aspect-square overflow-hidden">
                    <img src={m.avatar} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                    <p className="text-xs text-accent">{m.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-10 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">
              <span className="text-foreground">{lang === "ar" ? "ماذا يقول" : lang === "fr" ? "Ce que disent" : "What Our"} </span>
              <span className="text-accent">{lang === "ar" ? "طلابنا" : lang === "fr" ? "nos Étudiants" : "Students Say"}</span>
            </h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-accent" />
            <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <TestimonialsColumn testimonials={firstColumn} duration={18} />
            <TestimonialsColumn testimonials={secondColumn} duration={22} className="hidden md:block" />
            <TestimonialsColumn testimonials={thirdColumn} duration={16} className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ PAYMENT METHODS ═══════════════════ */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
              {lang === "ar" ? "طرق الدفع المتاحة" : lang === "fr" ? "Méthodes de Paiement" : "Payment Methods"}
            </h2>
            <p className="mb-8 text-muted-foreground">
              {lang === "ar" ? "ادفع بالطريقة التي تناسبك" : lang === "fr" ? "Payez comme vous voulez" : "Pay the way that suits you"}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "BaridiMob", desc: lang === "ar" ? "بريدي موب" : "BaridiMob", icon: "📱" },
                { name: "CCP", desc: lang === "ar" ? "الحساب البريدي" : "Poste Algérie", icon: "🏦" },
                { name: "EDAHABIA", desc: lang === "ar" ? "بطاقة الذهبية" : "Carte EDAHABIA", icon: "💳" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-xl border bg-card px-6 py-4 shadow-sm">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="text-start">
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }} />
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              {lang === "ar" ? "ابدأ رحلتك التعليمية اليوم" : lang === "fr" ? "Commencez Votre Parcours Aujourd'hui" : "Start Your Learning Journey Today"}
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80">
              {lang === "ar" ? "سجّل مجاناً واحصل على وصول فوري لدوراتنا وكتبنا المعتمدة" : lang === "fr" ? "Inscrivez-vous et accédez à nos formations et livres certifiés" : "Register and get access to our certified courses and books"}
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 shadow-xl">
                {lang === "ar" ? "سجّل مجاناً" : lang === "fr" ? "Inscrivez-vous Gratuitement" : "Register Free"} <ArrowRight className="ms-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ NEWSLETTER ═══════════════════ */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <Mail className="h-7 w-7 text-accent" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">{t("newsletter.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder={t("newsletter.placeholder")}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">{t("newsletter.subscribe")}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
