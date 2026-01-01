/**
 * Sentry Error Tracking & Performance Monitoring
 * 
 * Configuración centralizada de Sentry para captura de errores y performance
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
  profilesSampleRate: number;
  enabled: boolean;
}

/**
 * Inicializar Sentry
 */
export function initializeSentry(config: Partial<SentryConfig> = {}): void {
  const sentryConfig: SentryConfig = {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION || '1.0.0',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    enabled: process.env.SENTRY_ENABLED === 'true',
    ...config,
  };

  // No inicializar si no está habilitado o no hay DSN
  if (!sentryConfig.enabled || !sentryConfig.dsn) {
    console.log('Sentry disabled');
    return;
  }

  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: sentryConfig.environment,
    release: sentryConfig.release,

    // Performance Monitoring
    tracesSampleRate: sentryConfig.tracesSampleRate,
    
    // Profiling
    profilesSampleRate: sentryConfig.profilesSampleRate,
    integrations: [
      nodeProfilingIntegration(),
    ],

    // Before send - filtrar información sensible
    beforeSend(event, hint) {
      // Remover información sensible
      if (event.request) {
        delete event.request.cookies;
        
        // Filtrar headers sensibles
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }

      // Filtrar datos sensibles en breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.data) {
            const filtered = { ...breadcrumb.data };
            delete filtered.password;
            delete filtered.token;
            delete filtered.apiKey;
            return { ...breadcrumb, data: filtered };
          }
          return breadcrumb;
        });
      }

      return event;
    },

    // Tags globales
    initialScope: {
      tags: {
        service: 'anclora-whatsapp',
        component: 'backend',
      },
    },
  });

  console.log(`Sentry initialized (env: ${sentryConfig.environment})`);
}

/**
 * Capturar excepción manualmente
 */
export function captureException(
  error: Error,
  context?: Record<string, any>
): string {
  return Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
}

/**
 * Capturar mensaje
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): string {
  return Sentry.captureMessage(message, {
    level,
    contexts: context ? { custom: context } : undefined,
  });
}

/**
 * Agregar breadcrumb
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info'
): void {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context
 */
export function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
  phone?: string;
}): void {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Set tag
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Set context
 */
export function setContext(name: string, context: Record<string, any>): void {
  Sentry.setContext(name, context);
}

/**
 * Iniciar transacción (performance monitoring)
 */
export function startTransaction(
  name: string,
  op: string,
  description?: string
): Sentry.Transaction {
  return Sentry.startTransaction({
    name,
    op,
    description,
  });
}

/**
 * Middleware de Sentry para Express
 */
export function getSentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

/**
 * Middleware de traceo para Express
 */
export function getSentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Middleware de error para Express
 */
export function getSentryErrorHandler() {
  return Sentry.Handlers.errorHandler();
}

/**
 * Wrapper para funciones async con Sentry tracking
 */
export function withSentryTracking<T>(
  name: string,
  fn: () => Promise<T>,
  op: string = 'function'
): Promise<T> {
  const transaction = startTransaction(name, op);
  
  return fn()
    .then((result) => {
      transaction.setStatus('ok');
      transaction.finish();
      return result;
    })
    .catch((error) => {
      transaction.setStatus('internal_error');
      captureException(error, { operation: name });
      transaction.finish();
      throw error;
    });
}

/**
 * Decorador para capturar errores de métodos
 */
export function CaptureErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      captureException(error as Error, {
        class: target.constructor.name,
        method: propertyKey,
        args: args.length,
      });
      throw error;
    }
  };

  return descriptor;
}

/**
 * Track queue job errors
 */
export function trackQueueError(
  jobId: string,
  error: Error,
  jobData: Record<string, any>
): void {
  addBreadcrumb('queue', `Job ${jobId} failed`, { jobData }, 'error');
  
  captureException(error, {
    queue: {
      jobId,
      jobData: {
        messageType: jobData.messageType,
        priority: jobData.metadata?.priority,
      },
    },
  });
}

/**
 * Track WhatsApp API errors
 */
export function trackWhatsAppError(
  endpoint: string,
  statusCode: number,
  error: Error
): void {
  addBreadcrumb('whatsapp', `API call failed: ${endpoint}`, {
    statusCode,
  }, 'error');
  
  captureException(error, {
    whatsapp: {
      endpoint,
      statusCode,
    },
  });
}

/**
 * Track bot errors
 */
export function trackBotError(
  phone: string,
  intent: string,
  error: Error
): void {
  addBreadcrumb('bot', `Bot error for ${phone}`, { intent }, 'error');
  
  captureException(error, {
    bot: {
      phone,
      intent,
    },
  });
}

/**
 * Track analytics errors
 */
export function trackAnalyticsError(
  operation: string,
  error: Error,
  data?: Record<string, any>
): void {
  addBreadcrumb('analytics', `Analytics error: ${operation}`, data, 'error');
  
  captureException(error, {
    analytics: {
      operation,
      data,
    },
  });
}

/**
 * Flush eventos pendientes antes de shutdown
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
  return Sentry.close(timeout);
}

/**
 * Performance monitoring helpers
 */
export class PerformanceMonitor {
  private transaction: Sentry.Transaction | null = null;
  private spans: Map<string, Sentry.Span> = new Map();

  startOperation(name: string, op: string): void {
    this.transaction = startTransaction(name, op);
  }

  startSpan(name: string, op: string): void {
    if (!this.transaction) {
      console.warn('No active transaction for span');
      return;
    }

    const span = this.transaction.startChild({
      op,
      description: name,
    });

    this.spans.set(name, span);
  }

  finishSpan(name: string, status: 'ok' | 'error' = 'ok'): void {
    const span = this.spans.get(name);
    if (span) {
      span.setStatus(status);
      span.finish();
      this.spans.delete(name);
    }
  }

  finishOperation(status: 'ok' | 'error' = 'ok'): void {
    if (this.transaction) {
      this.transaction.setStatus(status);
      this.transaction.finish();
      this.transaction = null;
    }

    // Finish any remaining spans
    this.spans.forEach((span) => {
      span.setStatus('cancelled');
      span.finish();
    });
    this.spans.clear();
  }

  addData(key: string, value: any): void {
    if (this.transaction) {
      this.transaction.setData(key, value);
    }
  }
}

/**
 * Configuración de fingerprinting para agrupar errores
 */
export function configureSentryFingerprinting(): void {
  Sentry.configureScope((scope) => {
    scope.setFingerprint(['{{ default }}']);
  });
}

export default {
  initializeSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  clearUser,
  setTag,
  setContext,
  startTransaction,
  getSentryRequestHandler,
  getSentryTracingHandler,
  getSentryErrorHandler,
  withSentryTracking,
  trackQueueError,
  trackWhatsAppError,
  trackBotError,
  trackAnalyticsError,
  flushSentry,
  PerformanceMonitor,
};
