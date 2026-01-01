/**
 * Caching Strategies System
 * Sistema de estrategias de caché para Next.js 15
 * 
 * @module caching-strategies
 */

/**
 * Cache strategy types
 */
export type CacheStrategy =
  | 'no-cache'
  | 'force-cache'
  | 'stale-while-revalidate'
  | 'cache-first'
  | 'network-first';

/**
 * Cache configuration
 */
export interface CacheConfig {
  strategy: CacheStrategy;
  revalidate?: number; // seconds
  tags?: string[];
  maxAge?: number; // seconds
}

/**
 * Predefined cache strategies for different content types
 */
export const CACHE_STRATEGIES: Record<string, CacheConfig> = {
  // Static content (rarely changes)
  static: {
    strategy: 'force-cache',
    revalidate: 60 * 60 * 24 * 365, // 1 year
    maxAge: 60 * 60 * 24 * 365,
  },
  
  // Property listings (changes daily)
  properties: {
    strategy: 'stale-while-revalidate',
    revalidate: 60 * 60, // 1 hour
    tags: ['properties'],
    maxAge: 60 * 60 * 24, // 1 day
  },
  
  // Property details (changes occasionally)
  propertyDetails: {
    strategy: 'stale-while-revalidate',
    revalidate: 60 * 60 * 4, // 4 hours
    tags: ['property-details'],
    maxAge: 60 * 60 * 24, // 1 day
  },
  
  // Blog posts (static after publish)
  blogPost: {
    strategy: 'cache-first',
    revalidate: 60 * 60 * 24, // 1 day
    tags: ['blog'],
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  
  // Blog listing (changes on new posts)
  blogListing: {
    strategy: 'stale-while-revalidate',
    revalidate: 60 * 60, // 1 hour
    tags: ['blog-listing'],
    maxAge: 60 * 60 * 4, // 4 hours
  },
  
  // API data (frequently changes)
  api: {
    strategy: 'network-first',
    revalidate: 60, // 1 minute
    maxAge: 60 * 5, // 5 minutes
  },
  
  // User-specific data (don't cache)
  userSpecific: {
    strategy: 'no-cache',
  },
  
  // Search results (cache briefly)
  search: {
    strategy: 'stale-while-revalidate',
    revalidate: 60 * 5, // 5 minutes
    tags: ['search'],
    maxAge: 60 * 30, // 30 minutes
  },
  
  // Images
  images: {
    strategy: 'force-cache',
    revalidate: 60 * 60 * 24 * 30, // 30 days
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Fonts
  fonts: {
    strategy: 'force-cache',
    revalidate: 60 * 60 * 24 * 365, // 1 year
    maxAge: 60 * 60 * 24 * 365,
  },
};

/**
 * Generate Cache-Control header
 */
export function generateCacheControlHeader(config: CacheConfig): string {
  const directives: string[] = [];
  
  switch (config.strategy) {
    case 'no-cache':
      directives.push('no-cache', 'no-store', 'must-revalidate');
      break;
    
    case 'force-cache':
      directives.push('public');
      if (config.maxAge) {
        directives.push(`max-age=${config.maxAge}`);
        directives.push('immutable');
      }
      break;
    
    case 'stale-while-revalidate':
      directives.push('public');
      if (config.maxAge) {
        directives.push(`max-age=${config.maxAge}`);
      }
      if (config.revalidate) {
        directives.push(`stale-while-revalidate=${config.revalidate}`);
      }
      break;
    
    case 'cache-first':
      directives.push('public');
      if (config.maxAge) {
        directives.push(`max-age=${config.maxAge}`);
      }
      break;
    
    case 'network-first':
      directives.push('public');
      if (config.maxAge) {
        directives.push(`max-age=${config.maxAge}`);
      }
      directives.push('must-revalidate');
      break;
  }
  
  return directives.join(', ');
}

/**
 * Next.js fetch options with caching
 */
export function getFetchOptions(
  cacheType: keyof typeof CACHE_STRATEGIES,
  options?: RequestInit
): RequestInit {
  const config = CACHE_STRATEGIES[cacheType];
  
  return {
    ...options,
    next: {
      revalidate: config.revalidate,
      tags: config.tags,
    },
  };
}

/**
 * Revalidate cache by tag
 */
export async function revalidateByTag(tag: string): Promise<void> {
  if (typeof fetch === 'undefined') return;
  
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ tag }),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to revalidate cache:', error);
  }
}

