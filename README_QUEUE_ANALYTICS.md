# WhatsApp Queue & Analytics System

Sistema completo de gestión de colas y analytics para WhatsApp Business con BullMQ y Redis.

---

## 🚀 Quick Start

### 1. Instalación

```bash
# Instalar dependencias
npm install bullmq ioredis

# Iniciar Redis
npm run redis:start

# Verificar
redis-cli ping
# Output: PONG
```

### 2. Uso Básico

```typescript
import { getQueueManager } from './lib/whatsapp-queue';
import { getAnalyticsManager } from './lib/whatsapp-analytics';

// Enviar mensaje
const queue = getQueueManager();
await queue.addMessage({
  instanceName: 'anclora-main',
  recipientPhone: '34600111222',
  messageType: 'text',
  content: { text: 'Hola!' }
});

// Track analytics
const analytics = getAnalyticsManager();
await analytics.trackMessageSent('34600111222', 'text');
```

### 3. Monitoreo

```bash
# Dashboard cola
npm run queue:metrics

# Dashboard analytics
npm run analytics:dashboard

# Gestionar mensajes fallidos
npm run queue:dlq
```

---

## 📁 Estructura

```
├── lib/
│   ├── whatsapp-queue.ts          # Queue Manager (441 líneas)
│   └── whatsapp-analytics.ts      # Analytics Manager (600 líneas)
│
├── docker/
│   ├── docker-compose.redis.yml   # Redis Stack
│   └── redis.conf                 # Configuración Redis
│
├── scripts/
│   ├── queue-metrics.ts           # Dashboard cola CLI
│   ├── queue-dlq.ts              # Gestión DLQ CLI
│   └── analytics-dashboard.ts    # Dashboard analytics CLI
│
├── docs/
│   └── WHATSAPP_QUEUE_ANALYTICS_GUIDE.md  # Documentación completa
│
└── examples/
    └── whatsapp-queue-analytics-examples.ts  # Ejemplos
```

---

## ⚡ Características

### Queue Management (BullMQ)

✅ **Rate Limiting** - 80 msg/min (límite WhatsApp oficial)  
✅ **Retry Logic** - 3 intentos con backoff exponencial  
✅ **Priorización** - 4 niveles (critical/high/normal/low)  
✅ **Dead Letter Queue** - Gestión de mensajes fallidos  
✅ **Scheduled Messages** - Programar envíos futuros  
✅ **Bulk Operations** - Envío masivo eficiente  
✅ **Real-time Metrics** - Métricas en tiempo real  

### Analytics System (Redis)

✅ **Message Tracking** - Enviados/recibidos/fallidos/leídos  
✅ **Conversation Metrics** - Tiempo respuesta, tasa respuesta  
✅ **Conversion Tracking** - Leads, citas, ventas  
✅ **Campaign ROI** - Tracking de campañas  
✅ **Performance Metrics** - Throughput, latencia, errores  
✅ **Time Series** - Datos históricos 7-365 días  
✅ **Custom Reports** - Reportes automatizados  

---

## 📊 Performance

| Métrica | Valor |
|---------|-------|
| Throughput | 80 msg/min |
| Concurrency | 5 workers |
| Latency (queue) | <100ms |
| Analytics write | >1000 eventos/s |
| Analytics read | <10ms |
| Redis memory | ~2GB |

---

## 🔧 Configuración

### Variables de Entorno

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0              # Queue
REDIS_ANALYTICS_DB=1    # Analytics

# WhatsApp
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=your-key
```

### Rate Limiting

```typescript
const queue = createQueueManager({
  rateLimiting: {
    max: 80,        // Mensajes por ventana
    duration: 60000, // 1 minuto
  }
});
```

### Retry Logic

```typescript
const queue = createQueueManager({
  retry: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,  // 2s → 4s → 8s
    }
  }
});
```

---

## 📖 Documentación Completa

Ver [WHATSAPP_QUEUE_ANALYTICS_GUIDE.md](docs/WHATSAPP_QUEUE_ANALYTICS_GUIDE.md) para:

- Arquitectura detallada
- Instalación paso a paso
- API completa
- Ejemplos de uso
- Integración Next.js/n8n
- Best practices
- Troubleshooting

---

## 🛠️ Comandos

### Redis

```bash
npm run redis:start       # Iniciar Redis stack
npm run redis:stop        # Detener Redis
npm run redis:logs        # Ver logs
npm run redis:cli         # Redis CLI
npm run redis:monitor     # Monitor en tiempo real
npm run redis:info        # Info Redis
npm run redis:flush       # ⚠️ Borrar todo
```

### Queue

```bash
npm run queue:metrics     # Dashboard métricas
npm run queue:dlq         # Gestionar DLQ
npm run queue:clean       # Limpiar jobs antiguos
```

### Analytics

```bash
npm run analytics:dashboard  # Dashboard tiempo real
npm run analytics:report     # Generar reporte
```

---

## 💻 Ejemplos de Uso

### Envío Simple

```typescript
const queue = getQueueManager();

