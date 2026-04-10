import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Target, Telescope, Users, BookOpen, GraduationCap, Handshake,
  Lightbulb, Shield, Award, Globe, Rocket, Trophy,
  ChevronDown, ArrowRight, Linkedin, Facebook, Instagram, Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ───── animated counter ───── */
function AnimatedCounter({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = Math.ceil(target / (dur / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

const fadeLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };

export default function About() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const isRtl = lang === "ar";

  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;

  /* ───── data ───── */
  const stats = [
    { icon: GraduationCap, target: 5000, label: t("متعلم نشط", "Apprenants actifs", "Active Learners") },
    { icon: BookOpen, target: 120, label: t("دورة تدريبية", "Formations", "Courses") },
    { icon: Users, target: 40, label: t("مدرب محترف", "Formateurs", "Expert Trainers") },
    { icon: Handshake, target: 25, label: t("شريك موثوق", "Partenaires", "Trusted Partners") },
  ];

  const timeline = [
    { year: "2021", icon: Rocket, title: t("تأسيس الأكاديمية", "Fondation de l'Académie", "Academy Founded"), desc: t("انطلاق أكاديمية مايسي كمنصة تعليمية جزائرية رائدة.", "Lancement de Maisy Academy comme plateforme leader.", "Maisy Academy launched as Algeria's leading e-learning platform.") },
    { year: "2022", icon: BookOpen, title: t("إطلاق أول 20 دورة", "Lancement de 20 cours", "First 20 Courses Launched"), desc: t("توسيع المحتوى التعليمي ليشمل مجالات متعددة.", "Expansion du contenu éducatif à plusieurs domaines.", "Expanded educational content across multiple fields.") },
    { year: "2023", icon: Users, title: t("وصلنا إلى 1,000 طالب", "1 000 étudiants atteints", "Reached 1,000 Students"), desc: t("اعتماد واسع من المتعلمين في جميع أنحاء الجزائر.", "Adoption massive par les apprenants à travers l'Algérie.", "Massive adoption by learners across Algeria.") },
    { year: "2024", icon: Handshake, title: t("أولى الشراكات المؤسسية", "Premiers partenariats", "First Corporate Partnerships"), desc: t("شراكات استراتيجية مع مؤسسات تعليمية رائدة.", "Partenariats stratégiques avec des institutions.", "Strategic partnerships with leading institutions.") },
    { year: "2025", icon: Globe, title: t("إعادة إطلاق المنصة", "Relance de la plateforme", "Platform Relaunch"), desc: t("تصميم جديد وميزات متقدمة لتجربة تعليمية أفضل.", "Nouveau design et fonctionnalités avancées.", "New design and advanced features for better learning.") },
    { year: "2026", icon: Trophy, title: t("المنصة التعليمية الأولى", "Plateforme n°1", "Algeria's Top Platform"), desc: t("الهدف: أن نصبح المنصة التعليمية الأولى في الجزائر.", "Objectif: devenir la première plateforme en Algérie.", "Goal: become Algeria's #1 e-learning platform.") },
  ];

  const team = [
    { name: "Dr. Ahmed Maisy", role: t("المؤسس والرئيس التنفيذي", "Fondateur & PDG", "Founder & CEO"), bio: t("خبير تعليمي بأكثر من 15 عاماً من الخبرة في التعليم الرقمي.", "Expert éducatif avec plus de 15 ans d'expérience.", "Education expert with 15+ years in digital learning."), avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Sheikh Ibrahim Khalil", role: t("رئيس الإرشاد الديني", "Responsable Guide Religieux", "Head of Religious Guidance"), bio: t("عالم ومرشد ديني متخصص في تطوير المحتوى التعليمي.", "Érudit et guide religieux spécialisé.", "Scholar and guide specializing in educational content."), avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Mme. Sarah Benali", role: t("مستشارة تعليمية", "Conseillère Éducative", "Education Advisor"), bio: t("متخصصة في تصميم المناهج وتطوير الاستراتيجيات التعليمية.", "Spécialiste en conception de programmes.", "Specialist in curriculum design and learning strategies."), avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  ];

  const values = [
    { icon: Lightbulb, title: t("الابتكار", "Innovation", "Innovation"), desc: t("نستخدم أحدث التقنيات لتقديم تجربة تعليمية فريدة.", "Nous utilisons les dernières technologies.", "We use cutting-edge tech for unique learning.") },
    { icon: Shield, title: t("الثقة", "Confiance", "Trust"), desc: t("نبني علاقات قائمة على الشفافية والمصداقية.", "Nous construisons des relations basées sur la transparence.", "We build relationships based on transparency.") },
    { icon: Target, title: t("التميز", "Excellence", "Excellence"), desc: t("نسعى دائماً لتقديم أعلى معايير الجودة.", "Nous visons toujours les plus hauts standards.", "We always strive for the highest quality standards.") },
    { icon: Globe, title: t("الشمولية", "Accessibilité", "Accessibility"), desc: t("التعليم الجيد متاح للجميع بغض النظر عن الموقع.", "Une éducation de qualité accessible à tous.", "Quality education accessible to everyone everywhere.") },
  ];

  const partners = [
    "Google", "Microsoft", "UNESCO", "Coursera", "USAID", "UNDP",
    "Meta", "Cisco", "Adobe", "Amazon", "IBM", "Oracle"
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #5B2D8E 0%, #1A0A3C 100%)" }}>
        {/* particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: `hsla(42, 72%, 55%, ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container relative z-10 py-24 md:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block mb-4 px-5 py-1.5 rounded-full text-sm font-bold" style={{ background: "hsl(42, 72%, 45%)", color: "#fff" }}>
              {t("من نحن", "À propos", "About Us")}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 font-display max-w-3xl mx-auto leading-tight">
            {t("نحن نؤمن بقوة التعليم", "Nous croyons au pouvoir de l'éducation", "We Believe in the Power of Education")}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            {t(
              "أكاديمية مايسي — منصة تعليمية جزائرية تجمع أفضل الخبراء والمتعلمين في مكان واحد.",
              "Maisy Academy — La plateforme e-learning algérienne qui réunit experts et apprenants.",
              "Maisy Academy — The Algerian e-learning platform connecting experts and learners."
            )}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/courses">
              <Button size="lg" className="gradient-purple-gold text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                {t("استكشف الدورات", "Découvrir les cours", "Explore Courses")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                {t("تواصل معنا", "Contactez-nous", "Contact Us")}
              </Button>
            </Link>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-10">
            <ChevronDown className="mx-auto h-6 w-6 text-white/40" />
          </motion.div>
        </div>
      </section>

      {/* ═══════ MISSION & VISION ═══════ */}
      <section className="py-20">
        <div className="container grid gap-8 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={isRtl ? fadeRight : fadeLeft}
            className="rounded-2xl bg-card p-8 shadow-md border-s-4 border-primary hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "hsl(42, 72%, 45%)" }}>
              <Target className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground">{t("رسالتنا", "Notre Mission", "Our Mission")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(
                "نسعى لتوفير تعليم عالي الجودة ومتاح للجميع في الجزائر عبر الإنترنت، من خلال ربط المتعلمين بأفضل الخبراء والمدربين.",
                "Nous offrons un enseignement de qualité accessible à tous en Algérie en connectant les apprenants aux meilleurs experts.",
                "We provide high-quality, accessible education for everyone in Algeria by connecting learners with top experts and trainers."
              )}
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={isRtl ? fadeLeft : fadeRight}
            className="rounded-2xl bg-card p-8 shadow-md border-s-4 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
            style={{ borderInlineStartColor: "hsl(42, 72%, 45%)" }}>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Telescope className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-foreground">{t("رؤيتنا", "Notre Vision", "Our Vision")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(
                "أن نصبح المنصة التعليمية الأولى في الجزائر والعالم العربي، ونمكن كل فرد من تحقيق إمكاناته الكاملة.",
                "Devenir la première plateforme éducative en Algérie et dans le monde arabe, en permettant à chacun de réaliser son potentiel.",
                "To become Algeria's and the Arab world's #1 learning platform, enabling everyone to reach their full potential."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS COUNTER ═══════ */}
      <section className="py-16" style={{ background: "#1A0A3C" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10" style={{ direction: isRtl ? "rtl" : "ltr" }}>
            {stats.map(({ icon: Icon, target, label }, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="text-center px-4 py-4">
                <Icon className="mx-auto mb-3 h-8 w-8" style={{ color: "hsl(42, 72%, 55%)" }} />
                <p className="font-display text-4xl md:text-5xl font-bold" style={{ color: "hsl(42, 72%, 55%)" }}>
                  <AnimatedCounter target={target} />
                </p>
                <p className="mt-2 text-sm text-white/60">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section className="py-20">
        <div className="container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground mb-14">
            {t("قصتنا", "Notre Histoire", "Our Story")}
            <span className="block w-16 h-1 mx-auto mt-3 rounded-full gradient-purple-gold" />
          </motion.h2>

          <div className="relative max-w-3xl mx-auto">
            {/* vertical line */}
            <div className={`absolute top-0 bottom-0 w-0.5 gradient-purple-gold ${isRtl ? "right-4 md:right-1/2 md:-translate-x-0.5" : "left-4 md:left-1/2 md:-translate-x-0.5"}`} />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={isLeft ? (isRtl ? fadeLeft : fadeRight) : (isRtl ? fadeRight : fadeLeft)}
                  className={`relative flex mb-10 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                  {/* year badge */}
                  <div className={`absolute ${isRtl ? "right-0" : "left-0"} md:left-1/2 md:-translate-x-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full font-bold text-xs text-white shadow-lg`}
                    style={{ background: "hsl(42, 72%, 45%)" }}>
                    <item.icon className="h-4 w-4" />
                  </div>

                  {/* card */}
                  <div className={`${isRtl ? "mr-12" : "ml-12"} md:ml-0 md:mr-0 md:w-[calc(50%-2rem)] ${isLeft ? (isRtl ? "md:ml-auto md:mr-8" : "md:mr-auto md:ml-8") : (isRtl ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8")} 
                    rounded-2xl bg-card p-5 shadow-md border-s-4 border-primary hover:-translate-y-1 hover:shadow-lg transition-all`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: "hsl(42, 72%, 45%)" }}>{item.year}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TEAM ═══════ */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
            {t("فريقنا", "Notre Équipe", "Meet Our Team")}
          </motion.h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {team.map((m, i) => (
              <motion.div key={m.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-2xl bg-card p-6 text-center shadow-md border-t-0 hover:border-t-4 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
                style={{ borderTopColor: "hsl(42, 72%, 45%)" }}>
                <div className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-primary/20 overflow-hidden">
                  <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: "hsl(42, 72%, 45%)" }}>{m.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
                <div className="flex justify-center gap-2 mt-4">
                  {[Linkedin, Facebook, Instagram, Youtube].map((Icon, j) => (
                    <button key={j} className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="py-20" style={{ background: "hsl(260 10% 97%)" }}>
        <div className="container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
            {t("قيمنا", "Nos Valeurs", "Our Values")}
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-2xl bg-card p-6 text-center shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "hsl(42, 72%, 45%)" }}>
                  <v.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PARTNERS ═══════ */}
      <section className="py-16 overflow-hidden">
        <div className="container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            {t("شركاؤنا", "Nos Partenaires", "Our Partners")}
          </motion.h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 w-20 bg-gradient-to-e from-background to-transparent z-10" />
          <div className="absolute inset-y-0 end-0 w-20 bg-gradient-to-s from-background to-transparent z-10" style={{ backgroundImage: isRtl ? "linear-gradient(to right, transparent, hsl(0 0% 98%))" : "linear-gradient(to left, transparent, hsl(0 0% 98%))" }} />
          
          <div className="flex gap-12 py-4" style={{ animation: `scroll-partners 25s linear infinite`, direction: isRtl ? "rtl" : "ltr" }}>
            {[...partners, ...partners].map((name, i) => (
              <div key={i} className="flex-shrink-0 px-6 py-3 rounded-xl bg-card shadow-sm border border-border text-lg font-bold text-muted-foreground/40 hover:text-foreground transition-colors cursor-default select-none whitespace-nowrap">
                {name}
              </div>
            ))}
          </div>
          <style>{`
            @keyframes scroll-partners {
              0% { transform: translateX(0); }
              100% { transform: translateX(${isRtl ? "50%" : "-50%"}); }
            }
          `}</style>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 gradient-purple-gold">
        <div className="container text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("ابدأ رحلتك التعليمية اليوم", "Commencez votre parcours aujourd'hui", "Start Your Learning Journey Today")}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-white/70 mb-8 max-w-lg mx-auto">
            {t("انضم إلى آلاف المتعلمين واكتشف دوراتنا المعتمدة.", "Rejoignez des milliers d'apprenants.", "Join thousands of learners and explore our certified courses.")}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-primary font-bold px-8 py-6 rounded-xl hover:bg-white/90 transition-all">
                {t("استكشف الدورات", "Découvrir les cours", "Explore Courses")} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                {t("تواصل معنا", "Contactez-nous", "Contact Us")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
