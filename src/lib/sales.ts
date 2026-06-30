// src/lib/sales.ts
import { authClient, type ApiOk } from "./http";

/** Estados que el back está usando ahora */
export type SaleStatus =
  | "PENDIENTE_PAGO"
  | "EN_PROCESO"
  | "COMPLETADO"
  | "CANCELADA"
  | "DEVUELTO"
  | string;

/** Pin: en listados por usuario puede venir solo {id,codigo}; en workers viene más info */
export interface SalePin {
  id: string; // back devuelve string
  codigo: string;
  precioCompra?: string | null;
  fechaExpiracion?: string | null;
}

export interface SaleProductRef {
  id: string;
  nombre?: string | null;
  grupo?: string | null;
}

export interface SaleUserRef {
  id: string;
  nombre_usuario?: string | null;
  correo?: string | null;
  telefono?: string | null;
}

/** Venta tal cual la retorna el back */
export interface UserSale {
  id: number;
  userId: string;
  productoId: string;

  currencyCode: string;
  cantidad: number;

  total: string;
  unitPriceUSD: string;
  rateAtSale?: number | null;

  paymentMethod: string;
  referencia?: string | null;
  mensaje?: string | null;

  estado: SaleStatus;
  createdAt: string;

  gananciaUSD?: string | null;

  // Binance fields (pueden venir null)
  binanceStatus?: string | null;
  binanceCheckoutUrl?: string | null;
  binanceExpireAt?: string | null;
  binanceTransactionId?: string | null;
  binanceMerchantTradeNo?: string | null;
  binancePrepayId?: string | null;
  paidAt?: string | null;

  user?: SaleUserRef | null;
  product?: SaleProductRef | null;

  pins: SalePin[];

  pinIds?: string[];
}

export interface Paginated<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; pageCount: number };
}

export interface CreateSalePayload {
  userId: string;
  productoId: string;
  currencyCode: string;
  cantidad: number;
  paymentMethod: string; // "BINANCE" | "CXC"
  referencia?: string | null;
  mensaje?: string | null;
}

/** Lo mínimo que necesitas para redirigir (hosted checkout) */
export interface BinanceCheckout {
  merchantTradeNo: string;
  prepayId: string;
  checkoutUrl: string;

  qrcodeLink?: string;
  deeplink?: string;
  universalUrl?: string;
  expireTime?: number;
  totalFee?: string;
  currency?: string;
}

export type CreateSaleResponse =
  | UserSale
  | { sale: UserSale; binance: BinanceCheckout };

export function isBinanceCreateSaleResponse(
  x: any
): x is { sale: UserSale; binance: BinanceCheckout } {
  return (
    !!x &&
    typeof x === "object" &&
    "sale" in x &&
    "binance" in x &&
    !!(x as any).binance?.checkoutUrl
  );
}

// Crear venta
export async function createSale(
  payload: CreateSalePayload
): Promise<CreateSaleResponse> {
  const res = await authClient.post<ApiOk<CreateSaleResponse>>("/sales", payload);
  return res.data.data;
}

// Historial por usuario (paginado)
export async function getSalesByUser(
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<Paginated<UserSale>> {
  const { page = 1, limit = 500 } = params ?? {};
  const res = await authClient.get<ApiOk<Paginated<UserSale>>>(`/sales/user/${userId}`, {
    params: { page, limit },
  });
  return res.data.data;
}
