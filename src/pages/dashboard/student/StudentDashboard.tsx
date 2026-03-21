import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, BarChart3, Award, Heart, UserCircle, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import MyCourses from "./MyCourses";
import Progress from "./Progress";
import Certificates from "./Certificates";
import Wishlist from "./Wishlist";
import Profile from "./Profile";
import StudentSettings from "./Settings";

export default function StudentDashboard() {
  const { t } = useTranslation();

  const items = [
    { title: t("dashboard.student.myCourses"), url: "/dashboard/student", icon: BookOpen },
    { title: t("dashboard.student.progress"), url: "/dashboard/student/progress", icon: BarChart3 },
    { title: t("dashboard.student.certificates"), url: "/dashboard/student/certificates", icon: Award },
    { title: t("dashboard.student.wishlist"), url: "/dashboard/student/wishlist", icon: Heart },
    { title: t("dashboard.student.profile"), url: "/dashboard/student/profile", icon: UserCircle },
    { title: t("dashboard.student.settings"), url: "/dashboard/student/settings", icon: Settings },
  ];

  return (
    <DashboardLayout items={items} groupLabel={t("dashboard.student.title")}>
      <Routes>
        <Route index element={<MyCourses />} />
        <Route path="progress" element={<Progress />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<StudentSettings />} />
        <Route path="*" element={<Navigate to="/dashboard/student" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
