# WHATSAPP INTEGRATION SETUP - EVOLUTION API

Guía completa de instalación y configuración de WhatsApp usando Evolution API (open source).

---

## REQUISITOS PREVIOS

### Software Necesario
- Docker 20.10+ y Docker Compose 2.0+
- Node.js 18+ (para desarrollo Next.js)
- Git
- Acceso a terminal/CLI

### Hardware Recomendado
- RAM: 4GB mínimo (8GB recomendado)
- Storage: 10GB disponible
- CPU: 2 cores mínimo

### Cuenta WhatsApp
- Número de teléfono dedicado para la empresa
- WhatsApp instalado en móvil (para escanear QR)
- No usar cuenta personal (usar WhatsApp Business recomendado)

---

## INSTALACIÓN RÁPIDA

### Paso 1: Clonar Configuración

```bash
cd /home/claude/anclora-private-estates/docker

# Copiar archivo de variables de entorno
cp .env.whatsapp.example .env.whatsapp

# Editar variables de entorno
nano .env.whatsapp
```

### Paso 2: Configurar Variables de Entorno

**Editar `.env.whatsapp`:**

```bash
# 1. Generar API Key segura
EVOLUTION_API_KEY=$(openssl rand -base64 32)

# 2. Configurar credenciales PostgreSQL
POSTGRES_USER=evolution
POSTGRES_PASSWORD=$(openssl rand -base64 16)
POSTGRES_DB=evolution

# 3. Configurar Redis
REDIS_PASSWORD=$(openssl rand -base64 16)

# 4. Configurar Webhook URL
# Desarrollo:
WEBHOOK_URL=http://host.docker.internal:3000/api/whatsapp/webhook

# Producción (cuando esté deployed):
# WEBHOOK_URL=https://anclora.es/api/whatsapp/webhook

# 5. Configurar nombre de instancia
INSTANCE_NAME=anclora-main
```

### Paso 3: Iniciar Servicios

```bash
# Navegar a directorio docker
cd /home/claude/anclora-private-estates/docker

# Iniciar servicios
docker-compose -f docker-compose.whatsapp.yml up -d

# Ver logs
docker-compose -f docker-compose.whatsapp.yml logs -f evolution-api
```

**Servicios iniciados:**
- Evolution API: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- pgAdmin (opcional): http://localhost:5050

### Paso 4: Verificar Instalación

```bash
# Health check
curl http://localhost:8080/health

# Respuesta esperada:
# {"status":"ok"}

# Ver instancias
curl -X GET http://localhost:8080/instance/fetchInstances \
  -H "apikey: YOUR_EVOLUTION_API_KEY"
```

---

## CONECTAR WHATSAPP

### Método 1: API (Recomendado)

```bash
# 1. Crear instancia WhatsApp
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: YOUR_EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "anclora-main",
    "qrcode": true,
    "number": "",
    "integration": "WHATSAPP-BAILEYS"
  }'

# 2. Obtener QR Code
curl -X GET http://localhost:8080/instance/connect/anclora-main \
  -H "apikey: YOUR_EVOLUTION_API_KEY"

# Respuesta incluirá:
# {
#   "code": "data:image/png;base64,...",
#   "base64": "..."
# }
```

**Escanear QR:**
1. Abrir WhatsApp en móvil
2. Ir a Configuración → Dispositivos vinculados
3. Escanear el QR code mostrado
4. Esperar confirmación de conexión

### Método 2: Script de Setup

```bash
# Ejecutar script de configuración
cd /home/claude/anclora-private-estates/scripts

# Crear script si no existe
cat > setup-whatsapp.sh << 'EOF'
#!/bin/bash

API_KEY=$(grep EVOLUTION_API_KEY ../.env.whatsapp | cut -d '=' -f2)
API_URL="http://localhost:8080"
INSTANCE_NAME="anclora-main"

echo "🚀 Iniciando configuración WhatsApp Evolution API..."

# Crear instancia
echo "📱 Creando instancia WhatsApp..."
RESPONSE=$(curl -s -X POST $API_URL/instance/create \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"instanceName\": \"$INSTANCE_NAME\",
    \"qrcode\": true,
    \"integration\": \"WHATSAPP-BAILEYS\"
  }")

echo $RESPONSE | jq

# Obtener QR
echo "📷 Generando QR Code..."
sleep 3
QR_RESPONSE=$(curl -s -X GET $API_URL/instance/connect/$INSTANCE_NAME \
  -H "apikey: $API_KEY")

# Guardar QR como imagen
echo $QR_RESPONSE | jq -r '.base64' | base64 -d > whatsapp-qr.png

echo "✅ QR Code guardado en: whatsapp-qr.png"
echo "👉 Escanea el código QR con WhatsApp"

# Mostrar QR en terminal (requiere qrencode)
if command -v qrencode &> /dev/null; then
    echo $QR_RESPONSE | jq -r '.code' | sed 's/data:image\/png;base64,//' | base64 -d | qrencode -t ANSIUTF8
fi

# Esperar conexión
echo "⏳ Esperando conexión..."
for i in {1..60}; do
    STATUS=$(curl -s -X GET $API_URL/instance/connectionState/$INSTANCE_NAME \
      -H "apikey: $API_KEY" | jq -r '.state')
    
    if [ "$STATUS" = "open" ]; then
        echo "✅ WhatsApp conectado exitosamente!"
        exit 0
    fi
    
    sleep 2
    echo -n "."
done

echo "❌ Timeout esperando conexión"
exit 1
EOF

chmod +x setup-whatsapp.sh
./setup-whatsapp.sh
```

