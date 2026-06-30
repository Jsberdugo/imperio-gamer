import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending password reset email
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div 
          className="w-full max-w-md border-2 border-primary bg-card p-8 text-center"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          <h2 className="mb-4 text-primary">Correo Enviado</h2>
          <p className="mb-6 text-muted-foreground">
            Si existe una cuenta con el correo {email}, recibirás instrucciones para 
            restablecer tu contraseña.
          </p>
          <Button
            onClick={() => onNavigate('login')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
          >
            Volver al Inicio de Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div 
        className="w-full max-w-md border-2 border-primary bg-card p-8"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
      >
        <button
          onClick={() => onNavigate('login')}
          className="mb-6 flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <h2 className="mb-2 text-center text-primary">Recuperar Contraseña</h2>
        <p className="mb-6 text-center text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-input-background border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
          >
            Enviar Instrucciones
          </Button>
        </form>
      </div>
    </div>
  );
}
