# Lead Scoring System Documentation

Sistema de puntuación algorítmica de leads con integración CRM para Anclora Private Estates.

---

## 🎯 Overview

El Lead Scoring System es un motor de puntuación inteligente que evalúa la calidad de leads basándose en múltiples factores:

- **Engagement:** Volumen de mensajes, velocidad de respuesta, recencia
- **Profile:** Budget, timeline, tipo de comprador, financiación
- **Behavior:** Preguntas realizadas, propiedades vistas, citas solicitadas
- **Source:** Origen del lead (referral, orgánico, ads, etc.)

---

## 📊 Scoring Algorithm

### Score Components (0-100)

| Component | Weight | Max Points | Description |
|-----------|--------|------------|-------------|
| **Engagement** | 30% | 30 | Message volume, response time, recency |
| **Profile** | 30% | 30 | Budget, timeline, buyer type, financing |
| **Behavior** | 30% | 30 | Questions, properties viewed, appointments |
| **Source** | 10% | 10 | Lead origin quality |

### Categories

| Score Range | Category | Action | Description |
|-------------|----------|--------|-------------|
| **80-100** | 🔥 Hot | Immediate Contact | High probability, ready to buy |
| **60-79** | 🌡️ Warm | Nurture/Follow-up | Good potential, needs engagement |
| **40-59** | ❄️ Cold | Low Priority | Limited interest, long timeline |
| **0-39** | 🚫 Unqualified | Archive | Low quality, spam indicators |

---

## 🔧 Engagement Scoring (0-30)

### Message Volume (0-8)

```typescript
if (total_messages > 20) → 8 points
if (total_messages > 10) → 6 points
if (total_messages > 5)  → 4 points
if (total_messages > 2)  → 2 points
```

### Response Time (0-8)

```typescript
if (avg_response < 5 min)   → 8 points
if (avg_response < 15 min)  → 6 points
if (avg_response < 60 min)  → 4 points
if (avg_response < 180 min) → 2 points
```

### Recency (0-8)

```typescript
if (last_interaction < 24 hours)  → 8 points
if (last_interaction < 72 hours)  → 6 points
if (last_interaction < 7 days)    → 4 points
if (last_interaction < 14 days)   → 2 points
```

### Conversation Balance (0-6)

```typescript
balance_ratio = messages_sent / messages_received

if (0.5 < ratio < 2.0) → 6 points  // Balanced
if (0.3 < ratio < 3.0) → 4 points  // Slightly unbalanced
else                   → 2 points  // Very unbalanced
```

---

## 👤 Profile Scoring (0-30)

### Budget Qualification (0-10)

```typescript
if (min_budget >= 1,000,000 EUR) → 10 points
if (min_budget >= 500,000 EUR)   → 8 points
if (min_budget >= 250,000 EUR)   → 6 points
if (min_budget >= 100,000 EUR)   → 4 points
else                             → 2 points
```

### Timeline Urgency (0-8)

```typescript
immediate    → 8 points
1-3 months   → 7 points
3-6 months   → 5 points
6-12 months  → 3 points
exploring    → 1 point
```

### Buyer Type (0-6)

```typescript
investor      → 6 points
relocating    → 5 points
end_user      → 4 points
vacation_home → 3 points
```

### Financing Status (0-6)

```typescript
cash               → 6 points
mortgage_approved  → 5 points
mortgage_needed    → 3 points
unknown            → 1 point
```

---

## 🎬 Behavior Scoring (0-30)

### Questions Asked (0-8)

```typescript
if (questions > 10) → 8 points
if (questions > 5)  → 6 points
if (questions > 3)  → 4 points
if (questions > 0)  → 2 points
```

### Properties Viewed (0-6)

```typescript
if (viewed > 5) → 6 points
if (viewed > 3) → 5 points
if (viewed > 1) → 3 points
if (viewed > 0) → 1 point
```

### Appointment Requests (0-8)

```typescript
if (appointments > 2) → 8 points
if (appointments > 1) → 6 points
if (appointments > 0) → 4 points
```

### Interest Indicators (0-8)

```typescript
specific_property_interest → +4 points
price_discussed           → +4 points
```

### Red Flags (Penalties)

