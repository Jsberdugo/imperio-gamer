import { ShoppingCart, X } from "lucide-react";
import { AuthPanel } from "./AuthPanel";
/* ──────────────────────────────────────────────────────────────
   LOGIN MODAL
────────────────────────────────────────────────────────────── */
export function LoginModal({
  onClose,
  onLogin,
  pendingProduct,
}: {
  onClose: () => void;
  onLogin: () => void;
  pendingProduct: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(9,11,15,0.82)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-secondary z-10"
          style={{
            background: "rgba(16,20,28,0.95)",
            border: "1px solid rgba(212,168,67,0.2)",
          }}>
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <div
          className="mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
          style={{
            background: "rgba(212,168,67,0.12)",
            border: "1px solid rgba(212,168,67,0.3)",
          }}>
          <ShoppingCart
            className="w-4 h-4 shrink-0"
            style={{ color: "#d4a843" }}
          />
          <p className="text-sm leading-relaxed" style={{ color: "#f0ede6" }}>
            Para comprar{" "}
            <span className="font-semibold" style={{ color: "#d4a843" }}>
              {pendingProduct}
            </span>{" "}
            necesitas iniciar sesión — es rápido. ¡Funciona para no perder tus
            compras y puntos!
          </p>
        </div>
        <AuthPanel onLogin={onLogin} />
      </div>
    </div>
  );
}
