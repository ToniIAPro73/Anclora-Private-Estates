'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bed, Bath, Square, MapPin } from 'lucide-react';
import { Section } from '@/components/layout';
import { Button, Badge, OptimizedImage } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { featuredProperties } from '@/data';

/**
 * FeaturedProperties Component - Homepage
 * 
 * Carousel/grid of featured luxury properties
 */
export function FeaturedProperties() {
  const { t, tr, formatPrice: localizedPrice } = useTranslation();

  return (
    <Section background="gradient" padding="xl">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-dark mb-6">
          {t('featuredProperties.headline')}
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          {t('featuredProperties.subheadline')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featuredProperties.slice(0, 6).map((property) => (
          <Link 
            key={property.id} 
            href={`/propiedades/${property.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={property.images[0] || '/assets/images/placeholders/property-placeholder.svg'}
                  alt={tr(property.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  objectFit="cover"
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.isExclusive && (
                    <Badge variant="primary" size="sm">
                      {t('properties.exclusive')}
                    </Badge>
                  )}
                  {property.status === 'off-market' && (
                    <Badge variant="warning" size="sm">
                      {t('properties.status.offMarket')}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-2 group-hover:text-anclora-gold transition-colors">
                      {tr(property.title)}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location.zone}
                    </div>
                  </div>
                </div>

                <div className="text-3xl font-bold text-anclora-gold mb-4">
                  {localizedPrice(property.price)}
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 text-gray-600 text-sm border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    <span>{property.area}m²</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/propiedades">
          <Button 
            variant="secondary" 
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {t('featuredProperties.cta')}
          </Button>
        </Link>
      </div>
    </Section>
  );
}
