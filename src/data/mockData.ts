export interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
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
  learningOutcomes: string[];
  requirements: string[];
  sections: Section[];
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
  date: string;
}

const covers = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
];

const categories = [
  "IT & Software", "Business", "Languages", "Health", "Law", "Arts",
  "Science", "Marketing", "Design", "Cooking", "Education", "Sport",
];

const instructors = [
  "Dr. Sarah Johnson", "Prof. Ahmed Ali", "Marie Dupont",
  "John Smith", "Dr. Elena Rodriguez", "Marc Leblanc",
];

const courseTitles = [
  "Complete Web Development Bootcamp 2024",
  "Machine Learning A-Z: From Zero to Hero",
  "Digital Marketing Masterclass",
  "French Language for Beginners",
  "Business Management & Leadership",
  "Introduction to Data Science with Python",
  "UI/UX Design Fundamentals",
  "Health & Nutrition Certification",
  "Photography Masterclass: From Beginner to Pro",
  "Financial Accounting Essentials",
  "Advanced JavaScript & TypeScript",
  "Project Management Professional",
  "Creative Writing Workshop",
  "Cybersecurity Fundamentals",
  "Graphic Design with Adobe Suite",
  "Public Speaking & Communication Skills",
  "Cooking Italian Cuisine Like a Pro",
  "Introduction to Law & Legal Studies",
  "Sports Science & Fitness Training",
  "Art History: Renaissance to Modern",
  "Cloud Computing with AWS",
];

const levels: Course["level"][] = ["Beginner", "Intermediate", "Advanced"];

export const mockCourses: Course[] = courseTitles.map((title, i) => ({
  id: `course-${i + 1}`,
  title,
  subtitle: `Master the fundamentals and advanced concepts of ${title.toLowerCase()}`,
  instructor: instructors[i % instructors.length],
  instructorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${instructors[i % instructors.length]}`,
  category: categories[i % categories.length],
  level: levels[i % 3],
  rating: 3.5 + Math.random() * 1.5,
  reviewCount: 50 + Math.floor(Math.random() * 500),
  studentCount: 200 + Math.floor(Math.random() * 5000),
  price: i % 3 === 0 ? 0 : 19.99 + Math.floor(Math.random() * 80),
  isFree: i % 3 === 0,
  duration: `${10 + Math.floor(Math.random() * 40)}h`,
  lessonCount: 20 + Math.floor(Math.random() * 80),
  coverImage: covers[i % covers.length],
  language: ["English", "French", "Arabic"][i % 3],
  updatedAt: "2024-12-01",
  description: `This comprehensive course covers everything you need to know about ${title.toLowerCase()}. Whether you're a complete beginner or looking to advance your skills, this course offers hands-on projects, real-world examples, and expert instruction to help you succeed.`,
  learningOutcomes: [
    "Understand core concepts and principles",
    "Build real-world projects from scratch",
    "Apply best practices in professional settings",
    "Earn a certificate of completion",
    "Get lifetime access to course materials",
  ],
  requirements: [
    "No prior experience required",
    "A computer with internet access",
    "Willingness to learn and practice",
  ],
  sections: Array.from({ length: 4 + Math.floor(Math.random() * 4) }, (_, si) => ({
    id: `section-${i}-${si}`,
    title: `Section ${si + 1}: ${["Getting Started", "Core Concepts", "Advanced Topics", "Hands-On Projects", "Best Practices", "Final Assessment", "Bonus Content"][si % 7]}`,
    lessons: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, li) => ({
      id: `lesson-${i}-${si}-${li}`,
      title: `Lesson ${li + 1}: ${["Introduction", "Key Principles", "Deep Dive", "Practice Exercise", "Case Study", "Quiz", "Summary"][li % 7]}`,
      type: (["video", "video", "video", "text", "quiz"] as Lesson["type"][])[li % 5],
      duration: `${5 + Math.floor(Math.random() * 20)}:00`,
      isPreview: si === 0 && li === 0,
    })),
  })),
}));

export const mockReviews: Review[] = [
  { id: "r1", user: "Alice Martin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", rating: 5, comment: "Absolutely fantastic course! The instructor explains everything clearly and the projects are very practical.", date: "2024-11-15" },
  { id: "r2", user: "Bob Laurent", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", rating: 4, comment: "Great content and well-structured. Would love more advanced exercises.", date: "2024-11-10" },
  { id: "r3", user: "Clara Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clara", rating: 5, comment: "Best online course I've taken. The curriculum is comprehensive and up-to-date.", date: "2024-10-28" },
  { id: "r4", user: "David Muller", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", rating: 4, comment: "Very good quality. The quizzes helped me reinforce my understanding.", date: "2024-10-15" },
  { id: "r5", user: "Emma Blanc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", rating: 5, comment: "Excellent instructor and amazing community support. Highly recommend!", date: "2024-09-20" },
];

export const mockCategories = [
  { name: "IT & Software", icon: "Monitor", slug: "it-software", courseCount: 245 },
  { name: "Business", icon: "Briefcase", slug: "business", courseCount: 189 },
  { name: "Languages", icon: "Languages", slug: "languages", courseCount: 156 },
  { name: "Health", icon: "Heart", slug: "health", courseCount: 98 },
  { name: "Law", icon: "Scale", slug: "law", courseCount: 67 },
  { name: "Arts", icon: "Palette", slug: "arts", courseCount: 134 },
  { name: "Science", icon: "Atom", slug: "science", courseCount: 112 },
  { name: "Marketing", icon: "Megaphone", slug: "marketing", courseCount: 87 },
  { name: "Design", icon: "Pencil", slug: "design", courseCount: 143 },
  { name: "Cooking", icon: "ChefHat", slug: "cooking", courseCount: 76 },
  { name: "Education", icon: "BookOpen", slug: "education", courseCount: 94 },
  { name: "Sport", icon: "Dumbbell", slug: "sport", courseCount: 65 },
];
