import { Button } from './ui/button';
import { Gem, CheckCircle2, Home, ShoppingBag, UserPlus } from 'lucide-react';
import type { PaymentData } from './CheckoutPage';

interface CartItem {
  product: {
    id: string;
    name: string;
    diamonds: number;
    price: number;
    image: string;
  };
  quantity: number;
}

interface ReceiptPageProps {
  cartItems: CartItem[];
  paymentData: PaymentData;
  isLoggedIn: boolean;
  onNavigate: (page: string) => void;
}

export function ReceiptPage({ cartItems, paymentData, isLoggedIn, onNavigate }: ReceiptPageProps) {
  const totalDiamonds = cartItems.reduce((sum, item) => sum + (item.product.diamonds * item.quantity), 0);
  const receiptNumber = `RCP-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="border-2 border-primary bg-primary/10 p-6 rounded-full"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
          >
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-primary mb-2 text-center" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
          ¡Pago Confirmado!
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Tu compra ha sido procesada exitosamente
        </p>

        {/* Receipt Card */}
        <div 
          className="border-2 border-primary bg-card/90 backdrop-blur p-8 mb-6"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          {/* Receipt Header */}
          <div className="border-b border-primary/30 pb-4 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                  Recibo de Compra
                </h2>
                <p className="text-sm text-muted-foreground">Número: {receiptNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="text-sm">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Products Purchased */}
          <div className="mb-6">
            <h3 className="text-primary mb-3" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              Productos Comprados
            </h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex justify-between items-center border border-primary/30 bg-secondary/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Gem className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.product.diamonds.toLocaleString('es-VE')} diamantes x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-primary">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ID Assignment Details */}
          <div className="mb-6">
            <h3 className="text-primary mb-3" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              Asignación de ID
            </h3>
            <div 
              className="border border-primary/30 bg-secondary/50 p-4"
              style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
            >
              {paymentData.idAssignment === 'single' ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID única para todas las recargas:</p>
                  <p className="text-primary">{paymentData.singleId}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">IDs individuales por producto:</p>
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <span className="text-sm">{item.product.name}:</span>
                      <span className="text-primary">{paymentData.individualIds?.[item.product.id]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="text-primary mb-3" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              Información de Pago
            </h3>
            <div 
              className="border border-primary/30 bg-secondary/50 p-4 space-y-2"
              style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
            >
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono de pago:</span>
                <span>{paymentData.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Referencia (últimos 6 dígitos):</span>
                <span>{paymentData.referenceDigits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número de contacto:</span>
                <span>{paymentData.contactNumber}</span>
              </div>
              {paymentData.paidMore && (
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-sm text-primary">
                    ✓ Pagó un monto superior al total
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Total Summary */}
          <div 
            className="border-2 border-primary bg-primary/10 p-4"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Total Diamantes:</span>
              <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                <Gem className="inline h-4 w-4 mr-1" />
                {totalDiamonds.toLocaleString('es-VE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Pagado:</span>
              <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                ${paymentData.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 border border-primary/20 bg-secondary/30">
            <p className="text-sm text-muted-foreground text-center">
              Nos pondremos en contacto contigo a través del número proporcionado si es necesario.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
            className="border-primary hover:bg-primary/10"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
          >
            <Home className="mr-2 h-4 w-4" />
            Ir al Inicio
          </Button>

          {isLoggedIn ? (
            <Button
              onClick={() => onNavigate('profile')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mis Compras
            </Button>
          ) : (
            <Button
              onClick={() => onNavigate('register')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Registrarse
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}