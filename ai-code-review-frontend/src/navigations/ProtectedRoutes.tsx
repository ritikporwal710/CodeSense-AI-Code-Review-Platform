import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // Force Password Change Check
  if (
    isAuthenticated &&
    user?.forcePasswordChange &&
    location.pathname !== ROUTES.CHANGE_PASSWORD
  ) {
    return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
