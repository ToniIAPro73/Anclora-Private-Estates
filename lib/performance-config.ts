/**
 * Performance Configuration & Monitoring
 * Configuración general de performance y sistema de monitoreo integrado
 * 
 * @module performance-config
 */

import type { MetricType, MetricValue } from './core-web-vitals';
import { PERFORMANCE_BUDGET, reportWebVitals } from './core-web-vitals';
import { CACHE_STRATEGIES } from './caching-strategies';
import { BUNDLE_SIZE_TARGETS } from './bundle-optimization';
import { IMAGE_SIZES } from './image-optimization';

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    reportEndpoint: string;
  };
  vitals: {
    thresholds: typeof PERFORMANCE_BUDGET.vitals;
    tracking: MetricType[];
  };
  resources: {
    budgets: typeof PERFORMANCE_BUDGET.resources;
    compression: boolean;
  };
  caching: {
    enabled: boolean;
    strategies: typeof CACHE_STRATEGIES;
  };
  optimization: {
    images: boolean;
    fonts: boolean;
    scripts: boolean;
    styles: boolean;
  };
}

/**
 * Default performance configuration
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% of users
    reportEndpoint: '/api/analytics/performance',
  },
  
  vitals: {
    thresholds: PERFORMANCE_BUDGET.vitals,
    tracking: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'],
  },
  
  resources: {
    budgets: PERFORMANCE_BUDGET.resources,
    compression: true,
  },
  
  caching: {
    enabled: true,
    strategies: CACHE_STRATEGIES,
  },
  
  optimization: {
    images: true,
    fonts: true,
    scripts: true,
    styles: true,
  },
};

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Map<string, MetricValue> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  
  constructor(config: PerformanceConfig = DEFAULT_PERFORMANCE_CONFIG) {
    this.config = config;
  }
  
  /**
   * Initialize monitoring
   */
  init(): void {
    if (typeof window === 'undefined' || !this.config.monitoring.enabled) {
      return;
    }
    
    // Check sample rate
    if (Math.random() > this.config.monitoring.sampleRate) {
      return;
    }
    
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    this.setupNavigationMonitoring();
  }
  
  /**
   * Setup Core Web Vitals monitoring
   */
  private setupWebVitalsMonitoring(): void {
    // Use web-vitals library
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.config.vitals.tracking.forEach(metric => {
        this.observeMetric(metric);
      });
    }
  }
  
  /**
   * Observe specific metric
   */
  private observeMetric(metricName: MetricType): void {
    const entryTypes: Record<MetricType, string> = {
      LCP: 'largest-contentful-paint',
      FID: 'first-input',
      CLS: 'layout-shift',
      FCP: 'paint',
      TTFB: 'navigation',
      INP: 'event',
    };
    
    const entryType = entryTypes[metricName];
    if (!entryType) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processMetricEntry(metricName, entry);
        }
      });
      
      observer.observe({ type: entryType, buffered: true });
      this.observers.set(metricName, observer);
    } catch (error) {
      console.warn(`Failed to observe ${metricName}:`, error);
    }
  }
  
  /**
   * Process metric entry
   */
  private processMetricEntry(
    metricName: MetricType,
    entry: PerformanceEntry
  ): void {
    // Esta es una implementación simplificada
    // En producción usarías web-vitals library
    const value: MetricValue = {
      name: metricName,
      value: entry.startTime,
      rating: 'good',
      delta: 0,
      id: entry.name,
    };
    
    this.recordMetric(value);
  }
  
  /**
   * Setup resource monitoring
   */
  private setupResourceMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.analyzeResource(entry as PerformanceResourceTiming);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', observer);
  }
  
  /**
   * Analyze resource performance
   */
  private analyzeResource(entry: PerformanceResourceTiming): void {
    const { name, duration, transferSize, decodedBodySize } = entry;
    
    // Check against budgets
    const budgets = this.config.resources.budgets;
    
    // Warn on large resources
    if (transferSize > 500 * 1024) {
      console.warn(
        `[Performance] Large resource: ${name}`,
        `Size: ${Math.round(transferSize / 1024)}KB`,
        `Duration: ${Math.round(duration)}ms`
      );
    }
    
    // Track compression ratio
    if (transferSize > 0 && decodedBodySize > 0) {
      const compressionRatio = transferSize / decodedBodySize;
      if (compressionRatio > 0.9) {
        console.warn(
          `[Performance] Poor compression: ${name}`,
          `Ratio: ${Math.round(compressionRatio * 100)}%`
        );
      }
    }
  }
  
  /**
   * Setup navigation monitoring
   */
  private setupNavigationMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          this.analyzeNavigation(entry as PerformanceNavigationTiming);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('navigation', observer);
  }
  
  /**
   * Analyze navigation timing
   */
  private analyzeNavigation(entry: PerformanceNavigationTiming): void {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      ttfb: entry.responseStart - entry.requestStart,
      download: entry.responseEnd - entry.responseStart,
      domParsing: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      total: entry.loadEventEnd - entry.fetchStart,
    };
    
    console.log('[Performance] Navigation metrics:', metrics);
    
    // Report slow navigation
    if (metrics.total > 3000) {
      this.reportIssue('slow-navigation', {
        url: window.location.pathname,
        metrics,
      });
    }
  }
  
  /**
   * Record metric
   */
  recordMetric(metric: MetricValue): void {
    this.metrics.set(metric.name, metric);
    
    // Report to analytics
    reportWebVitals(metric);
    
    // Send to backend
    this.sendMetric(metric);
  }
  
  /**
   * Send metric to backend
   */
  private async sendMetric(metric: MetricValue): Promise<void> {
    if (!this.config.monitoring.enabled) return;
    
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      url: window.location.pathname,
      timestamp: Date.now(),
    });
    
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.config.monitoring.reportEndpoint, body);
      } else {
        await fetch(this.config.monitoring.reportEndpoint, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });
      }
    } catch (error) {
      console.error('[Performance] Failed to send metric:', error);
    }
  }
  
  /**
   * Report performance issue
   */
  private reportIssue(type: string, data: any): void {
    console.warn(`[Performance] Issue detected: ${type}`, data);
    
    // Send to error tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_issue', {
        issue_type: type,
        ...data,
      });
    }
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): Map<string, MetricValue> {
    return new Map(this.metrics);
  }
  
  /**
   * Generate performance report
   */
  generateReport(): {
    metrics: Record<string, MetricValue>;
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: string[];
  } {
    const metricsObj: Record<string, MetricValue> = {};
    this.metrics.forEach((value, key) => {
      metricsObj[key] = value;
    });
    
    // Calculate score
    const scores = Array.from(this.metrics.values()).map(m => {
      if (m.rating === 'good') return 100;
      if (m.rating === 'needs-improvement') return 50;
      return 0;
    });
    
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
    
    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (avgScore >= 90) grade = 'A';
    else if (avgScore >= 80) grade = 'B';
    else if (avgScore >= 70) grade = 'C';
    else if (avgScore >= 60) grade = 'D';
    else grade = 'F';
    
    // Collect issues
    const issues: string[] = [];
    this.metrics.forEach((metric) => {
      if (metric.rating === 'poor') {
        issues.push(`${metric.name} is poor: ${metric.value}ms`);
      }
    });
    
    return {
      metrics: metricsObj,
      score: Math.round(avgScore),
      grade,
      issues,
    };
  }
  
  /**
   * Cleanup
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

/**
 * Performance optimization checklist
 */
