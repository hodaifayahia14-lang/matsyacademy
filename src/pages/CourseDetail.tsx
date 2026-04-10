import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Star, Clock, Users, BookOpen, Globe, Play, FileText, HelpCircle,
  ChevronDown, ChevronUp, Check, Shield, Award, ShoppingCart, CheckCircle,
  User, Phone, MapPin, Share2, X, Heart, Facebook, Copy, MessageCircle,
  Monitor, Smartphone, Infinity, Trophy, Video, ArrowRight, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useRef } from "react";
import { useCourseDetail, useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { algerianWilayas, statusOptions } from "@/data/algerianWilayas";
import CourseCard from "@/components/CourseCard";

function getLocalized(obj: any, field: string, lang: string): string {
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[field] || "";
}

interface SectionData {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; title: string; type: string; duration_minutes: number; is_preview: boolean }[];
}

/* ═══════════════════════════════════════════════════════════════
   TRANSLATIONS HELPER
   ═══════════════════════════════════════════════════════════════ */
const T = (lang: string, ar: string, fr: string, en: string) =>
  lang === "ar" ? ar : lang === "fr" ? fr : en;

/* ═══════════════════════════════════════════════════════════════
   ORDER MODAL — 2-Step
   ═══════════════════════════════════════════════════════════════ */
