import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Plus, X, ChevronRight, ChevronLeft, Check, Image, Video, GripVertical, BookOpen, DollarSign, Eye, GraduationCap, FileText } from "lucide-react";

const stepNames = [
  { key: "basic", icon: BookOpen },
  { key: "media", icon: Image },
  { key: "description", icon: BookOpen },
  { key: "curriculum", icon: GripVertical },
  { key: "pricing", icon: DollarSign },
  { key: "review", icon: Eye },
];

const levelOptions = ["beginner", "intermediate", "advanced"];
const langOptions = ["en", "fr", "ar"];

interface SectionDraft {
  title: string;
  lessons: { title: string; type: "video" | "text" | "quiz"; duration: number; content: string }[];
}

export default function CreateCourse() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "fr" | "ar";
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

  // Step 2 — Media
  const [coverImage, setCoverImage] = useState("");
  const [promoVideo, setPromoVideo] = useState("");

  // Step 3 — Description
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);

  // Step 4 — Curriculum
  const [sections, setSections] = useState<SectionDraft[]>([
    { title: "", lessons: [{ title: "", type: "video", duration: 10, content: "" }] },
  ]);

  // Step 5 — Pricing
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

  const stepLabels: Record<string, string> = {
    basic: lang === "ar" ? "المعلومات الأساسية" : lang === "fr" ? "Infos de Base" : "Basic Info",
    media: lang === "ar" ? "الوسائط" : lang === "fr" ? "Médias" : "Media",
    description: lang === "ar" ? "الوصف" : lang === "fr" ? "Description" : "Description",
    curriculum: lang === "ar" ? "المنهج" : lang === "fr" ? "Programme" : "Curriculum",
    pricing: lang === "ar" ? "التسعير" : lang === "fr" ? "Tarification" : "Pricing",
    review: lang === "ar" ? "المراجعة" : lang === "fr" ? "Révision" : "Review",
  };

  const canAdvance = () => {
    if (step === 0) return title.trim().length >= 3;
    if (step === 2) return description.trim().length >= 10;
    if (step === 3 && productType === "course") return sections.some((s) => s.title && s.lessons.some((l) => l.title));
    return true;
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

      toast.success(asDraft
        ? (lang === "ar" ? "تم حفظ المسودة" : "Draft saved")
        : isAdmin
        ? (lang === "ar" ? "تم نشر الدورة" : "Course published")
        : (lang === "ar" ? "تم إرسال الدورة للمراجعة" : "Course submitted for review"));
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

  const sel = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);
  const progressPercent = ((step + 1) / stepNames.length) * 100;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-display text-2xl font-bold">
        {productType === "book" ? (lang === "ar" ? "إضافة كتاب جديد" : lang === "fr" ? "Ajouter un Livre" : "Add New Book") : t("dashboard.instructor.createCourse")}
      </h1>
      <p className="mb-4 text-sm text-muted-foreground">
        {lang === "ar" ? "أنشئ محتوى جديد خطوة بخطوة" : lang === "fr" ? "Créez du contenu étape par étape" : "Create new content step by step"}
      </p>

      {/* Product Type Selector */}
      <div className="mb-6 flex gap-3">
        <button onClick={() => setProductType("course")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${productType === "course" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <GraduationCap className="h-4 w-4" />
          {lang === "ar" ? "دورة تدريبية" : lang === "fr" ? "Cours" : "Course"}
        </button>
        <button onClick={() => setProductType("book")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${productType === "book" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <BookOpen className="h-4 w-4" />
          {lang === "ar" ? "كتاب" : lang === "fr" ? "Livre" : "Book"}
        </button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{stepLabels[stepNames[step].key]}</span>
          <span>{step + 1}/{stepNames.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="mt-3 flex justify-between">
          {stepNames.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => i <= step && setStep(i)}
                className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                  i === step ? "text-primary font-semibold" : i < step ? "text-primary/60 cursor-pointer" : "text-muted-foreground/40"
                }`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/10 text-primary ring-2 ring-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="hidden sm:block">{stepLabels[s.key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{stepLabels[stepNames[step].key]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1 — Basic Info */}
          {step === 0 && (
            <>
              <div>
                <Label>{t("dashboard.instructor.courseTitle")} *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === "ar" ? "مثال: دورة السلامة المهنية الشاملة" : "e.g. Complete HSE Safety Course"} />
                <p className="mt-1 text-xs text-muted-foreground">{title.length}/120 {lang === "ar" ? "حرف" : "characters"}</p>
              </div>
              <div>
                <Label>{t("dashboard.instructor.courseSubtitle")}</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={lang === "ar" ? "وصف مختصر للدورة" : "Brief course description"} />
              </div>
              <div>
                <Label>{t("dashboard.instructor.selectCategory")}</Label>
                <select className={sel} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">{t("dashboard.instructor.selectCategory")}</option>
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("dashboard.instructor.selectLevel")}</Label>
                  <select className={sel} value={level} onChange={(e) => setLevel(e.target.value)}>
                    {levelOptions.map((l) => <option key={l} value={l}>{l === "beginner" ? (lang === "ar" ? "مبتدئ" : l) : l === "intermediate" ? (lang === "ar" ? "متوسط" : l) : (lang === "ar" ? "متقدم" : l)}</option>)}
                  </select>
                </div>
                <div>
                  <Label>{t("dashboard.instructor.selectLanguage")}</Label>
                  <select className={sel} value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {langOptions.map((l) => <option key={l} value={l}>{l === "ar" ? "العربية" : l === "fr" ? "Français" : "English"}</option>)}
                  </select>
                </div>
              </div>
              {productType === "book" && (
                <div>
                  <Label>{lang === "ar" ? "عدد الصفحات" : lang === "fr" ? "Nombre de pages" : "Page Count"}</Label>
                  <Input type="number" value={pageCount || ""} onChange={(e) => setPageCount(parseInt(e.target.value) || 0)} placeholder="320" />
                </div>
              )}
              <div>
                <Label>{t("dashboard.instructor.tags")}</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="HSE, safety, سلامة" />
              </div>
            </>
          )}

          {/* Step 2 — Media */}
          {step === 1 && (
            <>
              <div>
                <Label>{t("dashboard.instructor.coverImage")}</Label>
                <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
                {coverImage && (
                  <div className="mt-3 aspect-video overflow-hidden rounded-lg border bg-secondary">
                    <img src={coverImage} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
              {productType === "course" && (
                <div>
                  <Label>{t("dashboard.instructor.promoVideo")}</Label>
                  <Input value={promoVideo} onChange={(e) => setPromoVideo(e.target.value)} placeholder="https://youtube.com/..." />
                  {promoVideo && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border bg-secondary/50 p-3">
                      <Video className="h-5 w-5 text-primary" />
                      <span className="truncate text-sm text-muted-foreground">{promoVideo}</span>
                    </div>
                  )}
                </div>
              )}
              {productType === "book" && (
                <div>
                  <Label>{lang === "ar" ? "رابط ملف الكتاب (PDF)" : lang === "fr" ? "Lien du fichier (PDF)" : "Book File URL (PDF)"}</Label>
                  <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." />
                  {fileUrl && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border bg-secondary/50 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="truncate text-sm text-muted-foreground">{fileUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Step 3 — Description */}
          {step === 2 && (
            <>
              <div>
                <Label>{t("dashboard.instructor.courseDescription")} *</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder={lang === "ar" ? "اكتب وصفاً تفصيلياً للدورة..." : "Write a detailed course description..."} />
                <p className="mt-1 text-xs text-muted-foreground">{description.length} {lang === "ar" ? "حرف" : "characters"}</p>
              </div>
              <div>
                <Label>{t("dashboard.instructor.learningOutcomes")}</Label>
                <p className="mb-2 text-xs text-muted-foreground">{lang === "ar" ? "ماذا سيتعلم الطالب من هذه الدورة؟" : "What will students learn from this course?"}</p>
                {outcomes.map((o, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{i + 1}</span>
                    <Input value={o} onChange={(e) => { const c = [...outcomes]; c[i] = e.target.value; setOutcomes(c); }} placeholder={lang === "ar" ? "مثال: فهم مبادئ السلامة المهنية" : "e.g. Understand workplace safety principles"} />
                    <Button size="icon" variant="ghost" onClick={() => setOutcomes(outcomes.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOutcome}><Plus className="mr-1 h-4 w-4" /> {t("dashboard.instructor.addOutcome")}</Button>
              </div>
              <div>
                <Label>{t("dashboard.instructor.requirementsList")}</Label>
                {requirements.map((r, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <Input value={r} onChange={(e) => { const c = [...requirements]; c[i] = e.target.value; setRequirements(c); }} />
                    <Button size="icon" variant="ghost" onClick={() => setRequirements(requirements.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addRequirement}><Plus className="mr-1 h-4 w-4" /> {t("dashboard.instructor.addRequirement")}</Button>
              </div>
            </>
          )}

          {/* Step 4 — Curriculum (courses only) */}
          {step === 3 && productType === "course" && (
            <>
              <p className="text-sm text-muted-foreground mb-4">{lang === "ar" ? "نظّم محتوى دورتك في أقسام ودروس" : "Organize your course content into sections and lessons"}</p>
              {sections.map((sec, si) => (
                <div key={si} className="rounded-xl border bg-secondary/30 p-4 mb-4">
                  <div className="mb-3 flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`${lang === "ar" ? "عنوان القسم" : "Section title"} ${si + 1}`}
                      value={sec.title}
                      onChange={(e) => { const c = [...sections]; c[si].title = e.target.value; setSections(c); }}
                      className="font-medium"
                    />
                    <Button size="icon" variant="ghost" onClick={() => setSections(sections.filter((_, j) => j !== si))}><X className="h-4 w-4" /></Button>
                  </div>
                  {sec.lessons.map((les, li) => (
                    <div key={li} className="mb-2 ms-6 rounded-lg border bg-card p-3">
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder={lang === "ar" ? "عنوان الدرس" : "Lesson title"}
                          value={les.title}
                          onChange={(e) => { const c = [...sections]; c[si].lessons[li].title = e.target.value; setSections(c); }}
                          className="flex-1"
                        />
                        <select className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-xs"
                          value={les.type}
                          onChange={(e) => { const c = [...sections]; c[si].lessons[li].type = e.target.value as any; setSections(c); }}>
                          <option value="video">{lang === "ar" ? "فيديو" : "Video"}</option>
                          <option value="text">{lang === "ar" ? "نص" : "Text"}</option>
                          <option value="quiz">{lang === "ar" ? "اختبار" : "Quiz"}</option>
                        </select>
                        <Input type="number" className="w-20" value={les.duration} placeholder="min"
                          onChange={(e) => { const c = [...sections]; c[si].lessons[li].duration = +e.target.value; setSections(c); }} />
                        <Button size="icon" variant="ghost" onClick={() => {
                          const c = [...sections]; c[si].lessons = c[si].lessons.filter((_, j) => j !== li); setSections(c);
                        }}><X className="h-3 w-3" /></Button>
                      </div>
                      <Input placeholder={les.type === "video" ? "Video URL" : les.type === "text" ? (lang === "ar" ? "محتوى الدرس" : "Lesson content") : "Quiz ID"}
                        value={les.content}
                        onChange={(e) => { const c = [...sections]; c[si].lessons[li].content = e.target.value; setSections(c); }}
                        className="text-xs" />
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="ms-6 mt-2" onClick={() => addLesson(si)}>
                    <Plus className="mr-1 h-3 w-3" /> {t("dashboard.instructor.addLesson")}
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addSection}>
                <Plus className="mr-1 h-4 w-4" /> {t("dashboard.instructor.addSection")}
              </Button>
            </>
          )}

          {/* Step 4 — Book info (books only) */}
          {step === 3 && productType === "book" && (
            <div className="rounded-xl border bg-secondary/30 p-6 text-center">
              <BookOpen className="mx-auto mb-3 h-12 w-12 text-primary/50" />
              <h3 className="mb-2 font-semibold">{lang === "ar" ? "لا يوجد منهج مطلوب للكتب" : lang === "fr" ? "Pas de programme requis pour les livres" : "No curriculum needed for books"}</h3>
              <p className="text-sm text-muted-foreground">{lang === "ar" ? "الكتب لا تحتاج لأقسام ودروس. انتقل للخطوة التالية." : "Books don't need sections and lessons. Continue to the next step."}</p>
            </div>
          )}

          {/* Step 5 — Pricing */}
          {step === 4 && (
            <>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Switch checked={isFree} onCheckedChange={setIsFree} />
                <div>
                  <Label className="text-base">{t("dashboard.instructor.freeToggle")}</Label>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "اجعل الدورة مجانية للجميع" : "Make this course free for everyone"}</p>
                </div>
              </div>
              {!isFree && (
                <div>
                  <Label>{t("dashboard.instructor.coursePrice")} (DZD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className="ps-10" placeholder="15000" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{price > 0 ? `${price.toLocaleString()} DZD` : ""}</p>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Switch checked={cpfEligible} onCheckedChange={setCpfEligible} />
                <div>
                  <Label>{t("dashboard.instructor.cpfEligible")}</Label>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "هل الدورة مؤهلة للتمويل الحكومي؟" : "Is this course eligible for government funding?"}</p>
                </div>
              </div>
            </>
          )}

          {/* Step 6 — Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-secondary/30 overflow-hidden">
                {coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img src={coverImage} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl font-bold text-foreground">{title || (lang === "ar" ? "بدون عنوان" : "Untitled")}</h3>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 text-primary px-3 py-1 capitalize">{level}</span>
                    <span className="rounded-full bg-secondary px-3 py-1">{language === "ar" ? "العربية" : language === "fr" ? "Français" : "English"}</span>
                    <span className="rounded-full bg-accent/10 text-accent px-3 py-1">{isFree ? (lang === "ar" ? "مجاني" : "Free") : `${price.toLocaleString()} DZD`}</span>
                  </div>
                  <div className="pt-3 border-t grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <span>📚 {sections.length} {lang === "ar" ? "أقسام" : "sections"}</span>
                    <span>📖 {totalLessons} {lang === "ar" ? "دروس" : "lessons"}</span>
                    <span>🎯 {outcomes.filter(Boolean).length} {lang === "ar" ? "أهداف تعليمية" : "outcomes"}</span>
                    <span>📋 {requirements.filter(Boolean).length} {lang === "ar" ? "متطلبات" : "requirements"}</span>
                  </div>
                </div>
              </div>
              {description && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-sm">{lang === "ar" ? "الوصف" : "Description"}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">{description}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" /> {t("dashboard.instructor.back")}
        </Button>
        <div className="flex gap-2">
          {step === 5 ? (
            <>
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={submitting}>
                {t("dashboard.instructor.saveDraft")}
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={submitting || !title}>
                {isAdmin ? (lang === "ar" ? "نشر مباشرة" : "Publish Now") : t("dashboard.instructor.publishCourse")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setStep(step + 1)} disabled={!canAdvance()}>
              {t("dashboard.instructor.next")} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
