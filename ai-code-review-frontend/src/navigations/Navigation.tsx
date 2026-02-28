import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import PrivateRoutes from "@/navigations/PrivateRoutes";

import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import DashboardPage from "@/pages/DashboardPage";
import NewReviewPage from "@/pages/NewReviewPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";

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

      {/* Protected routes wrapped with LayoutWrapper via PrivateRoutes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={<PrivateRoutes element={DashboardPage} />}
      />
      <Route
        path={ROUTES.NEW_REVIEW}
        element={<PrivateRoutes element={NewReviewPage} />}
      />
      <Route
        path={ROUTES.REVIEW_DETAIL}
        element={<PrivateRoutes element={ReviewDetailPage} />}
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
