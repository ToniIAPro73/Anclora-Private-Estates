'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input, Select } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { PROPERTY_TYPES, MALLORCA_REGIONS, PRICE_RANGES, BEDROOM_OPTIONS, PROPERTY_STATUSES } from '@/lib/constants';

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilterState) => void;
}

export interface PropertyFilterState {
  search: string;
  type: string;
  region: string;
  priceRange: string;
  bedrooms: string;
  status: string;
}

/**
 * PropertyFilters Component
 * 
 * Advanced filters for property listing page
 */
export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const { t, tr } = useTranslation();
  const [filters, setFilters] = React.useState<PropertyFilterState>({
    search: '',
    type: '',
    region: '',
    priceRange: '',
    bedrooms: '',
    status: '',
  });

  const handleChange = (key: keyof PropertyFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-anclora-gold" />
        <h3 className="font-semibold text-lg">{t('properties.filters.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="lg:col-span-3">
          <Input
            placeholder={t('properties.filters.search.placeholder')}
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Property Type */}
        <Select
          label={t('properties.filters.type.label')}
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="">{t('properties.filters.type.all')}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {tr(type.label)}
            </option>
          ))}
        </Select>

        {/* Region */}
        <Select
          label={t('properties.filters.region.label')}
          value={filters.region}
          onChange={(e) => handleChange('region', e.target.value)}
        >
          <option value="">{t('properties.filters.region.all')}</option>
          {MALLORCA_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>

        {/* Price Range */}
        <Select
          label={t('properties.filters.price.label')}
          value={filters.priceRange}
          onChange={(e) => handleChange('priceRange', e.target.value)}
        >
          <option value="">{t('properties.filters.price.all')}</option>
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </Select>

        {/* Bedrooms */}
        <Select
          label={t('properties.filters.bedrooms.label')}
          value={filters.bedrooms}
          onChange={(e) => handleChange('bedrooms', e.target.value)}
        >
          <option value="">{t('properties.filters.bedrooms.all')}</option>
          {BEDROOM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}+ {t('properties.bedrooms')}
            </option>
          ))}
        </Select>

        {/* Status */}
        <Select
          label={t('properties.filters.status.label')}
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">{t('properties.filters.status.all')}</option>
          {PROPERTY_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {tr(status.label)}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
