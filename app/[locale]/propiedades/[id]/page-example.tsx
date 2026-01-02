/**
 * Property Page Example with Full SEO Implementation
 * /app/propiedades/[id]/page.tsx
 */

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  generatePropertyMetadata, 
  getPropertySchema, 
  getBreadcrumbSchema 
} from '@/lib/seo';
import { SEO } from '@/components/seo/SEO';

// Mock property data (replace with actual database query)
async function getProperty(id: string) {
  // TODO: Fetch from database
  const mockProperty = {
    id: 'villa-son-vida-001',
    title: 'Villa de Lujo en Son Vida',
    description: 'Espectacular villa de diseño contemporáneo situada en la exclusiva zona de Son Vida. Esta propiedad única ofrece vistas panorámicas a la bahía de Palma y las montañas de Tramuntana. Construida con los más altos estándares de calidad, cuenta con amplios espacios interiores con acabados de lujo, cocina de diseño equipada con electrodomésticos de alta gama, y un elegante salón con acceso directo a la terraza.',
    price: 3500000,
    location: 'Son Vida',
    bedrooms: 5,
    bathrooms: 4,
    size: 450,
    plotSize: 1200,
    images: [
      'https://ancloraprivateestates.com/images/properties/villa-son-vida-001/1.jpg',
      'https://ancloraprivateestates.com/images/properties/villa-son-vida-001/2.jpg',
    ],
    features: [
      'Piscina infinity',
      'Garaje para 3 vehículos',
      'Sistema domótica',
      'Calefacción suelo radiante',
      'Aire acondicionado',
      'Alarma',
      'Jardín mediterráneo',
    ],
    yearBuilt: 2022,
    status: 'available',
    propertyType: 'Villa',
    updatedAt: new Date().toISOString(),
  };

  if (id !== mockProperty.id) {
    return null;
  }

  return mockProperty;
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const property = await getProperty(params.id);

  if (!property) {
    return {
      title: 'Propiedad no encontrada',
    };
  }

  return generatePropertyMetadata({
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    images: property.images,
    features: property.features,
  });
}

export default async function PropertyPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  // Generate structured data
  const propertySchema = getPropertySchema({
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    images: property.images,
    features: property.features,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Propiedades', url: '/propiedades' },
    { name: property.location, url: `/propiedades/ubicacion/${property.location.toLowerCase()}` },
    { name: property.title, url: `/propiedades/${property.id}` },
  ]);

  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(property.price);

  return (
    <SEO jsonLd={[propertySchema, breadcrumbSchema]}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-gold">Inicio</a></li>
            <li>/</li>
            <li><a href="/propiedades" className="hover:text-gold">Propiedades</a></li>
            <li>/</li>
            <li><a href={`/propiedades/ubicacion/${property.location.toLowerCase()}`} className="hover:text-gold">
              {property.location}
            </a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{property.title}</li>
          </ol>
        </nav>

        {/* Property Header */}
        <header className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-anclora-black mb-4">
            {property.title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {property.location}, Mallorca
            </p>
            <p className="text-3xl font-bold text-gold">
              {formattedPrice}
            </p>
          </div>
        </header>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {property.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`${property.title} - Vista ${index + 1}`}
              width={1200}
              height={720}
              className="w-full h-96 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Property Details */}
        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4">Características Principales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Dormitorios</p>
              <p className="text-2xl font-bold">{property.bedrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Baños</p>
              <p className="text-2xl font-bold">{property.bathrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Superficie</p>
              <p className="text-2xl font-bold">{property.size}m²</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Parcela</p>
              <p className="text-2xl font-bold">{property.plotSize}m²</p>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4">Descripción</h2>
          <div className="prose max-w-none">
            <p>{property.description}</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4">Equipamiento y Extras</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {property.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="text-gold mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact CTA */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="font-serif text-3xl mb-4 text-center">
            ¿Interesado en esta propiedad?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Contacta con nuestro equipo para más información o agendar una visita privada
          </p>
          <div className="text-center">
            <a 
              href={`/contacto?property=${property.id}`}
              className="inline-block bg-gold text-white px-8 py-3 rounded hover:bg-gold-dark transition"
            >
              Solicitar Información
            </a>
          </div>
        </section>
      </div>
    </SEO>
  );
}

