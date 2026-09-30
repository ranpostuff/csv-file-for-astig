import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
