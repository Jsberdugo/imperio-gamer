import { Transaction } from "../types/transaction";
import { generateCode } from "../utils/generateCode";

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2847",
    type: "compra",
    product: "Robux 4500",
    productId: 1,
    qty: 3,
    date: "28 Jun 2026, 14:32",
    amount: "$30.00",
    amountNum: 30,
    status: "Completado",
    category: "Roblox",
    codes: [generateCode(), generateCode(), generateCode()],
  },

  {
    id: "TXN-2846",
    type: "recarga",
    date: "28 Jun 2026, 11:05",
    amount: "$100.00",
    amountNum: 100,
    status: "Completado",
  },

  {
    id: "TXN-2845",
    type: "compra",
    product: "V-Bucks 2800",
    productId: 2,
    qty: 2,
    date: "27 Jun 2026, 20:18",
    amount: "$40.00",
    amountNum: 40,
    status: "Pendiente",
    category: "Fortnite",
    codes: [generateCode(), generateCode()],
  },

  {
    id: "TXN-2844",
    type: "compra",
    product: "Xbox Game Pass",
    productId: 5,
    qty: 1,
    date: "27 Jun 2026, 16:44",
    amount: "$15.00",
    amountNum: 15,
    status: "Completado",
    category: "Xbox",
    codes: [generateCode()],
  },

  {
    id: "TXN-2843",
    type: "recarga",
    date: "26 Jun 2026, 09:22",
    amount: "$50.00",
    amountNum: 50,
    status: "Cancelado",
  },

  {
    id: "TXN-2842",
    type: "compra",
    product: "Discord Nitro × 5",
    productId: 7,
    qty: 5,
    date: "25 Jun 2026, 18:55",
    amount: "$40.00",
    amountNum: 40,
    status: "Completado",
    category: "Discord",
    codes: Array.from({ length: 5 }, generateCode),
  },
];

export const PRESET_AMOUNTS = [10, 25, 50, 100, 200];