/**
 * Revalidate cache by path
 */
export async function revalidateByPath(path: string): Promise<void> {
  if (typeof fetch === 'undefined') return;
  
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ path }),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to revalidate cache:', error);
  }
}

/**
 * Cache key generation
 */
export function generateCacheKey(
  base: string,
  params?: Record<string, any>
): string {
  if (!params) return base;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${base}?${sortedParams}`;
}

/**
 * Service Worker caching strategies
 */
export const SERVICE_WORKER_STRATEGIES = {
  // Cache-first for static assets
  static: `
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image' || 
      event.request.destination === 'font' ||
      event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('static-v1').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
  `,
  
  // Network-first for API calls
  api: `
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
  `,
  
  // Stale-while-revalidate for pages
  pages: `
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((fetchResponse) => {
          return caches.open('pages-v1').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
        return response || fetchPromise;
      })
    );
  }
});
  `,
};

/**
 * CDN caching configuration
 */
export const CDN_CACHE_CONFIG = {
  // Cloudflare
  cloudflare: {
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'max-age=31536000',
    },
    dynamic: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'max-age=3600',
    },
    api: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      'CDN-Cache-Control': 'max-age=60',
    },
  },
  
  // Vercel
  vercel: {
    static: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'x-vercel-cache': 'HIT',
    },
    dynamic: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'x-vercel-cache': 'STALE',
    },
    api: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  },
};

/**
 * Browser cache management
 */
export class BrowserCache {
  private cacheName: string;
  
  constructor(cacheName: string = 'anclora-cache-v1') {
    this.cacheName = cacheName;
  }
  
  async get<T>(key: string): Promise<T | null> {
    if (typeof caches === 'undefined') return null;
    
    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(key);
      
      if (!response) return null;
      
      return await response.json();
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (typeof caches === 'undefined') return;
    
    try {
      const cache = await caches.open(this.cacheName);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (ttl) {
        const expiresAt = new Date(Date.now() + ttl * 1000);
        headers['Expires'] = expiresAt.toUTCString();
      }
      
      const response = new Response(JSON.stringify(value), { headers });
      await cache.put(key, response);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  async delete(key: string): Promise<void> {
    if (typeof caches === 'undefined') return;
    
    try {
      const cache = await caches.open(this.cacheName);
      await cache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  async clear(): Promise<void> {
    if (typeof caches === 'undefined') return;
    
    try {
      await caches.delete(this.cacheName);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

/**
 * Memory cache (for runtime caching)
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; expires: number }>;
  
  constructor() {
    this.cache = new Map();
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  set(key: string, value: T, ttl: number = 300): void {
    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expires });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
  
  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Cache warming (preload critical content)
 */
export async function warmCache(urls: string[]): Promise<void> {
  if (typeof caches === 'undefined') return;
  
  try {
    const cache = await caches.open('warm-cache-v1');
    await Promise.all(
      urls.map(url => 
        fetch(url)
          .then(response => cache.put(url, response))
          .catch(console.error)
      )
    );
  } catch (error) {
    console.error('Cache warming error:', error);
  }
}

/**
 * Critical URLs to warm on load
 */
export const CRITICAL_URLS = [
  '/',
  '/propiedades',
  '/contacto',
  '/api/properties?limit=10',
];

/**
 * Cache best practices
 */
export const CACHE_BEST_PRACTICES = {
  static: {
    duration: '1 year',
    strategy: 'Cache-first with immutable',
    example: 'Images, fonts, compiled JS/CSS',
  },
  
  dynamic: {
    duration: '1 hour - 1 day',
    strategy: 'Stale-while-revalidate',
    example: 'Property listings, blog posts',
  },
  
  api: {
    duration: '1-5 minutes',
    strategy: 'Network-first',
    example: 'Real-time data, user-specific content',
  },
  
  cdn: {
    duration: 'Same as origin + edge caching',
    strategy: 'Multi-tier caching',
    example: 'All public content through CDN',
  },
};

/**
 * Export all
 */
export default {
  CACHE_STRATEGIES,
  CDN_CACHE_CONFIG,
  SERVICE_WORKER_STRATEGIES,
  CRITICAL_URLS,
  generateCacheControlHeader,
  getFetchOptions,
  revalidateByTag,
  revalidateByPath,
  generateCacheKey,
  warmCache,
  BrowserCache,
  MemoryCache,
  CACHE_BEST_PRACTICES,
};
