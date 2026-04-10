import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Clock, Users, BookOpen, Globe, Play, FileText, HelpCircle, ChevronDown, ChevronUp, Check, Shield, Award, ShoppingCart, CheckCircle, User, Phone, MapPin, Share2, Info, X } from "lucide-react";
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

/* ═══════ ORDER MODAL ═══════ */
function OrderModal({
  open, onClose, course, courseId, lang,
}: {
  open: boolean; onClose: () => void;
  course: { title: string; price: number; cover_image: string | null };
  courseId: string; lang: "ar" | "fr" | "en";
}) {
  const [formData, setFormData] = useState({ full_name: "", phone: "", wilaya_code: "", baladiya: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 3)
      errors.full_name = lang === "ar" ? "الاسم مطلوب (3 أحرف على الأقل)" : "Name required (min 3 chars)";
    if (!/^0[567]\d{8}$/.test(formData.phone))
      errors.phone = lang === "ar" ? "رقم هاتف غير صحيح" : "Invalid phone";
    if (!formData.wilaya_code)
      errors.wilaya_code = lang === "ar" ? "اختر الولاية" : "Select wilaya";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const wilaya = algerianWilayas.find(w => w.code === Number(formData.wilaya_code));
    const { error } = await supabase.from("orders").insert({
      course_id: courseId,
      full_name: formData.full_name.trim(),
      phone: formData.phone,
      wilaya_code: Number(formData.wilaya_code),
      wilaya_name: wilaya?.name || "",
      baladiya: formData.baladiya.trim(),
      status_label: "student",
      order_status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(lang === "ar" ? "حدث خطأ، حاول مجدداً" : "Error, please try again");
    } else {
      setSuccess(true);
    }
  };

  if (!open) return null;

  const priceText = Number(course.price) > 0 ? `${Number(course.price).toLocaleString()} DZD` : (lang === "ar" ? "مجاني" : "Free");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <AnimatePresence mode="wait">
          {success ? (
            /* ═══════ SUCCESS CARD ═══════ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-1"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
              }}
            >
              <div className="rounded-xl bg-card px-6 py-10 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-9 w-9 text-green-500" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    {lang === "ar" ? "تم إرسال طلبك بنجاح!" : lang === "fr" ? "Commande envoyée avec succès !" : "Order submitted successfully!"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {lang === "ar" ? "سيتصل بك فريقنا قريباً." : lang === "fr" ? "Notre équipe vous contactera bientôt." : "Our team will contact you soon."}
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  className="w-full gradient-gold text-accent-foreground font-bold rounded-full"
                  size="lg"
                >
                  {lang === "ar" ? "العودة إلى الدورة" : lang === "fr" ? "Retour au cours" : "Back to Course"}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* ═══════ ORDER FORM ═══════ */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-card shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 end-3 z-20 rounded-full p-1.5 hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Course info header */}
              <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-border">
                {course.cover_image && (
                  <img src={course.cover_image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0 text-end">
                  <p className="font-display font-bold text-sm text-foreground truncate">{course.title}</p>
                  <p className="text-accent font-bold text-sm mt-0.5">{priceText}</p>
                </div>
              </div>

              {/* Form fields */}
              <div className="px-6 py-5 space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground text-end">
                    {lang === "ar" ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <Input
                    placeholder={lang === "ar" ? "محمد أحمد" : "John Doe"}
                    className="rounded-lg border-border/60 text-end"
                    value={formData.full_name}
                    onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  />
                  {formErrors.full_name && <p className="text-xs text-destructive text-end">{formErrors.full_name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground text-end">
                    {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <Input
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="rounded-lg border-border/60"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  />
                  {formErrors.phone && <p className="text-xs text-destructive text-end">{formErrors.phone}</p>}
                </div>

                {/* Wilaya */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground text-end">
                    {lang === "ar" ? "الولاية" : "Wilaya"}
                  </label>
                  <Select onValueChange={val => setFormData(p => ({ ...p, wilaya_code: val }))} value={formData.wilaya_code}>
                    <SelectTrigger className="rounded-lg border-border/60">
                      <SelectValue placeholder={lang === "ar" ? "الجزائر" : "Select Wilaya"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {algerianWilayas.map(w => (
                        <SelectItem key={w.code} value={String(w.code)}>
                          {String(w.code).padStart(2, "0")} - {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.wilaya_code && <p className="text-xs text-destructive text-end">{formErrors.wilaya_code}</p>}
                </div>

                {/* Baladiya */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-foreground text-end">
                    {lang === "ar" ? "البلدية" : "Municipality"}
                  </label>
                  <Select onValueChange={val => setFormData(p => ({ ...p, baladiya: val }))} value={formData.baladiya}>
                    <SelectTrigger className="rounded-lg border-border/60 border-primary">
                      <SelectValue placeholder={lang === "ar" ? "سيدي امحمد" : "Select municipality"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="سيدي امحمد">سيدي امحمد</SelectItem>
                      <SelectItem value="باب الوادي">باب الوادي</SelectItem>
                      <SelectItem value="حسين داي">حسين داي</SelectItem>
                      <SelectItem value="القبة">القبة</SelectItem>
                      <SelectItem value="أخرى">{lang === "ar" ? "أخرى" : "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit button - gradient gold to purple */}
                <Button
                  className="w-full font-bold text-sm rounded-full text-white"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)))",
                  }}
                >
                  {submitting
                    ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...")
                    : (lang === "ar" ? "تأكيد الطلب / Confirmer la commande" : "Confirm Order / Confirmer la commande")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function CourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { course, loading } = useCourseDetail(id);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [activeTab, setActiveTab] = useState<"curriculum" | "overview" | "instructor">("curriculum");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showOrderModal, setShowOrderModal] = useState(false);

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
  const price = Number(course.price);
  const oldPrice = Math.round(price / 0.75);
  const discountPercent = 25;
  const priceText = price > 0 ? `${price.toLocaleString()}` : (lang === "ar" ? "مجاني" : lang === "fr" ? "Gratuit" : "Free");

  const enrollText = isBook
    ? (lang === "ar" ? "اشترِ الآن" : lang === "fr" ? "Acheter" : "Buy Now")
    : (lang === "ar" ? "اشترِ الآن" : lang === "fr" ? "S'inscrire" : "Buy Now");

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => { const next = new Set(prev); next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId); return next; });
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const tabs = ["curriculum", "overview", "instructor"] as const;
  const tabLabels: Record<string, string> = {
    curriculum: lang === "ar" ? "المقرر الدراسي" : lang === "fr" ? "Programme" : "Curriculum",
    overview: lang === "ar" ? "نظرة عامة" : lang === "fr" ? "Aperçu" : "Overview",
    instructor: lang === "ar" ? "المدرس" : lang === "fr" ? "Formateur" : "Instructor",
  };

  const learningOutcomes = course.learning_outcomes || [];
  const requirements = course.requirements || [];

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════ ORDER MODAL ═══════ */}
      <AnimatePresence>
        {showOrderModal && (
          <OrderModal
            open={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            course={{ title, price, cover_image: course.cover_image }}
            courseId={id!}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* ═══════ HERO ═══════ */}
      <section className="gradient-purple">
        <div className="container py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Text side */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="mb-5 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                {title}
              </h1>
              {subtitle && <p className="mb-5 text-white/70 text-sm leading-relaxed">{subtitle}</p>}

              {/* Rating */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-accent text-accent" : "fill-accent/40 text-accent/40"}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">4.8 / 5</span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-3">
                {course.instructor_avatar && (
                  <img src={course.instructor_avatar} alt="" className="h-8 w-8 rounded-full border-2 border-white/30" />
                )}
                <span className="text-sm text-white/80">
                  {lang === "ar" ? "م." : ""} {course.instructor_name}
                </span>
              </div>

              {/* Language badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                <Globe className="h-3.5 w-3.5" />
                {course.language === "ar" ? (lang === "ar" ? "العربية" : "Arabic") : course.language}
              </div>
            </motion.div>

            {/* Video/Image preview */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-2xl aspect-video bg-foreground/10">
              <img src={course.cover_image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 text-primary ms-1" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ CONTENT ═══════ */}
      <div className="container py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 flex gap-1 border-b border-border">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {isBook ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {lang === "ar" ? `هذا كتاب يحتوي على ${course.page_count || ""} صفحة` : `This is a book with ${course.page_count || ""} pages`}
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="font-display text-lg font-bold text-foreground mb-1">
                        {lang === "ar" ? "المقرر الدراسي" : "Curriculum"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lang === "ar" ? "مقدمة في تصميم تجربة المستخدم" : subtitle || description?.slice(0, 60)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {sections.map((section, idx) => (
                        <div key={section.id} className="overflow-hidden rounded-lg border border-border">
                          <button onClick={() => toggleSection(section.id)}
                            className={`flex w-full items-center justify-between px-4 py-3.5 text-start transition-colors ${
                              openSections.has(section.id) ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary/50"
                            }`}>
                            <span className="text-sm font-semibold">{section.title}</span>
                            {openSections.has(section.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <AnimatePresence>
                            {openSections.has(section.id) && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="divide-y divide-border">
                                  {section.lessons.map((lesson, li) => (
                                    <div key={lesson.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <CheckCircle className="h-4 w-4 text-primary/40" />
                                        <span className="text-sm font-medium">{idx + 1}.{li + 1} {lesson.title}</span>
                                        {lesson.is_preview && (
                                          <span className="ms-2 rounded bg-primary/10 text-primary px-2 py-0.5 text-xs">{t("courseDetail.preview")}</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{Math.floor(lesson.duration_minutes / 60)}h {lesson.duration_minutes % 60}m</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Overview Tab */}
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

            {/* Instructor Tab */}
            {activeTab === "instructor" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center gap-4 rounded-xl border p-6 sm:flex-row sm:items-start sm:gap-6">
                  {course.instructor_avatar && <img src={course.instructor_avatar} alt="" className="h-20 w-20 rounded-full border-2 border-primary/20 sm:h-24 sm:w-24" />}
                  <div className="flex-1 text-center sm:text-start">
                    <h3 className="mb-1 font-display text-lg font-bold sm:text-xl">{course.instructor_name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{t("courseDetail.expertInstructor")}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ═══════ PRICE SIDEBAR ═══════ */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {/* Price header */}
                <div className="bg-purple-light px-5 py-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-display text-3xl font-bold text-primary">
                      {price > 0 ? `${lang === "ar" ? "د.ج" : "DZD"} ${priceText}` : priceText}
                    </span>
                  </div>
                  {price > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lang === "ar" ? `خصم ${discountPercent}% (كان د.ج ${oldPrice.toLocaleString()})` : `${discountPercent}% off (was ${oldPrice.toLocaleString()} DZD)`}
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Features list */}
                  <ul className="space-y-3">
                    {[
                      lang === "ar" ? "دخول مدى الحياة" : "Lifetime access",
                      lang === "ar" ? "شهادة إتمام" : "Completion certificate",
                      lang === "ar" ? "وصول عبر الهاتف" : "Mobile access",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA - opens modal */}
                  <Button
                    className="w-full gradient-gold text-accent-foreground font-bold text-base"
                    size="lg"
                    onClick={() => setShowOrderModal(true)}
                  >
                    {enrollText}
                  </Button>

                  {/* Add to cart + Share row */}
                  <div className="flex items-center justify-center gap-6 pt-1">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ShoppingCart className="h-4 w-4" />
                      {lang === "ar" ? "إضافة للسلة" : "Add to cart"}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      {lang === "ar" ? "مشاركة" : "Share"}
                    </button>
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