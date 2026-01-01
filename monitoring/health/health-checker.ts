/**
 * Health Checks System
 * 
 * Sistema completo de health checks para todos los componentes
 */

import Redis from 'ioredis';
import { Queue } from 'bullmq';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    [key: string]: ComponentHealth;
  };
  metadata?: {
    version: string;
    environment: string;
  };
}

export interface ComponentHealth {
  status: 'pass' | 'warn' | 'fail';
  message?: string;
  duration?: number;
  details?: Record<string, any>;
}

export class HealthChecker {
  private redis: Redis;
  private analyticsRedis: Redis;
  private queue: Queue;

  constructor(
    redisClient: Redis,
    analyticsRedisClient: Redis,
    queueClient: Queue
  ) {
    this.redis = redisClient;
    this.analyticsRedis = analyticsRedisClient;
    this.queue = queueClient;
  }

  /**
   * Health check completo
   */
  async check(): Promise<HealthStatus> {
    const startTime = Date.now();
    const checks: Record<string, ComponentHealth> = {};

    // Ejecutar todos los checks en paralelo
    const [
      redisCheck,
      analyticsRedisCheck,
      queueCheck,
      memoryCheck,
      eventLoopCheck,
      diskCheck,
    ] = await Promise.all([
      this.checkRedis(),
      this.checkAnalyticsRedis(),
      this.checkQueue(),
      this.checkMemory(),
      this.checkEventLoop(),
      this.checkDisk(),
    ]);

    checks.redis = redisCheck;
    checks.analyticsRedis = analyticsRedisCheck;
    checks.queue = queueCheck;
    checks.memory = memoryCheck;
    checks.eventLoop = eventLoopCheck;
    checks.disk = diskCheck;

    // Determinar estado general
    const status = this.determineOverallStatus(checks);

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      metadata: {
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }

  /**
   * Check: Redis principal
   */
  private async checkRedis(): Promise<ComponentHealth> {
    const start = Date.now();

    try {
      await this.redis.ping();
      const info = await this.redis.info('server');
      const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/);
      const uptime = uptimeMatch ? parseInt(uptimeMatch[1]) : 0;

      return {
        status: 'pass',
        duration: Date.now() - start,
        details: {
          uptime,
          connected: this.redis.status === 'ready',
        },
      };
    } catch (error) {
      return {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Redis check failed',
        duration: Date.now() - start,
      };
    }
  }

  /**
   * Check: Redis analytics
   */
  private async checkAnalyticsRedis(): Promise<ComponentHealth> {
    const start = Date.now();

    try {
      await this.analyticsRedis.ping();
      
      // Verificar que puede escribir y leer
      const testKey = 'health:check:test';
      await this.analyticsRedis.setex(testKey, 10, 'test');
      const value = await this.analyticsRedis.get(testKey);
      await this.analyticsRedis.del(testKey);

      if (value !== 'test') {
        throw new Error('Read/write test failed');
      }

      return {
        status: 'pass',
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Analytics Redis check failed',
        duration: Date.now() - start,
      };
    }
  }

  /**
   * Check: BullMQ Queue
   */
  private async checkQueue(): Promise<ComponentHealth> {
    const start = Date.now();

    try {
      const [waiting, active, completed, failed] = await Promise.all([
        this.queue.getWaitingCount(),
        this.queue.getActiveCount(),
        this.queue.getCompletedCount(),
        this.queue.getFailedCount(),
      ]);

      // Alertas si la cola está muy llena
      let status: 'pass' | 'warn' = 'pass';
      let message: string | undefined;

      if (waiting > 10000) {
        status = 'warn';
        message = 'Queue backlog is high';
      }

      if (failed > 1000) {
        status = 'warn';
        message = message 
          ? `${message}; High failure rate` 
          : 'High failure rate';
      }

      return {
        status,
        message,
        duration: Date.now() - start,
        details: {
          waiting,
          active,
          completed,
          failed,
        },
      };
    } catch (error) {
      return {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Queue check failed',
        duration: Date.now() - start,
      };
    }
  }

