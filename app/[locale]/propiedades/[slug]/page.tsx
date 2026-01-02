import React from 'react';
import { notFound } from 'next/navigation';
import { Bed, Bath, Square, MapPin, Calendar, Home, Check } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Badge } from '@/components/ui';
import { PropertyGallery } from '@/components/properties/PropertyGallery';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { ContactForm } from '@/components/shared/ContactForm';
import { sampleProperties } from '@/data';
import type { Property } from '@/types';

interface PropertyDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Property Detail Page
 * 
 * Displays complete information about a single property
 */
export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { locale, slug } = await params;
  const property = sampleProperties.find((p: Property) => p.slug === slug);

  if (!property) {
    notFound();
  }

  // Cast locale to valid Language
  const lang = locale as keyof typeof property.title;

  // Get related properties (same type, different property)
  const relatedProperties = sampleProperties
    .filter((p: Property) => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'reserved': return 'warning';
      case 'sold': return 'error';
      case 'off-market': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string, locale: string) => {
    const labels: Record<string, Record<string, string>> = {
      available: { es: 'Disponible', en: 'Available', de: 'Verfügbar' },
      reserved: { es: 'Reservado', en: 'Reserved', de: 'Reserviert' },
      sold: { es: 'Vendido', en: 'Sold', de: 'Verkauft' },
      'off-market': { es: 'Off-Market', en: 'Off-Market', de: 'Off-Market' },
    };
    return labels[status]?.[locale] || labels[status]?.es || status;
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Gallery */}
        <Section background="white" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Gallery - 2 columns */}
              <div className="lg:col-span-2">
                <PropertyGallery
                  images={property.images.map(img => img.url)}
                  title={property.title[lang]}
                />
              </div>

              {/* Quick Info - 1 column */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {property.isExclusive && (
                    <Badge variant="primary">Exclusivo</Badge>
                  )}
                  {property.isFeatured && (
                    <Badge variant="success">Destacado</Badge>
                  )}
                  <Badge variant={getStatusColor(property.status)}>
                    {getStatusLabel(property.status, locale)}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="font-serif text-4xl font-bold text-gray-dark">
                  {property.title[lang]}
                </h1>

                {/* Location */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.location.address}, {property.location.region}
                  </span>
                </div>

                {/* Price */}
                <div className="text-5xl font-bold text-anclora-gold">
                  {new Intl.NumberFormat(locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : 'en-GB', {
                    style: 'currency',
                    currency: property.currency || 'EUR',
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                </div>

                {/* Main Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center">
                      <Bed className="w-6 h-6 text-anclora-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Habitaciones</p>
                      <p className="text-xl font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center">
                      <Bath className="w-6 h-6 text-anclora-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Baños</p>
                      <p className="text-xl font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center">
                      <Square className="w-6 h-6 text-anclora-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Superficie</p>
                      <p className="text-xl font-semibold">{property.area}m²</p>
                    </div>
                  </div>

                  {property.plotSize && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center">
                        <Home className="w-6 h-6 text-anclora-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Parcela</p>
                        <p className="text-xl font-semibold">{property.plotSize}m²</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Year Built */}
                {property.yearBuilt && (
                  <div className="flex items-center gap-2 text-gray-600 pt-4 border-t border-gray-200">
                    <Calendar className="w-5 h-5" />
                    <span>Construido en {property.yearBuilt}</span>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>

        {/* Description & Features */}
        <Section background="beige" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Description */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-dark mb-6">
                    Descripción
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>{property.description[lang]}</p>
                  </div>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
                      Características
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-anclora-gold flex-shrink-0" />
                          <span className="text-gray-700">{feature.name[lang]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map Placeholder */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
                    Ubicación
                  </h3>
                  <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Mapa interactivo</p>
                      {property.location.coordinates && (
                        <p className="text-sm">
                          Lat: {property.location.coordinates.lat}, 
                          Lng: {property.location.coordinates.lng}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
                  <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-6">
                    Solicitar Información
                  </h3>
                  <ContactForm
                    type="property-inquiry"
                    propertyId={property.id}
                  />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <Section background="white" padding="lg">
            <Container size="xl">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-8 text-center">
                Propiedades Similares
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProperties.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.id} property={relatedProperty} />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}

// Generate static params for all properties
export async function generateStaticParams() {
  return sampleProperties.map((property: Property) => ({
    slug: property.slug,
  }));
}
