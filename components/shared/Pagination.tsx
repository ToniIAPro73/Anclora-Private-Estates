'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination Component
 * 
 * Navigation for paginated content
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 7 page numbers
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
    
    if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Anterior
      </Button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-400">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentPage === page
                  ? 'bg-anclora-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Siguiente
      </Button>
    </div>
  );
}
