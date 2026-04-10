import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Plus, X, Check, Image as ImageIcon, GripVertical, BookOpen, DollarSign, GraduationCap, FileText, Upload, Star, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const levelOptions = ["beginner", "intermediate", "advanced"];
const langOptions = ["en", "fr", "ar"];

interface SectionDraft {
  title: string;
  lessons: { title: string; type: "video" | "text" | "quiz"; duration: number; content: string }[];
}

export default function CreateCourse() {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const isAdmin = roles.includes("admin");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [productType, setProductType] = useState<"course" | "book">("course");

  // Step 1 — Basic Info
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [language, setLanguage] = useState("ar");
  const [tags, setTags] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [courseImages, setCourseImages] = useState<{ url: string; name: string }[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Content
  const [promoVideo, setPromoVideo] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [sections, setSections] = useState<SectionDraft[]>([
    { title: "", lessons: [{ title: "", type: "video", duration: 10, content: "" }] },
  ]);

  // Step 3 — Pricing
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [cpfEligible, setCpfEligible] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  const steps = [
    { key: "basic", label: t("المعلومات الأساسية", "Informations de base", "Basic Info") },
    { key: "content", label: t("المحتوى", "Contenu", "Content") },
    { key: "pricing", label: t("التسعير", "Tarification", "Pricing") },
    { key: "publish", label: t("نشر", "Publier", "Publish") },
  ];

  const canAdvance = () => {
    if (step === 0) return title.trim().length >= 3 && description.trim().length >= 10;
    if (step === 1 && productType === "course") return sections.some((s) => s.title && s.lessons.some((l) => l.title));
    return true;
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);
    const newImages: { url: string; name: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("course-images").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("course-images").getPublicUrl(path);
      newImages.push({ url: urlData.publicUrl, name: file.name });
    }
    setCourseImages(prev => {
      const updated = [...prev, ...newImages];
      if (prev.length === 0 && updated.length > 0) {
        setCoverImage(updated[0].url);
        setMainImageIndex(0);
      }
      return updated;
    });
    setUploading(false);
    if (newImages.length > 0) toast.success(`${newImages.length} image(s) uploaded`);
  };

  const removeImage = (index: number) => {
    setCourseImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (index === mainImageIndex) { setMainImageIndex(0); setCoverImage(updated[0]?.url || ""); }
      else if (index < mainImageIndex) { setMainImageIndex(mainImageIndex - 1); }
      return updated;
    });
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
    setCoverImage(courseImages[index].url);
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const status = asDraft ? "draft" : isAdmin ? "published" : "pending";
      const { data: course, error } = await supabase.from("courses").insert({
        title, subtitle, description,
        category_id: categoryId || null,
        level: level as any, language,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        cover_image: coverImage || null,
        promo_video: productType === "course" ? (promoVideo || null) : null,
        instructor_id: user.id,
        is_free: isFree, price: isFree ? 0 : price,
        cpf_eligible: cpfEligible, status: status as any,
        learning_outcomes: outcomes.filter(Boolean),
        requirements: requirements.filter(Boolean),
        type: productType,
        page_count: productType === "book" ? (pageCount || null) : null,
        file_url: productType === "book" ? (fileUrl || null) : null,
      } as any).select().single();
      if (error) throw error;

      if (productType === "course") {
        for (let si = 0; si < sections.length; si++) {
          const sec = sections[si];
          if (!sec.title) continue;
          const { data: sectionData, error: secErr } = await supabase.from("sections").insert({
            course_id: course.id, title: sec.title, order: si,
          }).select().single();
          if (secErr) throw secErr;
          for (let li = 0; li < sec.lessons.length; li++) {
            const lesson = sec.lessons[li];
            if (!lesson.title) continue;
            await supabase.from("lessons").insert({
              section_id: sectionData.id, title: lesson.title,
              type: lesson.type as any, duration_minutes: lesson.duration,
              order: li, content: lesson.content || null,
            });
          }
        }
      }

      const productLabel = productType === "book" ? t("الكتاب", "Livre", "Book") : t("الدورة", "Cours", "Course");
      toast.success(asDraft
        ? t(`تم حفظ مسودة ${productLabel}`, `Brouillon de ${productLabel} enregistré`, `${productLabel} draft saved`)
        : isAdmin
        ? t(`تم نشر ${productLabel}`, `${productLabel} publié`, `${productLabel} published`)
        : t(`تم إرسال ${productLabel} للمراجعة`, `${productLabel} soumis pour révision`, `${productLabel} submitted for review`));
      navigate(isAdmin ? "/dashboard/admin/courses" : "/dashboard/instructor");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const addOutcome = () => setOutcomes([...outcomes, ""]);
  const addRequirement = () => setRequirements([...requirements, ""]);
  const addSection = () => setSections([...sections, { title: "", lessons: [{ title: "", type: "video", duration: 10, content: "" }] }]);
  const addLesson = (si: number) => {
    const copy = [...sections];
    copy[si].lessons.push({ title: "", type: "video", duration: 10, content: "" });
    setSections(copy);
  };

  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Title */}
      <h1 className="mb-6 text-center font-display text-2xl font-bold text-foreground">
        {productType === "book" ? t("إضافة كتاب جديد", "Ajouter un Livre", "Add New Book") : t("إنشاء دورة جديدة", "Créer un nouveau cours", "Create New Course")}
      </h1>

      {/* Arrow Stepper */}
      <div className="mb-8 flex items-stretch overflow-hidden rounded-xl border border-border">
        {steps.map((s, i) => {
          const isActive = i === step;
          const isDone = i < step;
          return (
            <button
              key={s.key}
              onClick={() => i <= step && setStep(i)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold transition-all
                ${isActive ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground" : isDone ? "bg-primary/10 text-primary cursor-pointer" : "bg-muted/50 text-muted-foreground"}
              `}
              disabled={i > step}
            >
              {isDone && <Check className="h-4 w-4" />}
              <span className="flex items-center gap-1.5">
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold
                  ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : isDone ? "bg-primary/20 text-primary" : "bg-muted-foreground/20 text-muted-foreground"}
                `}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
              {/* Arrow separator */}
              {i < steps.length - 1 && (
                <svg className="absolute -end-3 top-0 z-10 h-full w-6" viewBox="0 0 24 48" fill="none" preserveAspectRatio="none">
                  <path d="M0 0L20 24L0 48" fill={isActive ? "hsl(var(--primary) / 0.8)" : isDone ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted) / 0.5)"} />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Product Type Selector */}
      {step === 0 && (
        <div className="mb-6 flex gap-3">
          <button onClick={() => setProductType("course")}
            className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all ${productType === "course" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            <GraduationCap className="h-5 w-5" />
            {t("دورة تدريبية", "Cours", "Course")}
          </button>
          <button onClick={() => setProductType("book")}
            className={`flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all ${productType === "book" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            <BookOpen className="h-5 w-5" />
            {t("كتاب", "Livre", "Book")}
          </button>
        </div>
      )}

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          {/* STEP 1 — Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("عنوان الدورة", "Titre du cours", "Course Title")} <span className="text-destructive">*</span></Label>
                <Textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("مثال: دورة السلامة المهنية الشاملة", "Ex: Cours complet de sécurité au travail", "e.g. Complete HSE Safety Course")}
                  rows={2}
                  className="resize-none text-base"
                />
                <p className="mt-1 text-xs text-muted-foreground">{title.length}/120 {t("حرف", "caractères", "characters")}</p>
              </div>

              {/* Category */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("الفئة", "Catégorie", "Category")}</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("اختر الفئة...", "Choisir une catégorie...", "Select category...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{lang === "ar" ? c.name_ar : lang === "fr" ? c.name_fr : c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("وصف الدورة", "Description du cours", "Course Description")} <span className="text-destructive">*</span></Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder={t("اكتب وصفاً تفصيلياً للدورة...", "Rédigez une description détaillée...", "Write a detailed course description...")}
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">{description.length} {t("حرف", "caractères", "characters")}</p>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("تحميل صورة مصغرة", "Image miniature", "Upload Thumbnail")}</Label>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />

                {courseImages.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-primary/40" />
                    )}
                    <div className="text-center">
                      <Button type="button" size="sm" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90">
                        {t("اختيار ملف", "Choisir un fichier", "Choose File")}
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">JPG, PNG, {t("الحد الأقصى", "taille max", "max")} 5MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {courseImages.map((img, i) => (
                        <div key={i} className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                          i === mainImageIndex ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-border hover:border-primary/40"
                        }`}>
                          <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                          {i === mainImageIndex && (
                            <div className="absolute start-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow">
                              <Star className="h-3 w-3" /> {t("الرئيسية", "Principal", "Main")}
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            {i !== mainImageIndex && (
                              <Button size="sm" variant="secondary" className="h-8 gap-1 text-xs" onClick={() => setAsMainImage(i)}>
                                <Star className="h-3 w-3" /> {t("اجعلها رئيسية", "Principal", "Set as main")}
                              </Button>
                            )}
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(i)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 — Content */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Extra fields */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("العنوان الفرعي", "Sous-titre", "Subtitle")}</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={t("وصف مختصر للدورة", "Brève description", "Brief course description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">{t("المستوى", "Niveau", "Level")}</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((l) => (
                        <SelectItem key={l} value={l}>{l === "beginner" ? t("مبتدئ", "Débutant", "Beginner") : l === "intermediate" ? t("متوسط", "Intermédiaire", "Intermediate") : t("متقدم", "Avancé", "Advanced")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">{t("اللغة", "Langue", "Language")}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {langOptions.map((l) => (
                        <SelectItem key={l} value={l}>{l === "ar" ? "العربية" : l === "fr" ? "Français" : "English"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("الكلمات المفتاحية", "Mots-clés", "Tags")}</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="HSE, safety, سلامة" />
              </div>

              {productType === "book" && (
                <>
                  <div>
                    <Label className="mb-1.5 block text-sm font-semibold">{t("عدد الصفحات", "Nombre de pages", "Page Count")}</Label>
                    <Input type="number" value={pageCount || ""} onChange={(e) => setPageCount(parseInt(e.target.value) || 0)} placeholder="320" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-semibold">{t("رابط ملف الكتاب (PDF)", "Lien du fichier (PDF)", "Book File URL (PDF)")}</Label>
                    <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." />
                    {fileUrl && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="truncate text-sm text-muted-foreground">{fileUrl}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {productType === "course" && (
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">{t("فيديو ترويجي", "Vidéo promotionnelle", "Promo Video")}</Label>
                  <Input value={promoVideo} onChange={(e) => setPromoVideo(e.target.value)} placeholder="https://youtube.com/..." />
                </div>
              )}

              {/* Learning Outcomes */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("أهداف التعلم", "Objectifs d'apprentissage", "Learning Outcomes")}</Label>
                {outcomes.map((o, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{i + 1}</span>
                    <Input value={o} onChange={(e) => { const c = [...outcomes]; c[i] = e.target.value; setOutcomes(c); }} placeholder={t("مثال: فهم مبادئ السلامة", "Ex: Comprendre les principes de sécurité", "e.g. Understand safety principles")} />
                    <Button size="icon" variant="ghost" onClick={() => setOutcomes(outcomes.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOutcome}><Plus className="me-1 h-4 w-4" /> {t("إضافة هدف", "Ajouter un objectif", "Add Outcome")}</Button>
              </div>

              {/* Requirements */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">{t("المتطلبات", "Prérequis", "Requirements")}</Label>
                {requirements.map((r, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <Input value={r} onChange={(e) => { const c = [...requirements]; c[i] = e.target.value; setRequirements(c); }} />
                    <Button size="icon" variant="ghost" onClick={() => setRequirements(requirements.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addRequirement}><Plus className="me-1 h-4 w-4" /> {t("إضافة متطلب", "Ajouter un prérequis", "Add Requirement")}</Button>
              </div>

              {/* Curriculum (courses only) */}
              {productType === "course" && (
                <div>
                  <Label className="mb-2 block text-sm font-semibold">{t("المنهج الدراسي", "Programme", "Curriculum")}</Label>
                  <p className="mb-3 text-xs text-muted-foreground">{t("نظّم محتوى دورتك في أقسام ودروس", "Organisez le contenu en sections et leçons", "Organize content into sections and lessons")}</p>
                  {sections.map((sec, si) => (
                    <div key={si} className="mb-4 rounded-xl border bg-muted/30 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder={`${t("عنوان القسم", "Titre de la section", "Section title")} ${si + 1}`} value={sec.title}
                          onChange={(e) => { const c = [...sections]; c[si].title = e.target.value; setSections(c); }} className="font-medium" />
                        <Button size="icon" variant="ghost" onClick={() => setSections(sections.filter((_, j) => j !== si))}><X className="h-4 w-4" /></Button>
                      </div>
                      {sec.lessons.map((les, li) => (
                        <div key={li} className="mb-2 ms-6 rounded-lg border bg-card p-3">
                          <div className="flex gap-2 mb-2">
                            <Input placeholder={t("عنوان الدرس", "Titre de la leçon", "Lesson title")} value={les.title}
                              onChange={(e) => { const c = [...sections]; c[si].lessons[li].title = e.target.value; setSections(c); }} className="flex-1" />
                            <select className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-xs" value={les.type}
                              onChange={(e) => { const c = [...sections]; c[si].lessons[li].type = e.target.value as any; setSections(c); }}>
                              <option value="video">{t("فيديو", "Vidéo", "Video")}</option>
                              <option value="text">{t("نص", "Texte", "Text")}</option>
                              <option value="quiz">{t("اختبار", "Quiz", "Quiz")}</option>
                            </select>
                            <Input type="number" className="w-20" value={les.duration} placeholder="min"
                              onChange={(e) => { const c = [...sections]; c[si].lessons[li].duration = +e.target.value; setSections(c); }} />
                            <Button size="icon" variant="ghost" onClick={() => {
                              const c = [...sections]; c[si].lessons = c[si].lessons.filter((_, j) => j !== li); setSections(c);
                            }}><X className="h-3 w-3" /></Button>
                          </div>
                          <Input placeholder={les.type === "video" ? "Video URL" : les.type === "text" ? t("محتوى الدرس", "Contenu", "Lesson content") : "Quiz ID"}
                            value={les.content} onChange={(e) => { const c = [...sections]; c[si].lessons[li].content = e.target.value; setSections(c); }} className="text-xs" />
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="ms-6 mt-2" onClick={() => addLesson(si)}>
                        <Plus className="me-1 h-3 w-3" /> {t("إضافة درس", "Ajouter une leçon", "Add Lesson")}
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={addSection}>
                    <Plus className="me-1 h-4 w-4" /> {t("إضافة قسم", "Ajouter une section", "Add Section")}
                  </Button>
                </div>
              )}

              {productType === "book" && (
                <div className="rounded-xl border bg-muted/30 p-6 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-primary/50" />
                  <h3 className="mb-2 font-semibold">{t("لا يوجد منهج مطلوب للكتب", "Pas de programme requis", "No curriculum needed for books")}</h3>
                  <p className="text-sm text-muted-foreground">{t("الكتب لا تحتاج لأقسام ودروس.", "Les livres n'ont pas besoin de sections.", "Books don't need sections and lessons.")}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl border p-4">
                <Switch checked={isFree} onCheckedChange={setIsFree} />
                <div>
                  <Label className="text-base font-semibold">{t("مجاني", "Gratuit", "Free")}</Label>
                  <p className="text-xs text-muted-foreground">{t("اجعل المحتوى مجاني للجميع", "Rendre gratuit pour tous", "Make this free for everyone")}</p>
                </div>
              </div>
              {!isFree && (
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">{t("السعر (د.ج)", "Prix (DZD)", "Price (DZD)")}</Label>
                  <div className="relative">
                    <DollarSign className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className="ps-10" placeholder="15000" />
                  </div>
                  {price > 0 && <p className="mt-1 text-xs text-muted-foreground">{price.toLocaleString()} DZD</p>}
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border p-4">
                <Switch checked={cpfEligible} onCheckedChange={setCpfEligible} />
                <div>
                  <Label className="font-semibold">{t("مؤهل للتمويل الحكومي", "Éligible au financement", "CPF Eligible")}</Label>
                  <p className="text-xs text-muted-foreground">{t("هل المحتوى مؤهل للتمويل الحكومي؟", "Éligible au financement public ?", "Eligible for government funding?")}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Review & Publish */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border bg-muted/30 overflow-hidden">
                {coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img src={coverImage} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-xl font-bold text-foreground">{title || t("بدون عنوان", "Sans titre", "Untitled")}</h3>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 capitalize">{level}</span>
                    <span className="rounded-full bg-secondary px-3 py-1">{language === "ar" ? "العربية" : language === "fr" ? "Français" : "English"}</span>
                    <span className="rounded-full bg-accent/10 text-accent-foreground px-3 py-1">{isFree ? t("مجاني", "Gratuit", "Free") : `${price.toLocaleString()} DZD`}</span>
                  </div>
                  {productType === "course" && (
                    <div className="pt-3 border-t grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>📚 {sections.length} {t("أقسام", "sections", "sections")}</span>
                      <span>📖 {totalLessons} {t("دروس", "leçons", "lessons")}</span>
                      <span>🎯 {outcomes.filter(Boolean).length} {t("أهداف", "objectifs", "outcomes")}</span>
                      <span>📋 {requirements.filter(Boolean).length} {t("متطلبات", "prérequis", "requirements")}</span>
                    </div>
                  )}
                </div>
              </div>
              {description && (
                <div className="rounded-xl border p-4">
                  <h4 className="mb-2 font-semibold text-sm">{t("الوصف", "Description", "Description")}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">{description}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        {step === 3 ? (
          <>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={submitting}>
                {t("حفظ كمسودة", "Enregistrer brouillon", "Save Draft")}
              </Button>
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                {t("رجوع", "Retour", "Back")}
              </Button>
            </div>
            <Button onClick={() => handleSubmit(false)} disabled={submitting || !title}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8">
              {isAdmin ? t("نشر مباشرة", "Publier", "Publish Now") : t("إرسال للمراجعة", "Soumettre", "Submit for Review")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)}>
              {step === 0 ? t("إلغاء", "Annuler", "Cancel") : t("رجوع", "Retour", "Back")}
            </Button>
            <Button onClick={() => setStep(step + 1)} disabled={!canAdvance()}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8">
              {t("التالي", "Suivant", "Next")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
