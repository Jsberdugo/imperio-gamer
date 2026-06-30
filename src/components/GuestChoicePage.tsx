import { Button } from './ui/button';
import { UserPlus, LogIn, UserX, AlertCircle } from 'lucide-react';

interface GuestChoicePageProps {
  onNavigate: (page: string) => void;
  productName: string;
}

export function GuestChoicePage({ onNavigate, productName }: GuestChoicePageProps) {
  const handleLogin = () => {
    onNavigate('login');
  };

  const handleRegister = () => {
    onNavigate('register');
  };

  const handleContinueAsGuest = () => {
    onNavigate('product-detail');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="mx-auto max-w-2xl w-full">
        <div 
          className="border-2 border-primary bg-card/90 backdrop-blur p-8"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-primary mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
              Antes de continuar
            </h1>
            <p className="text-muted-foreground">
              Has seleccionado: <span className="text-primary">{productName}</span>
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {/* Login Option */}
            <button
              onClick={handleLogin}
              className="w-full border-2 border-primary bg-card/50 p-6 text-left transition-all hover:bg-primary/10 hover:scale-[1.02]"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 border border-primary bg-secondary/50" style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-2" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                    Iniciar Sesión
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Accede a tu cuenta para ver tu historial de compras y datos guardados
                  </p>
                </div>
              </div>
            </button>

            {/* Register Option */}
            <button
              onClick={handleRegister}
              className="w-full border-2 border-primary bg-card/50 p-6 text-left transition-all hover:bg-primary/10 hover:scale-[1.02]"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 border border-primary bg-secondary/50" style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}>
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-2" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                    Registrarse
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Crea una cuenta para guardar tu número de contacto y seguir el estado de tus compras
                  </p>
                </div>
              </div>
            </button>

            {/* Guest Option */}
            <button
              onClick={handleContinueAsGuest}
              className="w-full border-2 border-border bg-card/30 p-6 text-left transition-all hover:bg-card/50 hover:border-primary/50"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 border border-border bg-secondary/30">
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Continuar como Invitado</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compra sin crear una cuenta
                  </p>
                  
                  {/* Warning Box */}
                  <div 
                    className="border border-yellow-500/30 bg-yellow-500/10 p-3 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-yellow-200/80">
                      <p className="mb-1">Como invitado no podrás:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-yellow-200/70">
                        <li>Guardar tu número de contacto</li>
                        <li>Ver el estado de tus compras</li>
                        <li>Acceder a tu historial de pedidos</li>
                        <li>Recibir notificaciones sobre tus compras</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}