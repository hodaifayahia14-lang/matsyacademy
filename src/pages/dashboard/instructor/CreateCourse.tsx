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
import { toast } from "@/components/ui/sonner";
import { Plus, X, ChevronRight, ChevronLeft, Check } from "lucide-react";

const steps = ["step1", "step2", "step3", "step4", "step5", "step6"] as const;
const levelOptions = ["beginner", "intermediate", "advanced"];
const langOptions = ["en", "fr", "ar"];

interface SectionDraft {
  title: string;
  lessons: { title: string; type: "video" | "text" | "quiz"; duration: number }[];
}

export default function CreateCourse() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [language, setLanguage] = useState("en");
  const [tags, setTags] = useState("");

  // Step 2
  const [coverImage, setCoverImage] = useState("");
  const [promoVideo, setPromoVideo] = useState("");

  // Step 3
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([""]);
  const [requirements, setRequirements] = useState<string[]>([""]);

  // Step 4
  const [sections, setSections] = useState<SectionDraft[]>([{ title: "", lessons: [{ title: "", type: "video", duration: 10 }] }]);

  // Step 5
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

  const handleSubmit = async (asDraft: boolean) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { data: course, error } = await supabase.from("courses").insert({
        title,
        subtitle,
        description,
        category_id: categoryId || null,
        level: level as any,
        language,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        cover_image: coverImage || null,
        promo_video: promoVideo || null,
        instructor_id: user.id,
        is_free: isFree,
        price: isFree ? 0 : price,
        cpf_eligible: cpfEligible,
        status: asDraft ? "draft" : "pending",
        learning_outcomes: outcomes.filter(Boolean),
        requirements: requirements.filter(Boolean),
      }).select().single();

      if (error) throw error;

      // Create sections and lessons
      for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        if (!sec.title) continue;
        const { data: sectionData, error: secErr } = await supabase.from("sections").insert({
          course_id: course.id,
          title: sec.title,
          order: si,
        }).select().single();
        if (secErr) throw secErr;

        for (let li = 0; li < sec.lessons.length; li++) {
          const lesson = sec.lessons[li];
          if (!lesson.title) continue;
          await supabase.from("lessons").insert({
            section_id: sectionData.id,
            title: lesson.title,
            type: lesson.type as any,
            duration_minutes: lesson.duration,
            order: li,
          });
        }
      }

      toast.success(asDraft ? "Draft saved" : "Course submitted for review");
      navigate("/dashboard/instructor");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const addOutcome = () => setOutcomes([...outcomes, ""]);
  const addRequirement = () => setRequirements([...requirements, ""]);
  const addSection = () => setSections([...sections, { title: "", lessons: [{ title: "", type: "video", duration: 10 }] }]);
  const addLesson = (si: number) => {
    const copy = [...sections];
    copy[si].lessons.push({ title: "", type: "video", duration: 10 });
    setSections(copy);
  };

  const sel = "w-full rounded-lg border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">{t("dashboard.instructor.createCourse")}</h1>

      {/* Step indicators */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            {i < steps.length - 1 && <div className={`h-0.5 w-8 ${i < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl space-y-4">
        {step === 0 && (
          <>
            <div>
              <Label>{t("dashboard.instructor.courseTitle")}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete Web Dev" />
            </div>
            <div>
              <Label>{t("dashboard.instructor.courseSubtitle")}</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
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
                  {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <Label>{t("dashboard.instructor.selectLanguage")}</Label>
                <select className={sel} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {langOptions.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>{t("dashboard.instructor.tags")}</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="web, javascript, react" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <Label>{t("dashboard.instructor.coverImage")}</Label>
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>{t("dashboard.instructor.promoVideo")}</Label>
              <Input value={promoVideo} onChange={(e) => setPromoVideo(e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <Label>{t("dashboard.instructor.courseDescription")}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
            </div>
            <div>
              <Label>{t("dashboard.instructor.learningOutcomes")}</Label>
              {outcomes.map((o, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input value={o} onChange={(e) => { const c = [...outcomes]; c[i] = e.target.value; setOutcomes(c); }} />
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

        {step === 3 && (
          <>
            {sections.map((sec, si) => (
              <div key={si} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Input
                    placeholder={`${t("dashboard.instructor.sectionTitle")} ${si + 1}`}
                    value={sec.title}
                    onChange={(e) => { const c = [...sections]; c[si].title = e.target.value; setSections(c); }}
                  />
                  <Button size="icon" variant="ghost" onClick={() => setSections(sections.filter((_, j) => j !== si))}><X className="h-4 w-4" /></Button>
                </div>
                {sec.lessons.map((les, li) => (
                  <div key={li} className="mb-2 ml-4 flex gap-2">
                    <Input
                      placeholder={t("dashboard.instructor.lessonTitle")}
                      value={les.title}
                      onChange={(e) => { const c = [...sections]; c[si].lessons[li].title = e.target.value; setSections(c); }}
                      className="flex-1"
                    />
                    <select
                      className="w-24 rounded-lg border bg-card px-2 py-1 text-xs"
                      value={les.type}
                      onChange={(e) => { const c = [...sections]; c[si].lessons[li].type = e.target.value as any; setSections(c); }}
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <Input
                      type="number"
                      className="w-20"
                      value={les.duration}
                      onChange={(e) => { const c = [...sections]; c[si].lessons[li].duration = +e.target.value; setSections(c); }}
                    />
                    <Button size="icon" variant="ghost" onClick={() => {
                      const c = [...sections]; c[si].lessons = c[si].lessons.filter((_, j) => j !== li); setSections(c);
                    }}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="ml-4" onClick={() => addLesson(si)}>
                  <Plus className="mr-1 h-3 w-3" /> {t("dashboard.instructor.addLesson")}
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={addSection}>
              <Plus className="mr-1 h-4 w-4" /> {t("dashboard.instructor.addSection")}
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="flex items-center gap-3">
              <Switch checked={isFree} onCheckedChange={setIsFree} />
              <Label>{t("dashboard.instructor.freeToggle")}</Label>
            </div>
            {!isFree && (
              <div>
                <Label>{t("dashboard.instructor.coursePrice")}</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch checked={cpfEligible} onCheckedChange={setCpfEligible} />
              <Label>{t("dashboard.instructor.cpfEligible")}</Label>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Review</h2>
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-sm">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Level:</strong> {level}</p>
              <p><strong>Language:</strong> {language}</p>
              <p><strong>Price:</strong> {isFree ? "Free" : `$${price}`}</p>
              <p><strong>Sections:</strong> {sections.length}</p>
              <p><strong>Total Lessons:</strong> {sections.reduce((a, s) => a + s.lessons.length, 0)}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
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
                  {t("dashboard.instructor.publishCourse")}
                </Button>
              </>
            ) : (
              <Button onClick={() => setStep(step + 1)}>
                {t("dashboard.instructor.next")} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
