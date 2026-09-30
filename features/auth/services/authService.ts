import { api } from "../../../lib/api";

import type { LoginRequest } from "../types/loginRequest";
import type { AuthState } from "../types/authState";

class AuthService {
  async login(request: LoginRequest): Promise<AuthState> {
    const response = await api.post<AuthState>("/Auth/login", request);

    return response.data;
  }
}

export const authService = new AuthService();
