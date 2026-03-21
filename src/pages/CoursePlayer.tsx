import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mockCourses } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ChevronDown, ChevronRight, CheckCircle2, Circle, Play, FileText,
  HelpCircle, StickyNote, MessageSquare, SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";

const quizQuestions = [
  { q: "What is the primary purpose of this concept?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 },
  { q: "Which of the following is a best practice?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 1 },
  { q: "What is the expected output?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 2 },
];

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const course = mockCourses.find((c) => c.id === courseId);
  const allLessons = useMemo(() => course?.sections.flatMap((s) => s.lessons) ?? [], [course]);
  const currentLesson = allLessons.find((l) => l.id === lessonId);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(course?.sections.map((s) => s.id) ?? [])
  );
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(quizQuestions.map(() => null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!course || !currentLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("courseDetail.courseNotFound")}</h1>
          <Link to="/courses"><Button className="mt-4">{t("catalog.title")}</Button></Link>
        </div>
      </div>
    );
  }

  const progressPercent = allLessons.length > 0 ? Math.round((completed.size / allLessons.length) * 100) : 0;

  const markComplete = () => {
    setCompleted((prev) => new Set(prev).add(currentLesson.id));
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      navigate(`/learn/${courseId}/${next.id}`, { replace: true });
    }
  };

  const goNext = () => {
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      navigate(`/learn/${courseId}/${next.id}`, { replace: true });
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const quizScore = quizAnswers.filter((a, i) => a === quizQuestions[i].correct).length;
  const quizPassed = quizScore >= Math.ceil(quizQuestions.length * 0.7);

  const lessonIcon = (type: string) => {
    if (type === "video") return <Play className="h-3.5 w-3.5" />;
    if (type === "text") return <FileText className="h-3.5 w-3.5" />;
    return <HelpCircle className="h-3.5 w-3.5" />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <Link to={`/courses/${courseId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> {t("coursePlayer.backToCourse")}
          </Link>
          <span className="hidden text-sm font-medium sm:inline">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{progressPercent}%</span>
          <Progress value={progressPercent} className="hidden w-32 sm:block" />
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            ☰
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Video / Content Area */}
          <div className="aspect-video w-full bg-black">
            {currentLesson.type === "video" ? (
              <div className="flex h-full items-center justify-center text-white">
                <div className="text-center">
                  <Play className="mx-auto mb-3 h-16 w-16 text-primary opacity-80" />
                  <p className="text-lg">{currentLesson.title}</p>
                  <p className="mt-1 text-sm text-white/60">{currentLesson.duration}</p>
                </div>
              </div>
            ) : currentLesson.type === "quiz" ? (
              <div className="flex h-full items-center justify-center">
                <Button onClick={() => { setQuizOpen(true); setQuizSubmitted(false); setQuizAnswers(quizQuestions.map(() => null)); }}
                  className="gap-2" size="lg">
                  <HelpCircle className="h-5 w-5" /> {t("coursePlayer.quizTitle")}
                </Button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-white">
                <div className="prose prose-invert max-w-2xl">
                  <h2>{currentLesson.title}</h2>
                  <p>This is a text-based lesson covering the key concepts and principles discussed in this module. Read through the material carefully and take notes as needed.</p>
                </div>
              </div>
            )}
          </div>

          {/* Below Player */}
          <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{currentLesson.type}</Badge>
                  <span>{currentLesson.duration}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={markComplete} disabled={completed.has(currentLesson.id)}
                  className={completed.has(currentLesson.id) ? "bg-green-600 hover:bg-green-700" : ""}>
                  <CheckCircle2 className="me-2 h-4 w-4" />
                  {completed.has(currentLesson.id) ? t("instructions.completed") : t("coursePlayer.markComplete")}
                </Button>
                {currentIndex < allLessons.length - 1 && (
                  <Button variant="outline" onClick={goNext}>
                    <SkipForward className="me-2 h-4 w-4" /> {t("coursePlayer.nextLesson")}
                  </Button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <StickyNote className="h-4 w-4 text-primary" /> {t("coursePlayer.notes")}
              </h3>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder={t("coursePlayer.notesPlaceholder")} rows={4} />
            </div>

            {/* Discussion Placeholder */}
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <MessageSquare className="h-4 w-4 text-primary" /> {t("coursePlayer.discussion")}
              </h3>
              <p className="text-sm text-muted-foreground">{t("coursePlayer.discussionPlaceholder")}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 320 : 0 }}
          className="hidden overflow-hidden border-s bg-card lg:block"
        >
          <div className="h-full w-80 overflow-y-auto p-3">
            <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("courseDetail.curriculum")}
            </h3>
            {course.sections.map((section) => (
              <Collapsible key={section.id} open={openSections.has(section.id)}
                onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary">
                  <span>{section.title}</span>
                  {openSections.has(section.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="space-y-0.5 pb-2 ps-2">
                    {section.lessons.map((lesson) => {
                      const isActive = lesson.id === lessonId;
                      const isDone = completed.has(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => navigate(`/learn/${courseId}/${lesson.id}`, { replace: true })}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-xs transition-colors ${
                              isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary text-muted-foreground"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            {lessonIcon(lesson.type)}
                            <span className="text-[10px] text-muted-foreground">{lesson.duration}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </motion.aside>
      </div>

      {/* Quiz Modal */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("coursePlayer.quizTitle")}</DialogTitle>
          </DialogHeader>
          {!quizSubmitted ? (
            <div className="space-y-5">
              {quizQuestions.map((qq, qi) => (
                <div key={qi}>
                  <p className="mb-2 text-sm font-medium">{qi + 1}. {qq.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {qq.options.map((opt, oi) => (
                      <Button key={oi} size="sm"
                        variant={quizAnswers[qi] === oi ? "default" : "outline"}
                        onClick={() => setQuizAnswers((prev) => { const n = [...prev]; n[qi] = oi; return n; })}
                      >{opt}</Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button className="w-full" onClick={() => setQuizSubmitted(true)}
                disabled={quizAnswers.some((a) => a === null)}>
                {t("coursePlayer.submit")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className={`text-4xl font-bold ${quizPassed ? "text-green-600" : "text-destructive"}`}>
                {quizScore}/{quizQuestions.length}
              </div>
              <p className="text-lg font-medium">
                {quizPassed ? t("coursePlayer.passed") : t("coursePlayer.failed")}
              </p>
              <div className="flex justify-center gap-2">
                {!quizPassed && (
                  <Button variant="outline" onClick={() => { setQuizSubmitted(false); setQuizAnswers(quizQuestions.map(() => null)); }}>
                    {t("coursePlayer.retry")}
                  </Button>
                )}
                <Button onClick={() => { setQuizOpen(false); if (quizPassed) markComplete(); }}>
                  {quizPassed ? t("coursePlayer.nextLesson") : t("common.cancel")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
