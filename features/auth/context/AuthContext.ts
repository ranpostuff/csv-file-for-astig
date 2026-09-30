import { createContext } from "react";
import type { AuthState } from "../types/authState";

export interface AuthContextType {
  auth: AuthState | null;

  isAuthenticated: boolean;

  isInitialized: boolean;

  login: (auth: AuthState) => void;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
