# TWENTY CRM - CUSTOM FIELDS SCHEMA

Definición completa de campos personalizados para Anclora Private Estates en Twenty CRM.

---

## 📋 Contenido

- [Contact Object](#contact-object)
- [Deal Object](#deal-object)
- [Activity Object](#activity-object)
- [Custom Objects](#custom-objects)
- [Implementation Guide](#implementation-guide)

---

## 👤 CONTACT OBJECT

### Standard Fields (Built-in)
```typescript
{
  id: string;                    // Auto-generated UUID
  firstName: string;             // Required
  lastName: string;              // Required
  email: string;                 // Required, unique
  phone: string;                 // Optional
  createdAt: datetime;           // Auto
  updatedAt: datetime;           // Auto
}
```

### Custom Fields to Add

#### Lead Management
```json
{
  "leadSource": {
    "type": "select",
    "label": "Fuente del Lead",
    "options": [
      "Website - Contacto General",
      "Website - Property Inquiry",
      "Website - Valuation Request",
      "Website - Consultation",
      "Referral - Client",
      "Referral - Partner",
      "Facebook Ads",
      "Google Ads",
      "LinkedIn",
      "Instagram",
      "Direct Call",
      "Walk-in",
      "Event/Networking",
      "Other"
    ],
    "required": true
  },
  
  "leadScore": {
    "type": "number",
    "label": "Lead Score",
    "min": 0,
    "max": 100,
    "description": "Algorithmic lead scoring (0-100)",
    "defaultValue": 0
  },
  
  "leadStatus": {
    "type": "select",
    "label": "Estado del Lead",
    "options": [
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost",
      "nurturing"
    ],
    "defaultValue": "new",
    "required": true
  },
  
  "leadClassification": {
    "type": "select",
    "label": "Clasificación",
    "options": ["hot", "warm", "cold"],
    "description": "Based on lead scoring algorithm",
    "required": true
  }
}
```

#### Property Interest
```json
{
  "interestedPropertyType": {
    "type": "multi-select",
    "label": "Tipos de Propiedad Interesados",
    "options": [
      "Villa",
      "Apartment",
      "Penthouse",
      "Estate/Finca",
      "Land",
      "Commercial"
    ]
  },
  
  "interestedPropertyId": {
    "type": "text",
    "label": "Property ID Consulted",
    "description": "Last property they inquired about"
  },
  
  "preferredLocations": {
    "type": "multi-select",
    "label": "Ubicaciones Preferidas",
    "options": [
      "Son Vida",
      "Palma Centro",
      "Paseo Marítimo",
      "Port d'Andratx",
      "Valldemossa",
      "Deià",
      "Sóller",
      "Pollensa",
      "Alcúdia",
      "Santa Ponsa",
      "Other"
    ]
  },
  
  "budgetRange": {
    "type": "select",
    "label": "Rango de Presupuesto",
    "options": [
      "Under €500K",
      "€500K - €1M",
      "€1M - €2M",
      "€2M - €5M",
      "Over €5M",
      "Not Disclosed"
    ]
  },
  
  "timeline": {
    "type": "select",
    "label": "Timeline de Compra",
    "options": [
      "Immediate (0-1 month)",
      "Short-term (1-3 months)",
      "Medium-term (3-6 months)",
      "Long-term (6-12 months)",
      "Exploring (12+ months)",
      "Not Disclosed"
    ]
  }
}
```

#### Client Profile
```json
{
  "clientType": {
    "type": "select",
    "label": "Tipo de Cliente",
    "options": [
      "Buyer",
      "Seller",
      "Both",
      "Investor",
      "Renter",
      "Landlord"
    ],
    "required": true
  },
  
  "nationality": {
    "type": "text",
    "label": "Nacionalidad"
  },
  
  "language": {
    "type": "select",
    "label": "Idioma Preferido",
    "options": ["Spanish", "English", "German", "French", "Other"],
    "defaultValue": "Spanish"
  },
  
  "netWorthCategory": {
    "type": "select",
    "label": "Categoría Patrimonial",
    "options": [
      "HNWI (€1M-€5M)",
      "VHNWI (€5M-€30M)",
      "UHNWI (€30M+)",
      "Not Disclosed"
    ],
    "description": "High/Very High/Ultra High Net Worth Individual"
  }
}
```

#### Request Information
```json
{
  "requestType": {
    "type": "select",
    "label": "Tipo de Solicitud",
    "options": [
      "General Inquiry",
      "Property Viewing",
      "Valuation",
      "Consultation",
      "Investment Advice",
      "Property Management"
    ]
  },
  
  "initialMessage": {
    "type": "long-text",
    "label": "Mensaje Inicial",
    "description": "First message from contact form"
  },
  
  "propertyToSell": {
    "type": "text",
    "label": "Propiedad a Vender",
    "description": "For valuation/selling requests"
  }
}
```

#### Communication
```json
{
  "preferredContactMethod": {
    "type": "select",
    "label": "Método de Contacto Preferido",
    "options": ["Email", "Phone", "WhatsApp", "Video Call"],
    "defaultValue": "Email"
  },
  
  "whatsapp": {
    "type": "phone",
    "label": "WhatsApp"
  },
  
  "lastContactedAt": {
    "type": "datetime",
    "label": "Último Contacto",
    "description": "Last time we reached out"
  },
  
  "nextFollowUpAt": {
    "type": "datetime",
    "label": "Próximo Follow-up"
  }
}
```

#### GDPR & Compliance
```json
{
  "gdprConsent": {
    "type": "checkbox",
    "label": "Consentimiento GDPR",
    "description": "Privacy policy accepted",
    "required": true,
    "defaultValue": false
  },
  
  "marketingConsent": {
    "type": "checkbox",
    "label": "Consentimiento Marketing",
    "description": "Accepts marketing communications",
    "defaultValue": false
  },
  
  "dataSource": {
    "type": "text",
    "label": "Data Source",
    "description": "Original data capture source/URL"
  }
}
```

---

## 💼 DEAL OBJECT

### Standard Fields
```typescript
{
  id: string;
  title: string;              // Required
  contactId: string;          // Relation to Contact
  stage: string;              // Pipeline stage
  value: number;              // Deal value in EUR
  probability: number;        // 0-100%
  expectedCloseDate: date;
  createdAt: datetime;
  updatedAt: datetime;
}
```

### Custom Fields to Add

#### Deal Details
```json
{
  "dealType": {
    "type": "select",
    "label": "Tipo de Deal",
    "options": ["Purchase", "Sale", "Rental", "Property Management"],
    "required": true
  },
  
  "propertyId": {
    "type": "text",
    "label": "Property ID",
    "description": "Reference to property in catalog"
  },
  
  "propertyAddress": {
    "type": "text",
    "label": "Dirección Propiedad"
  },
  
  "askingPrice": {
    "type": "currency",
    "label": "Precio de Salida",
    "currency": "EUR"
  },
  
  "offerPrice": {
    "type": "currency",
    "label": "Precio Ofertado",
    "currency": "EUR"
  },
  
  "finalPrice": {
    "type": "currency",
    "label": "Precio Final",
    "currency": "EUR",
    "description": "Actual closing price"
  },
  
  "commission": {
    "type": "currency",
    "label": "Comisión",
    "currency": "EUR",
    "description": "Our commission amount"
  },
  
  "commissionPercentage": {
    "type": "number",
    "label": "% Comisión",
    "min": 0,
    "max": 100,
    "suffix": "%"
  }
}
```

#### Timeline & Milestones
```json
{
  "firstContactDate": {
    "type": "date",
    "label": "Primer Contacto"
  },
  
  "qualificationDate": {
    "type": "date",
    "label": "Fecha Cualificación"
  },
  
  "viewingDate": {
    "type": "date",
    "label": "Fecha Visita"
  },
  
  "proposalSentDate": {
    "type": "date",
    "label": "Propuesta Enviada"
  },
  
  "negotiationStartDate": {
    "type": "date",
    "label": "Inicio Negociación"
  },
  
  "expectedSigningDate": {
    "type": "date",
    "label": "Firma Prevista"
  },
  
  "actualClosingDate": {
    "type": "date",
    "label": "Cierre Real"
  }
}
```

#### Deal Status
```json
{
  "lostReason": {
    "type": "select",
    "label": "Motivo Pérdida",
    "options": [
      "Price too high",
      "Chose competitor",
      "Financing fell through",
      "Property sold",
      "Client changed mind",
      "No response",
      "Other"
    ],
    "showWhen": "stage == 'lost'"
  },
  
  "competitorName": {
    "type": "text",
    "label": "Competidor",
    "showWhen": "lostReason == 'Chose competitor'"
  },
  
  "dealPriority": {
    "type": "select",
    "label": "Prioridad",
    "options": ["Low", "Medium", "High", "Critical"],
    "defaultValue": "Medium"
  }
}
```

---

## 📝 ACTIVITY OBJECT

### Standard Fields
```typescript
{
  id: string;
  type: string;               // email, call, meeting, note
  contactId: string;          // Relation
  dealId: string;            // Optional relation
  subject: string;
  description: string;
  scheduledAt: datetime;
  completedAt: datetime;
  createdAt: datetime;
}
```

### Custom Fields to Add

```json
{
  "activityOutcome": {
    "type": "select",
    "label": "Resultado",
    "options": [
      "Successful",
      "No answer",
      "Rescheduled",
      "Not interested",
      "Follow-up needed"
    ]
  },
  
  "nextAction": {
    "type": "text",
    "label": "Próxima Acción"
  },
  
  "sentiment": {
    "type": "select",
    "label": "Sentimiento Cliente",
    "options": ["Very Positive", "Positive", "Neutral", "Negative", "Very Negative"]
  },
  
  "attendees": {
    "type": "multi-select",
    "label": "Asistentes",
    "description": "For meetings/viewings"
  }
}
```

---

## 🏢 CUSTOM OBJECTS

### Property Object (Optional)

Si Twenty CRM permite objetos custom:

```json
{
  "objectName": "Property",
  "fields": {
    "propertyId": {
      "type": "text",
      "label": "Property ID",
      "unique": true,
      "required": true
    },
    "title": {
      "type": "text",
      "label": "Título"
    },
    "type": {
      "type": "select",
      "options": ["Villa", "Apartment", "Penthouse", "Finca", "Land"]
    },
    "location": {
      "type": "text",
      "label": "Ubicación"
    },
    "price": {
      "type": "currency",
      "currency": "EUR"
    },
    "status": {
      "type": "select",
      "options": ["Available", "Under Offer", "Sold", "Off Market"]
    },
    "bedrooms": {"type": "number"},
    "bathrooms": {"type": "number"},
    "size": {"type": "number", "suffix": "m²"},
    "description": {"type": "long-text"},
    "images": {"type": "file", "multiple": true}
  },
  "relations": {
    "deals": "one-to-many",
    "contacts": "many-to-many"
  }
}
```

---

## 🔧 IMPLEMENTATION GUIDE

### Step 1: API-based Setup

```bash
# Usar Twenty CRM API para crear campos
# Endpoint: POST /api/rest/metadata/objects/{objectName}/fields

curl -X POST https://twenty.ancloraprivateestates.com/api/rest/metadata/objects/contact/fields \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "leadScore",
    "type": "number",
    "label": "Lead Score",
    "description": "Algorithmic lead scoring (0-100)",
    "defaultValue": 0
  }'
```

### Step 2: Bulk Field Creation Script

```python
# Script: twenty_crm_setup.py
import requests

TWENTY_API_URL = "https://twenty.ancloraprivateestates.com/api/rest"
API_KEY = "YOUR_API_KEY"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

CONTACT_FIELDS = [
    {
        "name": "leadSource",
        "type": "select",
        "label": "Fuente del Lead",
        "options": ["Website - Contacto General", "Website - Property Inquiry", ...],
        "required": True
    },
    # ... resto de campos
]

def create_field(object_name, field_config):
    url = f"{TWENTY_API_URL}/metadata/objects/{object_name}/fields"
    response = requests.post(url, json=field_config, headers=HEADERS)
    return response.json()

# Crear todos los campos
for field in CONTACT_FIELDS:
    print(f"Creating field: {field['name']}")
    result = create_field("contact", field)
    print(f"Result: {result}")
```

### Step 3: Manual UI Setup (Alternative)

1. Login a Twenty CRM
2. Settings → Data Model → Contact
3. Add Field → Select type
4. Configure options
5. Save

**Estimated time**: 30-45 min para todos los campos

---

## 📊 DATA MAPPING

### n8n Webhook → Twenty CRM Contact

```javascript
// Mapping function para n8n
function mapWebhookToContact(webhookData, formType) {
  const baseMapping = {
    firstName: webhookData.name.split(' ')[0],
    lastName: webhookData.name.split(' ').slice(1).join(' '),
    email: webhookData.email,
    phone: webhookData.phone,
    leadSource: `Website - ${formType}`,
    initialMessage: webhookData.message,
    gdprConsent: webhookData.acceptPrivacy,
    language: 'Spanish',  // Default, puede detectarse
    clientType: formType === 'valuation' ? 'Seller' : 'Buyer'
  };
  
  // Type-specific fields
  if (formType === 'property-inquiry') {
    return {
      ...baseMapping,
      leadScore: webhookData.leadScore,
      leadClassification: webhookData.leadClassification,
      interestedPropertyId: webhookData.propertyId,
      budgetRange: webhookData.budget,
      timeline: webhookData.timeline,
      requestType: 'Property Viewing'
    };
  }
  
  if (formType === 'valuation') {
    return {
      ...baseMapping,
      leadScore: 80,  // Valuation = high intent
      leadClassification: 'warm',
      requestType: 'Valuation',
      propertyToSell: webhookData.propertyType
    };
  }
  
  // Default general contact
  return {
    ...baseMapping,
    leadScore: 50,
    leadClassification: 'warm',
    requestType: 'General Inquiry'
  };
}
```

---

## 🔄 AUTOMATION RULES

### Rule 1: Auto-update Lead Status

```javascript
// Trigger: Deal stage changes
// Action: Update contact.leadStatus

if (deal.stage === 'proposal') {
  contact.leadStatus = 'proposal';
  contact.nextFollowUpAt = new Date(+7 days);
}

if (deal.stage === 'won') {
  contact.leadStatus = 'won';
  contact.clientType = deal.dealType === 'Purchase' ? 'Buyer' : 'Seller';
}
```

### Rule 2: Lead Score Decay

```javascript
// Trigger: Daily cron
// Action: Reduce lead score for inactive contacts

const daysSinceContact = (Date.now() - contact.lastContactedAt) / (1000 * 60 * 60 * 24);

if (daysSinceContact > 30) {
  contact.leadScore = Math.max(0, contact.leadScore - 5);
  
  if (contact.leadScore < 50 && contact.leadClassification !== 'cold') {
    contact.leadClassification = 'cold';
  }
}
```

### Rule 3: Auto-assign Deal Priority

```javascript
// Trigger: Deal created
// Action: Set priority based on value and contact score

if (deal.value > 2000000 || contact.leadScore > 80) {
  deal.dealPriority = 'Critical';
} else if (deal.value > 1000000 || contact.leadScore > 60) {
  deal.dealPriority = 'High';
} else {
  deal.dealPriority = 'Medium';
}
```

---

## ✅ VALIDATION CHECKLIST

- [ ] All custom fields created
- [ ] Field types match requirements
- [ ] Select options configured
- [ ] Required fields marked
- [ ] Default values set
- [ ] Relations established
- [ ] Automation rules tested
- [ ] Data mapping tested
- [ ] Permissions configured
- [ ] Team training completed

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0
