/**
 * CDN Configuration & Asset Optimization
 * Configuración de CDN y optimización de assets estáticos
 * 
 * @module cdn-config
 */

/**
 * CDN provider types
 */
export type CDNProvider = 'vercel' | 'cloudflare' | 'cloudinary' | 'imgix';

/**
 * Asset types
 */
export type AssetType = 'image' | 'video' | 'font' | 'script' | 'style' | 'document';

/**
 * CDN configuration per provider
 */
export const CDN_CONFIGS = {
  // Vercel Edge Network
  vercel: {
    domain: process.env.NEXT_PUBLIC_VERCEL_URL || '',
    regions: ['iad1', 'sfo1', 'cdg1', 'hnd1', 'syd1'],
    features: {
      edgeCaching: true,
      imageOptimization: true,
      compression: true,
      http3: true,
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  // Cloudflare CDN
  cloudflare: {
    domain: process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN || '',
    zones: ['eu-west', 'us-east', 'asia-pacific'],
    features: {
      edgeCaching: true,
      mirage: true, // Lazy loading
      polish: true, // Image optimization
      brotli: true,
      http3: true,
      argo: true, // Smart routing
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'CF-Cache-Status': 'HIT',
      'CF-Ray': 'auto',
    },
  },
  
  // Cloudinary (Images/Videos)
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    domain: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
    features: {
      imageOptimization: true,
      videoOptimization: true,
      transformations: true,
      responsiveImages: true,
      lazyLoading: true,
      analytics: true,
    },
    transformations: {
      quality: 'auto:best',
      format: 'auto',
      fetchFormat: 'auto',
      dpr: 'auto',
    },
  },
  
  // imgix (Images)
  imgix: {
    domain: process.env.NEXT_PUBLIC_IMGIX_DOMAIN || '',
    features: {
      imageOptimization: true,
      responsiveImages: true,
      faceDetection: true,
      colorPalette: true,
    },
    params: {
      auto: 'format,compress',
      q: 85,
      fit: 'max',
    },
  },
};

/**
 * Asset URL builder
 */
export function buildAssetURL(
  path: string,
  provider: CDNProvider = 'vercel',
  transformations?: Record<string, unknown>
): string {
  const config = CDN_CONFIGS[provider];
  
  switch (provider) {
    case 'cloudinary': {
      const transforms: string[] = [];
      
      if (transformations) {
        Object.entries(transformations).forEach(([key, value]) => {
          transforms.push(`${key}_${value}`);
        });
      }
      
      const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
      return `${config.domain}/image/upload/${transformString}${path}`;
    }
    
    case 'imgix': {
      const params = new URLSearchParams({
        ...config.params,
        ...transformations,
      });
      
      return `${config.domain}${path}?${params.toString()}`;
    }
    
    case 'cloudflare':
    case 'vercel':
    default: {
      const baseURL = config.domain || '';
      return `${baseURL}${path}`;
    }
  }
}

/**
 * Responsive image URLs
 */
export function buildResponsiveImageURLs(
  path: string,
  widths: number[],
  provider: CDNProvider = 'cloudinary'
): Array<{ url: string; width: number }> {
  return widths.map(width => ({
    url: buildAssetURL(path, provider, { w: width, c: 'scale' }),
    width,
  }));
}

/**
 * Font preloading configuration
 */
export const FONT_PRELOAD_CONFIG = {
  // Primary fonts (preload)
  primary: [
    {
      href: '/fonts/playfair-display-variable.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      href: '/fonts/montserrat-variable.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ],
  
  // Secondary fonts (preconnect)
  secondary: [
    {
      href: 'https://fonts.googleapis.com',
      rel: 'preconnect',
    },
    {
      href: 'https://fonts.gstatic.com',
      rel: 'preconnect',
      crossOrigin: 'anonymous',
    },
  ],
};

/**
 * Critical resource hints
 */
export const RESOURCE_HINTS = {
  // DNS prefetch
  dnsPrefetch: [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://maps.googleapis.com',
    'https://api.mapbox.com',
  ],
  
  // Preconnect (more critical)
  preconnect: [
    'https://res.cloudinary.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  
  // Preload (critical resources)
  preload: [
    {
      href: '/fonts/playfair-display-variable.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      href: '/images/hero-home.webp',
      as: 'image',
      type: 'image/webp',
    },
  ],
  
  // Prefetch (likely next navigation)
  prefetch: [
    '/propiedades',
    '/contacto',
  ],
};

/**
 * Asset optimization rules
 */
export const ASSET_OPTIMIZATION_RULES = {
  images: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      hero: 85,
      content: 80,
      thumbnail: 75,
      background: 70,
    },
    maxWidth: {
      hero: 1920,
      content: 1200,
      thumbnail: 600,
      icon: 256,
    },
    lazy: {
      threshold: 0.01,
      rootMargin: '50px',
    },
  },
  
  videos: {
    formats: ['webm', 'mp4'],
    quality: 'auto',
    streaming: {
      enabled: true,
      protocol: 'HLS',
      bitrates: [500, 1000, 2000, 4000], // kbps
    },
    poster: {
      enabled: true,
      quality: 75,
    },
    lazy: true,
  },
  
  fonts: {
    formats: ['woff2', 'woff'],
    display: 'swap',
    preload: ['primary'],
    subsetting: {
      enabled: true,
      unicodeRange: 'latin',
    },
  },
  
  scripts: {
    async: ['analytics', 'tracking'],
    defer: ['chat', 'social'],
    module: true,
    compression: 'brotli',
  },
  
  styles: {
    inline: {
      critical: true,
      maxSize: 14 * 1024, // 14KB
    },
    async: ['non-critical'],
    purge: true,
    minify: true,
  },
};

/**
 * Static asset versioning
 */
export function versionAsset(path: string, version?: string): string {
  const v = version || process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString();
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}v=${v}`;
}

/**
 * Asset integrity hash
 */
export function generateIntegrity(content: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha384'): string {
  // En producción, esto se generaría durante el build
  // Por ahora devolvemos un placeholder
  return `${algorithm}-placeholder`;
}

/**
 * CDN purge/invalidation
 */
export async function purgeCDNCache(
  paths: string[],
  provider: CDNProvider = 'vercel'
): Promise<void> {
  // Implementación específica por proveedor
  const endpoint = `/api/cdn/purge`;
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths, provider }),
    });
  } catch (error) {
    console.error('CDN purge failed:', error);
  }
}

/**
 * Asset manifest
 */
export interface AssetManifest {
  version: string;
  assets: {
    [key: string]: {
      path: string;
      hash: string;
      size: number;
      type: AssetType;
      cdn?: CDNProvider;
    };
  };
}

/**
 * Generate asset manifest
 */
export function generateAssetManifest(
  assets: Array<{
    key: string;
    path: string;
    hash: string;
    size: number;
    type: AssetType;
  }>
): AssetManifest {
  const manifest: AssetManifest = {
    version: process.env.NEXT_PUBLIC_BUILD_ID || '1.0.0',
    assets: {},
  };
  
  assets.forEach(asset => {
    manifest.assets[asset.key] = {
      path: asset.path,
      hash: asset.hash,
      size: asset.size,
      type: asset.type,
    };
  });
  
  return manifest;
}

/**
 * Service Worker asset caching
 */
export const SERVICE_WORKER_CACHE_STRATEGY = {
  images: {
    cacheName: 'images-v1',
    strategy: 'CacheFirst',
    maxEntries: 100,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
  },
  
  fonts: {
    cacheName: 'fonts-v1',
    strategy: 'CacheFirst',
    maxEntries: 20,
    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
  },
  
  scripts: {
    cacheName: 'scripts-v1',
    strategy: 'StaleWhileRevalidate',
    maxEntries: 50,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
  },
  
  styles: {
    cacheName: 'styles-v1',
    strategy: 'StaleWhileRevalidate',
    maxEntries: 30,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
  },
  
  documents: {
    cacheName: 'documents-v1',
    strategy: 'NetworkFirst',
    maxEntries: 50,
    maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
  },
};

/**
 * Performance monitoring for CDN
 */
export interface CDNMetrics {
  provider: CDNProvider;
  region: string;
  latency: number;
  cacheHitRate: number;
  bandwidth: number;
  requests: number;
}

/**
 * Track CDN performance
 */
export function trackCDNPerformance(metrics: CDNMetrics): void {
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cdn_performance', {
      provider: metrics.provider,
      region: metrics.region,
      latency: metrics.latency,
      cache_hit_rate: metrics.cacheHitRate,
      bandwidth: metrics.bandwidth,
      requests: metrics.requests,
    });
  }
}

/**
 * CDN fallback configuration
 */
export const CDN_FALLBACK = {
  enabled: true,
  timeout: 3000, // 3s
  retries: 2,
  fallbackDomain: process.env.NEXT_PUBLIC_FALLBACK_DOMAIN || '',
};

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  basePath: string,
  widths: number[],
  provider: CDNProvider = 'cloudinary'
): string {
  return widths
    .map(width => {
      const url = buildAssetURL(basePath, provider, { w: width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * CDN best practices
 */
export const CDN_BEST_PRACTICES = {
  caching: [
    'Set long cache times for static assets (1 year)',
    'Use versioning/hashing for cache busting',
    'Implement stale-while-revalidate for dynamic content',
    'Use CDN-Cache-Control for edge-specific rules',
  ],
  
  optimization: [
    'Enable automatic format conversion (WebP/AVIF)',
    'Enable automatic compression (Brotli/Gzip)',
    'Use responsive images with srcset',
    'Implement lazy loading for below-fold assets',
  ],
  
  security: [
    'Use HTTPS only',
    'Implement SRI for third-party scripts',
    'Set proper CORS headers',
    'Enable security headers (CSP, X-Frame-Options)',
  ],
  
  monitoring: [
    'Track cache hit rates',
    'Monitor CDN latency by region',
    'Set up alerts for cache purge failures',
    'Track bandwidth usage',
  ],
};

/**
 * Export all
 */
const cdnConfig = {
  CDN_CONFIGS,
  FONT_PRELOAD_CONFIG,
  RESOURCE_HINTS,
  ASSET_OPTIMIZATION_RULES,
  SERVICE_WORKER_CACHE_STRATEGY,
  CDN_FALLBACK,
  buildAssetURL,
  buildResponsiveImageURLs,
  versionAsset,
  generateIntegrity,
  purgeCDNCache,
  generateAssetManifest,
  generateSrcSet,
  trackCDNPerformance,
  CDN_BEST_PRACTICES,
};

export default cdnConfig;
