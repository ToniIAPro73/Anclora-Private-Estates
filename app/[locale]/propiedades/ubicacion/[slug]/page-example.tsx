/**
 * Location Page Example
 * Complete implementation with SEO optimization
 * /app/propiedades/ubicacion/[slug]/page.tsx
 */

import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocationGuide } from '@/data/location-guides';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getLocationPageSchemas } from '@/lib/schema-examples';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import { generateContextualLinks, generateBreadcrumbs } from '@/lib/internal-linking';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const location = getLocationGuide(params.slug);

  if (!location) {
    return {
      title: 'Ubicación no encontrada',
    };
  }

  return generateSEOMetadata({
    title: `${location.name} - ${location.tagline}`,
    description: location.metaDescription,
    url: `/propiedades/ubicacion/${location.slug}`,
    type: 'website',
  });
}

export default async function LocationPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const location = getLocationGuide(params.slug);

  if (!location) {
    notFound();
  }

  // Generate structured data
  const schemas = getLocationPageSchemas(location, []); // Properties would be fetched from DB

  // Generate internal links
  const contextualLinks = generateContextualLinks({
    currentPage: {
      type: 'location',
      location: location.name,
    },
  });

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs({
    currentPage: {
      type: 'location',
      location: location.name,
    },
  });

  // Format price range
  const priceRange = `€${(location.realEstate.priceRange.min / 1000000).toFixed(1)}M - €${(location.realEstate.priceRange.max / 1000000).toFixed(1)}M`;

  return (
    <>
      <SchemaRenderer schemas={schemas} />
      
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px]">
          <Image
            src={location.images[0]}
            alt={`Vista panoramica de ${location.name} Mallorca - Zona residencial exclusiva`}
            width={1600}
            height={900}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">
                {location.name}
              </h1>
              <p className="text-2xl text-white/90 mb-6">
                {location.tagline}
              </p>
              <div className="flex flex-wrap gap-4 text-white/90">
                <span>📍 {location.transportation.palmaDistance}km de Palma</span>
                <span>✈️ {location.transportation.airportDistance}km del aeropuerto</span>
                <span>💰 Precio promedio: €{(location.realEstate.averagePrice / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <a href={crumb.url} className="hover:text-gold">
                    {crumb.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2">
              {/* Overview */}
              <section className="mb-12">
                <h2 className="font-serif text-3xl mb-6">Descripción de {location.name}</h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                    {location.overview}
                  </p>
                </div>
              </section>

              {/* Lifestyle */}
              <section className="mb-12">
                <h2 className="font-serif text-3xl mb-6">Estilo de Vida</h2>
                <p className="text-gray-700 mb-6">{location.lifestyle.atmosphere}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-xl mb-3">Ideal Para:</h3>
                    <ul className="space-y-2">
                      {location.lifestyle.idealFor.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gold mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-xl mb-3">Actividades:</h3>
                    <ul className="space-y-2">
                      {location.lifestyle.activities.slice(0, 5).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gold mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Amenities */}
              <section className="mb-12">
                <h2 className="font-serif text-3xl mb-6">Servicios y Amenidades</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {location.amenities.schools && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        🎓 Colegios
                      </h3>
                      <ul className="space-y-1 text-gray-700">
                        {location.amenities.schools.map((school, index) => (
                          <li key={index}>• {school}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {location.amenities.healthCare && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        🏥 Salud
                      </h3>
                      <ul className="space-y-1 text-gray-700">
                        {location.amenities.healthCare.map((facility, index) => (
                          <li key={index}>• {facility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {location.amenities.golf && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        ⛳ Golf
                      </h3>
                      <ul className="space-y-1 text-gray-700">
                        {location.amenities.golf.map((course, index) => (
                          <li key={index}>• {course}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {location.amenities.beaches && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        🏖️ Playas y Calas
                      </h3>
                      <ul className="space-y-1 text-gray-700">
                        {location.amenities.beaches.map((beach, index) => (
                          <li key={index}>• {beach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Restaurants */}
              {location.lifestyle.restaurants.length > 0 && (
                <section className="mb-12">
                  <h2 className="font-serif text-3xl mb-6">Gastronomía</h2>
                  <p className="text-gray-700 mb-4">
                    {location.name} cuenta con una oferta gastronómica excepcional:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {location.lifestyle.restaurants.map((restaurant, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                        <span className="text-gold mr-3">🍽️</span>
                        <span className="text-gray-800">{restaurant}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Highlights */}
              <section className="mb-12">
                <h2 className="font-serif text-3xl mb-6">Aspectos Destacados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {location.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-gold text-xl mr-3">★</span>
                      <span className="text-gray-800">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Market Stats */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8 sticky top-4">
                <h3 className="font-serif text-2xl mb-4">Mercado Inmobiliario</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rango de Precios</p>
                    <p className="text-2xl font-bold text-gold">{priceRange}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Precio Promedio</p>
                    <p className="text-xl font-semibold">
                      €{(location.realEstate.averagePrice / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  
                  {location.realEstate.annualAppreciation && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Revalorización Anual</p>
                      <p className="text-xl font-semibold text-green-600">
                        +{location.realEstate.annualAppreciation}%
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipos de Propiedad</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {location.realEstate.propertyTypes.map((type, index) => (
                        <span key={index} className="px-3 py-1 bg-white rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a 
                  href={`/propiedades?location=${location.slug}`}
                  className="block w-full bg-gold text-white text-center py-3 rounded mt-6 hover:bg-gold-dark transition"
                >
                  Ver Propiedades en {location.name}
                </a>
              </div>

              {/* Related Links */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">También te puede interesar</h3>
                <ul className="space-y-3">
                  {contextualLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.url}
                        className="text-gold hover:underline"
                        title={link.title}
                      >
                        → {link.anchor}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-anclora-black text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl mb-6">
              ¿Buscas una propiedad en {location.name}?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Nuestro equipo de expertos conoce cada rincón de {location.name} y puede ayudarte a encontrar la propiedad perfecta.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`/propiedades?location=${location.slug}`}
                className="bg-gold text-white px-8 py-3 rounded hover:bg-gold-dark transition"
              >
                Ver Propiedades Disponibles
              </a>
              <a 
                href="/contacto"
                className="bg-white text-anclora-black px-8 py-3 rounded hover:bg-gray-100 transition"
              >
                Contactar con Experto
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

