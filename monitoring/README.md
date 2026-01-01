# Anclora Monitoring & Observability

Stack completo de monitoreo para Anclora WhatsApp integration.

## 📋 Stack Components

- **Prometheus** - Metrics collection and storage
- **Grafana** - Visualization and dashboards
- **Alertmanager** - Alert routing and notifications
- **Winston** - Application logging
- **Sentry** - Error tracking and performance monitoring
- **Node Exporter** - System metrics
- **Redis Exporter** - Redis metrics
- **Loki** - Log aggregation (optional)
- **Promtail** - Log shipping (optional)

---

## 🚀 Quick Start

### 1. Start Monitoring Stack

```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. Access Dashboards

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana | http://localhost:3001 | admin / anclora2024 |
| Prometheus | http://localhost:9090 | - |
| Alertmanager | http://localhost:9093 | - |

### 3. Configure Environment

```bash
# Copy env template
cp .env.monitoring.example .env.monitoring

# Edit with your credentials
nano .env.monitoring
```

Required variables:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
ALERT_EMAIL_TO=alerts@anclora.com
ALERT_EMAIL_FROM=noreply@anclora.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your-app-password
SENTRY_DSN=https://your-sentry-dsn
```

---

## 📊 Dashboards

### Queue Manager Dashboard

Métricas del sistema de colas:
- Throughput (req/s)
- Processing latency (P50, P95, P99)
- Queue depth (waiting, active, DLQ)
- Success vs Failed messages
- Error rate
- Bulk operations

**Import:** `dashboards/queue-dashboard.json`

### Analytics Dashboard

Métricas de mensajería y conversiones:
- Message flow (sent → delivered → read)
- Delivery & read rates
- Active conversations
- Response times
- Conversions by type
- Revenue tracking
- Handoffs to human agents

**Import:** `dashboards/analytics-dashboard.json`

### System Dashboard

Métricas del sistema:
- CPU usage
- Memory usage
- Event loop lag
- Redis performance
- Disk usage

**Import:** `dashboards/system-dashboard.json` (crear si necesario)

---

## 🔔 Alerting

### Alert Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | System down or severely degraded | Immediate (< 5min) |
| Warning | Potential issue or degraded performance | 30 minutes |
| Info | Notable event or metric threshold | Review daily |

### Alert Channels

**Critical Alerts:**
- Slack: #anclora-critical
- Email: alerts@anclora.com
- PagerDuty: On-call rotation

**Warning Alerts:**
- Slack: #anclora-warnings
- Email: alerts@anclora.com

**Info Alerts:**
- Slack: #anclora-info

**Business Alerts:**
- Slack: #anclora-business

### Configured Alerts

#### Queue Alerts
- ✅ High queue latency (P99 > 500ms)
- ✅ Critical queue latency (P99 > 1s)
- ✅ High queue backlog (> 10,000 messages)
- ✅ Critical queue backlog (> 50,000 messages)
- ✅ High error rate (> 1%)
- ✅ Critical error rate (> 5%)
- ✅ High DLQ messages (> 1,000)
- ✅ Queue processing stopped

#### Analytics Alerts
- ✅ Low delivery rate (< 80%)
- ✅ Critical delivery rate (< 50%)
- ✅ High response time (P95 > 300s)
- ✅ High handoff rate (> 0.5/s)

#### WhatsApp Alerts
- ✅ High API latency (P95 > 2s)
- ✅ API errors (5xx rate > 0.1/s)
- ✅ Rate limit hits
- ✅ No active instances

#### System Alerts
- ✅ High memory usage (> 768MB)
- ✅ Critical memory usage (> 1GB)
- ✅ High event loop lag (> 100ms)
- ✅ High CPU usage (> 80%)

#### Business Alerts
- ✅ No conversions today (after 6h)
- ✅ Low lead capture rate
- ✅ High value sale (> €5M)

---

## 📈 Metrics

### Application Metrics

Exposed at `/metrics` endpoint:

```typescript
import { 
  recordQueueMessage,
  recordMessageSent,
  recordConversion 
} from './monitoring/metrics/prometheus-metrics';

// Queue
recordQueueMessage('high', 'text');

// Analytics
recordMessageSent('text', 'campaign-123');

// Conversions
recordConversion('sale', 2500000, 'campaign-123');
```

### Available Metrics

#### Queue Metrics
```promql
anclora_queue_messages_total
anclora_queue_messages_processed_total
anclora_queue_messages_failed_total
anclora_queue_processing_duration_seconds
anclora_queue_waiting_messages
anclora_queue_active_messages
anclora_queue_dlq_messages
```

#### Analytics Metrics
```promql
anclora_analytics_messages_sent_total
anclora_analytics_messages_delivered_total
anclora_analytics_messages_read_total
anclora_analytics_conversions_total
anclora_analytics_conversion_value_euros
anclora_analytics_response_time_seconds
```

#### WhatsApp Metrics
```promql
anclora_whatsapp_api_calls_total
anclora_whatsapp_api_latency_seconds
anclora_whatsapp_active_instances
anclora_whatsapp_rate_limit_hits_total
```

---

## 📝 Logging

### Winston Logger

