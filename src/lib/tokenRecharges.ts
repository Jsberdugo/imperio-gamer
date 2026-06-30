import { authClient, type ApiOk } from "./http";

export type TokenRechargeStatus =
  | "PENDIENTE_PAGO"
  | "EN_REVISION"
  | "COMPLETADO"
  | "CANCELADA"
  | "RECHAZADA";

export type TokenRechargeConfig = {
  dispo: boolean;
  automaticApproval: boolean;
  minAmount: string;
  maxAmount: string;
  paymentMethod: "BINANCE" | string;
};

export type TokenRechargeUser = {
  id: string;
  nombre_usuario: string;
  correo?: string | null;
  telefono?: string | null;
};

export type TokenRecharge = {
  id: string;
  userId: string;
  user?: TokenRechargeUser;

  amount: string;
  status: TokenRechargeStatus;
  paymentMethod: string;

  creditedAt?: string | null;
  creditedByWorkerId?: string | null;
  approvedByWorkerId?: string | null;
  rejectedByWorkerId?: string | null;
  rejectionReason?: string | null;

  binanceMerchantTradeNo?: string | null;
  binancePrepayId?: string | null;
  binanceCheckoutUrl?: string | null;
  binanceTransactionId?: string | null;
  binanceStatus?: string | null;
  binanceExpireAt?: string | null;
  paidAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type TokenRechargeCreateInput = {
  amount: number | string;
  description?: string;
};

export type TokenRechargeCreateResponse = {
  recharge: TokenRecharge;
  binance: {
    merchantTradeNo?: string;
    prepayId?: string;
    checkoutUrl?: string;
    expireTime?: number;
    [key: string]: unknown;
  };
};

export type PaginatedTokenRecharges = {
  items: TokenRecharge[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

export type GetMineTokenRechargesQuery = {
  page?: number;
  limit?: number;
  status?: TokenRechargeStatus;
  paymentMethod?: string;
};

export async function getTokenRechargeConfig(): Promise<TokenRechargeConfig> {
  const { data } = await authClient.get<ApiOk<TokenRechargeConfig>>(
    "/token-recharges/config"
  );
  return ((data as any).data ?? data) as TokenRechargeConfig;
}

export async function createTokenRecharge(
  input: TokenRechargeCreateInput
): Promise<TokenRechargeCreateResponse> {
  const payload = {
    amount:
      typeof input.amount === "number"
        ? input.amount.toFixed(3)
        : String(input.amount),
    description: input.description?.trim() || undefined,
  };

  const { data } = await authClient.post<ApiOk<TokenRechargeCreateResponse>>(
    "/token-recharges",
    payload
  );

  return ((data as any).data ?? data) as TokenRechargeCreateResponse;
}

export async function getMyTokenRecharges(
  query: GetMineTokenRechargesQuery = {}
): Promise<PaginatedTokenRecharges> {
  const { data } = await authClient.get<ApiOk<PaginatedTokenRecharges>>(
    "/token-recharges/mine",
    {
      params: query,
    }
  );

  return ((data as any).data ?? data) as PaginatedTokenRecharges;
}