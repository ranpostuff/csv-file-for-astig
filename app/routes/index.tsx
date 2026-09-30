import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}
