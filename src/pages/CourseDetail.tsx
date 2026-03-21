import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Clock, Users, BookOpen, Globe, Calendar, Play, FileText, HelpCircle, ChevronDown, ChevronUp, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { mockCourses, mockReviews } from "@/data/mockData";
import { motion } from "framer-motion";

export default function CourseDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const course = mockCourses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set([course?.sections[0]?.id || ""]));

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-display text-2xl font-bold">{t("courseDetail.courseNotFound")}</h2>
          <Link to="/courses"><Button>{t("hero.browseCourses")}</Button></Link>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => { const next = new Set(prev); next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId); return next; });
  };

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const lessonIcon = (type: string) => {
    if (type === "video") return <Play className="h-4 w-4 text-primary" />;
    if (type === "quiz") return <HelpCircle className="h-4 w-4 text-warning" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const tabs = ["overview", "curriculum", "instructor", "reviews"] as const;
  const tabLabels = { overview: t("courseDetail.overview"), curriculum: t("courseDetail.curriculum"), instructor: t("courseDetail.instructor"), reviews: t("courseDetail.reviews") };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary">
        <div className="container py-10">
          <div className="mb-3 flex items-center gap-2 text-sm text-primary-foreground/60">
            <Link to="/courses" className="hover:text-primary-foreground">{t("navbar.courses")}</Link>
            <span>/</span><span>{course.category}</span>
          </div>
          <h1 className="mb-3 max-w-3xl font-display text-3xl font-bold text-primary-foreground lg:text-4xl">{course.title}</h1>
          <p className="mb-4 max-w-2xl text-primary-foreground/80">{course.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /><span className="font-semibold text-primary-foreground">{course.rating.toFixed(1)}</span><span>({course.reviewCount})</span></div>
            <div className="flex items-center gap-1"><Users className="h-4 w-4" />{course.studentCount} {t("stats.students").toLowerCase()}</div>
            <div className="flex items-center gap-1"><Globe className="h-4 w-4" />{course.language}</div>
            <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{t("courseDetail.updated")} {course.updatedAt}</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <img src={course.instructorAvatar} alt="" className="h-10 w-10 rounded-full border-2 border-primary-foreground/30" />
            <div><span className="text-sm text-primary-foreground/60">{t("courseDetail.instructor")}</span><p className="font-semibold text-primary-foreground">{course.instructor}</p></div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex gap-1 rounded-lg bg-secondary p-1">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <h2 className="mb-4 font-display text-xl font-bold">{t("courseDetail.whatYoullLearn")}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.learningOutcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span className="text-sm">{o}</span></div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="mb-4 font-display text-xl font-bold">{t("courseDetail.description")}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
                </div>
                <div>
                  <h2 className="mb-4 font-display text-xl font-bold">{t("courseDetail.requirements")}</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{r}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="mb-4 text-sm text-muted-foreground">
                  {course.sections.length} {t("courseDetail.sections")} • {totalLessons} {t("courseDetail.totalLessons")} • {course.duration} {t("courseDetail.total")}
                </p>
                <div className="space-y-2">
                  {course.sections.map((section) => (
                    <div key={section.id} className="overflow-hidden rounded-lg border">
                      <button onClick={() => toggleSection(section.id)} className="flex w-full items-center justify-between bg-secondary/50 px-4 py-3 text-start">
                        <span className="text-sm font-semibold">{section.title}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{section.lessons.length} {t("catalog.lessons")}</span>
                          {openSections.has(section.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </button>
                      {openSections.has(section.id) && (
                        <div className="divide-y">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-3">
                                {lessonIcon(lesson.type)}
                                <span className="text-sm">{lesson.title}</span>
                                {lesson.isPreview && <span className="rounded bg-secondary px-2 py-0.5 text-xs">{t("courseDetail.preview")}</span>}
                              </div>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "instructor" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start gap-4 rounded-xl border p-6">
                  <img src={course.instructorAvatar} alt="" className="h-20 w-20 rounded-full" />
                  <div>
                    <h3 className="mb-1 font-display text-lg font-bold">{course.instructor}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">{t("courseDetail.expertInstructor")}</p>
                    <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning" /> 4.8 {t("courseDetail.rating")}</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" /> 12,450 {t("stats.students")}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> 8 {t("stats.courses")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">A passionate educator with over 10 years of experience.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 rounded-xl border p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-display text-4xl font-bold">{course.rating.toFixed(1)}</p>
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{course.reviewCount} {t("courseDetail.reviews").toLowerCase()}</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((s) => {
                        const pct = s === 5 ? 65 : s === 4 ? 22 : s === 3 ? 8 : s === 2 ? 3 : 2;
                        return (
                          <div key={s} className="flex items-center gap-2">
                            <span className="w-3 text-xs">{s}</span><Star className="h-3 w-3 fill-warning text-warning" />
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-warning" style={{ width: `${pct}%` }} /></div>
                            <span className="w-8 text-end text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <img src={r.avatar} alt="" className="h-8 w-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold">{r.user}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-warning text-warning" />)}
                            <span className="ms-2 text-xs text-muted-foreground">{r.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-secondary">
                <img src={course.coverImage} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="mb-4 font-display text-3xl font-bold">
                {course.isFree ? t("catalog.free") : `$${course.price.toFixed(0)}`}
              </p>
              <Button className="mb-3 w-full" size="lg">
                {course.isFree ? t("courseDetail.enrollFree") : t("courseDetail.enrollNow")}
              </Button>
              <p className="mb-4 text-center text-xs text-muted-foreground">{t("courseDetail.moneyBack")}</p>
              <div className="space-y-3 border-t pt-4">
                {[
                  { icon: Clock, label: course.duration + " " + t("courseDetail.ofContent") },
                  { icon: BookOpen, label: `${totalLessons} ${t("catalog.lessons")}` },
                  { icon: Globe, label: course.language },
                  { icon: Shield, label: t("courseDetail.certificate") },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />{label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