```typescript
import { 
  logger,
  queueLogger,
  analyticsLogger,
  logError 
} from './monitoring/logging/winston-logger';

// General logging
logger.info('Application started');

// Component-specific
queueLogger.debug('Processing job', { jobId: '123' });

// Error logging
logError(error, { context: 'queue-processor' });
```

### Log Levels

```
fatal: 0
error: 1
warn: 2
info: 3
http: 4
debug: 5
trace: 6
```

### Log Files

```
logs/
├── anclora-YYYY-MM-DD.log       # All logs
├── anclora-error-YYYY-MM-DD.log # Errors only
└── anclora-http-YYYY-MM-DD.log  # HTTP requests
```

### Log Rotation

- Max file size: 20MB
- Retention: 14 days (all), 30 days (errors), 7 days (http)
- Compression: gzip after rotation

---

## 🐛 Error Tracking (Sentry)

### Initialize Sentry

```typescript
import { initSentry } from './monitoring/errors/sentry-integration';

initSentry({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  release: '1.0.0',
  enabled: true,
});
```

### Capture Errors

```typescript
import { 
  captureException,
  captureMessage,
  withSentry 
} from './monitoring/errors/sentry-integration';

// Exception
try {
  // code
} catch (error) {
  captureException(error, {
    tags: { component: 'queue' },
    extra: { jobId: '123' },
  });
}

// Message
captureMessage('Important event', 'info');

// Wrap async function
const processMessage = withSentry(async (job) => {
  // processing logic
}, { operation: 'queue.process' });
```

---

## 🏥 Health Checks

### Endpoints

```bash
# Comprehensive health check
curl http://localhost:3000/health

# Liveness (is app running?)
curl http://localhost:3000/health/live

# Readiness (ready for traffic?)
curl http://localhost:3000/health/ready
```

### Health Status

```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T12:00:00Z",
  "uptime": 3600,
  "checks": {
    "redis": { "status": "pass", "duration": 5 },
    "queue": { "status": "pass", "duration": 12 },
    "memory": { 
      "status": "pass",
      "details": { "heapUsedMB": 256, "rssMB": 512 }
    }
  }
}
```

---

## 🔍 Querying Metrics

### Prometheus Queries

**Queue throughput:**
```promql
rate(anclora_queue_messages_total[5m])
```

**P99 latency:**
```promql
histogram_quantile(0.99, 
  rate(anclora_queue_processing_duration_seconds_bucket[5m])
)
```

**Error rate:**
```promql
100 * rate(anclora_queue_messages_failed_total[5m]) / 
  (rate(anclora_queue_messages_processed_total[5m]) + 
   rate(anclora_queue_messages_failed_total[5m]))
```

**Delivery rate:**
```promql
100 * rate(anclora_analytics_messages_delivered_total[5m]) / 
  rate(anclora_analytics_messages_sent_total[5m])
```

---

## 🛠️ Troubleshooting

### High Memory Usage

1. Check heap snapshot:
```bash
npm run profile:heap
```

2. Review memory metrics:
```promql
anclora_nodejs_heap_used_bytes / 1024 / 1024
```

3. Look for memory leaks:
```bash
npm run profile:leaks
```

### High Latency

1. Check event loop lag:
```promql
anclora_nodejs_eventloop_lag_seconds
```

2. Profile CPU:
```bash
npm run profile:cpu
```

3. Generate flame graph:
```bash
npm run profile:flame
```

### Missing Metrics

1. Verify app is exposing metrics:
```bash
curl http://localhost:3000/metrics
```

2. Check Prometheus targets:
http://localhost:9090/targets

3. Verify Prometheus config:
```bash
docker exec anclora-prometheus promtool check config /etc/prometheus/prometheus.yml
```

---

## 📊 Grafana Setup

### Import Dashboards

1. Login to Grafana: http://localhost:3001
2. Click "+" → Import
3. Upload dashboard JSON file
4. Select Prometheus datasource
5. Click Import

### Create Custom Dashboard

```bash
# Navigate to Grafana
http://localhost:3001

# Create → Dashboard → Add Panel
# Query: rate(anclora_queue_messages_total[5m])
# Visualization: Graph
# Save
```

---

## 🚨 Alert Testing

### Trigger Test Alerts

```bash
# Simulate high latency
curl -X POST http://localhost:3000/test/high-latency

# Simulate errors
curl -X POST http://localhost:3000/test/errors

# Simulate memory pressure
curl -X POST http://localhost:3000/test/memory-pressure
```

### Silence Alerts

```bash
# Via Alertmanager UI
http://localhost:9093

# Or via API
curl -X POST http://localhost:9093/api/v1/silences \
  -d '{
    "matchers": [{"name":"alertname","value":"HighQueueLatency"}],
    "startsAt": "2026-01-01T12:00:00Z",
    "endsAt": "2026-01-01T14:00:00Z",
    "comment": "Maintenance window"
  }'
```

---

## 📚 Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [Winston Docs](https://github.com/winstonjs/winston)
- [Sentry Docs](https://docs.sentry.io/)
- [PromQL Guide](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## 🔐 Security

- Change default Grafana password
- Restrict Prometheus/Grafana access via firewall
- Use HTTPS in production
- Rotate Sentry DSN if compromised
- Sanitize sensitive data in logs/metrics
