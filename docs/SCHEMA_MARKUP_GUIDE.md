# SCHEMA MARKUP DOCUMENTATION

Guía completa de implementación de Schema.org structured data para Anclora Private Estates.

---

## 📋 Contenido

- [Overview](#overview)
- [Available Schemas](#available-schemas)
- [Implementation Guide](#implementation-guide)
- [Real Estate Schemas](#real-estate-schemas)
- [Service Schemas](#service-schemas)
- [Content Schemas](#content-schemas)
- [Testing & Validation](#testing--validation)
- [Best Practices](#best-practices)

---

## 🎯 Overview

### What is Schema Markup?

Schema.org structured data helps search engines understand your content better and enables rich results in search:

**Benefits**:
- Enhanced search listings (rich snippets)
- Better visibility in search results
- Improved click-through rates (CTR)
- Voice search optimization
- AI/LLM-friendly content structure

**For Anclora**:
- Property listings with images, prices, specs
- Service descriptions
- Business information
- Reviews and ratings
- Location data

### Architecture

```
lib/
├── schema.ts               # Core schema generators
├── schema-examples.ts      # Real-world examples
└── seo.ts                  # Basic schemas (Organization, Breadcrumb, etc.)

components/seo/
└── SchemaRenderer.tsx      # Helper component
```

---

## 🏷️ Available Schemas

### Real Estate Schemas

| Schema Type | Purpose | Rich Results |
|-------------|---------|--------------|
| **Accommodation** | Property details | ✓ Images, Price, Specs |
| **RealEstateListing** | Property listings | ✓ Full property card |
| **Product** | Alternative for properties | ✓ Price, Availability |

### Business Schemas

| Schema Type | Purpose | Rich Results |
|-------------|---------|--------------|
| **Organization** | Company info | ✓ Knowledge panel |
| **RealEstateAgent** | Agent/agency | ✓ Business card |
| **LocalBusiness** | Local SEO | ✓ Map, Hours |
| **Service** | Service offerings | ✓ Service description |

### Content Schemas

| Schema Type | Purpose | Rich Results |
|-------------|---------|--------------|
| **Article** | Blog posts | ✓ Author, Date |
| **HowTo** | Guides/tutorials | ✓ Steps, Images |
| **FAQPage** | FAQ sections | ✓ Expandable Q&A |
| **VideoObject** | Property tours | ✓ Video preview |

### Navigation Schemas

| Schema Type | Purpose | Rich Results |
|-------------|---------|--------------|
| **BreadcrumbList** | Page hierarchy | ✓ Breadcrumb trail |
| **CollectionPage** | Listing pages | ✓ Collection info |
| **WebSite** | Site search | ✓ Sitelinks search box |

### Social Schemas

| Schema Type | Purpose | Rich Results |
|-------------|---------|--------------|
| **Review** | Client testimonials | ✓ Star rating |
| **AggregateRating** | Overall ratings | ✓ Average rating |
| **Person** | Team members | ✓ People cards |

---

## 🚀 Implementation Guide

### Basic Setup

**Step 1: Import generators**

```typescript
import { 
  generateAccommodationSchema,
  generateRealEstateListingSchema 
} from '@/lib/schema';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
```

**Step 2: Generate schemas**

```typescript
const schemas = generateAccommodationSchema({
  id: property.id,
  title: property.title,
  description: property.description,
  price: property.price,
  location: property.location,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  size: property.size,
  images: property.images,
  features: property.features,
});
```

**Step 3: Render in page**

```typescript
export default function PropertyPage({ property }) {
  const schemas = getPropertyPageSchemas(property);
  
  return (
    <>
      <SchemaRenderer schemas={schemas} />
      {/* Page content */}
    </>
  );
}
```

### Using Pre-built Examples

```typescript
import { getPropertyPageSchemas } from '@/lib/schema-examples';

export default function PropertyPage({ property }) {
  const schemas = getPropertyPageSchemas(property);
  
  return <SchemaRenderer schemas={schemas} />;
}
```

---

## 🏡 Real Estate Schemas

### Accommodation Schema

**Best for**: Detailed property pages with amenities

```typescript
const schema = generateAccommodationSchema({
  id: 'villa-son-vida-001',
  title: 'Villa de Lujo en Son Vida',
  description: 'Espectacular villa de diseño...',
  price: 3500000,
  location: 'Son Vida',
  address: {
    street: 'Calle Example 123',
    city: 'Palma de Mallorca',
    region: 'Islas Baleares',
    postalCode: '07013',
    country: 'ES',
  },
  latitude: 39.5954,
  longitude: 2.6502,
  bedrooms: 5,
  bathrooms: 4,
  size: 450,
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
  ],
  features: [
    'Piscina infinity',
    'Garaje para 3 vehículos',
    'Sistema domótica',
  ],
  amenities: {
    'Piscina': true,
    'Garaje': 3,
    'Calefacción': 'Suelo radiante',
  },
});
```

**Rich Result**:
```
Villa de Lujo en Son Vida
★★★★★ €3,500,000
📍 Son Vida, Palma de Mallorca
🛏️ 5 dormitorios • 🚿 4 baños • 📐 450m²
```

### RealEstateListing Schema

**Best for**: Property listing pages

```typescript
const schema = generateRealEstateListingSchema({
  id: 'villa-son-vida-001',
  title: 'Villa de Lujo en Son Vida',
  description: 'Espectacular villa...',
  price: 3500000,
  location: 'Son Vida',
  address: {
    city: 'Palma de Mallorca',
    region: 'Islas Baleares',
    country: 'ES',
  },
  bedrooms: 5,
  bathrooms: 4,
  totalRooms: 12,
  size: 450,
  images: ['image1.jpg', 'image2.jpg'],
  yearBuilt: 2022,
  datePosted: '2025-01-01T00:00:00Z',
  validThrough: '2026-01-01T00:00:00Z',
});
```

### Property with Video Tour

```typescript
const propertySchema = generateAccommodationSchema({...});
const videoSchema = generateVideoSchema({
  title: 'Tour Virtual - Villa Son Vida',
  description: 'Recorrido completo por la villa',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  uploadDate: '2025-01-01T00:00:00Z',
  embedUrl: 'https://youtube.com/embed/abc123',
  duration: 'PT3M45S', // 3 minutes 45 seconds
});

const schemas = [propertySchema, videoSchema];
```

---

## 💼 Service Schemas

### Basic Service Schema

```typescript
const schema = generateServiceSchema({
  serviceType: 'PropertyBuying',
  name: 'Asesoría en Compra de Propiedades de Lujo',
  description: 'Servicio integral de asesoramiento...',
  priceDescription: 'Consulta gratuita',
});
```

### Service with Price

```typescript
const schema = generateServiceSchema({
  serviceType: 'PropertyValuation',
  name: 'Valoración Profesional de Propiedades',
  description: 'Tasación y valoración...',
  price: 500,
});
```

**Output**:
```json
{
  "@type": "Service",
  "serviceType": "PropertyValuation",
  "name": "Valoración Profesional de Propiedades",
  "provider": {
    "@type": "RealEstateAgent",
    "name": "Anclora Private Estates",
    "url": "https://ancloraprivateestates.com"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 39.5696,
      "longitude": 2.6502
    },
    "geoRadius": "50000"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": 500
  }
}
```

---

## 📝 Content Schemas

### HowTo Schema (Guides)

**Use for**: Step-by-step guides, tutorials

```typescript
const schema = generateHowToSchema({
  title: 'Cómo Comprar una Propiedad en Mallorca',
  description: 'Guía completa paso a paso...',
  images: ['https://example.com/guide-cover.jpg'],
  totalTime: 'PT30M', // 30 minutes read time
  steps: [
    {
      name: 'Paso 1: Define tu Presupuesto',
      text: 'Establece un presupuesto realista considerando precio de compra, impuestos, y costes de mantenimiento...',
      image: 'https://example.com/step1.jpg',
    },
    {
      name: 'Paso 2: Elige la Ubicación',
      text: 'Investiga las diferentes zonas de Mallorca: Son Vida para exclusividad, Palma Centro para urbanitas...',
      image: 'https://example.com/step2.jpg',
    },
    {
      name: 'Paso 3: Contacta un Agente',
      text: 'Trabaja con un agente inmobiliario local especializado en propiedades de lujo...',
    },
  ],
});
```

**Rich Result**: Google shows step-by-step accordion

### Review Schema (Testimonials)

```typescript
const schema = generateReviewSchema({
  authorName: 'María García',
  rating: 5,
  reviewText: 'Excelente servicio. El equipo de Anclora nos ayudó a encontrar la villa perfecta en Son Vida. Profesionales y atentos en cada paso del proceso.',
  datePublished: '2025-01-15T00:00:00Z',
});
```

### Event Schema (Open Houses)

```typescript
const schema = generateEventSchema({
  name: 'Casa Abierta - Villa Son Vida',
  description: 'Visita guiada exclusiva a nuestra nueva villa en Son Vida',
  startDate: '2025-02-15T10:00:00+01:00',
  endDate: '2025-02-15T14:00:00+01:00',
  locationName: 'Villa Son Vida Premium',
  address: {
    city: 'Palma de Mallorca',
    region: 'Islas Baleares',
    country: 'ES',
  },
  status: 'EventScheduled',
  attendanceMode: 'OfflineEventAttendanceMode',
});
```

---

## 🧪 Testing & Validation

### Google Tools

**1. Rich Results Test**
```
URL: https://search.google.com/test/rich-results
Test: Individual pages
Result: Shows preview of rich result
```

**2. Schema Markup Validator**
```
URL: https://validator.schema.org/
Test: Paste schema JSON
Result: Validates structure
```

**3. Search Console**
```
Tool: Google Search Console → Enhancements
Monitor: Rich results performance
Track: Impressions, clicks, errors
```

### Command Line Testing

```bash
# Extract schema from page
curl -s https://ancloraprivateestates.com/propiedades/villa-001 | \
  grep -A 100 'application/ld+json' | \
  python -m json.tool

# Validate with online tool
curl -X POST https://validator.schema.org/validate \
  -H "Content-Type: application/json" \
  -d @schema.json
```

### Validation Checklist

**Required Fields**:
- [ ] @context: "https://schema.org"
- [ ] @type: Valid schema type
- [ ] name: Descriptive name
- [ ] description: Clear description

**Real Estate Specific**:
- [ ] address: Complete postal address
- [ ] offers: Price and currency
- [ ] image: High-quality images
- [ ] numberOfBedrooms: Integer
- [ ] floorSize: With proper units

**Best Practices**:
- [ ] No broken URLs
- [ ] Valid date formats (ISO 8601)
- [ ] Proper currency codes (EUR)
- [ ] Realistic prices
- [ ] Accurate location data

---

## 💡 Best Practices

### 1. Schema Selection

**Use Accommodation for**:
- Detailed property pages
- Properties with many amenities
- Vacation rentals
- Properties with ratings

**Use RealEstateListing for**:
- Commercial listings
- Properties for sale
- MLS-style listings
- When year built is important

**Use Product when**:
- Neither Accommodation nor RealEstateListing fits
- Simple property cards
- Need aggregate ratings

### 2. Image Requirements

```typescript
images: [
  'https://example.com/property-1.jpg',  // Required: High-res
  'https://example.com/property-2.jpg',  // Recommended: Multiple angles
  'https://example.com/property-3.jpg',
]
```

**Requirements**:
- Minimum: 1 image
- Recommended: 3-5 images
- Format: JPG or WebP
- Size: Min 1200px width
- Aspect ratio: 16:9 or 4:3

### 3. Price Formatting

```typescript
// ✓ Correct
price: 3500000
priceCurrency: 'EUR'

// ✗ Incorrect
price: '€3,500,000'
price: '3.5M'
```

### 4. Date Formatting

```typescript
// ✓ Correct - ISO 8601
datePosted: '2025-01-15T09:00:00+01:00'
validThrough: '2026-01-15'

// ✗ Incorrect
datePosted: '15/01/2025'
datePosted: 'January 15, 2025'
```

### 5. Location Data

**Always include**:
```typescript
address: {
  '@type': 'PostalAddress',
  addressLocality: 'Palma de Mallorca',  // Required
  addressRegion: 'Islas Baleares',        // Required
  addressCountry: 'ES',                   // Required
  streetAddress: 'Calle Example 123',     // Optional but recommended
  postalCode: '07013',                    // Optional but recommended
}
```

**Geo coordinates** (highly recommended):
```typescript
geo: {
  '@type': 'GeoCoordinates',
  latitude: 39.5696,
  longitude: 2.6502,
}
```

### 6. Multiple Schemas

**Combine schemas for better results**:

```typescript
const schemas = [
  accommodationSchema,      // Main property data
  breadcrumbSchema,         // Navigation
  videoSchema,              // Virtual tour
  organizationSchema,       // Company info
];

return <SchemaRenderer schemas={schemas} />;
```

### 7. Avoid Common Mistakes

**❌ Don't**:
- Use fake reviews or ratings
- Inflate prices
- Use placeholder images
- Duplicate schemas
- Mix schema types incorrectly
- Use outdated schema versions

**✅ Do**:
- Keep data accurate and up-to-date
- Match visible content
- Use proper units (m² not sqft for ES)
- Include all required properties
- Validate before deploying
- Monitor Search Console for errors

### 8. Schema Priority

**Essential** (always include):
1. Organization
2. Property/Accommodation
3. Breadcrumb

**Important** (when applicable):
4. Service
5. Review/Rating
6. Video

**Nice to have**:
7. Event
8. HowTo
9. Person
10. FAQ

---

## 📈 Monitoring & Optimization

### Key Metrics

**Search Console**:
- Rich result impressions
- Click-through rate (CTR)
- Average position
- Schema errors/warnings

**Goals**:
- 80%+ pages with valid schema
- <5% error rate
- CTR improvement: +20% with rich results

### Continuous Improvement

**Monthly Tasks**:
1. Check Search Console for errors
2. Update schemas for new content
3. Add missing schemas
4. Validate with testing tools
5. Monitor rich result performance

**Quarterly Tasks**:
1. Review schema.org updates
2. Analyze competitor schemas
3. A/B test schema variations
4. Update documentation

---

## 🚀 Quick Reference

### Property Page
```typescript
import { getPropertyPageSchemas } from '@/lib/schema-examples';
const schemas = getPropertyPageSchemas(property);
```

### Service Page
```typescript
import { getServicePageSchemas } from '@/lib/schema-examples';
const schemas = getServicePageSchemas('compra');
```

### Blog Post
```typescript
import { getBlogPostSchemas } from '@/lib/schema-examples';
const schemas = getBlogPostSchemas(post);
```

### Listing Page
```typescript
import { getPropertiesListingSchemas } from '@/lib/schema-examples';
const schemas = getPropertiesListingSchemas(properties);
```

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0
