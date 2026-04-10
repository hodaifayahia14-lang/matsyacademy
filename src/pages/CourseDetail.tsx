import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Clock, Users, BookOpen, Globe, Calendar, Play, FileText, HelpCircle, ChevronDown, ChevronUp, Check, Shield, Award, ShoppingCart, CheckCircle, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useCourseDetail } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { algerianWilayas, statusOptions } from "@/data/algerianWilayas";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

interface SectionData {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; title: string; type: string; duration_minutes: number; is_preview: boolean }[];
}

export default function CourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { course, loading } = useCourseDetail(id);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", phone: "", wilaya_code: "", baladiya: "", status_label: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (!course || course.type === "book") return;
    supabase
      .from("sections")
      .select("id, title, order, lessons(id, title, type, duration_minutes, is_preview, order)")
      .eq("course_id", course.id)
      .order("order")
      .then(({ data }) => {
        if (data) {
          const sorted = (data as any[]).map(s => ({
            ...s,
            lessons: (s.lessons || []).sort((a: any, b: any) => a.order - b.order),
          }));
          setSections(sorted);
          if (sorted[0]) setOpenSections(new Set([sorted[0].id]));
        }
      });
  }, [course]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">{lang === "ar" ? "جاري التحميل..." : "Loading..."}</div>
      </div>
    );
  }

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

  const title = course.title;
  const subtitle = course.subtitle || "";
  const description = course.description || "";
  const categoryName = getLocalized(course, "category_name", lang);
  const isBook = course.type === "book";
  const priceText = Number(course.price) > 0 ? `${Number(course.price).toLocaleString()} DZD` : (lang === "ar" ? "مجاني" : lang === "fr" ? "Gratuit" : "Free");

  const levelLabel = course.level === "beginner"
    ? (lang === "ar" ? "مبتدئ" : lang === "fr" ? "Débutant" : "Beginner")
    : course.level === "intermediate"
    ? (lang === "ar" ? "متوسط" : lang === "fr" ? "Intermédiaire" : "Intermediate")
    : (lang === "ar" ? "متقدم" : lang === "fr" ? "Avancé" : "Advanced");

  const enrollText = isBook
    ? (lang === "ar" ? "اشترِ الآن" : lang === "fr" ? "Acheter" : "Buy Now")
    : (lang === "ar" ? "سجّل الآن" : lang === "fr" ? "S'inscrire" : "Enroll Now");

  const validateOrderForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 3) errors.full_name = lang === "ar" ? "الاسم مطلوب (3 أحرف على الأقل)" : "Name required (min 3 chars)";
    if (!/^0[567]\d{8}$/.test(formData.phone)) errors.phone = lang === "ar" ? "رقم هاتف غير صحيح" : "Invalid phone (05/06/07xxxxxxxx)";
    if (!formData.wilaya_code) errors.wilaya_code = lang === "ar" ? "اختر الولاية" : "Select wilaya";
    if (!formData.status_label) errors.status_label = lang === "ar" ? "اختر الحالة" : "Select status";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async () => {
    if (!validateOrderForm() || !id) return;
    setOrderSubmitting(true);
    const wilaya = algerianWilayas.find(w => w.code === Number(formData.wilaya_code));
    const { error } = await supabase.from("orders").insert({
      course_id: id,
      full_name: formData.full_name.trim(),
      phone: formData.phone,
      wilaya_code: Number(formData.wilaya_code),
      wilaya_name: wilaya?.name || "",
      baladiya: formData.baladiya.trim(),
      status_label: formData.status_label,
      order_status: "pending",
    });
    setOrderSubmitting(false);
    if (error) {
      toast.error(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Error, please try again");
    } else {
      setOrderSuccess(true);
    }
  };

  const handleEnroll = () => {
    setShowOrderForm(true);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => { const next = new Set(prev); next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId); return next; });
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const lessonIcon = (type: string) => {
    if (type === "video") return <Play className="h-4 w-4 text-primary" />;
    if (type === "quiz") return <HelpCircle className="h-4 w-4 text-warning" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const tabs = ["overview", "curriculum", "instructor", "reviews"] as const;
  const tabLabels = { overview: t("courseDetail.overview"), curriculum: t("courseDetail.curriculum"), instructor: t("courseDetail.instructor"), reviews: t("courseDetail.reviews") };

  const learningOutcomes = course.learning_outcomes || [];
  const requirements = course.requirements || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-secondary/30">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary shrink-0">{t("navbar.home")}</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-primary shrink-0">{t("navbar.courses")}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[150px] sm:max-w-none">{title}</span>
          </div>
        </div>
      </div>

      <div className="container py-4 sm:py-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-secondary relative">
                <img src={course.cover_image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{categoryName}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{levelLabel}</span>
              </div>
              <h1 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">{title}</h1>
              <p className="mb-4 text-muted-foreground">{subtitle}</p>
              <div className="mb-6 flex items-center gap-3">
                {course.instructor_avatar && <img src={course.instructor_avatar} alt="" className="h-10 w-10 rounded-full border-2 border-primary/20" />}
                <div>
                  <span className="text-xs text-muted-foreground">{t("courseDetail.instructor")}</span>
                  <p className="text-sm font-semibold text-foreground">{course.instructor_name}</p>
                </div>
              </div>
            </motion.div>

            <div className="mb-6 flex gap-1 rounded-lg bg-secondary p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-fit whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {learningOutcomes.length > 0 && (
                  <div className="rounded-xl border bg-primary/5 p-6">
                    <h2 className="mb-4 font-display text-xl font-bold text-foreground">{t("courseDetail.whatYoullLearn")}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {learningOutcomes.map((o: string, i: number) => (
                        <div key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span className="text-sm">{o}</span></div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="mb-4 font-display text-xl font-bold">{t("courseDetail.description")}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                {requirements.length > 0 && (
                  <div>
                    <h2 className="mb-4 font-display text-xl font-bold">{t("courseDetail.requirements")}</h2>
                    <ul className="space-y-2">
                      {requirements.map((r: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {isBook ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {lang === "ar" ? `هذا كتاب يحتوي على ${course.page_count || ""} صفحة` : `This is a book with ${course.page_count || ""} pages`}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {sections.length} {t("courseDetail.sections")} • {totalLessons} {t("courseDetail.totalLessons")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <div key={section.id} className="overflow-hidden rounded-lg border">
                          <button onClick={() => toggleSection(section.id)} className="flex w-full items-center justify-between bg-secondary/50 px-4 py-3.5 text-start hover:bg-secondary transition-colors">
                            <span className="text-sm font-semibold">{section.title}</span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{section.lessons.length} {t("catalog.lessons")}</span>
                              {openSections.has(section.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </button>
                          {openSections.has(section.id) && (
                            <div className="divide-y">
                              {section.lessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
                                  <div className="flex items-center gap-3">
                                    {lessonIcon(lesson.type)}
                                    <span className="text-sm">{lesson.title}</span>
                                    {lesson.is_preview && <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">{t("courseDetail.preview")}</span>}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{lesson.duration_minutes}m</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === "instructor" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center gap-4 rounded-xl border p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
                  {course.instructor_avatar && <img src={course.instructor_avatar} alt="" className="h-20 w-20 rounded-full border-2 border-primary/20 sm:h-24 sm:w-24" />}
                  <div className="flex-1 text-center sm:text-start">
                    <h3 className="mb-1 font-display text-lg font-bold sm:text-xl">{course.instructor_name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{t("courseDetail.expertInstructor")}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="py-8 text-center text-muted-foreground">
                  {lang === "ar" ? "لا توجد مراجعات حالياً" : "No reviews yet"}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {/* Price header */}
                <div className="bg-primary/5 px-4 py-5 text-center sm:px-6">
                  <p className="font-display text-3xl font-bold text-primary">{priceText}</p>
                </div>

                <div className="p-4 sm:p-6">
                  <AnimatePresence mode="wait">
                    {orderSuccess ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center space-y-3">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-display text-lg font-bold">
                          {lang === "ar" ? "تم إرسال طلبك!" : "Order Submitted!"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {lang === "ar" ? "سيتم التواصل معك قريباً" : "We'll contact you soon"}
                        </p>
                      </motion.div>
                    ) : showOrderForm ? (
                      <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <h3 className="font-display text-base font-bold text-center mb-1">
                          {lang === "ar" ? "أكمل طلبك" : lang === "fr" ? "Complétez votre commande" : "Complete Your Order"}
                        </h3>
                        <div>
                          <div className="relative">
                            <User className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                              className="ps-10"
                              value={formData.full_name}
                              onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                            />
                          </div>
                          {formErrors.full_name && <p className="text-xs text-destructive mt-1">{formErrors.full_name}</p>}
                        </div>
                        <div>
                          <div className="relative">
                            <Phone className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="05xxxxxxxx"
                              dir="ltr"
                              className="ps-10"
                              value={formData.phone}
                              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            />
                          </div>
                          {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                        </div>
                        <div>
                          <Select onValueChange={val => setFormData(p => ({ ...p, wilaya_code: val }))} value={formData.wilaya_code}>
                            <SelectTrigger>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder={lang === "ar" ? "اختر الولاية" : "Select Wilaya"} />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {algerianWilayas.map(w => (
                                <SelectItem key={w.code} value={String(w.code)}>
                                  {String(w.code).padStart(2, "0")} - {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.wilaya_code && <p className="text-xs text-destructive mt-1">{formErrors.wilaya_code}</p>}
                        </div>
                        <div>
                          <div className="relative">
                            <MapPin className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={lang === "ar" ? "البلدية" : lang === "fr" ? "Commune" : "Municipality"}
                              className="ps-10"
                              value={formData.baladiya}
                              onChange={e => setFormData(p => ({ ...p, baladiya: e.target.value }))}
                            />
                          </div>
                          {formErrors.baladiya && <p className="text-xs text-destructive mt-1">{formErrors.baladiya}</p>}
                        </div>
                        <div>
                          <Select onValueChange={val => setFormData(p => ({ ...p, status_label: val }))} value={formData.status_label}>
                            <SelectTrigger>
                              <SelectValue placeholder={lang === "ar" ? "الحالة المهنية" : "Professional Status"} />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(s => (
                                <SelectItem key={s.value} value={s.value}>
                                  {lang === "ar" ? s.labelAr : lang === "fr" ? s.labelFr : s.labelEn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.status_label && <p className="text-xs text-destructive mt-1">{formErrors.status_label}</p>}
                        </div>
                        <Button className="w-full gap-2" size="lg" onClick={handleOrderSubmit} disabled={orderSubmitting}>
                          {orderSubmitting
                            ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...")
                            : (lang === "ar" ? "تأكيد الطلب" : lang === "fr" ? "Confirmer la commande" : "Confirm Order")}
                        </Button>
                        <button onClick={() => setShowOrderForm(false)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                          {lang === "ar" ? "رجوع" : "Back"}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <Button className="w-full gap-2" size="lg" onClick={handleEnroll}>
                          {enrollText}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">{t("courseDetail.moneyBack")}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Course info */}
                  <div className="space-y-3 border-t pt-4 mt-4">
                    {[
                      ...(isBook && course.page_count ? [{ icon: BookOpen, label: `${course.page_count} ${lang === "ar" ? "صفحة" : "pages"}` }] : []),
                      ...(!isBook ? [{ icon: BookOpen, label: `${totalLessons} ${t("catalog.lessons")}` }] : []),
                      { icon: Globe, label: course.language },
                      { icon: Shield, label: t("courseDetail.certificate") },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 text-primary" />{label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  {course.instructor_avatar && <img src={course.instructor_avatar} alt="" className="h-12 w-12 rounded-full" />}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{course.instructor_name}</p>
                    <p className="text-xs text-muted-foreground">{t("courseDetail.expertInstructor")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
