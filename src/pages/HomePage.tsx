import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Award, GraduationCap, MapPin, Clock, Zap, Star, Mail, Monitor, Briefcase, Languages as LanguagesIcon, Heart, Scale, Palette, Atom, Megaphone, Pencil, ChefHat, BookOpenCheck, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Briefcase, Languages: LanguagesIcon, Heart, Scale, Palette,
  Atom, Megaphone, Pencil, ChefHat, BookOpen: BookOpenCheck, Dumbbell,
};

const stats = [
  { icon: Users, value: "50,000+", labelKey: "stats.students" },
  { icon: BookOpen, value: "2,400+", labelKey: "stats.courses" },
  { icon: GraduationCap, value: "850+", labelKey: "stats.instructors" },
  { icon: Award, value: "35,000+", labelKey: "stats.certificates" },
];

const testimonials = [
  { name: "Sophie Laurent", role: "Web Developer", text: "Matsy Academy transformed my career. The courses are practical and the instructors are top-notch.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", rating: 5 },
  { name: "Omar Benali", role: "Marketing Manager", text: "I completed three certifications on Matsy Academy. The platform is intuitive and content always up to date.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar", rating: 5 },
  { name: "Claire Moreau", role: "Data Analyst", text: "The Data Science course gave me all the skills I needed to land my dream job. Highly recommended!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire", rating: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const { t } = useTranslation();
  const [testIdx, setTestIdx] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestIdx((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-28">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <span className="font-display text-5xl font-bold text-gold md:text-6xl lg:text-7xl">
                Matsy Academy
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8 text-lg text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/courses">
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground border border-gold/30 font-semibold hover:bg-primary/90">
                  {t("hero.browseCourses")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-gold/40 font-semibold text-gold hover:bg-gold/10">
                  {t("hero.becomeInstructor")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 shadow-lg md:grid-cols-4 md:p-8">
            {stats.map(({ icon: Icon, value, labelKey }, i) => (
              <motion.div
                key={labelKey}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <Icon className="mb-2 h-8 w-8 text-gold" />
                <span className="font-display text-2xl font-bold text-gold">{value}</span>
                <span className="text-sm text-muted-foreground">{t(labelKey)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-gold">{t("howItWorks.title")}</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded bg-primary" />
            <p className="text-muted-foreground">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: MapPin, titleKey: "howItWorks.where", descKey: "howItWorks.whereDesc" },
              { icon: Clock, titleKey: "howItWorks.when", descKey: "howItWorks.whenDesc" },
              { icon: Zap, titleKey: "howItWorks.pace", descKey: "howItWorks.paceDesc" },
            ].map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div
                key={titleKey}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-8 text-center shadow-card transition-all hover:shadow-card-hover hover:border-gold/30"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                  <Icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses — Infinite Scroll */}
      <section className="py-20">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-1 font-display text-3xl font-bold text-gold">{t("featured.title")}</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded bg-primary" />
            <p className="text-muted-foreground">{t("featured.subtitle")}</p>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-scroll-left hover:[animation-play-state:paused]" style={{ width: "fit-content" }}>
            {[...mockCourses.slice(0, 8), ...mockCourses.slice(0, 8)].map((c, i) => (
              <div key={`${c.id}-${i}`} className="w-[300px] flex-shrink-0">
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        </div>
        <div className="container mt-8 text-center">
          <Link to="/courses">
            <Button variant="outline" className="gap-2 border-gold/30 text-gold hover:bg-gold/10">
              {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-gold">{t("categories.title")}</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded bg-primary" />
            <p className="text-muted-foreground">{t("categories.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {mockCategories.map(({ name, icon, slug, courseCount }, i) => {
              const Icon = iconMap[icon] || BookOpen;
              return (
                <motion.div
                  key={slug}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    to={`/courses?category=${encodeURIComponent(name)}`}
                    className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover hover:border-gold/30"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">{name}</h3>
                    <span className="text-xs text-muted-foreground">{courseCount} courses</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold text-gold">{t("testimonials.title")}</h2>
            <div className="mx-auto mb-4 h-1 w-16 rounded bg-primary" />
          </div>
          <div className="mx-auto max-w-2xl">
            <motion.div
              key={testIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-8 shadow-card text-center relative"
            >
              <span className="absolute top-4 start-6 font-display text-6xl text-gold/20">"</span>
              <div className="mb-4 flex justify-center">
                {[...Array(testimonials[testIdx].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="mb-6 text-lg italic text-muted-foreground">"{testimonials[testIdx].text}"</p>
              <img src={testimonials[testIdx].avatar} alt="" className="mx-auto mb-3 h-12 w-12 rounded-full border-2 border-gold/30" />
              <p className="font-display font-semibold text-foreground">{testimonials[testIdx].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[testIdx].role}</p>
            </motion.div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === testIdx ? "bg-gold" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <Mail className="mx-auto mb-4 h-10 w-10 text-gold" />
            <h2 className="mb-3 font-display text-3xl font-bold text-gold">{t("newsletter.title")}</h2>
            <p className="mb-6 text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button type="submit" className="bg-primary border border-gold/30">{t("newsletter.subscribe")}</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
