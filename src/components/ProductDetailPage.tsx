import { useState } from 'react';
import { Button } from './ui/button';
import { Minus, Plus, Gem, ArrowLeft, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  image: string;
}

interface DiamondPackage {
  diamonds: number;
  price: number;
}

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

// Paquetes de diamantes disponibles basados en el producto
const getDiamondPackages = (productName: string): DiamondPackage[] => {
  // Paquetes genéricos que se pueden aplicar a cualquier juego
  return [
    { diamonds: 100, price: 1.50 },
    { diamonds: 300, price: 3.50 },
    { diamonds: 500, price: 5.00 },
    { diamonds: 1000, price: 10.00 },
    { diamonds: 1500, price: 15.00 },
    { diamonds: 2000, price: 20.00 },
  ];
};

export function ProductDetailPage({ product, onNavigate, onAddToCart }: ProductDetailPageProps) {
  const [step, setStep] = useState<'package' | 'quantity'>('package');
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [quantity, setQuantity] = useState(1);

  const diamondPackages = getDiamondPackages(product.name);

  const handleSelectPackage = (pkg: DiamondPackage) => {
    setSelectedPackage(pkg);
    setStep('quantity');
  };

  const handleBackToPackages = () => {
    setStep('package');
    setQuantity(1);
  };

  const handleIncrement = () => {
    if (quantity < 5) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleContinue = () => {
    if (selectedPackage) {
      const productWithPackage = {
        ...product,
        diamonds: selectedPackage.diamonds,
        price: selectedPackage.price,
      };
      onAddToCart(productWithPackage, quantity);
      onNavigate('id-assignment');
    }
  };

  const totalPrice = selectedPackage ? selectedPackage.price * quantity : 0;
  const totalDiamonds = selectedPackage ? selectedPackage.diamonds * quantity : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => step === 'quantity' ? handleBackToPackages() : onNavigate('home')}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 'quantity' ? 'Cambiar Paquete' : 'Volver'}
        </Button>

        {/* Product Detail Card */}
        <div 
          className="border-2 border-primary bg-card/90 backdrop-blur p-8"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-primary mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
              {product.name}
            </h1>
            <p className="text-muted-foreground">
              {step === 'package' ? 'Selecciona el paquete de diamantes' : 'Selecciona la cantidad'}
            </p>
          </div>

          {/* Step 1: Package Selection */}
          {step === 'package' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {diamondPackages.map((pkg) => (
                <div
                  key={pkg.diamonds}
                  onClick={() => handleSelectPackage(pkg)}
                  className="border-2 border-primary bg-card/50 p-6 cursor-pointer transition-all hover:scale-105 hover:bg-primary/10"
                  style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Gem className="h-10 w-10 text-primary" />
                    <div className="text-center">
                      <p className="text-primary mb-1" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                        {pkg.diamonds.toLocaleString('es-VE')}
                      </p>
                      <p className="text-xs text-muted-foreground">Diamantes</p>
                    </div>
                    <div 
                      className="border border-primary/50 bg-secondary/50 px-4 py-1 mt-2"
                      style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
                    >
                      <p className="text-primary text-sm">${pkg.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Quantity Selection */}
          {step === 'quantity' && selectedPackage && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Selected Package Display */}
              <div className="flex items-center justify-center">
                <div 
                  className="border-2 border-primary bg-secondary/50 p-8 w-full"
                  style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Check className="h-12 w-12 text-primary" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Paquete Seleccionado</p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Gem className="h-8 w-8 text-primary" />
                        <p className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                          {selectedPackage.diamonds.toLocaleString('es-VE')}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">Diamantes</p>
                      <div className="mt-4">
                        <p className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                          ${selectedPackage.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">por paquete</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Quantity Controls */}
                  <div className="mb-8">
                    <p className="text-sm text-muted-foreground mb-1">¿Cuántos paquetes deseas comprar?</p>
                    <p className="text-xs text-muted-foreground mb-3">Máximo 5 por compra</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDecrement}
                        disabled={quantity === 1}
                        className="border-primary hover:bg-primary/10"
                        style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <div 
                        className="border-2 border-primary bg-secondary/50 px-8 py-2 min-w-[100px] text-center"
                        style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
                      >
                        <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                          {quantity}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleIncrement}
                        disabled={quantity === 5}
                        className="border-primary hover:bg-primary/10"
                        style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div 
                    className="border-2 border-primary bg-primary/10 p-4 mb-6"
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
                      <span className="text-muted-foreground">Total a Pagar:</span>
                      <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
                >
                  Continuar al Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}