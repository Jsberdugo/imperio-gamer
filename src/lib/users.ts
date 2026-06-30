import { authClient, type ApiOk } from "./http";

export interface EditClientPayload {
  nombre_usuario?: string;
  correo?: string;
  telefono?: string;
  tipoEmpresa?: string;
}

export interface ClientPublic {
  id: string;
  nombre_usuario: string;
  correo: string | null;
  telefono: string | null;
  tipoEmpresa: string | null;
  token: number; // saldo actual de XC
  isGoogleUser?: boolean; // ✅ NUEVO
}

// 🔹 Logs de recarga de tokens (XC) visibles para el cliente
export interface TokenTopupLog {
  id: string;
  amount: number;
  createdAt: string;
}

// ---- helpers ----
function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;

  if (typeof value === "string") {
    const cleaned = value.trim().replace(/\s/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }

  return fallback;
}

function toBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return ["true", "1", "yes"].includes(value.toLowerCase());
  return fallback;
}

function normalizeClientPublic(raw: any): ClientPublic {
  return {
    id: String(raw?.id ?? ""),
    nombre_usuario: String(raw?.nombre_usuario ?? ""),
    correo: raw?.correo ?? null,
    telefono: raw?.telefono ?? null,
    tipoEmpresa: raw?.tipoEmpresa ?? null,
    token: toNumber(raw?.token, 0),
    isGoogleUser: raw?.isGoogleUser !== undefined ? toBool(raw?.isGoogleUser) : undefined,
  };
}

function normalizeTokenTopups(list: any[]): TokenTopupLog[] {
  return (Array.isArray(list) ? list : []).map((x) => ({
    id: String(x?.id ?? ""),
    amount: toNumber(x?.amount, 0),
    createdAt: String(x?.createdAt ?? ""),
  }));
}

// 🔹 Obtener usuario actual cliente según token (sin cache)
export async function getClientMe(): Promise<ClientPublic> {
  const res = await authClient.get<ApiOk<any>>(`/users/me-cliente?_=${Date.now()}`);
  return normalizeClientPublic(res.data.data);
}

export async function getClientById(id: string): Promise<ClientPublic> {
  const res = await authClient.get<ApiOk<any>>(`/users/${id}`);
  return normalizeClientPublic(res.data.data);
}

export async function updateClient(id: string, payload: EditClientPayload): Promise<any> {
  const res = await authClient.put<ApiOk<any>>(`/users/${id}/editar-cliente`, payload);
  return res.data.data;
}

export async function getMyTokenTopups(): Promise<TokenTopupLog[]> {
  const res = await authClient.get<ApiOk<any>>(`/users/me-cliente/token-topups?_=${Date.now()}`);
  return normalizeTokenTopups(res.data.data);
}
