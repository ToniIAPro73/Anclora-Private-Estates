/**
 * Winston Logger Configuration
 * 
 * Sistema centralizado de logging con múltiples transportes
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Niveles de log customizados
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
    trace: 6,
  },
  colors: {
    fatal: 'red bold',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
    trace: 'gray',
  },
};

// Agregar colores
winston.addColors(customLevels.colors);

/**
 * Formato para desarrollo (pretty print)
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Agregar metadata si existe
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return msg;
  })
);

/**
 * Formato para producción (JSON estructurado)
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Formato para ELK Stack
 */
const elasticsearchFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format((info) => {
    // Agregar campos adicionales para Elasticsearch
    return {
      ...info,
      service: 'anclora-whatsapp',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.APP_VERSION || '1.0.0',
    };
  })()
);

/**
 * Transport: Console
 */
const consoleTransport = new winston.transports.Console({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' 
    ? productionFormat 
    : developmentFormat,
});

/**
 * Transport: File - All logs
 */
const fileAllTransport = new DailyRotateFile({
  filename: 'logs/anclora-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  level: 'debug',
  format: productionFormat,
});

/**
 * Transport: File - Errors only
 */
const fileErrorTransport = new DailyRotateFile({
  filename: 'logs/anclora-error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: productionFormat,
});

/**
 * Transport: File - HTTP requests
 */
const fileHttpTransport = new DailyRotateFile({
  filename: 'logs/anclora-http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '7d',
  level: 'http',
  format: productionFormat,
});

/**
 * Transport: Elasticsearch (opcional - solo si está configurado)
 */
let elasticsearchTransport: ElasticsearchTransport | null = null;

if (process.env.ELASTICSEARCH_URL) {
  elasticsearchTransport = new ElasticsearchTransport({
    level: 'info',
    clientOpts: {
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || '',
        password: process.env.ELASTICSEARCH_PASSWORD || '',
      },
    },
    index: 'anclora-logs',
    transformer: (logData) => {
      return {
        '@timestamp': logData.timestamp,
        message: logData.message,
        severity: logData.level,
        fields: logData.meta,
      };
    },
  });
}

/**
 * Logger principal
 */
export const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    consoleTransport,
    fileAllTransport,
    fileErrorTransport,
    fileHttpTransport,
    ...(elasticsearchTransport ? [elasticsearchTransport] : []),
  ],
  // No salir en caso de errores no manejados
  exitOnError: false,
});

/**
 * Logger específico para Queue
 */
export const queueLogger = logger.child({ component: 'queue' });

/**
 * Logger específico para Analytics
 */
export const analyticsLogger = logger.child({ component: 'analytics' });

/**
 * Logger específico para WhatsApp Client
 */
export const whatsappLogger = logger.child({ component: 'whatsapp' });

/**
 * Logger específico para Bot
 */
export const botLogger = logger.child({ component: 'bot' });

/**
 * Logger específico para API
 */
export const apiLogger = logger.child({ component: 'api' });

/**
 * Middleware de logging para Express
 */
export function requestLogger(req: any, res: any, next: any): void {
  const startTime = Date.now();

  // Log cuando la respuesta termine
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    apiLogger.http('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });
  });

  next();
}

/**
 * Helper: Log de mensaje encolado
 */
export function logQueueMessage(
  messageId: string,
  recipientPhone: string,
  messageType: string,
  priority: string
): void {
  queueLogger.info('Message queued', {
    messageId,
    recipientPhone,
    messageType,
    priority,
  });
}

/**
 * Helper: Log de mensaje procesado
 */
export function logQueueProcessed(
  messageId: string,
  durationMs: number,
  success: boolean
): void {
  if (success) {
    queueLogger.info('Message processed successfully', {
      messageId,
      durationMs,
    });
  } else {
    queueLogger.error('Message processing failed', {
      messageId,
      durationMs,
    });
  }
}

/**
 * Helper: Log de error con stack trace
 */
export function logError(error: Error, context?: Record<string, any>): void {
  logger.error('Error occurred', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    ...context,
  });
}

/**
 * Helper: Log de conversión
 */
export function logConversion(
  type: string,
  phone: string,
  value?: number,
  campaignId?: string
): void {
  analyticsLogger.info('Conversion tracked', {
    type,
    phone,
    value,
    campaignId,
  });
}

/**
 * Helper: Log de handoff
 */
export function logHandoff(
  phone: string,
  reason: string,
  assignedAgent?: string
): void {
  botLogger.info('Handoff to human agent', {
    phone,
    reason,
    assignedAgent,
  });
}

/**
 * Helper: Log de API call a Evolution
 */
export function logWhatsAppApiCall(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs: number
): void {
  const logLevel = statusCode >= 400 ? 'error' : 'debug';
  
  whatsappLogger[logLevel]('Evolution API call', {
    endpoint,
    method,
    statusCode,
    durationMs,
  });
}

/**
 * Helper: Log de webhook recibido
 */
export function logWebhookReceived(
  instanceName: string,
  eventType: string,
  data: any
): void {
  whatsappLogger.debug('Webhook received', {
    instanceName,
    eventType,
    hasData: !!data,
  });
}

/**
 * Helper: Log de inicio de aplicación
 */
export function logApplicationStart(port: number): void {
  logger.info('Application started', {
    port,
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
    nodeVersion: process.version,
  });
}

/**
 * Helper: Log de shutdown
 */
export function logApplicationShutdown(reason: string): void {
  logger.warn('Application shutting down', { reason });
}

/**
 * Stream para Morgan (HTTP logger)
 */
export const morganStream = {
  write: (message: string) => {
    apiLogger.http(message.trim());
  },
};

/**
 * Configuración de nivel de log dinámico
 */
export function setLogLevel(level: string): void {
  logger.transports.forEach((transport) => {
    transport.level = level;
  });
  
  logger.info(`Log level changed to: ${level}`);
}

/**
 * Obtener estadísticas de logging
 */
export function getLoggingStats(): Record<string, any> {
  return {
    transports: logger.transports.map((t) => ({
      type: t.constructor.name,
      level: t.level,
    })),
    level: logger.level,
    levelsConfig: customLevels.levels,
  };
}

export default logger;
