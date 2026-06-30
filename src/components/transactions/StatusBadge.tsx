import { Check, Clock, X } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   STATUS BADGE
────────────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    Completado: {
      bg: "bg-green-900/40",
      text: "text-green-400",
      icon: <Check className="w-3 h-3" />,
    },
    Pendiente: {
      bg: "bg-yellow-900/40",
      text: "text-yellow-400",
      icon: <Clock className="w-3 h-3" />,
    },
    Cancelado: {
      bg: "bg-red-900/40",
      text: "text-red-400",
      icon: <X className="w-3 h-3" />,
    },
  };
  const s = map[status] ?? map.Pendiente;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.icon}
      {status}
    </span>
  );
}
