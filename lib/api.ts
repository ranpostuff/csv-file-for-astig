import axios from "axios";
import { authStorage } from "../features/auth/utils/authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = authStorage.get();

  if (auth?.jwtToken) {
    config.headers.Authorization = `Bearer ${auth.jwtToken}`;
  }

  return config;
});
