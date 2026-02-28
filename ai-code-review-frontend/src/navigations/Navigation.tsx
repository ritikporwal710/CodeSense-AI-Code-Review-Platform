import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import DashboardPage from "@/pages/DashboardPage";
import NewReviewPage from "@/pages/NewReviewPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.SIGN_IN} replace />
  );
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to={ROUTES.DASHBOARD} replace />
  ) : (
    <>{children}</>
  );
}

export default function Navigation() {
  return (
    <Routes>
      {/* Public only (redirect if already authed) */}
      <Route
        path={ROUTES.SIGN_IN}
        element={
          <PublicOnlyRoute>
            <SignInPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.SIGN_UP}
        element={
          <PublicOnlyRoute>
            <SignUpPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.NEW_REVIEW}
        element={
          <PrivateRoute>
            <NewReviewPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.REVIEW_DETAIL}
        element={
          <PrivateRoute>
            <ReviewDetailPage />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
