import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import partnerImage from 'figma:asset/ab443425385b8548f9c312ecf7085e2a2d42586f.png';
import backgroundImage from 'figma:asset/8036da79fc24bea4bfdf31b68e25641a6e0f5298.png';

interface PartnerBannerProps {
  onNavigate: (page: string) => void;
}

export function PartnerBanner({ onNavigate }: PartnerBannerProps) {
  return (
    <section className="mb-12">
      <div 
        className="relative overflow-hidden border-2 border-primary"
        style={{ 
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Character Image - Positioned absolutely on the left */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center" style={{ paddingLeft: '100px' }}>
          <img 
            src={partnerImage} 
            alt="Partner Character" 
            className="w-auto object-contain"
            style={{ 
              filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.3))',
              height: '88%'
            }}
          />
        </div>
        
        {/* Contenido */}
        <div className="relative grid items-center md:grid-cols-[45%_55%] p-8 md:p-12">
          {/* Left Side - Spacer for character */}
          <div className="hidden md:block"></div>

          {/* Right Side - Text and CTA */}
          <div className="text-center md:text-left space-y-6 md:pl-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight">
              Empieza a vender{' '}
              <span className="text-primary" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}>
                con nosotros.
              </span>
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-xl">
              Únete a nuestra red de aliados y expande tu negocio en el mundo gamer.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => onNavigate('partners')}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg group"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative glow effect */}
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
          style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
          style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' }}
        />
      </div>
    </section>
  );
}