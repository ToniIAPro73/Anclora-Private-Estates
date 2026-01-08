import React from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2';
}

const aspectRatioClasses = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
};

/**
 * OptimizedImage Component
 * 
 * Wrapper para Next.js Image con optimización automática
 * y soporte para fallbacks
 * 
 * @example
 * <OptimizedImage
 *   src="/assets/images/properties/villa-1.webp"
 *   alt="Villa Son Vida"
 *   aspectRatio="16/9"
 *   className="rounded-lg"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  fallback = '/assets/images/properties/placeholder-property.svg',
  aspectRatio,
  className = '',
  ...props
}: OptimizedImageProps) {
  // VALIDACIÓN: Si src está vacío o no es string válido, usar fallback
  const isValidSrc = (source: any): source is string => {
    return typeof source === 'string' && source.trim().length > 0;
  };

  const [imgSrc, setImgSrc] = React.useState(isValidSrc(src) ? src : fallback);

  const handleError = () => {
    setImgSrc(fallback);
  };

  const wrapperClasses = aspectRatio 
    ? `relative ${aspectRatioClasses[aspectRatio]} ${className}` 
    : className;

  return (
    <div className={wrapperClasses}>
      <Image
        src={imgSrc}
        alt={alt}
        fill={!!aspectRatio}
        className={aspectRatio ? 'object-cover' : ''}
        onError={handleError}
        {...props}
      />
    </div>
  );
}