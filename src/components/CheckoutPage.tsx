import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Gem, QrCode, ArrowLeft } from 'lucide-react';
import { Switch } from './ui/switch';

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

interface CheckoutPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onConfirmPayment: (paymentData: PaymentData) => void;
  onGoBack: () => void;
}

export interface PaymentData {
  idAssignment: 'single' | 'individual';
  singleId?: string;
  individualIds?: { [key: string]: string };
  phoneNumber: string;
  referenceDigits: string;
  paidMore: boolean;
  contactNumber: string;
  total: number;
}

export function CheckoutPage({ cartItems, onNavigate, onConfirmPayment, onGoBack }: CheckoutPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referenceDigits, setReferenceDigits] = useState('');
  const [paidMore, setPaidMore] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiamonds = cartItems.reduce((sum, item) => sum + (item.product.diamonds * item.quantity), 0);

  const handleConfirm = () => {
    const paymentData: PaymentData = {
      idAssignment: 'single',
      phoneNumber,
      referenceDigits,
      paidMore,
      contactNumber: '',
      total
    };
    onConfirmPayment(paymentData);
  };

  const isFormValid = () => {
    if (!phoneNumber.trim() || !referenceDigits.trim()) return false;
    if (referenceDigits.length !== 6) return false;
    return true;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <h1 className="text-primary mb-8 text-center" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
          Checkout
        </h1>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Products Summary */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              1. Productos Seleccionados
            </h2>
            <div className="space-y-3">
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

            {/* Total Summary */}
            <div className="mt-4 pt-4 border-t border-primary/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Total Diamantes:</span>
                <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                  <Gem className="inline h-4 w-4 mr-1" />
                  {totalDiamonds.toLocaleString('es-VE')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total a Pagar:</span>
                <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              2. Datos de Pago
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Payment Details */}
              <div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">RIF:</p>
                    <p className="text-primary">J-12345678-9</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono:</p>
                    <p className="text-primary">0424-1234567</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Banco:</p>
                    <p className="text-primary">Banco de Venezuela</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monto:</p>
                    <p className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div 
                className="border-2 border-primary bg-secondary/50 aspect-square flex flex-col items-center justify-center"
                style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
              >
                <QrCode className="h-12 w-12 text-primary mb-2" />
                <p className="text-xs text-center text-muted-foreground px-4">
                  Aquí va el QR de pago móvil
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Form */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur p-6"
            style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
          >
            <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              3. Confirmar Pago
            </h2>

            <div className="space-y-4">
              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" className="text-muted-foreground">Número de Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0424-1234567"
                  className="mt-2 bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                />
              </div>

              {/* Reference Digits */}
              <div>
                <Label htmlFor="reference" className="text-muted-foreground">
                  6 Últimos Dígitos de la Referencia
                </Label>
                <Input
                  id="reference"
                  type="text"
                  maxLength={6}
                  value={referenceDigits}
                  onChange={(e) => setReferenceDigits(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="mt-2 bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                />
              </div>

              {/* Paid More Toggle */}
              <div 
                className="flex items-center justify-between border border-primary/30 bg-secondary/50 p-4"
                style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
              >
                <Label htmlFor="paid-more" className="cursor-pointer">
                  Pagué un monto superior a ${total.toFixed(2)}
                </Label>
                <Switch
                  id="paid-more"
                  checked={paidMore}
                  onCheckedChange={setPaidMore}
                />
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                disabled={!isFormValid()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                Confirmar Pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}