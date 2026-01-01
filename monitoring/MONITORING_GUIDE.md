# Monitoring & Observability Guide

## 📋 Tabla de Contenidos

1. [Overview](#overview)
2. [Stack de Monitoreo](#stack-de-monitoreo)
3. [Métricas](#métricas)
4. [Logging](#logging)
5. [Health Checks](#health-checks)
6. [Alerting](#alerting)
7. [Dashboards](#dashboards)
8. [Error Tracking](#error-tracking)
9. [Quick Start](#quick-start)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Sistema completo de monitoreo y observabilidad para Anclora WhatsApp Integration:

- **Métricas**: Prometheus + prom-client
- **Visualización**: Grafana
- **Alerting**: Alertmanager
- **Logs**: Winston + Loki + Promtail
- **Error Tracking**: Sentry
- **Health Checks**: Custom health check system

---

## Stack de Monitoreo

### Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Queue   │  │Analytics │  │ WhatsApp │             │
│  │ Manager  │  │ Manager  │  │  Client  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                     │                                   │
│              ┌──────▼──────┐                           │
│              │   Metrics   │                           │
│              │  /metrics   │                           │
│              └──────┬──────┘                           │
└─────────────────────┼──────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
    ┌────▼─────┐ ┌───▼────┐ ┌────▼──────┐
    │Prometheus│ │Winston │ │  Sentry   │
    │          │ │ Logger │ │           │
    └────┬─────┘ └───┬────┘ └───────────┘
         │           │
    ┌────▼─────┐ ┌──▼─────┐
    │Alertmgr  │ │  Loki  │
    └────┬─────┘ └───┬────┘
         │           │
    ┌────▼───────────▼─────┐
    │      Grafana         │
    │   (Visualization)    │
    └──────────────────────┘
```

### Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Prometheus | 9090 | Metrics collection |
| Grafana | 3001 | Visualization |
| Alertmanager | 9093 | Alert routing |
| Loki | 3100 | Log aggregation |
| Redis Exporter | 9121 | Redis metrics |
| Node Exporter | 9100 | System metrics |

---

## Métricas

### Tipos de Métricas

**Counters** (valores que solo crecen):
- `anclora_queue_messages_total` - Total mensajes encolados
- `anclora_analytics_messages_sent_total` - Mensajes enviados
- `anclora_whatsapp_api_calls_total` - Llamadas API

**Histograms** (distribuciones):
- `anclora_queue_processing_duration_seconds` - Duración procesamiento
- `anclora_whatsapp_api_latency_seconds` - Latencia API
- `anclora_analytics_response_time_seconds` - Tiempo respuesta

**Gauges** (valores que suben/bajan):
- `anclora_queue_waiting_messages` - Mensajes esperando
- `anclora_queue_active_messages` - Mensajes en proceso
- `anclora_analytics_active_conversations` - Conversaciones activas

### Categorías

#### Queue Metrics

```promql
# Rate de mensajes encolados
rate(anclora_queue_messages_total[5m])

# P99 latency de procesamiento
histogram_quantile(0.99, rate(anclora_queue_processing_duration_seconds_bucket[5m]))

# Error rate
rate(anclora_queue_messages_failed_total[5m]) / rate(anclora_queue_messages_total[5m]) * 100
```

#### Analytics Metrics

```promql
# Mensajes enviados por tipo
sum by (message_type) (rate(anclora_analytics_messages_sent_total[1h]))

# Tasa de conversión
rate(anclora_analytics_conversions_total{conversion_type="sale"}[1h])

# Conversaciones activas
anclora_analytics_active_conversations
```

#### WhatsApp Metrics

```promql
# Latencia API por endpoint
histogram_quantile(0.95, rate(anclora_whatsapp_api_latency_seconds_bucket[5m]))

# Rate limit hits
rate(anclora_whatsapp_rate_limit_hits_total[5m])

# Instancias activas
anclora_whatsapp_active_instances
```

#### System Metrics

```promql
# Heap memory
anclora_nodejs_heap_size_used_bytes / 1024 / 1024

# Event loop lag
anclora_nodejs_eventloop_lag_seconds * 1000

# CPU usage
rate(anclora_process_cpu_seconds_total[5m]) * 100
```

---

## Logging

### Configuración Winston

**Log Levels:**
- `fatal` - Errores críticos que requieren atención inmediata
- `error` - Errores que deben investigarse
- `warn` - Advertencias
- `info` - Información general
- `http` - Requests HTTP
- `debug` - Debugging
- `trace` - Tracing detallado

**Transportes:**
- Console (desarrollo)
- Daily Rotate File (producción)
- Elasticsearch (opcional)

**Archivos de Log:**
```
logs/
├── anclora-YYYY-MM-DD.log        # Todos los logs
├── anclora-error-YYYY-MM-DD.log  # Solo errores
└── anclora-http-YYYY-MM-DD.log   # HTTP requests
```

### Uso

```typescript
import { logger, queueLogger, analyticsLogger } from './winston-logger';

// Log general
logger.info('Application started', { port: 3000 });

// Log específico de componente
queueLogger.info('Message queued', { messageId, priority });

// Log de error con stack
logger.error('Processing failed', {
  error: {
    message: error.message,
    stack: error.stack,
  },
});
```

### Queries en Loki

```logql
# Errores de queue
{job="anclora-whatsapp", component="queue", level="error"}

# HTTP requests lentos
{job="anclora-http"} | json | duration > 1000

# Filtrar por tiempo
{job="anclora-whatsapp"} | json | __timestamp__ > 1h
```

---

## Health Checks

### Endpoints

**Liveness** (aplicación corriendo):
```bash
GET /health/live
Response: { "status": "ok" }
```

**Readiness** (listo para tráfico):
```bash
GET /health/ready
Response: { "status": "ready" }
```

**Health completo**:
```bash
GET /health
Response:
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2026-01-01T12:00:00Z",
  "uptime": 3600,
  "checks": {
    "redis": { "status": "healthy", ... },
    "queue": { "status": "healthy", ... },
    "memory": { "status": "healthy", ... },
    ...
  }
}
```

### Status

- **healthy** - Todo funcional
- **degraded** - Problemas menores
- **unhealthy** - Problemas críticos

### Implementación

```typescript
import { getSystemHealth } from './health-checks';

app.get('/health', async (req, res) => {
  const health = await getSystemHealth(redis, redisAnalytics, queue);
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## Alerting

### Niveles de Severidad

**Critical** 🚨
- Notificación inmediata
- Email + Slack + PagerDuty
- Repeat: 5 minutos

**Warning** ⚠️
- Notificación throttled
- Slack
- Repeat: 3 horas

**Info** ℹ️
- Digest diario
- Slack
- Repeat: 24 horas

### Alertas Principales

#### Queue Alerts

- **HighQueueLatency**: P99 > 100ms durante 5min
- **CriticalQueueLatency**: P99 > 500ms durante 2min
- **HighErrorRate**: Error rate > 1% durante 5min
- **QueueStuck**: >1000 waiting, 0 active durante 5min
- **HighDLQCount**: >100 mensajes en DLQ

#### WhatsApp Alerts

- **HighWhatsAppAPILatency**: P99 > 2s durante 5min
- **WhatsAppAPIErrors**: >5% errores 5xx
- **RateLimitHit**: Rate limits activos
- **NoActiveInstances**: 0 instancias activas

#### System Alerts

- **HighMemoryUsage**: Heap > 768MB
- **CriticalMemoryUsage**: Heap > 1024MB
- **MemoryLeak**: Crecimiento >50% en 1h
- **HighEventLoopLag**: Lag > 100ms
- **HighCPUUsage**: CPU > 80%

### Configuración

Ver `monitoring/alerting/prometheus-alerts.yml`

---

## Dashboards

### System Overview

Dashboard principal con:
- Queue metrics (rate, latency, status)
- Analytics (mensajes, conversiones)
- WhatsApp API (latency, errors)
- System resources (memory, CPU, event loop)
- Business metrics (leads, appointments)

**Acceso**: http://localhost:3001/d/system-overview

### Importar Dashboards

```bash
# Via Grafana UI
1. Grafana → Dashboards → Import
2. Cargar monitoring/dashboards/grafana-system-overview.json
3. Seleccionar datasource: Prometheus

# Via API
curl -X POST http://admin:admin@localhost:3001/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @monitoring/dashboards/grafana-system-overview.json
```

### Crear Dashboards Personalizados

1. Grafana → Create → Dashboard
2. Add panel
3. Query: PromQL
4. Visualization: Graph/Stat/Table/etc
5. Save dashboard

---

## Error Tracking

### Sentry Configuration

```typescript
import { initializeSentry } from './sentry-config';

// Inicializar
initializeSentry({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1,
});
```

### Uso

```typescript
// Capturar excepción
import { captureException } from './sentry-config';

try {
  await processMessage();
} catch (error) {
  captureException(error, {
    messageId,
    priority,
  });
  throw error;
}

// Track error específico
trackQueueError(jobId, error, jobData);
trackWhatsAppError(endpoint, statusCode, error);
```

### Features

- Error grouping & fingerprinting
- Stack traces
- Breadcrumbs
- Performance monitoring
- Release tracking
- User context

---

## Quick Start

### 1. Iniciar Stack

```bash
# Dar permisos
chmod +x monitoring/scripts/monitoring.sh

# Iniciar todo
./monitoring/scripts/monitoring.sh start

# Verificar salud
./monitoring/scripts/monitoring.sh health
```

### 2. Acceder a UIs

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093

### 3. Ver Métricas

```bash
# Ver métricas actuales
./monitoring/scripts/monitoring.sh metrics

# Ver alertas activas
./monitoring/scripts/monitoring.sh alerts

# Ver logs
./monitoring/scripts/monitoring.sh logs
```

### 4. Configurar Sentry

```bash
# .env
SENTRY_DSN=https://...
SENTRY_ENABLED=true
SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## Troubleshooting

### Prometheus no scraping

```bash
# Verificar targets
curl http://localhost:9090/api/v1/targets | jq

# Verificar config
docker-compose -f monitoring/docker-compose.monitoring.yml exec prometheus \
  promtool check config /etc/prometheus/prometheus.yml

# Reload config
./monitoring/scripts/monitoring.sh reload
```

### Grafana sin datos

```bash
# Verificar datasources
curl -u admin:admin http://localhost:3001/api/datasources | jq

# Test connection
curl -u admin:admin http://localhost:3001/api/datasources/1/health
```

### Alertas no funcionan

```bash
# Verificar rules
curl http://localhost:9090/api/v1/rules | jq

# Verificar alertmanager
curl http://localhost:9093/api/v2/alerts | jq

# Ver logs
docker-compose -f monitoring/docker-compose.monitoring.yml logs alertmanager
```

### Memory issues

```bash
# Ver uso actual
./monitoring/scripts/monitoring.sh health

# Profile memory
npm run profile:heap

# Monitor en tiempo real
npm run profile:monitor
```

---

## Best Practices

### Métricas

1. **Nombrar consistentemente**: Use prefijo `anclora_`
2. **Labels útiles**: message_type, priority, campaign_id
3. **Evitar high cardinality**: No IDs únicos en labels
4. **Documentar métricas**: Comentarios en código

### Logging

1. **Usar niveles apropiados**: info para eventos, error para errores
2. **Contexto suficiente**: Incluir IDs, timestamps, metadata
3. **No loggear PII**: Passwords, tokens, datos sensibles
4. **Structured logging**: JSON en producción

### Alerting

1. **Evitar alert fatigue**: Solo alertas accionables
2. **Severidad correcta**: Critical solo para urgencias
3. **Mensajes claros**: Descripción + acción recomendada
4. **Test alerts**: Verificar antes de producción

### Dashboards

1. **Organizar por audiencia**: Ops, Dev, Business
2. **Variables**: Para filtros dinámicos
3. **Annotations**: Marcar deployments
4. **Compartir**: Export/import JSON

---

## Comandos Útiles

```bash
# Monitoreo
./monitoring/scripts/monitoring.sh start|stop|restart
./monitoring/scripts/monitoring.sh health
./monitoring/scripts/monitoring.sh metrics
./monitoring/scripts/monitoring.sh alerts
./monitoring/scripts/monitoring.sh logs [service]
./monitoring/scripts/monitoring.sh stats

# Performance
npm run perf:load
npm run bench:all
npm run profile:all

# Health check directo
curl http://localhost:3000/health | jq
curl http://localhost:3000/metrics
```

---

## Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [Winston Docs](https://github.com/winstonjs/winston)
- [Sentry Docs](https://docs.sentry.io/)
- [PromQL Cheatsheet](https://promlabs.com/promql-cheat-sheet/)
