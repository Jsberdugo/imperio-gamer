import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowLeft, ArrowRight, User, CreditCard, Phone, MapPin } from 'lucide-react';

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

export interface DeliveryInfo {
  fullName: string;
  idNumber: string;
  contactNumber: string;
  deliveryAddress: string;
}

interface DeliveryInfoPageProps {
  cartItems: PeripheralCartItem[];
  onNavigate: (page: string) => void;
  onSubmit: (info: DeliveryInfo) => void;
  initialData?: DeliveryInfo;
}

export function DeliveryInfoPage({ cartItems, onNavigate, onSubmit, initialData }: DeliveryInfoPageProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [idNumber, setIdNumber] = useState(initialData?.idNumber || '');
  const [contactNumber, setContactNumber] = useState(initialData?.contactNumber || '');
  const [deliveryAddress, setDeliveryAddress] = useState(initialData?.deliveryAddress || '');

  const total = cartItems.reduce((sum, item) => sum + (item.peripheral.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !idNumber.trim() || !contactNumber.trim() || !deliveryAddress.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    onSubmit({
      fullName,
      idNumber,
      contactNumber,
      deliveryAddress
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('peripheral-detail')}
          className="mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <h1 className="text-primary mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
          Información de Entrega
        </h1>
        <p className="text-muted-foreground mb-8">
          Por favor completa tus datos para procesar el envío
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div 
                className="border-2 border-primary bg-card/90 backdrop-blur p-6 mb-6"
                style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
              >
                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    <User className="inline h-4 w-4 mr-1 text-primary" />
                    Nombre Completo
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="bg-input-background border-primary focus:border-primary focus:ring-primary"
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                    required
                  />
                </div>

                {/* ID Number */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    <CreditCard className="inline h-4 w-4 mr-1 text-primary" />
                    Cédula de Identidad
                  </label>
                  <Input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Ej: V-12345678"
                    className="bg-input-background border-primary focus:border-primary focus:ring-primary"
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    <Phone className="inline h-4 w-4 mr-1 text-primary" />
                    Número de Contacto
                  </label>
                  <Input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Ej: 0412-1234567"
                    className="bg-input-background border-primary focus:border-primary focus:ring-primary"
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para coordinar la entrega contigo
                  </p>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <label className="block text-sm mb-2">
                    <MapPin className="inline h-4 w-4 mr-1 text-primary" />
                    Dirección de Entrega
                  </label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ej: Av. Principal, Edificio Torre Azul, Piso 5, Apto 5-B, Caracas"
                    className="bg-input-background border-primary focus:border-primary focus:ring-primary min-h-[100px]"
                    style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Incluye puntos de referencia para facilitar la entrega
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
                >
                  Continuar al Pago
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="border-2 border-primary bg-card/90 backdrop-blur p-6 sticky top-24"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
            >
              <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                Resumen de Compra
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

              <div 
                className="border-t-2 border-primary pt-4"
              >
                <div className="flex justify-between items-center">
                  <span>Total:</span>
                  <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}