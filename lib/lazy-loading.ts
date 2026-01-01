/**
 * Advanced Lazy Loading System
 * Sistema avanzado de carga diferida para imágenes, componentes y contenido
 * 
 * @module lazy-loading
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection Observer options
 */
export interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Default lazy load options
 */
export const DEFAULT_LAZY_OPTIONS: LazyLoadOptions = {
  root: null,
  rootMargin: '50px', // Start loading 50px before entering viewport
  threshold: 0.01,
};

/**
 * Aggressive lazy load (load just before entering viewport)
 */
export const AGGRESSIVE_LAZY_OPTIONS: LazyLoadOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

/**
 * Eager lazy load (load well before entering viewport)
 */
export const EAGER_LAZY_OPTIONS: LazyLoadOptions = {
  root: null,
  rootMargin: '200px',
  threshold: 0,
};

/**
 * Custom hook for lazy loading with Intersection Observer
 */
export function useLazyLoad(
  options: LazyLoadOptions = DEFAULT_LAZY_OPTIONS
): [React.RefObject<any>, boolean] {
  const ref = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element || isVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [isVisible, options]);
  
  return [ref, isVisible];
}

/**
 * Lazy load image component props
 */
export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

/**
 * Lazy load image hook
 */
export function useLazyImage(src: string, priority: boolean = false) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    priority ? src : null
  );
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);
  const [ref, isVisible] = useLazyLoad(DEFAULT_LAZY_OPTIONS);
  
  useEffect(() => {
    if (priority || !isVisible || imageSrc) return;
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoading(false);
    };
    
    img.src = src;
  }, [src, isVisible, imageSrc, priority]);
  
  return {
    ref,
    imageSrc,
    isLoading,
    isError,
    isVisible,
  };
}

/**
 * Lazy load video hook
 */
export function useLazyVideo(src: string) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [ref, isVisible] = useLazyLoad(EAGER_LAZY_OPTIONS);
  
  useEffect(() => {
    if (isVisible && !videoSrc) {
      setVideoSrc(src);
    }
  }, [src, isVisible, videoSrc]);
  
  return {
    ref,
    videoSrc,
    isVisible,
  };
}

/**
 * Lazy load iframe hook
 */
export function useLazyIframe(src: string) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [ref, isVisible] = useLazyLoad(DEFAULT_LAZY_OPTIONS);
  
  useEffect(() => {
    if (isVisible && !iframeSrc) {
      setIframeSrc(src);
    }
  }, [src, isVisible, iframeSrc]);
  
  return {
    ref,
    iframeSrc,
    isVisible,
  };
}

/**
 * Lazy load component hook
 */
export function useLazyComponent<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyLoadOptions = DEFAULT_LAZY_OPTIONS
) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ref, isVisible] = useLazyLoad(options);
  
  useEffect(() => {
    if (!isVisible || Component) return;
    
    setIsLoading(true);
    
    importFunc()
      .then(module => {
        setComponent(() => module.default);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [isVisible, Component, importFunc]);
  
  return {
    ref,
    Component,
    isLoading,
    isError,
    isVisible,
  };
}

/**
 * Lazy load script hook
 */
export function useLazyScript(src: string, async: boolean = true) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ref, isVisible] = useLazyLoad(EAGER_LAZY_OPTIONS);
  
  useEffect(() => {
    if (!isVisible || isLoaded) return;
    
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setIsError(true);
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [src, async, isVisible, isLoaded]);
  
  return {
    ref,
    isLoaded,
    isError,
  };
}

/**
 * Preload resources when hovering
 */
export function useHoverPreload(
  importFunc: () => Promise<any>
): React.MouseEventHandler {
  const hasPreloaded = useRef(false);
  
  const handleMouseEnter = useCallback(() => {
    if (!hasPreloaded.current) {
      importFunc();
      hasPreloaded.current = true;
    }
  }, [importFunc]);
  
  return handleMouseEnter;
}

/**
 * Lazy load with timeout fallback
 */
export function useLazyLoadWithTimeout(
  timeout: number = 5000,
  options: LazyLoadOptions = DEFAULT_LAZY_OPTIONS
): [React.RefObject<any>, boolean] {
  const [ref, isVisible] = useLazyLoad(options);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  return [ref, isVisible || shouldLoad];
}

/**
 * Progressive image loading
 */
export interface ProgressiveImageOptions {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  width?: number;
  height?: number;
}

export function useProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
}: Pick<ProgressiveImageOptions, 'lowQualitySrc' | 'highQualitySrc'>) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useLazyLoad(DEFAULT_LAZY_OPTIONS);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsLoading(false);
    };
    
    img.src = highQualitySrc;
  }, [highQualitySrc, isVisible]);
  
  return {
    ref,
    currentSrc,
    isLoading,
    isVisible,
  };
}

/**
 * Lazy load content areas
 */
