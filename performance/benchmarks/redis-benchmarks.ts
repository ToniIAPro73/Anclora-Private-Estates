/**
 * Redis Benchmarks
 * 
 * Mide el rendimiento de operaciones críticas de Redis
 */

import Redis from 'ioredis';
import { performance } from 'perf_hooks';

interface BenchmarkResult {
  operation: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  opsPerSecond: number;
  p50: number;
  p95: number;
  p99: number;
}

class RedisBenchmark {
  private redis: Redis;
  private analyticsRedis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      db: parseInt(process.env.REDIS_DB || '0'),
    });

    this.analyticsRedis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      db: parseInt(process.env.REDIS_ANALYTICS_DB || '1'),
    });
  }

  /**
   * Ejecuta benchmark de una operación
   */
  async benchmark(
    name: string,
    operation: () => Promise<void>,
    iterations: number = 10000
  ): Promise<BenchmarkResult> {
    const times: number[] = [];

    // Warm-up
    for (let i = 0; i < 100; i++) {
      await operation();
    }

    // Benchmark real
    const startTotal = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await operation();
      const end = performance.now();
      times.push(end - start);
    }

    const endTotal = performance.now();
    const totalTime = endTotal - startTotal;

    // Calcular percentiles
    times.sort((a, b) => a - b);
    const p50 = times[Math.floor(iterations * 0.5)];
    const p95 = times[Math.floor(iterations * 0.95)];
    const p99 = times[Math.floor(iterations * 0.99)];

    return {
      operation: name,
      iterations,
      totalTime,
      avgTime: totalTime / iterations,
      opsPerSecond: (iterations / totalTime) * 1000,
      p50,
      p95,
      p99,
    };
  }

  /**
   * Benchmark: SET operation
   */
  async benchmarkSet(): Promise<BenchmarkResult> {
    let counter = 0;
    return this.benchmark('SET', async () => {
      await this.redis.set(`bench:set:${counter++}`, 'value');
    });
  }

  /**
   * Benchmark: GET operation
   */
  async benchmarkGet(): Promise<BenchmarkResult> {
    // Preparar datos
    for (let i = 0; i < 1000; i++) {
      await this.redis.set(`bench:get:${i}`, `value-${i}`);
    }

    let counter = 0;
    return this.benchmark('GET', async () => {
      await this.redis.get(`bench:get:${counter++ % 1000}`);
    });
  }

  /**
   * Benchmark: INCR operation
   */
  async benchmarkIncr(): Promise<BenchmarkResult> {
    return this.benchmark('INCR', async () => {
      await this.redis.incr('bench:counter');
    });
  }

  /**
   * Benchmark: LPUSH operation
   */
  async benchmarkLpush(): Promise<BenchmarkResult> {
    let counter = 0;
    return this.benchmark('LPUSH', async () => {
      await this.redis.lpush('bench:list', `item-${counter++}`);
    });
  }

  /**
   * Benchmark: ZADD operation
   */
  async benchmarkZadd(): Promise<BenchmarkResult> {
    let counter = 0;
    return this.benchmark('ZADD', async () => {
      await this.redis.zadd('bench:sorted', Date.now(), `member-${counter++}`);
    });
  }

  /**
   * Benchmark: Pipeline (batch operations)
   */
  async benchmarkPipeline(): Promise<BenchmarkResult> {
    let counter = 0;
    return this.benchmark('PIPELINE (10 ops)', async () => {
      const pipeline = this.redis.pipeline();
      for (let i = 0; i < 10; i++) {
        pipeline.set(`bench:pipe:${counter++}`, `value-${counter}`);
      }
      await pipeline.exec();
    });
  }

  /**
   * Benchmark: Analytics write pattern
   */
  async benchmarkAnalyticsWrite(): Promise<BenchmarkResult> {
    let counter = 0;
    return this.benchmark('Analytics Write Pattern', async () => {
      const phone = `34600${String(counter++ % 1000000).padStart(6, '0')}`;
      const timestamp = Date.now();
      
      const pipeline = this.analyticsRedis.pipeline();
      pipeline.incr(`analytics:messages:sent:${phone}`);
      pipeline.zadd('analytics:active:conversations', timestamp, phone);
      pipeline.lpush(`analytics:timeline:${phone}`, JSON.stringify({
        type: 'message_sent',
        timestamp,
      }));
      await pipeline.exec();
    });
  }

  /**
   * Benchmark: Analytics read pattern
   */
  async benchmarkAnalyticsRead(): Promise<BenchmarkResult> {
    // Preparar datos
    for (let i = 0; i < 1000; i++) {
      const phone = `34600${String(i).padStart(6, '0')}`;
      await this.analyticsRedis.set(`analytics:messages:sent:${phone}`, String(100 + i));
      await this.analyticsRedis.set(`analytics:messages:received:${phone}`, String(80 + i));
    }

    let counter = 0;
    return this.benchmark('Analytics Read Pattern', async () => {
      const phone = `34600${String(counter++ % 1000).padStart(6, '0')}`;
      
      await Promise.all([
        this.analyticsRedis.get(`analytics:messages:sent:${phone}`),
        this.analyticsRedis.get(`analytics:messages:received:${phone}`),
        this.analyticsRedis.get(`analytics:messages:delivered:${phone}`),
      ]);
    });
  }

  /**
   * Ejecutar todos los benchmarks
   */
  async runAll(): Promise<BenchmarkResult[]> {
    console.log('🚀 Iniciando Redis Benchmarks...\n');

    const results: BenchmarkResult[] = [];

    console.log('📝 SET operation...');
    results.push(await this.benchmarkSet());

    console.log('📖 GET operation...');
    results.push(await this.benchmarkGet());

    console.log('➕ INCR operation...');
    results.push(await this.benchmarkIncr());

    console.log('📋 LPUSH operation...');
    results.push(await this.benchmarkLpush());

    console.log('🔢 ZADD operation...');
    results.push(await this.benchmarkZadd());

    console.log('🔀 PIPELINE operation...');
    results.push(await this.benchmarkPipeline());

    console.log('✍️  Analytics Write Pattern...');
    results.push(await this.benchmarkAnalyticsWrite());

    console.log('📊 Analytics Read Pattern...');
    results.push(await this.benchmarkAnalyticsRead());

    return results;
  }

  /**
   * Imprimir resultados
   */
  printResults(results: BenchmarkResult[]): void {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  REDIS BENCHMARK RESULTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('┌────────────────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐');
    console.log('│ Operation                  │ Ops/sec  │ Avg (ms) │ P50 (ms) │ P95 (ms) │ P99 (ms) │');
    console.log('├────────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤');

    results.forEach((result) => {
      console.log(
        `│ ${result.operation.padEnd(26)} │ ${String(Math.round(result.opsPerSecond)).padStart(8)} │ ` +
        `${result.avgTime.toFixed(2).padStart(8)} │ ${result.p50.toFixed(2).padStart(8)} │ ` +
        `${result.p95.toFixed(2).padStart(8)} │ ${result.p99.toFixed(2).padStart(8)} │`
      );
    });

    console.log('└────────────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘\n');

    // Análisis
    console.log('📊 ANÁLISIS:\n');
    
    const avgOpsPerSec = results.reduce((sum, r) => sum + r.opsPerSecond, 0) / results.length;
    console.log(`   Promedio ops/sec: ${Math.round(avgOpsPerSec).toLocaleString()}`);
    
    const fastest = results.reduce((max, r) => r.opsPerSecond > max.opsPerSecond ? r : max);
    console.log(`   Operación más rápida: ${fastest.operation} (${Math.round(fastest.opsPerSecond).toLocaleString()} ops/sec)`);
    
    const slowest = results.reduce((min, r) => r.opsPerSecond < min.opsPerSecond ? r : min);
    console.log(`   Operación más lenta: ${slowest.operation} (${Math.round(slowest.opsPerSecond).toLocaleString()} ops/sec)`);
    
    console.log('\n═══════════════════════════════════════════════════════════\n');
  }

  /**
   * Limpiar datos de prueba
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Limpiando datos de benchmarks...');
    
    const keys = await this.redis.keys('bench:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }

    const analyticsKeys = await this.analyticsRedis.keys('analytics:*');
    if (analyticsKeys.length > 0) {
      await this.analyticsRedis.del(...analyticsKeys);
    }

    await this.redis.quit();
    await this.analyticsRedis.quit();
  }
}

// Ejecutar benchmarks
async function main() {
  const benchmark = new RedisBenchmark();
  
  try {
    const results = await benchmark.runAll();
    benchmark.printResults(results);
  } catch (error) {
    console.error('❌ Error en benchmarks:', error);
  } finally {
    await benchmark.cleanup();
  }
}

if (require.main === module) {
  main();
}

export { RedisBenchmark, BenchmarkResult };
