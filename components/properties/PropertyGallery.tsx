'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { OptimizedImage } from '@/components/ui';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/**
 * PropertyGallery Component
 * 
 * Image gallery with lightbox and thumbnails
 */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const placeholderImage = '/assets/images/placeholders/property-placeholder.svg';
  const displayImages = images.length > 0 ? images : [placeholderImage];

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative h-[500px] rounded-lg overflow-hidden group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
          <OptimizedImage
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            objectFit="cover"
            priority={currentIndex === 0}
          />
          
          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {displayImages.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-20 rounded-md overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? 'border-anclora-gold'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <OptimizedImage
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="150px"
                  objectFit="cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-anclora-gold p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-anclora-gold p-3"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            <OptimizedImage
              src={displayImages[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              sizes="100vw"
              objectFit="contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-anclora-gold p-3"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
