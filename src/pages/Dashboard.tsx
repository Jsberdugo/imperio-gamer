import { useState, useRef } from "react";
import {
  Wallet,
  RefreshCw,
  ShoppingCart,
  History,
  Package,
  Zap,
  Crown,
  Check,
  Bitcoin,
  User,
  LogOut,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { getTier } from "../utils/getTier";
import { generateCode } from "../utils/generateCode";
import { PRESET_AMOUNTS, INITIAL_TRANSACTIONS } from "../data/transactions";
import { PendingPurchase, Receipt, Transaction } from "../types/transaction";
import { ProductCard } from "../components/products/ProductCard";
import { ReceiptView } from "../pages/ReceiptPage";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { ConfirmPurchaseModal } from "../components/products/ConfirmPurchaseModal";
import { ProfileSection } from "../components/profile/ProfileSection";
import TierIcon from "../components/profile/TierIcon";
import { PurchaseTx } from "../types/transaction";
/* ──────────────────────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────────────────────── */
type Section = "productos" | "saldo" | "historial" | "perfil";

export function Dashboard({
  loggedIn,
  username,
  setUsername,
  totalSpent,
  onLogout,
  onLoginOpen,
  onLoginNav,
}: {
  loggedIn: boolean;
  username: string;
  setUsername: (v: string) => void;
  totalSpent: number;
  onLogout: () => void;
  onLoginOpen: (p: string) => void;
  onLoginNav: () => void;
}) {
  const [section, setSection] = useState<Section>("productos");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [glowing, setGlowing] = useState(false);
  const [balance, setBalance] = useState(1247.5);
  const [pendingPurchase, setPendingPurchase] =
    useState<PendingPurchase | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [lastConfirmedId, setLastConfirmedId] = useState<number | null>(null);
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const binanceRef = useRef<HTMLDivElement>(null);

  const tier = getTier(totalSpent);
  const finalAmount = customAmount
    ? parseFloat(customAmount) || 0
    : (selectedAmount ?? 0);

  const scrollToBinance = () => {
    setSection("saldo");
    setReceipt(null);
    setTimeout(() => {
      binanceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setGlowing(true);
      setTimeout(() => setGlowing(false), 2800);
    }, 60);
  };

  const handleRequestBuy = (product: (typeof PRODUCTS)[0]) => {
    setPendingPurchase({ product });
  };

  const handleConfirmPurchase = (qty: number) => {
    if (!pendingPurchase) return;
    const { product } = pendingPurchase;
    const discount = tier.discount;
    const unitPrice = product.price * (1 - discount / 100);
    const total = unitPrice * qty;
    const codes = Array.from({ length: qty }, generateCode);
    const txId = `TXN-${Math.floor(1000 + Math.random() * 8999)}`;
    const date = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const newTx: PurchaseTx = {
      id: txId,
      type: "compra",
      product: product.name,
      productId: product.id,
      qty,
      date,
      amount: `$${total.toFixed(2)}`,
      amountNum: total,
      status: "Completado",
      codes,
      category: product.category,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBalance((b) => b - total);
    setLastConfirmedId(product.id);
    setPendingPurchase(null);
    setReceipt({ product, qty, unitPrice, total, codes, txId, date });
    setTimeout(() => setLastConfirmedId(null), 2000);
  };

  const navItems: [Section, string, React.ElementType][] = [
    ["productos", "Productos", Package],
    ["saldo", "Mi Saldo", Wallet],
    ["historial", "Historial", History],
    ...(loggedIn
      ? [["perfil", "Perfil", User] as [Section, string, React.ElementType]]
      : []),
  ];

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setReceipt(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-40 border-b border-border"
        style={{
          background: "rgba(9,11,15,0.88)",
          backdropFilter: "blur(16px)",
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#d4a843,#a07020)" }}>
              <Crown className="w-4 h-4 text-black" />
            </div>
            <span
              className="text-lg font-bold tracking-wider uppercase hidden sm:block"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: "#d4a843",
              }}>
              Imperio Gamer
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {navItems.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => handleSectionChange(key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={
                  section === key && !receipt
                    ? { background: "rgba(212,168,67,0.12)", color: "#d4a843" }
                    : { color: "#8a8fa0" }
                }>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {loggedIn ? (
              <>
                <button
                  onClick={scrollToBinance}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:brightness-110"
                  title="Recargar saldo"
                  style={{
                    background: "rgba(24,165,84,0.12)",
                    border: "1px solid rgba(24,165,84,0.3)",
                  }}>
                  <Wallet
                    className="w-3.5 h-3.5"
                    style={{ color: "#18a554" }}
                  />
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: "#18a554" }}>
                    ${balance.toFixed(2)}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setReceipt(null);
                    setSection("perfil");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:brightness-110"
                  style={{
                    background: tier.bg,
                    border: `1px solid ${tier.border}`,
                  }}>
                  <TierIcon tier={tier} size={16} />
                  <span
                    className="text-sm font-semibold hidden sm:block"
                    style={{
                      color: tier.color,
                      fontFamily: "'Rajdhani', sans-serif",
                    }}>
                    {username}
                  </span>
                  <span
                    className="text-xs font-bold hidden md:block"
                    style={{
                      color: tier.dimColor,
                      fontFamily: "'Rajdhani', sans-serif",
                    }}>
                    {tier.name}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="Salir">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginNav}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#d4a843,#a07020)",
                  color: "#0a0c10",
                  fontFamily: "'Rajdhani', sans-serif",
                }}>
                <User className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
        <div className="sm:hidden flex border-t border-border">
          {navItems.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors"
              style={{
                color: section === key && !receipt ? "#d4a843" : "#8a8fa0",
              }}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* RECEIPT */}
        {receipt && (
          <ReceiptView
            receipt={receipt}
            onContinue={() => {
              setReceipt(null);
              setSection("productos");
            }}
            onHistory={() => {
              setReceipt(null);
              setSection("historial");
            }}
          />
        )}

        {/* PRODUCTOS */}
        {!receipt && section === "productos" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Catálogo Mayorista
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {PRODUCTS.length} productos · Precios exclusivos
                </p>
              </div>
              <div className="flex items-center gap-3">
                {loggedIn && tier.discount > 0 && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: tier.bg,
                      color: tier.color,
                      border: `1px solid ${tier.border}`,
                    }}>
                    <TierIcon tier={tier} size={14} />-{tier.discount}% aplicado
                  </div>
                )}
                <div
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(24,165,84,0.15)",
                    color: "#18a554",
                    border: "1px solid rgba(24,165,84,0.3)",
                  }}>
                  Stock disponible
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {PRODUCTS.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  loggedIn={loggedIn}
                  onLoginRequired={onLoginOpen}
                  onRequestBuy={handleRequestBuy}
                  tier={tier}
                  justConfirmed={lastConfirmedId === p.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* SALDO */}
        {!receipt && section === "saldo" && (
          <>
            <div
              className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
              style={{
                background: "rgba(16,20,28,0.88)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,168,67,0.25)",
              }}>
              <div
                className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle,rgba(212,168,67,0.1) 0%,transparent 70%)",
                }}
              />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p
                    className="text-sm font-semibold tracking-widest uppercase mb-2"
                    style={{ color: "#8a8fa0" }}>
                    Tu Saldo
                  </p>
                  <p
                    className="text-5xl sm:text-6xl font-bold"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      color: "#d4a843",
                      textShadow: "0 0 40px rgba(212,168,67,0.3)",
                    }}>
                    ${balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Última actualización: ahora
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-3">
                  <button
                    onClick={scrollToBinance}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg,#18a554,#0f7a3d)",
                      color: "#fff",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "1rem",
                      boxShadow: "0 4px 20px rgba(24,165,84,0.3)",
                    }}>
                    <Zap className="w-4 h-4" />
                    Recargar Saldo
                  </button>
                  <div className="flex gap-4 text-center">
                    {[
                      ["Este mes", "$3,840"],
                      ["Transacciones", String(transactions.length)],
                      ["Nivel", tier.name],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p
                          className="text-sm font-bold"
                          style={{
                            color: label === "Nivel" ? tier.color : "#f0ede6",
                          }}>
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(212,168,67,0.08)",
                border: "1px solid rgba(212,168,67,0.3)",
              }}>
              <Zap className="w-4 h-4 shrink-0" style={{ color: "#d4a843" }} />
              <p className="text-sm" style={{ color: "#f0ede6" }}>
                <span className="font-semibold" style={{ color: "#d4a843" }}>
                  Aviso:
                </span>{" "}
                El sistema aplica un{" "}
                <span className="font-semibold" style={{ color: "#d4a843" }}>
                  1% de fee
                </span>{" "}
                adicional sobre el monto recargado. No se realizan reembolsos
                bajo ninguna circunstancia.
              </p>
            </div>

            {glowing && (
              <style>{`@keyframes binance-glow-pulse{0%,100%{box-shadow:0 0 0 1px rgba(212,168,67,0.6),0 0 18px rgba(212,168,67,0.35);}50%{box-shadow:0 0 0 3px rgba(212,168,67,0.9),0 0 50px rgba(212,168,67,0.6),0 0 90px rgba(212,168,67,0.2);}}.binance-glow{animation:binance-glow-pulse 0.75s ease-in-out 4;border-color:rgba(212,168,67,0.7)!important;}`}</style>
            )}

            <div
              ref={binanceRef}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl transition-all ${glowing ? "binance-glow" : ""}`}>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(16,20,28,0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212,168,67,0.18)",
                }}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(212,168,67,0.15)" }}>
                    <Bitcoin className="w-5 h-5" style={{ color: "#d4a843" }} />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      Recargar con Binance Pay
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Confirmación automática al instante
                    </p>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Monto rápido
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                        style={
                          selectedAmount === amt && !customAmount
                            ? {
                                background:
                                  "linear-gradient(135deg,#d4a843,#a07020)",
                                color: "#0a0c10",
                                boxShadow: "0 2px 12px rgba(212,168,67,0.35)",
                              }
                            : {
                                background: "#161b26",
                                color: "#8a8fa0",
                                border: "1px solid rgba(212,168,67,0.15)",
                              }
                        }>
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Monto personalizado
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold"
                      style={{ color: "#d4a843" }}>
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full pl-8 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                      style={{
                        background: "#161b26",
                        border: "1px solid rgba(212,168,67,0.18)",
                        fontFamily: "'JetBrains Mono',monospace",
                        ["--tw-ring-color" as string]: "#d4a843",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
                  style={{
                    background: "rgba(212,168,67,0.07)",
                    border: "1px solid rgba(212,168,67,0.18)",
                  }}>
                  <span className="text-sm text-muted-foreground">
                    Total a recargar
                  </span>
                  <div className="text-right">
                    <p
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        color: "#d4a843",
                      }}>
                      ${finalAmount.toFixed(2)}
                    </p>
                    {finalAmount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        +${(finalAmount * 0.01).toFixed(2)} fee (1%)
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="w-full py-3.5 rounded-xl font-bold tracking-wider uppercase transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background:
                      finalAmount > 0
                        ? "linear-gradient(135deg,#18a554,#0f7a3d)"
                        : "#1a1f2e",
                    color: finalAmount > 0 ? "#fff" : "#4a4f60",
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.95rem",
                    cursor: finalAmount > 0 ? "pointer" : "not-allowed",
                    boxShadow:
                      finalAmount > 0
                        ? "0 4px 20px rgba(24,165,84,0.3)"
                        : "none",
                  }}>
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Recargar Ahora
                  </span>
                </button>
              </div>
              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "rgba(16,20,28,0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212,168,67,0.18)",
                }}>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  ¿Cómo funciona?
                </h3>
                {[
                  [
                    "1",
                    "Escoge cuánto quieres recargar usando los botones rápidos o ingresando un monto personalizado.",
                  ],
                  ["2", "Presiona el botón <b>Recargar Ahora</b>."],
                  [
                    "3",
                    "El sistema automatizado de Binance confirmará tu pago al instante y tu saldo se acreditará de forma inmediata.",
                  ],
                ].map(([n, t]) => (
                  <div key={n} className="flex gap-3">
                    <div
                      className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "rgba(212,168,67,0.15)",
                        color: "#d4a843",
                      }}>
                      {n}
                    </div>
                    <p
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: t }}
                    />
                  </div>
                ))}
                <div
                  className="flex items-start gap-3 p-4 rounded-xl mt-2"
                  style={{
                    background: "rgba(24,165,84,0.07)",
                    border: "1px solid rgba(24,165,84,0.25)",
                  }}>
                  <Check
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "#18a554" }}
                  />
                  <p className="text-sm" style={{ color: "#18a554" }}>
                    Confirmación automática · Sin esperas · Disponible 24/7
                  </p>
                </div>
                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: "rgba(212,168,67,0.06)",
                    border: "1px solid rgba(212,168,67,0.2)",
                  }}>
                  <Zap
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "#d4a843" }}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Se aplica un{" "}
                    <span className="font-semibold text-foreground">
                      1% de fee
                    </span>
                    . No se realizan reembolsos bajo ninguna circunstancia.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* HISTORIAL */}
        {!receipt && section === "historial" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Historial de Transacciones
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {transactions.length} operaciones registradas
                </p>
              </div>
              <div className="flex gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(93,217,252,0.08)",
                    color: "#5DD9FC",
                    border: "1px solid rgba(93,217,252,0.2)",
                  }}>
                  <Wallet className="w-3 h-3" />
                  Saldo
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(212,168,67,0.08)",
                    color: "#d4a843",
                    border: "1px solid rgba(212,168,67,0.2)",
                  }}>
                  <ShoppingCart className="w-3 h-3" />
                  Compra
                </div>
              </div>
            </div>
            <TransactionsTable transactions={transactions} />
          </div>
        )}

        {/* PERFIL */}
        {!receipt && section === "perfil" && loggedIn && (
          <div>
            <div className="mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Mi Perfil
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona tu cuenta y consulta tu nivel
              </p>
            </div>
            <ProfileSection
              username={username}
              setUsername={setUsername}
              totalSpent={totalSpent}
            />
          </div>
        )}
      </main>

      {pendingPurchase && (
        <ConfirmPurchaseModal
          pending={pendingPurchase}
          balance={balance}
          tier={tier}
          onConfirm={handleConfirmPurchase}
          onCancel={() => setPendingPurchase(null)}
        />
      )}
    </div>
  );
}
