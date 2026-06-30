import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Handshake, Send } from 'lucide-react';

interface PartnersPageProps {
  onNavigate: (page: string) => void;
}

interface PartnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  contactNumber: string;
  companyName: string;
  companyWebsite: string;
  companyCountry: string;
  annualRevenue: string;
  partnerType: string;
  primaryLocation: string;
  secondaryLocation: string;
  distributionChannels: string[];
  expectedMonthlyVolume: string;
  partnershipTitle: string;
}

const countries = [
  'Venezuela', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'México', 
  'Perú', 'Uruguay', 'España', 'Estados Unidos', 'Canadá', 'Otro'
];

const annualRevenueRanges = [
  '$20,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000 - $500,000',
  '$500,000 - $1,000,000',
  'Más de $1,000,000'
];

const partnerTypes = [
  'Contenido',
  'Distribuidor',
  'Revendedor',
  'Canal de Pagos',
  'Otro'
];

const distributionChannelOptions = [
  'Tienda Online',
  'Tienda Física',
  'Redes Sociales',
  'Portal de Ventas (B2B)',
  'Otros'
];

const monthlyVolumeRanges = [
  '$20,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000 - $500,000',
  '$500,000 - $1,000,000',
  'Más de $1,000,000'
];

export function PartnersPage({ onNavigate }: PartnersPageProps) {
  const [formData, setFormData] = useState<PartnerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    contactNumber: '',
    companyName: '',
    companyWebsite: '',
    companyCountry: '',
    annualRevenue: '',
    partnerType: '',
    primaryLocation: '',
    secondaryLocation: '',
    distributionChannels: [],
    expectedMonthlyVolume: '',
    partnershipTitle: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      distributionChannels: prev.distributionChannels.includes(channel)
        ? prev.distributionChannels.filter(c => c !== channel)
        : [...prev.distributionChannels, channel]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        contactNumber: '',
        companyName: '',
        companyWebsite: '',
        companyCountry: '',
        annualRevenue: '',
        partnerType: '',
        primaryLocation: '',
        secondaryLocation: '',
        distributionChannels: [],
        expectedMonthlyVolume: '',
        partnershipTitle: ''
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div
          className="border-2 border-primary bg-card p-12"
          style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)' }}
        >
          <Handshake className="mx-auto mb-6 h-20 w-20 text-primary" />
          <h2 className="mb-4 text-primary">¡Solicitud Enviada Exitosamente!</h2>
          <p className="text-muted-foreground">
            Gracias por tu interés en ser nuestro aliado. Revisaremos tu solicitud y nos pondremos en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Handshake className="h-10 w-10 text-primary" />
          <h1>Conviértete en Aliado</h1>
        </div>
        <p className="text-muted-foreground">
          Únete a nuestra red de socios y expande tu negocio con nosotros. 
          Completa el formulario para iniciar el proceso de alianza.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Personal */}
        <section
          className="border-2 border-border bg-card p-6"
          style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
        >
          <h3 className="mb-6 text-primary">Información Personal</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">
                Nombre <span className="text-primary">*</span>
              </label>
              <Input
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-input-background border-border"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Apellido <span className="text-primary">*</span>
              </label>
              <Input
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-input-background border-border"
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Email <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-input-background border-border"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Título en el Trabajo <span className="text-primary">*</span>
              </label>
              <Input
                required
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="bg-input-background border-border"
                placeholder="Ej: Director Comercial"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm">
                Número de Contacto <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                className="bg-input-background border-border"
                placeholder="+58 424 123 4567"
              />
            </div>
          </div>
        </section>

        {/* Información de la Compañía */}
        <section
          className="border-2 border-border bg-card p-6"
          style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
        >
          <h3 className="mb-6 text-primary">Información de la Compañía</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm">
                Nombre de la Compañía <span className="text-primary">*</span>
              </label>
              <Input
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="bg-input-background border-border"
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Sitio Web de la Compañía <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                className="bg-input-background border-border"
                placeholder="https://www.ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Compañía Registrada en <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.companyCountry}
                onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                className="w-full border-2 border-border bg-input-background px-3 py-2 transition-colors focus:border-primary focus:outline-none"
              >
                <option value="">Selecciona un país</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Ganancia Anual de la Compañía <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.annualRevenue}
                onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                className="w-full border-2 border-border bg-input-background px-3 py-2 transition-colors focus:border-primary focus:outline-none"
              >
                <option value="">Selecciona un rango</option>
                {annualRevenueRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Tipo de Alianza */}
        <section
          className="border-2 border-border bg-card p-6"
          style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
        >
          <h3 className="mb-6 text-primary">Tipo de Alianza</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm">
                Tipo de Aliado <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.partnerType}
                onChange={(e) => handleInputChange('partnerType', e.target.value)}
                className="w-full border-2 border-border bg-input-background px-3 py-2 transition-colors focus:border-primary focus:outline-none"
              >
                <option value="">Selecciona un tipo</option>
                {partnerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Localización Principal de Ventas/Distribución <span className="text-primary">*</span>
              </label>
              <Input
                required
                value={formData.primaryLocation}
                onChange={(e) => handleInputChange('primaryLocation', e.target.value)}
                className="bg-input-background border-border"
                placeholder="País o región principal"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Otra Localización de Ventas/Distribución
              </label>
              <Input
                value={formData.secondaryLocation}
                onChange={(e) => handleInputChange('secondaryLocation', e.target.value)}
                className="bg-input-background border-border"
                placeholder="Opcional"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-3 block text-sm">
                Localización/Canales de Distribución <span className="text-primary">*</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {distributionChannelOptions.map(channel => (
                  <label
                    key={channel}
                    className="flex cursor-pointer items-center gap-3 border-2 border-border bg-input-background p-3 transition-all hover:border-primary/50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.distributionChannels.includes(channel)}
                      onChange={() => handleChannelToggle(channel)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm">
                Volumen de Ventas Esperadas por Mes <span className="text-primary">*</span>
              </label>
              <select
                required
                value={formData.expectedMonthlyVolume}
                onChange={(e) => handleInputChange('expectedMonthlyVolume', e.target.value)}
                className="w-full border-2 border-border bg-input-background px-3 py-2 transition-colors focus:border-primary focus:outline-none"
              >
                <option value="">Selecciona un rango</option>
                {monthlyVolumeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Título de Solicitud */}
        <section
          className="border-2 border-border bg-card p-6"
          style={{ boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)' }}
        >
          <h3 className="mb-6 text-primary">Detalles de la Solicitud</h3>
          
          <div>
            <label className="mb-2 block text-sm">
              Título de Solicitud de Alianza <span className="text-primary">*</span>
            </label>
            <textarea
              required
              value={formData.partnershipTitle}
              onChange={(e) => handleInputChange('partnershipTitle', e.target.value)}
              className="w-full border-2 border-border bg-input-background px-3 py-3 transition-colors focus:border-primary focus:outline-none"
              rows={4}
              placeholder="Describe brevemente tu propuesta de alianza y qué te gustaría lograr con nosotros..."
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
          >
            <Send className="mr-2 h-5 w-5" />
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
}