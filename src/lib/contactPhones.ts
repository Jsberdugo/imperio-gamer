// src/lib/contactPhones.ts
import { publicClient } from "./http";

export type ContactPhone = {
  id: string;
  label: string | null;
  phone: string;
  dispo: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiOk<T> = {
  data: T;
  message?: string;
  success?: boolean;
  [key: string]: unknown;
};

// GET /contact-phones
export async function getContactPhones(): Promise<ContactPhone[]> {
  const res = await publicClient.get("/contact-phones");
  const payload = res.data;

  // ✅ Caso 1: backend devuelve array directo: [ ... ]
  if (Array.isArray(payload)) {
    return payload as ContactPhone[];
  }

  // ✅ Caso 2: backend devuelve ApiOk: { data: [ ... ] }
  const ok = payload as ApiOk<unknown>;
  if (Array.isArray(ok?.data)) {
    return ok.data as ContactPhone[];
  }

  // ✅ Caso 3 (por si acaso): { data: { data: [ ... ] } }
  const nested = (ok?.data as any)?.data;
  if (Array.isArray(nested)) {
    return nested as ContactPhone[];
  }

  // Si llega algo raro, devolvemos vacío para no romper UI
  return [];
}
