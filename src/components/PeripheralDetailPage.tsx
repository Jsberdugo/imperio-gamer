import { useState } from 'react';
import { Button } from './ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

interface Peripheral {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
  description: string;
}

interface PeripheralDetailPageProps {
  peripheral: Peripheral;
  onNavigate: (page: string) => void;
  onAddToCart: (peripheral: Peripheral, quantity: number) => void;
}

export function PeripheralDetailPage({ peripheral, onNavigate, onAddToCart }: PeripheralDetailPageProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  const handleProceed = () => {
    onAddToCart(peripheral, quantity);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('peripherals')}
          className="mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Periféricos
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div 
            className="border-2 border-primary bg-card/90 backdrop-blur overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
          >
            <div className="aspect-square overflow-hidden bg-secondary/50">
              <img
                src={peripheral.image}
                alt={peripheral.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <div 
              className="border-2 border-primary bg-card/90 backdrop-blur p-6 mb-6"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
            >
              <p className="text-sm text-primary mb-2">{peripheral.brand}</p>
              <h1 className="text-primary mb-4" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
                {peripheral.name}
              </h1>
              
              <p className="text-muted-foreground mb-6">
                {peripheral.description}
              </p>

              <div className="border-t border-primary/30 pt-4 mb-6">
                <p className="text-2xl text-primary" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
                  ${peripheral.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Cantidad</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="border-primary hover:bg-primary/10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl text-primary w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 5}
                    className="border-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Máximo 5 unidades por compra
                </p>
              </div>

              {/* Total */}
              <div 
                className="border-2 border-primary bg-primary/10 p-4 mb-6"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
              >
                <div className="flex justify-between items-center">
                  <span>Total:</span>
                  <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                    ${(peripheral.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handleProceed}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Continuar con la Compra
              </Button>
            </div>

            {/* Product Info */}
            <div 
              className="border border-primary/30 bg-card/50 p-4"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)' }}
            >
              <h3 className="text-primary mb-3" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                Información del Producto
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Producto físico - Envío a domicilio</li>
                <li>✓ Garantía del fabricante</li>
                <li>✓ Entrega en 3-5 días hábiles</li>
                <li>✓ Pago contra entrega disponible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
