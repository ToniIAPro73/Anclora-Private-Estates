'use client';

import React from 'react';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin, Eye } from 'lucide-react';
import { Badge, OptimizedImage } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

/**
 * PropertyCard Component
 * 
 * Card display for individual property in listings
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const { tr, formatPrice } = useTranslation();

  return (
    <Link 
      href={`/propiedades/${property.slug}`}
      className="group block"
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
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {property.isExclusive && (
              <Badge variant="primary" size="sm">
                Exclusivo
              </Badge>
            )}
            {property.isFeatured && (
              <Badge variant="success" size="sm">
                Destacado
              </Badge>
            )}
            {property.status === 'off-market' && (
              <Badge variant="warning" size="sm">
                Off-Market
              </Badge>
            )}
            {property.status === 'reserved' && (
              <Badge variant="error" size="sm">
                Reservado
              </Badge>
            )}
          </div>

          {/* Quick view button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white">
              <Eye className="w-5 h-5 text-gray-dark" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location.zone}, {property.location.region}
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-3 group-hover:text-anclora-gold transition-colors line-clamp-1">
            {tr(property.title)}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tr(property.description)}
          </p>

          {/* Price */}
          <div className="text-3xl font-bold text-anclora-gold mb-4">
            {formatPrice(property.price)}
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
  );
}
