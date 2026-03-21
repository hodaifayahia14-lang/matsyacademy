export interface Course {
  id: string;
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
    title: "Workplace Safety & Prevention Agent",
    title_en: "Workplace Safety & Prevention Agent",
    title_fr: "Agent de Sécurité et Prévention des Établissements",
    title_ar: "عون أمن ووقاية المؤسسات",
    subtitle: "Master workplace safety fundamentals and become a certified prevention agent",
    subtitle_en: "Master workplace safety fundamentals and become a certified prevention agent",
    subtitle_fr: "Maîtrisez les fondamentaux de la sécurité au travail et devenez agent de prévention certifié",
    subtitle_ar: "أتقن أساسيات السلامة في بيئة العمل وكن عون أمن ووقاية معتمد",
    instructor: "Dr. Ahmed Matsy",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedMatsy",
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
    price: 0,
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
    learningOutcomes: ["Understand HSE regulations and compliance", "Conduct workplace risk assessments", "Implement fire safety and emergency protocols", "Use personal protective equipment (PPE) correctly", "Earn a recognized safety certification"],
    learningOutcomes_en: ["Understand HSE regulations and compliance", "Conduct workplace risk assessments", "Implement fire safety and emergency protocols", "Use personal protective equipment (PPE) correctly", "Earn a recognized safety certification"],
    learningOutcomes_fr: ["Comprendre les réglementations HSE", "Effectuer des évaluations des risques", "Mettre en œuvre les protocoles d'urgence et incendie", "Utiliser correctement les EPI", "Obtenir une certification reconnue"],
    learningOutcomes_ar: ["فهم لوائح السلامة والصحة المهنية", "إجراء تقييم المخاطر في بيئة العمل", "تطبيق بروتوكولات الطوارئ والسلامة من الحرائق", "استخدام معدات الحماية الشخصية بشكل صحيح", "الحصول على شهادة سلامة معتمدة"],
    requirements: ["No prior experience required", "A computer with internet access", "Willingness to learn safety protocols"],
    requirements_en: ["No prior experience required", "A computer with internet access", "Willingness to learn safety protocols"],
    requirements_fr: ["Aucune expérience préalable requise", "Un ordinateur avec accès internet", "Volonté d'apprendre les protocoles de sécurité"],
    requirements_ar: ["لا يتطلب خبرة سابقة", "حاسوب مع اتصال بالإنترنت", "الرغبة في تعلم بروتوكولات السلامة"],
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
        { id: "l1-2-3", title: "Practical Risk Assessment", type: "text", duration: "15:00", isPreview: false },
      ]},
      { id: "s1-3", title: "Fire Safety & Emergency", lessons: [
        { id: "l1-3-1", title: "Fire Prevention", type: "video", duration: "20:00", isPreview: false },
        { id: "l1-3-2", title: "Emergency Evacuation Procedures", type: "video", duration: "18:00", isPreview: false },
        { id: "l1-3-3", title: "Using Fire Extinguishers", type: "video", duration: "12:00", isPreview: false },
        { id: "l1-3-4", title: "Quiz: Fire Safety", type: "quiz", duration: "10:00", isPreview: false },
      ]},
      { id: "s1-4", title: "Personal Protective Equipment", lessons: [
        { id: "l1-4-1", title: "Types of PPE", type: "video", duration: "15:00", isPreview: false },
        { id: "l1-4-2", title: "PPE Selection & Maintenance", type: "text", duration: "10:00", isPreview: false },
        { id: "l1-4-3", title: "Final Assessment", type: "quiz", duration: "20:00", isPreview: false },
      ]},
    ],
  },
  {
    id: "course-2",
    title: "Workplace Safety & Prevention Inspector",
    title_en: "Workplace Safety & Prevention Inspector",
    title_fr: "Inspecteur de Sécurité et Prévention des Établissements",
    title_ar: "مفتش أمن ووقاية المؤسسات",
    subtitle: "Advanced inspection techniques and safety management for certified inspectors",
    subtitle_en: "Advanced inspection techniques and safety management for certified inspectors",
    subtitle_fr: "Techniques avancées d'inspection et gestion de la sécurité pour inspecteurs certifiés",
    subtitle_ar: "تقنيات التفتيش المتقدمة وإدارة السلامة للمفتشين المعتمدين",
    instructor: "Dr. Ahmed Matsy",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedMatsy",
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
    price: 0,
    isFree: false,
    duration: "30h",
    lessonCount: 40,
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-03-10",
    description: "Advanced training for workplace safety inspectors covering detailed inspection methodologies, compliance auditing, incident investigation, and safety management systems.",
    description_en: "Advanced training for workplace safety inspectors covering detailed inspection methodologies, compliance auditing, incident investigation, and safety management systems.",
    description_fr: "Formation avancée pour inspecteurs de sécurité couvrant les méthodologies d'inspection détaillées, l'audit de conformité, l'enquête sur les incidents et les systèmes de gestion de la sécurité.",
    description_ar: "تدريب متقدم لمفتشي أمن ووقاية المؤسسات يغطي منهجيات التفتيش التفصيلية، تدقيق الامتثال، التحقيق في الحوادث، وأنظمة إدارة السلامة.",
    learningOutcomes: ["Master safety inspection techniques", "Conduct compliance audits", "Investigate workplace incidents", "Implement safety management systems", "Prepare professional inspection reports"],
    learningOutcomes_en: ["Master safety inspection techniques", "Conduct compliance audits", "Investigate workplace incidents", "Implement safety management systems", "Prepare professional inspection reports"],
    learningOutcomes_fr: ["Maîtriser les techniques d'inspection de sécurité", "Réaliser des audits de conformité", "Enquêter sur les incidents", "Implémenter des systèmes de gestion de sécurité", "Préparer des rapports d'inspection professionnels"],
    learningOutcomes_ar: ["إتقان تقنيات التفتيش الأمني", "إجراء تدقيق الامتثال", "التحقيق في حوادث العمل", "تطبيق أنظمة إدارة السلامة", "إعداد تقارير تفتيش احترافية"],
    requirements: ["Basic HSE knowledge recommended", "A computer with internet access", "Understanding of workplace safety regulations"],
    requirements_en: ["Basic HSE knowledge recommended", "A computer with internet access", "Understanding of workplace safety regulations"],
    requirements_fr: ["Connaissances HSE de base recommandées", "Un ordinateur avec accès internet", "Compréhension des réglementations de sécurité"],
    requirements_ar: ["يوصى بمعرفة أساسية بالسلامة والصحة المهنية", "حاسوب مع اتصال بالإنترنت", "فهم لوائح السلامة في بيئة العمل"],
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
        { id: "l2-1-3", title: "Documentation Standards", type: "text", duration: "15:00", isPreview: false },
      ]},
      { id: "s2-2", title: "Compliance Auditing", lessons: [
        { id: "l2-2-1", title: "Audit Planning", type: "video", duration: "20:00", isPreview: false },
        { id: "l2-2-2", title: "Conducting Audits", type: "video", duration: "25:00", isPreview: false },
        { id: "l2-2-3", title: "Non-Conformity Reports", type: "text", duration: "15:00", isPreview: false },
        { id: "l2-2-4", title: "Quiz: Compliance", type: "quiz", duration: "10:00", isPreview: false },
      ]},
      { id: "s2-3", title: "Incident Investigation", lessons: [
        { id: "l2-3-1", title: "Investigation Techniques", type: "video", duration: "22:00", isPreview: false },
        { id: "l2-3-2", title: "Root Cause Analysis", type: "video", duration: "20:00", isPreview: false },
        { id: "l2-3-3", title: "Corrective Actions", type: "video", duration: "18:00", isPreview: false },
        { id: "l2-3-4", title: "Final Assessment", type: "quiz", duration: "25:00", isPreview: false },
      ]},
    ],
  },
  {
    id: "course-3",
    title: "Professional Hajj & Umrah Guide",
    title_en: "Professional Hajj & Umrah Guide",
    title_fr: "Guide Professionnel du Hajj et Omra",
    title_ar: "المرشد المحترف للحج والعمرة",
    subtitle: "Comprehensive guide training for Hajj and Umrah pilgrimage",
    subtitle_en: "Comprehensive guide training for Hajj and Umrah pilgrimage",
    subtitle_fr: "Formation complète de guide pour le pèlerinage du Hajj et de la Omra",
    subtitle_ar: "تدريب شامل للمرشدين المحترفين للحج والعمرة",
    instructor: "Sheikh Ibrahim Khalil",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SheikhIbrahim",
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
    price: 0,
    isFree: false,
    duration: "20h",
    lessonCount: 28,
    coverImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=400&fit=crop",
    language: "Arabic",
    updatedAt: "2025-02-15",
    description: "Complete professional training for Hajj and Umrah guides covering rituals, logistics, group management, and spiritual guidance for pilgrims.",
    description_en: "Complete professional training for Hajj and Umrah guides covering rituals, logistics, group management, and spiritual guidance for pilgrims.",
    description_fr: "Formation professionnelle complète pour les guides du Hajj et de la Omra couvrant les rituels, la logistique, la gestion de groupe et l'accompagnement spirituel des pèlerins.",
    description_ar: "تدريب مهني شامل لمرشدي الحج والعمرة يغطي المناسك، اللوجستيات، إدارة المجموعات، والإرشاد الروحي للحجاج.",
    learningOutcomes: ["Master all Hajj and Umrah rituals", "Guide pilgrim groups professionally", "Handle logistics and emergency situations", "Provide spiritual guidance and support", "Earn a professional guide certification"],
    learningOutcomes_en: ["Master all Hajj and Umrah rituals", "Guide pilgrim groups professionally", "Handle logistics and emergency situations", "Provide spiritual guidance and support", "Earn a professional guide certification"],
    learningOutcomes_fr: ["Maîtriser tous les rituels du Hajj et de la Omra", "Guider des groupes de pèlerins professionnellement", "Gérer la logistique et les situations d'urgence", "Fournir un accompagnement spirituel", "Obtenir une certification de guide professionnel"],
    learningOutcomes_ar: ["إتقان جميع مناسك الحج والعمرة", "إرشاد مجموعات الحجاج باحترافية", "إدارة اللوجستيات والطوارئ", "تقديم الإرشاد الروحي والدعم", "الحصول على شهادة مرشد محترف"],
    requirements: ["Basic Islamic knowledge", "A computer with internet access", "Passion for helping pilgrims"],
    requirements_en: ["Basic Islamic knowledge", "A computer with internet access", "Passion for helping pilgrims"],
    requirements_fr: ["Connaissances islamiques de base", "Un ordinateur avec accès internet", "Passion pour aider les pèlerins"],
    requirements_ar: ["معرفة إسلامية أساسية", "حاسوب مع اتصال بالإنترنت", "شغف بمساعدة الحجاج"],
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
        { id: "l3-1-3", title: "Preparation for Pilgrimage", type: "video", duration: "18:00", isPreview: false },
      ]},
      { id: "s3-2", title: "Umrah Rituals", lessons: [
        { id: "l3-2-1", title: "Ihram and Niyyah", type: "video", duration: "15:00", isPreview: false },
        { id: "l3-2-2", title: "Tawaf", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-2-3", title: "Sa'i", type: "video", duration: "18:00", isPreview: false },
        { id: "l3-2-4", title: "Quiz: Umrah Rituals", type: "quiz", duration: "10:00", isPreview: false },
      ]},
      { id: "s3-3", title: "Hajj Rituals", lessons: [
        { id: "l3-3-1", title: "Day of Arafah", type: "video", duration: "22:00", isPreview: false },
        { id: "l3-3-2", title: "Muzdalifah and Mina", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-3-3", title: "Stoning and Sacrifice", type: "video", duration: "18:00", isPreview: false },
        { id: "l3-3-4", title: "Farewell Tawaf", type: "video", duration: "12:00", isPreview: false },
      ]},
      { id: "s3-4", title: "Guide Responsibilities", lessons: [
        { id: "l3-4-1", title: "Group Management", type: "video", duration: "20:00", isPreview: false },
        { id: "l3-4-2", title: "Emergency Protocols", type: "video", duration: "15:00", isPreview: false },
        { id: "l3-4-3", title: "Final Assessment", type: "quiz", duration: "20:00", isPreview: false },
      ]},
    ],
  },
];