---

## VERIFICAR CONEXIÓN

### Comprobar Estado

```bash
# Ver estado de instancia
curl -X GET http://localhost:8080/instance/connectionState/anclora-main \
  -H "apikey: YOUR_EVOLUTION_API_KEY"

# Respuesta esperada (conectado):
# {
#   "instance": "anclora-main",
#   "state": "open"
# }
```

### Enviar Mensaje de Prueba

```bash
# Enviar mensaje de prueba
curl -X POST http://localhost:8080/message/sendText/anclora-main \
  -H "apikey: YOUR_EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "34600000000",
    "text": "¡Hola! Este es un mensaje de prueba desde Anclora Private Estates 🏡",
    "delay": 1000
  }'

# Respuesta:
# {
#   "key": {
#     "remoteJid": "34600000000@s.whatsapp.net",
#     "fromMe": true,
#     "id": "..."
#   },
#   "message": {...},
#   "messageTimestamp": "..."
# }
```

---

## CONFIGURACIÓN AVANZADA

### Webhooks

**Editar `docker-compose.whatsapp.yml`:**

```yaml
environment:
  # Eventos habilitados
  - WEBHOOK_EVENTS_MESSAGES_UPSERT=true      # Nuevos mensajes
  - WEBHOOK_EVENTS_MESSAGES_UPDATE=true      # Mensajes actualizados
  - WEBHOOK_EVENTS_SEND_MESSAGE=true         # Mensajes enviados
  - WEBHOOK_EVENTS_CONNECTION_UPDATE=true    # Estado de conexión
  - WEBHOOK_EVENTS_QRCODE_UPDATED=true      # QR actualizado
```

**Handler en Next.js:**

```typescript
// app/api/whatsapp/webhook/route.ts
export async function POST(req: Request) {
  const event = await req.json();
  
  console.log('WhatsApp Event:', event.event);
  console.log('Instance:', event.instance);
  console.log('Data:', event.data);
  
  // Procesar evento
  switch(event.event) {
    case 'messages.upsert':
      // Nuevo mensaje recibido
      await handleIncomingMessage(event.data);
      break;
    case 'send.message':
      // Mensaje enviado
      await handleSentMessage(event.data);
      break;
    case 'connection.update':
      // Estado de conexión cambió
      await handleConnectionUpdate(event.data);
      break;
  }
  
  return Response.json({ received: true });
}
```

### Multi-Instancia

**Crear segunda instancia (ej: para ventas y soporte):**

```bash
# Instancia ventas
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "anclora-ventas",
    "qrcode": true
  }'

# Instancia soporte
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "anclora-soporte",
    "qrcode": true
  }'
```

### Rate Limiting

Evolution API incluye rate limiting automático:

```yaml
environment:
  # WhatsApp límite oficial: 80 mensajes/minuto
  - RATE_LIMIT_ENABLED=true
  - RATE_LIMIT_MAX=80
  - RATE_LIMIT_WINDOW=60000  # ms
```

**Implementar queue si excede límite:**

```typescript
// lib/whatsapp-queue.ts
import { Queue } from 'bullmq';

const messageQueue = new Queue('whatsapp-messages', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Añadir mensaje a cola
await messageQueue.add('send-message', {
  number: '34600000000',
  text: 'Mensaje',
});
```

---

## TROUBLESHOOTING

### Problema: QR Code no se genera

**Solución:**
```bash
# 1. Verificar logs
docker-compose -f docker-compose.whatsapp.yml logs evolution-api

# 2. Reiniciar instancia
curl -X DELETE http://localhost:8080/instance/logout/anclora-main \
  -H "apikey: YOUR_API_KEY"

curl -X POST http://localhost:8080/instance/restart/anclora-main \
  -H "apikey: YOUR_API_KEY"

# 3. Recrear instancia
curl -X DELETE http://localhost:8080/instance/delete/anclora-main \
  -H "apikey: YOUR_API_KEY"

# Volver a crear
```

