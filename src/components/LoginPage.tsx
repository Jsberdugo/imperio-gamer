import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div 
        className="w-full max-w-md border-2 border-primary bg-card p-8"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
      >
        <h2 className="mb-6 text-center text-primary">Iniciar Sesión</h2>
        
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

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-input-background border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
          >
            Ingresar
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground">¿No tienes una cuenta? </span>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-primary hover:underline"
            >
              Regístrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
