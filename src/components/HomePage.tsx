import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductSection } from './ProductSection';
import { PartnerBanner } from './PartnerBanner';
import bannerImage from 'figma:asset/2738cca4dc20c22b1333216d15925a4dc2e0af1b.png';
import streamingBanner from 'figma:asset/98c7b316bf36f42b51f76e79c6c10b39de02c94c.png';
import product1 from 'figma:asset/d1ed6dc7f5eaa7e17edda2a6ac33c4aff5aeaa9c.png';
import product2 from 'figma:asset/5ec31d98324f69fccbe0d0df0b0d2a62ff05db84.png';
import product3 from 'figma:asset/7aaa93a5f818ffc7590fe2feb608d1b4b33ff0fc.png';

interface Product {
  id: string;
  name: string;
  diamonds: number;
  price: number;
  image: string;
}

const bestSellingGames: Product[] = [
  { id: '1', name: 'Free Fire Diamantes', diamonds: 300, price: 3.50, image: product1 },
  { id: '2', name: 'PUBG UC', diamonds: 600, price: 7.00, image: product2 },
  { id: '3', name: 'Mobile Legends', diamonds: 1000, price: 10.00, image: product3 },
  { id: '4', name: 'Genshin Impact', diamonds: 1500, price: 15.00, image: product1 },
  { id: '5', name: 'Call of Duty Mobile', diamonds: 2000, price: 20.00, image: product2 },
];

const idRecharges: Product[] = [
  { id: '6', name: 'Clash of Clans Gems', diamonds: 500, price: 5.00, image: product3 },
  { id: '7', name: 'Clash Royale Gems', diamonds: 800, price: 8.50, image: product1 },
  { id: '8', name: 'Brawl Stars Gems', diamonds: 900, price: 9.00, image: product2 },
  { id: '9', name: 'Roblox Robux', diamonds: 1200, price: 12.00, image: product3 },
  { id: '10', name: 'Honor of Kings', diamonds: 1500, price: 15.00, image: product1 },
];

const internalRecharges: Product[] = [
  { id: '11', name: 'Riot Points (LoL)', diamonds: 1000, price: 10.00, image: product2 },
  { id: '12', name: 'Valorant Points', diamonds: 950, price: 9.99, image: product3 },
  { id: '13', name: 'Fortnite V-Bucks', diamonds: 950, price: 9.99, image: product1 },
  { id: '14', name: 'Apex Legends Coins', diamonds: 950, price: 9.99, image: product2 },
  { id: '15', name: 'Rainbow Six Credits', diamonds: 950, price: 9.99, image: product3 },
];

const giftCards: Product[] = [
  { id: '16', name: 'Steam Gift Card', diamonds: 1000, price: 10.00, image: product1 },
  { id: '17', name: 'PlayStation Store', diamonds: 1500, price: 15.00, image: product2 },
  { id: '18', name: 'Xbox Gift Card', diamonds: 2000, price: 20.00, image: product3 },
  { id: '19', name: 'Nintendo eShop', diamonds: 2500, price: 25.00, image: product1 },
  { id: '20', name: 'Google Play Card', diamonds: 1000, price: 10.00, image: product2 },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const totalBanners = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % totalBanners);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % totalBanners);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + totalBanners) % totalBanners);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner Carousel */}
      <div className="relative mb-12">
        <div 
          className="overflow-hidden border-2 border-primary"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '5.4/1' }}>
            {currentBanner === 0 && (
              <img 
                src={bannerImage} 
                alt="Banner promocional"
                className="w-full h-full object-cover"
              />
            )}
            {currentBanner === 1 && (
              <img 
                src={bannerImage} 
                alt="Banner promocional"
                className="w-full h-full object-cover"
              />
            )}
            {currentBanner === 2 && (
              <img 
                src={bannerImage} 
                alt="Banner promocional"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/20 p-2 backdrop-blur-sm transition-all hover:bg-primary/40 border border-primary"
          style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/20 p-2 backdrop-blur-sm transition-all hover:bg-primary/40 border border-primary"
          style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {[...Array(totalBanners)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-2 w-2 border border-primary transition-all ${
                i === currentBanner ? 'bg-primary w-8' : 'bg-transparent'
              }`}
              style={i === currentBanner ? { boxShadow: '0 0 8px rgba(0, 255, 255, 0.8)' } : {}}
            />
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <ProductSection 
        title="Juegos Más Vendidos" 
        products={bestSellingGames}
        showViewMore={false}
        onSelectProduct={onSelectProduct}
        showPrice={false}
      />
      
      <ProductSection 
        title="Recargas por ID" 
        products={idRecharges}
        onViewMore={() => onNavigate('catalog')}
        onSelectProduct={onSelectProduct}
        showPrice={false}
      />
      
      <ProductSection 
        title="Recargas Internas" 
        products={internalRecharges}
        onViewMore={() => onNavigate('catalog')}
        onSelectProduct={onSelectProduct}
        showPrice={false}
      />
      
      <ProductSection 
        title="Gift Cards" 
        products={giftCards}
        onViewMore={() => onNavigate('catalog')}
        onSelectProduct={onSelectProduct}
        showPrice={false}
      />

      {/* Streaming Banner */}
      <section className="mb-12">
        <div className="mb-6">
          <h2>Streaming</h2>
        </div>
        <div 
          className="border-2 border-primary overflow-hidden"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)' }}
        >
          <div className="relative w-full" style={{ aspectRatio: '5.4/1' }}>
            <img 
              src={streamingBanner} 
              alt="Banner Streaming"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Partner Banner */}
      <section className="mb-12">
        <PartnerBanner onNavigate={onNavigate} />
      </section>
    </div>
  );
}