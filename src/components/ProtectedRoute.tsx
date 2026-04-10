import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "student" | "instructor" | "admin" | "confirmation_agent";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
