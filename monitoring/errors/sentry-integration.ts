/**
 * Sentry Error Tracking
 * 
 * Integración con Sentry para tracking y reporting de errores
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Request, Response, NextFunction } from 'express';

export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  profilesSampleRate?: number;
  enabled?: boolean;
}

/**
 * Inicializar Sentry
 */
export function initSentry(config: SentryConfig): void {
  if (!config.enabled) {
    console.log('Sentry disabled');
    return;
  }

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: config.release || process.env.APP_VERSION || '1.0.0',

    // Performance monitoring
    tracesSampleRate: config.tracesSampleRate || 0.1, // 10% de las transacciones

    // Profiling
    profilesSampleRate: config.profilesSampleRate || 0.1,
    integrations: [
      new ProfilingIntegration(),
    ],

    // Ignorar errores conocidos/esperados
    ignoreErrors: [
      // Errores de red
      'NetworkError',
      'Network request failed',
      
      // Rate limiting esperado
      'Rate limit exceeded',
      
      // Timeouts esperados
      'ETIMEDOUT',
      'ECONNREFUSED',
      
      // Errores de cliente
      'BadRequestError',
      'ValidationError',
    ],

    // Filtrar información sensible
    beforeSend(event, hint) {
      // Remover información sensible
      if (event.request) {
        delete event.request.cookies;
        
        // Sanitizar headers
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers['x-api-key'];
        }
      }

      // Sanitizar datos en extra
      if (event.extra) {
        if (event.extra.phone) {
          event.extra.phone = maskPhone(event.extra.phone as string);
        }
      }

      return event;
    },
  });

  console.log('Sentry initialized:', {
    environment: config.environment,
    release: config.release,
  });
}

/**
 * Middleware de Sentry para Express
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

/**
 * Middleware de tracing para Express
 */
export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Middleware de error handler para Express
 */
export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capturar errores 500+
      return true;
    },
  });
}

/**
 * Capturar excepción con contexto
 */
export function captureException(
  error: Error,
  context?: {
    level?: Sentry.SeverityLevel;
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    user?: {
      id?: string;
      phone?: string;
      email?: string;
    };
  }
): string {
  return Sentry.captureException(error, {
    level: context?.level || 'error',
    tags: context?.tags,
    extra: context?.extra,
    user: context?.user ? {
      ...context.user,
      phone: context.user.phone ? maskPhone(context.user.phone) : undefined,
    } : undefined,
  });
}

/**
 * Capturar mensaje con contexto
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
): string {
  return Sentry.captureMessage(message, {
    level,
    tags: context?.tags,
    extra: context?.extra,
  });
}

/**
 * Iniciar transacción de performance
 */
export function startTransaction(
  name: string,
  op: string
): Sentry.Transaction {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Wrapper para funciones async con error handling
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    operation?: string;
    tags?: Record<string, string>;
  }
): T {
  return (async (...args: any[]) => {
    const transaction = Sentry.startTransaction({
      name: fn.name || 'anonymous',
      op: options?.operation || 'function',
      tags: options?.tags,
    });

    try {
      const result = await fn(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      captureException(error as Error, {
        tags: options?.tags,
        extra: { args },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
}

/**
 * Contexto de usuario
 */
export function setUser(user: {
  id: string;
  phone?: string;
  email?: string;
  username?: string;
}): void {
  Sentry.setUser({
    id: user.id,
    phone: user.phone ? maskPhone(user.phone) : undefined,
    email: user.email,
    username: user.username,
  });
}

/**
 * Limpiar contexto de usuario
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Agregar breadcrumb
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  });
}

/**
 * Agregar tag
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Agregar tags
 */
export function setTags(tags: Record<string, string>): void {
  Sentry.setTags(tags);
}

/**
 * Agregar contexto extra
 */
export function setExtra(key: string, value: any): void {
  Sentry.setExtra(key, value);
}

/**
 * Wrapper para Queue processor
 */
export function wrapQueueProcessor(
  processor: (job: any) => Promise<any>
): (job: any) => Promise<any> {
  return async (job: any) => {
    const transaction = Sentry.startTransaction({
      name: 'queue.process',
      op: 'queue.process',
      data: {
        jobId: job.id,
        jobName: job.name,
      },
    });

    Sentry.configureScope((scope) => {
      scope.setContext('job', {
        id: job.id,
        name: job.name,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
      });
    });

    try {
      const result = await processor(job);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      
      captureException(error as Error, {
        tags: {
          job_id: job.id,
          job_name: job.name,
        },
        extra: {
          job_data: job.data,
          attempts: job.attemptsMade,
        },
      });
      
      throw error;
    } finally {
      transaction.finish();
    }
  };
}

/**
 * Wrapper para rutas Express
 */
export function wrapExpressRoute(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
    
    if (transaction) {
      transaction.setData('route', req.route?.path);
      transaction.setData('method', req.method);
    }

    try {
      await handler(req, res, next);
    } catch (error) {
      captureException(error as Error, {
        tags: {
          route: req.route?.path || req.path,
          method: req.method,
        },
        extra: {
          query: req.query,
          params: req.params,
          ip: req.ip,
        },
      });
      next(error);
    }
  };
}

/**
 * Capturar error de WhatsApp API
 */
export function captureWhatsAppError(
  error: Error,
  context: {
    endpoint: string;
    method: string;
    statusCode?: number;
    instanceName?: string;
  }
): void {
  captureException(error, {
    level: context.statusCode && context.statusCode >= 500 ? 'error' : 'warning',
    tags: {
      component: 'whatsapp',
      endpoint: context.endpoint,
      method: context.method,
      instance_name: context.instanceName || 'unknown',
    },
    extra: {
      statusCode: context.statusCode,
    },
  });
}

/**
 * Capturar error de Queue
 */
export function captureQueueError(
  error: Error,
  jobId: string,
  jobData: any
): void {
  captureException(error, {
    level: 'error',
    tags: {
      component: 'queue',
      job_id: jobId,
    },
    extra: {
      jobData,
    },
  });
}

/**
 * Flush Sentry (útil antes de shutdown)
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
  return Sentry.close(timeout);
}

/**
 * Máscara de teléfono para privacidad
 */
function maskPhone(phone: string): string {
  if (phone.length < 4) return '***';
  return phone.slice(0, 2) + '***' + phone.slice(-2);
}

export default Sentry;
