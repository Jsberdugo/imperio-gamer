import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Phone, Hash, DollarSign, CreditCard } from 'lucide-react';
import type { DeliveryInfo } from './DeliveryInfoPage';

interface Peripheral {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
}

interface PeripheralCartItem {
  peripheral: Peripheral;
  quantity: number;
}

export interface PeripheralPaymentData {
  phoneNumber: string;
  referenceDigits: string;
  paidMore: boolean;
  total: number;
  deliveryInfo: DeliveryInfo;
}

interface PeripheralCheckoutPageProps {
  cartItems: PeripheralCartItem[];
  deliveryInfo: DeliveryInfo;
  onNavigate: (page: string) => void;
  onSubmit: (data: PeripheralPaymentData) => void;
}

export function PeripheralCheckoutPage({ cartItems, deliveryInfo, onNavigate, onSubmit }: PeripheralCheckoutPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referenceDigits, setReferenceDigits] = useState('');
  const [paidMore, setPaidMore] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.peripheral.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      alert('Por favor ingresa el teléfono de pago');
      return;
    }

    if (referenceDigits.length !== 6) {
      alert('Por favor ingresa los 6 dígitos de la referencia');
      return;
    }

    onSubmit({
      phoneNumber,
      referenceDigits,
      paidMore,
      total,
      deliveryInfo
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('delivery-info')}
          className="mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Información de Entrega
        </Button>

        <h1 className="text-primary mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
          Datos de Pago
        </h1>
        <p className="text-muted-foreground mb-8">
          Completa la información del pago realizado
        </p>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Summary */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur p-6"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
          >
            <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              1. Resumen de Compra
            </h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div 
                  key={item.peripheral.id}
                  className="border border-primary/30 bg-secondary/50 p-3"
                >
                  <p className="text-sm mb-1">{item.peripheral.name}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.quantity} x ${item.peripheral.price.toFixed(2)}</span>
                    <span className="text-primary">${(item.peripheral.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-primary pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span>Total:</span>
                <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery Info Summary */}
            <div className="border-t border-primary/30 pt-4">
              <h3 className="text-sm text-primary mb-2">Datos de Entrega</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Nombre:</strong> {deliveryInfo.fullName}</p>
                <p><strong>Cédula:</strong> {deliveryInfo.idNumber}</p>
                <p><strong>Teléfono:</strong> {deliveryInfo.contactNumber}</p>
                <p><strong>Dirección:</strong> {deliveryInfo.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment QR and Details Section */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur p-6"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
          >
            <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
              2. Información de Pago Móvil
            </h2>

            {/* Payment QR Placeholder */}
            <div 
              className="border-2 border-primary bg-primary/10 p-8 mb-6 text-center"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-48 h-48 border-2 border-primary bg-white flex items-center justify-center">
                  <span className="text-gray-800">QR Code</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Escanea el código QR para realizar el pago
              </p>
              <div className="text-primary">
                <p className="text-sm">Banco: Banco Ejemplo</p>
                <p className="text-sm">RIF: J-123456789</p>
                <p className="text-sm">Teléfono: 0424-1234567</p>
              </div>
            </div>
          </div>

          {/* Payment Confirmation Form */}
          <form onSubmit={handleSubmit}>
            <div 
              className="border-2 border-primary bg-card/90 backdrop-blur p-6"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
            >
              <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                3. Confirmar Pago Realizado
              </h2>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  <Phone className="inline h-4 w-4 mr-1 text-primary" />
                  Teléfono desde donde pagaste
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ej: 0412-1234567"
                  className="bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                  required
                />
              </div>

              {/* Reference Digits */}
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  <Hash className="inline h-4 w-4 mr-1 text-primary" />
                  Últimos 6 dígitos de la referencia
                </label>
                <Input
                  type="text"
                  value={referenceDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setReferenceDigits(value);
                    }
                  }}
                  placeholder="123456"
                  maxLength={6}
                  className="bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ingresa solo los 6 últimos dígitos de tu comprobante
                </p>
              </div>

              {/* Paid More Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paidMore}
                    onChange={(e) => setPaidMore(e.target.checked)}
                    className="h-4 w-4 border-primary text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    <DollarSign className="inline h-4 w-4 mr-1 text-primary" />
                    Pagué un monto superior al total
                  </span>
                </label>
                {paidMore && (
                  <p className="text-xs text-muted-foreground mt-2 ml-6">
                    El excedente será procesado como crédito a tu favor
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                Confirmar Pago
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}