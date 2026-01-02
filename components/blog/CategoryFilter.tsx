'use client';

import React from 'react';
import { BLOG_CATEGORIES } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/**
 * CategoryFilter Component
 * 
 * Filter blog posts by category
 */
export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { tr } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-anclora-gold text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        Todos
      </button>
      
      {BLOG_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selectedCategory === category.value
              ? 'bg-anclora-gold text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {tr(category.label)}
        </button>
      ))}
    </div>
  );
}
