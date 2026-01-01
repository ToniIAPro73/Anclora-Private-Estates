# N8N Workflows - WhatsApp Automation Guide

Guía completa para importar, configurar y utilizar los 4 workflows de automatización WhatsApp en n8n.

---

## Índice

1. [Descripción de Workflows](#descripción-de-workflows)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación n8n](#instalación-n8n)
4. [Configuración de Credenciales](#configuración-de-credenciales)
5. [Importación de Workflows](#importación-de-workflows)
6. [Configuración de cada Workflow](#configuración-de-cada-workflow)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Descripción de Workflows

### Workflow 1: Lead Capture Auto-Reply
**Archivo:** `1-lead-capture-whatsapp.json`  
**Trigger:** Webhook  
**Función:** Capturar leads desde formularios web y enviar mensajes de bienvenida automáticos por WhatsApp

**Flujo:**
```
Webhook → Filter WhatsApp → Create CRM Contact → 
Send Welcome Message → Wait → Send Budget Inquiry → 
Log Activity → Track Analytics
```

**Nodos:** 11  
**Uso:** Cada vez que un lead se registra en el sitio web

---

### Workflow 2: Property Inquiry - Send Listings
**Archivo:** `2-property-inquiry-whatsapp.json`  
**Trigger:** Webhook  
**Función:** Buscar propiedades en base de datos y enviarlas automáticamente por WhatsApp

**Flujo:**
```
Webhook → Query Database → Check Results → 
Loop Properties → Format Data → Send Property Info → 
Send Image → Follow-up Question → Log CRM
```

**Nodos:** 15  
**Uso:** Cuando un cliente solicita ver propiedades que coincidan con sus criterios

---

### Workflow 3: Appointment Booking
**Archivo:** `3-appointment-booking-whatsapp.json`  
**Trigger:** Webhook + Schedule (Cron)  
**Función:** Gestionar citas, enviar confirmaciones y recordatorios automáticos

**Flujo Principal (Booking):**
```
Webhook → Get Property → Check Availability → 
Create Appointment → Send Confirmation → Add to Calendar
```

**Flujo Secundario (Reminders):**
```
Daily Cron (10:00) → Get Tomorrow's Appointments → 
Loop → Send Reminder → Mark Sent
```

**Nodos:** 20  
**Uso:** 
- Webhook: Al agendar cita
- Cron: Diario a las 10:00 para enviar recordatorios

---

### Workflow 4: Follow-up & Nurturing
**Archivo:** `4-followup-automation-whatsapp.json`  
**Trigger:** Schedule (Cron) + Webhook  
**Función:** Seguimiento post-visita y nurturing automático de leads tibios

**Flujo Post-Visita (Daily 18:00):**
```
Cron → Get Completed Appointments → Loop → 
Send Follow-up → Mark Sent → Log CRM
```

**Flujo Nurturing (Weekly Monday 10:00):**
```
Cron → Get Warm Leads → Get New Properties → 
Match to Preferences → Send Alerts → Update Contact
```

**Flujo Response Detection (Webhook):**
```
Webhook → Detect Interest → Upgrade Hot Lead → 
Notify Sales Team
```

**Nodos:** 32  
**Uso:**
- Post-visita: Diario 18:00
- Nurturing: Lunes 10:00
- Webhook: Respuestas de clientes

---

## Requisitos Previos

### Software Necesario

1. **n8n** (v1.0+)
2. **PostgreSQL** (14+) - Base de datos de propiedades
3. **Evolution API** - WhatsApp gateway
4. **Twenty CRM** - Sistema CRM
5. **Next.js API** - API endpoints propios

### Infraestructura

```
Docker Compose recomendado:
- n8n: puerto 5678
- PostgreSQL: puerto 5432
- Evolution API: puerto 8080
- Twenty CRM: puerto 3000
- Next.js: puerto 3000
```

---

## Instalación n8n

### Opción 1: Docker (Recomendado)

```bash
# Crear directorio
mkdir -p ~/n8n-data

# Docker Compose
cat > docker-compose-n8n.yml <<EOF
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: anclora-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=https://your-domain.com
      - GENERIC_TIMEZONE=Europe/Madrid
      - TZ=Europe/Madrid
    volumes:
      - ~/n8n-data:/home/node/.n8n
    networks:
      - anclora-network

networks:
  anclora-network:
    external: true
EOF

# Iniciar
docker-compose -f docker-compose-n8n.yml up -d
```

### Opción 2: npm

```bash
npm install n8n -g
n8n start
```

### Acceso

```
URL: http://localhost:5678
Usuario: admin
Contraseña: your-secure-password
```

---

## Configuración de Credenciales

Antes de importar workflows, configurar credenciales en n8n.

### 1. Twenty CRM API

**Settings → Credentials → Add Credential → HTTP Header Auth**

```
Name: Twenty CRM API
Auth Type: Header Auth
Header Name: Authorization
Value: Bearer YOUR_TWENTY_CRM_TOKEN
```

**Obtener token:**
```bash
# En Twenty CRM
Settings → Developers → API Keys → Create New Key
```

### 2. WhatsApp API Auth

**Settings → Credentials → Add Credential → HTTP Header Auth**

```
Name: WhatsApp API Auth
Auth Type: Header Auth
Header Name: apikey
Value: YOUR_EVOLUTION_API_KEY
```

**Obtener API key:**
```bash
# Variable de entorno Evolution API
AUTHENTICATION_API_KEY=your-key-here
```

### 3. PostgreSQL Database

**Settings → Credentials → Add Credential → Postgres**

```
Name: PostgreSQL - Properties DB
Host: localhost (o IP del contenedor)
Port: 5432
Database: anclora_properties
User: postgres
Password: your-db-password
SSL: Disable (en desarrollo)
```

**Crear base de datos:**
```sql
CREATE DATABASE anclora_properties;

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  price DECIMAL(12,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  surface_area INTEGER,
  description TEXT,
  image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'available',
  type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_phone VARCHAR(20) NOT NULL,
  property_id UUID REFERENCES properties(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  followup_sent BOOLEAN DEFAULT false,
  followup_sent_at TIMESTAMP,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  source VARCHAR(100),
  lead_status VARCHAR(50) DEFAULT 'warm',
  lead_score INTEGER DEFAULT 50,
  property_preferences JSONB,
  last_contact_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_contacts_lead_status ON contacts(lead_status);
```

---

## Importación de Workflows

### Método 1: Interfaz Web

1. Acceder a n8n: `http://localhost:5678`
2. Click en **Workflows** (sidebar izquierdo)
3. Click en **+ New Workflow**
4. Click en menú **⋯** (arriba derecha)
5. Seleccionar **Import from File**
6. Elegir archivo JSON del workflow
7. Click en **Import**

### Método 2: CLI

```bash
# Copiar workflows al contenedor
docker cp n8n-workflows/1-lead-capture-whatsapp.json anclora-n8n:/home/node/.n8n/

# Importar vía CLI
docker exec anclora-n8n n8n import:workflow --input=/home/node/.n8n/1-lead-capture-whatsapp.json
```

### Método 3: API

```bash
# Importar vía API REST
curl -X POST http://localhost:5678/rest/workflows \
  -H "Content-Type: application/json" \
  -u admin:your-password \
  -d @1-lead-capture-whatsapp.json
```

---

## Configuración de cada Workflow

### Workflow 1: Lead Capture

**1. Configurar Webhook URL**

Nodo: "Webhook Lead Capture"
```
Production URL: https://your-domain.com/webhook/lead-capture
Test URL: http://localhost:5678/webhook-test/lead-capture
```

**2. Vincular Credenciales**

- Nodo "Create Contact in Twenty CRM" → Credential: "Twenty CRM API"
- Nodo "Send WhatsApp Welcome Message" → Credential: "WhatsApp API Auth"

**3. Activar Workflow**

Toggle en **Active** (arriba derecha)

**4. Probar**

```bash
curl -X POST http://localhost:5678/webhook/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "source": "whatsapp",
    "phone": "34600111222",
    "name": "Test User",
    "email": "test@example.com",
    "propertyType": "villa",
    "budget": "500000-1000000",
    "location": "Palma"
  }'
```

---

### Workflow 2: Property Inquiry

**1. Configurar Webhook**

Production URL: `https://your-domain.com/webhook/property-inquiry`

**2. Configurar Base de Datos**

Nodo "Query Properties from Database":
- Credential: "PostgreSQL - Properties DB"
- Verificar query SQL

**3. Ajustar URLs de Imágenes**

Nodo "Send Property Image":
- Verificar `mediaUrl` apunta a dominio correcto

**4. Probar**

```bash
curl -X POST http://localhost:5678/webhook/property-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "34600111222",
    "budgetMin": 500000,
    "budgetMax": 1000000,
    "location": "Palma",
    "bedrooms": 3
  }'
```

---

### Workflow 3: Appointment Booking

**1. Configurar Webhooks**

Production URL: `https://your-domain.com/webhook/appointment-booking`

**2. Configurar Schedule**

Nodo "Schedule Daily Reminder Check":
- Cron: `0 10 * * *` (10:00 AM diario)
- Timezone: Europe/Madrid

**3. Configurar Google Calendar (Opcional)**

Nodo "Add to Google Calendar":
- Crear endpoint `/api/google-calendar/create-event`
- O usar Google Calendar node nativo de n8n

**4. Probar Booking**

```bash
curl -X POST http://localhost:5678/webhook/appointment-booking \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "34600111222",
    "name": "Test User",
    "propertyId": "uuid-here",
    "appointmentDate": "2026-01-15",
    "appointmentTime": "11:00",
    "notes": "Interested in villa"
  }'
```

---

### Workflow 4: Follow-up & Nurturing

**1. Configurar Schedules**

Nodo "Schedule Daily Follow-up Check":
- Cron: `0 18 * * *` (18:00 diario)

Nodo "Schedule Weekly Nurturing":
- Cron: `0 10 * * MON` (Lunes 10:00)

**2. Configurar Webhook Responses**

Production URL: `https://your-domain.com/webhook/whatsapp-response`

**3. Configurar Slack Notifications (Opcional)**

Nodo "Notify Sales Team":
```
URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Channel: #hot-leads
```

**4. Ajustar Matching Logic**

Nodo "Match Properties to Lead":
- Revisar código JavaScript
- Ajustar criterios de matching según necesidades

---

## Testing

### Test Individual de Nodos

1. Click derecho en nodo → **Execute Node**
2. Revisar output en panel derecho
3. Verificar datos correctos

### Test de Workflow Completo

1. Click en **Execute Workflow** (arriba)
2. Revisar ejecución en tiempo real
3. Verificar cada nodo completa exitosamente

### Test de Producción

```bash
# Webhook Test Script
cat > test-webhooks.sh <<'EOF'
#!/bin/bash

BASE_URL="http://localhost:5678"

# Test 1: Lead Capture
echo "Testing Lead Capture..."
curl -X POST $BASE_URL/webhook/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "source": "whatsapp",
    "phone": "34600111222",
    "name": "Test User",
    "propertyType": "villa"
  }'

sleep 2

# Test 2: Property Inquiry
echo -e "\n\nTesting Property Inquiry..."
curl -X POST $BASE_URL/webhook/property-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "34600111222",
    "budgetMin": 500000,
    "budgetMax": 1000000,
    "location": "Palma",
    "bedrooms": 3
  }'

sleep 2

# Test 3: Appointment
echo -e "\n\nTesting Appointment..."
curl -X POST $BASE_URL/webhook/appointment-booking \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "34600111222",
    "name": "Test User",
    "propertyId": "test-uuid",
    "appointmentDate": "2026-01-15",
    "appointmentTime": "11:00"
  }'

echo -e "\n\nAll tests completed!"
EOF

chmod +x test-webhooks.sh
./test-webhooks.sh
```

---

## Troubleshooting

### Problema: Workflow no se activa

**Solución:**
1. Verificar toggle "Active" está ON
2. Revisar logs: Settings → Executions
3. Verificar credenciales configuradas

### Problema: Error en nodo de base de datos

**Solución:**
```sql
-- Verificar conexión
psql -h localhost -U postgres -d anclora_properties -c "SELECT 1"

-- Verificar permisos
GRANT ALL PRIVILEGES ON DATABASE anclora_properties TO postgres;
```

### Problema: WhatsApp no envía mensajes

**Solución:**
1. Verificar Evolution API activa:
   ```bash
   curl http://localhost:8080/instance/connectionState/anclora-main
   ```
2. Verificar API key correcta
3. Revisar logs Evolution API

### Problema: Schedule no ejecuta

**Solución:**
1. Verificar timezone configurada en n8n
2. Probar manualmente: Click "Execute Workflow"
3. Revisar cron expression: https://crontab.guru

### Problema: Timeout en queries

**Solución:**
```sql
-- Optimizar queries con índices
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(date, status);

-- Ajustar timeout en n8n
Nodo PostgreSQL → Options → Query Timeout → 30000 (30 segundos)
```

---

## Best Practices

### 1. Seguridad

✅ Usar HTTPS para webhooks en producción  
✅ Validar firma de webhooks  
✅ Rotar credenciales periódicamente  
✅ No hardcodear secrets en workflows  
✅ Usar variables de entorno

### 2. Performance

✅ Limitar loops a máximo 100 iteraciones  
✅ Usar batch processing  
✅ Implementar waits entre mensajes (anti-spam)  
✅ Cachear queries frecuentes  
✅ Optimizar queries SQL con índices

### 3. Reliability

✅ Configurar error workflows  
✅ Implementar retry logic  
✅ Monitorear ejecuciones fallidas  
✅ Alertas para workflows críticos  
✅ Backup regular de workflows

### 4. Mantenimiento

✅ Documentar cambios en workflows  
✅ Versionado de workflows (export JSON)  
✅ Testing antes de activar en producción  
✅ Revisar logs semanalmente  
✅ Actualizar n8n mensualmente

### 5. Escalabilidad

✅ Usar queue (Redis) para high volume  
✅ Separar workflows por función  
✅ Implementar rate limiting  
✅ Monitorear uso de recursos  
✅ Escalar horizontalmente si necesario

---

## Métricas y Monitoreo

### Dashboard Recomendado

**KPIs a trackear:**
- Workflows ejecutados/día
- Tasa de éxito (%)
- Tiempo promedio de ejecución
- Mensajes WhatsApp enviados
- Leads capturados
- Citas agendadas
- Tasa de conversión

### Alertas Configurar

```javascript
// En cada workflow, agregar nodo "Send Alert" en error path

if (workflow.failed) {
  sendSlackAlert({
    channel: '#n8n-alerts',
    text: `⚠️ Workflow Failed: ${workflowName}
    Error: ${error.message}
    Time: ${new Date().toISOString()}`
  });
}
```

---

## Recursos Adicionales

- **N8N Docs:** https://docs.n8n.io
- **Community:** https://community.n8n.io
- **Templates:** https://n8n.io/workflows
- **YouTube:** https://youtube.com/c/n8n-io

---

**Versión:** 1.0.0  
**Última actualización:** 2026-01-01  
**Mantenido por:** Anclora Private Estates
