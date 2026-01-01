# WhatsApp Queue & Analytics System

Sistema completo de gestión de colas y analytics para WhatsApp con BullMQ + Redis

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Instalación](#instalación)
4. [Queue Management](#queue-management)
5. [Analytics System](#analytics-system)
6. [Integración](#integración)
7. [Monitoreo](#monitoreo)
8. [Best Practices](#best-practices)

---

## Descripción General

### Sistema de Colas (Queue Management)

**Archivo:** `lib/whatsapp-queue.ts` (441 líneas)

Gestión avanzada de mensajes WhatsApp con:
- ✅ Procesamiento asíncrono
- ✅ Rate limiting (80 msg/min WhatsApp oficial)
- ✅ Retry logic con backoff exponencial
- ✅ Priorización de mensajes
- ✅ Dead Letter Queue (DLQ)
- ✅ Scheduled messages
- ✅ Bulk operations

**Stack:** BullMQ + Redis + IORedis

### Sistema de Analytics

**Archivo:** `lib/whatsapp-analytics.ts` (600 líneas)

Métricas en tiempo real:
- ✅ Tracking mensajes (enviados/recibidos/fallidos/leídos)
- ✅ Métricas conversación (tiempo respuesta, tasa respuesta)
- ✅ Analytics conversión (leads, citas, ventas)
- ✅ Métricas campañas (ROI, engagement)
- ✅ Reportes y time series
- ✅ Performance metrics

**Stack:** Redis + IORedis

---

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                   APLICACIÓN                          │
│   (Next.js API Routes, n8n Workflows, Bots)          │
└──────────────────┬───────────────────────────────────┘
                   │
       ┌───────────┴────────────┐
       │                        │
┌──────▼──────┐        ┌───────▼────────┐
│   QUEUE     │        │   ANALYTICS     │
│  MANAGER    │        │    MANAGER      │
└──────┬──────┘        └───────┬─────────┘
       │                       │
       │    ┌─────────────────┘
       │    │
┌──────▼────▼─────┐
│     REDIS        │
│  ┌─────┬─────┐  │
│  │ DB0 │ DB1 │  │ (Separar Queue de Analytics)
│  │Queue│Analy│  │
│  └─────┴─────┘  │
└─────────┬────────┘
          │
┌─────────▼─────────┐
│  EVOLUTION API     │
│   (WhatsApp)       │
└────────────────────┘
```

---

## Instalación

### Requisitos

```bash
# Dependencias npm
npm install bullmq ioredis
npm install --save-dev @types/ioredis

# Redis (Docker)
docker run -d \
  --name redis-whatsapp \
  -p 6379:6379 \
  redis:7-alpine
```

### Variables de Entorno

```bash
# .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0              # Queue
REDIS_ANALYTICS_DB=1    # Analytics

EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=your-key
```

### Verificar Redis

```bash
# Test conexión
redis-cli ping
# Output: PONG

# Ver bases de datos
redis-cli
SELECT 0  # Queue
KEYS *
SELECT 1  # Analytics
KEYS *
```

---

## Queue Management

### Configuración Básica

```typescript
import { createQueueManager } from './lib/whatsapp-queue';

const queueManager = createQueueManager({
  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
    db: 0,
  },
  rateLimiting: {
    max: 80,        // 80 mensajes por ventana
    duration: 60000, // 1 minuto
  },
  retry: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,  // 2s → 4s → 8s
    },
  },
  concurrency: 5,   // 5 workers simultáneos
});
```

### Uso: Enviar Mensaje

```typescript
// Mensaje simple
const job = await queueManager.addMessage({
  instanceName: 'anclora-main',
  recipientPhone: '34600111222',
  messageType: 'text',
  content: {
    text: '¡Hola! Gracias por contactarnos.',
  },
  metadata: {
    contactId: 'contact-123',
    priority: 'normal',
  },
});

console.log(`Job ID: ${job.id}`);
```

### Uso: Mensajes Prioritarios

```typescript
// Critical (máxima prioridad)
await queueManager.addMessage({
  ...message,
  metadata: { priority: 'critical' }, // 1
});

// High
await queueManager.addMessage({
  ...message,
  metadata: { priority: 'high' }, // 2
});

// Normal (default)
await queueManager.addMessage({
  ...message,
  metadata: { priority: 'normal' }, // 3
});

// Low
await queueManager.addMessage({
  ...message,
  metadata: { priority: 'low' }, // 4
});
```

### Uso: Bulk Messages

```typescript
const messages = [
  { phone: '34600111222', text: 'Hola Juan' },
  { phone: '34600222333', text: 'Hola María' },
].map(m => ({
  instanceName: 'anclora-main',
  recipientPhone: m.phone,
  messageType: 'text',
  content: { text: m.text },
}));

const jobs = await queueManager.addBulk(messages);
console.log(`${jobs.length} mensajes en cola`);
```

### Uso: Schedule Messages

```typescript
// Programar para 1 hora después
const scheduledTime = new Date();
scheduledTime.setHours(scheduledTime.getHours() + 1);

await queueManager.scheduleMessage(message, scheduledTime);
```

### Dead Letter Queue (DLQ)

```typescript
// Obtener mensajes fallidos
const dlqMessages = await queueManager.getDLQMessages(10);

dlqMessages.forEach(msg => {
  console.log(`Job ${msg.jobId}: ${msg.error}`);
  console.log(`Intentos: ${msg.attempts}`);
});

// Reintentar mensaje
await queueManager.retryDLQMessage('job-id-123');

// Limpiar DLQ
await queueManager.clearDLQ();
```

### Métricas de Cola

```typescript
const metrics = await queueManager.getMetrics();

console.log(`Esperando: ${metrics.waiting}`);
console.log(`Activos: ${metrics.active}`);
console.log(`Completados: ${metrics.completed}`);
console.log(`Fallidos: ${metrics.failed}`);

// Tasa de procesamiento
const rate = await queueManager.getProcessingRate();
console.log(`${rate} mensajes/min`);
```

### Gestión de Cola

```typescript
// Pausar
await queueManager.pause();

// Reanudar
await queueManager.resume();

// Drenar (procesar pending)
await queueManager.drain();

// Limpiar completed/failed
await queueManager.clean(0, 1000);

// Cerrar
await queueManager.close();
```

---

## Analytics System

### Configuración Básica

```typescript
import { createAnalyticsManager } from './lib/whatsapp-analytics';

const analytics = createAnalyticsManager({
  host: 'localhost',
  port: 6379,
  db: 1,  // DB separada
});
```

### Tracking de Eventos

```typescript
// Mensaje enviado
await analytics.trackMessageSent(
  '34600111222',
  'text',
  {
    templateId: 'welcome',
    campaignId: 'onboarding-2026',
  }
);

// Mensaje recibido
await analytics.trackMessageReceived(
  '34600111222',
  'text',
  {
    intent: 'property_inquiry',
    sentiment: 'positive',
  }
);

// Mensaje fallido
await analytics.trackMessageFailed(
  '34600111222',
  'Number not on WhatsApp',
  { errorCode: 404 }
);

// Mensaje entregado
await analytics.trackMessageDelivered('34600111222', 'msg-id-123');

// Mensaje leído
await analytics.trackMessageRead('34600111222', 'msg-id-123');
```

### Tracking de Conversaciones

```typescript
// Conversación iniciada
await analytics.trackConversationStarted(
  '34600111222',
  'inbound',  // o 'outbound'
  { source: 'website_form' }
);

// Conversación finalizada
await analytics.trackConversationEnded(
  '34600111222',
  'completed'  // o 'timeout', 'handoff'
);

// Handoff a humano
await analytics.trackHandoff(
  '34600111222',
  'complex_inquiry'
);
```

### Tracking de Conversiones

```typescript
// Lead generado
await analytics.trackConversion('34600111222', 'lead');

// Lead calificado
await analytics.trackConversion(
  '34600111222',
  'qualified_lead',
  undefined,
  { leadScore: 85 }
);

// Cita agendada
await analytics.trackConversion(
  '34600111222',
  'appointment',
  undefined,
  { appointmentDate: '2026-01-15' }
);

// Venta cerrada
await analytics.trackConversion(
  '34600111222',
  'sale',
  500000,  // Valor en EUR
  { propertyId: 'prop-123' }
);
```

### Tracking de Campañas

```typescript
const campaignId = 'campaign-black-friday-2026';

// Eventos de campaña
await analytics.trackCampaign(campaignId, '34600111222', 'sent');
await analytics.trackCampaign(campaignId, '34600111222', 'delivered');
await analytics.trackCampaign(campaignId, '34600111222', 'read');
await analytics.trackCampaign(campaignId, '34600111222', 'response');
await analytics.trackCampaign(campaignId, '34600111222', 'conversion');

// Obtener métricas de campaña
const metrics = await analytics.getCampaignMetrics(campaignId);
console.log(`ROI: ${metrics.roi}%`);
console.log(`Conversiones: ${metrics.conversions}/${metrics.sent}`);
```

### Obtener Métricas

```typescript
// Métricas de mensajes
const messageMetrics = await analytics.getMessageMetrics();
console.log(`Enviados: ${messageMetrics.sent}`);
console.log(`Recibidos: ${messageMetrics.received}`);
console.log(`Tasa entrega: ${(messageMetrics.delivered/messageMetrics.sent)*100}%`);

// Métricas de conversación
const convMetrics = await analytics.getConversationMetrics();
console.log(`Conversaciones activas: ${convMetrics.activeConversations}`);
console.log(`Tiempo respuesta: ${convMetrics.averageResponseTime}s`);
console.log(`Tasa handoff: ${convMetrics.handoffRate}%`);

// Métricas de conversión
const conversionMetrics = await analytics.getConversionMetrics();
console.log(`Leads: ${conversionMetrics.leads}`);
console.log(`Ventas: ${conversionMetrics.sales}`);
console.log(`Tasa conversión: ${conversionMetrics.conversionRate}%`);

// Métricas de performance
const perfMetrics = await analytics.getPerformanceMetrics();
console.log(`Msg/hora: ${perfMetrics.messagesSentPerHour}`);
console.log(`Tiempo procesamiento: ${perfMetrics.averageProcessingTime}ms`);
console.log(`Tasa error: ${perfMetrics.errorRate}%`);
```

### Reportes

```typescript
// Reporte completo
const report = await analytics.generateReport('week');

console.log(`Período: ${report.period}`);
console.log('Mensajes:', report.messages);
console.log('Conversaciones:', report.conversations);
console.log('Conversiones:', report.conversions);
console.log('Performance:', report.performance);
console.log('Top 10:', report.topConversations);

// Time series (gráficos)
const timeSeries = await analytics.getMessageTimeSeries(7);
timeSeries.forEach(data => {
  console.log(`${data.timestamp}: ${data.value} mensajes`);
});
```

---

## Integración

### Next.js API Route + Queue + Analytics

```typescript
// app/api/whatsapp/send/route.ts

import { getQueueManager } from '@/lib/whatsapp-queue';
import { getAnalyticsManager } from '@/lib/whatsapp-analytics';

export async function POST(req: Request) {
  const { phone, text } = await req.json();
  
  const queue = getQueueManager();
  const analytics = getAnalyticsManager();
  
  // Agregar a cola
  const job = await queue.addMessage({
    instanceName: 'anclora-main',
    recipientPhone: phone,
    messageType: 'text',
    content: { text },
  });
  
  // Track analytics
  await analytics.trackMessageSent(phone, 'text', {
    jobId: job.id,
  });
  
  return Response.json({ jobId: job.id });
}
```

### n8n Workflow Integration

```javascript
// Nodo HTTP Request en n8n

const queueManager = require('./lib/whatsapp-queue');

// Agregar mensaje desde workflow
const job = await queueManager.getQueueManager().addMessage({
  instanceName: $json.instanceName,
  recipientPhone: $json.phone,
  messageType: 'text',
  content: { text: $json.message },
  metadata: {
    workflowId: $workflow.id,
    executionId: $execution.id,
  },
});

return { jobId: job.id };
```

---

## Monitoreo

### Dashboard en Tiempo Real

```typescript
// Actualizar cada 5 segundos
setInterval(async () => {
  const queue = getQueueManager();
  const analytics = getAnalyticsManager();
  
  const [queueMetrics, messageMetrics, perfMetrics] = await Promise.all([
    queue.getMetrics(),
    analytics.getMessageMetrics(),
    analytics.getPerformanceMetrics(),
  ]);
  
  console.clear();
  console.log('=== WHATSAPP DASHBOARD ===\n');
  console.log(`Cola: ${queueMetrics.waiting} waiting | ${queueMetrics.active} active`);
  console.log(`Mensajes: ${messageMetrics.sent} sent | ${messageMetrics.received} received`);
  console.log(`Performance: ${perfMetrics.messagesSentPerHour} msg/h | ${perfMetrics.errorRate}% error`);
}, 5000);
```

### Alertas

```typescript
// Alert si cola crece demasiado
const metrics = await queueManager.getMetrics();

if (metrics.waiting > 1000) {
  await sendSlackAlert({
    channel: '#ops-alerts',
    text: `⚠️ Cola WhatsApp: ${metrics.waiting} mensajes esperando`,
  });
}

// Alert si tasa de error alta
const perfMetrics = await analytics.getPerformanceMetrics();

if (perfMetrics.errorRate > 5) {
  await sendSlackAlert({
    channel: '#ops-alerts',
    text: `⚠️ Tasa error WhatsApp: ${perfMetrics.errorRate}%`,
  });
}
```

---

## Best Practices

### 1. Rate Limiting

✅ Respetar límite oficial WhatsApp (80 msg/min)  
✅ Configurar rate limiting en Queue Manager  
✅ Monitorear tasa de envío  
✅ Usar delays entre mensajes bulk

### 2. Error Handling

✅ Configurar retry con backoff exponencial  
✅ Monitorear Dead Letter Queue  
✅ Logs detallados de errores  
✅ Alertas para errores críticos

### 3. Performance

✅ Usar bulk operations cuando posible  
✅ Concurrency apropiada (5-10 workers)  
✅ Cleanup regular de datos antiguos  
✅ Indexes en Redis para queries rápidas

### 4. Seguridad

✅ Redis con contraseña en producción  
✅ TLS/SSL para conexión Redis  
✅ Separar DBs (queue vs analytics)  
✅ Rate limiting por usuario/IP

### 5. Escalabilidad

✅ Redis Cluster para high-volume  
✅ Múltiples workers distribuidos  
✅ Sharding por instancia WhatsApp  
✅ Monitoring y auto-scaling

### 6. Cleanup

```typescript
// Limpiar datos >30 días
await analytics.cleanup(30);

// Limpiar jobs completados >1 día
await queueManager.clean(24 * 3600 * 1000, 1000);
```

---

## Troubleshooting

### Cola no procesa mensajes

```bash
# Verificar worker activo
redis-cli
KEYS bullmq:whatsapp-messages:*

# Ver jobs
redis-cli LRANGE bullmq:whatsapp-messages:waiting 0 -1

# Verificar rate limiting
redis-cli GET bullmq:whatsapp-messages:limiter
```

### Mensajes se quedan en DLQ

```bash
# Ver DLQ
redis-cli LRANGE whatsapp:dlq 0 -1

# Reintentar desde código
const dlq = await queueManager.getDLQMessages();
for (const msg of dlq) {
  await queueManager.retryDLQMessage(msg.jobId);
}
```

### Redis memoria alta

```bash
# Ver uso memoria
redis-cli INFO memory

# Limpiar keys antiguas
redis-cli --scan --pattern "analytics:whatsapp:message:*" | xargs redis-cli DEL

# Configurar TTL automático
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

---

## Recursos

- **BullMQ Docs:** https://docs.bullmq.io
- **Redis Docs:** https://redis.io/docs
- **WhatsApp API Limits:** https://developers.facebook.com/docs/whatsapp/api/rate-limits

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-01  
**Mantenido por:** Anclora Private Estates - Tech Team
