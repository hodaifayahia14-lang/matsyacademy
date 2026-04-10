import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import CourseCatalog from "@/pages/CourseCatalog";
import CourseDetail from "@/pages/CourseDetail";
import AdminLogin from "@/pages/AdminLogin";
import OrderForm from "@/pages/OrderForm";
import About from "@/pages/About";
import QA from "@/pages/QA";
import Instructions from "@/pages/Instructions";
import Instructors from "@/pages/Instructors";
import InstructorDetail from "@/pages/InstructorDetail";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import BlogDetail from "@/pages/BlogDetail";
import Terms from "@/pages/Terms";
import CoursePlayer from "@/pages/CoursePlayer";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import AgentDashboard from "@/pages/dashboard/agent/AgentDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Course Player — full-screen, no Navbar/Footer */}
              <Route path="/learn/:courseId/:lessonId" element={<CoursePlayer />} />

              {/* Staff login — no Navbar/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Dashboard routes — no global Navbar/Footer */}
              <Route path="/dashboard/admin/*" element={
                <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard/agent/*" element={
                <ProtectedRoute requiredRole="confirmation_agent"><AgentDashboard /></ProtectedRoute>
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
                      <Route path="/order/:courseId" element={<OrderForm />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/qa" element={<QA />} />
                      <Route path="/instructions" element={<Instructions />} />
                      <Route path="/instructors" element={<Instructors />} />
                      <Route path="/instructors/:id" element={<InstructorDetail />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
