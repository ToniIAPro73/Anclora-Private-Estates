/**
 * Queue Manager Benchmarks
 * 
 * Usa autocannon para medir throughput del Queue Manager
 */

import autocannon from 'autocannon';
import { performance } from 'perf_hooks';

interface BenchmarkConfig {
  url: string;
  connections: number;
  duration: number;
  pipelining: number;
}

interface BenchmarkResults {
  scenario: string;
  requests: {
    total: number;
    perSecond: number;
    p50: number;
    p95: number;
    p99: number;
  };
  latency: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  };
}

class QueueBenchmark {
  private baseUrl: string;
  private defaultConfig: Partial<BenchmarkConfig>;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.defaultConfig = {
      connections: 10,
      duration: 30,
      pipelining: 1,
    };
  }

  /**
   * Benchmark: Add single message
   */
  async benchmarkAddMessage(): Promise<BenchmarkResults> {
    console.log('📨 Benchmarking: Add Message...');

    const result = await autocannon({
      url: `${this.baseUrl}/api/whatsapp/queue/add`,
      ...this.defaultConfig,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceName: 'anclora-main',
        recipientPhone: '34600123456',
        messageType: 'text',
        content: {
          text: 'Benchmark message',
        },
        metadata: {
          priority: 'normal',
          source: 'benchmark',
        },
      }),
    });

    return this.formatResults('Add Message', result);
  }

  /**
   * Benchmark: Add bulk messages
   */
  async benchmarkBulkAdd(): Promise<BenchmarkResults> {
    console.log('📦 Benchmarking: Bulk Add Messages...');

    const messages = Array.from({ length: 10 }, (_, i) => ({
      instanceName: 'anclora-main',
      recipientPhone: `34600${String(i).padStart(6, '0')}`,
      messageType: 'text',
      content: {
        text: `Bulk message ${i}`,
      },
    }));

    const result = await autocannon({
      url: `${this.baseUrl}/api/whatsapp/queue/bulk`,
      ...this.defaultConfig,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    return this.formatResults('Bulk Add (10 messages)', result);
  }

  /**
   * Benchmark: Get queue metrics
   */
  async benchmarkGetMetrics(): Promise<BenchmarkResults> {
    console.log('📊 Benchmarking: Get Metrics...');

    const result = await autocannon({
      url: `${this.baseUrl}/api/whatsapp/queue/metrics`,
      ...this.defaultConfig,
      connections: 50, // Más conexiones para reads
      method: 'GET',
    });

    return this.formatResults('Get Metrics', result);
  }

  /**
   * Benchmark: Priority queue
   */
  async benchmarkPriorityQueue(): Promise<BenchmarkResults> {
    console.log('⚡ Benchmarking: Priority Queue...');

    let counter = 0;
    const priorities = ['critical', 'high', 'normal', 'low'];

    const result = await autocannon({
      url: `${this.baseUrl}/api/whatsapp/queue/add`,
      ...this.defaultConfig,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      setupClient: (client) => {
        client.on('response', () => {
          counter++;
        });
      },
      body: JSON.stringify({
        instanceName: 'anclora-main',
        recipientPhone: '34600123456',
        messageType: 'text',
        content: {
          text: 'Priority message',
        },
        metadata: {
          priority: priorities[counter % priorities.length],
          source: 'benchmark',
        },
      }),
    });

    return this.formatResults('Priority Queue', result);
  }

  /**
   * Benchmark: Mixed workload
   */
  async benchmarkMixedWorkload(): Promise<BenchmarkResults> {
    console.log('🔀 Benchmarking: Mixed Workload...');

    let requestCount = 0;
    const requests = [
      {
        method: 'POST',
        path: '/api/whatsapp/queue/add',
        body: JSON.stringify({
          instanceName: 'anclora-main',
          recipientPhone: '34600123456',
          messageType: 'text',
          content: { text: 'Test' },
        }),
        weight: 70,
      },
      {
        method: 'GET',
        path: '/api/whatsapp/queue/metrics',
        weight: 20,
      },
      {
        method: 'POST',
        path: '/api/whatsapp/queue/bulk',
        body: JSON.stringify({
          messages: Array(5).fill({
            instanceName: 'anclora-main',
            recipientPhone: '34600123456',
            messageType: 'text',
            content: { text: 'Bulk' },
          }),
        }),
        weight: 10,
      },
    ];

    const result = await autocannon({
      url: this.baseUrl,
      ...this.defaultConfig,
      requests: requests.map((req) => ({
        method: req.method,
        path: req.path,
        headers: req.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        body: req.body,
      })),
    });

    return this.formatResults('Mixed Workload', result);
  }

  /**
   * Benchmark: High concurrency
   */
  async benchmarkHighConcurrency(): Promise<BenchmarkResults> {
    console.log('🚀 Benchmarking: High Concurrency (100 connections)...');

    const result = await autocannon({
      url: `${this.baseUrl}/api/whatsapp/queue/add`,
      connections: 100,
      duration: 30,
      pipelining: 10,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceName: 'anclora-main',
        recipientPhone: '34600123456',
        messageType: 'text',
        content: {
          text: 'High concurrency test',
        },
      }),
    });

    return this.formatResults('High Concurrency', result);
  }

  /**
   * Formatea resultados de autocannon
   */
  private formatResults(scenario: string, result: any): BenchmarkResults {
    return {
      scenario,
      requests: {
        total: result.requests.total,
        perSecond: result.requests.average,
        p50: result.requests.p50,
        p95: result.requests.p95,
        p99: result.requests.p99,
      },
      latency: {
        avg: result.latency.mean,
        p50: result.latency.p50,
        p95: result.latency.p95,
        p99: result.latency.p99,
      },
      throughput: {
        avg: result.throughput.mean,
        p50: result.throughput.p50,
        p95: result.throughput.p95,
        p99: result.throughput.p99,
      },
    };
  }

  /**
   * Ejecutar todos los benchmarks
   */
  async runAll(): Promise<BenchmarkResults[]> {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  QUEUE MANAGER BENCHMARKS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const results: BenchmarkResults[] = [];

    results.push(await this.benchmarkAddMessage());
    results.push(await this.benchmarkBulkAdd());
    results.push(await this.benchmarkGetMetrics());
    results.push(await this.benchmarkPriorityQueue());
    results.push(await this.benchmarkMixedWorkload());
    results.push(await this.benchmarkHighConcurrency());

    return results;
  }

  /**
   * Imprimir resultados
   */
  printResults(results: BenchmarkResults[]): void {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');

    results.forEach((result) => {
      console.log(`\n📊 ${result.scenario}`);
      console.log('─────────────────────────────────────────────────────────');
      console.log(`   Requests/sec:  ${result.requests.perSecond.toFixed(2)}`);
      console.log(`   Total requests: ${result.requests.total.toLocaleString()}`);
      console.log(`   Latency P50:    ${result.latency.p50.toFixed(2)} ms`);
      console.log(`   Latency P95:    ${result.latency.p95.toFixed(2)} ms`);
      console.log(`   Latency P99:    ${result.latency.p99.toFixed(2)} ms`);
      console.log(`   Throughput:     ${(result.throughput.avg / 1024 / 1024).toFixed(2)} MB/s`);
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  PERFORMANCE ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const totalReqPerSec = results.reduce((sum, r) => sum + r.requests.perSecond, 0);
    const avgReqPerSec = totalReqPerSec / results.length;

    console.log(`   Average req/sec across all scenarios: ${avgReqPerSec.toFixed(2)}`);

    const fastest = results.reduce((max, r) => 
      r.requests.perSecond > max.requests.perSecond ? r : max
    );
    console.log(`   Fastest scenario: ${fastest.scenario} (${fastest.requests.perSecond.toFixed(2)} req/sec)`);

    const slowest = results.reduce((min, r) => 
      r.requests.perSecond < min.requests.perSecond ? r : min
    );
    console.log(`   Slowest scenario: ${slowest.scenario} (${slowest.requests.perSecond.toFixed(2)} req/sec)`);

    // Análisis de latencia
    const avgP99 = results.reduce((sum, r) => sum + r.latency.p99, 0) / results.length;
    console.log(`\n   Average P99 latency: ${avgP99.toFixed(2)} ms`);

    if (avgP99 > 100) {
      console.log('   ⚠️  WARNING: P99 latency above 100ms threshold');
    } else {
      console.log('   ✅ P99 latency within acceptable range');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');
  }
}

// Ejecutar benchmarks
async function main() {
  const benchmark = new QueueBenchmark();
  
  try {
    const results = await benchmark.runAll();
    benchmark.printResults(results);
  } catch (error) {
    console.error('❌ Error en benchmarks:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { QueueBenchmark, BenchmarkResults };