```typescript
unresponsive_count       → -2 points each
negative_sentiment       → -1 point each
spam_indicators          → -3 points each
```

---

## 📈 Conversion Probability

Calculated using simplified logistic regression:

```typescript
logit = -4.0  // Base intercept

// Score contribution
logit += score * 0.08

// Profile factors
if (budget >= 500k)         logit += 0.5
if (timeline === immediate) logit += 1.0
if (financing === cash)     logit += 0.8

// Behavior factors
if (appointments > 0)           logit += 1.5
if (specific_property_interest) logit += 0.7
if (price_discussed)            logit += 0.5

// Logistic function
probability = 1 / (1 + e^(-logit))
```

---

## 💰 Estimated Value Calculation

```typescript
// Use budget range average if available
if (budget_range) {
  value = (min + max) / 2
} else {
  // Default by property type
  villa:      1,500,000 EUR
  apartment:    500,000 EUR
  land:         300,000 EUR
  commercial:   800,000 EUR
  default:      600,000 EUR
}

// Adjust by conversion probability
estimated_value = value * probability
```

---

## 🔄 API Endpoints

### Calculate Score

```bash
POST /api/scoring/calculate
Content-Type: application/json

{
  "profile": {
    "phone": "34600123456",
    "source": "referral",
    "budget_range": { "min": 1000000, "max": 1500000 },
    "timeline": "immediate",
    "buyer_type": "investor",
    "financing_status": "cash"
  },
  "behavior": {
    "total_messages": 25,
    "messages_sent": 15,
    "messages_received": 10,
    "avg_response_time_seconds": 120,
    "last_interaction": "2026-01-01T12:00:00Z",
    "questions_asked": 12,
    "properties_viewed": 8,
    "appointments_requested": 2,
    "specific_property_interest": true,
    "price_discussed": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "score": {
    "phone": "34600123456",
    "score": 87,
    "category": "hot",
    "confidence": 0.85,
    "breakdown": {
      "engagement_score": 26,
      "profile_score": 29,
      "behavior_score": 24,
      "source_score": 10
    },
    "factors": {
      "positive": [
        "High engagement",
        "High budget (>1M EUR)",
        "Immediate timeline",
        "Cash buyer",
        "Requested appointment",
        "Referral source"
      ],
      "negative": []
    },
    "recommended_action": "immediate_contact",
    "probability_conversion": 0.82,
    "estimated_value": 1025000
  }
}
```

### Auto-Calculate (with CRM enrichment)

```bash
POST /api/scoring/calculate-auto
Content-Type: application/json

{
  "phone": "34600123456"
}
```

### Get Score

```bash
GET /api/scoring/34600123456
```

### Update Behavior

```bash
POST /api/scoring/behavior/update
Content-Type: application/json

{
  "phone": "34600123456",
  "updates": {
    "properties_viewed": 5,
    "appointments_requested": 1,
    "specific_property_interest": true
  }
}
```

### Get Leads by Category

```bash
GET /api/scoring/leads/hot?limit=50
```

### Get Statistics

```bash
GET /api/scoring/statistics
```

**Response:**

```json
{
  "success": true,
  "statistics": {
    "total_leads": 1247,
    "hot_leads": 89,
    "warm_leads": 324,
    "cold_leads": 512,
    "unqualified_leads": 322,
    "avg_score": 58,
    "avg_conversion_probability": 0.34
  }
}
```

---

## 🔗 CRM Integration

### Twenty CRM Sync

**Profile Sync:**

```typescript
// Fetch lead data from CRM
const crmData = await crmIntegration.fetchLeadData(phone);

// Sync updated score to CRM
await crmIntegration.updateLeadScore(score, crmId);

// Full profile sync
const contactId = await crmIntegration.syncLeadProfile(profile, score);
```

**Custom Fields:**

- `leadScore` (number)
- `leadCategory` (string: hot/warm/cold)
- `conversionProbability` (number: 0-100)
- `estimatedValue` (number: EUR)
- `lastScoreUpdate` (datetime)

**Tags Generated:**

- `lead:hot`, `lead:warm`, `lead:cold`
- `high-probability`, `medium-probability`
- `high-value`, `medium-value`
- `action:immediate_contact`, `action:nurture`, etc.

