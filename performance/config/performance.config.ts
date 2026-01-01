/**
 * Performance Testing Configuration
 * 
 * Configuración centralizada para todos los tests de performance
 */

export interface PerformanceThresholds {
  // Latency thresholds (ms)
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  
  // Throughput thresholds
  throughput: {
    minRequestsPerSecond: number;
    minMBPerSecond: number;
  };
  
  // Error rate thresholds
  errors: {
    maxErrorRate: number; // percentage
    maxTimeoutRate: number; // percentage
  };
  
  // Memory thresholds
  memory: {
    maxHeapUsedMB: number;
    maxRssMB: number;
    maxGrowthPercentage: number;
  };
  
  // CPU thresholds
  cpu: {
    maxUsagePercentage: number;
    maxEventLoopLagMs: number;
  };
}

export interface LoadTestConfig {
  name: string;
  target: string;
  phases: Array<{
    duration: number;
    arrivalRate: number;
    rampTo?: number;
    name: string;
  }>;
  thresholds: PerformanceThresholds;
}

/**
 * Thresholds por tipo de operación
 */
export const OPERATION_THRESHOLDS: Record<string, PerformanceThresholds> = {
  // Queue operations - deben ser muy rápidas
  queue: {
    latency: { p50: 10, p95: 50, p99: 100 },
    throughput: { minRequestsPerSecond: 1000, minMBPerSecond: 5 },
    errors: { maxErrorRate: 0.1, maxTimeoutRate: 0.05 },
    memory: { maxHeapUsedMB: 512, maxRssMB: 1024, maxGrowthPercentage: 20 },
    cpu: { maxUsagePercentage: 70, maxEventLoopLagMs: 50 },
  },

  // Analytics operations - pueden ser más lentas
  analytics: {
    latency: { p50: 20, p95: 100, p99: 200 },
    throughput: { minRequestsPerSecond: 500, minMBPerSecond: 2 },
    errors: { maxErrorRate: 0.5, maxTimeoutRate: 0.1 },
    memory: { maxHeapUsedMB: 768, maxRssMB: 1536, maxGrowthPercentage: 30 },
    cpu: { maxUsagePercentage: 80, maxEventLoopLagMs: 100 },
  },

  // WhatsApp API calls - dependen de red externa
  whatsapp: {
    latency: { p50: 100, p95: 500, p99: 1000 },
    throughput: { minRequestsPerSecond: 100, minMBPerSecond: 1 },
    errors: { maxErrorRate: 1, maxTimeoutRate: 0.5 },
    memory: { maxHeapUsedMB: 256, maxRssMB: 512, maxGrowthPercentage: 15 },
    cpu: { maxUsagePercentage: 60, maxEventLoopLagMs: 200 },
  },

  // Read operations - optimizadas para velocidad
  read: {
    latency: { p50: 5, p95: 25, p99: 50 },
    throughput: { minRequestsPerSecond: 2000, minMBPerSecond: 10 },
    errors: { maxErrorRate: 0.05, maxTimeoutRate: 0.01 },
    memory: { maxHeapUsedMB: 384, maxRssMB: 768, maxGrowthPercentage: 10 },
    cpu: { maxUsagePercentage: 50, maxEventLoopLagMs: 25 },
  },

  // Write operations - balance entre velocidad y consistencia
  write: {
    latency: { p50: 15, p95: 75, p99: 150 },
    throughput: { minRequestsPerSecond: 800, minMBPerSecond: 4 },
    errors: { maxErrorRate: 0.2, maxTimeoutRate: 0.05 },
    memory: { maxHeapUsedMB: 512, maxRssMB: 1024, maxGrowthPercentage: 25 },
    cpu: { maxUsagePercentage: 75, maxEventLoopLagMs: 75 },
  },
};

/**
 * Configuraciones de load tests
 */
