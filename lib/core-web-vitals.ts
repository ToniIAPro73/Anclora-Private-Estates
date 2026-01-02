/**
 * Core Web Vitals Monitoring System
 * Sistema de monitoreo y optimización de métricas de rendimiento
 * 
 * @module core-web-vitals
 */

/**
 * Core Web Vitals metric types
 */
export type MetricType = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';

/**
 * Metric rating thresholds
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Metric value interface
 */
export interface MetricValue {
  name: MetricType;
  value: number;
  rating: MetricRating;
  delta: number;
  id: string;
  navigationType?: string;
}

/**
 * Performance thresholds for each metric
 */
export const METRIC_THRESHOLDS: Record<
  MetricType,
  { good: number; needsImprovement: number }
> = {
  // Largest Contentful Paint (ms)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  
  // First Input Delay (ms)
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  
  // Cumulative Layout Shift (score)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  
  // First Contentful Paint (ms)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  
  // Time to First Byte (ms)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  
  // Interaction to Next Paint (ms)
  INP: {
    good: 200,
    needsImprovement: 500,
  },
};

/**
 * Get metric rating based on value
 */
export function getMetricRating(
  metric: MetricType,
  value: number
): MetricRating {
  const thresholds = METRIC_THRESHOLDS[metric];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: MetricValue): void {
  // Send to analytics endpoint
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
  
  // Send to custom analytics
  sendToAnalytics(metric);
}

/**
 * Send metric to custom analytics endpoint
 */
function sendToAnalytics(metric: MetricValue): void {
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
    timestamp: Date.now(),
  });
  
  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', body);
  } else {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(console.error);
  }
}

/**
 * Performance budget configuration
 */
export const PERFORMANCE_BUDGET = {
  // Core Web Vitals targets
  vitals: {
    LCP: 2500,  // 2.5s
    FID: 100,   // 100ms
    CLS: 0.1,   // 0.1
    FCP: 1800,  // 1.8s
    TTFB: 800,  // 800ms
    INP: 200,   // 200ms
  },
  
  // Resource budgets
  resources: {
    totalPageSize: 1024 * 1024,      // 1MB
    totalImageSize: 512 * 1024,      // 512KB
    totalJSSize: 256 * 1024,         // 256KB
    totalCSSSize: 64 * 1024,         // 64KB
    totalFontSize: 128 * 1024,       // 128KB
  },
  
  // Request budgets
  requests: {
    maxRequests: 50,
    maxImageRequests: 15,
    maxJSRequests: 10,
    maxCSSRequests: 5,
    maxFontRequests: 5,
  },
  
  // Timing budgets
  timing: {
    domContentLoaded: 2000,  // 2s
    loadComplete: 3000,      // 3s
    firstPaint: 1000,        // 1s
  },
};

/**
 * Check if performance budget is met
 */
export function checkPerformanceBudget(
  metrics: Partial<Record<MetricType, number>>
): {
  passed: boolean;
  violations: Array<{ metric: string; actual: number; budget: number }>;
  score: number;
} {
  const violations: Array<{ metric: string; actual: number; budget: number }> = [];
  let totalChecks = 0;
  let passedChecks = 0;
  
  Object.entries(metrics).forEach(([metricName, value]) => {
    totalChecks++;
    const budget = PERFORMANCE_BUDGET.vitals[metricName as MetricType];
    
    if (budget && value > budget) {
      violations.push({
        metric: metricName,
        actual: value,
        budget,
      });
    } else {
      passedChecks++;
    }
  });
  
  const score = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
  
  return {
    passed: violations.length === 0,
    violations,
    score: Math.round(score),
  };
}

/**
 * LCP optimization recommendations
 */
export const LCP_OPTIMIZATIONS = {
  serverResponse: [
    'Enable HTTP/2 or HTTP/3',
    'Use CDN for static assets',
    'Optimize server response time (TTFB < 800ms)',
    'Implement caching strategies',
  ],
  
  resources: [
    'Preload critical images with <link rel="preload">',
    'Use responsive images with srcset',
    'Optimize images (WebP/AVIF, compression)',
    'Eliminate render-blocking resources',
  ],
  
  rendering: [
    'Use CSS containment for off-screen content',
    'Avoid large layout shifts',
    'Minimize critical CSS',
    'Defer non-critical CSS',
  ],
};

/**
 * FID/INP optimization recommendations
 */
export const FID_INP_OPTIMIZATIONS = {
  javascript: [
    'Break up long tasks (>50ms)',
    'Use code splitting and lazy loading',
    'Defer non-critical JavaScript',
    'Use web workers for heavy computations',
  ],
  
  interactions: [
    'Debounce input handlers',
    'Use passive event listeners',
    'Optimize event handler logic',
    'Avoid synchronous layouts',
  ],
  
  thirdParty: [
    'Minimize third-party scripts',
    'Load third-party scripts asynchronously',
    'Use facade patterns for embeds',
    'Self-host critical third-party code',
  ],
};

