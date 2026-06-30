import { useState } from "react";
import { CoinCanvas } from "./components/ui/CoinCanvas";
import { Dashboard } from "./pages/Dashboard";
import { LoginModal } from "./components/auth/LoginModal";
/* ──────────────────────────────────────────────────────────────
   ROOT
────────────────────────────────────────────────────────────── */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("GamerPro99");
  const [totalSpent] = useState(487);
  const [loginModal, setLoginModal] = useState<{
    open: boolean;
    product: string;
  }>({ open: false, product: "" });
  const handleLogin = () => {
    setLoggedIn(true);
    setLoginModal({ open: false, product: "" });
  };
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <CoinCanvas />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(9,11,15,0.72)" }}
      />
      <div className="relative z-20">
        <Dashboard
          loggedIn={loggedIn}
          username={username}
          setUsername={setUsername}
          totalSpent={totalSpent}
          onLogout={() => setLoggedIn(false)}
          onLoginOpen={(p) => setLoginModal({ open: true, product: p })}
          onLoginNav={() => setLoginModal({ open: true, product: "" })}
        />
      </div>
      {loginModal.open && (
        <LoginModal
          pendingProduct={loginModal.product}
          onClose={() => setLoginModal({ open: false, product: "" })}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
