import { Check, X } from "lucide-react";
import { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { getTier } from "../../utils/getTier";
import { INSTRUCTIONS } from "../../data/instructions";
/* ──────────────────────────────────────────────────────────────
   CONFIRM PURCHASE MODAL  (qty selector + description)
────────────────────────────────────────────────────────────── */
interface PendingPurchase {
  product: (typeof PRODUCTS)[0];
}

export function ConfirmPurchaseModal({
  pending,
  balance,
  tier,
  onConfirm,
  onCancel,
}: {
  pending: PendingPurchase;
  balance: number;
  tier: ReturnType<typeof getTier>;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
}) {
  const { product } = pending;
  const [qty, setQty] = useState(1);
  const Icon = product.icon;
  const discount = tier.discount;
  const finalPrice = product.price * (1 - discount / 100);
  const total = finalPrice * qty;
  const balanceAfter = balance - total;
  const insufficient = balanceAfter < 0;
  const instructions = INSTRUCTIONS[product.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{ background: "rgba(9,11,15,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}>
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl my-auto"
        style={{
          background: "#10141c",
          border: "1px solid rgba(212,168,67,0.3)",
        }}>
        {/* header */}
        <div
          className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Confirmar Compra
          </h3>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* product */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `${product.color}22`,
                border: `1px solid ${product.color}55`,
              }}>
              <Icon className="w-7 h-7" style={{ color: product.color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold tracking-widest uppercase">
                {product.category}
              </p>
              <p
                className="font-bold text-base"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {product.name}
              </p>
              {discount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block"
                  style={{
                    background: tier.bg,
                    color: tier.color,
                    border: `1px solid ${tier.border}`,
                  }}>
                  -{discount}% {tier.name}
                </span>
              )}
            </div>
          </div>

          {/* how to redeem */}
          {instructions && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                ¿Cómo canjear este código?
              </p>
              <ol className="space-y-1.5">
                {instructions.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span
                      className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
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
                <p className="text-[11px] text-muted-foreground mt-2 italic">
                  {instructions.note}
                </p>
              )}
            </div>
          )}

          {/* qty selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Cantidad (máx. {product.maxUnits})
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(212,168,67,0.25)" }}>
                <button
                  className="px-4 py-2.5 text-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="px-5 py-2.5 font-mono font-bold text-foreground text-lg min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  className="px-4 py-2.5 text-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() =>
                    setQty((q) => Math.min(product.maxUnits, q + 1))
                  }>
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  ${finalPrice.toFixed(2)} c/u
                </p>
                <p
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    color: "#d4a843",
                  }}>
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* balance impact */}
          <div
            className="rounded-xl p-3.5 space-y-2"
            style={{
              background: insufficient
                ? "rgba(212,56,56,0.08)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${insufficient ? "rgba(212,56,56,0.3)" : "rgba(212,168,67,0.12)"}`,
            }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tu saldo actual</span>
              <span className="font-mono font-semibold">
                ${balance.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saldo después</span>
              <span
                className="font-mono font-semibold"
                style={{ color: insufficient ? "#ef4444" : "#18a554" }}>
                ${balanceAfter.toFixed(2)}
              </span>
            </div>
            {insufficient && (
              <p
                className="text-xs font-medium pt-1"
                style={{ color: "#ef4444" }}>
                Saldo insuficiente — recarga antes de continuar.
              </p>
            )}
          </div>

          {/* actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-secondary active:scale-95"
              style={{
                border: "1px solid rgba(212,168,67,0.2)",
                color: "#8a8fa0",
              }}>
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(qty)}
              disabled={insufficient}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: insufficient
                  ? "#1a1f2e"
                  : "linear-gradient(135deg,#18a554,#0f7a3d)",
                color: "#fff",
                fontFamily: "'Rajdhani', sans-serif",
                boxShadow: insufficient
                  ? "none"
                  : "0 4px 16px rgba(24,165,84,0.3)",
              }}>
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                Confirmar Compra
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
