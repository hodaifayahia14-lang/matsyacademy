import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, BookOpen, Grid3X3, Ticket, Settings, MessageSquare, FileText, Info, ClipboardList, Trophy, Mail } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AdminOverview from "./AdminOverview";
import UsersManagement from "./UsersManagement";
import CoursesModeration from "./CoursesModeration";
import CategoriesManagement from "./CategoriesManagement";
import CouponsManagement from "./CouponsManagement";
import PlatformSettings from "./PlatformSettings";
import QAModeration from "./QAModeration";
import BlogManagement from "./BlogManagement";
import AboutManagement from "./AboutManagement";
import OrdersManagement from "./OrdersManagement";
import Leaderboard from "./Leaderboard";
import CourseDetailAdmin from "./CourseDetailAdmin";
import MessagesManagement from "./MessagesManagement";
import CreateCourse from "@/pages/dashboard/instructor/CreateCourse";

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const t = (ar: string, fr: string, en: string) => lang === "ar" ? ar : lang === "fr" ? fr : en;

  const items = [
    { title: t("نظرة عامة", "Vue d'ensemble", "Overview"), url: "/dashboard/admin", icon: LayoutDashboard },
    { title: t("الطلبات", "Commandes", "Orders"), url: "/dashboard/admin/orders", icon: ClipboardList },
    { title: t("لوحة المتصدرين", "Classement", "Leaderboard"), url: "/dashboard/admin/leaderboard", icon: Trophy },
    { title: t("المستخدمون", "Utilisateurs", "Users"), url: "/dashboard/admin/users", icon: Users },
    { title: t("الدورات", "Cours", "Courses"), url: "/dashboard/admin/courses", icon: BookOpen },
    { title: t("الفئات", "Catégories", "Categories"), url: "/dashboard/admin/categories", icon: Grid3X3 },
    { title: t("القسائم", "Coupons", "Coupons"), url: "/dashboard/admin/coupons", icon: Ticket },
    { title: t("الرسائل", "Messages", "Messages"), url: "/dashboard/admin/messages", icon: Mail },
    { title: t("المدونة", "Blog", "Blog"), url: "/dashboard/admin/blogs", icon: FileText },
    { title: t("الإعدادات", "Paramètres", "Settings"), url: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout items={items} groupLabel={t("لوحة تحكم المسؤول", "Admin", "Admin Dashboard")} />}>
        <Route index element={<AdminOverview />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="courses" element={<CoursesModeration />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="courses/:courseId" element={<CourseDetailAdmin />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="qa" element={<QAModeration />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="settings" element={<PlatformSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}
