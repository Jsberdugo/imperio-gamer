import { ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";

interface Product {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  image: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  showViewMore?: boolean;
  onViewMore?: () => void;
  onSelectProduct?: (product: Product) => void;
  showPrice?: boolean;
}

export function ProductSection({
  title,
  products,
  showViewMore = true,
  onViewMore,
  onSelectProduct,
  showPrice = true,
}: ProductSectionProps) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2>{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            showPrice={showPrice}
          />
        ))}
      </div>

      {showViewMore && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onViewMore}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            style={{ boxShadow: "0 0 8px rgba(0, 255, 255, 0.3)" }}>
            Ver más productos
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
