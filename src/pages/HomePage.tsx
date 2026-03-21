import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, GraduationCap, MapPin, Clock, Zap,
  Star, Mail, Shield, Play, CheckCircle, MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns";
import heroImage from "@/assets/hero-graduation.jpg";

const iconMap: Record<string, React.ElementType> = {
  Shield, BookOpen, Award, Zap,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const [activeCat, setActiveCat] = useState("All");

  const stats = [
    { icon: Users, value: "+500", labelKey: "stats.students" },
    { icon: BookOpen, value: "3", labelKey: "stats.courses" },
    { icon: Shield, value: "2", labelKey: "stats.fields" },
    { icon: Award, value: "✓", labelKey: "stats.accredited" },
  ];

  const marqueeItems = lang === "ar"
    ? ["⭐ تكوين معتمد", "⭐ دورات السلامة والصحة المهنية", "⭐ مرشد الحج والعمرة", "⭐ +500 طالب", "⭐ شهادات معتمدة", "⭐ تكوين عن بعد"]
    : lang === "fr"
    ? ["⭐ Formation Certifiée", "⭐ Cours HSE", "⭐ Guide Hajj & Omra", "⭐ +500 Étudiants", "⭐ Certificats Reconnus", "⭐ Formation en Ligne"]
    : ["⭐ Certified Training", "⭐ HSE Courses", "⭐ Hajj & Umrah Guide", "⭐ +500 Students", "⭐ Recognized Certificates", "⭐ Online Training"];

  const testimonials: Testimonial[] = [
    { name: "Karim Bouzid", role: lang === "ar" ? "متخصص في السلامة" : lang === "fr" ? "Spécialiste Sécurité" : "Safety Specialist", text: lang === "ar" ? "أكاديمية مايسي غيرت مساري المهني. الدورات عملية والمدربون من أعلى مستوى." : lang === "fr" ? "Matsy Academy a transformé ma carrière. Les cours sont pratiques et les formateurs excellents." : "Matsy Academy transformed my career. The courses are practical and the instructors are top-notch.", image: "https://randomuser.me/api/portraits/men/11.jpg", rating: 5 },
    { name: "Amina Belhadj", role: lang === "ar" ? "مفتشة أمن" : lang === "fr" ? "Inspectrice Sécurité" : "Safety Inspector", text: lang === "ar" ? "أكملت دورة التفتيش الأمني. المنصة سهلة الاستخدام والمحتوى دائماً محدث." : lang === "fr" ? "J'ai terminé la formation d'inspection. La plateforme est intuitive et le contenu toujours à jour." : "I completed the safety inspection course. The platform is intuitive and content always up to date.", image: "https://randomuser.me/api/portraits/women/21.jpg", rating: 5 },
    { name: "Youcef Hamdi", role: lang === "ar" ? "مرشد حج وعمرة" : lang === "fr" ? "Guide Hajj" : "Hajj Guide", text: lang === "ar" ? "دورة مرشد الحج والعمرة كانت شاملة ومفيدة جداً. أنصح بها لكل من يريد العمل في هذا المجال." : lang === "fr" ? "Le cours de guide du Hajj était incroyablement complet. Très recommandé !" : "The Hajj guide course was incredibly comprehensive. Highly recommended!", image: "https://randomuser.me/api/portraits/men/45.jpg", rating: 5 },
    { name: "Fatima Zerhouni", role: lang === "ar" ? "مديرة الجودة" : lang === "fr" ? "Responsable Qualité" : "Quality Manager", text: lang === "ar" ? "منصة رائعة مع دورات منظمة بشكل جيد. تعلمت الكثير عن التفتيش الأمني." : lang === "fr" ? "Excellente plateforme avec des cours bien structurés. J'ai beaucoup appris sur l'inspection de sécurité." : "Great platform with well-structured courses. I learned a lot about safety inspection.", image: "https://randomuser.me/api/portraits/women/33.jpg", rating: 5 },
    { name: "Mohamed Saidi", role: lang === "ar" ? "مهندس سلامة" : lang === "fr" ? "Ingénieur Sécurité" : "Safety Engineer", text: lang === "ar" ? "الدكتور أحمد مايسي مدرب استثنائي. دورة السلامة غيرت مساري المهني." : lang === "fr" ? "Dr. Ahmed Matsy est un formateur exceptionnel. Le cours de sécurité a changé ma carrière." : "Dr. Ahmed Matsy is an exceptional instructor. The safety course changed my career.", image: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5 },
    { name: "Nadia Boudiaf", role: lang === "ar" ? "طالبة" : lang === "fr" ? "Étudiante" : "Student", text: lang === "ar" ? "المحتوى التعليمي ممتاز والشهادة معتمدة من وزارة التكوين المهني." : lang === "fr" ? "Le contenu éducatif est excellent et le certificat est reconnu par le Ministère de la Formation." : "The educational content is excellent and the certificate is recognized by the Ministry.", image: "https://randomuser.me/api/portraits/women/56.jpg", rating: 5 },
    { name: "Hassan Mebarki", role: lang === "ar" ? "مشرف أمن" : lang === "fr" ? "Superviseur Sécurité" : "Safety Supervisor", text: lang === "ar" ? "أفضل منصة تعليمية عربية في مجال السلامة والصحة المهنية." : lang === "fr" ? "La meilleure plateforme éducative arabe dans le domaine de la sécurité et santé au travail." : "The best Arabic educational platform in workplace safety and health.", image: "https://randomuser.me/api/portraits/men/67.jpg", rating: 5 },
    { name: "Salima Kaddour", role: lang === "ar" ? "مرشدة دينية" : lang === "fr" ? "Guide Religieuse" : "Religious Guide", text: lang === "ar" ? "دورة مرشد الحج والعمرة ساعدتني كثيراً في تطوير مهاراتي المهنية." : lang === "fr" ? "Le cours de guide du Hajj m'a beaucoup aidé à développer mes compétences professionnelles." : "The Hajj guide course helped me greatly develop my professional skills.", image: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5 },
    { name: "Rachid Benmoussa", role: lang === "ar" ? "عون أمن" : lang === "fr" ? "Agent de Sécurité" : "Safety Agent", text: lang === "ar" ? "حصلت على شهادة عون أمن ووقاية بفضل هذه الأكاديمية الرائعة." : lang === "fr" ? "J'ai obtenu mon certificat d'agent de sécurité grâce à cette formidable académie." : "I earned my safety agent certificate thanks to this amazing academy.", image: "https://randomuser.me/api/portraits/men/36.jpg", rating: 5 },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const mentors = [
    { name: "Dr. Ahmed Matsy", role: lang === "ar" ? "خبير السلامة والصحة المهنية" : lang === "fr" ? "Expert HSE" : "HSE Expert", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sheikh Ibrahim Khalil", role: lang === "ar" ? "مرشد ديني" : lang === "fr" ? "Guide Religieux" : "Religious Guide", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Mme. Sarah Benali", role: lang === "ar" ? "مستشارة تعليمية" : lang === "fr" ? "Conseillère Éducative" : "Education Advisor", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "M. Rachid Toumi", role: lang === "ar" ? "مفتش أمن معتمد" : lang === "fr" ? "Inspecteur HSE Certifié" : "Certified HSE Inspector", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
  ];

  const learningFocused = [
    {
      title: lang === "ar" ? "تكوين عن بعد مسجل" : lang === "fr" ? "Formation en Ligne Enregistrée" : "Online Recorded Training",
      desc: lang === "ar" ? "تعلم في أي وقت يناسبك مع دروس مسجلة عالية الجودة ومحتوى تفاعلي"
        : lang === "fr" ? "Apprenez à votre rythme avec des cours enregistrés de haute qualité et du contenu interactif"
        : "Learn at your own pace with high-quality recorded lessons and interactive content",
      img: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&h=400&fit=crop",
    },
    {
      title: lang === "ar" ? "دورات السلامة المعتمدة" : lang === "fr" ? "Formations Sécurité Certifiées" : "Certified Safety Training",
      desc: lang === "ar" ? "احصل على شهادات معتمدة من وزارة التكوين المهني في مجال السلامة والوقاية"
        : lang === "fr" ? "Obtenez des certificats reconnus par le Ministère de la Formation Professionnelle"
        : "Get certificates accredited by the Ministry of Vocational Training in safety and prevention",
      img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    },
    {
      title: lang === "ar" ? "إرشاد ديني متخصص" : lang === "fr" ? "Guidance Religieuse Spécialisée" : "Specialized Religious Guidance",
      desc: lang === "ar" ? "تعلم فنون الإرشاد الديني وإدارة مجموعات الحجاج والمعتمرين باحترافية"
        : lang === "fr" ? "Apprenez l'art du guidage religieux et la gestion des groupes de pèlerins"
        : "Learn the art of religious guidance and professional pilgrim group management",
      img: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop",
    },
  ];

  const filteredCourses = activeCat === "All"
    ? mockCourses
    : mockCourses.filter((c) => c.category === activeCat);

  const courseCategories = ["All", ...mockCategories.map((c) => c.name)];

  return (
    <div>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                {lang === "ar" ? "أكاديمية مايسي للتدريب والتطوير" : lang === "fr" ? "Matsy Academy — Formation et Développement Professionnel" : "Matsy Academy — Professional Training & Development"}
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                {lang === "ar" ? "منصة تعليمية معتمدة تقدم دورات في السلامة والصحة المهنية والإرشاد الديني. +500 طالب مسجل."
                  : lang === "fr" ? "Plateforme éducative certifiée proposant des formations en sécurité HSE et guidance religieuse. +500 étudiants inscrits."
                  : "Certified educational platform offering HSE safety and religious guidance courses. +500 enrolled students."}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/courses">
                  <Button size="lg" className="gap-2 font-semibold">
                    {t("hero.browseCourses")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/213554275994" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 font-semibold">
                    <MessageCircle className="h-4 w-4" />
                    {lang === "ar" ? "تواصل معنا" : lang === "fr" ? "Contactez-nous" : "Contact Us"}
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[32, 75, 44, 52].map((id, idx) => (
                    <img key={id} src={`https://randomuser.me/api/portraits/${idx === 2 ? 'women' : 'men'}/${id}.jpg`} alt=""
                      className="h-10 w-10 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">+500 {t("stats.students")}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-warning text-warning" />)}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative">
                <img
                  src={heroImage}
                  alt={lang === "ar" ? "طلاب متخرجون" : "Graduates"}
                  className="rounded-2xl"
                />
                <div className="absolute -bottom-4 -start-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-lg">
                  <p className="text-2xl font-bold">+500</p>
                  <p className="text-sm">{t("stats.students")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrolling Marquee */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex gap-12 animate-scroll-left hover:[animation-play-state:paused]" style={{ width: "fit-content" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="whitespace-nowrap text-base font-semibold text-primary-foreground">{item}</span>
          ))}
        </div>
      </section>

      {/* Learn With Us */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&h=600&fit=crop"
                alt={lang === "ar" ? "التعلم عبر الإنترنت" : "Online Learning"} className="rounded-2xl" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Play className="h-6 w-6" />
                </div>
              </button>
            </div>
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
                {t("howItWorks.title")}
              </h2>
              <p className="mb-6 text-muted-foreground">{t("howItWorks.subtitle")}</p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, titleKey: "howItWorks.where", descKey: "howItWorks.whereDesc" },
                  { icon: Clock, titleKey: "howItWorks.when", descKey: "howItWorks.whenDesc" },
                  { icon: Zap, titleKey: "howItWorks.pace", descKey: "howItWorks.paceDesc" },
                ].map(({ icon: Icon, titleKey, descKey }) => (
                  <div key={titleKey} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
                      <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Focused */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{t("learningFocused.title")}</h2>
            <p className="text-muted-foreground">{t("learningFocused.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningFocused.map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <img src={item.img} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Top Courses */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{t("featured.title")}</h2>
              <p className="text-muted-foreground">{t("featured.subtitle")}</p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="gap-2 hidden sm:inline-flex">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mb-8 flex flex-wrap gap-2">
            {[{ name: "All", name_en: "All", name_fr: "Tous", name_ar: "الكل" }, ...mockCategories].map((cat) => {
              const catLabel = getLocalized(cat, "name", lang);
              return (
                <button key={cat.name} onClick={() => setActiveCat(cat.name)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    activeCat === cat.name ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}>
                  {catLabel}
                </button>
              );
            })}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c, i) => (
              <motion.div key={c.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ icon: Icon, value, labelKey }, i) => (
              <motion.div key={labelKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-xl border bg-card p-6 text-center shadow-sm">
                <Icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <span className="font-display text-2xl font-bold text-foreground">{value}</span>
                <p className="text-sm text-muted-foreground">{t(labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{t("categories.title")}</h2>
            <p className="text-muted-foreground">{t("categories.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {mockCategories.map(({ name, icon, slug, courseCount, ...rest }, i) => {
              const Icon = iconMap[icon] || BookOpen;
              const catName = getLocalized(rest, "name", lang) || name;
              return (
                <motion.div key={slug} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link to={`/courses?category=${encodeURIComponent(name)}`}
                    className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{catName}</h3>
                    <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/70">{courseCount} {t("stats.courses").toLowerCase()}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="py-16">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-3">
            <div>
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground">
                {t("mentors.title")}
              </h2>
              <p className="mb-6 text-muted-foreground">{t("mentors.subtitle")}</p>
              <div className="space-y-4">
                {[
                  { value: "+500", label: t("stats.students") },
                  { value: "3", label: t("stats.courses") },
                  { value: "99%", label: t("mentors.satisfaction") },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-foreground"><strong>{value}</strong> {label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:grid-cols-4">
              {mentors.map((m, i) => (
                <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img src={m.avatar} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
          </div>
          <div className="mx-auto max-w-2xl">
            <motion.div key={testIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border bg-card p-8 shadow-sm text-center relative">
              <span className="absolute top-4 start-6 font-display text-6xl text-primary/20">"</span>
              <div className="mb-4 flex justify-center">
                {[...Array(testimonials[testIdx].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="mb-6 text-lg italic text-muted-foreground">"{testimonials[testIdx].text}"</p>
              <img src={testimonials[testIdx].avatar} alt="" className="mx-auto mb-3 h-12 w-12 rounded-full border-2 border-primary/20" />
              <p className="font-display font-semibold text-foreground">{testimonials[testIdx].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[testIdx].role}</p>
            </motion.div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === testIdx ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <Mail className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">{t("newsletter.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder={t("newsletter.placeholder")}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button type="submit">{t("newsletter.subscribe")}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
