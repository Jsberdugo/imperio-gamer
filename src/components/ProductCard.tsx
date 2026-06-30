import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  showPrice?: boolean;
}

export function ProductCard({ product, onSelect, showPrice = true }: ProductCardProps) {
  return (
    <div
      onClick={() => onSelect?.(product)}
      className="group relative cursor-pointer overflow-hidden border-2 border-border bg-card transition-all hover:border-primary"
      style={{ 
        boxShadow: '0 0 0 rgba(0, 255, 255, 0)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 255, 255, 0)';
      }}
    >
      <div className="overflow-hidden bg-secondary flex items-center justify-center" style={{ aspectRatio: '1280/1440' }}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground">1280x1440</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>
        {showPrice ? (
          <p className="text-primary">${product.price.toFixed(2)}</p>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <ShoppingCart className="h-4 w-4" />
            <span>Comprar</span>
          </div>
        )}
      </div>
    </div>
  );
}