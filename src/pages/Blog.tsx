import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  { id: "1", title: "10 Tips to Learn Programming Faster", excerpt: "Discover proven strategies to accelerate your coding journey.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", date: "2024-12-10", author: "Dr. Ahmed" },
  { id: "2", title: "The Future of Online Education", excerpt: "How technology is reshaping the way we learn and teach.", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop", date: "2024-11-28", author: "Sarah Benali" },
  { id: "3", title: "Best Practices for Remote Learning", excerpt: "Make the most of your online learning experience.", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", date: "2024-11-15", author: "Marc Dupont" },
  { id: "4", title: "Building a Career in Data Science", excerpt: "Everything you need to know to start a career in data science.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", date: "2024-10-20", author: "Fatima Zahra" },
];

export default function Blog() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">{t("navbar.blog")}</h1>
          <p className="text-muted-foreground">{t("blog.subtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <img src={post.img} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
