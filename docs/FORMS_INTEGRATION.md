# FRONTEND - CONTACT FORMS INTEGRATION

Documentación de integración de formularios con n8n webhooks, validación y analytics.

---

## 📋 Contenido

- [Componentes](#componentes)
- [Configuración](#configuración)
- [Uso](#uso)
- [Validación](#validación)
- [Analytics](#analytics)
- [Testing](#testing)

---

## 🧩 Componentes

### ContactForm

Componente reutilizable con 4 tipos configurables:

```typescript
type ContactFormType = 'general' | 'property-inquiry' | 'valuation' | 'consultation';
```

**Props**:
- `type?: ContactFormType` - Tipo de formulario (default: 'general')
- `propertyId?: string` - ID de propiedad (solo para property-inquiry)
- `propertyUrl?: string` - URL completa de propiedad (metadata)

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crear archivo `.env.local`:

```bash
# n8n Webhooks (DEBE ser NEXT_PUBLIC_)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.ancloraprivateestates.com

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 2. Verificar Endpoints en Config

Archivo: `/lib/config.ts`

```typescript
integrations: {
  n8n: {
    baseUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
    endpoints: {
      contactGeneral: '/webhook/contact-general',
      propertyInquiry: '/webhook/contact-property-inquiry',
      valuation: '/webhook/contact-valuation',
      consultation: '/webhook/contact-consultation',
    },
  },
}
```

---

## 💻 Uso

### Ejemplo 1: Formulario General

```tsx
import { ContactForm } from '@/components/shared/ContactForm';

export default function ContactPage() {
  return (
    <div>
      <h1>Contáctanos</h1>
      <ContactForm type="general" />
    </div>
  );
}
```

### Ejemplo 2: Property Inquiry

```tsx
import { ContactForm } from '@/components/shared/ContactForm';

export default function PropertyDetail({ property }) {
  return (
    <div>
      <h2>{property.title}</h2>
      <ContactForm
        type="property-inquiry"
        propertyId={property.id}
        propertyUrl={`https://ancloraprivateestates.com/propiedades/${property.slug}`}
      />
    </div>
  );
}
```

### Ejemplo 3: Formulario de Valoración

```tsx
import { ContactForm } from '@/components/shared/ContactForm';

export default function ValuationPage() {
  return (
    <div>
      <h1>Valoración Gratuita</h1>
      <p>Obtén el precio de mercado de tu propiedad</p>
      <ContactForm type="valuation" />
    </div>
  );
}
```

### Ejemplo 4: Consultoría

```tsx
import { ContactForm } from '@/components/shared/ContactForm';

export default function ServicesPage() {
  return (
    <div>
      <h1>Consultoría Inmobiliaria</h1>
      <ContactForm type="consultation" />
    </div>
  );
}
```

---

## ✅ Validación

### Validación en Tiempo Real

El formulario valida automáticamente cuando:
1. El usuario sale de un campo (onBlur)
2. El usuario escribe después de haber tocado el campo

### Reglas de Validación

**Nombre**:
- Requerido
- No vacío

**Email**:
- Requerido
- Formato válido: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Teléfono**:
- Requerido solo para `type="valuation"`
- Formato válido: `/^[+]?[\d\s()-]{9,}$/`

**Mensaje**:
- Requerido
- No vacío

**Privacidad**:
- Checkbox debe estar marcado

---

## 📊 Analytics

### Google Tag Manager Integration

El componente envía eventos a `dataLayer` automáticamente:

**Eventos:**

```javascript
// Cuando el formulario se envía
{
  event: 'form_submit_started',
  formType: 'property-inquiry'
}

// Cuando falla validación
{
  event: 'form_validation_failed',
  formType: 'valuation',
  errors: { email: 'Email inválido' }
}

// Cuando se envía con éxito
{
  event: 'form_submit_success',
  formType: 'general',
  contactId: 'contact_123',
  leadScore: 85
}

// Cuando falla el envío
{
  event: 'form_submit_error',
  formType: 'consultation',
  error: 'Network error'
}
```

### Configurar GTM

1. Crear Tag en GTM:
   - Type: GA4 Event
   - Event Name: `{{ Event }}`
   - Trigger: Custom Event → `form_submit_success`

2. Crear Variables:
   - `formType`: Data Layer Variable → `formType`
   - `contactId`: Data Layer Variable → `contactId`
   - `leadScore`: Data Layer Variable → `leadScore`

---

## 🧪 Testing

### Test Manual en Browser

```javascript
// Abrir consola del navegador

// 1. Verificar configuración
console.log(window.siteConfig?.integrations?.n8n);

// 2. Verificar dataLayer
console.log(window.dataLayer);

// 3. Simular envío (sin UI)
fetch('https://n8n.ancloraprivateestates.com/webhook/contact-general', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+34 600000000',
    message: 'Test message from browser',
    acceptPrivacy: true
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Test con cURL

```bash
# Test General Contact
curl -X POST https://n8n.ancloraprivateestates.com/webhook/contact-general \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+34 600000000",
    "message": "Test message",
    "acceptPrivacy": true
  }'

# Test Property Inquiry con Lead Scoring
curl -X POST https://n8n.ancloraprivateestates.com/webhook/contact-property-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hot Lead Test",
    "email": "hotlead@example.com",
    "phone": "+34 611111111",
    "message": "Very interested, ready to buy",
    "propertyId": "villa-001",
    "budget": "over-2m",
    "timeline": "immediate",
    "acceptPrivacy": true
  }'
```

---

## 🔧 Troubleshooting

### Error: "Failed to fetch"

**Problema**: CORS o red bloqueada

**Solución**:
1. Verificar que n8n tiene CORS configurado correctamente
2. Verificar que `NEXT_PUBLIC_N8N_WEBHOOK_URL` está correcta
3. Comprobar en Network tab del browser

### Error: "Missing required fields"

**Problema**: Payload no coincide con lo esperado por n8n

**Solución**:
1. Verificar que el workflow de n8n espera los campos correctos
2. Ver logs de n8n para detalles del error
3. Comparar payload enviado vs esperado

### Form se envía pero no hay respuesta

**Problema**: n8n no responde o responde incorrectamente

**Solución**:
1. Verificar que el workflow tiene nodo "Respond to Webhook"
2. Verificar que la respuesta es JSON válido
3. Ver Network tab → Response

### Analytics no se registran

**Problema**: GTM no configurado o dataLayer no disponible

**Solución**:
1. Verificar que GTM está instalado en layout
2. Comprobar: `window.dataLayer` en consola
3. Verificar que el GTM ID es correcto

---

## 📝 Checklist de Deployment

- [ ] `.env.local` configurado con `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- [ ] Workflows de n8n importados y activos
- [ ] Webhooks n8n tienen CORS habilitado para el dominio
- [ ] SMTP credentials configuradas en n8n
- [ ] Twenty CRM API key configurada
- [ ] GTM instalado en el sitio
- [ ] Tags de GTM configurados para eventos de formulario
- [ ] Tests manuales en cada tipo de formulario
- [ ] Tests de emails (confirmación + notificación)
- [ ] Tests de CRM (contacto creado correctamente)
- [ ] Verificar lead scoring con diferentes inputs

---

## 🚀 Performance

### Optimizaciones Implementadas

1. **Validación Lazy**: Solo valida cuando el campo fue tocado
2. **Debouncing**: No implementado (opcional para validación async)
3. **Loading States**: Botón disabled durante envío
4. **Error Boundaries**: Errores manejados sin crash

### Mejoras Futuras

- [ ] Rate limiting client-side (max 3 envíos por 5 minutos)
- [ ] Retry logic con exponential backoff
- [ ] Offline queue (guardar en localStorage si no hay red)
- [ ] Progressive enhancement (funciona sin JS)

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0
