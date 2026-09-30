import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function GuestRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
