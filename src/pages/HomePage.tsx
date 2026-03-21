import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Users, BookOpen, Award, GraduationCap, MapPin, Clock, Zap,
  Star, Mail, Monitor, Briefcase, Languages as LanguagesIcon, Heart, Scale,
  Palette, Atom, Megaphone, Pencil, ChefHat, BookOpenCheck, Dumbbell, Play, CheckCircle
} from "lucide-react";
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

const marqueeItems = [
  "⭐ Online Certifications", "⭐ Top Instructors", "⭐ 2500+ Online Courses",
  "⭐ 56+ Wonderful Awards", "⭐ 5000+ Membership", "⭐ Expert Mentors",
];

const testimonials = [
  { name: "Sophie Laurent", role: "Web Developer", text: "Matsy Academy transformed my career. The courses are practical and the instructors are top-notch.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", rating: 5 },
  { name: "Omar Benali", role: "Marketing Manager", text: "I completed three certifications. The platform is intuitive and content always up to date.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar", rating: 5 },
  { name: "Claire Moreau", role: "Data Analyst", text: "The Data Science course gave me all the skills I needed to land my dream job. Highly recommended!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire", rating: 5 },
];

const mentors = [
  { name: "Dr. Ahmed Matsy", role: "AI & Data Science", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
  { name: "Sarah Benali", role: "Business Strategy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { name: "Marc Dupont", role: "Web Development", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc" },
  { name: "Fatima Zahra", role: "Digital Marketing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const { t } = useTranslation();
  const [testIdx, setTestIdx] = useState(0);
  const [activeCat, setActiveCat] = useState("All");

  useEffect(() => {
    const interval = setInterval(() => setTestIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredCourses = activeCat === "All"
    ? mockCourses.slice(0, 6)
    : mockCourses.filter((c) => c.category === activeCat).slice(0, 6);

  const courseCategories = ["All", ...mockCategories.slice(0, 5).map((c) => c.name)];

  return (
    <div>
      {/* Hero */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/courses">
                  <Button size="lg" className="gap-2 font-semibold">
                    {t("hero.browseCourses")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="font-semibold">
                    {t("hero.becomeInstructor")}
                  </Button>
                </Link>
              </div>
              {/* Instructor avatars */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {["Ahmed", "Sarah", "Marc", "Fatima"].map((seed) => (
                    <img key={seed} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt=""
                      className="h-10 w-10 rounded-full border-2 border-background" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">850+ {t("stats.instructors")}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-warning text-warning" />)}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="Students learning"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-4 -start-4 rounded-xl bg-primary p-4 text-primary-foreground shadow-lg">
                  <p className="text-2xl font-bold">2,500+</p>
                  <p className="text-sm">{t("stats.courses")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrolling Marquee */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex gap-8 animate-scroll-left hover:[animation-play-state:paused]" style={{ width: "fit-content" }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-medium text-primary-foreground">{item}</span>
          ))}
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

      {/* Learn With Us */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=400&fit=crop"
                alt="Learning" className="rounded-2xl" />
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

      {/* Explore Top Courses */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{t("featured.title")}</h2>
            <p className="text-muted-foreground">{t("featured.subtitle")}</p>
          </div>
          {/* Tab filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {courseCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeCat === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}>
                {cat === "All" ? t("catalog.all") : cat}
              </button>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c, i) => (
              <motion.div key={c.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                {t("featured.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {mockCategories.map(({ name, icon, slug, courseCount }, i) => {
              const Icon = iconMap[icon] || BookOpen;
              return (
                <motion.div key={slug} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link to={`/courses?category=${encodeURIComponent(name)}`}
                    className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-md">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{name}</h3>
                    <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/70">{courseCount} courses</span>
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
                Meet our Mentors
              </h2>
              <p className="mb-6 text-muted-foreground">Learn from industry experts with years of experience.</p>
              <div className="space-y-4">
                {[
                  { value: "850+", label: t("stats.instructors") },
                  { value: "50,000+", label: t("stats.students") },
                  { value: "95%", label: "Satisfaction Rate" },
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
                  className="group rounded-xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <img src={m.avatar} alt={m.name} className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-primary/20" />
                  <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
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