export const LOAD_TEST_CONFIGS: Record<string, LoadTestConfig> = {
  // Queue Manager - smoke test
  'queue-smoke': {
    name: 'Queue Manager Smoke Test',
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 5, name: 'Smoke test' },
    ],
    thresholds: OPERATION_THRESHOLDS.queue,
  },

  // Queue Manager - load test
  'queue-load': {
    name: 'Queue Manager Load Test',
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10, name: 'Warm-up' },
      { duration: 120, arrivalRate: 10, rampTo: 50, name: 'Ramp-up' },
      { duration: 300, arrivalRate: 50, name: 'Sustained load' },
      { duration: 60, arrivalRate: 50, rampTo: 10, name: 'Cool down' },
    ],
    thresholds: OPERATION_THRESHOLDS.queue,
  },

  // Queue Manager - stress test
  'queue-stress': {
    name: 'Queue Manager Stress Test',
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10, name: 'Warm-up' },
      { duration: 120, arrivalRate: 10, rampTo: 100, name: 'Ramp to peak' },
      { duration: 180, arrivalRate: 100, name: 'Peak load' },
      { duration: 120, arrivalRate: 100, rampTo: 200, name: 'Stress' },
      { duration: 60, arrivalRate: 200, rampTo: 10, name: 'Recovery' },
    ],
    thresholds: {
      ...OPERATION_THRESHOLDS.queue,
      errors: { maxErrorRate: 5, maxTimeoutRate: 2 }, // Mayor tolerancia
    },
  },

  // Analytics - load test
  'analytics-load': {
    name: 'Analytics Load Test',
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 20, name: 'Warm-up' },
      { duration: 180, arrivalRate: 20, rampTo: 100, name: 'Ramp-up' },
      { duration: 300, arrivalRate: 100, name: 'Sustained load' },
      { duration: 60, arrivalRate: 100, rampTo: 20, name: 'Cool down' },
    ],
    thresholds: OPERATION_THRESHOLDS.analytics,
  },

  // Endurance test - 24 horas
  'endurance-24h': {
    name: 'Endurance Test 24h',
    target: 'http://localhost:3000',
    phases: [
      { duration: 86400, arrivalRate: 50, name: '24 hour sustained load' },
    ],
    thresholds: {
      ...OPERATION_THRESHOLDS.queue,
      memory: {
        maxHeapUsedMB: 1024,
        maxRssMB: 2048,
        maxGrowthPercentage: 10, // Muy estricto para detectar leaks
      },
    },
  },

  // Spike test - picos repentinos
  'spike': {
    name: 'Spike Test',
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10, name: 'Baseline' },
      { duration: 10, arrivalRate: 200, name: 'Spike 1' },
      { duration: 60, arrivalRate: 10, name: 'Recovery 1' },
      { duration: 10, arrivalRate: 300, name: 'Spike 2' },
      { duration: 60, arrivalRate: 10, name: 'Recovery 2' },
      { duration: 10, arrivalRate: 500, name: 'Spike 3' },
      { duration: 60, arrivalRate: 10, name: 'Final recovery' },
    ],
    thresholds: {
      ...OPERATION_THRESHOLDS.queue,
      errors: { maxErrorRate: 10, maxTimeoutRate: 5 }, // Tolerancia alta
    },
  },
};

/**
 * Redis optimization settings
 */
export const REDIS_OPTIMIZATION = {
  // Connection pool
  pool: {
    min: 2,
    max: 20,
  },

  // Performance settings
  performance: {
    enableOfflineQueue: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
    reconnectOnError: (err: Error) => {
      const targetError = 'READONLY';
      return err.message.includes(targetError) ? true : false;
    },
  },

  // Pipeline settings
  pipeline: {
    batchSize: 100,
    flushInterval: 10, // ms
  },

  // TTL defaults
  ttl: {
    analytics: 30 * 24 * 60 * 60, // 30 days
    cache: 60 * 60, // 1 hour
    session: 24 * 60 * 60, // 24 hours
  },
};

/**
 * BullMQ optimization settings
 */
export const BULLMQ_OPTIMIZATION = {
  // Worker settings
  worker: {
    concurrency: 10,
    maxStalledCount: 3,
    stalledInterval: 30000,
    lockDuration: 30000,
  },

  // Queue settings
  queue: {
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        age: 24 * 3600, // 24 hours
        count: 1000,
      },
      removeOnFail: {
        age: 7 * 24 * 3600, // 7 days
      },
    },
  },

  // Rate limiting
  rateLimit: {
    max: 100, // requests
    duration: 1000, // ms
  },
};

/**
 * Monitoring intervals
 */
export const MONITORING_INTERVALS = {
  metrics: 10000, // 10s
  health: 30000, // 30s
  cleanup: 300000, // 5min
  reports: 3600000, // 1h
};

export default {
  OPERATION_THRESHOLDS,
  LOAD_TEST_CONFIGS,
  REDIS_OPTIMIZATION,
  BULLMQ_OPTIMIZATION,
  MONITORING_INTERVALS,
};
