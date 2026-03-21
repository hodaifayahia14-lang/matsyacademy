export interface Course {
  id: string;
  type: "course" | "book";
  title: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_fr: string;
  subtitle_ar: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  category_en: string;
  category_fr: string;
  category_ar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  level_en: string;
  level_fr: string;
  level_ar: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  price: number;
  isFree: boolean;
  duration: string;
  lessonCount: number;
  coverImage: string;
  language: string;
  updatedAt: string;
  description: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  learningOutcomes: string[];
  learningOutcomes_en: string[];
  learningOutcomes_fr: string[];
  learningOutcomes_ar: string[];
  requirements: string[];
  requirements_en: string[];
  requirements_fr: string[];
  requirements_ar: string[];
  sections: Section[];
  badge?: string;
  badge_en?: string;
  badge_fr?: string;
  badge_ar?: string;
  format_en: string;
  format_fr: string;
  format_ar: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration: string;
  isPreview: boolean;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  comment_en: string;
  comment_fr: string;
  comment_ar: string;
  date: string;
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    type: "course",
    title: "Workplace Safety & Prevention Agent",
    title_en: "Workplace Safety & Prevention Agent",
    title_fr: "Agent de Sécurité et Prévention des Établissements",
    title_ar: "عون أمن ووقاية المؤسسات",
    subtitle: "Master workplace safety fundamentals and become a certified prevention agent",
    subtitle_en: "Master workplace safety fundamentals and become a certified prevention agent",
    subtitle_fr: "Maîtrisez les fondamentaux de la sécurité au travail et devenez agent de prévention certifié",
    subtitle_ar: "أتقن أساسيات السلامة في بيئة العمل وكن عون أمن ووقاية معتمد",
    instructor: "Dr. Ahmed Maisy",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "HSE Safety",
    category_en: "HSE Safety",
    category_fr: "Sécurité HSE",
    category_ar: "أمن ووقاية",
    level: "Beginner",
    level_en: "Beginner",
    level_fr: "Débutant",
    level_ar: "مبتدئ",
    rating: 4.8,
    reviewCount: 127,
    studentCount: 245,
    price: 15000,
    isFree: false,
    duration: "24h",
    lessonCount: 32,
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-03-01",
    description: "Comprehensive training for workplace safety and prevention agents covering HSE fundamentals, risk assessment, emergency procedures, and fire safety protocols.",
    description_en: "Comprehensive training for workplace safety and prevention agents covering HSE fundamentals, risk assessment, emergency procedures, and fire safety protocols.",
    description_fr: "Formation complète pour les agents de sécurité et prévention couvrant les fondamentaux HSE, l'évaluation des risques, les procédures d'urgence et les protocoles de sécurité incendie.",
    description_ar: "تدريب شامل لعوانة أمن ووقاية المؤسسات يغطي أساسيات السلامة والصحة المهنية، تقييم المخاطر، إجراءات الطوارئ، وبروتوكولات السلامة من الحرائق.",
    learningOutcomes: ["Understand HSE regulations and compliance", "Conduct workplace risk assessments", "Implement fire safety and emergency protocols", "Use PPE correctly", "Earn a recognized safety certification"],
    learningOutcomes_en: ["Understand HSE regulations and compliance", "Conduct workplace risk assessments", "Implement fire safety and emergency protocols", "Use PPE correctly", "Earn a recognized safety certification"],
    learningOutcomes_fr: ["Comprendre les réglementations HSE", "Effectuer des évaluations des risques", "Mettre en œuvre les protocoles d'urgence", "Utiliser correctement les EPI", "Obtenir une certification reconnue"],
    learningOutcomes_ar: ["فهم لوائح السلامة والصحة المهنية", "إجراء تقييم المخاطر", "تطبيق بروتوكولات الطوارئ والسلامة", "استخدام معدات الحماية الشخصية", "الحصول على شهادة معتمدة"],
    requirements: ["No prior experience required", "A computer with internet access"],
    requirements_en: ["No prior experience required", "A computer with internet access"],
    requirements_fr: ["Aucune expérience préalable requise", "Un ordinateur avec accès internet"],
    requirements_ar: ["لا يتطلب خبرة سابقة", "حاسوب مع اتصال بالإنترنت"],
    badge: "🔥 Promo",
    badge_en: "🔥 Promo",
    badge_fr: "🔥 Promo",
    badge_ar: "🔥 عرض خاص",
    format_en: "Online Recorded",
    format_fr: "En ligne enregistré",
    format_ar: "تكوين عن بعد مسجل",
    sections: [
      { id: "s1-1", title: "Introduction to Workplace Safety", lessons: [
        { id: "l1-1-1", title: "What is HSE?", type: "video", duration: "15:00", isPreview: true },
        { id: "l1-1-2", title: "Safety Regulations Overview", type: "video", duration: "20:00", isPreview: false },
        { id: "l1-1-3", title: "Quiz: HSE Basics", type: "quiz", duration: "10:00", isPreview: false },
      ]},
      { id: "s1-2", title: "Risk Assessment", lessons: [
        { id: "l1-2-1", title: "Identifying Workplace Hazards", type: "video", duration: "25:00", isPreview: false },
        { id: "l1-2-2", title: "Risk Evaluation Methods", type: "video", duration: "20:00", isPreview: false },
      ]},
      { id: "s1-3", title: "Fire Safety & Emergency", lessons: [
        { id: "l1-3-1", title: "Fire Prevention", type: "video", duration: "20:00", isPreview: false },
        { id: "l1-3-2", title: "Emergency Evacuation Procedures", type: "video", duration: "18:00", isPreview: false },
        { id: "l1-3-3", title: "Using Fire Extinguishers", type: "video", duration: "12:00", isPreview: false },
      ]},
      { id: "s1-4", title: "Personal Protective Equipment", lessons: [
        { id: "l1-4-1", title: "Types of PPE", type: "video", duration: "15:00", isPreview: false },
        { id: "l1-4-2", title: "Final Assessment", type: "quiz", duration: "20:00", isPreview: false },
      ]},
    ],
  },
  {
    id: "course-2",
    type: "course",
    title: "Workplace Safety & Prevention Inspector",
    title_en: "Workplace Safety & Prevention Inspector",
    title_fr: "Inspecteur de Sécurité et Prévention des Établissements",
    title_ar: "مفتش أمن ووقاية المؤسسات",
    subtitle: "Advanced inspection techniques and safety management for certified inspectors",
    subtitle_en: "Advanced inspection techniques and safety management for certified inspectors",
    subtitle_fr: "Techniques avancées d'inspection et gestion de la sécurité pour inspecteurs certifiés",
    subtitle_ar: "تقنيات التفتيش المتقدمة وإدارة السلامة للمفتشين المعتمدين",
    instructor: "Dr. Ahmed Maisy",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "HSE Safety",
    category_en: "HSE Safety",
    category_fr: "Sécurité HSE",
    category_ar: "أمن ووقاية",
    level: "Intermediate",
    level_en: "Intermediate",
    level_fr: "Intermédiaire",
    level_ar: "متوسط",
    rating: 4.9,
    reviewCount: 89,
    studentCount: 178,
    price: 20000,
    isFree: false,
    duration: "30h",
    lessonCount: 40,
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-03-10",
    description: "Advanced training for workplace safety inspectors covering inspection methodologies, compliance auditing, incident investigation, and safety management systems.",
    description_en: "Advanced training for workplace safety inspectors covering inspection methodologies, compliance auditing, incident investigation, and safety management systems.",
    description_fr: "Formation avancée pour inspecteurs de sécurité couvrant les méthodologies d'inspection, l'audit de conformité et les systèmes de gestion de la sécurité.",
    description_ar: "تدريب متقدم لمفتشي أمن ووقاية المؤسسات يغطي منهجيات التفتيش التفصيلية، تدقيق الامتثال، التحقيق في الحوادث، وأنظمة إدارة السلامة.",
    learningOutcomes: ["Master safety inspection techniques", "Conduct compliance audits", "Investigate workplace incidents", "Implement safety management systems", "Prepare professional inspection reports"],
    learningOutcomes_en: ["Master safety inspection techniques", "Conduct compliance audits", "Investigate workplace incidents", "Implement safety management systems", "Prepare professional inspection reports"],
    learningOutcomes_fr: ["Maîtriser les techniques d'inspection", "Réaliser des audits de conformité", "Enquêter sur les incidents", "Implémenter des systèmes de gestion de sécurité", "Préparer des rapports d'inspection"],
    learningOutcomes_ar: ["إتقان تقنيات التفتيش الأمني", "إجراء تدقيق الامتثال", "التحقيق في حوادث العمل", "تطبيق أنظمة إدارة السلامة", "إعداد تقارير تفتيش احترافية"],
    requirements: ["Basic HSE knowledge recommended", "A computer with internet access"],
    requirements_en: ["Basic HSE knowledge recommended", "A computer with internet access"],
    requirements_fr: ["Connaissances HSE de base recommandées", "Un ordinateur avec accès internet"],
    requirements_ar: ["يوصى بمعرفة أساسية بالسلامة", "حاسوب مع اتصال بالإنترنت"],
    badge: "⭐ Popular",
    badge_en: "⭐ Popular",
    badge_fr: "⭐ Populaire",
    badge_ar: "⭐ الأكثر طلباً",
    format_en: "Online Recorded",
    format_fr: "En ligne enregistré",
    format_ar: "تكوين عن بعد مسجل",
    sections: [
      { id: "s2-1", title: "Advanced Safety Inspection", lessons: [
        { id: "l2-1-1", title: "Inspection Methodology", type: "video", duration: "25:00", isPreview: true },
        { id: "l2-1-2", title: "Inspection Checklists", type: "video", duration: "20:00", isPreview: false },
      ]},
      { id: "s2-2", title: "Compliance Auditing", lessons: [
        { id: "l2-2-1", title: "Audit Planning", type: "video", duration: "20:00", isPreview: false },
        { id: "l2-2-2", title: "Conducting Audits", type: "video", duration: "25:00", isPreview: false },
        { id: "l2-2-3", title: "Quiz: Compliance", type: "quiz", duration: "10:00", isPreview: false },
      ]},
      { id: "s2-3", title: "Incident Investigation", lessons: [
        { id: "l2-3-1", title: "Investigation Techniques", type: "video", duration: "22:00", isPreview: false },
        { id: "l2-3-2", title: "Root Cause Analysis", type: "video", duration: "20:00", isPreview: false },
        { id: "l2-3-3", title: "Final Assessment", type: "quiz", duration: "25:00", isPreview: false },
      ]},
    ],
  },
  {
    id: "course-3",
    type: "course",
    title: "Professional Hajj & Umrah Guide",
    title_en: "Professional Hajj & Umrah Guide",
    title_fr: "Guide Professionnel du Hajj et Omra",
    title_ar: "المرشد المحترف للحج والعمرة",
    subtitle: "Comprehensive guide training for Hajj and Umrah pilgrimage",
    subtitle_en: "Comprehensive guide training for Hajj and Umrah pilgrimage",
    subtitle_fr: "Formation complète de guide pour le pèlerinage du Hajj et de la Omra",
    subtitle_ar: "تدريب شامل للمرشدين المحترفين للحج والعمرة",
    instructor: "Sheikh Ibrahim Khalil",
    instructorAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    category: "Religious Guidance",
    category_en: "Religious Guidance",
    category_fr: "Guide Religieux",
    category_ar: "إرشاد ديني",
    level: "Beginner",
    level_en: "All Levels",
    level_fr: "Tous niveaux",
    level_ar: "جميع المستويات",
    rating: 4.9,
    reviewCount: 203,
    studentCount: 312,
    price: 12000,
    isFree: false,
    duration: "20h",
    lessonCount: 28,
    coverImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-02-15",
    description: "Complete professional training for Hajj and Umrah guides covering rituals, logistics, group management, and spiritual guidance.",
    description_en: "Complete professional training for Hajj and Umrah guides covering rituals, logistics, group management, and spiritual guidance.",
    description_fr: "Formation professionnelle complète pour les guides du Hajj et de la Omra couvrant les rituels, la logistique et l'accompagnement spirituel.",
    description_ar: "تدريب مهني شامل لمرشدي الحج والعمرة يغطي المناسك، اللوجستيات، إدارة المجموعات، والإرشاد الروحي.",
    learningOutcomes: ["Master all Hajj and Umrah rituals", "Guide pilgrim groups professionally", "Handle logistics and emergencies", "Earn a professional guide certification"],
    learningOutcomes_en: ["Master all Hajj and Umrah rituals", "Guide pilgrim groups professionally", "Handle logistics and emergencies", "Earn a professional guide certification"],
    learningOutcomes_fr: ["Maîtriser tous les rituels du Hajj et de la Omra", "Guider des groupes professionnellement", "Gérer la logistique et les urgences", "Obtenir une certification de guide"],
    learningOutcomes_ar: ["إتقان جميع مناسك الحج والعمرة", "إرشاد مجموعات الحجاج باحترافية", "إدارة اللوجستيات والطوارئ", "الحصول على شهادة مرشد محترف"],
    requirements: ["Basic Islamic knowledge", "A computer with internet access"],
    requirements_en: ["Basic Islamic knowledge", "A computer with internet access"],
    requirements_fr: ["Connaissances islamiques de base", "Un ordinateur avec accès internet"],
    requirements_ar: ["معرفة إسلامية أساسية", "حاسوب مع اتصال بالإنترنت"],
    badge: "🎁 Bonus",
    badge_en: "🎁 Bonus: Free Umrah draw",
    badge_fr: "🎁 Bonus: Tirage Omra gratuite",
    badge_ar: "🎁 بونص: المشاركة في سحب عمرة مجانية",
    format_en: "Online Recorded",
    format_fr: "En ligne enregistré",
    format_ar: "تكوين عن بعد مسجل",
    sections: [
      { id: "s3-1", title: "Introduction to Hajj & Umrah", lessons: [
        { id: "l3-1-1", title: "History and Significance", type: "video", duration: "20:00", isPreview: true },
        { id: "l3-1-2", title: "Types of Hajj", type: "video", duration: "15:00", isPreview: false },
      ]},
      { id: "s3-2", title: "Umrah Rituals", lessons: [
        { id: "l3-2-1", title: "Ihram and Niyyah", type: "video", duration: "15:00", isPreview: false },
        { id: "l3-2-2", title: "Tawaf", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-2-3", title: "Sa'i", type: "video", duration: "18:00", isPreview: false },
      ]},
      { id: "s3-3", title: "Hajj Rituals", lessons: [
        { id: "l3-3-1", title: "Day of Arafah", type: "video", duration: "22:00", isPreview: false },
        { id: "l3-3-2", title: "Muzdalifah and Mina", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-3-3", title: "Farewell Tawaf", type: "video", duration: "12:00", isPreview: false },
      ]},
      { id: "s3-4", title: "Guide Responsibilities", lessons: [
        { id: "l3-4-1", title: "Group Management", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-4-2", title: "Final Assessment", type: "quiz", duration: "20:00", isPreview: false },
      ]},
    ],
  },
  // ─── BOOKS ───
  {
    id: "book-1",
    type: "book",
    title: "HSE Safety Manual",
    title_en: "HSE Safety Manual",
    title_fr: "Manuel de Sécurité HSE",
    title_ar: "دليل السلامة والصحة المهنية",
    subtitle: "Complete reference guide for workplace safety professionals",
    subtitle_en: "Complete reference guide for workplace safety professionals",
    subtitle_fr: "Guide de référence complet pour les professionnels de la sécurité",
    subtitle_ar: "دليل مرجعي شامل لمتخصصي السلامة في بيئة العمل",
    instructor: "Dr. Ahmed Maisy",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "HSE Safety",
    category_en: "HSE Safety",
    category_fr: "Sécurité HSE",
    category_ar: "أمن ووقاية",
    level: "Beginner",
    level_en: "All Levels",
    level_fr: "Tous niveaux",
    level_ar: "جميع المستويات",
    rating: 4.7,
    reviewCount: 64,
    studentCount: 180,
    price: 2500,
    isFree: false,
    duration: "320 pages",
    lessonCount: 12,
    coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-01-15",
    description: "A comprehensive HSE safety manual covering regulations, risk assessment frameworks, PPE guidelines, and emergency response procedures.",
    description_en: "A comprehensive HSE safety manual covering regulations, risk assessment frameworks, PPE guidelines, and emergency response procedures.",
    description_fr: "Un manuel complet de sécurité HSE couvrant les réglementations, les cadres d'évaluation des risques et les procédures d'urgence.",
    description_ar: "دليل شامل للسلامة والصحة المهنية يغطي اللوائح وأطر تقييم المخاطر وإرشادات معدات الحماية وإجراءات الاستجابة للطوارئ.",
    learningOutcomes: ["HSE regulations reference", "Risk assessment templates", "PPE selection guide", "Emergency procedures"],
    learningOutcomes_en: ["HSE regulations reference", "Risk assessment templates", "PPE selection guide", "Emergency procedures"],
    learningOutcomes_fr: ["Référence réglementaire HSE", "Modèles d'évaluation des risques", "Guide de sélection des EPI", "Procédures d'urgence"],
    learningOutcomes_ar: ["مرجع لوائح السلامة", "نماذج تقييم المخاطر", "دليل اختيار معدات الحماية", "إجراءات الطوارئ"],
    requirements: [],
    requirements_en: [],
    requirements_fr: [],
    requirements_ar: [],
    badge: "📚 New",
    badge_en: "📚 New",
    badge_fr: "📚 Nouveau",
    badge_ar: "📚 جديد",
    format_en: "Digital Book (PDF)",
    format_fr: "Livre numérique (PDF)",
    format_ar: "كتاب رقمي (PDF)",
    sections: [],
  },
  {
    id: "book-2",
    type: "book",
    title: "Hajj & Umrah Complete Guide",
    title_en: "Hajj & Umrah Complete Guide",
    title_fr: "Guide Complet Hajj et Omra",
    title_ar: "الدليل الشامل للحج والعمرة",
    subtitle: "Everything you need to know about Hajj and Umrah rituals",
    subtitle_en: "Everything you need to know about Hajj and Umrah rituals",
    subtitle_fr: "Tout ce que vous devez savoir sur les rituels du Hajj et de la Omra",
    subtitle_ar: "كل ما تحتاج معرفته عن مناسك الحج والعمرة",
    instructor: "Sheikh Ibrahim Khalil",
    instructorAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    category: "Religious Guidance",
    category_en: "Religious Guidance",
    category_fr: "Guide Religieux",
    category_ar: "إرشاد ديني",
    level: "Beginner",
    level_en: "All Levels",
    level_fr: "Tous niveaux",
    level_ar: "جميع المستويات",
    rating: 4.8,
    reviewCount: 92,
    studentCount: 250,
    price: 1800,
    isFree: false,
    duration: "280 pages",
    lessonCount: 10,
    coverImage: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-02-01",
    description: "A detailed guide book covering all Hajj and Umrah rituals, supplications, logistics tips, and spiritual preparation for pilgrims.",
    description_en: "A detailed guide book covering all Hajj and Umrah rituals, supplications, logistics tips, and spiritual preparation for pilgrims.",
    description_fr: "Un guide détaillé couvrant tous les rituels du Hajj et de la Omra, les invocations et la préparation spirituelle.",
    description_ar: "دليل تفصيلي يغطي جميع مناسك الحج والعمرة والأدعية ونصائح اللوجستيات والتحضير الروحي للحجاج.",
    learningOutcomes: ["Complete Hajj rituals guide", "Umrah step-by-step", "Supplications collection", "Logistics planning tips"],
    learningOutcomes_en: ["Complete Hajj rituals guide", "Umrah step-by-step", "Supplications collection", "Logistics planning tips"],
    learningOutcomes_fr: ["Guide complet des rituels du Hajj", "Omra étape par étape", "Recueil d'invocations", "Conseils logistiques"],
    learningOutcomes_ar: ["دليل مناسك الحج الكامل", "خطوات العمرة", "مجموعة أدعية", "نصائح تخطيط اللوجستيات"],
    requirements: [],
    requirements_en: [],
    requirements_fr: [],
    requirements_ar: [],
    badge: "📖 Bestseller",
    badge_en: "📖 Bestseller",
    badge_fr: "📖 Best-seller",
    badge_ar: "📖 الأكثر مبيعاً",
    format_en: "Digital Book (PDF)",
    format_fr: "Livre numérique (PDF)",
    format_ar: "كتاب رقمي (PDF)",
    sections: [],
  },
  {
    id: "book-3",
    type: "book",
    title: "Workplace Inspection Handbook",
    title_en: "Workplace Inspection Handbook",
    title_fr: "Manuel d'Inspection des Lieux de Travail",
    title_ar: "كتاب التفتيش المهني",
    subtitle: "Practical handbook for safety inspection professionals",
    subtitle_en: "Practical handbook for safety inspection professionals",
    subtitle_fr: "Manuel pratique pour les professionnels de l'inspection de sécurité",
    subtitle_ar: "كتاب عملي لمتخصصي التفتيش الأمني",
    instructor: "Dr. Ahmed Maisy",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    category: "HSE Safety",
    category_en: "HSE Safety",
    category_fr: "Sécurité HSE",
    category_ar: "أمن ووقاية",
    level: "Intermediate",
    level_en: "Intermediate",
    level_fr: "Intermédiaire",
    level_ar: "متوسط",
    rating: 4.6,
    reviewCount: 45,
    studentCount: 120,
    price: 2000,
    isFree: false,
    duration: "240 pages",
    lessonCount: 8,
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-01-20",
    description: "A practical handbook with checklists, templates, and guidelines for conducting professional workplace safety inspections.",
    description_en: "A practical handbook with checklists, templates, and guidelines for conducting professional workplace safety inspections.",
    description_fr: "Un manuel pratique avec des listes de contrôle et des directives pour les inspections de sécurité professionnelles.",
    description_ar: "كتاب عملي يحتوي على قوائم مراجعة ونماذج وإرشادات لإجراء عمليات تفتيش السلامة المهنية.",
    learningOutcomes: ["Inspection checklists", "Audit templates", "Report writing guide", "Compliance frameworks"],
    learningOutcomes_en: ["Inspection checklists", "Audit templates", "Report writing guide", "Compliance frameworks"],
    learningOutcomes_fr: ["Listes de contrôle d'inspection", "Modèles d'audit", "Guide de rédaction de rapports", "Cadres de conformité"],
    learningOutcomes_ar: ["قوائم مراجعة التفتيش", "نماذج التدقيق", "دليل كتابة التقارير", "أطر الامتثال"],
    requirements: [],
    requirements_en: [],
    requirements_fr: [],
    requirements_ar: [],
    format_en: "Digital Book (PDF)",
    format_fr: "Livre numérique (PDF)",
    format_ar: "كتاب رقمي (PDF)",
    sections: [],
  },
];

export const mockReviews: Review[] = [
  { id: "r1", user: "Karim Bouzid", avatar: "https://randomuser.me/api/portraits/men/11.jpg", rating: 5, comment: "Excellent training! I got my HSE certification thanks to this course.", comment_en: "Excellent training! I got my HSE certification thanks to this course.", comment_fr: "Excellente formation ! J'ai obtenu ma certification HSE grâce à ce cours.", comment_ar: "تدريب ممتاز! حصلت على شهادة السلامة بفضل هذه الدورة.", date: "2025-02-15" },
  { id: "r2", user: "Amina Belhadj", avatar: "https://randomuser.me/api/portraits/women/21.jpg", rating: 5, comment: "Very professional content. The instructor explains everything clearly.", comment_en: "Very professional content. The instructor explains everything clearly.", comment_fr: "Contenu très professionnel. Le formateur explique tout clairement.", comment_ar: "محتوى احترافي جداً. المدرب يشرح كل شيء بوضوح.", date: "2025-02-01" },
  { id: "r3", user: "Youcef Hamdi", avatar: "https://randomuser.me/api/portraits/men/45.jpg", rating: 5, comment: "The Hajj guide course was incredibly comprehensive. Highly recommended!", comment_en: "The Hajj guide course was incredibly comprehensive. Highly recommended!", comment_fr: "Le cours de guide du Hajj était incroyablement complet. Très recommandé !", comment_ar: "دورة مرشد الحج كانت شاملة بشكل لا يصدق. أنصح بها بشدة!", date: "2025-01-20" },
  { id: "r4", user: "Fatima Zerhouni", avatar: "https://randomuser.me/api/portraits/women/33.jpg", rating: 4, comment: "Great platform with well-structured courses.", comment_en: "Great platform with well-structured courses.", comment_fr: "Excellente plateforme avec des cours bien structurés.", comment_ar: "منصة رائعة مع دورات منظمة بشكل جيد.", date: "2025-01-10" },
  { id: "r5", user: "Mohamed Saidi", avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 5, comment: "Dr. Ahmed Maisy is an exceptional instructor.", comment_en: "Dr. Ahmed Maisy is an exceptional instructor.", comment_fr: "Dr. Ahmed Maisy est un formateur exceptionnel.", comment_ar: "الدكتور أحمد مايسي مدرب استثنائي.", date: "2024-12-28" },
];

export const mockCategories = [
  { name: "HSE Safety", name_en: "HSE Safety", name_fr: "Sécurité HSE", name_ar: "أمن ووقاية", icon: "Shield", slug: "hse-safety", courseCount: 2 },
  { name: "Religious Guidance", name_en: "Religious Guidance", name_fr: "Guide Religieux", name_ar: "إرشاد ديني", icon: "BookOpen", slug: "religious-guidance", courseCount: 1 },
  { name: "Certified Training", name_en: "Certified Training", name_fr: "Formation Certifiée", name_ar: "تكوين معتمد", icon: "Award", slug: "certified-training", courseCount: 3 },
];
