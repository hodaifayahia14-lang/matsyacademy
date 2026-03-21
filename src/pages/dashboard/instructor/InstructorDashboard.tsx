import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, PlusCircle, Users, BarChart3, DollarSign, UserCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import InstructorCourses from "./InstructorCourses";
import CreateCourse from "./CreateCourse";
import Students from "./Students";
import Analytics from "./Analytics";
import Revenue from "./Revenue";
import InstructorProfile from "./Profile";

export default function InstructorDashboard() {
  const { t } = useTranslation();

  const items = [
    { title: t("dashboard.instructor.myCourses"), url: "/dashboard/instructor", icon: BookOpen },
    { title: t("dashboard.instructor.createCourse"), url: "/dashboard/instructor/create", icon: PlusCircle },
    { title: t("dashboard.instructor.students"), url: "/dashboard/instructor/students", icon: Users },
    { title: t("dashboard.instructor.analytics"), url: "/dashboard/instructor/analytics", icon: BarChart3 },
    { title: t("dashboard.instructor.revenue"), url: "/dashboard/instructor/revenue", icon: DollarSign },
    { title: t("dashboard.instructor.profile"), url: "/dashboard/instructor/profile", icon: UserCircle },
  ];

  return (
    <Routes>
      <Route element={<DashboardLayout items={items} groupLabel={t("dashboard.instructor.title")} />}>
        <Route index element={<InstructorCourses />} />
        <Route path="create" element={<CreateCourse />} />
        <Route path="students" element={<Students />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="profile" element={<InstructorProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/instructor" replace />} />
    </Routes>
  );
}
