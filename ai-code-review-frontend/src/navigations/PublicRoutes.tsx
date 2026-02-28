import { Navigate, useLocation } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";

interface PublicRoutesProps {
  element: React.ComponentType<Record<string, unknown>>;
  restricted?: boolean;
}

export default function PublicRoutes({
  element: Component,
  restricted = false,
  ...rest
}: PublicRoutesProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (restricted && user) {
    return (
      <Navigate
        to={
          (location.state as { from?: { pathname?: string } } | null)?.from
            ?.pathname ?? ROUTES.DASHBOARD
        }
        replace
      />
    );
  }

  return <Component {...rest} />;
}
