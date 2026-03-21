import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "1",
    title: "10 Tips to Succeed in Online Learning",
    titleFr: "10 conseils pour réussir l'apprentissage en ligne",
    titleAr: "10 نصائح للنجاح في التعلم عبر الإنترنت",
    author: "Dr. Sarah Johnson",
    date: "2024-12-01",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    content: `Online learning has transformed education, making it accessible to millions worldwide. Here are our top tips for making the most of your online learning journey.\n\n## 1. Set Up a Dedicated Study Space\nHaving a quiet, organized space for learning helps you focus and signals to your brain that it's time to study.\n\n## 2. Create a Schedule\nTreat your online courses like in-person classes. Block out specific times for studying and stick to them.\n\n## 3. Take Active Notes\nDon't just watch videos passively. Take notes, highlight key points, and summarize what you've learned.\n\n## 4. Participate in Discussions\nEngage with fellow students in forums and Q&A sections. Teaching others is one of the best ways to learn.\n\n## 5. Practice Regularly\nApply what you learn through exercises, projects, and real-world applications.\n\n## 6. Don't Be Afraid to Ask Questions\nInstructors and communities are there to help. No question is too basic.\n\n## 7. Review and Revise\nSpaced repetition helps cement knowledge. Review material regularly.\n\n## 8. Take Breaks\nThe Pomodoro technique (25 min study, 5 min break) can boost productivity.\n\n## 9. Track Your Progress\nUse the platform's progress tracking features to stay motivated.\n\n## 10. Celebrate Milestones\nReward yourself when you complete sections or earn certificates.`,
    contentFr: `L'apprentissage en ligne a transformé l'éducation. Voici nos meilleurs conseils pour tirer le meilleur parti de votre parcours d'apprentissage en ligne.\n\n## 1. Aménagez un espace d'étude dédié\nAvoir un espace calme et organisé vous aide à vous concentrer.\n\n## 2. Créez un emploi du temps\nTraitez vos cours en ligne comme des cours en présentiel.\n\n## 3. Prenez des notes actives\nNe regardez pas les vidéos passivement. Prenez des notes et résumez ce que vous avez appris.`,
    contentAr: `لقد غيّر التعلم عبر الإنترنت التعليم وجعله في متناول الملايين حول العالم. إليك أفضل نصائحنا.\n\n## 1. خصص مكاناً للدراسة\nوجود مكان هادئ ومنظم يساعدك على التركيز.\n\n## 2. أنشئ جدولاً زمنياً\nتعامل مع دوراتك عبر الإنترنت كما تتعامل مع الحصص الحضورية.\n\n## 3. دوّن ملاحظات فعّالة\nلا تكتفِ بمشاهدة الفيديوهات بشكل سلبي.`,
  },
  {
    id: "2",
    title: "The Future of E-Learning in 2025",
    titleFr: "L'avenir de l'e-learning en 2025",
    titleAr: "مستقبل التعلم الإلكتروني في 2025",
    author: "Prof. Ahmed Ali",
    date: "2024-11-20",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    content: `The e-learning industry continues to evolve at a rapid pace. AI-powered personalization, immersive VR classrooms, and micro-credentials are shaping the future of online education.\n\nArtificial intelligence is enabling truly personalized learning paths, adapting content difficulty and pace to each student's needs. Virtual reality is making remote learning more immersive than ever.`,
    contentFr: `L'industrie de l'e-learning continue d'évoluer rapidement. L'IA, la réalité virtuelle et les micro-certifications façonnent l'avenir de l'éducation en ligne.`,
    contentAr: `تستمر صناعة التعلم الإلكتروني في التطور بوتيرة سريعة. الذكاء الاصطناعي والواقع الافتراضي والشهادات المصغرة تشكل مستقبل التعليم عبر الإنترنت.`,
  },
  {
    id: "3",
    title: "How to Choose the Right Course for Your Career",
    titleFr: "Comment choisir le bon cours pour votre carrière",
    titleAr: "كيف تختار الدورة المناسبة لمسيرتك المهنية",
    author: "Marie Dupont",
    date: "2024-11-10",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    content: `Choosing the right course can be overwhelming with so many options available. Here's a framework to help you make the best decision.\n\nStart by identifying your career goals. What skills do you need? What certifications are valued in your industry? Research job postings to understand what employers are looking for.`,
    contentFr: `Choisir le bon cours peut être difficile avec autant d'options disponibles. Voici un cadre pour vous aider à prendre la meilleure décision.`,
    contentAr: `قد يكون اختيار الدورة المناسبة أمرًا صعبًا مع وجود العديد من الخيارات المتاحة. إليك إطار عمل لمساعدتك في اتخاذ القرار الأفضل.`,
  },
];

export default function BlogDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("common.notFound")}</h1>
          <Link to="/blog"><Button className="mt-4">{t("blog.backToBlog")}</Button></Link>
        </div>
      </div>
    );
  }

  const title = lang === "fr" ? post.titleFr : lang === "ar" ? post.titleAr : post.title;
  const content = lang === "fr" ? post.contentFr : lang === "ar" ? post.contentAr : post.content;

  return (
    <div className="bg-background py-12">
      <div className="container max-w-3xl">
        <Link to="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {t("blog.backToBlog")}
        </Link>

        <img src={post.image} alt={title} className="mb-6 w-full rounded-xl object-cover" style={{ maxHeight: 400 }} />

        <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
        </div>

        <div className="prose prose-green mt-8 max-w-none dark:prose-invert">
          {content.split("\n\n").map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="mt-6 text-xl font-bold">{block.replace("## ", "")}</h2>
            ) : (
              <p key={i}>{block}</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
