import { useState } from "react";
import { Check, Copy, Download, Package, X } from "lucide-react";
import { PurchaseTx } from "../../types/transaction";
import { PRODUCTS } from "../../data/products";
import { downloadCodesCSV } from "../../utils/downloadCodesCSV";

/* ──────────────────────────────────────────────────────────────
   CODES MODAL
────────────────────────────────────────────────────────────── */
export function CodesModal({
  tx,
  onClose,
}: {
  tx: PurchaseTx;
  onClose: () => void;
}) {
  const [copiedAll, setCopiedAll] = useState(false);
  const product = PRODUCTS.find((p) => p.id === tx.productId);
  const Icon = product?.icon ?? Package;

  const copyAll = () => {
    navigator.clipboard.writeText(tx.codes.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadCSV = () => downloadCodesCSV(tx.codes, tx.product, tx.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(9,11,15,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#10141c",
          border: "1px solid rgba(212,168,67,0.3)",
        }}>
        <div
          className="px-5 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
          <div className="flex items-center gap-3">
            <Icon
              className="w-4 h-4"
              style={{ color: product?.color ?? "#d4a843" }}
            />
            <h3
              className="font-bold"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {tx.product}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-muted-foreground flex-1">
              {tx.codes.length} código{tx.codes.length > 1 ? "s" : ""} ·{" "}
              {tx.date}
            </p>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: copiedAll
                  ? "rgba(24,165,84,0.2)"
                  : "rgba(212,168,67,0.12)",
                color: copiedAll ? "#18a554" : "#d4a843",
                border: `1px solid ${copiedAll ? "rgba(24,165,84,0.4)" : "rgba(212,168,67,0.25)"}`,
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
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(93,217,252,0.08)",
                color: "#5DD9FC",
                border: "1px solid rgba(93,217,252,0.25)",
              }}>
              <Download className="w-3 h-3" />
              Excel
            </button>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {tx.codes.map((code, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                <span
                  className="text-xs font-bold w-4 shrink-0 text-center"
                  style={{ color: "#d4a843" }}>
                  #{i + 1}
                </span>
                <span className="font-mono text-sm font-semibold tracking-wider flex-1">
                  {code}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
