import { Navigate, useLocation } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import LayoutWrapper from "@/wrappers/layout-wrapper";

interface PrivateRoutesProps {
  element: React.ComponentType<Record<string, unknown>>;
}

export default function PrivateRoutes({
  element: Component,
  ...rest
}: PrivateRoutesProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.SIGN_IN} replace state={{ from: location }} />;
  }

  return (
    <LayoutWrapper>
      <Component {...rest} />
    </LayoutWrapper>
  );
}
