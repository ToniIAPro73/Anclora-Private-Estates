# 🚀 Quick Start - WhatsApp Integration System

Guía de inicio rápido para poner en marcha el sistema completo de WhatsApp en **5 minutos**.

---

## Paso 1: Instalar Dependencias (1 min)

```bash
cd /home/claude/anclora-private-estates

# Instalar dependencias npm
npm install

# Verificar instalación
npm list bullmq ioredis
```

**Dependencias clave instaladas:**
- `bullmq@^5.34.3` - Sistema de colas
- `ioredis@^5.4.2` - Cliente Redis
- `@types/ioredis@^4.28.10` - TypeScript types

---

## Paso 2: Levantar Redis (30 segundos)

```bash
# Opción A: Docker Compose (recomendado)
docker-compose -f docker-compose.redis.yml up -d

# Opción B: Redis local
redis-server

# Verificar
redis-cli ping
# → PONG
```

**Servicios disponibles:**
- Redis: `localhost:6379`
- Bull Board (monitoring): `http://localhost:3001`
- Redis Commander (GUI): `http://localhost:8081`

---

## Paso 3: Configurar Variables de Entorno (1 min)

```bash
# Crear archivo .env
cat > .env << 'ENV'
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0              # Queue
REDIS_ANALYTICS_DB=1    # Analytics

# Evolution API
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=your-api-key-here

# WhatsApp Instance
WHATSAPP_INSTANCE_NAME=anclora-main
ENV
```

---

## Paso 4: Ejecutar Tests (1 min)

```bash
# Test completo del sistema
npx ts-node scripts/test-queue-analytics.ts

# Resultado esperado:
# ✅ Queue Manager: 8/8 tests PASS
# ✅ Analytics Manager: 11/11 tests PASS
# ✅ Integration: 3/3 tests PASS
```

---

## Paso 5: Usar el Sistema (2 min)

### Ejemplo 1: Enviar Mensaje con Cola

```typescript
// En tu código Next.js
import { getQueueManager } from '@/lib/whatsapp-queue';

const queue = getQueueManager();

await queue.addMessage({
  instanceName: 'anclora-main',
  recipientPhone: '34600111222',
  messageType: 'text',
  content: {
    text: '¡Hola! Bienvenido a Anclora Private Estates',
  },
  metadata: {
    priority: 'normal',
  },
});
```

### Ejemplo 2: Tracking de Analytics

```typescript
import { getAnalyticsManager } from '@/lib/whatsapp-analytics';

const analytics = getAnalyticsManager();

// Track mensaje enviado
await analytics.trackMessageSent('34600111222', 'text');

// Track conversión
await analytics.trackConversion('34600111222', 'lead');

// Obtener métricas
const metrics = await analytics.getMessageMetrics();
console.log('Mensajes enviados:', metrics.sent);
```

### Ejemplo 3: Bot Conversacional

```typescript
import { WhatsAppBot } from '@/lib/whatsapp-bot';

const bot = new WhatsAppBot({
  language: 'es',
  instanceName: 'anclora-main',
});

// Procesar mensaje del usuario
const response = await bot.processMessage(
  '34600111222',
  'Busco villa con 4 habitaciones'
);

console.log(response.message);
// → "Excelente elección. ¿En qué zona de Mallorca te gustaría..."
```

---

## 📊 Monitoreo en Tiempo Real

### Ver Cola de Mensajes
```
http://localhost:3001
```
- Mensajes pending
- Mensajes activos
- Mensajes completados
- Mensajes fallidos

### Ver Datos en Redis
```
http://localhost:8081
```
- DB 0: Queue data
- DB 1: Analytics data
- Explorar keys
- Ver valores

### CLI Monitoring

```bash
# Métricas de cola
redis-cli
> SELECT 0
> KEYS bullmq:whatsapp-messages:*

# Métricas de analytics
> SELECT 1
> KEYS analytics:whatsapp:*
> GET analytics:whatsapp:messages:sent:total
```

---

## 🔧 Comandos Útiles

### Gestión de Cola

```typescript
const queue = getQueueManager();

// Pausar cola
await queue.pause();

// Reanudar cola
await queue.resume();

// Limpiar completed
await queue.clean(0, 1000);

// Ver métricas
const metrics = await queue.getMetrics();
console.log(metrics);
```

### Gestión de Analytics

```typescript
const analytics = getAnalyticsManager();

// Reporte diario
const report = await analytics.generateReport('day');

// Time series (últimos 7 días)
const series = await analytics.getMessageTimeSeries(7);

// Limpiar datos >30 días
await analytics.cleanup(30);
```

---

## 📚 Documentación Completa

| Componente | Documentación |
|------------|--------------|
| Queue + Analytics | `docs/WHATSAPP_QUEUE_ANALYTICS_GUIDE.md` |
| Evolution API | `docs/EVOLUTION_API_INSTALLATION.md` |
| Webhook System | `docs/WHATSAPP_WEBHOOK_SYSTEM.md` |
| n8n Workflows | `docs/N8N_WORKFLOWS_GUIDE.md` |
| Resumen Fase 6.2 | `docs/FASE_6_2_COMPLETADA.md` |

---

## 🐛 Troubleshooting

### Redis no conecta
```bash
# Verificar que Redis está corriendo
docker ps | grep redis

# Reiniciar
docker restart anclora-redis

# Ver logs
docker logs anclora-redis
```

### Cola no procesa mensajes
```bash
# Verificar workers
redis-cli
> SELECT 0
> KEYS bullmq:whatsapp-messages:active

# Ver rate limiting
> GET bullmq:whatsapp-messages:limiter
```

### Evolution API no responde
```bash
# Verificar conexión
curl http://localhost:8080/instance/fetchInstances

# Ver logs de Evolution API
docker logs evolution-api
```

---

## 🎯 Próximos Pasos

1. **Configurar Evolution API** → `docs/EVOLUTION_API_INSTALLATION.md`
2. **Importar workflows n8n** → `docs/N8N_WORKFLOWS_GUIDE.md`
3. **Configurar Twenty CRM** → (Fase 6.3)
4. **Ejecutar en producción** → (Fase 8)

---

## 💡 Tips

### Performance
- Usa `addBulk()` para múltiples mensajes
- Configura rate limiting según tu plan WhatsApp
- Monitorea DLQ regularmente
- Cleanup automático cada noche

### Seguridad
- Usa contraseña en Redis producción
- Habilita SSL/TLS
- Rate limiting por IP
- Webhook signature validation

### Escalabilidad
- Redis Cluster para >10K msg/día
- Múltiples workers distribuidos
- Sharding por instancia WhatsApp
- Auto-scaling en cloud

---

## ✅ Checklist de Producción

- [ ] Redis con contraseña configurada
- [ ] Evolution API con SSL
- [ ] Variables de entorno en `.env.production`
- [ ] Monitoring configurado (Bull Board)
- [ ] Alertas Slack/Email configuradas
- [ ] Backup automático Redis
- [ ] Cleanup programado
- [ ] Load testing realizado
- [ ] Documentación actualizada

---

## 📞 Soporte

**Proyecto:** Anclora Private Estates  
**Fase:** 6.2 - WhatsApp Integration  
**Estado:** ✅ COMPLETADA  

Para más información, consulta la documentación completa en `/docs`.

---

**Happy WhatsApp Automation! 🚀**
