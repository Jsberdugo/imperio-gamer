// src/lib/http.ts
import axios from "axios";
import { emitAuthExpired } from "./authEvents";

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

// Key ÚNICA para el JWT del CLIENTE en este front mayorista
export const AUTH_TOKEN_KEY = "mayorista_client_jwt";

// Cliente público (sin token)
export const publicClient = axios.create({
  baseURL: API_URL,
});

// Cliente autenticado (para endpoints que requieren JWT)
export const authClient = axios.create({
  baseURL: API_URL,
});

// ✅ Helper interno: borra Authorization de forma robusta
function stripAuthHeader(target: any) {
  if (!target) return;
  try {
    delete target.Authorization;
    delete target.authorization;
  } catch {}
}

// Leer token actual
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Helpers para manejar el token desde fuera (login/logout)
export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (!token) {
    localStorage.removeItem(AUTH_TOKEN_KEY);

    // ✅ quitar defaults comunes
    stripAuthHeader(authClient.defaults.headers?.common);
    stripAuthHeader(authClient.defaults.headers);

    return;
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  authClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  authClient.defaults.headers.common["authorization"] = `Bearer ${token}`;
}

// Limpieza de sesión (centralizado)
export function clearAuthSession() {
  if (typeof window === "undefined") return;
  setAuthToken(null);
  localStorage.removeItem("auth_username");
}

// Adjunta automáticamente el token al Authorization header
authClient.interceptors.request.use(
  (config: any) => {
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      config.headers = config.headers ?? {};

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.authorization = `Bearer ${token}`;
      } else {
        // ✅ si no hay token, removemos cualquier header “pegado”
        stripAuthHeader(config.headers);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Logout “duro”: limpia y redirige
export function logoutHard(redirectTo = "/login") {
  if (typeof window === "undefined") return;
  clearAuthSession();
  window.location.replace(redirectTo);
}

// ✅ Interceptor GLOBAL: si el token venció, limpia sesión + emite evento
let authExpiredAlreadyHandled = false;

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const skip = error?.config?.headers?.["x-skip-auth-expired"] === "1";

    if (
      !skip &&
      (status === 401 || status === 403) &&
      typeof window !== "undefined"
    ) {
      if (!authExpiredAlreadyHandled) {
        authExpiredAlreadyHandled = true;

        clearAuthSession();

        const returnTo =
          window.location.pathname +
          window.location.search +
          window.location.hash;

        emitAuthExpired({
          message: "Tu sesión expiró. Inicia sesión nuevamente.",
          returnTo,
        });

        setTimeout(() => {
          authExpiredAlreadyHandled = false;
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);

// Forma genérica de la respuesta que devuelve tu helper `ok()`
export type ApiOk<T> = {
  data: T;
  message?: string;
  success?: boolean;
  [key: string]: unknown;
};

export type ApiErrorShape = {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
};

type AxiosErrorLike = {
  message?: string;
  response?: {
    status: number;
    data?: any;
  };
};

// Normaliza errores de axios para que sea fácil mostrar mensajes
export function getApiError(error: unknown): ApiErrorShape {
  const err = error as AxiosErrorLike;
  const response = err.response;

  if (!response) {
    return { message: err.message || "Error de red", statusCode: undefined };
  }

  const data = response.data as any;
  return {
    message: data?.message || "Error inesperado",
    statusCode: response.status,
    errors: data?.errors,
  };
}
