'use client';

import React, { useState, useMemo } from 'react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { PropertyFilters, type PropertyFilterState } from '@/components/properties/PropertyFilters';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Pagination } from '@/components/shared/Pagination';
import { sampleProperties } from '@/data';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import type { Property, Language } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams } from 'next/navigation';

/**
 * Properties Listing Page
 * 
 * Displays filterable grid of properties with pagination
 */
export default function PropertiesPage() {
  const { t, tr } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as Language) || 'es';

  const [filters, setFilters] = useState<PropertyFilterState>({
    search: '',
    type: '',
    region: '',
    priceRange: '',
    bedrooms: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property: Property) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = property.title[locale].toLowerCase().includes(searchLower);
        const zoneMatch = property.location.address.toLowerCase().includes(searchLower);
        if (!titleMatch && !zoneMatch) return false;
      }

      // Type filter
      if (filters.type && property.type !== filters.type) return false;

      // Region filter
      if (filters.region && property.location.region !== filters.region) return false;

      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;

      // Status filter
      if (filters.status && property.status !== filters.status) return false;

      return true;
    });
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE.properties);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE.properties,
    currentPage * ITEMS_PER_PAGE.properties
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="lg">
          <div className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              {t('properties.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('properties.subtitle')}
            </p>
          </div>
        </Section>

        {/* Filters & Results */}
        <Section background="beige" padding="lg">
          <Container size="xl">
            <PropertyFilters onFilterChange={setFilters} />

            {/* Results count */}
            <div className="mt-8 mb-6">
              <p className="text-gray-600">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
            </div>

            {/* Properties Grid */}
            {paginatedProperties.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">
                  No se encontraron propiedades con los filtros seleccionados
                </p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    type: '',
                    region: '',
                    priceRange: '',
                    bedrooms: '',
                    status: '',
                  })}
                  className="text-anclora-gold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
