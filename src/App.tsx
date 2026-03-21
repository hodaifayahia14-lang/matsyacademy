import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import CourseCatalog from "@/pages/CourseCatalog";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import About from "@/pages/About";
import QA from "@/pages/QA";
import Instructions from "@/pages/Instructions";
import Instructors from "@/pages/Instructors";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import StudentDashboard from "@/pages/dashboard/student/StudentDashboard";
import InstructorDashboard from "@/pages/dashboard/instructor/InstructorDashboard";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Dashboard routes — no global Navbar/Footer */}
            <Route path="/dashboard/student/*" element={
              <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/instructor/*" element={
              <ProtectedRoute requiredRole="instructor"><InstructorDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
            } />

            {/* Public routes with Navbar/Footer */}
            <Route path="*" element={
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CourseCatalog />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/qa" element={<QA />} />
                    <Route path="/instructions" element={<Instructions />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
