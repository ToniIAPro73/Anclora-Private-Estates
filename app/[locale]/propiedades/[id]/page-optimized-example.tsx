/**
 * Performance-Optimized Page Example
 * Ejemplo completo de página con todas las optimizaciones aplicadas
 */

import { Suspense } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// Image optimization
import {
  getPropertyHeroProps,
  getPropertyCardProps,
} from '@/lib/image-optimization';

// Lazy loading
// Caching
import { getFetchOptions } from '@/lib/caching-strategies';

interface PropertyLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RelatedProperty {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number;
}

interface PropertyData {
  id: string;
  title: string;
  location: PropertyLocation;
  bedrooms: number;
  surface: number;
  price: number;
  description: string;
  features: string[];
  images: {
    hero: string;
    gallery: string[];
  };
  relatedProperties: RelatedProperty[];
}

/**
 * Dynamic imports for heavy components
 */
const PropertyMap = dynamic(
  () => import('@/components/property/PropertyMap'),
  {
    loading: () => (
      <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false, // Client-side only
  }
);

const ContactForm = dynamic(
  () => import('@/components/forms/ContactForm'),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

const MortgageCalculator = dynamic(
  () => import('@/components/calculators/MortgageCalculator'),
  {
    loading: () => (
      <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);

/**
 * Generate optimized metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Villa de Lujo en Mallorca | Anclora Private Estates',
    description: 'Villa exclusiva de 450m² con vistas al mar, piscina infinity y 5 dormitorios. La propiedad más lujosa de Son Vida.',
    
    // Open Graph
    openGraph: {
      title: 'Villa de Lujo en Son Vida',
      description: 'Villa exclusiva de 450m² con vistas al mar',
      images: [
        {
          url: '/images/properties/villa-son-vida-hero.webp',
          width: 1200,
          height: 630,
          alt: 'Villa de lujo en Son Vida',
        },
      ],
      type: 'website',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: 'Villa de Lujo en Son Vida',
      description: 'Villa exclusiva de 450m² con vistas al mar',
      images: ['/images/properties/villa-son-vida-hero.webp'],
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification
    verification: {
      google: 'google-verification-code',
    },
  };
}

/**
 * Fetch property data with caching
 */
async function getPropertyData(id: string): Promise<PropertyData> {
  const res = await fetch(
    `https://api.anclora.com/properties/${id}`,
    getFetchOptions('propertyDetails')
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch property');
  }
  
  return res.json();
}

/**
 * Generate static params for static generation
 */
export async function generateStaticParams() {
  // Fetch all property IDs
  const res = await fetch('https://api.anclora.com/properties?limit=100');
  const properties: Array<{ id: string }> = await res.json();
  
  return properties.map((property) => ({
    id: property.id,
  }));
}

/**
 * Main page component
 */
export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch data with caching
  const property = await getPropertyData(params.id);
  
  // Image props with optimization
  const heroImageProps = getPropertyHeroProps(
    property.images.hero,
    `${property.title} - Vista principal`,
    true // Priority loading
  );
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Above the fold, critical */}
      <section className="relative h-screen">
        <Image
          {...heroImageProps}
          alt={heroImageProps.alt ?? `${property.title} - Vista principal`}
          className="object-cover"
          fill
          priority
          sizes="100vw"
          quality={85}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="font-playfair text-5xl md:text-6xl mb-4">
            {property.title}
          </h1>
          <p className="font-montserrat text-xl mb-6">
            {property.location.name} · {property.bedrooms} dormitorios · {property.surface}m²
          </p>
          <div className="flex gap-4">
            <span className="text-3xl font-bold">
              €{property.price.toLocaleString()}
            </span>
          </div>
        </div>
      </section>
      
      {/* Overview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-playfair text-4xl mb-6">
              Descripción
            </h2>
            <p className="font-montserrat text-lg text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>
          
          <div>
            <h3 className="font-montserrat text-2xl font-semibold mb-4">
              Características
            </h3>
            <ul className="space-y-2">
              {property.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-anclora-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-montserrat">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* Gallery Section - Lazy loaded */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      }>
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-playfair text-4xl mb-8">Galería</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {property.images.gallery.map((image: string, index: number) => {
              const cardProps = getPropertyCardProps(
                image,
                `${property.title} - Vista ${index + 1}`
              );
              
              return (
                <div key={index} className="relative aspect-[4/3]">
                  <Image
                    {...cardProps}
                    alt={cardProps.alt ?? `${property.title} - Vista ${index + 1}`}
                    className="object-cover rounded-lg"
                    fill
                    loading={index < 6 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </Suspense>
      
      {/* Map Section - Dynamic import, lazy loaded */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      }>
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-playfair text-4xl mb-8">Ubicación</h2>
          
          <PropertyMap
            latitude={property.location.coordinates.lat}
            longitude={property.location.coordinates.lng}
            zoom={15}
          />
        </section>
      </Suspense>
      
      {/* Mortgage Calculator - Dynamic import */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      }>
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-playfair text-4xl mb-8">
              Calculadora de Hipoteca
            </h2>
            
            <MortgageCalculator
              propertyPrice={property.price}
              downPaymentPercentage={30}
            />
          </div>
        </section>
      </Suspense>
      
      {/* Contact Form - Dynamic import */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      }>
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-playfair text-4xl mb-8">
            Solicitar Información
          </h2>
          
          <ContactForm
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </section>
      </Suspense>
      
      {/* Related Properties - Below fold, lazy */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }>
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-playfair text-4xl mb-8">
              Propiedades Similares
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {property.relatedProperties.map((related) => {
                const cardProps = getPropertyCardProps(
                  related.image,
                  related.title
                );
                
                return (
                  <div key={related.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="relative aspect-[4/3]">
                      <Image
                        {...cardProps}
                        alt={cardProps.alt ?? related.title}
                        className="object-cover"
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-playfair text-2xl mb-2">
                        {related.title}
                      </h3>
                      <p className="font-montserrat text-gray-600 mb-4">
                        {related.location}
                      </p>
                      <p className="font-montserrat text-2xl font-bold text-anclora-gold">
                        €{related.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
}

/**
 * Page configuration
 */
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static'; // Static generation
export const dynamicParams = true; // Allow new params

