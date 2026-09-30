import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authStorage } from "../utils/authStorage";
import { IS_DEMO_MODE, createDemoAuth } from "../utils/demoAuth";
import type { AuthState } from "../types/authState";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedAuth = authStorage.get();

    if (storedAuth) {
      setAuth(storedAuth);
    } else if (IS_DEMO_MODE) {
      setAuth(createDemoAuth());
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback((authState: AuthState) => {
    authStorage.set(authState);
    setAuth(authState);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setAuth(null);
  }, []);

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
      isAuthenticated: auth !== null,
      isInitialized,
    }),
    [auth, login, logout, isInitialized],
  );

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