export const PERFORMANCE_CHECKLIST = {
  critical: [
    {
      id: 'lcp-optimization',
      title: 'Optimize Largest Contentful Paint',
      description: 'LCP should be under 2.5 seconds',
      priority: 'critical',
      actions: [
        'Optimize server response time',
        'Preload critical images',
        'Use CDN for static assets',
        'Enable compression',
      ],
    },
    {
      id: 'fid-optimization',
      title: 'Optimize First Input Delay',
      description: 'FID should be under 100ms',
      priority: 'critical',
      actions: [
        'Break up long tasks',
        'Use code splitting',
        'Defer non-critical JavaScript',
        'Use web workers',
      ],
    },
    {
      id: 'cls-optimization',
      title: 'Optimize Cumulative Layout Shift',
      description: 'CLS should be under 0.1',
      priority: 'critical',
      actions: [
        'Set image dimensions',
        'Reserve space for ads',
        'Use font-display: swap',
        'Avoid inserting content dynamically',
      ],
    },
  ],
  
  high: [
    {
      id: 'image-optimization',
      title: 'Optimize Images',
      priority: 'high',
      actions: [
        'Use WebP/AVIF formats',
        'Implement lazy loading',
        'Use responsive images',
        'Compress images',
      ],
    },
    {
      id: 'caching-strategy',
      title: 'Implement Caching',
      priority: 'high',
      actions: [
        'Set proper Cache-Control headers',
        'Use CDN caching',
        'Implement service worker',
        'Cache API responses',
      ],
    },
  ],
  
  medium: [
    {
      id: 'bundle-optimization',
      title: 'Optimize JavaScript Bundles',
      priority: 'medium',
      actions: [
        'Remove unused code',
        'Use tree shaking',
        'Split vendor bundles',
        'Minify JavaScript',
      ],
    },
    {
      id: 'font-optimization',
      title: 'Optimize Fonts',
      priority: 'medium',
      actions: [
        'Use variable fonts',
        'Preload critical fonts',
        'Use font-display: swap',
        'Subset fonts',
      ],
    },
  ],
};

/**
 * Create global performance monitor
 */
let globalMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitoring(
  config?: Partial<PerformanceConfig>
): PerformanceMonitor {
  if (globalMonitor) {
    return globalMonitor;
  }
  
  const finalConfig = {
    ...DEFAULT_PERFORMANCE_CONFIG,
    ...config,
  };
  
  globalMonitor = new PerformanceMonitor(finalConfig);
  globalMonitor.init();
  
  return globalMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return globalMonitor;
}

/**
 * Performance targets for Anclora
 */
export const ANCLORA_PERFORMANCE_TARGETS = {
  // Core Web Vitals
  vitals: {
    LCP: 2000,    // 2s
    FID: 80,      // 80ms
    CLS: 0.08,    // 0.08
    FCP: 1500,    // 1.5s
    TTFB: 600,    // 600ms
    INP: 150,     // 150ms
  },
  
  // Page load times
  loadTimes: {
    home: 2000,           // 2s
    properties: 2500,     // 2.5s
    propertyDetail: 2000, // 2s
    blog: 2500,           // 2.5s
    contact: 1500,        // 1.5s
  },
  
  // Bundle sizes (gzipped)
  bundles: {
    main: 80 * 1024,      // 80KB
    vendor: 120 * 1024,   // 120KB
    route: 40 * 1024,     // 40KB
    total: 250 * 1024,    // 250KB
  },
  
  // Resource counts
  resources: {
    maxRequests: 40,
    maxImages: 12,
    maxScripts: 8,
    maxStyles: 4,
  },
};

/**
 * Export all
 */
export default {
  DEFAULT_PERFORMANCE_CONFIG,
  ANCLORA_PERFORMANCE_TARGETS,
  PERFORMANCE_CHECKLIST,
  PerformanceMonitor,
  initPerformanceMonitoring,
  getPerformanceMonitor,
};
