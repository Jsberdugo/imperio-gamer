import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Crown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  User,
} from "lucide-react";
import { GoogleIcon } from "../ui/GoogleIcon";

/* ──────────────────────────────────────────────────────────────
   AUTH PANEL
────────────────────────────────────────────────────────────── */
export type AuthView = "login" | "register" | "forgot";
export function AuthPanel({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "forgot") {
      setSent(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-2xl p-8 shadow-2xl"
        style={{
          background: "rgba(10,12,16,0.92)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(212,168,67,0.25)",
        }}>
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg,#d4a843,#a07020)",
              boxShadow: "0 8px 32px rgba(212,168,67,0.35)",
            }}>
            <Crown className="w-7 h-7 text-black" />
          </div>
          <h1
            className="text-2xl font-bold tracking-wider uppercase"
            style={{ fontFamily: "'Rajdhani', sans-serif", color: "#d4a843" }}>
            Imperio Gamer
          </h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
            Tienda Mayorista
          </p>
        </div>
        <div className="mb-6">
          {view !== "login" && (
            <button
              onClick={() => {
                setView("login");
                setSent(false);
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al inicio de sesión
            </button>
          )}
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {view === "login"
              ? "Iniciar Sesión"
              : view === "register"
                ? "Crear Cuenta"
                : "Recuperar Contraseña"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {view === "login"
              ? "Accede a tu cuenta mayorista"
              : view === "register"
                ? "Únete a Imperio Gamer hoy"
                : "Te enviaremos instrucciones por correo"}
          </p>
        </div>
        {view === "forgot" && sent ? (
          <div className="text-center py-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(24,165,84,0.15)",
                border: "1px solid rgba(24,165,84,0.4)",
              }}>
              <Check className="w-7 h-7" style={{ color: "#18a554" }} />
            </div>
            <p className="font-semibold mb-1">Correo enviado</p>
            <p className="text-sm text-muted-foreground">
              Revisa tu bandeja en{" "}
              <span className="text-primary">{email || "tu correo"}</span>
            </p>
            <button
              onClick={() => {
                setView("login");
                setSent(false);
              }}
              className="mt-6 text-sm font-medium"
              style={{ color: "#d4a843" }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "register" && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  style={{
                    background: "#161b26",
                    border: "1px solid rgba(212,168,67,0.2)",
                    ["--tw-ring-color" as string]: "#d4a843",
                  }}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                style={{
                  background: "#161b26",
                  border: "1px solid rgba(212,168,67,0.2)",
                  ["--tw-ring-color" as string]: "#d4a843",
                }}
              />
            </div>
            {view !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                  style={{
                    background: "#161b26",
                    border: "1px solid rgba(212,168,67,0.2)",
                    ["--tw-ring-color" as string]: "#d4a843",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
            {view === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-xs font-medium transition-colors hover:text-primary"
                  style={{ color: "#8a8fa0" }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold tracking-wider uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg,#d4a843,#a07020)",
                color: "#0a0c10",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.95rem",
                boxShadow: "0 4px 20px rgba(212,168,67,0.3)",
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verificando...
                </span>
              ) : view === "login" ? (
                "Iniciar Sesión"
              ) : view === "register" ? (
                "Crear Cuenta"
              ) : (
                "Enviar instrucciones"
              )}
            </button>
            {view === "login" && (
              <>
                <div className="flex items-center gap-3 my-1">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(212,168,67,0.15)" }}
                  />
                  <span className="text-xs text-muted-foreground">
                    o continúa con
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(212,168,67,0.15)" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
                  style={{
                    background: "#fff",
                    color: "#1a1a1a",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}>
                  <GoogleIcon />
                  Continuar con Google
                </button>
              </>
            )}
            {view === "login" && (
              <p className="text-center text-sm text-muted-foreground pt-1">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="font-semibold"
                  style={{ color: "#d4a843" }}>
                  Regístrate gratis
                </button>
              </p>
            )}
            {view === "register" && (
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-semibold"
                  style={{ color: "#d4a843" }}>
                  Inicia sesión
                </button>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
