# EMAIL TEMPLATES - ANCLORA PRIVATE ESTATES

Guía completa para el uso e integración de templates de email en n8n workflows.

---

## 📋 Contenido

- [Templates Disponibles](#templates-disponibles)
- [Variables de Reemplazo](#variables-de-reemplazo)
- [Integración en n8n](#integración-en-n8n)
- [Personalización](#personalización)
- [Testing](#testing)
- [Best Practices](#best-practices)

---

## 📧 Templates Disponibles

### 1. Base Template
**Archivo**: `base-template.html`  
**Uso**: Plantilla maestra con header, footer y estructura común  
**Variables**: `{{LOGO_URL}}`, `{{HEADER_TITLE}}`, `{{EMAIL_CONTENT}}`, `{{YEAR}}`, `{{UNSUBSCRIBE_URL}}`

### 2. Confirmación - Contacto General
**Archivo**: `confirmation-general.html`  
**Propósito**: Confirmación automática al usuario tras contacto general  
**Variables**: `{{NAME}}`, `{{MESSAGE}}`  
**SLA**: Respuesta en 24h

### 3. Confirmación - Property Inquiry
**Archivo**: `confirmation-property-inquiry.html`  
**Propósito**: Confirmación tras consulta sobre propiedad específica  
**Variables**: `{{NAME}}`, `{{PROPERTY_ID}}`, `{{PROPERTY_TITLE}}`, `{{PROPERTY_URL}}`, `{{MESSAGE}}`  
**SLA**: Respuesta en 2h

### 4. Confirmación - Valoración
**Archivo**: `confirmation-valuation.html`  
**Propósito**: Confirmación de solicitud de valoración de propiedad  
**Variables**: `{{NAME}}`, `{{PROPERTY_TYPE}}`, `{{MESSAGE}}`  
**SLA**: Respuesta en 24h

### 5. Confirmación - Consultoría
**Archivo**: `confirmation-consultation.html`  
**Propósito**: Confirmación de solicitud de consultoría  
**Variables**: `{{NAME}}`, `{{MESSAGE}}`  
**SLA**: Respuesta en 48h

### 6. Notificación Interna - Property Inquiry
**Archivo**: `notification-property-inquiry.html`  
**Propósito**: Notificación completa al equipo con lead scoring  
**Variables**: Múltiples (ver sección variables)  
**Features**: Lead scoring visual, CRM quick links, acciones recomendadas

### 7. Notificación Interna - General
**Archivo**: `notification-general.html`  
**Propósito**: Notificación simple al equipo  
**Variables**: `{{NAME}}`, `{{EMAIL}}`, `{{PHONE}}`, `{{MESSAGE}}`, `{{CONTACT_ID}}`

---

## 🔧 Variables de Reemplazo

### Comunes
```
{{NAME}}           - Nombre completo del contacto
{{EMAIL}}          - Email del contacto
{{PHONE}}          - Teléfono del contacto
{{MESSAGE}}        - Mensaje del formulario
{{TIMESTAMP}}      - Fecha y hora de recepción
{{YEAR}}           - Año actual (para footer)
{{LOGO_URL}}       - URL del logo (puede ser base64)
```

### Property Inquiry
```
{{PROPERTY_ID}}    - ID de la propiedad (ej: villa-puerto-andratx-001)
{{PROPERTY_TITLE}} - Título de la propiedad
{{PROPERTY_URL}}   - URL completa a la página de la propiedad
{{BUDGET}}         - Rango de presupuesto seleccionado
{{TIMELINE}}       - Timeline de compra
```

### Lead Scoring (Property Inquiry)
```
{{LEAD_SCORE}}          - Score total (0-100)
{{LEAD_CLASS}}          - hot, warm, o cold (lowercase)
{{LEAD_CLASS_UPPER}}    - HOT, WARM, o COLD (uppercase)
{{PRIORITY_TIME}}       - Texto: "Contactar en 2h", "24h", etc
{{SCORE_BUDGET}}        - Puntos de presupuesto
{{SCORE_TIMELINE}}      - Puntos de timeline
{{SCORE_INTEREST}}      - Puntos de interés
{{SCORE_COMPLETENESS}}  - Puntos de completitud
{{SCORE_FORM}}          - Puntos de formulario completo
```

### CRM Integration
```
{{CONTACT_ID}}     - ID del contacto en Twenty CRM
{{DEAL_ID}}        - ID del deal creado (si aplica)
```

### Otros
```
{{PROPERTY_TYPE}}     - Tipo de propiedad (para valoración)
{{PHONE_DISPLAY}}     - Teléfono formateado o "No proporcionado"
{{UNSUBSCRIBE_URL}}   - URL para darse de baja
```

---

## ⚙️ Integración en n8n

### Método 1: HTML Inline (Recomendado para templates cortos)

```javascript
// En nodo "Code" o "Function"
const html = `
<!DOCTYPE html>
<html>
<body>
  <h1>Hola ${data.name}</h1>
  <p>${data.message}</p>
</body>
</html>
`;

return { json: { html } };
```

### Método 2: Template desde Archivo (Recomendado para templates largos)

**Paso 1**: Subir template a servidor web accesible

```bash
# Ejemplo con AWS S3
aws s3 cp base-template.html s3://anclora-assets/email-templates/

# URL resultante:
https://assets.ancloraprivateestates.com/email-templates/base-template.html
```

**Paso 2**: En n8n, usar nodo HTTP Request

```javascript
// Nodo: HTTP Request
{
  "method": "GET",
  "url": "https://assets.ancloraprivateestates.com/email-templates/confirmation-general.html"
}
```

**Paso 3**: Reemplazar variables con nodo Code

```javascript
// Nodo: Code
let html = $input.first().json.data; // HTML del template

// Reemplazos
html = html.replace(/{{NAME}}/g, $('Webhook').item.json.body.name);
html = html.replace(/{{EMAIL}}/g, $('Webhook').item.json.body.email);
html = html.replace(/{{MESSAGE}}/g, $('Webhook').item.json.body.message);
html = html.replace(/{{YEAR}}/g, new Date().getFullYear());
html = html.replace(/{{LOGO_URL}}/g, 'https://assets.ancloraprivateestates.com/logo.png');

return { json: { html } };
```

### Método 3: Template Embedding en n8n (Simplificado)

```javascript
// Función para cargar y procesar template
function renderTemplate(templateName, variables) {
  // En producción, cargar desde URL o base de datos
  const templates = {
    'general': `<html>...</html>`,
    'property-inquiry': `<html>...</html>`,
  };
  
  let html = templates[templateName];
  
  // Reemplazar todas las variables
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value || '');
  }
  
  return html;
}

// Uso:
const html = renderTemplate('general', {
  NAME: $input.first().json.name,
  EMAIL: $input.first().json.email,
  MESSAGE: $input.first().json.message,
  YEAR: new Date().getFullYear(),
});

return { json: { html } };
```

---

## 🎨 Personalización

### Colores del Brand

```css
/* En templates HTML */
--anclora-gold: #C5A059;
--anclora-gold-light: #D4B575;
--anclora-gold-dark: #A6834A;
--anclora-black: #1A1A1A;
--anclora-gray: #4A4A4A;
--anclora-beige: #FAF9F6;
```

### Logo

**Opción A**: URL externa
```html
<img src="https://assets.ancloraprivateestates.com/logo-email.png" alt="Anclora">
```

**Opción B**: Base64 embebido (mejor para deliverability)
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." alt="Anclora">
```

**Generar Base64**:
```bash
base64 -i logo.png -o logo-base64.txt
```

### Personalizar por Tipo de Lead

```html
<!-- En notification-property-inquiry.html -->
<div class="score-header {{LEAD_CLASS}}">
  <!-- CSS dinámico según clase -->
</div>

<style>
.score-header.hot { background: #dc2626; }
.score-header.warm { background: #ea580c; }
.score-header.cold { background: #6b7280; }
</style>
```

---

## 🧪 Testing

### Test 1: Renderizado HTML

**Herramientas**:
- [Litmus](https://litmus.com) - Testing en múltiples clientes email
- [Email on Acid](https://www.emailonacid.com) - Similar a Litmus
- [Mailtrap](https://mailtrap.io) - SMTP de testing (no envía emails reales)

**Proceso**:
1. Enviar email a Mailtrap
2. Verificar renderizado en preview
3. Comprobar todas las variables reemplazadas
4. Verificar links funcionan

### Test 2: Spam Score

**Herramientas**:
- [Mail Tester](https://www.mail-tester.com)
- Enviar email y obtener score /10

**Optimizaciones**:
- Ratio texto/imagen: 60/40 mínimo
- Evitar palabras spam: "gratis", "oferta limitada", etc
- SPF, DKIM, DMARC configurados
- No usar shorteners de URL

### Test 3: Variables n8n

```javascript
// Test en nodo Code de n8n
const testData = {
  NAME: 'Test User',
  EMAIL: 'test@example.com',
  PHONE: '+34 600 000 000',
  MESSAGE: 'This is a test message',
  PROPERTY_ID: 'villa-test-001',
  LEAD_SCORE: 85,
  LEAD_CLASS: 'hot',
  TIMESTAMP: new Date().toISOString(),
};

// Renderizar template con datos de prueba
const html = renderTemplate('property-inquiry', testData);

// Enviar a email de prueba
return { 
  json: { 
    to: 'test@ancloraprivateestates.com',
    subject: 'TEST - Property Inquiry',
    html: html 
  } 
};
```

---

## 📝 Best Practices

### 1. Responsive Design

Todos los templates usan media queries:

```css
@media only screen and (max-width: 600px) {
  .email-wrapper { width: 100% !important; }
  .email-button { display: block; }
  /* etc */
}
```

**Siempre testear en**:
- Desktop: Outlook, Gmail, Apple Mail
- Mobile: iOS Mail, Gmail App, Outlook App

### 2. Fallbacks

```html
<!-- Imágenes con fallback -->
<img src="{{LOGO_URL}}" 
     alt="Anclora Private Estates"
     style="max-width: 200px;"
     onerror="this.style.display='none'">

<!-- Colores con fallback -->
<div style="background-color: #C5A059; background: linear-gradient(135deg, #C5A059 0%, #D4B575 100%);">
```

### 3. Plain Text Alternative

n8n permite enviar versión plain text:

```javascript
{
  emailType: 'html',
  html: htmlContent,
  text: plainTextFallback  // Auto-generado o manual
}
```

**Auto-generar**:
```javascript
const plainText = html
  .replace(/<[^>]*>/g, '')  // Quitar tags
  .replace(/\s+/g, ' ')      // Normalizar espacios
  .trim();
```

### 4. Tracking

**Open Tracking**:
```html
<img src="https://track.ancloraprivateestates.com/open/{{CONTACT_ID}}" 
     width="1" height="1" alt="">
```

**Click Tracking**:
```html
<a href="https://track.ancloraprivateestates.com/click?url={{ENCODED_URL}}&contact={{CONTACT_ID}}">
  Ver Propiedad
</a>
```

### 5. Unsubscribe

**Requerido por ley (GDPR)**:
```html
<a href="https://ancloraprivateestates.com/unsubscribe?email={{EMAIL_ENCODED}}">
  Darse de baja
</a>
```

### 6. Accesibilidad

```html
<!-- ALT text en imágenes -->
<img src="..." alt="Logo Anclora Private Estates">

<!-- Contrast ratio mínimo 4.5:1 -->
<p style="color: #4A4A4A; background: #FFFFFF;">Text</p>

<!-- Semantic HTML -->
<header>, <main>, <footer>
```

---

## 🚀 Deployment Checklist

**Antes de producción**:
- [ ] Todos los templates tienen variables documentadas
- [ ] Templates testeados en Litmus/Email on Acid
- [ ] Spam score > 8/10 en Mail Tester
- [ ] Logo embebido como base64
- [ ] Links verificados (no 404)
- [ ] Unsubscribe link funcional
- [ ] SPF/DKIM/DMARC configurados en dominio
- [ ] Plain text fallback generado
- [ ] Responsive en mobile verificado
- [ ] CRM links funcionan correctamente

---

## 📚 Recursos

**Documentación**:
- [MJML](https://mjml.io) - Framework para emails responsive
- [Foundation for Emails](https://get.foundation/emails.html) - Similar a MJML
- [Can I Email](https://www.caniemail.com) - Compatibilidad CSS en clientes email

**Herramientas**:
- [Topol](https://topol.io) - Editor visual de emails
- [Stripo](https://stripo.email) - Otro editor visual

**Inspiración**:
- [Really Good Emails](https://reallygoodemails.com)
- [Milled](https://milled.com)

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0
