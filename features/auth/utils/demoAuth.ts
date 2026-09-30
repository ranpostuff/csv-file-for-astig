import type { AuthState } from "../types/authState";

/**
 * FRONT-END DEMO ONLY.
 * When the app is built with VITE_DEMO_MODE=true it signs in a fake user
 * automatically, so pages can be viewed without the backend.
 * Never set this for the real deployment.
 */
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

function base64Url(value: object) {
  return btoa(JSON.stringify(value))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createDemoAuth(): AuthState {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

  // An unsigned token is enough: the front end only reads its expiry date.
  const jwtToken = [
    base64Url({ alg: "none", typ: "JWT" }),
    base64Url({ sub: "demo", exp: expiresAt }),
    "demo",
  ].join(".");

  return {
    id: "demo-user",
    username: "demo",
    firstName: "Demo",
    lastName: "Admin",
    middleName: null,
    extension: null,
    dateOfBirth: "2000-01-01",
    jwtToken,
    roles: ["Admin"],
  };
}