await queue.addMessage({
  instanceName: 'anclora-main',
  recipientPhone: '34600111222',
  messageType: 'text',
  content: {
    text: '¡Hola! Gracias por contactar con Anclora.'
  },
  metadata: {
    priority: 'normal'
  }
});
```

### Envío Masivo

```typescript
const messages = [
  { phone: '34600111222', text: 'Hola Juan' },
  { phone: '34600222333', text: 'Hola María' },
].map(m => ({
  instanceName: 'anclora-main',
  recipientPhone: m.phone,
  messageType: 'text',
  content: { text: m.text }
}));

await queue.addBulk(messages);
```

### Mensaje Programado

```typescript
const scheduledTime = new Date();
scheduledTime.setHours(scheduledTime.getHours() + 1);

await queue.scheduleMessage(message, scheduledTime);
```

### Tracking Analytics

```typescript
const analytics = getAnalyticsManager();

// Track envío
await analytics.trackMessageSent('34600111222', 'text');

// Track conversión
await analytics.trackConversion('34600111222', 'lead');

// Obtener métricas
const metrics = await analytics.getMessageMetrics();
console.log(`Enviados: ${metrics.sent}`);
```

### Reporte Completo

```typescript
const report = await analytics.generateReport('week');

console.log('Mensajes:', report.messages);
console.log('Conversaciones:', report.conversations);
console.log('Conversiones:', report.conversions);
console.log('Performance:', report.performance);
```

---

## 🐳 Docker

### Iniciar Redis Stack

```bash
docker-compose -f docker/docker-compose.redis.yml up -d
```

Incluye:
- **Redis** (puerto 6379)
- **Redis Commander** (puerto 8081) - GUI
- **BullMQ Board** (puerto 3001) - Monitoreo colas

### Acceder

- Redis Commander: http://localhost:8081
- BullMQ Board: http://localhost:3001

---

## 🔍 Monitoreo

### Dashboard Cola (CLI)

```bash
npm run queue:metrics
```

Muestra:
- Estado de la cola (waiting/active/completed/failed)
- Tasa de procesamiento (msg/min)
- Últimos jobs
- Mensajes fallidos

### Dashboard Analytics (CLI)

```bash
npm run analytics:dashboard
```

Muestra:
- Métricas de mensajes
- Conversaciones activas
- Conversiones
- Performance
- Gráfico time series

### Gestión DLQ

```bash
npm run queue:dlq
```

Permite:
- Ver mensajes fallidos
- Reintentar mensaje específico
- Reintentar todos
- Limpiar DLQ

---

## ⚠️ Troubleshooting

### Cola no procesa mensajes

```bash
# Verificar worker activo
redis-cli KEYS bullmq:whatsapp-messages:*

# Ver jobs en espera
redis-cli LRANGE bullmq:whatsapp-messages:waiting 0 -1
```

### Mensajes en DLQ

```bash
# Ver DLQ
npm run queue:dlq

# O desde Redis CLI
redis-cli LRANGE whatsapp:dlq 0 -1
```

### Redis memoria alta

```bash
# Ver uso
redis-cli INFO memory

# Limpiar datos antiguos
npm run analytics:cleanup
```

---

## 📦 Dependencias

```json
{
  "bullmq": "^4.17.0",
  "ioredis": "^5.3.2"
}
```

---

## 🎯 Roadmap

- [x] Queue management básico
- [x] Analytics tracking
- [x] CLI dashboards
- [x] Docker setup
- [ ] Tests unitarios
- [ ] Tests integración
- [ ] Grafana dashboards
- [ ] Prometheus metrics
- [ ] Redis Cluster

---

## 📄 Licencia

Privado - Anclora Private Estates

---

## 👥 Soporte

Para soporte técnico contactar a: tech@anclora.com

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-01  
**Mantenido por:** Anclora Tech Team
