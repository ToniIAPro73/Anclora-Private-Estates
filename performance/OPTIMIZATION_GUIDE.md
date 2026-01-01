# Performance Optimization Guide

## 📋 Tabla de Contenidos

1. [Overview](#overview)
2. [Performance Targets](#performance-targets)
3. [Redis Optimization](#redis-optimization)
4. [BullMQ Optimization](#bullmq-optimization)
5. [Node.js Optimization](#nodejs-optimization)
6. [Database Optimization](#database-optimization)
7. [Load Testing](#load-testing)
8. [Profiling & Debugging](#profiling--debugging)
9. [Monitoring](#monitoring)
10. [Best Practices](#best-practices)

---

## Overview

Esta guía detalla las optimizaciones implementadas y recomendaciones para mantener el alto rendimiento del sistema WhatsApp + Queue + Analytics.

### Objetivos de Performance

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Queue Add Latency P99 | < 100ms | < 200ms |
| Analytics Write P99 | < 200ms | < 500ms |
| Read Operations P99 | < 50ms | < 100ms |
| Throughput Queue | > 1000 req/s | > 500 req/s |
| Throughput Analytics | > 500 req/s | > 250 req/s |
| Error Rate | < 0.1% | < 1% |
| Memory Usage | < 512MB | < 1GB |

---

## Performance Targets

### Latency Targets

```typescript
// Queue Operations
- P50: < 10ms
- P95: < 50ms
- P99: < 100ms

// Analytics Operations
- P50: < 20ms
- P95: < 100ms
- P99: < 200ms

// WhatsApp API Calls
- P50: < 100ms
- P95: < 500ms
- P99: < 1000ms
```

### Throughput Targets

```
Queue Manager:    1000+ req/s
Analytics:        500+ req/s
WhatsApp Client:  100+ req/s
Read Operations:  2000+ req/s
Write Operations: 800+ req/s
```

---

## Redis Optimization

### 1. Connection Pooling

```typescript
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // Pool configuration
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  enableReadyCheck: true,
  
  // Retry strategy
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});
```

**Rationale:**
- Pool reutiliza conexiones → reduce overhead
- Retry exponencial → previene thundering herd
- Offline queue → maneja desconexiones temporales

### 2. Pipeline Operations

```typescript
// ❌ MAL - N llamadas individuales
for (const key of keys) {
  await redis.set(key, value);
}

// ✅ BIEN - 1 pipeline
const pipeline = redis.pipeline();
for (const key of keys) {
  pipeline.set(key, value);
}
await pipeline.exec();
```

**Mejora:** ~10x más rápido para operaciones batch

### 3. Data Structure Selection

| Use Case | Structure | Rationale |
|----------|-----------|-----------|
| Counters | String + INCR | O(1) atómico |
| Time series | Sorted Set | Range queries eficientes |
| Recent items | List + LTRIM | FIFO automático |
| Unique items | Set | Deduplicación O(1) |
| Expiring data | String + EXPIRE | Auto-cleanup |

### 4. Memory Optimization

```bash
# maxmemory policy
maxmemory 2gb
maxmemory-policy allkeys-lru

# Compression
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
```

### 5. Persistence Strategy

```bash
# Para analytics (data no crítica)
save 900 1
save 300 10
save 60 10000

# Para queue (data crítica)
appendonly yes
appendfsync everysec
```

---

## BullMQ Optimization

### 1. Worker Concurrency

```typescript
const worker = new Worker('queue-name', processor, {
  concurrency: 10,  // Procesa 10 jobs simultáneamente
  maxStalledCount: 3,
  stalledInterval: 30000,
  lockDuration: 30000,
});
```

**Tuning:**
- CPU-bound tasks: `concurrency = CPU cores`
- I/O-bound tasks: `concurrency = 2-4 × CPU cores`
- Monitor event loop lag para ajustar

### 2. Job Options

```typescript
await queue.add('send-message', data, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  // Cleanup automático
  removeOnComplete: {
    age: 24 * 3600,  // 24 horas
    count: 1000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600,  // 7 días
  },
});
```

### 3. Rate Limiting

```typescript
await queue.add('send-message', data, {
  rateLimiter: {
    max: 100,       // 100 jobs
    duration: 1000, // por segundo
  },
});
```

**Previene:**
- API rate limits
- Resource exhaustion
- Thundering herd

### 4. Priority Queues

```typescript
// Critical messages
await queue.add('message', data, { priority: 1 });

// Normal messages
await queue.add('message', data, { priority: 5 });

// Low priority
await queue.add('message', data, { priority: 10 });
```

---

## Node.js Optimization

### 1. Event Loop Monitoring

```typescript
import { monitorEventLoopDelay } from 'perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  console.log('Event loop lag:', h.mean);
  if (h.mean > 100) {
    console.warn('⚠️ High event loop lag!');
  }
}, 10000);
```

### 2. Memory Management

```bash
# Heap size
node --max-old-space-size=2048 server.js

# Garbage collection monitoring
node --expose-gc --trace-gc server.js
```

### 3. Cluster Mode

```typescript
import cluster from 'cluster';
import { cpus } from 'os';

if (cluster.isPrimary) {
  const numCPUs = cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  startServer();
}
```

**Beneficio:** Utiliza todos los cores disponibles

### 4. Stream Processing

```typescript
// ❌ MAL - carga todo en memoria
const data = await fetchLargeDataset();
processData(data);

// ✅ BIEN - stream processing
const stream = fetchLargeDatasetStream();
stream.pipe(processTransform).pipe(destination);
```

---

## Database Optimization

### 1. Connection Pooling (PostgreSQL)

```typescript
const pool = new Pool({
  min: 2,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Query Optimization

```sql
-- ❌ MAL - tabla scan
SELECT * FROM messages WHERE recipient LIKE '%123456%';

-- ✅ BIEN - index scan
SELECT * FROM messages WHERE recipient = '34600123456';

-- Index
CREATE INDEX idx_messages_recipient ON messages(recipient);
CREATE INDEX idx_messages_status_created ON messages(status, created_at);
```

### 3. Prepared Statements

```typescript
// ✅ BIEN - prepared statement
const query = 'SELECT * FROM messages WHERE id = $1';
await client.query(query, [messageId]);
```

---

## Load Testing

### Running Load Tests

```bash
# Smoke test
npm run perf:smoke

# Load test
npm run perf:load

# Stress test
npm run perf:stress

# Endurance test (24h)
npm run perf:endurance

# Spike test
npm run perf:spike
```

### Artillery Tests

```bash
# Queue load test
artillery run performance/load-tests/queue-load-test.yml

# Analytics load test
artillery run performance/load-tests/analytics-load-test.yml

# Custom scenario
artillery run -e production my-test.yml
```

### Autocannon Benchmarks

```bash
# Queue benchmarks
npm run bench:queue

# Redis benchmarks
npm run bench:redis

# All benchmarks
npm run bench:all
```

---

## Profiling & Debugging

### 1. CPU Profiling

```bash
# Generate CPU profile
node --cpu-prof server.js

# Or via script
npm run profile:cpu
```

### 2. Memory Profiling

```bash
# Heap snapshot
npm run profile:heap

# Memory leak detection
npm run profile:leaks

# Comprehensive profiling
npm run profile:all
```

### 3. Flame Graphs

```bash
# Generate flame graph
npm run profile:flame

# View in browser
open performance/profiles/flame-*/flamegraph.html
```

### 4. Chrome DevTools

```bash
# Start with inspector
node --inspect server.js

# Open chrome://inspect
# Click "Open dedicated DevTools"
```

### 5. Clinic.js Suite

```bash
# Doctor - general health
clinic doctor -- node server.js

# Flame - CPU profiling
clinic flame -- node server.js

# Bubbleprof - async operations
clinic bubbleprof -- node server.js

# Heap profiler - memory
clinic heapprofiler -- node server.js
```

---

## Monitoring

### 1. Real-time Metrics

```typescript
import { register, Counter, Histogram } from 'prom-client';

const messageCounter = new Counter({
  name: 'messages_sent_total',
  help: 'Total messages sent',
});

const latencyHistogram = new Histogram({
  name: 'message_send_duration_seconds',
  help: 'Message send duration',
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});
```

### 2. Health Checks

```typescript
app.get('/health', async (req, res) => {
  const checks = {
    redis: await checkRedis(),
    queue: await checkQueue(),
    memory: checkMemory(),
    eventLoop: checkEventLoop(),
  };
  
  const healthy = Object.values(checks).every(c => c.healthy);
  res.status(healthy ? 200 : 503).json(checks);
});
```

### 3. Alerting Thresholds

```yaml
alerts:
  - name: HighLatency
    condition: p99_latency > 500ms
    for: 5m
    
  - name: HighErrorRate
    condition: error_rate > 1%
    for: 2m
    
  - name: MemoryLeak
    condition: heap_growth > 50%
    for: 1h
```

---

## Best Practices

### 1. Async/Await Patterns

```typescript
// ❌ MAL - secuencial innecesario
const user = await getUser(id);
const posts = await getPosts(id);
const comments = await getComments(id);

// ✅ BIEN - paralelo
const [user, posts, comments] = await Promise.all([
  getUser(id),
  getPosts(id),
  getComments(id),
]);
```

### 2. Error Handling

```typescript
// ✅ BIEN - graceful degradation
try {
  await sendToQueue(message);
} catch (error) {
  logger.error('Queue error:', error);
  await saveToDLQ(message);
  // Continue processing
}
```

### 3. Resource Cleanup

```typescript
// ✅ BIEN - cleanup en shutdown
process.on('SIGTERM', async () => {
  await queue.close();
  await redis.quit();
  await pool.end();
  process.exit(0);
});
```

### 4. Caching Strategy

```typescript
// L1: In-memory cache (fast, small)
const cache = new Map();

// L2: Redis cache (medium, large)
async function get(key) {
  // Try L1
  if (cache.has(key)) return cache.get(key);
  
  // Try L2
  const value = await redis.get(key);
  if (value) {
    cache.set(key, value);
    return value;
  }
  
  // Fetch from source
  const data = await fetchFromDB(key);
  redis.setex(key, 3600, data);
  cache.set(key, data);
  return data;
}
```

### 5. Batching

```typescript
// ✅ BIEN - batch processing
const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 1000;

const batch = [];
const timer = setInterval(flush, FLUSH_INTERVAL);

function add(item) {
  batch.push(item);
  if (batch.length >= BATCH_SIZE) {
    flush();
  }
}

function flush() {
  if (batch.length === 0) return;
  processBatch(batch.splice(0));
}
```

---

## Performance Checklist

### Before Deployment

- [ ] Run load tests
- [ ] Check memory usage under load
- [ ] Verify error rates < 1%
- [ ] Profile CPU usage
- [ ] Test recovery from failures
- [ ] Validate rate limiting
- [ ] Check log performance
- [ ] Review database queries
- [ ] Test with production data volume

### Continuous Monitoring

- [ ] Track P99 latencies
- [ ] Monitor error rates
- [ ] Watch memory growth
- [ ] Check event loop lag
- [ ] Review queue depths
- [ ] Analyze slow queries
- [ ] Verify cache hit rates
- [ ] Monitor Redis memory

---

## Troubleshooting

### High Latency

1. Check event loop lag
2. Profile CPU usage
3. Review slow queries
4. Check Redis latency
5. Verify network latency

### Memory Growth

1. Take heap snapshot
2. Compare snapshots over time
3. Look for unbounded arrays/maps
4. Check for event listener leaks
5. Verify cleanup logic

### High Error Rate

1. Check logs for patterns
2. Review rate limiting
3. Verify external service health
4. Check retry logic
5. Validate input data

---

## Resources

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Redis Performance](https://redis.io/topics/benchmarks)
- [BullMQ Guide](https://docs.bullmq.io/)
- [Artillery Docs](https://www.artillery.io/docs)
- [Clinic.js](https://clinicjs.org/)
