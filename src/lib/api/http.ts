import axios from "axios";
import type { AxiosRequestConfig } from "axios";

/** === ENV / Constantes === */
export const STORE_TOKEN_KEY = "store_token";
export const TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || "acme";
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://paginainternacional-v1-back-production.up.railway.app";

/** === Helpers de token === */
export const getToken = () => localStorage.getItem(STORE_TOKEN_KEY);
export const setToken = (jwt: string) =>
  localStorage.setItem(STORE_TOKEN_KEY, jwt);
export const clearToken = () => localStorage.removeItem(STORE_TOKEN_KEY);

/** === Cliente público (sin Authorization) === */
export const publicClient = axios.create({
  baseURL: API_URL,
});

/** === Cliente autenticado (adjunta Authorization si hay token) === */
export const authClient = axios.create({
  baseURL: API_URL,
});

authClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) clearToken();
    return Promise.reject(err);
  },
);

/** Adjunta el header X-Tenant-Slug para endpoints públicos multi-tenant */
export function withTenantHeader(
  config?: AxiosRequestConfig,
  tenantSlug: string = TENANT_SLUG,
): AxiosRequestConfig {
  const headers = { ...(config?.headers || {}), "X-Tenant-Slug": tenantSlug };
  return { ...(config || {}), headers };
}
