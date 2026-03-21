import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const instructors = [
  { name: "Dr. Ahmed Matsy", role: "AI & Data Science", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor1-DUvt54Og.webp", students: 12450, courses: 8, rating: 4.9 },
  { name: "Sarah Benali", role: "Business Strategy", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor2-BbMKFVTw.webp", students: 8930, courses: 5, rating: 4.8 },
  { name: "Marc Dupont", role: "Web Development", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor3-BQy7AFDY.webp", students: 15670, courses: 12, rating: 4.9 },
  { name: "Fatima Zahra", role: "Digital Marketing", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor4-K1zs78ea.webp", students: 6200, courses: 4, rating: 4.7 },
  { name: "David Martinez", role: "Marketing Mentor", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor5-q6LcgS6u.webp", students: 9800, courses: 6, rating: 4.8 },
  { name: "Alexander Johnson", role: "Coding Instructor", avatar: "https://eduthink-react.layoutdrop.com/assets/mentor6-BoOtdyEV.webp", students: 11200, courses: 9, rating: 4.9 },
];

export default function Instructors() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("navbar.instructors")}</h1>
          <p className="text-muted-foreground">{t("mentors.subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-square overflow-hidden">
                <img src={m.avatar} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{m.role}</p>
                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <span>{m.students.toLocaleString()} {t("stats.students")}</span>
                  <span>{m.courses} {t("stats.courses")}</span>
                  <span>⭐ {m.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
