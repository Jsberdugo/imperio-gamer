import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { getTier } from "../../utils/getTier";
import TierIcon from "./TierIcon";
import { TIERS } from "../../data/tiers";

/* ──────────────────────────────────────────────────────────────
   PROFILE SECTION
────────────────────────────────────────────────────────────── */
export function ProfileSection({
  username,
  setUsername,
  totalSpent,
}: {
  username: string;
  setUsername: (v: string) => void;
  totalSpent: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);
  const tier = getTier(totalSpent);
  const nextTier = TIERS.find((t) => t.min > tier.min) ?? null;
  const progress = nextTier
    ? Math.min(100, (totalSpent / nextTier.min) * 100)
    : 100;
  const save = () => {
    if (draft.trim()) setUsername(draft.trim());
    setEditing(false);
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: "rgba(16,20,28,0.88)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${tier.border}`,
        }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
              style={{
                background: tier.bg,
                border: `2px solid ${tier.border}`,
                color: tier.color,
                fontFamily: "'Rajdhani', sans-serif",
              }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save();
                      if (e.key === "Escape") setEditing(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-foreground text-lg font-bold focus:outline-none focus:ring-2"
                    style={{
                      background: "#161b26",
                      border: "1px solid rgba(212,168,67,0.3)",
                      fontFamily: "'Rajdhani', sans-serif",
                      ["--tw-ring-color" as string]: "#d4a843",
                      maxWidth: "180px",
                    }}
                  />
                  <button
                    onClick={save}
                    className="p-1.5 rounded-lg transition-colors hover:bg-green-900/40"
                    style={{ color: "#18a554" }}>
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-900/40"
                    style={{ color: "#ef4444" }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {username}
                  </h2>
                  <button
                    onClick={() => {
                      setDraft(username);
                      setEditing(true);
                    }}
                    className="p-1 rounded transition-colors text-muted-foreground hover:text-foreground">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-0.5">
                Mayorista · Imperio Gamer
              </p>
            </div>
          </div>
          <div
            className="shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl"
            style={{ background: tier.bg, border: `1px solid ${tier.border}` }}>
            <TierIcon tier={tier} size={32} />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: tier.color }}>
              {tier.name}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            ["Total gastado", `$${totalSpent.toFixed(0)}`],
            ["Transacciones", "124"],
            [
              "Descuento activo",
              tier.discount > 0 ? `-${tier.discount}%` : "—",
            ],
          ].map(([label, val]) => (
            <div
              key={label}
              className="px-3 py-3 rounded-xl text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,168,67,0.1)",
              }}>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p
                className="text-lg font-bold"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  color:
                    label === "Descuento activo" && tier.discount > 0
                      ? "#18a554"
                      : "#f0ede6",
                }}>
                {val}
              </p>
            </div>
          ))}
        </div>
        {nextTier ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">
                Progreso hacia{" "}
                <span
                  className="font-semibold"
                  style={{ color: nextTier.color }}>
                  {nextTier.name}
                </span>
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                ${totalSpent.toFixed(0)} / ${nextTier.min}
              </p>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Te faltan{" "}
              <span className="font-semibold text-foreground">
                ${(nextTier.min - totalSpent).toFixed(0)}
              </span>{" "}
              para alcanzar {nextTier.name}
            </p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(93,217,252,0.08)",
              border: "1px solid rgba(93,217,252,0.3)",
            }}>
            <TierIcon tier={tier} size={18} />
            <p className="text-sm font-semibold" style={{ color: "#5DD9FC" }}>
              Nivel máximo alcanzado — ¡Eres élite Imperio Gamer!
            </p>
          </div>
        )}
      </div>
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(16,20,28,0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,168,67,0.18)",
        }}>
        <h3
          className="text-lg font-bold mb-5"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Sistema de Niveles
        </h3>
        <div className="space-y-3">
          {TIERS.map((t, i) => {
            const isActive = t.name === tier.name;
            const isPast = TIERS.indexOf(t) < TIERS.indexOf(tier);
            const isFuture = !isActive && !isPast;
            return (
              <div
                key={t.name}
                className="flex gap-4 p-4 rounded-xl"
                style={{
                  background: isActive ? t.bg : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? t.border : "rgba(255,255,255,0.06)"}`,
                  opacity: isFuture ? 0.55 : 1,
                }}>
                <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                  <TierIcon tier={t} size={24} />
                  {i < TIERS.length - 1 && (
                    <div
                      className="w-px flex-1 mt-2"
                      style={{
                        background:
                          isActive || isPast
                            ? t.color + "44"
                            : "rgba(255,255,255,0.08)",
                        minHeight: "12px",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        color: t.color,
                      }}>
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.label}
                    </span>
                    {isActive && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: t.bg,
                          color: t.color,
                          border: `1px solid ${t.border}`,
                        }}>
                        Nivel actual
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {t.max === Infinity
                        ? `$${t.min}+`
                        : `$${t.min}–$${t.max}`}
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {t.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check
                          className="w-3 h-3 shrink-0"
                          style={{
                            color: isPast || isActive ? t.color : "#4a4f60",
                          }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
