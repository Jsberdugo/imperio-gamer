import { useState } from 'react';
import { Search, Keyboard, Mouse, Headphones, Monitor, Gamepad2, Mic } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Peripheral {
  id: string;
  name: string;
  category: 'keyboard' | 'mouse' | 'headphones' | 'monitor' | 'controller' | 'microphone';
  price: number;
  image: string;
  brand: string;
  description: string;
}

interface PeripheralsPageProps {
  onNavigate: (page: string) => void;
  onSelectPeripheral: (peripheral: Peripheral) => void;
}

const mockPeripherals: Peripheral[] = [
  { id: 'kb1', name: 'Razer BlackWidow V3', category: 'keyboard', price: 129.99, brand: 'Razer', description: 'Teclado mecánico RGB', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop' },
  { id: 'kb2', name: 'Corsair K70 RGB', category: 'keyboard', price: 149.99, brand: 'Corsair', description: 'Teclado mecánico gaming', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop' },
  { id: 'kb3', name: 'Logitech G Pro X', category: 'keyboard', price: 139.99, brand: 'Logitech', description: 'Teclado mecánico TKL', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop' },
  { id: 'kb4', name: 'SteelSeries Apex Pro', category: 'keyboard', price: 199.99, brand: 'SteelSeries', description: 'Teclado mecánico ajustable', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop' },
  { id: 'kb5', name: 'HyperX Alloy FPS', category: 'keyboard', price: 89.99, brand: 'HyperX', description: 'Teclado mecánico compacto', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop' },
  
  { id: 'm1', name: 'Logitech G Pro Wireless', category: 'mouse', price: 129.99, brand: 'Logitech', description: 'Mouse inalámbrico gaming', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
  { id: 'm2', name: 'Razer DeathAdder V2', category: 'mouse', price: 69.99, brand: 'Razer', description: 'Mouse ergonómico', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' },
  { id: 'm3', name: 'Corsair Dark Core RGB', category: 'mouse', price: 89.99, brand: 'Corsair', description: 'Mouse inalámbrico RGB', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
  { id: 'm4', name: 'SteelSeries Rival 600', category: 'mouse', price: 79.99, brand: 'SteelSeries', description: 'Mouse con peso ajustable', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' },
  { id: 'm5', name: 'Glorious Model O', category: 'mouse', price: 49.99, brand: 'Glorious', description: 'Mouse ultraligero', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
  
  { id: 'h1', name: 'HyperX Cloud II', category: 'headphones', price: 99.99, brand: 'HyperX', description: 'Audífonos gaming 7.1', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop' },
  { id: 'h2', name: 'SteelSeries Arctis 7', category: 'headphones', price: 149.99, brand: 'SteelSeries', description: 'Audífonos inalámbricos', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop' },
  { id: 'h3', name: 'Razer Kraken X', category: 'headphones', price: 49.99, brand: 'Razer', description: 'Audífonos ultraligeros', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop' },
  { id: 'h4', name: 'Logitech G Pro X', category: 'headphones', price: 129.99, brand: 'Logitech', description: 'Audífonos profesionales', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop' },
  { id: 'h5', name: 'Corsair HS70', category: 'headphones', price: 79.99, brand: 'Corsair', description: 'Audífonos wireless', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop' },
  
  { id: 'mon1', name: 'ASUS ROG Swift PG279Q', category: 'monitor', price: 599.99, brand: 'ASUS', description: 'Monitor 27" 165Hz', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop' },
  { id: 'mon2', name: 'BenQ ZOWIE XL2546K', category: 'monitor', price: 499.99, brand: 'BenQ', description: 'Monitor 24.5" 240Hz', image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop' },
  { id: 'mon3', name: 'LG UltraGear 27GL83A', category: 'monitor', price: 379.99, brand: 'LG', description: 'Monitor 27" IPS 144Hz', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop' },
  
  { id: 'c1', name: 'Xbox Elite Series 2', category: 'controller', price: 179.99, brand: 'Microsoft', description: 'Control profesional', image: 'https://images.unsplash.com/photo-1592840331829-d4f3c7a5e96e?w=400&h=400&fit=crop' },
  { id: 'c2', name: 'PlayStation DualSense', category: 'controller', price: 69.99, brand: 'Sony', description: 'Control PS5', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop' },
  
  { id: 'mic1', name: 'Blue Yeti', category: 'microphone', price: 129.99, brand: 'Blue', description: 'Micrófono USB profesional', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop' },
  { id: 'mic2', name: 'HyperX QuadCast', category: 'microphone', price: 139.99, brand: 'HyperX', description: 'Micrófono RGB', image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop' },
];

const categories = [
  { id: 'all', name: 'Todos', icon: Gamepad2 },
  { id: 'keyboard', name: 'Teclados', icon: Keyboard },
  { id: 'mouse', name: 'Mouse', icon: Mouse },
  { id: 'headphones', name: 'Audífonos', icon: Headphones },
  { id: 'monitor', name: 'Monitores', icon: Monitor },
  { id: 'controller', name: 'Controles', icon: Gamepad2 },
  { id: 'microphone', name: 'Micrófonos', icon: Mic },
];

export function PeripheralsPage({ onNavigate, onSelectPeripheral }: PeripheralsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredPeripherals = mockPeripherals.filter(peripheral => {
    const matchesSearch = peripheral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         peripheral.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || peripheral.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPeripherals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPeripherals = filteredPeripherals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-primary mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
            Periféricos Gaming
          </h1>
          <p className="text-muted-foreground">
            Encuentra los mejores periféricos para tu setup gamer
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar periféricos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-card border-primary focus:border-primary focus:ring-primary"
              style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)' }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 border-2 transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border bg-card/50 hover:border-primary/50'
                  }`}
                  style={selectedCategory === category.id ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)' } : {}}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pagination Top */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border-2 transition-all ${
                  currentPage === page
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-card/50 hover:border-primary/50'
                }`}
                style={currentPage === page ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)' } : {}}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {displayedPeripherals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {displayedPeripherals.map((peripheral) => (
              <div
                key={peripheral.id}
                className="border-2 border-primary bg-card/90 backdrop-blur overflow-hidden transition-all hover:scale-105 cursor-pointer"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)' }}
                onClick={() => onSelectPeripheral(peripheral)}
              >
                <div className="aspect-square overflow-hidden bg-secondary/50">
                  <img
                    src={peripheral.image}
                    alt={peripheral.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary mb-1">{peripheral.brand}</p>
                  <h3 className="mb-1 text-sm line-clamp-2">{peripheral.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {peripheral.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary" style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}>
                      ${peripheral.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                      style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
                    >
                      Ver más
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No se encontraron periféricos</p>
          </div>
        )}

        {/* Pagination Bottom */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border-2 transition-all ${
                  currentPage === page
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-card/50 hover:border-primary/50'
                }`}
                style={currentPage === page ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)' } : {}}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}