/**
 * Image Optimization System
 * Sistema avanzado de optimización de imágenes para Next.js 15
 * 
 * @module image-optimization
 */

/**
 * Image format types
 */
export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png';

/**
 * Image quality presets
 */
export type ImageQuality = 'low' | 'medium' | 'high' | 'max';

/**
 * Quality values for each preset
 */
export const QUALITY_PRESETS: Record<ImageQuality, number> = {
  low: 50,
  medium: 75,
  high: 85,
  max: 95,
};

/**
 * Responsive image breakpoints
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
  ultrawide: 1920,
} as const;

/**
 * Image size configurations for different use cases
 */
export const IMAGE_SIZES = {
  // Property images
  propertyHero: {
    width: 1920,
    height: 1080,
    quality: 'high' as ImageQuality,
    formats: ['avif', 'webp', 'jpeg'] as ImageFormat[],
  },
  propertyCard: {
    width: 800,
    height: 600,
    quality: 'medium' as ImageQuality,
    formats: ['avif', 'webp', 'jpeg'] as ImageFormat[],
  },
  propertyThumbnail: {
    width: 400,
    height: 300,
    quality: 'medium' as ImageQuality,
    formats: ['webp', 'jpeg'] as ImageFormat[],
  },
  propertyGallery: {
    width: 1200,
    height: 900,
    quality: 'high' as ImageQuality,
    formats: ['avif', 'webp', 'jpeg'] as ImageFormat[],
  },
  
  // UI elements
  avatar: {
    width: 200,
    height: 200,
    quality: 'medium' as ImageQuality,
    formats: ['webp', 'jpeg'] as ImageFormat[],
  },
  logo: {
    width: 400,
    height: 200,
    quality: 'high' as ImageQuality,
    formats: ['webp', 'png'] as ImageFormat[],
  },
  icon: {
    width: 64,
    height: 64,
    quality: 'medium' as ImageQuality,
    formats: ['webp', 'png'] as ImageFormat[],
  },
  
  // Blog/content
  blogHero: {
    width: 1600,
    height: 900,
    quality: 'high' as ImageQuality,
    formats: ['avif', 'webp', 'jpeg'] as ImageFormat[],
  },
  blogInline: {
    width: 800,
    height: 600,
    quality: 'medium' as ImageQuality,
    formats: ['webp', 'jpeg'] as ImageFormat[],
  },
  blogThumbnail: {
    width: 600,
    height: 400,
    quality: 'medium' as ImageQuality,
    formats: ['webp', 'jpeg'] as ImageFormat[],
  },
} as const;

/**
 * Image optimization configuration
 */
export interface ImageOptimizationConfig {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  blur?: number;
  sharpen?: boolean;
}

/**
 * Next.js Image component props builder
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[]
): string {
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(config: {
  mobile?: number;
  tablet?: number;
  laptop?: number;
  desktop?: number;
  default: number;
}): string {
  const sizes: string[] = [];
  
  if (config.mobile) {
    sizes.push(`(max-width: ${RESPONSIVE_BREAKPOINTS.mobile}px) ${config.mobile}px`);
  }
  if (config.tablet) {
    sizes.push(`(max-width: ${RESPONSIVE_BREAKPOINTS.tablet}px) ${config.tablet}px`);
  }
  if (config.laptop) {
    sizes.push(`(max-width: ${RESPONSIVE_BREAKPOINTS.laptop}px) ${config.laptop}px`);
  }
  if (config.desktop) {
    sizes.push(`(max-width: ${RESPONSIVE_BREAKPOINTS.desktop}px) ${config.desktop}px`);
  }
  
  sizes.push(`${config.default}px`);
  
  return sizes.join(', ');
}

/**
 * Get optimized image props for property hero
 */
export function getPropertyHeroProps(
  src: string,
  alt: string,
  priority: boolean = false
): OptimizedImageProps {
  const config = IMAGE_SIZES.propertyHero;
  
  return {
    src,
    alt,
    width: config.width,
    height: config.height,
    quality: QUALITY_PRESETS[config.quality],
    priority,
    loading: priority ? 'eager' : 'lazy',
    sizes: generateSizes({
      mobile: 640,
      tablet: 768,
      laptop: 1024,
      desktop: 1280,
      default: 1920,
    }),
    placeholder: 'blur',
  };
}

/**
 * Get optimized image props for property card
 */
export function getPropertyCardProps(
  src: string,
  alt: string
): OptimizedImageProps {
  const config = IMAGE_SIZES.propertyCard;
  
  return {
    src,
    alt,
    width: config.width,
    height: config.height,
    quality: QUALITY_PRESETS[config.quality],
    loading: 'lazy',
    sizes: generateSizes({
      mobile: 640,
      tablet: 384,
      laptop: 384,
      desktop: 400,
      default: 800,
    }),
    placeholder: 'blur',
  };
}

/**
 * Get optimized image props for property gallery
 */
export function getPropertyGalleryProps(
  src: string,
  alt: string,
  index: number
): OptimizedImageProps {
  const config = IMAGE_SIZES.propertyGallery;
  
  return {
    src,
    alt,
    width: config.width,
    height: config.height,
    quality: QUALITY_PRESETS[config.quality],
    priority: index === 0, // First image priority
    loading: index === 0 ? 'eager' : 'lazy',
    sizes: generateSizes({
      mobile: 640,
      tablet: 768,
      laptop: 1024,
      desktop: 1200,
      default: 1200,
    }),
    placeholder: 'blur',
  };
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10
): string {
  // Simple base64 encoded 1x1 transparent gif
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Calculate optimal image dimensions maintaining aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  
  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }
  
  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }
  
  if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }
  
  return { width: originalWidth, height: originalHeight };
}

