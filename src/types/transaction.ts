import { Product } from "./product";

export interface TxBase {
  id: string;
  date: string;
  status: "Completado" | "Pendiente" | "Cancelado";
}

export interface PurchaseTx extends TxBase {
  type: "compra";
  product: string;
  productId: number;
  qty: number;
  amount: string;
  amountNum: number;
  codes: string[];
  category: string;
}

export interface RechargeTx extends TxBase {
  type: "recarga";
  amount: string;
  amountNum: number;
}

export type Transaction = PurchaseTx | RechargeTx;

export interface Receipt {
  product: Product;
  qty: number;
  unitPrice: number;
  total: number;
  codes: string[];
  txId: string;
  date: string;
}

export interface PendingPurchase {
  product: Product;
}
