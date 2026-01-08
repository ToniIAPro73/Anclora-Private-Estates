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
      <div className="mx-auto mb-16 max-w-4xl text-center">
        <h2 className="text-gray-dark mb-6 font-serif text-5xl font-bold md:text-6xl">
          {t('featuredProperties.headline')}
        </h2>
        <p className="text-xl leading-relaxed text-gray-600">
          {t('featuredProperties.subheadline')}
        </p>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featuredProperties.slice(0, 6).map((property) => (
          <Link
            key={property.id}
            href={`/propiedades/${property.slug}`}
            className="group"
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={
                    property.images[0]?.url ||
                    '/assets/images/placeholders/property-placeholder.svg'
                  }
                  alt={tr(property.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex gap-2">
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
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-gray-dark mb-2 font-serif text-2xl font-semibold transition-colors group-hover:text-anclora-gold">
                      {tr(property.title)}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      {property.location.zone}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-3xl font-bold text-anclora-gold">
                  {localizedPrice(property.price)}
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
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
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            {t('featuredProperties.cta')}
          </Button>
        </Link>
      </div>
    </Section>
  );
}