/**
 * Image loader for external CDN
 */
export function cdnImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
}

/**
 * Check if image is optimized
 */
export function isImageOptimized(url: string): boolean {
  const optimizedFormats = ['webp', 'avif'];
  const extension = url.split('.').pop()?.toLowerCase();
  return optimizedFormats.includes(extension || '');
}

/**
 * Get image file size estimate
 */
export function estimateImageSize(
  width: number,
  height: number,
  format: ImageFormat,
  quality: ImageQuality
): number {
  const pixels = width * height;
  const qualityValue = QUALITY_PRESETS[quality];
  
  // Rough estimates in bytes
  const formatMultipliers: Record<ImageFormat, number> = {
    avif: 0.15,
    webp: 0.25,
    jpeg: 0.5,
    png: 1.5,
  };
  
  const baseSize = pixels * formatMultipliers[format];
  const qualityFactor = qualityValue / 100;
  
  return Math.round(baseSize * qualityFactor);
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  maxWidth: number = 3840,
  maxHeight: number = 2160
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (width <= 0 || height <= 0) {
    errors.push('Width and height must be positive');
  }
  
  if (width > maxWidth) {
    errors.push(`Width exceeds maximum of ${maxWidth}px`);
  }
  
  if (height > maxHeight) {
    errors.push(`Height exceeds maximum of ${maxHeight}px`);
  }
  
  const aspectRatio = width / height;
  if (aspectRatio < 0.1 || aspectRatio > 10) {
    errors.push('Aspect ratio outside reasonable bounds');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Image optimization recommendations
 */
export interface ImageOptimizationRecommendation {
  currentSize: number;
  recommendedFormat: ImageFormat;
  recommendedQuality: ImageQuality;
  estimatedSavings: number;
  savingsPercentage: number;
}

/**
 * Get optimization recommendations
 */
export function getOptimizationRecommendations(
  currentWidth: number,
  currentHeight: number,
  currentFormat: ImageFormat,
  currentQuality: ImageQuality,
  useCase: keyof typeof IMAGE_SIZES
): ImageOptimizationRecommendation {
  const config = IMAGE_SIZES[useCase];
  const currentSize = estimateImageSize(
    currentWidth,
    currentHeight,
    currentFormat,
    currentQuality
  );
  
  const recommendedFormat = config.formats[0];
  const recommendedQuality = config.quality;
  
  const optimizedSize = estimateImageSize(
    config.width,
    config.height,
    recommendedFormat,
    recommendedQuality
  );
  
  const savings = currentSize - optimizedSize;
  const savingsPercentage = (savings / currentSize) * 100;
  
  return {
    currentSize,
    recommendedFormat,
    recommendedQuality,
    estimatedSavings: savings,
    savingsPercentage,
  };
}

/**
 * Image loading priority calculator
 */
export function calculateLoadingPriority(
  position: 'above-fold' | 'below-fold',
  importance: 'critical' | 'high' | 'medium' | 'low'
): { priority: boolean; loading: 'eager' | 'lazy' } {
  if (position === 'above-fold' && importance === 'critical') {
    return { priority: true, loading: 'eager' };
  }
  
  if (position === 'above-fold' && importance === 'high') {
    return { priority: false, loading: 'eager' };
  }
  
  return { priority: false, loading: 'lazy' };
}

/**
 * Next.js Image component configuration
 */
export const nextImageConfig = {
  deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  dangerouslyAllowSVG: false,
  contentDispositionType: 'inline',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};

/**
 * Image optimization best practices
 */
export const IMAGE_BEST_PRACTICES = {
  formats: {
    photos: 'Use AVIF or WebP for photos',
    graphics: 'Use WebP or PNG for graphics with transparency',
    logos: 'Use SVG when possible, fallback to WebP',
    icons: 'Use SVG or icon fonts',
  },
  
  quality: {
    hero: 'Use 85-95% quality for hero images',
    thumbnails: 'Use 75-85% quality for thumbnails',
    backgrounds: 'Use 50-75% quality for backgrounds',
  },
  
  sizes: {
    maxWidth: 'Never exceed 1920px width',
    maxHeight: 'Never exceed 1080px height',
    thumbnails: 'Keep thumbnails under 400px',
  },
  
  loading: {
    aboveFold: 'Use priority=true for above-fold images',
    belowFold: 'Use lazy loading for below-fold images',
    gallery: 'Lazy load all except first image',
  },
  
  performance: {
    totalSize: 'Keep total page images under 1MB',
    perImage: 'Keep individual images under 200KB',
    count: 'Limit to 10-15 images per page',
  },
};

/**
 * Export all
 */
export default {
  QUALITY_PRESETS,
  RESPONSIVE_BREAKPOINTS,
  IMAGE_SIZES,
  generateSrcSet,
  generateSizes,
  getPropertyHeroProps,
  getPropertyCardProps,
  getPropertyGalleryProps,
  generateBlurDataURL,
  calculateDimensions,
  cdnImageLoader,
  isImageOptimized,
  estimateImageSize,
  validateImageDimensions,
  getOptimizationRecommendations,
  calculateLoadingPriority,
  nextImageConfig,
  IMAGE_BEST_PRACTICES,
};
