# N8N WhatsApp Automation Workflows

Colección de 4 workflows de automatización para WhatsApp + CRM integrado con Evolution API, Twenty CRM y PostgreSQL.

---

## 📋 Workflows Disponibles

### 1️⃣ Lead Capture Auto-Reply
**Archivo:** `1-lead-capture-whatsapp.json`  
**Trigger:** Webhook  
**Nodos:** 11

**Función:** Captura leads desde formularios web y envía mensajes de bienvenida automáticos.

**Características:**
- ✅ Filtrado de fuente WhatsApp
- ✅ Creación automática en CRM
- ✅ Mensaje de bienvenida personalizado
- ✅ Pregunta sobre presupuesto
- ✅ Logging de actividad
- ✅ Analytics tracking

**Webhook URL:** `/webhook/lead-capture`

---

### 2️⃣ Property Inquiry - Send Listings
**Archivo:** `2-property-inquiry-whatsapp.json`  
**Trigger:** Webhook  
**Nodos:** 15

**Función:** Busca propiedades en BD y las envía por WhatsApp con imágenes.

**Características:**
- ✅ Query SQL con filtros (precio, ubicación, habitaciones)
- ✅ Loop de propiedades (hasta 3)
- ✅ Envío de info + imagen por propiedad
- ✅ Mensaje follow-up
- ✅ Manejo de "sin resultados"
- ✅ Logging en CRM

**Webhook URL:** `/webhook/property-inquiry`

---

### 3️⃣ Appointment Booking & Reminders
**Archivo:** `3-appointment-booking-whatsapp.json`  
**Trigger:** Webhook + Cron  
**Nodos:** 20

**Función:** Gestiona citas con confirmación y recordatorios automáticos.

**Características:**

**Booking (Webhook):**
- ✅ Verificación de disponibilidad
- ✅ Creación de cita en BD
- ✅ Confirmación por WhatsApp
- ✅ Integración Google Calendar
- ✅ Logging en CRM

**Reminders (Cron - 10:00 AM):**
- ✅ Búsqueda de citas del día siguiente
- ✅ Envío de recordatorios
- ✅ Marcado como enviado

**Webhook URL:** `/webhook/appointment-booking`  
**Schedule:** Diario 10:00 AM

---

### 4️⃣ Follow-up & Nurturing Automation
**Archivo:** `4-followup-automation-whatsapp.json`  
**Trigger:** Cron + Webhook  
**Nodos:** 32

**Función:** Seguimiento post-visita y nurturing de leads tibios.

**Características:**

**Post-Visita (Cron - 18:00):**
- ✅ Busca citas completadas del día
- ✅ Envía mensaje de seguimiento
- ✅ Logging en CRM

**Nurturing (Cron - Lunes 10:00):**
- ✅ Identifica leads tibios (>7 días sin contacto)
- ✅ Busca nuevas propiedades de la semana
- ✅ Match con preferencias del lead
- ✅ Envío de alertas de nuevas propiedades
- ✅ Actualización de última fecha de contacto

**Response Detection (Webhook):**
- ✅ Detecta interés en respuestas
- ✅ Upgrade a "hot lead" si positivo
- ✅ Notificación al equipo de ventas (Slack)

**Webhook URL:** `/webhook/whatsapp-response`  
**Schedule:** 
- Post-visita: Diario 18:00
- Nurturing: Lunes 10:00

---

## 🚀 Quick Start

### 1. Importar Workflows

```bash
# Via interfaz web n8n
# Workflows → + New → Import from File → Seleccionar JSON
```

### 2. Configurar Credenciales

Necesarias en n8n:
- **Twenty CRM API** (HTTP Header Auth)
- **WhatsApp API Auth** (HTTP Header Auth)
- **PostgreSQL - Properties DB** (Postgres)

### 3. Activar Workflows

Toggle "Active" en cada workflow en n8n.

---

## 📚 Documentación Completa

Ver: [`/docs/N8N_WORKFLOWS_GUIDE.md`](../docs/N8N_WORKFLOWS_GUIDE.md)

---

**Versión:** 1.0.0  
**Actualizado:** 2026-01-01
