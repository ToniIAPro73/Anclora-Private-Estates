/**
 * Code Splitting & Bundle Optimization System
 * Sistema de optimización de bundles y división de código
 * 
 * @module bundle-optimization
 */

import { lazy, createElement, type ComponentType, type ReactNode } from 'react';

/**
 * Bundle size targets
 */
export const BUNDLE_SIZE_TARGETS = {
  // Main bundle (critical path)
  main: {
    target: 100 * 1024,      // 100KB
    warning: 150 * 1024,     // 150KB
    error: 200 * 1024,       // 200KB
  },
  
  // Route bundles
  route: {
    target: 50 * 1024,       // 50KB
    warning: 100 * 1024,     // 100KB
    error: 150 * 1024,       // 150KB
  },
  
  // Vendor bundles
  vendor: {
    target: 150 * 1024,      // 150KB
    warning: 250 * 1024,     // 250KB
    error: 350 * 1024,       // 350KB
  },
  
  // Total initial load
  initial: {
    target: 300 * 1024,      // 300KB
    warning: 500 * 1024,     // 500KB
    error: 700 * 1024,       // 700KB
  },
};

/**
 * Lazy load component with error boundary
 */
export function lazyLoadComponent<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return {
    Component: LazyComponent,
    fallback: fallback || null,
  };
}

/**
 * Preload component for faster subsequent loads
 */
export function preloadComponent(
  importFunc: () => Promise<{ default: ComponentType<unknown> }>
): void {
  // Start loading the component
  importFunc();
}

/**
 * Dynamic imports for heavy components
 */