export const LAZY_CONTENT_AREAS = {
  // Below-fold sections
  belowFold: {
    rootMargin: '100px',
    threshold: 0,
  },
  
  // Footer content
  footer: {
    rootMargin: '200px',
    threshold: 0,
  },
  
  // Modal content
  modal: {
    rootMargin: '0px',
    threshold: 0,
  },
  
  // Gallery items
  gallery: {
    rootMargin: '50px',
    threshold: 0.01,
  },
  
  // Infinite scroll items
  infiniteScroll: {
    rootMargin: '300px',
    threshold: 0,
  },
};

/**
 * Batch lazy loading for multiple items
 */
export function useBatchLazyLoad(
  count: number,
  options: LazyLoadOptions = DEFAULT_LAZY_OPTIONS
) {
  const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
  const observers = useRef<Map<number, IntersectionObserver>>(new Map());
  
  const registerItem = useCallback(
    (index: number, element: Element | null) => {
      if (!element || loadedItems.has(index)) return;
      
      // Clean up existing observer
      const existingObserver = observers.current.get(index);
      if (existingObserver) {
        existingObserver.disconnect();
      }
      
      // Create new observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadedItems(prev => new Set(prev).add(index));
            observer.disconnect();
            observers.current.delete(index);
          }
        },
        options
      );
      
      observer.observe(element);
      observers.current.set(index, observer);
    },
    [loadedItems, options]
  );
  
  useEffect(() => {
    return () => {
      observers.current.forEach(observer => observer.disconnect());
      observers.current.clear();
    };
  }, []);
  
  return {
    registerItem,
    isItemLoaded: (index: number) => loadedItems.has(index),
    loadedCount: loadedItems.size,
  };
}

/**
 * Network-aware lazy loading
 */
export function useNetworkAwareLazyLoad(
  options: LazyLoadOptions = DEFAULT_LAZY_OPTIONS
): [React.RefObject<any>, boolean] {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, isVisible] = useLazyLoad(options);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Check network connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      
      // Only load on fast connections
      if (effectiveType === '4g' || effectiveType === 'wifi') {
        setShouldLoad(true);
      } else {
        // Delay load on slow connections
        const timer = setTimeout(() => setShouldLoad(true), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setShouldLoad(true);
    }
  }, [isVisible]);
  
  return [ref, shouldLoad];
}

/**
 * Priority-based lazy loading queue
 */
export class LazyLoadQueue {
  private queue: Array<{
    id: string;
    priority: number;
    loadFunc: () => Promise<void>;
  }> = [];
  private loading = false;
  private maxConcurrent = 3;
  private currentLoading = 0;
  
  add(
    id: string,
    loadFunc: () => Promise<void>,
    priority: number = 0
  ): void {
    this.queue.push({ id, priority, loadFunc });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }
  
  private async processQueue(): Promise<void> {
    if (this.loading || this.queue.length === 0) return;
    if (this.currentLoading >= this.maxConcurrent) return;
    
    this.loading = true;
    
    while (this.queue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;
      
      this.currentLoading++;
      
      item.loadFunc()
        .catch(console.error)
        .finally(() => {
          this.currentLoading--;
          this.processQueue();
        });
    }
    
    this.loading = false;
  }
  
  clear(): void {
    this.queue = [];
  }
}

/**
 * Lazy loading best practices
 */
export const LAZY_LOADING_BEST_PRACTICES = {
  images: [
    'Use native lazy loading: loading="lazy"',
    'Set width and height to avoid layout shift',
    'Use low-quality placeholders (LQIP)',
    'Lazy load below-fold images only',
  ],
  
  components: [
    'Lazy load route components automatically',
    'Lazy load heavy third-party components',
    'Use Suspense boundaries for better UX',
    'Preload on hover for better perceived performance',
  ],
  
  scripts: [
    'Defer non-critical scripts',
    'Lazy load analytics scripts',
    'Load chat widgets on interaction',
    'Use dynamic imports for heavy libraries',
  ],
  
  content: [
    'Lazy load below-fold sections',
    'Implement infinite scroll for lists',
    'Defer loading of comments/reviews',
    'Progressive enhancement for core content',
  ],
};

/**
 * Export all
 */
export default {
  DEFAULT_LAZY_OPTIONS,
  AGGRESSIVE_LAZY_OPTIONS,
  EAGER_LAZY_OPTIONS,
  LAZY_CONTENT_AREAS,
  useLazyLoad,
  useLazyImage,
  useLazyVideo,
  useLazyIframe,
  useLazyComponent,
  useLazyScript,
  useHoverPreload,
  useLazyLoadWithTimeout,
  useProgressiveImage,
  useBatchLazyLoad,
  useNetworkAwareLazyLoad,
  LazyLoadQueue,
  LAZY_LOADING_BEST_PRACTICES,
};
