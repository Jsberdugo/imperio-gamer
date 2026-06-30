import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Input } from './ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import product1 from 'figma:asset/d1ed6dc7f5eaa7e17edda2a6ac33c4aff5aeaa9c.png';
import product2 from 'figma:asset/5ec31d98324f69fccbe0d0df0b0d2a62ff05db84.png';
import product3 from 'figma:asset/7aaa93a5f818ffc7590fe2feb608d1b4b33ff0fc.png';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  image: string;
  category?: string;
}

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
}

const categories = [
  'Todos',
  'Juegos',
  'Recargas por ID',
  'Recargas Internas',
  'Gift Cards',
  'Streaming',
];

const allProducts: Product[] = [
  // Juegos
  { id: '1', name: 'Grand Theft Auto V', diamonds: 0, price: 29.99, image: product1, category: 'Juegos' },
  { id: '2', name: 'Minecraft', diamonds: 0, price: 26.95, image: product2, category: 'Juegos' },
  { id: '3', name: 'The Witcher 3', diamonds: 0, price: 39.99, image: product3, category: 'Juegos' },
  { id: '4', name: 'Cyberpunk 2077', diamonds: 0, price: 59.99, image: product1, category: 'Juegos' },
  { id: '5', name: 'Red Dead Redemption 2', diamonds: 0, price: 49.99, image: product2, category: 'Juegos' },
  { id: '26', name: 'Elden Ring', diamonds: 0, price: 59.99, image: product3, category: 'Juegos' },
  { id: '27', name: 'FIFA 24', diamonds: 0, price: 69.99, image: product1, category: 'Juegos' },
  { id: '28', name: 'God of War', diamonds: 0, price: 49.99, image: product2, category: 'Juegos' },
  { id: '29', name: 'Resident Evil 4', diamonds: 0, price: 59.99, image: product3, category: 'Juegos' },
  { id: '30', name: 'Hogwarts Legacy', diamonds: 0, price: 59.99, image: product1, category: 'Juegos' },
  
  // Recargas por ID
  { id: '6', name: 'Free Fire Diamantes', diamonds: 1000, price: 5.00, image: product2, category: 'Recargas por ID' },
  { id: '7', name: 'PUBG UC', diamonds: 1000, price: 10.00, image: product3, category: 'Recargas por ID' },
  { id: '8', name: 'Mobile Legends Diamonds', diamonds: 1000, price: 5.00, image: product1, category: 'Recargas por ID' },
  { id: '9', name: 'Call of Duty Mobile CP', diamonds: 1000, price: 10.00, image: product2, category: 'Recargas por ID' },
  { id: '10', name: 'Genshin Impact Genesis', diamonds: 1000, price: 15.00, image: product3, category: 'Recargas por ID' },
  { id: '31', name: 'Clash of Clans Gems', diamonds: 1000, price: 5.00, image: product1, category: 'Recargas por ID' },
  { id: '32', name: 'Clash Royale Gems', diamonds: 1000, price: 5.00, image: product2, category: 'Recargas por ID' },
  { id: '33', name: 'Brawl Stars Gems', diamonds: 1000, price: 5.00, image: product3, category: 'Recargas por ID' },
  { id: '34', name: 'Roblox Robux', diamonds: 1000, price: 10.00, image: product1, category: 'Recargas por ID' },
  { id: '35', name: 'Honor of Kings Vouchers', diamonds: 1000, price: 10.00, image: product2, category: 'Recargas por ID' },
  
  // Recargas Internas
  { id: '11', name: 'Riot Points (LoL)', diamonds: 1000, price: 10.00, image: product3, category: 'Recargas Internas' },
  { id: '12', name: 'V-Bucks (Fortnite)', diamonds: 1000, price: 9.99, image: product1, category: 'Recargas Internas' },
  { id: '13', name: 'Apex Coins', diamonds: 1000, price: 9.99, image: product2, category: 'Recargas Internas' },
  { id: '14', name: 'COD Points', diamonds: 1000, price: 9.99, image: product3, category: 'Recargas Internas' },
  { id: '15', name: 'R6 Credits', diamonds: 1000, price: 9.99, image: product1, category: 'Recargas Internas' },
  { id: '36', name: 'Valorant Points', diamonds: 1000, price: 10.00, image: product2, category: 'Recargas Internas' },
  { id: '37', name: 'Overwatch Coins', diamonds: 1000, price: 9.99, image: product3, category: 'Recargas Internas' },
  { id: '38', name: 'Destiny 2 Silver', diamonds: 1000, price: 9.99, image: product1, category: 'Recargas Internas' },
  { id: '39', name: 'Fall Guys Show-Bucks', diamonds: 1000, price: 9.99, image: product2, category: 'Recargas Internas' },
  { id: '40', name: 'Rocket League Credits', diamonds: 1000, price: 9.99, image: product3, category: 'Recargas Internas' },
  
  // Gift Cards
  { id: '16', name: 'PlayStation Store $10', diamonds: 0, price: 10.00, image: product1, category: 'Gift Cards' },
  { id: '17', name: 'Xbox Gift Card $15', diamonds: 0, price: 15.00, image: product2, category: 'Gift Cards' },
  { id: '18', name: 'Nintendo eShop $20', diamonds: 0, price: 20.00, image: product3, category: 'Gift Cards' },
  { id: '19', name: 'Steam Wallet $25', diamonds: 0, price: 25.00, image: product1, category: 'Gift Cards' },
  { id: '20', name: 'Google Play $10', diamonds: 0, price: 10.00, image: product2, category: 'Gift Cards' },
  { id: '41', name: 'App Store $15', diamonds: 0, price: 15.00, image: product3, category: 'Gift Cards' },
  { id: '42', name: 'Amazon Gift Card $20', diamonds: 0, price: 20.00, image: product1, category: 'Gift Cards' },
  { id: '43', name: 'Battle.net $20', diamonds: 0, price: 20.00, image: product2, category: 'Gift Cards' },
  { id: '44', name: 'Epic Games $25', diamonds: 0, price: 25.00, image: product3, category: 'Gift Cards' },
  { id: '45', name: 'Razer Gold $30', diamonds: 0, price: 30.00, image: product1, category: 'Gift Cards' },
  
  // Streaming
  { id: '21', name: 'Netflix 1 Mes', diamonds: 0, price: 15.99, image: product2, category: 'Streaming' },
  { id: '22', name: 'Spotify Premium 1 Mes', diamonds: 0, price: 9.99, image: product3, category: 'Streaming' },
  { id: '23', name: 'Disney+ 1 Mes', diamonds: 0, price: 7.99, image: product1, category: 'Streaming' },
  { id: '24', name: 'Xbox Game Pass', diamonds: 0, price: 14.99, image: product2, category: 'Streaming' },
  { id: '25', name: 'PlayStation Plus', diamonds: 0, price: 9.99, image: product3, category: 'Streaming' },
  { id: '46', name: 'HBO Max 1 Mes', diamonds: 0, price: 14.99, image: product1, category: 'Streaming' },
  { id: '47', name: 'Amazon Prime 1 Mes', diamonds: 0, price: 12.99, image: product2, category: 'Streaming' },
  { id: '48', name: 'Apple TV+ 1 Mes', diamonds: 0, price: 6.99, image: product3, category: 'Streaming' },
  { id: '49', name: 'Crunchyroll Premium', diamonds: 0, price: 7.99, image: product1, category: 'Streaming' },
  { id: '50', name: 'YouTube Premium 1 Mes', diamonds: 0, price: 11.99, image: product2, category: 'Streaming' },
];

const ITEMS_PER_PAGE = 15; // 3 rows x 5 columns

export function CatalogPage({ onSelectProduct }: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const renderPagination = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNum)}
                isActive={currentPage === pageNum}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8">Catálogo de Productos</h1>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-input-background border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`border-2 px-6 py-2 transition-all ${
                selectedCategory === category
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              style={
                selectedCategory === category
                  ? { boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)' }
                  : {}
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Top */}
      {totalPages > 1 && (
        <div className="mb-6 flex justify-center">
          {renderPagination()}
        </div>
      )}

      {/* Products Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {currentProducts.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      )}

      {/* Pagination Bottom */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          {renderPagination()}
        </div>
      )}
    </div>
  );
}