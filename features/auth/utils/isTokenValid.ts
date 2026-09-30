import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
};

export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return false;
    }

    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
