import { Search, User, LogOut, ShoppingBag, Settings, Home, Package, Newspaper, X, Gamepad2, Handshake } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogout, onSearch }: NavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowMobileSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary/10"
                style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
                <span className="text-primary">GC</span>
              </div>
              <span className="hidden sm:block">Gamer Coins</span>
            </button>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className={`transition-colors hover:text-primary ${
                  currentPage === 'home' ? 'text-primary' : ''
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className={`transition-colors hover:text-primary ${
                  currentPage === 'catalog' ? 'text-primary' : ''
                }`}
              >
                Catálogo
              </button>
              <button
                onClick={() => onNavigate('peripherals')}
                className={`transition-colors hover:text-primary ${
                  currentPage === 'peripherals' ? 'text-primary' : ''
                }`}
              >
                Periféricos
              </button>
              <button
                onClick={() => onNavigate('news')}
                className={`transition-colors hover:text-primary ${
                  currentPage === 'news' ? 'text-primary' : ''
                }`}
              >
                Noticias
              </button>
              <button
                onClick={() => onNavigate('partners')}
                className={`transition-colors hover:text-primary ${
                  currentPage === 'partners' ? 'text-primary' : ''
                }`}
              >
                Aliados
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative hidden flex-1 max-w-md lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 bg-input-background border-border focus:border-primary focus:ring-primary"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => {
                  const query = prompt('Buscar productos:');
                  if (query) onSearch(query);
                }}
              >
                <Search className="h-5 w-5" />
              </Button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-primary hover:bg-primary/10"
                      style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.3)' }}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Mis Compras
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => onNavigate('login')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Schedule Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-secondary/70 backdrop-blur hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 py-2 text-xs text-primary" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
            <span>Soporte Técnico: 10am a 9pm</span>
            <span>|</span>
            <span>Atención al Cliente: 11:00am a 11:59pm</span>
          </div>
        </div>
      </div>

      {/* Mobile Schedule Bar - Above Bottom Nav */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-secondary/70 backdrop-blur md:hidden">
        <div className="flex flex-col items-center justify-center gap-1 py-2 px-4 text-xs text-primary text-center" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}>
          <span>Soporte Técnico: 10am a 9pm</span>
          <span>Atención al Cliente: 11:00am a 11:59pm</span>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 md:hidden"
        style={{ boxShadow: '0 -4px 20px rgba(0, 255, 255, 0.2)' }}>
        <div className="flex items-center justify-around h-16 px-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={currentPage === 'home' ? { filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))' } : {}}
          >
            <Home className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => onNavigate('catalog')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === 'catalog' ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={currentPage === 'catalog' ? { filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))' } : {}}
          >
            <Package className="h-6 w-6" />
          </button>

          <button
            onClick={() => onNavigate('peripherals')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === 'peripherals' ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={currentPage === 'peripherals' ? { filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))' } : {}}
          >
            <Gamepad2 className="h-6 w-6" />
          </button>

          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground transition-colors"
          >
            <Search className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => isLoggedIn ? onNavigate('profile') : onNavigate('login')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === 'profile' || currentPage === 'login' ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={(currentPage === 'profile' || currentPage === 'login') ? { filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))' } : {}}
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden">
          <div className="flex items-start justify-center pt-20 px-4">
            <div 
              className="w-full max-w-md bg-card border-2 border-primary p-6"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-primary">Buscar Productos</h2>
                <button
                  onClick={() => {
                    setShowMobileSearch(false);
                    setSearchQuery('');
                  }}
                  className="p-1 transition-colors hover:text-primary"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10 bg-input-background border-primary focus:border-primary focus:ring-primary"
                  style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleMobileSearch}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}