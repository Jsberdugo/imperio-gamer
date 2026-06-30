import { useState } from "react";
import { Download, FileText, ShoppingCart, Wallet } from "lucide-react";

import { Transaction, PurchaseTx } from "../../types/transaction";
import { downloadCodesCSV } from "../../utils/downloadCodesCSV";

import { CodesModal } from "./CodesModal";
import { StatusBadge } from "./StatusBadge";

/* ──────────────────────────────────────────────────────────────
   TRANSACTIONS TABLE
────────────────────────────────────────────────────────────── */
export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [codesModal, setCodesModal] = useState<PurchaseTx | null>(null);

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(212,168,67,0.18)" }}>
        {/* desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "rgba(16,20,28,0.9)",
                  borderBottom: "1px solid rgba(212,168,67,0.12)",
                }}>
                {[
                  "ID",
                  "Tipo",
                  "Descripción",
                  "Fecha",
                  "Monto",
                  "Estado",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#8a8fa0" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="transition-colors duration-150 hover:bg-secondary/40"
                  style={{
                    background:
                      i % 2 === 0
                        ? "rgba(16,20,28,0.85)"
                        : "rgba(13,16,24,0.85)",
                    borderBottom: "1px solid rgba(212,168,67,0.06)",
                  }}>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: "#d4a843" }}>
                      {tx.id}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {tx.type === "recarga" ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(93,217,252,0.1)",
                          color: "#5DD9FC",
                          border: "1px solid rgba(93,217,252,0.25)",
                        }}>
                        <Wallet className="w-2.5 h-2.5" />
                        Saldo
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(212,168,67,0.1)",
                          color: "#d4a843",
                          border: "1px solid rgba(212,168,67,0.25)",
                        }}>
                        <ShoppingCart className="w-2.5 h-2.5" />
                        Compra
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm">
                      {tx.type === "recarga"
                        ? "Recarga de saldo"
                        : (tx as PurchaseTx).product}
                    </span>
                    {tx.type === "compra" && (
                      <p className="text-xs text-muted-foreground">
                        {(tx as PurchaseTx).qty} unid.
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted-foreground">
                      {tx.date}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-sm font-semibold font-mono"
                      style={{
                        color: tx.type === "recarga" ? "#18a554" : undefined,
                      }}>
                      {tx.type === "recarga" ? `+${tx.amount}` : tx.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    {tx.type === "compra" && tx.status === "Completado" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCodesModal(tx as PurchaseTx)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 whitespace-nowrap"
                          style={{
                            background: "rgba(212,168,67,0.1)",
                            color: "#d4a843",
                            border: "1px solid rgba(212,168,67,0.25)",
                          }}>
                          <FileText className="w-3 h-3" />
                          Ver códigos
                        </button>
                        <button
                          onClick={() =>
                            downloadCodesCSV(
                              (tx as PurchaseTx).codes,
                              (tx as PurchaseTx).product,
                              tx.id,
                            )
                          }
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 whitespace-nowrap"
                          style={{
                            background: "rgba(93,217,252,0.08)",
                            color: "#5DD9FC",
                            border: "1px solid rgba(93,217,252,0.25)",
                          }}>
                          <Download className="w-3 h-3" />
                          Excel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile */}
        <div
          className="sm:hidden divide-y"
          style={{ borderColor: "rgba(212,168,67,0.08)" }}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 space-y-2"
              style={{ background: "rgba(16,20,28,0.9)" }}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-mono font-medium"
                  style={{ color: "#d4a843" }}>
                  {tx.id}
                </span>
                <div className="flex items-center gap-2">
                  {tx.type === "recarga" ? (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(93,217,252,0.1)",
                        color: "#5DD9FC",
                      }}>
                      <Wallet className="w-2.5 h-2.5" />
                      Saldo
                    </span>
                  ) : (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(212,168,67,0.1)",
                        color: "#d4a843",
                      }}>
                      Compra
                    </span>
                  )}
                  <StatusBadge status={tx.status} />
                </div>
              </div>
              <p className="text-sm">
                {tx.type === "recarga"
                  ? "Recarga de saldo"
                  : (tx as PurchaseTx).product}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{tx.date}</p>
                <p
                  className="text-sm font-semibold font-mono"
                  style={{
                    color: tx.type === "recarga" ? "#18a554" : undefined,
                  }}>
                  {tx.type === "recarga" ? `+${tx.amount}` : tx.amount}
                </p>
              </div>
              {tx.type === "compra" && tx.status === "Completado" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCodesModal(tx as PurchaseTx)}
                    className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold justify-center transition-all"
                    style={{
                      background: "rgba(212,168,67,0.08)",
                      color: "#d4a843",
                      border: "1px solid rgba(212,168,67,0.2)",
                    }}>
                    <FileText className="w-3 h-3" />
                    Ver códigos
                  </button>
                  <button
                    onClick={() =>
                      downloadCodesCSV(
                        (tx as PurchaseTx).codes,
                        (tx as PurchaseTx).product,
                        tx.id,
                      )
                    }
                    className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold justify-center transition-all"
                    style={{
                      background: "rgba(93,217,252,0.08)",
                      color: "#5DD9FC",
                      border: "1px solid rgba(93,217,252,0.25)",
                    }}>
                    <Download className="w-3 h-3" />
                    Excel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {codesModal && (
        <CodesModal tx={codesModal} onClose={() => setCodesModal(null)} />
      )}
    </>
  );
}
