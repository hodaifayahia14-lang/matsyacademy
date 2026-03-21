import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, BookOpen, Grid3X3, Ticket, Settings, MessageSquare, FileText, Info, CreditCard } from "lucide-react";
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
import EnrollmentsDashboard from "./EnrollmentsDashboard";

export default function AdminDashboard() {
  const { t } = useTranslation();

  const items = [
    { title: t("dashboard.admin.overview"), url: "/dashboard/admin", icon: LayoutDashboard },
    { title: t("dashboard.admin.users"), url: "/dashboard/admin/users", icon: Users },
    { title: t("dashboard.admin.courses"), url: "/dashboard/admin/courses", icon: BookOpen },
    { title: t("dashboard.admin.enrollments"), url: "/dashboard/admin/enrollments", icon: CreditCard },
    { title: t("dashboard.admin.categories"), url: "/dashboard/admin/categories", icon: Grid3X3 },
    { title: t("dashboard.admin.coupons"), url: "/dashboard/admin/coupons", icon: Ticket },
    { title: t("dashboard.admin.qa"), url: "/dashboard/admin/qa", icon: MessageSquare },
    { title: t("dashboard.admin.blogs"), url: "/dashboard/admin/blogs", icon: FileText },
    { title: t("dashboard.admin.about"), url: "/dashboard/admin/about", icon: Info },
    { title: t("dashboard.admin.settings"), url: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout items={items} groupLabel={t("dashboard.admin.title")} />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="courses" element={<CoursesModeration />} />
        <Route path="enrollments" element={<EnrollmentsDashboard />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="qa" element={<QAModeration />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="settings" element={<PlatformSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}