export const mockReviews: Review[] = [
  { id: "r1", user: "Karim Bouzid", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim", rating: 5, comment: "Excellent training! I got my HSE certification thanks to this course.", comment_en: "Excellent training! I got my HSE certification thanks to this course.", comment_fr: "Excellente formation ! J'ai obtenu ma certification HSE grâce à ce cours.", comment_ar: "تدريب ممتاز! حصلت على شهادة السلامة بفضل هذه الدورة.", date: "2025-02-15" },
  { id: "r2", user: "Amina Belhadj", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina", rating: 5, comment: "Very professional content. The instructor explains everything clearly.", comment_en: "Very professional content. The instructor explains everything clearly.", comment_fr: "Contenu très professionnel. Le formateur explique tout clairement.", comment_ar: "محتوى احترافي جداً. المدرب يشرح كل شيء بوضوح.", date: "2025-02-01" },
  { id: "r3", user: "Youcef Hamdi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youcef", rating: 5, comment: "The Hajj guide course was incredibly comprehensive. Highly recommended!", comment_en: "The Hajj guide course was incredibly comprehensive. Highly recommended!", comment_fr: "Le cours de guide du Hajj était incroyablement complet. Très recommandé !", comment_ar: "دورة مرشد الحج كانت شاملة بشكل لا يصدق. أنصح بها بشدة!", date: "2025-01-20" },
  { id: "r4", user: "Fatima Zerhouni", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima", rating: 4, comment: "Great platform with well-structured courses. I learned a lot about safety inspection.", comment_en: "Great platform with well-structured courses. I learned a lot about safety inspection.", comment_fr: "Excellente plateforme avec des cours bien structurés. J'ai beaucoup appris sur l'inspection de sécurité.", comment_ar: "منصة رائعة مع دورات منظمة بشكل جيد. تعلمت الكثير عن التفتيش الأمني.", date: "2025-01-10" },
  { id: "r5", user: "Mohamed Saidi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed", rating: 5, comment: "Dr. Ahmed Matsy is an exceptional instructor. The safety course changed my career.", comment_en: "Dr. Ahmed Matsy is an exceptional instructor. The safety course changed my career.", comment_fr: "Dr. Ahmed Matsy est un formateur exceptionnel. Le cours de sécurité a changé ma carrière.", comment_ar: "الدكتور أحمد مايسي مدرب استثنائي. دورة السلامة غيرت مساري المهني.", date: "2024-12-28" },
];

export const mockCategories = [
  { name: "HSE Safety", name_en: "HSE Safety", name_fr: "Sécurité HSE", name_ar: "أمن ووقاية", icon: "Shield", slug: "hse-safety", courseCount: 2 },
  { name: "Religious Guidance", name_en: "Religious Guidance", name_fr: "Guide Religieux", name_ar: "إرشاد ديني", icon: "BookOpen", slug: "religious-guidance", courseCount: 1 },
  { name: "Certified Training", name_en: "Certified Training", name_fr: "Formation Certifiée", name_ar: "تكوين معتمد", icon: "Award", slug: "certified-training", courseCount: 3 },
  { name: "Special Offers", name_en: "Special Offers", name_fr: "Promotions", name_ar: "عروض خاصة", icon: "Zap", slug: "special-offers", courseCount: 3 },
];
