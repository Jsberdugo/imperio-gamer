// src/lib/session.ts
import { AUTH_TOKEN_KEY } from "./http";

type JwtPayload = {
  exp?: number; // seconds
  [k: string]: unknown;
};

function safeParseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payloadB64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  const payload = safeParseJwt(token);
  // Si no hay exp, lo consideramos válido (depende de tu backend).
  if (!payload?.exp) return true;

  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp > nowSec;
}

export function isAuthenticated(): boolean {
  return isTokenValid(getStoredToken());
}
