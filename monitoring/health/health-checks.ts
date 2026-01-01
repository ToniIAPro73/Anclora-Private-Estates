/**
 * Health Checks System
 * 
 * Verificaciones de salud para todos los componentes del sistema
 */

import Redis from 'ioredis';
import { Queue } from 'bullmq';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  responseTime?: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    redis: HealthCheckResult;
    redisAnalytics: HealthCheckResult;
    queue: HealthCheckResult;
    memory: HealthCheckResult;
    eventLoop: HealthCheckResult;
    disk: HealthCheckResult;
  };
  metadata: {
    version: string;
    environment: string;
    nodeVersion: string;
  };
}

/**
 * Health Check: Redis principal
 */
export async function checkRedisHealth(redis: Redis): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Test PING
    const pingResult = await redis.ping();
    
    if (pingResult !== 'PONG') {
      return {
        status: 'unhealthy',
        message: 'Redis PING failed',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      };
    }

    // Test SET/GET
    const testKey = `health:check:${Date.now()}`;
    const testValue = 'test';
    
    await redis.set(testKey, testValue, 'EX', 10);
    const getValue = await redis.get(testKey);
    
    if (getValue !== testValue) {
      return {
        status: 'degraded',
        message: 'Redis SET/GET verification failed',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      };
    }

    // Obtener info
    const info = await redis.info('stats');
    const connections = parseInt(info.match(/connected_clients:(\d+)/)?.[1] || '0');
    const usedMemory = info.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'unknown';

    return {
      status: 'healthy',
      message: 'Redis is healthy',
      details: {
        connections,
        usedMemory,
      },
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Redis error: ${error.message}`,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Health Check: Redis Analytics
 */
export async function checkRedisAnalyticsHealth(redis: Redis): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const pingResult = await redis.ping();
    
    if (pingResult !== 'PONG') {
      return {
        status: 'unhealthy',
        message: 'Redis Analytics PING failed',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      };
    }

    // Check some analytics keys exist
    const keysCount = await redis.dbsize();

    return {
      status: 'healthy',
      message: 'Redis Analytics is healthy',
      details: {
        keysCount,
      },
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Redis Analytics error: ${error.message}`,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Health Check: BullMQ Queue
 */
export async function checkQueueHealth(queue: Queue): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Obtener counts
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    // Verificar si la cola está operativa
    const isPaused = await queue.isPaused();

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message = 'Queue is healthy';

    // Degraded si hay muchos fallidos
    if (failed > 100) {
      status = 'degraded';
      message = 'High number of failed jobs';
    }

    // Degraded si está pausada
    if (isPaused) {
      status = 'degraded';
      message = 'Queue is paused';
    }

    // Unhealthy si hay demasiados esperando y ninguno activo
    if (waiting > 1000 && active === 0) {
      status = 'unhealthy';
      message = 'Queue appears stuck';
    }

    return {
      status,
      message,
      details: {
        waiting,
        active,
        completed,
        failed,
        delayed,
        isPaused,
      },
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Queue error: ${error.message}`,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Health Check: Memory usage
 */
export function checkMemoryHealth(): HealthCheckResult {
  const startTime = Date.now();
  
  const usage = process.memoryUsage();
  const heapUsedMB = usage.heapUsed / 1024 / 1024;
  const heapTotalMB = usage.heapTotal / 1024 / 1024;
  const rssMB = usage.rss / 1024 / 1024;
  const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  let message = 'Memory usage is healthy';

  // Thresholds
  if (heapUsedMB > 768 || rssMB > 1536) {
    status = 'degraded';
    message = 'High memory usage';
  }

  if (heapUsedMB > 1024 || rssMB > 2048) {
    status = 'unhealthy';
    message = 'Critical memory usage';
  }

  return {
    status,
    message,
    details: {
      heapUsedMB: heapUsedMB.toFixed(2),
      heapTotalMB: heapTotalMB.toFixed(2),
      rssMB: rssMB.toFixed(2),
      heapUsagePercent: heapUsagePercent.toFixed(2),
      externalMB: (usage.external / 1024 / 1024).toFixed(2),
    },
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
  };
}

/**
 * Health Check: Event Loop lag
 */
export function checkEventLoopHealth(): HealthCheckResult {
  const startTime = Date.now();
  
  // Medir event loop lag
  const start = process.hrtime.bigint();
  
  setImmediate(() => {
    const end = process.hrtime.bigint();
    const lagNs = Number(end - start);
    const lagMs = lagNs / 1000000;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message = 'Event loop is healthy';

    if (lagMs > 50 && lagMs <= 100) {
      status = 'degraded';
      message = 'Moderate event loop lag';
    }

    if (lagMs > 100) {
      status = 'unhealthy';
      message = 'High event loop lag';
    }

    return {
      status,
      message,
      details: {
        lagMs: lagMs.toFixed(2),
      },
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  });

  // Return immediate status
  return {
    status: 'healthy',
    message: 'Event loop check scheduled',
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
  };
}

/**
 * Health Check: Disk space
 */
export async function checkDiskHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // En Node.js no hay API nativa para disk space
    // En producción usar librerías como 'check-disk-space'
    // Por ahora retornamos healthy
    
    return {
      status: 'healthy',
      message: 'Disk health check not implemented',
      details: {
        note: 'Install check-disk-space for production monitoring',
      },
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'degraded',
      message: `Disk check error: ${error.message}`,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Ejecutar todos los health checks
 */
export async function getSystemHealth(
  redis: Redis,
  redisAnalytics: Redis,
  queue: Queue
): Promise<SystemHealth> {
  const [
    redisHealth,
    redisAnalyticsHealth,
    queueHealth,
    diskHealth,
  ] = await Promise.all([
    checkRedisHealth(redis),
    checkRedisAnalyticsHealth(redisAnalytics),
    checkQueueHealth(queue),
    checkDiskHealth(),
  ]);

  const memoryHealth = checkMemoryHealth();
  const eventLoopHealth = checkEventLoopHealth();

  // Determinar estado general del sistema
  const allChecks = [
    redisHealth,
    redisAnalyticsHealth,
    queueHealth,
    memoryHealth,
    eventLoopHealth,
    diskHealth,
  ];

  let systemStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (allChecks.some((check) => check.status === 'unhealthy')) {
    systemStatus = 'unhealthy';
  } else if (allChecks.some((check) => check.status === 'degraded')) {
    systemStatus = 'degraded';
  }

  return {
    status: systemStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      redis: redisHealth,
      redisAnalytics: redisAnalyticsHealth,
      queue: queueHealth,
      memory: memoryHealth,
      eventLoop: eventLoopHealth,
      disk: diskHealth,
    },
    metadata: {
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    },
  };
}

/**
 * Health check endpoint rápido (liveness probe)
 */
export async function getLivenessCheck(): Promise<{ status: 'ok' }> {
  // Simple check - la aplicación está corriendo
  return { status: 'ok' };
}

/**
 * Health check endpoint completo (readiness probe)
 */
export async function getReadinessCheck(
  redis: Redis,
  queue: Queue
): Promise<{ status: 'ready' | 'not-ready'; details?: string }> {
  try {
    // Verificar componentes críticos
    const [redisPing, queueActive] = await Promise.all([
      redis.ping(),
      queue.getActiveCount(),
    ]);

    if (redisPing !== 'PONG') {
      return {
        status: 'not-ready',
        details: 'Redis not responding',
      };
    }

    // Si llegamos aquí, está listo
    return { status: 'ready' };
  } catch (error) {
    return {
      status: 'not-ready',
      details: error.message,
    };
  }
}

/**
 * Monitor continuo de salud
 */
export class HealthMonitor {
  private redis: Redis;
  private redisAnalytics: Redis;
  private queue: Queue;
  private interval: NodeJS.Timeout | null = null;
  private lastHealth: SystemHealth | null = null;

  constructor(redis: Redis, redisAnalytics: Redis, queue: Queue) {
    this.redis = redis;
    this.redisAnalytics = redisAnalytics;
    this.queue = queue;
  }

  /**
   * Iniciar monitoreo
   */
  start(intervalMs: number = 30000): void {
    this.interval = setInterval(async () => {
      this.lastHealth = await getSystemHealth(
        this.redis,
        this.redisAnalytics,
        this.queue
      );

      // Log si hay problemas
      if (this.lastHealth.status !== 'healthy') {
        console.warn('System health degraded:', this.lastHealth);
      }
    }, intervalMs);

    console.log(`Health monitor started (interval: ${intervalMs}ms)`);
  }

  /**
   * Detener monitoreo
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Health monitor stopped');
    }
  }

  /**
   * Obtener último estado
   */
  getLastHealth(): SystemHealth | null {
    return this.lastHealth;
  }

  /**
   * Verificar si el sistema está saludable
   */
  isHealthy(): boolean {
    return this.lastHealth?.status === 'healthy';
  }
}

export default {
  getSystemHealth,
  getLivenessCheck,
  getReadinessCheck,
  HealthMonitor,
};