export const DynamicComponents = {
  // Property Map (heavy: Mapbox GL)
  PropertyMap: () => lazyLoadComponent(
    () => import('@/components/property/PropertyMap'),
    createElement('div', { className: 'h-96 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Property Gallery (heavy: image viewer)
  PropertyGallery: () => lazyLoadComponent(
    () => import('@/components/property/PropertyGallery'),
    createElement('div', { className: 'h-96 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Contact Form (heavy: validation)
  ContactForm: () => lazyLoadComponent(
    () => import('@/components/forms/ContactForm'),
    createElement('div', { className: 'h-64 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Virtual Tour (heavy: 360 viewer)
  VirtualTour: () => lazyLoadComponent(
    () => import('@/components/property/VirtualTour'),
    createElement('div', { className: 'h-96 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Mortgage Calculator (heavy: calculations)
  MortgageCalculator: () => lazyLoadComponent(
    () => import('@/components/calculators/MortgageCalculator'),
    createElement('div', { className: 'h-80 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Search Filters (heavy: UI components)
  SearchFilters: () => lazyLoadComponent(
    () => import('@/components/search/SearchFilters'),
    createElement('div', { className: 'h-64 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Blog Editor (heavy: rich text editor)
  BlogEditor: () => lazyLoadComponent(
    () => import('@/components/blog/BlogEditor'),
    createElement('div', { className: 'h-96 bg-gray-100 animate-pulse rounded-lg' })
  ),
  
  // Analytics Dashboard (heavy: charts)
  AnalyticsDashboard: () => lazyLoadComponent(
    () => import('@/components/analytics/Dashboard'),
    createElement('div', { className: 'h-screen bg-gray-100 animate-pulse' })
  ),
};

/**
 * Route-based code splitting configuration
 */
export const ROUTE_CHUNKS = {
  // Public routes
  home: {
    path: '/',
    priority: 'high',
    preload: true,
  },
  properties: {
    path: '/propiedades',
    priority: 'high',
    preload: true,
  },
  propertyDetail: {
    path: '/propiedades/[id]',
    priority: 'medium',
    preload: false,
  },
  
  // Content routes
  blog: {
    path: '/blog',
    priority: 'medium',
    preload: false,
  },
  blogPost: {
    path: '/blog/[slug]',
    priority: 'low',
    preload: false,
  },
  guides: {
    path: '/guias',
    priority: 'medium',
    preload: false,
  },
  
  // Utility routes
  contact: {
    path: '/contacto',
    priority: 'high',
    preload: true,
  },
  about: {
    path: '/nosotros',
    priority: 'low',
    preload: false,
  },
  
  // Admin routes (heavy, always lazy)
  admin: {
    path: '/admin',
    priority: 'low',
    preload: false,
  },
};

/**
 * Vendor chunk optimization
 */
export const VENDOR_CHUNKS = {
  // React core (always needed)
  react: {
    packages: ['react', 'react-dom'],
    priority: 'critical',
    cache: 'immutable',
  },
  
  // UI frameworks
  ui: {
    packages: ['@headlessui/react', 'framer-motion'],
    priority: 'high',
    cache: 'long-term',
  },
  
  // Forms and validation
  forms: {
    packages: ['react-hook-form', 'zod'],
    priority: 'medium',
    cache: 'long-term',
  },
  
  // Maps (heavy, lazy load)
  maps: {
    packages: ['mapbox-gl', 'react-map-gl'],
    priority: 'low',
    cache: 'long-term',
  },
  
  // Analytics
  analytics: {
    packages: ['@vercel/analytics'],
    priority: 'low',
    cache: 'long-term',
  },
};

/**
 * Tree shaking configuration
 */
export const TREE_SHAKING_CONFIG = {
  // Lodash - use specific imports
  lodash: {
    incorrect: "import _ from 'lodash'",
    correct: "import debounce from 'lodash/debounce'",
    savings: '~70KB',
  },
  
  // Date-fns - use specific imports
  dateFns: {
    incorrect: "import * as dateFns from 'date-fns'",
    correct: "import { format, parseISO } from 'date-fns'",
    savings: '~50KB',
  },
  
  // Icons - use specific imports
  icons: {
    incorrect: "import * as Icons from '@heroicons/react/24/outline'",
    correct: "import { HomeIcon, SearchIcon } from '@heroicons/react/24/outline'",
    savings: '~100KB',
  },
};

/**
 * Bundle analyzer configuration
 */
export const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  analyzerMode: 'static' as const,
  reportFilename: 'bundle-report.html',
  defaultSizes: 'gzip' as const,
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
};

/**
 * Webpack optimization configuration
 */
export const webpackOptimization = {
  splitChunks: {
    chunks: 'all' as const,
    cacheGroups: {
      // Vendor chunk
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        priority: 10,
        reuseExistingChunk: true,
      },
      
      // React chunk
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        priority: 20,
        reuseExistingChunk: true,
      },
      
      // UI chunk
      ui: {
        test: /[\\/]node_modules[\\/](@headlessui|framer-motion)[\\/]/,
        name: 'ui',
        priority: 15,
        reuseExistingChunk: true,
      },
      
      // Common chunk
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
        name: 'common',
      },
    },
  },
  
  minimize: true,
  minimizer: [
    // TerserPlugin configuration
    {
      terserOptions: {
        parse: {
          ecma: 2020,
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
          drop_console: process.env.NODE_ENV === 'production',
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
    },
  ],
};

/**
 * Module concatenation (scope hoisting)
 */
export const moduleConcatenation = {
  enabled: true,
  bailouts: [
    // Check for CommonJS usage
    'Module is not an ECMAScript module',
    // Check for dynamic imports
    'Module exports are unknown',
  ],
};

/**
 * Dead code elimination
 */
export const deadCodeElimination = {
  // Remove unused CSS
  purgeCss: {
    enabled: true,
    content: [
      './app/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
    safelist: [
      // Keep dynamic classes
      /^bg-/,
      /^text-/,
      /^border-/,
      // Keep third-party classes
      'mapboxgl-*',
    ],
  },
  
  // Remove unused JavaScript
  treeShaking: {
    enabled: true,
    sideEffects: false,
  },
};

/**
 * Compression configuration
 */
export const compressionConfig = {
  // Gzip compression
  gzip: {
    enabled: true,
    threshold: 10240, // 10KB
    level: 9,
    memLevel: 8,
  },
  
  // Brotli compression
  brotli: {
    enabled: true,
    threshold: 10240, // 10KB
    quality: 11,
  },
};

/**
 * Calculate bundle size
 */
export function calculateBundleSize(
  files: Array<{ name: string; size: number }>
): {
  total: number;
  byType: Record<string, number>;
  oversized: Array<{ name: string; size: number; limit: number }>;
} {
  const byType: Record<string, number> = {
    js: 0,
    css: 0,
    other: 0,
  };
  
  const oversized: Array<{ name: string; size: number; limit: number }> = [];
  let total = 0;
  
  files.forEach(file => {
    total += file.size;
    
    // Categorize by type
    if (file.name.endsWith('.js')) {
      byType.js += file.size;
      
      // Check against limits
      const limit = file.name.includes('vendor')
        ? BUNDLE_SIZE_TARGETS.vendor.warning
        : BUNDLE_SIZE_TARGETS.route.warning;
      
      if (file.size > limit) {
        oversized.push({ name: file.name, size: file.size, limit });
      }
    } else if (file.name.endsWith('.css')) {
      byType.css += file.size;
    } else {
      byType.other += file.size;
    }
  });
  
  return { total, byType, oversized };
}

/**
 * Performance budget validation
 */
export function validatePerformanceBudget(
  bundleSize: ReturnType<typeof calculateBundleSize>
): {
  passed: boolean;
  violations: string[];
  score: number;
} {
  const violations: string[] = [];
  
  // Check total size
  if (bundleSize.total > BUNDLE_SIZE_TARGETS.initial.error) {
    violations.push(
      `Total bundle exceeds error threshold: ${Math.round(bundleSize.total / 1024)}KB > ${BUNDLE_SIZE_TARGETS.initial.error / 1024}KB`
    );
  } else if (bundleSize.total > BUNDLE_SIZE_TARGETS.initial.warning) {
    violations.push(
      `Total bundle exceeds warning threshold: ${Math.round(bundleSize.total / 1024)}KB > ${BUNDLE_SIZE_TARGETS.initial.warning / 1024}KB`
    );
  }
  
  // Check JavaScript size
  if (bundleSize.byType.js > BUNDLE_SIZE_TARGETS.vendor.error) {
    violations.push(
      `JavaScript bundle too large: ${Math.round(bundleSize.byType.js / 1024)}KB`
    );
  }
  
  // Check individual oversized files
  bundleSize.oversized.forEach(file => {
    violations.push(
      `Oversized file: ${file.name} (${Math.round(file.size / 1024)}KB > ${Math.round(file.limit / 1024)}KB)`
    );
  });
  
  // Calculate score
  const targetTotal = BUNDLE_SIZE_TARGETS.initial.target;
  const actualTotal = bundleSize.total;
  const score = Math.max(0, 100 - ((actualTotal - targetTotal) / targetTotal) * 100);
  
  return {
    passed: violations.length === 0,
    violations,
    score: Math.round(score),
  };
}

/**
 * Bundle optimization recommendations
 */
export const BUNDLE_OPTIMIZATION_TIPS = {
  splitting: [
    'Use dynamic imports for heavy components',
    'Split routes into separate chunks',
    'Defer non-critical third-party scripts',
    'Use Next.js automatic code splitting',
  ],
  
  reduction: [
    'Remove unused dependencies',
    'Use tree-shakeable imports',
    'Replace heavy libraries with lighter alternatives',
    'Use bundle analyzer to identify large modules',
  ],
  
  caching: [
    'Use contenthash for long-term caching',
    'Split vendor code into separate chunk',
    'Keep vendor chunk stable between deploys',
    'Use runtime chunk for webpack runtime',
  ],
  
  compression: [
    'Enable Gzip compression',
    'Enable Brotli compression (better than Gzip)',
    'Minify JavaScript and CSS',
    'Remove source maps in production',
  ],
};

/**
 * Export all
 */
const bundleOptimization = {
  BUNDLE_SIZE_TARGETS,
  ROUTE_CHUNKS,
  VENDOR_CHUNKS,
  TREE_SHAKING_CONFIG,
  lazyLoadComponent,
  preloadComponent,
  DynamicComponents,
  bundleAnalyzerConfig,
  webpackOptimization,
  moduleConcatenation,
  deadCodeElimination,
  compressionConfig,
  calculateBundleSize,
  validatePerformanceBudget,
  BUNDLE_OPTIMIZATION_TIPS,
};

export default bundleOptimization;