---

## 📊 Metrics & Monitoring

### Prometheus Metrics

```
anclora_lead_scoring_calculation_duration_seconds{category}
anclora_lead_scoring_calculations_total{category,source}
anclora_lead_scoring_crm_sync_duration_seconds{operation}
anclora_lead_scoring_crm_sync_errors_total{operation}
```

### Logging

```typescript
logger.info('Lead score calculated', {
  phone,
  score: 87,
  category: 'hot',
  probability_conversion: 0.82,
});
```

---

## 🔄 Data Flow

```
1. User interacts → Analytics tracks behavior
   ↓
2. Behavior data stored in Redis
   ↓
3. Score calculation triggered (API or automatic)
   ↓
4. Fetch profile from CRM (if exists)
   ↓
5. Fetch behavior from Analytics Redis
   ↓
6. Calculate score (engagement + profile + behavior + source)
   ↓
7. Calculate conversion probability
   ↓
8. Estimate deal value
   ↓
9. Cache score in Redis (1 hour TTL)
   ↓
10. Sync score to CRM
   ↓
11. Return score to API caller
```

---

## 💾 Data Storage

### Redis Keys

```
lead:score:{phone}          → Cached score (TTL: 1 hour)
analytics:lead:{phone}      → Behavior data (TTL: 90 days)
```

### CRM Storage

- Contact record with custom fields
- Tags for categorization
- Activity history

---

## 🎯 Use Cases

### 1. Real-Time Lead Qualification

```typescript
// On new WhatsApp message
await scoringService.updateLeadBehavior(phone, {
  total_messages: increment(1),
  last_interaction: new Date(),
});

// Auto-recalculate score
const score = await scoringService.scoreLeadWithEnrichment(phone);

if (score.category === 'hot') {
  await notifyAgent(phone, score);
}
```

### 2. Batch Re-Scoring

```typescript
// Re-score all leads (e.g., nightly)
const result = await scoringService.rescoreAllLeads();
// { processed: 1247, errors: 3 }
```

### 3. Agent Dashboard

```typescript
// Get hot leads for agent
const hotLeads = await scoringService.getLeadsByCategory('hot', 50);

// Display sorted by score
hotLeads.forEach(lead => {
  console.log(`${lead.phone}: ${lead.score} (${lead.estimated_value} EUR)`);
});
```

### 4. Campaign Performance

```typescript
// Get statistics
const stats = await scoringService.getScoringStatistics();

console.log(`Conversion Rate: ${stats.avg_conversion_probability * 100}%`);
console.log(`Hot Leads: ${stats.hot_leads} (${stats.hot_leads / stats.total_leads * 100}%)`);
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit -- lead-scoring.test.ts
```

**Coverage:**

- Score calculation (all scenarios)
- Component scoring (engagement, profile, behavior, source)
- Category determination
- Conversion probability
- Value estimation
- Caching
- Factor identification

### Integration Tests

```bash
npm run test:integration -- lead-scoring-integration.test.ts
```

**Coverage:**

- CRM integration
- Analytics data fetching
- Score sync to CRM
- Batch operations

---

## 🚀 Performance

### Benchmarks

```
Score Calculation:     ~25ms average
CRM Enrichment:        ~150ms average
Full Score + Sync:     ~200ms average
Batch Re-Score:        ~100 leads/second
```

### Optimization

- Redis caching (1 hour TTL)
- Async CRM sync (non-blocking)
- Batch CRM operations
- Connection pooling

---

## 📈 Future Enhancements

### Phase 1 (Current)
- ✅ Algorithmic scoring
- ✅ CRM integration
- ✅ Real-time calculation
- ✅ API endpoints

### Phase 2 (Q1 2026)
- [ ] Machine learning model (supervised learning)
- [ ] Historical conversion data training
- [ ] A/B testing framework
- [ ] Automated model retraining

### Phase 3 (Q2 2026)
- [ ] Sentiment analysis integration
- [ ] Predictive next-best-action
- [ ] Custom scoring rules per agent
- [ ] Lead scoring reports

---

**Last Updated:** 2026-01-01  
**Version:** 1.0.0  
**Owner:** AI/ML Team
