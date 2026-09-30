import type { AuthState } from "../types/authState";
import { isTokenValid } from "./isTokenValid";

const AUTH_STORAGE_KEY = "astig_auth";

export const authStorage = {
  get(): AuthState | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    try {
      const auth = JSON.parse(stored) as AuthState;

      if (!isTokenValid(auth.jwtToken)) {
        this.clear();
        return null;
      }

      return auth;
    } catch {
      this.clear();
      return null;
    }
  },

  set(auth: AuthState) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  },

  clear() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getToken(): string | null {
    return this.get()?.jwtToken ?? null;
  },
};
