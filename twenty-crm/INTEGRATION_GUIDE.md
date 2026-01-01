# TWENTY CRM INTEGRATION GUIDE

Guía completa de integración de Twenty CRM con Anclora Private Estates.

---

## 📋 Contenido

- [Overview](#overview)
- [Setup Initial](#setup-initial)
- [Custom Fields Configuration](#custom-fields-configuration)
- [n8n Integration](#n8n-integration)
- [Data Flows](#data-flows)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Architecture

```
┌─────────────────────┐
│  Website Forms      │
│  (Next.js)          │
└──────────┬──────────┘
           │
           ↓ POST Webhook
┌─────────────────────┐
│  n8n Workflows      │
│  - Validation       │
│  - Lead Scoring     │
│  - Email Sending    │
└──────────┬──────────┘
           │
           ↓ REST API
┌─────────────────────┐
│  Twenty CRM         │
│  - Contacts         │
│  - Deals            │
│  - Activities       │
└─────────────────────┘
```

### Components

**Twenty CRM Objects**:
- **Contact**: Leads, clients, prospects
- **Deal**: Sales opportunities, transactions
- **Activity**: Calls, emails, meetings, notes

**Custom Fields**: 27 contact fields, 9 deal fields

**Pipeline**: 8-stage sales pipeline with probability weighting

---

## 🚀 Setup Initial

### Prerequisites

- Twenty CRM instance deployed
- Admin access to Twenty CRM
- API key generated
- Workspace ID identified

### Step 1: Environment Setup

```bash
# .env
TWENTY_CRM_API_URL=https://twenty.ancloraprivateestates.com/api/rest
TWENTY_CRM_API_KEY=your_api_key_here
TWENTY_CRM_WORKSPACE_ID=your_workspace_id
```

### Step 2: Automated Setup

```bash
# Install dependencies
pip install requests

# Run setup script
cd twenty-crm
python setup_twenty_crm.py

# Follow prompts
```

**What the script does**:
1. Verifies API connection
2. Creates 27 contact custom fields
3. Creates 9 deal custom fields
4. Creates sales pipeline with 8 stages
5. Exports configuration JSON

**Estimated time**: 5-10 minutes

### Step 3: Manual Verification

1. Login to Twenty CRM
2. Go to Settings → Data Model → Contact
3. Verify all custom fields are present
4. Go to Deals → Pipeline
5. Verify pipeline stages

---

## 🔧 Custom Fields Configuration

### Contact Fields Groups

**Lead Management** (4 fields):
- leadSource: Where did the lead come from?
- leadScore: 0-100 algorithmic score
- leadStatus: Current stage in nurturing
- leadClassification: hot/warm/cold

**Property Interest** (5 fields):
- interestedPropertyType: Types they want
- interestedPropertyId: Last property inquired
- preferredLocations: Where they want to buy
- budgetRange: Price range
- timeline: When they plan to buy

**Client Profile** (4 fields):
- clientType: Buyer/Seller/Investor
- nationality: Country of origin
- language: Preferred communication language
- netWorthCategory: HNWI classification

**Request Info** (3 fields):
- requestType: Type of initial inquiry
- initialMessage: First message from form
- propertyToSell: For valuation requests

**Communication** (4 fields):
- preferredContactMethod: Email/Phone/WhatsApp
- whatsapp: WhatsApp number
- lastContactedAt: Last outreach timestamp
- nextFollowUpAt: Scheduled follow-up

**GDPR** (3 fields):
- gdprConsent: Privacy policy accepted
- marketingConsent: Accepts marketing emails
- dataSource: Original capture URL

### Deal Fields

**Deal Details** (8 fields):
- dealType: Purchase/Sale/Rental
- propertyId: Reference ID
- propertyAddress: Full address
- askingPrice: Listed price
- offerPrice: Client's offer
- finalPrice: Closed price
- commission: Our fee amount
- commissionPercentage: Our fee %

**Deal Status** (1 field):
- dealPriority: Low/Medium/High/Critical
- lostReason: Why deal was lost

### Field Access Control

**Recommended permissions**:

| Field | Sales Rep | Manager | Admin |
|-------|-----------|---------|-------|
| leadScore | Read | Edit | Edit |
| leadStatus | Edit | Edit | Edit |
| budgetRange | Read | Read | Edit |
| netWorthCategory | No | Read | Edit |
| commission | No | Read | Edit |

---

## 🔗 n8n Integration

### Contact Creation Flow

**Workflow**: `contact-form-property-inquiry.json`

```javascript
// Node: Create Contact in Twenty CRM

const webhookData = $input.first().json.body;

// Prepare payload
const contactPayload = {
  firstName: webhookData.name.split(' ')[0],
  lastName: webhookData.name.split(' ').slice(1).join(' ') || '-',
  email: webhookData.email,
  phone: webhookData.phone || null,
  
  // Custom fields
  leadSource: 'Website - Property Inquiry',
  leadScore: webhookData.leadScore,
  leadStatus: 'new',
  leadClassification: webhookData.leadClassification,
  
  interestedPropertyId: webhookData.propertyId,
  budgetRange: webhookData.budget || 'Not Disclosed',
  timeline: webhookData.timeline || 'Not Disclosed',
  
  clientType: 'Buyer',
  language: 'Spanish', // Default, can detect from form
  
  requestType: 'Property Viewing',
  initialMessage: webhookData.message,
  
  preferredContactMethod: 'Email',
  
  gdprConsent: true,
  marketingConsent: false,
  dataSource: `https://ancloraprivateestates.com/propiedades/${webhookData.propertyId}`
};

// Call Twenty CRM API
return {
  method: 'POST',
  url: `${TWENTY_CRM_API_URL}/contacts`,
  headers: {
    'Authorization': `Bearer ${TWENTY_CRM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: contactPayload
};
```

### Deal Creation Flow

```javascript
// Node: Create Deal (only for property inquiries)

const contact = $('Create Contact').item.json;
const webhookData = $input.first().json.body;

// Calculate deal value estimate
const budgetMap = {
  'under-500k': 400000,
  '500k-1m': 750000,
  '1m-2m': 1500000,
  'over-2m': 3000000
};

const estimatedValue = budgetMap[webhookData.budget] || 1000000;

// Map timeline to expected close date
const timelineMonths = {
  'immediate': 1,
  '1-3-months': 2,
  '3-6-months': 4,
  '6-12-months': 9,
  'exploring': 12
};

const monthsToClose = timelineMonths[webhookData.timeline] || 6;
const expectedCloseDate = new Date();
expectedCloseDate.setMonth(expectedCloseDate.getMonth() + monthsToClose);

// Determine initial stage
let initialStage = 'New Lead';
if (webhookData.leadScore >= 80) {
  initialStage = 'Qualified';
} else if (webhookData.leadScore >= 60) {
  initialStage = 'Contacted';
}

const dealPayload = {
  title: `${contact.firstName} ${contact.lastName} - ${webhookData.propertyId}`,
  contactId: contact.id,
  stage: initialStage,
  value: estimatedValue,
  probability: webhookData.leadScore,
  expectedCloseDate: expectedCloseDate.toISOString().split('T')[0],
  
  // Custom fields
  dealType: 'Purchase',
  propertyId: webhookData.propertyId,
  dealPriority: webhookData.leadScore >= 80 ? 'High' : 'Medium'
};

return {
  method: 'POST',
  url: `${TWENTY_CRM_API_URL}/deals`,
  headers: {
    'Authorization': `Bearer ${TWENTY_CRM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: dealPayload
};
```

### Activity Logging Flow

```javascript
// Node: Log Initial Contact Activity

const contact = $('Create Contact').item.json;
const webhookData = $input.first().json.body;

const activityPayload = {
  type: 'note',
  contactId: contact.id,
  dealId: $('Create Deal').item.json.id,
  subject: 'Initial Website Inquiry',
  description: `Lead filled property inquiry form.
  
Property: ${webhookData.propertyId}
Budget: ${webhookData.budget || 'Not specified'}
Timeline: ${webhookData.timeline || 'Not specified'}
Lead Score: ${webhookData.leadScore}/100
Classification: ${webhookData.leadClassification}

Message:
${webhookData.message}`,
  
  scheduledAt: new Date().toISOString(),
  completedAt: new Date().toISOString()
};

return {
  method: 'POST',
  url: `${TWENTY_CRM_API_URL}/activities`,
  headers: {
    'Authorization': `Bearer ${TWENTY_CRM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: activityPayload
};
```

---

## 📊 Data Flows

### Flow 1: Property Inquiry → CRM

```
User fills form
    ↓
n8n validates
    ↓
Calculate lead score
    ↓
Create Contact (with 15 custom fields)
    ↓
Create Deal (with 3 custom fields)
    ↓
Log Activity (note type)
    ↓
Send emails (confirmation + notification)
```

### Flow 2: Valuation Request → CRM

```
User fills valuation form
    ↓
n8n validates
    ↓
Create Contact:
  - leadScore: 80 (high intent)
  - leadClassification: warm
  - requestType: Valuation
  - propertyToSell: [type]
    ↓
Send emails
```

### Flow 3: Contact Update from Deal Progress

```
Deal stage changes
    ↓
Automation rule triggers
    ↓
Update Contact:
  - leadStatus = deal.stage
  - lastContactedAt = now
  - nextFollowUpAt = +7 days
```

---

## 🔌 API Reference

### Base URL
```
https://twenty.ancloraprivateestates.com/api/rest
```

### Authentication
```bash
# Header
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### Create Contact
```http
POST /contacts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+34 600 000 000",
  "leadSource": "Website - Property Inquiry",
  "leadScore": 85,
  "leadStatus": "new",
  "leadClassification": "hot"
}
```

**Response**:
```json
{
  "id": "uuid-here",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "leadScore": 85,
  "createdAt": "2025-12-31T10:00:00Z",
  "url": "https://twenty.ancloraprivateestates.com/contacts/uuid-here"
}
```

#### Get Contact
```http
GET /contacts/{contactId}
```

#### Update Contact
```http
PATCH /contacts/{contactId}
Content-Type: application/json

{
  "leadScore": 90,
  "leadStatus": "contacted",
  "lastContactedAt": "2025-12-31T10:00:00Z"
}
```

#### Search Contacts
```http
POST /contacts/search
Content-Type: application/json

{
  "filters": {
    "leadClassification": "hot",
    "leadStatus": "new"
  },
  "orderBy": { "field": "leadScore", "direction": "DESC" },
  "limit": 50
}
```

#### Create Deal
```http
POST /deals
Content-Type: application/json

{
  "title": "John Doe - villa-001",
  "contactId": "uuid-here",
  "stage": "Qualified",
  "value": 1500000,
  "probability": 85,
  "expectedCloseDate": "2026-06-01",
  "dealType": "Purchase",
  "propertyId": "villa-001",
  "dealPriority": "High"
}
```

#### Create Activity
```http
POST /activities
Content-Type: application/json

{
  "type": "call",
  "contactId": "uuid-here",
  "dealId": "uuid-here",
  "subject": "Initial qualification call",
  "description": "Discussed property requirements...",
  "scheduledAt": "2025-12-31T15:00:00Z"
}
```

---

## 💡 Best Practices

### 1. Data Quality

**Always provide**:
- First and last name (split from full name)
- Valid email
- Lead source
- Initial message

**Validate before sending**:
```javascript
function validateContactData(data) {
  const errors = [];
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Invalid email');
  }
  
  if (!data.firstName || !data.lastName) {
    errors.push('Name must have first and last');
  }
  
  if (!data.leadSource) {
    errors.push('Lead source required');
  }
  
  return errors.length === 0;
}
```

### 2. Lead Scoring Maintenance

**Decay rule** (run daily):
```javascript
// Reduce score for inactive contacts
const daysSinceContact = (Date.now() - contact.lastContactedAt) / 86400000;

if (daysSinceContact > 30) {
  contact.leadScore = Math.max(0, contact.leadScore - 5);
}

if (daysSinceContact > 90) {
  contact.leadStatus = 'nurturing';
}
```

### 3. Deal Probability

**Auto-update based on stage**:
```javascript
const stageProbability = {
  'New Lead': 10,
  'Contacted': 20,
  'Qualified': 40,
  'Property Viewing': 60,
  'Proposal Sent': 70,
  'Negotiation': 80,
  'Won': 100,
  'Lost': 0
};

deal.probability = stageProbability[deal.stage];
```

### 4. Activity Logging

**Log every interaction**:
- Inbound: Form fills, emails received, calls
- Outbound: Emails sent, calls made, meetings
- Milestone: Property viewings, proposals, negotiations

### 5. Deduplication

**Check before creating**:
```javascript
// Search for existing contact by email
const existingContact = await searchContacts({ email: newContact.email });

if (existingContact.length > 0) {
  // Update existing instead of creating new
  await updateContact(existingContact[0].id, newContact);
} else {
  await createContact(newContact);
}
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error

**Cause**: Invalid or expired API key

**Solution**:
1. Verify API key in .env
2. Regenerate key in Twenty CRM Settings
3. Update n8n credentials

### Issue: Custom Field Not Found

**Cause**: Field not created or wrong name

**Solution**:
```bash
# List all fields
curl -X GET https://twenty.ancloraprivateestates.com/api/rest/metadata/objects/contact/fields \
  -H "Authorization: Bearer YOUR_API_KEY"

# Verify field name matches exactly
```

### Issue: Contact Creation Fails

**Cause**: Missing required fields

**Solution**:
```javascript
// Check response error
{
  "statusCode": 400,
  "message": "firstName is required"
}

// Ensure all required fields provided
const requiredFields = ['firstName', 'lastName', 'email', 'leadSource'];
```

### Issue: Lead Score Not Updating

**Cause**: Automation rule not triggered

**Solution**:
1. Check automation rule is active
2. Verify trigger conditions
3. Check rule execution logs

### Issue: Duplicate Contacts

**Cause**: Email deduplication not working

**Solution**:
```javascript
// Add deduplication logic in n8n
const existingContact = await fetch(
  `${TWENTY_API_URL}/contacts/search`,
  {
    method: 'POST',
    body: JSON.stringify({
      filters: { email: newContact.email }
    })
  }
);

if (existingContact.results.length > 0) {
  return { skipCreate: true, existingId: existingContact.results[0].id };
}
```

---

## 📈 Monitoring & Analytics

### Key Metrics to Track

**Lead Quality**:
- Average lead score by source
- Hot/Warm/Cold distribution
- Conversion rate by classification

**Response Time**:
- Time to first contact
- Time to qualification
- Time to close

**Pipeline Health**:
- Deals by stage
- Stage conversion rates
- Average deal size by source

### Dashboard Queries

**Top Lead Sources**:
```javascript
SELECT leadSource, COUNT(*), AVG(leadScore)
FROM contacts
WHERE createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY leadSource
ORDER BY COUNT(*) DESC
```

**Hot Leads Not Contacted**:
```javascript
SELECT * FROM contacts
WHERE leadClassification = 'hot'
  AND leadStatus = 'new'
  AND createdAt < DATE_SUB(NOW(), INTERVAL 24 HOUR)
```

---

## ✅ Deployment Checklist

**Pre-deployment**:
- [ ] Twenty CRM instance accessible
- [ ] API key generated with correct permissions
- [ ] Workspace ID identified
- [ ] Custom fields script tested on staging

**Deployment**:
- [ ] Run setup script
- [ ] Verify all fields created
- [ ] Test API endpoints with Postman
- [ ] Configure field permissions
- [ ] Update n8n workflows with correct API URL

**Post-deployment**:
- [ ] Test end-to-end flow (form → CRM)
- [ ] Verify deduplication works
- [ ] Check automation rules trigger
- [ ] Train team on new fields
- [ ] Setup monitoring dashboard

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0
