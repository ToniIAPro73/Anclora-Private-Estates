# WhatsApp Webhook System - Documentación Completa

Sistema de procesamiento de eventos webhook de Evolution API con integración a bot conversacional, CRM y analytics.

---

## Índice

1. [Arquitectura](#arquitectura)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Eventos Soportados](#eventos-soportados)
5. [Validación de Seguridad](#validación-de-seguridad)
6. [Integración CRM](#integración-crm)
7. [Logging y Analytics](#logging-y-analytics)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Arquitectura

```
┌─────────────────┐
│ Evolution API   │
│  WhatsApp       │
└────────┬────────┘
         │ Webhook Events
         ▼
┌─────────────────────────────────────┐
│  Next.js API Route                  │
│  /api/whatsapp/webhook/route.ts     │
│  - Rate limiting                    │
│  - Signature validation             │
│  - Event routing                    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  WebhookProcessor                   │
│  - Event handlers                   │
│  - Message extraction               │
│  - Business logic                   │
└─┬───────┬───────┬──────────────────┘
  │       │       │
  ▼       ▼       ▼
┌────┐ ┌────┐ ┌──────┐
│Bot │ │CRM │ │Logger│
└────┘ └────┘ └──────┘
```

---

## Instalación

### 1. Variables de Entorno

Crear `.env.local`:

```bash
# Webhook Configuration
WEBHOOK_SECRET=your-secret-key-here-min-32-chars
NODE_ENV=production

# Evolution API
NEXT_PUBLIC_EVOLUTION_API_URL=http://localhost:8080
NEXT_EVOLUTION_API_KEY=your-api-key

# Twenty CRM Integration
TWENTY_CRM_URL=http://localhost:3000
TWENTY_CRM_API_KEY=your-crm-api-key

# Instance
INSTANCE_NAME=anclora-main
```

### 2. Generar Secret Key

```bash
# Generar clave segura de 32 bytes
openssl rand -base64 32
```

### 3. Configurar Evolution API

```bash
# Configurar webhook en Evolution API
curl -X POST http://localhost:8080/webhook/set/anclora-main \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "url": "https://tu-dominio.com/api/whatsapp/webhook",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": [
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "SEND_MESSAGE",
      "CONNECTION_UPDATE"
    ]
  }'
```

---

## Configuración

### Rate Limiting

Por defecto: **100 requests/minuto** por IP.

Modificar en `route.ts`:

```typescript
const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000; // 1 minuto
```

### Signature Validation

**Producción:** Activada automáticamente (`NODE_ENV=production`)  
**Desarrollo:** Desactivada para facilitar testing

Para forzar activación:

```typescript
const ENABLE_SIGNATURE_VALIDATION = true;
```

### Timeouts

```typescript
// En WebhookProcessor
private readonly PROCESSING_TIMEOUT = 30000; // 30 segundos
```

---

## Eventos Soportados

### 1. MESSAGES.UPSERT

**Descripción:** Nuevo mensaje recibido

**Payload:**
```json
{
  "event": "messages.upsert",
  "instance": "anclora-main",
  "data": {
    "key": {
      "remoteJid": "34600111222@s.whatsapp.net",
      "fromMe": false,
      "id": "3EB0F2F5E7F4A1B2C3D4"
    },
    "message": {
      "conversation": "Hola, busco una villa"
    },
    "messageTimestamp": 1704121200,
    "pushName": "Carlos Pérez"
  }
}
```

**Procesamiento:**
1. Extrae número de teléfono y texto
2. Ignora mensajes propios (`fromMe: true`)
3. Ignora mensajes de grupos
4. Loggea en base de datos
5. Crea/actualiza contacto en CRM
6. Procesa con bot conversacional
7. Registra actividad en CRM
8. Track analytics

### 2. MESSAGES.UPDATE

**Descripción:** Actualización de estado de mensaje (entregado, leído)

**Estados:**
- `PENDING`: Pendiente
- `SERVER_ACK`: Servidor recibió
- `DELIVERY_ACK`: Entregado
- `READ`: Leído
- `ERROR`: Error

**Payload:**
```json
{
  "event": "messages.update",
  "data": {
    "key": {
      "remoteJid": "34600111222@s.whatsapp.net",
      "id": "3EB0F2F5E7F4A1B2C3D4"
    },
    "update": {
      "status": "READ",
      "readTimestamp": 1704121300
    }
  }
}
```

### 3. SEND.MESSAGE

**Descripción:** Mensaje enviado desde nuestra instancia

**Uso:** Track mensajes salientes, analytics

### 4. CONNECTION.UPDATE

**Descripción:** Cambio en estado de conexión WhatsApp

**Estados:**
- `connecting`: Conectando
- `open`: Conectado ✅
- `close`: Desconectado ❌

**Payload:**
```json
{
  "event": "connection.update",
  "data": {
    "instance": "anclora-main",
    "state": "open"
  }
}
```

**Acciones:**
- `close`: Enviar alerta al equipo
- `open`: Log confirmación

### 5. QRCODE.UPDATED

**Descripción:** QR Code actualizado para autenticación

**Payload:**
```json
{
  "event": "qrcode.updated",
  "data": {
    "qrcode": {
      "code": "1@ABC123...",
      "base64": "data:image/png;base64,..."
    }
  }
}
```

**Acciones:**
- Guardar QR en base de datos
- Enviar por email al admin
- Mostrar en dashboard

### 6. PRESENCE.UPDATE

**Descripción:** Actualización de presencia del usuario

**Estados:**
- `available`: En línea
- `unavailable`: Desconectado
- `composing`: Escribiendo...
- `recording`: Grabando audio

---

## Validación de Seguridad

### HMAC SHA256 Signature

Evolution API firma cada webhook con HMAC-SHA256.

**Generación de firma:**

```javascript
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', secret);
hmac.update(JSON.stringify(payload));
const signature = `sha256=${hmac.digest('hex')}`;
```

**Validación:**

```typescript
const isValid = validateWebhookSignature(
  JSON.stringify(body),
  request.headers.get('x-webhook-signature'),
  WEBHOOK_SECRET
);
```

**Headers:**
```
x-webhook-signature: sha256=abc123def456...
```

### IP Whitelisting (Opcional)

En `route.ts`:

```typescript
const ALLOWED_IPS = ['127.0.0.1', '192.168.1.100'];

const clientIp = request.headers.get('x-forwarded-for');
if (!ALLOWED_IPS.includes(clientIp)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## Integración CRM

### Operaciones Automáticas

**1. Crear/Actualizar Contacto**
```typescript
await crm.createOrUpdateContact(
  phoneNumber,
  userName,
  {
    lastMessage: messageText,
    lastMessageDate: new Date().toISOString(),
  }
);
```

**2. Registrar Actividad**
```typescript
await crm.createActivity(
  phoneNumber,
  'message_received',
  {
    message: messageText,
    botProcessed: true,
  }
);
```

**3. Actualizar Lead Score**
```typescript
await crm.updateLeadScore(phoneNumber, 85);
```

### Endpoints CRM (Twenty)

```
POST   /rest/contacts
POST   /rest/activities
PATCH  /rest/contacts/{phone}/score
```

---

## Logging y Analytics

### ConversationLogger

**Guardar mensaje:**
```typescript
await logger.logMessage(
  phoneNumber,
  messageId,
  'inbound',
  messageText,
  { userName, timestamp }
);
```

**Guardar evento:**
```typescript
await logger.logEvent(eventType, data);
```

### AnalyticsTracker

**Track mensaje:**
```typescript
await analytics.trackMessage(
  phoneNumber,
  'inbound',
  'text'
);
```

**Métricas disponibles:**
- Total mensajes (inbound/outbound)
- Mensajes por usuario
- Tipos de mensaje (text, image, video, etc.)
- Eventos por tipo
- Tasa de respuesta del bot

---

## Testing

### 1. Desarrollo Local

**Iniciar ngrok:**
```bash
ngrok http 3000
```

**URL webhook:**
```
https://abc123.ngrok.io/api/whatsapp/webhook
```

### 2. Testing con cURL

**Mensaje simple:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "instance": "anclora-main",
    "data": {
      "key": {
        "remoteJid": "34600111222@s.whatsapp.net",
        "fromMe": false,
        "id": "TEST123"
      },
      "message": {
        "conversation": "Test message"
      },
      "pushName": "Test User"
    }
  }'
```

**Con firma:**
```bash
PAYLOAD='{"event":"messages.upsert"}'
SECRET="my-webhook-secret-key"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET")

curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

### 3. Verificación GET

```bash
curl "http://localhost:3000/api/whatsapp/webhook?hub.challenge=test123&hub.verify_token=my-secret"
```

### 4. Testing con Postman

Importar collection: `whatsapp-webhook.postman_collection.json`

### 5. Tests Automatizados

```typescript
import { testWebhookProcessor } from '@/examples/whatsapp-webhook-examples';

await testWebhookProcessor();
```

---

## Troubleshooting

### Problema: Webhook no recibe eventos

**Solución:**
1. Verificar URL pública accesible
2. Comprobar configuración en Evolution API:
   ```bash
   curl http://localhost:8080/webhook/find/anclora-main \
     -H "apikey: YOUR_API_KEY"
   ```
3. Revisar logs de Evolution API
4. Verificar firewall/CORS

### Problema: Firma inválida

**Solución:**
1. Verificar `WEBHOOK_SECRET` coincide en ambos lados
2. Comprobar formato de firma: `sha256=...`
3. Verificar body sin modificar (no pretty-print)
4. En desarrollo, desactivar validación temporalmente

### Problema: Rate limit excedido

**Solución:**
1. Aumentar límite en `route.ts`
2. Implementar queue (Redis + BullMQ)
3. Verificar si hay loop infinito de mensajes

### Problema: Bot no responde

**Solución:**
1. Verificar bot inicializado correctamente
2. Comprobar logs: `[Webhook] Processing message`
3. Verificar número no está en blacklist
4. Revisar horario de atención
5. Comprobar estado de instancia Evolution API

### Problema: Mensajes duplicados

**Solución:**
1. Implementar deduplicación por `messageId`
2. Usar cache Redis para IDs procesados
3. Verificar configuración Evolution API (no duplicar eventos)

---

## Best Practices

### 1. Seguridad

✅ Siempre validar firma en producción  
✅ Usar HTTPS para webhook URL  
✅ Rotar `WEBHOOK_SECRET` periódicamente  
✅ Implementar rate limiting  
✅ Whitelist IPs si es posible  

### 2. Performance

✅ Procesar eventos async  
✅ Usar queue para alta carga  
✅ Implementar timeout en CRM calls  
✅ Cache para datos frecuentes  
✅ Batch operations cuando posible  

### 3. Monitoring

✅ Alertas para `connection.update: close`  
✅ Métricas de tasa de error  
✅ Dashboard de eventos en tiempo real  
✅ Logs estructurados (JSON)  
✅ Health checks periódicos  

### 4. Reliability

✅ Reintentos con backoff exponencial  
✅ Dead letter queue para errores  
✅ Idempotencia en procesamiento  
✅ Graceful degradation (CRM down)  
✅ Circuit breaker para servicios externos  

### 5. Testing

✅ Tests unitarios para cada evento  
✅ Tests de integración con CRM  
✅ Load testing (100+ eventos/seg)  
✅ Tests de seguridad (firma, injection)  
✅ Monitoring en staging primero  

---

## Métricas y KPIs

### Disponibilidad
- Uptime del webhook: > 99.9%
- Tiempo de respuesta: < 500ms p95
- Tasa de error: < 0.1%

### Performance
- Eventos procesados/minuto: 1000+
- Latencia bot response: < 2s
- CRM sync latency: < 1s

### Business
- Mensajes recibidos/día
- Tasa de conversión bot → humano
- Tiempo promedio de respuesta
- Satisfacción del cliente (CSAT)

---

## Roadmap

### v1.1 (Q1 2026)
- [ ] Queue con Redis + BullMQ
- [ ] Dashboard en tiempo real
- [ ] Webhooks personalizados por evento
- [ ] Retry logic avanzado

### v1.2 (Q2 2026)
- [ ] ML para detección de spam
- [ ] A/B testing de respuestas
- [ ] Multi-tenancy support
- [ ] Webhook playground UI

### v2.0 (Q3 2026)
- [ ] GraphQL subscriptions
- [ ] Event sourcing completo
- [ ] Multi-región deployment
- [ ] Advanced analytics dashboard

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-01  
**Mantenido por:** Anclora Private Estates
