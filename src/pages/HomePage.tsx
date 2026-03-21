import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Award, GraduationCap, MapPin, Clock, Zap, Star, ChevronLeft, ChevronRight, Mail, Monitor, Briefcase, Languages as LanguagesIcon, Heart, Scale, Palette, Atom, Megaphone, Pencil, ChefHat, BookOpenCheck, Dumbbell } from "lucide-react";
import { useState, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import CourseCard from "@/components/CourseCard";
import { mockCourses, mockCategories } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Briefcase, Languages: LanguagesIcon, Heart, Scale, Palette,
  Atom, Megaphone, Pencil, ChefHat, BookOpen: BookOpenCheck, Dumbbell,
};

const stats = [
  { icon: Users, value: "50,000+", label: "Students" },
  { icon: BookOpen, value: "2,400+", label: "Courses" },
  { icon: GraduationCap, value: "850+", label: "Instructors" },
  { icon: Award, value: "35,000+", label: "Certificates" },
];

const howItWorks = [
  { icon: MapPin, title: "Where I want", desc: "Learn from anywhere in the world. All you need is an internet connection." },
  { icon: Clock, title: "When I want", desc: "Access your courses 24/7. Study at your own schedule, day or night." },
  { icon: Zap, title: "At my own pace", desc: "No pressure. Progress through lessons at a speed that suits you." },
];

const testimonials = [
  { name: "Sophie Laurent", role: "Web Developer", text: "EduZone transformed my career. The courses are practical, well-structured, and the instructors are top-notch.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", rating: 5 },
  { name: "Omar Benali", role: "Marketing Manager", text: "I completed three certifications on EduZone. The platform is intuitive and the content is always up to date.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar", rating: 5 },
  { name: "Claire Moreau", role: "Data Analyst", text: "The Data Science course gave me all the skills I needed to land my dream job. Highly recommended!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire", rating: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const [testIdx, setTestIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              All Knowledge is <br />Learned Here
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8 text-lg text-primary-foreground/80"
            >
              Join thousands of learners mastering new skills every day. Expert-led courses in tech, business, languages, and more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/courses">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                  Browse Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                  Become an Instructor
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-card p-6 shadow-lg md:grid-cols-4 md:p-8">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <Icon className="mb-2 h-8 w-8 text-primary" />
                <span className="font-display text-2xl font-bold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">Learning made simple in three steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border bg-card p-8 text-center shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-secondary/50 py-20">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-1 font-display text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground">Hand-picked by our team</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <Button variant="outline" size="icon" onClick={() => scroll(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => scroll(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {mockCourses.slice(0, 8).map((c) => (
              <div key={c.id} className="w-[300px] flex-shrink-0 snap-start">
                <CourseCard course={c} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                View All Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground">Explore our diverse range of subjects</p>
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
                    className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{name}</h3>
                    <span className="text-xs text-muted-foreground">{courseCount} courses</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-bold">What Our Students Say</h2>
            <p className="text-muted-foreground">Join thousands of satisfied learners</p>
          </div>
          <div className="mx-auto max-w-2xl">
            <motion.div
              key={testIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-card p-8 shadow-card text-center"
            >
              <div className="mb-4 flex justify-center">
                {[...Array(testimonials[testIdx].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="mb-6 text-lg italic text-muted-foreground">"{testimonials[testIdx].text}"</p>
              <img src={testimonials[testIdx].avatar} alt="" className="mx-auto mb-3 h-12 w-12 rounded-full" />
              <p className="font-display font-semibold">{testimonials[testIdx].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[testIdx].role}</p>
            </motion.div>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === testIdx ? "bg-primary" : "bg-muted"}`}
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
            <Mail className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 font-display text-3xl font-bold">Stay Updated</h2>
            <p className="mb-6 text-muted-foreground">Subscribe to our newsletter for the latest courses and learning tips.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
