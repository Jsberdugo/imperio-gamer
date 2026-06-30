import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Gem, ArrowLeft } from 'lucide-react';

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

interface IDAssignmentPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onContinue: (idAssignment: 'single' | 'individual', contactNumber: string, singleId?: string, individualIds?: { [key: string]: string }) => void;
  onGoBack: () => void;
}

export function IDAssignmentPage({ cartItems, onNavigate, onContinue, onGoBack }: IDAssignmentPageProps) {
  const [idAssignment, setIdAssignment] = useState<'single' | 'individual'>('single');
  const [singleId, setSingleId] = useState('');
  const [individualIds, setIndividualIds] = useState<{ [key: string]: string }>({});
  const [contactNumber, setContactNumber] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiamonds = cartItems.reduce((sum, item) => sum + (item.product.diamonds * item.quantity), 0);

  const handleIndividualIdChange = (productId: string, value: string) => {
    setIndividualIds(prev => ({ ...prev, [productId]: value }));
  };

  const handleContinue = () => {
    onContinue(idAssignment, contactNumber, singleId, individualIds);
  };

  const isFormValid = () => {
    if (!contactNumber.trim()) return false;
    if (idAssignment === 'single' && !singleId.trim()) return false;
    if (idAssignment === 'individual') {
      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          if (!individualIds[`${item.product.id}-${i}`]?.trim()) return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-4xl">
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
          Asignación de ID
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Products Summary */}
          <div className="space-y-6">
            {/* Products Summary */}
            <div 
              className="border-2 border-primary bg-card/90 backdrop-blur p-6"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                Productos Seleccionados
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
          </div>

          {/* Right Column - ID Assignment */}
          <div className="space-y-6">
            <div 
              className="border-2 border-primary bg-card/90 backdrop-blur p-6"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              <h2 className="text-primary mb-4" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                Asigna tus IDs
              </h2>

              {/* Toggle between single and individual */}
              <div className="flex gap-4 mb-6">
                <Button
                  variant={idAssignment === 'single' ? 'default' : 'outline'}
                  onClick={() => setIdAssignment('single')}
                  className={idAssignment === 'single' ? 'bg-primary text-primary-foreground' : 'border-primary'}
                  style={idAssignment === 'single' ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' } : {}}
                >
                  Una ID para todos
                </Button>
                <Button
                  variant={idAssignment === 'individual' ? 'default' : 'outline'}
                  onClick={() => setIdAssignment('individual')}
                  className={idAssignment === 'individual' ? 'bg-primary text-primary-foreground' : 'border-primary'}
                  style={idAssignment === 'individual' ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' } : {}}
                >
                  ID Individual
                </Button>
              </div>

              {/* Single ID Input */}
              {idAssignment === 'single' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="single-id" className="text-muted-foreground">ID de Recarga</Label>
                    <Input
                      id="single-id"
                      value={singleId}
                      onChange={(e) => setSingleId(e.target.value)}
                      placeholder="Ingresa tu ID"
                      className="mt-2 bg-input-background border-primary focus:border-primary focus:ring-primary"
                      style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Esta ID se usará para todos los paquetes comprados
                    </p>
                  </div>
                </div>
              )}

              {/* Individual IDs */}
              {idAssignment === 'individual' && (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="space-y-3">
                      <p className="text-sm text-primary" style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.5)' }}>
                        {item.product.name} - {item.product.diamonds.toLocaleString('es-VE')} diamantes
                      </p>
                      {Array.from({ length: item.quantity }).map((_, index) => (
                        <div key={`${item.product.id}-${index}`}>
                          <Label htmlFor={`id-${item.product.id}-${index}`} className="text-sm text-muted-foreground">
                            ID #{index + 1}
                          </Label>
                          <Input
                            id={`id-${item.product.id}-${index}`}
                            value={individualIds[`${item.product.id}-${index}`] || ''}
                            onChange={(e) => handleIndividualIdChange(`${item.product.id}-${index}`, e.target.value)}
                            placeholder={`Ingresa ID #${index + 1}`}
                            className="mt-1 bg-input-background border-primary focus:border-primary focus:ring-primary"
                            style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Number */}
              <div className="mt-6">
                <Label htmlFor="contact" className="text-muted-foreground">
                  Número de Contacto
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="0424-7654321"
                  className="mt-2 bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)' }}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Para comunicarnos contigo en caso de ser necesario
                </p>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' }}
              >
                Continuar al Pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}