import { useState } from 'react';
import { ShoppingBag, User, Lock, Package } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Purchase {
  id: string;
  product: string;
  price: string;
  date: string;
  status: 'Completado' | 'Pendiente' | 'Procesando';
}

const mockPurchases: Purchase[] = [
  { id: '1', product: 'Free Fire 500 Diamantes', price: '$5.00', date: '2025-12-08', status: 'Completado' },
  { id: '2', product: 'PUBG 600 UC', price: '$10.00', date: '2025-12-07', status: 'Completado' },
  { id: '3', product: 'Netflix 1 Mes', price: '$15.99', date: '2025-12-05', status: 'Completado' },
  { id: '4', title: 'V-Bucks (Fortnite) 1000', price: '$9.99', date: '2025-12-03', status: 'Completado' },
  { id: '5', product: 'PlayStation Store $10', price: '$10.00', date: '2025-12-01', status: 'Completado' },
];

interface ProfilePageProps {
  username: string;
  email: string;
  onUpdateUsername: (newUsername: string) => void;
  onUpdatePassword: (oldPassword: string, newPassword: string) => void;
}

export function ProfilePage({ username, email, onUpdateUsername, onUpdatePassword }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('purchases');
  
  // Username form
  const [newUsername, setNewUsername] = useState(username);
  
  // Password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUsername(newUsername);
    alert('Usuario actualizado correctamente');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onUpdatePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Contraseña actualizada correctamente');
  };

  const getStatusColor = (status: Purchase['status']) => {
    switch (status) {
      case 'Completado':
        return 'text-green-500';
      case 'Procesando':
        return 'text-yellow-500';
      case 'Pendiente':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-primary">Mi Perfil</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="purchases" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mis Compras
          </TabsTrigger>
          <TabsTrigger value="username" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="mr-2 h-4 w-4" />
            Usuario
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="mr-2 h-4 w-4" />
            Contraseña
          </TabsTrigger>
        </TabsList>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="space-y-4">
          <div 
            className="border-2 border-primary bg-card p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h3 className="mb-6 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Historial de Compras
            </h3>

            <div className="space-y-4">
              {mockPurchases.map((purchase) => (
                <div 
                  key={purchase.id}
                  className="border-2 border-border bg-secondary p-4 transition-all hover:border-primary"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1">{purchase.product}</h4>
                      <p className="text-muted-foreground">
                        Fecha: {new Date(purchase.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-primary">{purchase.price}</span>
                      <span className={getStatusColor(purchase.status)}>
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockPurchases.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No tienes compras registradas aún.
              </p>
            )}
          </div>
        </TabsContent>

        {/* Username Tab */}
        <TabsContent value="username">
          <div 
            className="border-2 border-primary bg-card p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h3 className="mb-6">Cambiar Nombre de Usuario</h3>
            
            <form onSubmit={handleUpdateUsername} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-display">Correo Electrónico</Label>
                <Input
                  id="email-display"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nuevo Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="tu_usuario"
                  required
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
              >
                Actualizar Usuario
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <div 
            className="border-2 border-primary bg-card p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h3 className="mb-6">Cambiar Contraseña</h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="old-password">Contraseña Actual</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-input-background border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
              >
                Actualizar Contraseña
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