### Problema: Conexión se pierde

**Solución:**
```bash
# 1. Verificar estado
curl -X GET http://localhost:8080/instance/connectionState/anclora-main \
  -H "apikey: YOUR_API_KEY"

# 2. Reconectar
curl -X GET http://localhost:8080/instance/connect/anclora-main \
  -H "apikey: YOUR_API_KEY"

# 3. Verificar móvil
# - WhatsApp debe estar con internet
# - Dispositivo no puede estar en otra sesión web
```

### Problema: Mensajes no llegan

**Solución:**
```bash
# 1. Verificar webhook
curl -X POST http://localhost:8080/webhook/find/anclora-main \
  -H "apikey: YOUR_API_KEY"

# 2. Verificar formato número
# Correcto: 34600000000 (sin + ni espacios)
# Incorrecto: +34 600 000 000

# 3. Test mensaje directo
curl -X POST http://localhost:8080/message/sendText/anclora-main \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "34600000000",
    "text": "Test"
  }'
```

### Problema: Base de datos llena

**Solución:**
```bash
# Conectar a PostgreSQL
docker exec -it evolution-postgres psql -U evolution

# Ver tamaño tablas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Limpiar mensajes antiguos (>30 días)
DELETE FROM messages WHERE timestamp < NOW() - INTERVAL '30 days';

# Vacuum
VACUUM FULL;
```

---

## MANTENIMIENTO

### Backup Base de Datos

```bash
# Backup automático diario
cat > /etc/cron.daily/backup-whatsapp << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/whatsapp"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

docker exec evolution-postgres pg_dump -U evolution evolution | \
  gzip > $BACKUP_DIR/evolution_$DATE.sql.gz

# Mantener solo últimos 30 días
find $BACKUP_DIR -name "evolution_*.sql.gz" -mtime +30 -delete
EOF

chmod +x /etc/cron.daily/backup-whatsapp
```

### Actualizar Evolution API

```bash
# 1. Backup
docker exec evolution-postgres pg_dump -U evolution evolution > backup.sql

# 2. Pull nueva imagen
docker-compose -f docker-compose.whatsapp.yml pull evolution-api

# 3. Recrear contenedor
docker-compose -f docker-compose.whatsapp.yml up -d evolution-api

# 4. Verificar
docker-compose -f docker-compose.whatsapp.yml logs -f evolution-api
```

### Monitorización

```bash
# Ver métricas
curl -X GET http://localhost:8080/instance/fetchInstances \
  -H "apikey: YOUR_API_KEY" | jq

# Ver mensajes pendientes (Redis)
docker exec evolution-redis redis-cli -a YOUR_REDIS_PASSWORD LLEN evolution_queue:messages

# Ver uso recursos
docker stats evolution-api evolution-postgres evolution-redis
```

---

## SEGURIDAD

### Recomendaciones

1. **Cambiar API Key por defecto**
```bash
# Generar nueva key
openssl rand -base64 32
```

2. **Firewall**
```bash
# Solo permitir localhost
sudo ufw allow from 127.0.0.1 to any port 8080
```

3. **Reverse Proxy (Producción)**
```nginx
# /etc/nginx/sites-available/evolution
server {
    listen 443 ssl;
    server_name api.anclora.es;
    
    ssl_certificate /etc/letsencrypt/live/api.anclora.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.anclora.es/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Limitar IPs permitidas**
```yaml
environment:
  - AUTHENTICATION_ALLOWED_IPS=127.0.0.1,192.168.1.0/24
```

---

## RECURSOS

### Documentación Oficial
- Evolution API: https://doc.evolution-api.com
- Repositorio: https://github.com/EvolutionAPI/evolution-api
- WhatsApp Baileys: https://github.com/WhiskeySockets/Baileys

### API Reference
- Endpoints: http://localhost:8080/docs
- Swagger UI: http://localhost:8080/api-docs

### Comunidad
- Discord: https://evolution-api.com/discord
- Issues: https://github.com/EvolutionAPI/evolution-api/issues

---

## SIGUIENTE PASO

Una vez completada la instalación, proceder con:
- **Subtarea 6.2.2:** Librería de Integración WhatsApp (`lib/whatsapp-api.ts`)

---

**Estado Subtarea 6.2.1:** ✅ COMPLETADA  
**Archivos creados:** 3  
**Servicios configurados:** Evolution API + PostgreSQL + Redis  
**Próximo paso:** Desarrollo de librería de integración