/**
 * CLS optimization recommendations
 */
export const CLS_OPTIMIZATIONS = {
  images: [
    'Always include width and height attributes',
    'Use aspect-ratio CSS property',
    'Reserve space for images with placeholder',
    'Avoid images above the fold without dimensions',
  ],
  
  content: [
    'Reserve space for dynamic content',
    'Avoid inserting content above existing content',
    'Use transform animations instead of layout properties',
    'Preload fonts to avoid FOIT/FOUT',
  ],
  
  ads: [
    'Reserve space for ad slots',
    'Avoid placing ads near the top of viewport',
    'Size ad containers properly',
    'Use sticky positioning carefully',
  ],
};

/**
 * Generate performance report
 */
export interface PerformanceReport {
  timestamp: Date;
  url: string;
  metrics: Partial<Record<MetricType, MetricValue>>;
  budget: ReturnType<typeof checkPerformanceBudget>;
  recommendations: string[];
  score: number;
}

/**
 * Create performance report
 */
export function createPerformanceReport(
  metrics: Partial<Record<MetricType, MetricValue>>
): PerformanceReport {
  const metricValues: Partial<Record<MetricType, number>> = {};
  Object.entries(metrics).forEach(([key, value]) => {
    metricValues[key as MetricType] = value.value;
  });
  
  const budget = checkPerformanceBudget(metricValues);
  const recommendations = generateRecommendations(metrics);
  
  // Calculate overall score (0-100)
  const scores = Object.values(metrics).map(m => {
    if (m.rating === 'good') return 100;
    if (m.rating === 'needs-improvement') return 50;
    return 0;
  });
  const avgScore = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  
  return {
    timestamp: new Date(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    metrics,
    budget,
    recommendations,
    score: Math.round(avgScore),
  };
}

/**
 * Generate recommendations based on metrics
 */
function generateRecommendations(
  metrics: Partial<Record<MetricType, MetricValue>>
): string[] {
  const recommendations: string[] = [];
  
  Object.entries(metrics).forEach(([metricName, metric]) => {
    if (metric.rating === 'poor' || metric.rating === 'needs-improvement') {
      switch (metricName as MetricType) {
        case 'LCP':
          recommendations.push(
            'Optimize Largest Contentful Paint:',
            ...LCP_OPTIMIZATIONS.serverResponse.slice(0, 2),
            ...LCP_OPTIMIZATIONS.resources.slice(0, 2)
          );
          break;
        
        case 'FID':
        case 'INP':
          recommendations.push(
            'Optimize Input Responsiveness:',
            ...FID_INP_OPTIMIZATIONS.javascript.slice(0, 2),
            ...FID_INP_OPTIMIZATIONS.interactions.slice(0, 2)
          );
          break;
        
        case 'CLS':
          recommendations.push(
            'Optimize Cumulative Layout Shift:',
            ...CLS_OPTIMIZATIONS.images.slice(0, 2),
            ...CLS_OPTIMIZATIONS.content.slice(0, 2)
          );
          break;
        
        case 'FCP':
          recommendations.push(
            'Optimize First Contentful Paint:',
            'Eliminate render-blocking resources',
            'Minimize critical CSS'
          );
          break;
        
        case 'TTFB':
          recommendations.push(
            'Optimize Time to First Byte:',
            'Use a CDN',
            'Optimize server response time'
          );
          break;
      }
    }
  });
  
  return recommendations;
}

/**
 * Monitor resource loading performance
 */
export function monitorResourcePerformance(): void {
  if (typeof window === 'undefined') return;
  
  // Use PerformanceObserver to monitor resources
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        
        // Check if resource is over budget
        if (resource.transferSize > 100 * 1024) {
          console.warn(
            `[Performance] Large resource detected: ${resource.name}`,
            `Size: ${Math.round(resource.transferSize / 1024)}KB`
          );
        }
        
        // Check if resource is slow
        if (resource.duration > 1000) {
          console.warn(
            `[Performance] Slow resource detected: ${resource.name}`,
            `Duration: ${Math.round(resource.duration)}ms`
          );
        }
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

/**
 * Performance monitoring configuration
 */
export const performanceConfig = {
  // Enable monitoring
  enabled: process.env.NODE_ENV === 'production',
  
  // Sample rate (0-1)
  sampleRate: 0.1, // Monitor 10% of sessions
  
  // Report threshold (only report if score below this)
  reportThreshold: 75,
  
  // Metrics to track
  metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'] as MetricType[],
};

/**
 * Export all
 */
const coreWebVitals = {
  METRIC_THRESHOLDS,
  PERFORMANCE_BUDGET,
  getMetricRating,
  reportWebVitals,
  checkPerformanceBudget,
  createPerformanceReport,
  monitorResourcePerformance,
  performanceConfig,
  LCP_OPTIMIZATIONS,
  FID_INP_OPTIMIZATIONS,
  CLS_OPTIMIZATIONS,
};

export default coreWebVitals;