  /**
   * Check: Memory usage
   */
  private async checkMemory(): Promise<ComponentHealth> {
    const usage = process.memoryUsage();
    const heapUsedMB = usage.heapUsed / 1024 / 1024;
    const rssMB = usage.rss / 1024 / 1024;

    let status: 'pass' | 'warn' | 'fail' = 'pass';
    let message: string | undefined;

    // Thresholds
    if (heapUsedMB > 768) {
      status = 'warn';
      message = 'Heap usage above 768MB';
    }

    if (heapUsedMB > 1024) {
      status = 'fail';
      message = 'Heap usage critical (>1GB)';
    }

    if (rssMB > 1536) {
      status = 'warn';
      message = message 
        ? `${message}; RSS above 1.5GB` 
        : 'RSS above 1.5GB';
    }

    return {
      status,
      message,
      details: {
        heapUsedMB: Math.round(heapUsedMB),
        heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
        rssMB: Math.round(rssMB),
        externalMB: Math.round(usage.external / 1024 / 1024),
      },
    };
  }

  /**
   * Check: Event loop lag
   */
  private async checkEventLoop(): Promise<ComponentHealth> {
    const start = Date.now();

    return new Promise((resolve) => {
      setImmediate(() => {
        const lag = Date.now() - start;
        
        let status: 'pass' | 'warn' | 'fail' = 'pass';
        let message: string | undefined;

        if (lag > 50) {
          status = 'warn';
          message = `Event loop lag: ${lag}ms`;
        }

        if (lag > 100) {
          status = 'fail';
          message = `Event loop lag critical: ${lag}ms`;
        }

        resolve({
          status,
          message,
          details: { lagMs: lag },
        });
      });
    });
  }

  /**
   * Check: Disk space
   */
  private async checkDisk(): Promise<ComponentHealth> {
    try {
      const { execSync } = require('child_process');
      const output = execSync('df -h / | tail -1').toString();
      const parts = output.trim().split(/\s+/);
      const usedPercent = parseInt(parts[4]);

      let status: 'pass' | 'warn' | 'fail' = 'pass';
      let message: string | undefined;

      if (usedPercent > 80) {
        status = 'warn';
        message = `Disk usage: ${usedPercent}%`;
      }

      if (usedPercent > 90) {
        status = 'fail';
        message = `Disk usage critical: ${usedPercent}%`;
      }

      return {
        status,
        message,
        details: {
          usedPercent,
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
        },
      };
    } catch (error) {
      // Si falla el check de disco, no es crítico
      return {
        status: 'warn',
        message: 'Could not check disk usage',
      };
    }
  }

  /**
   * Determinar estado general
   */
  private determineOverallStatus(
    checks: Record<string, ComponentHealth>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks).map((c) => c.status);

    // Si algún check crítico falla
    if (
      checks.redis?.status === 'fail' ||
      checks.queue?.status === 'fail' ||
      checks.memory?.status === 'fail'
    ) {
      return 'unhealthy';
    }

    // Si hay algún fail no crítico o varios warnings
    if (statuses.includes('fail') || statuses.filter((s) => s === 'warn').length >= 2) {
      return 'degraded';
    }

    // Si hay algún warning
    if (statuses.includes('warn')) {
      return 'degraded';
    }

    return 'healthy';
  }

  /**
   * Liveness check simple
   */
  async isAlive(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Readiness check (listo para recibir tráfico)
   */
  async isReady(): Promise<boolean> {
    try {
      const [redisOk, queueOk] = await Promise.all([
        this.redis.ping().then(() => true).catch(() => false),
        this.queue.getWaitingCount().then(() => true).catch(() => false),
      ]);

      return redisOk && queueOk;
    } catch {
      return false;
    }
  }

  /**
   * Startup check (verificación inicial)
   */
  async checkStartup(): Promise<ComponentHealth[]> {
    const checks = await Promise.all([
      this.checkRedis(),
      this.checkAnalyticsRedis(),
      this.checkQueue(),
    ]);

    return checks;
  }
}

/**
 * Express middleware para health check
 */
export function healthCheckMiddleware(checker: HealthChecker) {
  return async (req: any, res: any) => {
    try {
      const health = await checker.check();
      
      const statusCode = 
        health.status === 'healthy' ? 200 :
        health.status === 'degraded' ? 200 :
        503;

      res.status(statusCode).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      });
    }
  };
}

/**
 * Liveness endpoint
 */
export function livenessMiddleware(checker: HealthChecker) {
  return async (req: any, res: any) => {
    const alive = await checker.isAlive();
    res.status(alive ? 200 : 503).json({ alive });
  };
}

/**
 * Readiness endpoint
 */
export function readinessMiddleware(checker: HealthChecker) {
  return async (req: any, res: any) => {
    const ready = await checker.isReady();
    res.status(ready ? 200 : 503).json({ ready });
  };
}
