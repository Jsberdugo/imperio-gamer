// src/lib/api/sales.ts
import { authClient } from "./http";

/** Portales soportados por el BACK (DTO) */
export type PaymentPortal = "BINANCE" | "BANCOLOMBIA";

/** Payload de creación (cliente logueado) */
export type CreateSalePayload = {
  tenantSlug: string;
  subproductId: string;
  productId?: string;

  currencyCode: string; // USD | COP | VES | ...
  paymentPortal: PaymentPortal; // "BINANCE" | "BANCOLOMBIA"
  message?: string;
  /**
   * ✅ Cantidad (si no se envía, el back usa 1)
   * Tip: igual lo normalizamos en front para evitar undefined/null.
   */
  quantity?: number | null;
  // compatibilidad (para BANCOLOMBIA o binance manual)
  paymentReference?: string;
  referenceNumber?: string;

  paymentMeta?: Record<string, any>;
};

type NumLike = number | string | null | undefined;

export type CreatedSale = {
  id: string;
  saleNumber?: number | null;
  referenceNumber?: string | null;
  status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADO" | "DEVUELTO" | "CANCELADA";
  // ✅ IMPORTANTE: la qty debe venir para UI (mis compras / recibo)
  quantity?: number | null;
  message?: string;
  currencyCode?: string | null;

  // desglose
  priceUsdCents?: NumLike;
  discountPct?: NumLike;
  currencyValuePerUsd?: NumLike;

  // Totales
  finalUsdCents?: NumLike;
  finalInCurrency?: NumLike;

  createdAt: string;

  paymentPortal?: string | null;

  // BINANCE fields
  binanceCheckoutUrl?: string | null;
  binanceExpireAt?: string | null;
  binanceStatus?: string | null;

  product?: { id: string; title: string; logoUrl?: string | null };
  subproduct?: { id: string; name: string; packageImageUrl?: string | null };
};

export type BinanceCheckout = {
  merchantTradeNo: string;
  prepayId: string;
  checkoutUrl: string;
  qrcodeLink?: string;
  expireTime?: number;
  totalFee?: string;
  currency?: string; // "USDT"
};

export type CreateSaleResponse =
  | CreatedSale
  | { sale: CreatedSale; binance: BinanceCheckout; reused: boolean };

export function isBinanceCreateResponse(
  x: any,
): x is { sale: CreatedSale; binance: BinanceCheckout; reused: boolean } {
  return (
    !!x &&
    typeof x === "object" &&
    "sale" in x &&
    "binance" in x &&
    !!(x as any).binance?.checkoutUrl
  );
}
function normalizeQty(qty: any): number {
  const n = Number(qty);
  if (!Number.isFinite(n)) return 1;
  if (n < 1) return 1;
  // si quieres, puedes capear en front también
  // (en back ya haces clamp con SALE_MAX_QTY)
  return Math.floor(n);
}

export async function createSale(payload: CreateSalePayload) {
  // ✅ Garantiza quantity=1 si viene vacío/undefined/null
  const safeQty = normalizeQty(payload.quantity);

  const { data } = await authClient.post<CreateSaleResponse>("/sales", {
    ...payload,
    quantity: safeQty,
  });

  return data;
}

/** ====== Tipos utilitarios "mis compras" ====== */

export type MyOrdersSearchBody = {
  tenantSlug?: string;
  status?: "COMPLETADO" | "EN_PROCESO" | "PENDIENTE" | "DEVUELTO" | "CANCELADA";
  page?: number;
  pageSize?: number;
};

type MyOrdersResponseVariant =
  | {
      items?: Array<any>;
      page?: number;
      pageSize?: number;
      total?: number;
      totalPages?: number;
      meta?: any;
    }
  | {
      data?: Array<any>;
      page?: number;
      pageSize?: number;
      total?: number;
      totalPages?: number;
      meta?: any;
    };

export type MyOrderItem = {
  id: string;
  saleNumber?: number | null;
  createdAt: string;
  status: "PENDIENTE" | "EN_PROCESO" | "COMPLETADO" | "DEVUELTO" | "CANCELADA";

  currencyCode?: string | null;
  paymentPortal?: string | null;

  // ✅ qty para UI
  quantity?: number | null;

  priceUsdCents?: NumLike;
  discountPct?: NumLike;
  currencyValuePerUsd?: NumLike;

  finalUsdCents?: NumLike;
  finalInCurrency?: NumLike;

  // algunos backends devuelven totalInCurrency ya listo
  totalInCurrency?: NumLike;

  // ✅ para botón “Ir a pagar”
  binanceCheckoutUrl?: string | null;

  items?: Array<{ productTitle?: string; subproductName?: string }>;

  product?: { id: string; title?: string | null; logoUrl?: string | null };
  subproduct?: {
    id: string;
    name?: string | null;
    packageImageUrl?: string | null;
  };
};

export async function searchMyOrders(body: MyOrdersSearchBody = {}) {
  const { data } = await authClient.post<MyOrdersResponseVariant>(
    "/sales/my/search",
    {
      page: 1,
      pageSize: 20,
      ...body,
    },
  );

  const list = Array.isArray((data as any)?.items)
    ? (data as any).items
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : [];

  // soporta meta o campos sueltos
  const page = Number.isFinite((data as any)?.page)
    ? (data as any).page!
    : Number.isFinite((data as any)?.meta?.page)
      ? (data as any).meta.page
      : 1;

  const pageSize = Number.isFinite((data as any)?.pageSize)
    ? (data as any).pageSize!
    : Number.isFinite((data as any)?.meta?.pageSize)
      ? (data as any).meta.pageSize
      : list.length || 100;

  const total = Number.isFinite((data as any)?.total)
    ? (data as any).total!
    : Number.isFinite((data as any)?.meta?.total)
      ? (data as any).meta.total
      : list.length;

  return {
    items: list as MyOrderItem[],
    page,
    pageSize,
    total,
  };
}

/**
 * ✅ Detalle (si lo usas en otra parte)
 * - Sin fallback a /sales/my/:id (no existe en tu back según tu comentario anterior)
 */
export async function getMySaleById(saleId: string) {
  const { data } = await authClient.get<any>(`/sales/${saleId}`);
  return data;
}

/** Extrae el checkoutUrl desde cualquier respuesta típica */
export function extractCheckoutUrlFromSaleDetail(detail: any): string | null {
  if (!detail) return null;

  if (isBinanceCreateResponse(detail)) return detail.binance.checkoutUrl;

  if (
    typeof detail?.binanceCheckoutUrl === "string" &&
    detail.binanceCheckoutUrl.trim()
  ) {
    return detail.binanceCheckoutUrl.trim();
  }

  if (
    typeof detail?.sale?.binanceCheckoutUrl === "string" &&
    detail.sale.binanceCheckoutUrl.trim()
  ) {
    return detail.sale.binanceCheckoutUrl.trim();
  }

  if (
    typeof detail?.binance?.checkoutUrl === "string" &&
    detail.binance.checkoutUrl.trim()
  ) {
    return detail.binance.checkoutUrl.trim();
  }

  return null;
}
