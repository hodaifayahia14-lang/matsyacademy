import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ImageIcon, Plus, Trash2, GripVertical,
  ChevronDown, ChevronUp, Check, BookOpen, FileText, Video, Eye,
} from "lucide-react";

// ─── Types ───
interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}
interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration_minutes: number;
  content: string;
  is_preview: boolean;
  order: number;
}

const uid = () => crypto.randomUUID();

const STEPS = [
  { key: "basic", num: 1 },
  { key: "content", num: 2 },
  { key: "pricing", num: 3 },
  { key: "publish", num: 4 },
] as const;

// ─── Arrow Stepper ───
function ArrowStepper({ step, setStep, lang }: { step: number; setStep: (n: number) => void; lang: string }) {
  const labels: Record<string, string[]> = {
    ar: ["المعلومات الأساسية", "المحتوى", "التسعير", "نشر"],
    fr: ["Infos de base", "Contenu", "Tarification", "Publier"],
    en: ["Basic Info", "Content", "Pricing", "Publish"],
  };
  const l = labels[lang] || labels.en;

  return (
    <div className="flex items-stretch mb-8 overflow-hidden rounded-xl border border-border bg-card">
      {STEPS.map(({ num }, i) => {
        const isActive = step === num;
        const isDone = step > num;
        return (
          <button
            key={num}
            onClick={() => setStep(num)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors
              ${isActive ? "gradient-purple text-white" : isDone ? "bg-primary/10 text-primary" : "bg-card text-muted-foreground"}
              ${i > 0 ? "border-s border-border" : ""}
            `}
          >
            {isDone && <Check className="h-4 w-4" />}
            <span>{num}. {l[i]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───
export default function CreateCourse() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
  const isRtl = lang === "ar";
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [language, setLanguage] = useState("ar");
  const [courseType, setCourseType] = useState<"course" | "book">("course");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 2: Content (curriculum)
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // For books
  const [pageCount, setPageCount] = useState("");
  const [bookFile, setBookFile] = useState<File | null>(null);

  // Step 3: Pricing
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(false);
  const [promoVideo, setPromoVideo] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [cpfEligible, setCpfEligible] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data || [];
    },
  });

  // ─── Cover image handler ───
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error(isRtl ? "الحد الأقصى 5MB" : "Max 5MB"); return; }
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  // ─── Section/Lesson helpers ───
  const addSection = () => {
    setSections(prev => [...prev, { id: uid(), title: "", order: prev.length + 1, lessons: [] }]);
  };
  const updateSection = (id: string, title: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  };
  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };
  const addLesson = (sectionId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, lessons: [...s.lessons, { id: uid(), title: "", type: "video", duration_minutes: 10, content: "", is_preview: false, order: s.lessons.length + 1 }] } : s
    ));
  };
  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l) } : s
    ));
  };
  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) } : s
    ));
  };

  // ─── Create mutation ───
  const create = useMutation({
    mutationFn: async () => {
      let coverUrl: string | null = null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `${user!.id}/${uid()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("course-images").upload(path, coverFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("course-images").getPublicUrl(path);
        coverUrl = urlData.publicUrl;
      }

      let fileUrl: string | null = null;
      if (bookFile && courseType === "book") {
        const ext = bookFile.name.split(".").pop();
        const path = `${user!.id}/books/${uid()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("course-images").upload(path, bookFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("course-images").getPublicUrl(path);
        fileUrl = urlData.publicUrl;
      }

      const { data: courseData, error: cErr } = await supabase.from("courses").insert({
        title,
        subtitle: subtitle || null,
        description: description || null,
        category_id: categoryId || null,
        price: isFree ? 0 : Number(price),
        is_free: isFree,
        level,
        language,
        type: courseType,
        cover_image: coverUrl,
        file_url: fileUrl,
        page_count: courseType === "book" ? Number(pageCount) || null : null,
        instructor_id: user!.id,
        status: "draft",
        promo_video: promoVideo || null,
        learning_outcomes: learningOutcomes.filter(Boolean),
        requirements: requirements.filter(Boolean),
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : null,
        cpf_eligible: cpfEligible,
      }).select("id").single();
      if (cErr) throw cErr;

      // Insert sections & lessons
      if (courseType === "course" && sections.length > 0) {
        for (const sec of sections) {
          if (!sec.title.trim()) continue;
          const { data: secData, error: sErr } = await supabase.from("sections").insert({
            course_id: courseData.id,
            title: sec.title,
            order: sec.order,
          }).select("id").single();
          if (sErr) throw sErr;

          for (const les of sec.lessons) {
            if (!les.title.trim()) continue;
            const { error: lErr } = await supabase.from("lessons").insert({
              section_id: secData.id,
              title: les.title,
              type: les.type,
              duration_minutes: les.duration_minutes,
              content: les.content || null,
              is_preview: les.is_preview,
              order: les.order,
            });
            if (lErr) throw lErr;
          }
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success(isRtl ? "تم إنشاء الدورة بنجاح" : "Course created successfully");
      navigate("/dashboard/admin/courses");
    },
    onError: (e) => toast.error(e.message),
  });

  // ─── Labels ───
  const lb = {
    title: isRtl ? "إنشاء دورة جديدة" : lang === "fr" ? "Créer un nouveau cours" : "Create New Course",
    courseTitle: isRtl ? "عنوان الدورة" : lang === "fr" ? "Titre du cours" : "Course Title",
    subtitle: isRtl ? "العنوان الفرعي" : lang === "fr" ? "Sous-titre" : "Subtitle",
    category: isRtl ? "الفئة" : lang === "fr" ? "Catégorie" : "Category",
    description: isRtl ? "وصف الدورة" : lang === "fr" ? "Description du cours" : "Course Description",
    thumbnail: isRtl ? "تحميل صورة مصغرة" : lang === "fr" ? "Image miniature" : "Upload Thumbnail",
    chooseFile: isRtl ? "اختيار ملف" : lang === "fr" ? "Choisir un fichier" : "Choose File",
    fileLimit: isRtl ? "JPG, PNG, الحد الأقصى 5MB" : "JPG, PNG, max 5MB",
    next: isRtl ? "التالي" : lang === "fr" ? "Suivant" : "Next",
    prev: isRtl ? "السابق" : lang === "fr" ? "Précédent" : "Previous",
    cancel: isRtl ? "إلغاء" : lang === "fr" ? "Annuler" : "Cancel",
    publish: isRtl ? "إنشاء الدورة" : lang === "fr" ? "Créer le cours" : "Create Course",
    level: isRtl ? "المستوى" : lang === "fr" ? "Niveau" : "Level",
    language: isRtl ? "اللغة" : lang === "fr" ? "Langue" : "Language",
    type: isRtl ? "النوع" : lang === "fr" ? "Type" : "Type",
    sections: isRtl ? "أقسام المنهج" : lang === "fr" ? "Sections du programme" : "Curriculum Sections",
    addSection: isRtl ? "إضافة قسم" : lang === "fr" ? "Ajouter une section" : "Add Section",
    addLesson: isRtl ? "إضافة درس" : lang === "fr" ? "Ajouter une leçon" : "Add Lesson",
    sectionTitle: isRtl ? "عنوان القسم" : lang === "fr" ? "Titre de la section" : "Section Title",
    lessonTitle: isRtl ? "عنوان الدرس" : lang === "fr" ? "Titre de la leçon" : "Lesson Title",
    duration: isRtl ? "المدة (دقائق)" : lang === "fr" ? "Durée (min)" : "Duration (min)",
    lessonType: isRtl ? "نوع الدرس" : lang === "fr" ? "Type de leçon" : "Lesson Type",
    preview: isRtl ? "معاينة مجانية" : lang === "fr" ? "Aperçu gratuit" : "Free Preview",
    price: isRtl ? "السعر (دج)" : lang === "fr" ? "Prix (DZD)" : "Price (DZD)",
    free: isRtl ? "مجاني" : lang === "fr" ? "Gratuit" : "Free",
    promoVideo: isRtl ? "رابط فيديو ترويجي" : lang === "fr" ? "Lien vidéo promotionnelle" : "Promo Video URL",
    outcomes: isRtl ? "مخرجات التعلم" : lang === "fr" ? "Résultats d'apprentissage" : "Learning Outcomes",
    requirements: isRtl ? "المتطلبات المسبقة" : lang === "fr" ? "Prérequis" : "Requirements",
    tags: isRtl ? "الوسوم (مفصولة بفواصل)" : lang === "fr" ? "Tags (séparés par des virgules)" : "Tags (comma separated)",
    cpf: isRtl ? "مؤهل للتمويل" : lang === "fr" ? "Éligible CPF" : "CPF Eligible",
    bookPages: isRtl ? "عدد الصفحات" : lang === "fr" ? "Nombre de pages" : "Page Count",
    bookFile: isRtl ? "ملف الكتاب (PDF)" : lang === "fr" ? "Fichier du livre (PDF)" : "Book File (PDF)",
    summary: isRtl ? "ملخص الدورة" : lang === "fr" ? "Résumé du cours" : "Course Summary",
    selectCategory: isRtl ? "اختر الفئة" : lang === "fr" ? "Choisir la catégorie" : "Select category",
    content: isRtl ? "محتوى الدرس" : lang === "fr" ? "Contenu" : "Content",
  };

  const catName = (c: any) => c[`name_${lang}`] || c.name;

  return (
    <div className="max-w-3xl mx-auto" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
        </Button>
        <h1 className="font-display text-2xl font-bold text-foreground">{lb.title}</h1>
      </div>

      {/* Stepper */}
      <ArrowStepper step={step} setStep={setStep} lang={lang} />

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
        >
          {/* ═══════ STEP 1 — Basic Info ═══════ */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Course Type */}
              <div>
                <Label className="mb-2 block font-semibold">{lb.type}</Label>
                <div className="flex gap-3">
                  {(["course", "book"] as const).map(t => (
                    <button key={t} onClick={() => setCourseType(t)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all
                        ${courseType === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                      {t === "course" ? <Video className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                      {t === "course" ? (isRtl ? "دورة تدريبية" : "Course") : (isRtl ? "كتاب رقمي" : "Digital Book")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label className="mb-2 block font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {lb.courseTitle}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">1</span>
                  </span>
                </Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} className="text-base py-5" placeholder={isRtl ? "أدخل عنوان الدورة..." : "Enter course title..."} />
              </div>

              {/* Subtitle */}
              <div>
                <Label className="mb-2 block font-semibold">{lb.subtitle}</Label>
                <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder={isRtl ? "وصف مختصر..." : "Short description..."} />
              </div>

              {/* Category */}
              <div>
                <Label className="mb-2 block font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {lb.category}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">2</span>
                  </span>
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="py-5"><SelectValue placeholder={lb.selectCategory} /></SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => <SelectItem key={c.id} value={c.id}>{catName(c)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Level & Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block font-semibold">{lb.level}</Label>
                  <Select value={level} onValueChange={v => setLevel(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">{isRtl ? "مبتدئ" : "Beginner"}</SelectItem>
                      <SelectItem value="intermediate">{isRtl ? "متوسط" : "Intermediate"}</SelectItem>
                      <SelectItem value="advanced">{isRtl ? "متقدم" : "Advanced"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block font-semibold">{lb.language}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2 block font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {lb.description}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">3</span>
                  </span>
                </Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
                  className="text-sm" placeholder={isRtl ? "اكتب وصفاً مفصلاً للدورة..." : "Write a detailed course description..."} />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label className="mb-2 block font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    {lb.thumbnail}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold">4</span>
                  </span>
                </Label>
                <div className="rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-8 text-center transition-colors hover:border-primary/30">
                  {coverPreview ? (
                    <div className="relative">
                      <img src={coverPreview} alt="" className="mx-auto max-h-48 rounded-xl object-cover" />
                      <Button variant="destructive" size="sm" className="absolute top-2 end-2" onClick={() => { setCoverFile(null); setCoverPreview(null); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                      <Button className="gradient-gold text-accent-foreground font-semibold" onClick={() => fileRef.current?.click()}>
                        {lb.chooseFile}
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">{lb.fileLimit}</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverChange} />
                </div>
              </div>
            </div>
          )}

          {/* ═══════ STEP 2 — Content / Curriculum ═══════ */}
          {step === 2 && (
            <div className="space-y-6">
              {courseType === "book" ? (
                <>
                  <div>
                    <Label className="mb-2 block font-semibold">{lb.bookPages}</Label>
                    <Input type="number" value={pageCount} onChange={e => setPageCount(e.target.value)} placeholder="e.g., 250" />
                  </div>
                  <div>
                    <Label className="mb-2 block font-semibold">{lb.bookFile}</Label>
                    <div className="rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-8 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                          {lb.chooseFile}
                        </span>
                        <input type="file" accept=".pdf" className="hidden" onChange={e => setBookFile(e.target.files?.[0] || null)} />
                      </label>
                      {bookFile && <p className="mt-3 text-sm text-foreground font-medium">{bookFile.name}</p>}
                      <p className="mt-2 text-xs text-muted-foreground">PDF, max 50MB</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">{lb.sections}</h3>
                    <Button onClick={addSection} size="sm" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      {lb.addSection}
                    </Button>
                  </div>

                  {sections.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed rounded-2xl border-border">
                      <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">{isRtl ? "لا توجد أقسام بعد. أضف قسمك الأول!" : "No sections yet. Add your first section!"}</p>
                      <Button onClick={addSection} variant="outline" size="sm" className="mt-3 gap-1.5">
                        <Plus className="h-4 w-4" />
                        {lb.addSection}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {sections.map((sec, si) => (
                      <div key={sec.id} className="rounded-xl border border-border overflow-hidden">
                        {/* Section header */}
                        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 cursor-grab" />
                          <span className="text-xs font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">{si + 1}</span>
                          <Input
                            value={sec.title}
                            onChange={e => updateSection(sec.id, e.target.value)}
                            placeholder={lb.sectionTitle}
                            className="flex-1 border-0 bg-transparent text-sm font-semibold focus-visible:ring-0 shadow-none"
                          />
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}>
                            {expandedSection === sec.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => removeSection(sec.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Section lessons */}
                        <AnimatePresence>
                          {expandedSection === sec.id && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="p-4 space-y-3 bg-card">
                                {sec.lessons.map((les, li) => (
                                  <div key={les.id} className="rounded-lg border border-border p-3 space-y-3">
                                    <div className="flex items-start gap-2">
                                      <span className="text-xs text-muted-foreground mt-2.5">{si + 1}.{li + 1}</span>
                                      <div className="flex-1 space-y-3">
                                        <Input value={les.title} onChange={e => updateLesson(sec.id, les.id, { title: e.target.value })}
                                          placeholder={lb.lessonTitle} className="text-sm" />
                                        <div className="grid grid-cols-3 gap-2">
                                          <Select value={les.type} onValueChange={v => updateLesson(sec.id, les.id, { type: v as any })}>
                                            <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="video"><span className="flex items-center gap-1"><Video className="h-3 w-3" /> Video</span></SelectItem>
                                              <SelectItem value="text"><span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Text</span></SelectItem>
                                              <SelectItem value="quiz"><span className="flex items-center gap-1"><Check className="h-3 w-3" /> Quiz</span></SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Input type="number" value={les.duration_minutes} onChange={e => updateLesson(sec.id, les.id, { duration_minutes: Number(e.target.value) })}
                                            placeholder={lb.duration} className="text-xs" />
                                          <div className="flex items-center gap-2">
                                            <Switch checked={les.is_preview} onCheckedChange={v => updateLesson(sec.id, les.id, { is_preview: v })} />
                                            <span className="text-xs text-muted-foreground"><Eye className="h-3 w-3 inline" /></span>
                                          </div>
                                        </div>
                                        {les.type !== "quiz" && (
                                          <Input value={les.content} onChange={e => updateLesson(sec.id, les.id, { content: e.target.value })}
                                            placeholder={les.type === "video" ? "Video URL" : lb.content} className="text-xs" />
                                        )}
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0" onClick={() => removeLesson(sec.id, les.id)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Button onClick={() => addLesson(sec.id)} variant="outline" size="sm" className="w-full gap-1.5 border-dashed">
                                  <Plus className="h-3.5 w-3.5" />
                                  {lb.addLesson}
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════ STEP 3 — Pricing & Details ═══════ */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Free toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <Label className="font-semibold">{lb.free}</Label>
                <Switch checked={isFree} onCheckedChange={setIsFree} />
              </div>

              {!isFree && (
                <div>
                  <Label className="mb-2 block font-semibold">{lb.price}</Label>
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="text-lg font-bold py-5" />
                </div>
              )}

              <div>
                <Label className="mb-2 block font-semibold">{lb.promoVideo}</Label>
                <Input value={promoVideo} onChange={e => setPromoVideo(e.target.value)} placeholder="https://youtube.com/..." />
              </div>

              {/* Learning Outcomes */}
              <div>
                <Label className="mb-2 block font-semibold">{lb.outcomes}</Label>
                <div className="space-y-2">
                  {learningOutcomes.map((o, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={o} onChange={e => { const n = [...learningOutcomes]; n[i] = e.target.value; setLearningOutcomes(n); }}
                        placeholder={`${isRtl ? "النتيجة" : "Outcome"} ${i + 1}`} className="text-sm" />
                      {learningOutcomes.length > 1 && (
                        <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => setLearningOutcomes(learningOutcomes.filter((_, j) => j !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setLearningOutcomes([...learningOutcomes, ""])} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    {isRtl ? "إضافة" : "Add"}
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label className="mb-2 block font-semibold">{lb.requirements}</Label>
                <div className="space-y-2">
                  {requirements.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={r} onChange={e => { const n = [...requirements]; n[i] = e.target.value; setRequirements(n); }}
                        placeholder={`${isRtl ? "المتطلب" : "Requirement"} ${i + 1}`} className="text-sm" />
                      {requirements.length > 1 && (
                        <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => setRequirements(requirements.filter((_, j) => j !== i))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setRequirements([...requirements, ""])} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    {isRtl ? "إضافة" : "Add"}
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="mb-2 block font-semibold">{lb.tags}</Label>
                <Input value={tags} onChange={e => setTags(e.target.value)} placeholder={isRtl ? "برمجة, تصميم, أعمال" : "programming, design, business"} />
              </div>

              {/* CPF toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <Label className="font-semibold">{lb.cpf}</Label>
                <Switch checked={cpfEligible} onCheckedChange={setCpfEligible} />
              </div>
            </div>
          )}

          {/* ═══════ STEP 4 — Review & Publish ═══════ */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">{lb.summary}</h3>

              <div className="rounded-xl border border-border divide-y divide-border">
                <SummaryRow label={lb.courseTitle} value={title || "—"} />
                <SummaryRow label={lb.type} value={courseType === "course" ? (isRtl ? "دورة تدريبية" : "Course") : (isRtl ? "كتاب رقمي" : "Book")} />
                <SummaryRow label={lb.category} value={categories?.find(c => c.id === categoryId)?.[`name_${lang}` as keyof typeof categories[0]] as string || categories?.find(c => c.id === categoryId)?.name || "—"} />
                <SummaryRow label={lb.level} value={level} />
                <SummaryRow label={lb.language} value={language === "ar" ? "العربية" : language === "fr" ? "Français" : "English"} />
                <SummaryRow label={lb.price} value={isFree ? (isRtl ? "مجاني" : "Free") : `${price} DZD`} />
                {courseType === "course" && (
                  <SummaryRow label={lb.sections} value={`${sections.length} ${isRtl ? "قسم" : "sections"}, ${sections.reduce((s, sec) => s + sec.lessons.length, 0)} ${isRtl ? "درس" : "lessons"}`} />
                )}
                {courseType === "book" && pageCount && (
                  <SummaryRow label={lb.bookPages} value={pageCount} />
                )}
                {learningOutcomes.filter(Boolean).length > 0 && (
                  <SummaryRow label={lb.outcomes} value={learningOutcomes.filter(Boolean).join(", ")} />
                )}
              </div>

              {coverPreview && (
                <div>
                  <Label className="mb-2 block font-semibold">{lb.thumbnail}</Label>
                  <img src={coverPreview} alt="" className="rounded-xl max-h-40 object-cover" />
                </div>
              )}

              {description && (
                <div>
                  <Label className="mb-2 block font-semibold">{lb.description}</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Buttons */}
      <div className="mt-6 flex items-center gap-3">
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !title}
            className="gradient-gold text-accent-foreground font-bold px-8 py-5 rounded-xl">
            {lb.next}
            <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
          </Button>
        ) : (
          <Button onClick={() => create.mutate()} disabled={!title || create.isPending}
            className="gradient-purple text-white font-bold px-8 py-5 rounded-xl">
            {create.isPending ? (isRtl ? "جاري الإنشاء..." : "Creating...") : lb.publish}
          </Button>
        )}
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="px-6 py-5 rounded-xl">
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {lb.prev}
          </Button>
        )}
        <Button variant="ghost" onClick={() => navigate(-1)} className="ms-auto text-muted-foreground">
          {lb.cancel}
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-semibold text-foreground text-end">{value}</span>
    </div>
  );
}
