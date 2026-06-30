import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  History,
  Package,
  ShoppingCart,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { INSTRUCTIONS } from "../data/instructions";
/* ──────────────────────────────────────────────────────────────
   RECEIPT VIEW
────────────────────────────────────────────────────────────── */
interface Receipt {
  product: (typeof PRODUCTS)[0];
  qty: number;
  unitPrice: number;
  total: number;
  codes: string[];
  txId: string;
  date: string;
}

export function ReceiptView({
  receipt,
  onContinue,
  onHistory,
}: {
  receipt: Receipt;
  onContinue: () => void;
  onHistory: () => void;
}) {
  const { product, qty, unitPrice, total, codes, txId, date } = receipt;
  const Icon = product.icon;
  const instructions = INSTRUCTIONS[product.category];
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* success header */}
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: "rgba(24,165,84,0.15)",
            border: "2px solid rgba(24,165,84,0.5)",
            boxShadow: "0 0 30px rgba(24,165,84,0.2)",
          }}>
          <Check className="w-8 h-8" style={{ color: "#18a554" }} />
        </div>
        <h2
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "'Rajdhani', sans-serif", color: "#18a554" }}>
          ¡Compra Exitosa!
        </h2>
        <p className="text-sm text-muted-foreground">
          {txId} · {date}
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(16,20,28,0.9)",
          border: "1px solid rgba(212,168,67,0.25)",
        }}>
        {/* product summary */}
        <div
          className="px-6 py-5 flex items-center gap-4"
          style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `${product.color}22`,
              border: `1px solid ${product.color}44`,
            }}>
            <Icon className="w-6 h-6" style={{ color: product.color }} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              {product.category}
            </p>
            <p
              className="font-bold"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {product.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {qty} unid. × ${unitPrice.toFixed(2)}
            </p>
            <p
              className="font-bold text-lg"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: "#d4a843",
              }}>
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* codes */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#d4a843" }}>
              Tus Códigos ({codes.length})
            </p>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
              style={{
                background: copiedAll
                  ? "rgba(24,165,84,0.2)"
                  : "rgba(212,168,67,0.12)",
                color: copiedAll ? "#18a554" : "#d4a843",
                border: `1px solid ${copiedAll ? "rgba(24,165,84,0.4)" : "rgba(212,168,67,0.3)"}`,
              }}>
              {copiedAll ? (
                <>
                  <Check className="w-3 h-3" />
                  Copiados
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copiar todos
                </>
              )}
            </button>
          </div>
          <div className="space-y-2">
            {codes.map((code, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold w-5 text-center"
                    style={{ color: "#d4a843" }}>
                    #{i + 1}
                  </span>
                  <span className="font-mono text-sm font-semibold tracking-widest text-foreground">
                    {code}
                  </span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* how to redeem */}
        {instructions && (
          <div
            className="px-6 py-5"
            style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#d4a843" }}>
              ¿Cómo canjear?
            </p>
            <ol className="space-y-2">
              {instructions.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{
                      background: "rgba(212,168,67,0.15)",
                      color: "#d4a843",
                    }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            {instructions.note && (
              <p className="text-xs text-muted-foreground mt-3 italic">
                {instructions.note}
              </p>
            )}
          </div>
        )}

        {/* actions */}
        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={onHistory}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-secondary active:scale-95"
            style={{
              border: "1px solid rgba(212,168,67,0.2)",
              color: "#8a8fa0",
            }}>
            <History className="w-4 h-4" />
            Historial
          </button>
          <button
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#d4a843,#a07020)",
              color: "#0a0c10",
              fontFamily: "'Rajdhani', sans-serif",
              boxShadow: "0 4px 16px rgba(212,168,67,0.3)",
            }}>
            <ShoppingCart className="w-4 h-4" />
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
