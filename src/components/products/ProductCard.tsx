import { Check, ShoppingCart } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { getTier } from "../../utils/getTier";
import { TiltCard } from "../ui/TiltCard";

/* ──────────────────────────────────────────────────────────────
   PRODUCT CARD
────────────────────────────────────────────────────────────── */
export function ProductCard({
  product,
  loggedIn,
  onLoginRequired,
  onRequestBuy,
  tier,
  justConfirmed,
}: {
  product: (typeof PRODUCTS)[0];
  loggedIn: boolean;
  onLoginRequired: (name: string) => void;
  onRequestBuy: (product: (typeof PRODUCTS)[0]) => void;
  tier: ReturnType<typeof getTier>;
  justConfirmed: boolean;
}) {
  const Icon = product.icon;
  const discount = tier.discount;
  const finalPrice = product.price * (1 - discount / 100);
  const handleBuy = () => {
    if (!loggedIn) {
      onLoginRequired(product.name);
      return;
    }
    onRequestBuy(product);
  };
  return (
    <TiltCard className="h-full">
      <div
        className="h-full rounded-xl p-4 flex flex-col gap-3"
        style={{
          background: "rgba(16,20,28,0.88)",
          backdropFilter: "blur(8px)",
        }}>
        <div
          className="h-0.5 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${product.color}, transparent)`,
          }}
        />
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `${product.color}22`,
              border: `1px solid ${product.color}44`,
            }}>
            <Icon className="w-5 h-5" style={{ color: product.color }} />
          </div>
          {product.tag && (
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{ background: "rgba(212,168,67,0.18)", color: "#d4a843" }}>
              {product.tag}
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
            {product.category}
          </p>
          <h3
            className="font-bold leading-tight mt-0.5"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem" }}>
            {product.name}
          </h3>
        </div>
        <div>
          {discount > 0 ? (
            <div className="flex items-baseline gap-2">
              <p
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  color: "#d4a843",
                }}>
                ${finalPrice.toFixed(2)}
              </p>
              <p className="text-xs line-through text-muted-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p
              className="text-xl font-bold"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: "#d4a843",
              }}>
              ${product.price.toFixed(2)}
            </p>
          )}
          {discount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: tier.bg,
                color: tier.color,
                border: `1px solid ${tier.border}`,
              }}>
              -{discount}% {tier.name}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Máx.{" "}
          <span className="text-foreground font-semibold">
            {product.maxUnits}
          </span>{" "}
          unid.
        </p>
        <div className="mt-auto">
          <button
            onClick={handleBuy}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              background: justConfirmed
                ? "linear-gradient(135deg,#d4a843,#a07020)"
                : "linear-gradient(135deg,#18a554,#0f7a3d)",
              color: "#fff",
              fontFamily: "'Rajdhani', sans-serif",
            }}>
            {justConfirmed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                ¡Listo!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