function OrderModal({
  open, onClose, course, courseId, lang,
}: {
  open: boolean; onClose: () => void;
  course: { title: string; price: number; cover_image: string | null };
  courseId: string; lang: "ar" | "fr" | "en";
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ full_name: "", phone: "", wilaya_code: "", baladiya: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const phoneValid = /^0[567]\d{8}$/.test(formData.phone);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 3)
      errors.full_name = T(lang, "الاسم مطلوب (3 أحرف على الأقل)", "Nom requis (min 3 car.)", "Name required (min 3 chars)");
    if (!phoneValid)
      errors.phone = T(lang, "رقم هاتف غير صحيح", "Numéro invalide", "Invalid phone");
    if (!formData.wilaya_code)
      errors.wilaya_code = T(lang, "اختر الولاية", "Sélectionnez la wilaya", "Select wilaya");
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(2); };

  const handleSubmit = async () => {
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
      toast.error(T(lang, "حدث خطأ، حاول مجدداً", "Erreur, réessayez", "Error, please try again"));
    } else {
      setSuccess(true);
    }
  };

  if (!open) return null;

  const priceText = Number(course.price) > 0 ? `${Number(course.price).toLocaleString()} DZD` : T(lang, "مجاني", "Gratuit", "Free");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-0">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-card shadow-2xl md:mx-auto"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="px-8 py-12 text-center space-y-6">
              {/* Animated checkmark */}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </motion.div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  🎉 {T(lang, "تم إرسال طلبك بنجاح!", "Commande envoyée !", "Order placed!")}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {T(lang, "سيتصل بك فريقنا قريباً.", "Notre équipe vous contactera bientôt.", "Our team will contact you shortly.")}
                </p>
              </div>
              <Button onClick={onClose} className="w-full gradient-gold text-accent-foreground font-bold rounded-xl" size="lg">
                {T(lang, "إغلاق", "Fermer", "Close")}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Close button */}
              <button onClick={onClose} className="absolute top-4 end-4 z-20 rounded-full p-2 hover:bg-secondary transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-border">
                {course.cover_image && (
                  <img src={course.cover_image} alt="" className="h-[60px] w-[60px] rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm text-foreground truncate">{course.title}</p>
                  <p className="text-accent font-bold text-sm mt-0.5">{priceText}</p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 px-6 pt-4">
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>1</div>
                  {T(lang, "معلوماتك", "Vos infos", "Your Info")}
                </div>
                <div className="flex-1 h-0.5 bg-border rounded"><div className={`h-full rounded transition-all ${step >= 2 ? "w-full bg-primary" : "w-0"}`} /></div>
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</div>
                  {T(lang, "تأكيد", "Confirmer", "Confirm")}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="px-6 py-5 space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {T(lang, "الاسم الكامل", "Nom complet", "Full Name")}
                      </label>
                      <Input placeholder={T(lang, "محمد أحمد", "Votre nom", "John Doe")}
                        className="rounded-xl border-border/60 h-12"
                        value={formData.full_name}
                        onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))} />
                      {formErrors.full_name && <p className="text-xs text-destructive">{formErrors.full_name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {T(lang, "رقم الهاتف", "Numéro de téléphone", "Phone")}
                      </label>
                      <div className="relative">
                        <Input placeholder="05XXXXXXXX" dir="ltr" className="rounded-xl border-border/60 h-12 pe-10"
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                        {formData.phone.length > 3 && (
                          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm">
                            {phoneValid ? "✅" : "❌"}
                          </span>
                        )}
                      </div>
                      {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
                    </div>

                    {/* Wilaya */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {T(lang, "الولاية", "Wilaya", "Wilaya")}
                      </label>
                      <Select onValueChange={val => setFormData(p => ({ ...p, wilaya_code: val, baladiya: "" }))} value={formData.wilaya_code}>
                        <SelectTrigger className="rounded-xl border-border/60 h-12">
                          <SelectValue placeholder={T(lang, "اختر الولاية", "Choisir la wilaya", "Select Wilaya")} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 z-[200]" position="popper" sideOffset={4}>
                          {algerianWilayas.map(w => (
                            <SelectItem key={w.code} value={String(w.code)}>
                              {String(w.code).padStart(2, "0")} - {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.wilaya_code && <p className="text-xs text-destructive">{formErrors.wilaya_code}</p>}
                    </div>

                    {/* Baladiya */}
                    <AnimatePresence>
                      {formData.wilaya_code && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="space-y-1.5 overflow-hidden">
                          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {T(lang, "البلدية", "Commune", "Municipality")}
                          </label>
                          <Input placeholder={T(lang, "اسم البلدية", "Nom de la commune", "Municipality name")}
                            className="rounded-xl border-border/60 h-12"
                            value={formData.baladiya}
                            onChange={e => setFormData(p => ({ ...p, baladiya: e.target.value }))} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button onClick={handleNext} size="lg"
                      className="w-full font-bold text-sm rounded-xl h-14 text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                      {T(lang, "التالي", "Suivant", "Next")} →
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="px-6 py-5 space-y-4">
                    {/* Summary card */}
                    <div className="rounded-xl bg-secondary/50 p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{T(lang, "الاسم", "Nom", "Name")}</span><span className="font-semibold">{formData.full_name}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{T(lang, "الهاتف", "Tél", "Phone")}</span><span className="font-semibold" dir="ltr">{formData.phone}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{T(lang, "الولاية", "Wilaya", "Wilaya")}</span><span className="font-semibold">{algerianWilayas.find(w => w.code === Number(formData.wilaya_code))?.name}</span></div>
                      {formData.baladiya && <div className="flex justify-between"><span className="text-muted-foreground">{T(lang, "البلدية", "Commune", "Municipality")}</span><span className="font-semibold">{formData.baladiya}</span></div>}
                    </div>

                    {/* Course summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                      {course.cover_image && <img src={course.cover_image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{course.title}</p>
                        <p className="text-xs font-bold text-accent">{priceText}</p>
                      </div>
                    </div>

                    <Button onClick={handleSubmit} disabled={submitting} size="lg"
                      className="w-full font-bold text-sm rounded-xl h-14 text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                      {submitting
                        ? T(lang, "جاري الإرسال...", "Envoi en cours...", "Submitting...")
                        : T(lang, "تأكيد الطلب ✅", "Confirmer ✅", "Confirm Order ✅")}
                    </Button>

                    <button onClick={() => setStep(1)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                      ← {T(lang, "رجوع", "Retour", "Back")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════════════════════════ */
function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #5B2D8E, #0D0D1A)" }}>
        <div className="container py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
              <Skeleton className="h-10 w-3/4 bg-white/10" />
              <Skeleton className="h-5 w-full bg-white/10" />
              <Skeleton className="h-5 w-2/3 bg-white/10" />
              <div className="flex gap-4"><Skeleton className="h-8 w-20 bg-white/10" /><Skeleton className="h-8 w-20 bg-white/10" /><Skeleton className="h-8 w-20 bg-white/10" /></div>
            </div>
            <div className="lg:col-span-2"><Skeleton className="h-80 w-full bg-white/10 rounded-2xl" /></div>
          </div>
        </div>
      </div>
      <div className="container py-8"><Skeleton className="h-96 w-full rounded-xl" /></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const lang = i18n.language as "en" | "fr" | "ar";
  const { course, loading } = useCourseDetail(id);
  const { courses: allCourses } = useCourses();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

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

  if (loading) return <CourseDetailSkeleton />;

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold">{T(lang, "الدورة غير موجودة", "Cours introuvable", "Course not found")}</h2>
          <Link to="/courses"><Button>{T(lang, "تصفح الدورات", "Parcourir les cours", "Browse Courses")}</Button></Link>
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
  const priceText = price > 0 ? `${price.toLocaleString()} DZD` : T(lang, "مجاني", "Gratuit", "Free");

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => { const n = new Set(prev); n.has(sectionId) ? n.delete(sectionId) : n.add(sectionId); return n; });
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMinutes = sections.reduce((acc, s) => acc + s.lessons.reduce((a, l) => a + l.duration_minutes, 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);

  const tabs = ["overview", "curriculum", "instructor", "reviews"] as const;
  const tabConfig: Record<string, { label: string; icon: React.ReactNode }> = {
    overview: { label: T(lang, "نظرة عامة", "Aperçu", "Overview"), icon: <Star className="h-4 w-4" /> },
    curriculum: { label: T(lang, "المقرر الدراسي", "Programme", "Curriculum"), icon: <BookOpen className="h-4 w-4" /> },
    instructor: { label: T(lang, "المدرب", "Formateur", "Instructor"), icon: <Users className="h-4 w-4" /> },
    reviews: { label: T(lang, "التقييمات", "Avis", "Reviews"), icon: <Shield className="h-4 w-4" /> },
  };

  const learningOutcomes = course.learning_outcomes || [];
  const requirements = course.requirements || [];

  // Related courses
  const relatedCourses = allCourses
    .filter(c => c.id !== course.id && c.category_id === course.category_id)
    .slice(0, 4);

  const lessonTypeIcon = (type: string) => {
    if (type === "video") return <Video className="h-4 w-4 text-primary" />;
    if (type === "quiz") return <HelpCircle className="h-4 w-4 text-accent" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = title;
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    else if (platform === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    else { navigator.clipboard.writeText(url); toast.success(T(lang, "تم نسخ الرابط", "Lien copié", "Link copied")); }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════ ORDER MODAL ═══════ */}
      <AnimatePresence>
        {showOrderModal && (
          <OrderModal open={showOrderModal} onClose={() => setShowOrderModal(false)}
            course={{ title, price, cover_image: course.cover_image }}
            courseId={id!} lang={lang} />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Blurred background image */}
        {course.cover_image && (
          <div className="absolute inset-0 z-0">
            <img src={course.cover_image} alt="" className="h-full w-full object-cover scale-110 blur-2xl opacity-30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(135deg, #5B2D8E 0%, #3A1D6E 40%, #0D0D1A 100%)" }} />

        <div className="container relative z-10 py-10 lg:py-16">
          <div className="max-w-3xl">
            {/* Left: course info */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="space-y-5">
              {/* Category badge */}
              {categoryName && (
                <span className="inline-block rounded-full px-4 py-1.5 text-xs font-bold"
                  style={{ background: "#F5A623", color: "#1a1a1a" }}>
                  {categoryName}
                </span>
              )}

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight text-primary-foreground">
                {title}
              </h1>

              {/* Short description */}
              {subtitle && (
                <p className="text-base lg:text-lg leading-relaxed text-primary-foreground/70 line-clamp-2">
                  {subtitle}
                </p>
              )}

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" /> <span className="font-bold text-primary-foreground">4.8</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> 0 {T(lang, "طالب", "étudiants", "students")}
                </span>
                {totalHours > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {totalHours}h {totalMinutes % 60}m
                  </span>
                )}
                <span className="flex items-center gap-1.5 capitalize">
                  <Shield className="h-4 w-4" /> {course.level}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-0.5 text-xs">
                  <Globe className="h-3.5 w-3.5" />
                  {course.language === "ar" ? T(lang, "العربية", "Arabe", "Arabic") : course.language}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                {course.instructor_avatar ? (
                  <img src={course.instructor_avatar} alt="" className="h-10 w-10 rounded-full border-2 border-primary-foreground/30 object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground/60" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">{course.instructor_name}</p>
                  <p className="text-xs text-primary-foreground/60">{T(lang, "مدرب معتمد", "Formateur certifié", "Certified Instructor")}</p>
                </div>
              </div>

              {/* Last updated */}
              <p className="text-xs text-primary-foreground/40">
                {T(lang, "آخر تحديث:", "Dernière mise à jour:", "Last updated:")} {new Date(course.updated_at).toLocaleDateString()}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — TABS + CONTENT
          ═══════════════════════════════════════════════════════ */}
      <div className="container py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Tab bar with icons */}
            <div className="relative mb-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 flex flex-col items-center gap-1.5 px-4 py-4 text-sm font-semibold transition-colors ${
                      activeTab === tab ? "text-accent" : "text-muted-foreground hover:text-foreground"
                    }`}>
                    <span className={activeTab === tab ? "text-accent" : "text-muted-foreground"}>{tabConfig[tab].icon}</span>
                    <span className="hidden sm:inline">{tabConfig[tab].label}</span>
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 start-0 end-0 h-[3px] rounded-full"
                        style={{ background: "hsl(var(--accent))" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* ─── OVERVIEW TAB ─── */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="space-y-8">
                  {/* What you'll learn */}
                  {learningOutcomes.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <h2 className="mb-5 font-display text-xl font-bold text-foreground">
                        {T(lang, "ماذا ستتعلم", "Ce que vous apprendrez", "What you'll learn")}
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {learningOutcomes.map((o: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#F5A623" }} />
                            <span className="text-sm text-foreground">{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {requirements.length > 0 && (
                    <div>
                      <h2 className="mb-4 font-display text-xl font-bold text-foreground">
                        {T(lang, "المتطلبات", "Prérequis", "Requirements")}
                      </h2>
                      <ul className="space-y-2.5">
                        {requirements.map((r: string, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 text-primary shrink-0" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Description */}
                  {description && (
                    <div>
                      <h2 className="mb-4 font-display text-xl font-bold text-foreground">
                        {T(lang, "وصف الدورة", "Description du cours", "Course Description")}
                      </h2>
                      <div className="relative">
                        <p className={`text-sm leading-relaxed text-muted-foreground ${!showFullDesc ? "line-clamp-4" : ""}`}>
                          {description}
                        </p>
                        {description.length > 300 && (
                          <button onClick={() => setShowFullDesc(!showFullDesc)}
                            className="mt-2 text-sm font-semibold text-primary hover:underline">
                            {showFullDesc ? T(lang, "عرض أقل", "Voir moins", "Show less") : T(lang, "عرض المزيد", "Voir plus", "Show more")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── CURRICULUM TAB ─── */}
              {activeTab === "curriculum" && (
                <motion.div key="curriculum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {isBook ? (
                    <div className="py-12 text-center text-muted-foreground">
                      {T(lang, `هذا كتاب يحتوي على ${course.page_count || ""} صفحة`, `Ce livre contient ${course.page_count || ""} pages`, `This book contains ${course.page_count || ""} pages`)}
                    </div>
                  ) : (
                    <>
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {T(lang, "محتوى الدورة", "Contenu du cours", "Course Content")}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {sections.length} {T(lang, "أقسام", "sections", "sections")} • {totalLessons} {T(lang, "درس", "leçons", "lessons")} • {totalHours}h {totalMinutes % 60}m
                        </span>
                      </div>

                      <div className="space-y-2">
                        {sections.map((section, idx) => (
                          <div key={section.id} className="overflow-hidden rounded-xl border border-border">
                            <button onClick={() => toggleSection(section.id)}
                              className={`flex w-full items-center justify-between px-5 py-4 text-start transition-all ${
                                openSections.has(section.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-secondary/50"
                              }`}>
                              <div className="flex items-center gap-3">
                                {openSections.has(section.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                <span className="text-sm font-bold">{section.title}</span>
                              </div>
                              <span className={`text-xs ${openSections.has(section.id) ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {section.lessons.length} {T(lang, "درس", "leçons", "lessons")} •{" "}
                                {Math.floor(section.lessons.reduce((a, l) => a + l.duration_minutes, 0) / 60)}h{" "}
                                {section.lessons.reduce((a, l) => a + l.duration_minutes, 0) % 60}m
                              </span>
                            </button>
                            <AnimatePresence>
                              {openSections.has(section.id) && (
                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                  className="overflow-hidden">
                                  <div className="divide-y divide-border">
                                    {section.lessons.map((lesson, li) => (
                                      <div key={lesson.id}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors min-h-[48px]">
                                        <div className="flex items-center gap-3">
                                          {lessonTypeIcon(lesson.type)}
                                          <span className="text-sm">{lesson.title}</span>
                                          {lesson.is_preview && (
                                            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                                              style={{ background: "#F5A623", color: "#1a1a1a" }}>
                                              {T(lang, "معاينة", "Aperçu", "Preview")}
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                          <Clock className="h-3.5 w-3.5" />
                                          {lesson.duration_minutes}m
                                        </span>
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

              {/* ─── INSTRUCTOR TAB ─── */}
              {activeTab === "instructor" && (
                <motion.div key="instructor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {course.instructor_avatar ? (
                        <img src={course.instructor_avatar} alt="" className="h-24 w-24 rounded-full border-4 border-primary/20 object-cover" />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-start">
                        <h3 className="font-display text-xl font-bold text-foreground">{course.instructor_name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{T(lang, "مدرب معتمد", "Formateur certifié", "Certified Instructor")}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /> 4.8 {T(lang, "تقييم", "note", "rating")}</span>
                          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 0 {T(lang, "طالب", "étudiants", "students")}</span>
                          <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> 1 {T(lang, "دورة", "cours", "course")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── REVIEWS TAB ─── */}
              {activeTab === "reviews" && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {/* Rating breakdown */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="font-display text-5xl font-bold text-foreground">4.8</div>
                        <div className="flex items-center justify-center gap-0.5 mt-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-accent text-accent" : "fill-accent/40 text-accent/40"}`} />)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">0 {T(lang, "تقييم", "avis", "reviews")}</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5,4,3,2,1].map(star => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-6">{star}★</span>
                            <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full rounded-full bg-accent transition-all" style={{ width: star === 5 ? "70%" : star === 4 ? "20%" : star === 3 ? "7%" : "1.5%" }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-10 text-end">
                              {star === 5 ? "70%" : star === 4 ? "20%" : star === 3 ? "7%" : star === 2 ? "2%" : "1%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-muted-foreground py-8 text-sm">
                    {T(lang, "لا توجد تقييمات بعد.", "Aucun avis pour le moment.", "No reviews yet.")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Purchase card — desktop sticky sidebar */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20">
              <PurchaseCard
                course={course} price={price} oldPrice={oldPrice} discountPercent={discountPercent}
                priceText={priceText} lang={lang} title={title}
                onBuy={() => setShowOrderModal(true)} onShare={handleShare}
                wishlisted={wishlisted} onWishlist={() => setWishlisted(!wishlisted)}
                totalHours={totalHours} totalLessons={totalLessons}
              />
            </div>
          </div>

          {/* Mobile purchase card (inline, visible on mobile) */}
          <div className="lg:hidden">
            <PurchaseCard
              course={course} price={price} oldPrice={oldPrice} discountPercent={discountPercent}
              priceText={priceText} lang={lang} title={title}
              onBuy={() => setShowOrderModal(true)} onShare={handleShare}
              wishlisted={wishlisted} onWishlist={() => setWishlisted(!wishlisted)}
              totalHours={totalHours} totalLessons={totalLessons}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — RELATED COURSES
          ═══════════════════════════════════════════════════════ */}
      {relatedCourses.length > 0 && (
        <section className="border-t border-border bg-secondary/30 py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {T(lang, "قد يعجبك أيضاً", "Vous aimerez aussi", "You May Also Like")}
              </h2>
              <Link to="/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                {T(lang, "عرض الكل", "Voir tout", "View All")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCourses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — MOBILE FIXED BOTTOM BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 start-0 end-0 z-50 lg:hidden border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="container flex items-center justify-between py-3 gap-4">
          <div>
            <span className="font-display text-lg font-bold text-primary">{priceText}</span>
            {price > 0 && <span className="ms-2 text-xs text-muted-foreground line-through">{oldPrice.toLocaleString()} DZD</span>}
          </div>
          <Button onClick={() => setShowOrderModal(true)} size="lg"
            className="font-bold text-sm rounded-xl px-8 text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
            {T(lang, "اشترِ الآن", "Acheter", "Buy Now")}
          </Button>
        </div>
      </div>
      {/* Bottom spacer for mobile fixed bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PURCHASE CARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function PurchaseCard({
  course, price, oldPrice, discountPercent, priceText, lang, title,
  onBuy, onShare, wishlisted, onWishlist, totalHours, totalLessons,
}: {
  course: any; price: number; oldPrice: number; discountPercent: number;
  priceText: string; lang: string; title: string;
  onBuy: () => void; onShare: (p: string) => void;
  wishlisted: boolean; onWishlist: () => void;
  totalHours: number; totalLessons: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* Video preview */}
      <div className="relative aspect-video cursor-pointer group">
        <img src={course.cover_image || "/placeholder.svg"} alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/90 shadow-lg">
            <Play className="h-7 w-7 text-primary ms-1" />
          </motion.div>
        </div>
        <span className="absolute bottom-3 end-3 rounded-md bg-black/70 px-2 py-1 text-xs text-primary-foreground">
          {T(lang, "معاينة الدورة", "Aperçu", "Preview")}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Price */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-display text-3xl font-bold text-foreground">{priceText}</span>
          {price > 0 && (
            <>
              <span className="text-lg text-muted-foreground line-through">{oldPrice.toLocaleString()} DZD</span>
              <span className="rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-bold">
                {T(lang, `خصم ${discountPercent}%`, `${discountPercent}% de réduction`, `Save ${discountPercent}%`)}
              </span>
            </>
          )}
        </div>

        {/* CTA */}
        <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: 2, duration: 0.6, delay: 1 }}>
          <Button onClick={onBuy} size="lg"
            className="w-full font-bold text-base rounded-xl h-14 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
            {T(lang, "اشترِ الآن", "Acheter maintenant", "Buy Now")}
          </Button>
        </motion.div>

        {/* Wishlist */}
        <Button onClick={onWishlist} variant="outline" size="lg"
          className="w-full rounded-xl h-12 font-semibold text-sm">
          <Heart className={`h-4 w-4 me-2 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
          {wishlisted
            ? T(lang, "في قائمة الرغبات", "Dans les favoris", "In Wishlist")
            : T(lang, "أضف إلى قائمة الرغبات", "Ajouter aux favoris", "Add to Wishlist")}
        </Button>

        <div className="h-px bg-border" />

        {/* Course includes */}
        <div>
          <h4 className="text-sm font-bold text-foreground mb-3">
            {T(lang, "تشمل هذه الدورة", "Ce cours comprend", "This course includes")}
          </h4>
          <ul className="space-y-3">
            {[
              { icon: <Video className="h-4 w-4 text-primary" />, text: `${totalHours}+ ${T(lang, "ساعات فيديو", "heures de vidéo", "hours of video")}` },
              { icon: <FileText className="h-4 w-4 text-primary" />, text: `${totalLessons} ${T(lang, "درس", "leçons", "lessons")}` },
              { icon: <Smartphone className="h-4 w-4 text-primary" />, text: T(lang, "وصول عبر الهاتف والحاسوب", "Accès mobile & desktop", "Access on mobile & desktop") },
              { icon: <Trophy className="h-4 w-4 text-primary" />, text: T(lang, "شهادة إتمام", "Certificat de réussite", "Certificate of completion") },
              { icon: <Infinity className="h-4 w-4 text-primary" />, text: T(lang, "دخول مدى الحياة", "Accès à vie", "Lifetime access") },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                {item.icon} {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-border" />

        {/* Share */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {T(lang, "شارك هذه الدورة", "Partager ce cours", "Share this course")}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => onShare("facebook")} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Facebook className="h-4 w-4" />
            </button>
            <button onClick={() => onShare("whatsapp")} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-green-600 hover:text-primary-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
            </button>
            <button onClick={() => onShare("copy")} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
