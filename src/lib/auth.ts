// src/lib/auth.ts
import { publicClient, type ApiOk, authClient } from "./http";

export interface LoginClientePayload {
  // ✅ correo/usuario del cliente
  nombre_usuario: string;
  contraseña: string;
}

export interface LoginResultUser {
  id: string;
  nombre_usuario: string;
  correo: string;
  rol: "cliente" | "trabajador";
}
export interface RegisterClientePayload {
  nombre_usuario: string;
  correo: string;
  contraseña: string;
  telefono?: string;
  tipoEmpresa: string;
}
export interface LoginResult {
  access_token: string;
  user: LoginResultUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/** POST /auth/login-cliente */
export async function loginCliente(
  payload: LoginClientePayload,
): Promise<LoginResult> {
  const body = {
    ...payload,
    rol: "cliente" as const,
  };

  const res = await publicClient.post<ApiOk<LoginResult>>(
    "/auth/login-cliente",
    body,
  );
  return res.data.data;
}

/** POST /auth/forgot-password */
export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await publicClient.post<ApiOk<null>>("/auth/forgot-password", payload);
}

/** POST /auth/reset-password */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<any> {
  const res = await publicClient.post<ApiOk<any>>(
    "/auth/reset-password",
    payload,
  );
  return res.data.data;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** POST /auth/change-password (requiere JWT) */
export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await authClient.post<ApiOk<null>>("/auth/change-password", payload);
}

// POST /auth/register-cliente
export async function registerCliente(
  payload: RegisterClientePayload,
): Promise<any> {
  const res = await publicClient.post<ApiOk<any>>(
    "/auth/register-cliente",
    payload,
  );
  return res.data.data;
}
