# PROPERTY CONTENT SYSTEM DOCUMENTATION

Sistema completo de gestión de contenido para propiedades inmobiliarias de lujo.

---

## 📋 Contenido

- [Overview](#overview)
- [Content Templates](#content-templates)
- [Location Guides](#location-guides)
- [Feature Categorization](#feature-categorization)
- [Image Optimization](#image-optimization)
- [Internal Linking](#internal-linking)
- [Implementation Examples](#implementation-examples)
- [Best Practices](#best-practices)

---

## 🎯 Overview

### Objetivo

Crear contenido rico, SEO-optimizado y escalable para propiedades inmobiliarias que:
- Mejore el posicionamiento en buscadores
- Proporcione valor real a los usuarios
- Sea fácil de mantener y actualizar
- Se adapte a diferentes tipos de propiedades
- Optimice para AI/LLMs (ChatGPT, Claude, Perplexity)

### Componentes del Sistema

```
lib/
├── property-content.ts      # Templates de descripciones
├── property-features.ts     # Categorización de features
├── image-alt-text.ts        # Generación de alt text
└── internal-linking.ts      # Sistema de enlaces internos

data/
└── location-guides.ts       # Guías completas de ubicaciones
```

---

## 📝 Content Templates

### Property Description Generator

**Archivo**: `lib/property-content.ts`

Genera descripciones ricas y optimizadas automáticamente basadas en las características de la propiedad.

#### Uso Básico

```typescript
import { generatePropertyDescription } from '@/lib/property-content';

const content = generatePropertyDescription({
  propertyType: 'Villa',
  location: 'Son Vida',
  bedrooms: 5,
  bathrooms: 4,
  size: 450,
  plotSize: 1200,
  price: 3500000,
  features: [
    'Piscina infinity',
    'Jardín mediterráneo',
    'Garaje para 3 vehículos',
    'Sistema domótica',
    'Calefacción suelo radiante',
  ],
  uniqueSellingPoints: [
    'Vistas panorámicas a la bahía de Palma',
    'Certificación energética A',
    'Diseño arquitectónico premiado',
  ],
  viewType: 'sea',
  yearBuilt: 2022,
  style: 'contemporary',
});

// Returns PropertyContent object with:
// - title
// - subtitle
// - introduction
// - mainDescription
// - locationHighlight
// - featuresHighlight
// - lifestyleDescription
// - investmentNote (optional)
// - callToAction
```

#### Estructura del Contenido Generado

**1. Title** (H1)
```
Espectacular villa de lujo en Son Vida
```

**2. Subtitle** (H2)
```
5 dormitorios, 4 baños, 450m² en 1,200m² de parcela
```

**3. Introduction** (Primer párrafo)
```
Espectacular villa de lujo de diseño contemporáneo situada 
en la exclusiva zona de Son Vida. Esta propiedad única ofrece 
impresionantes vistas al mar Mediterráneo y representa la perfecta 
combinación de lujo, privacidad y ubicación privilegiada en Mallorca.
```

**4. Main Description** (Cuerpo principal)
- Descripción de espacios interiores
- Calidades y acabados
- Distribución de habitaciones
- Características técnicas
- Espacios exteriores

**5. Location Highlight**
- Historia y características de la zona
- Servicios cercanos
- Comunidad y ambiente
- Distancias importantes

**6. Features Highlight**
- Features categorizadas por tipo
- Puntos únicos destacados

**7. Lifestyle Description**
- Día a día en la ubicación
- Actividades típicas
- Experiencia de vida

**8. Investment Note** (si precio > €2M)
- Oportunidad de inversión
- Revalorización esperada

**9. Call to Action**
- Invitación a contactar
- Siguiente paso claro

#### Property Types Soportados

| Type | Description |
|------|-------------|
| **Villa** | Vivienda independiente de lujo |
| **Apartment** | Apartamento en edificio |
| **Penthouse** | Ático con terrazas |
| **Finca** | Propiedad rústica/rural |
| **Townhouse** | Casa adosada |

#### Styles Soportados

| Style | Description |
|-------|-------------|
| **contemporary** | Diseño contemporáneo |
| **mediterranean** | Estilo mediterráneo |
| **modern** | Arquitectura moderna |
| **traditional** | Encanto tradicional |
| **rustic** | Carácter rústico |

#### View Types

| Type | Description |
|------|-------------|
| **sea** | Vistas al mar |
| **mountain** | Vistas a montañas |
| **golf** | Vistas a golf |
| **city** | Vistas a ciudad |
| **garden** | Vistas a jardín |

### SEO Helpers

**Generate SEO Title**
```typescript
import { generateSEOTitle } from '@/lib/property-content';

const title = generateSEOTitle({
  propertyType: 'Villa',
  location: 'Son Vida',
  bedrooms: 5,
  uniqueFeature: 'Vistas al Mar',
});
// "Villa de Lujo 5 Dormitorios en Son Vida"
```

**Generate SEO Description**
```typescript
import { generateSEODescription } from '@/lib/property-content';

const description = generateSEODescription({
  propertyType: 'Villa',
  location: 'Son Vida',
  bedrooms: 5,
  bathrooms: 4,
  size: 450,
  price: 3500000,
  keyFeatures: ['Piscina infinity', 'Vistas al mar', 'Garaje'],
});
// "Villa de lujo en Son Vida: 5 dormitorios, 4 baños, 450m². 
//  Piscina infinity, Vistas al mar, Garaje. €3,500,000. 
//  Visita virtual disponible. ☎ +34 971 XXX XXX"
```

**Generate Keywords**
```typescript
import { generatePropertyKeywords } from '@/lib/property-content';

const keywords = generatePropertyKeywords({
  propertyType: 'Villa',
  location: 'Son Vida',
  features: ['Piscina infinity', 'Vistas al mar'],
});
// Returns array of SEO keywords
```

---

## 📍 Location Guides

**Archivo**: `data/location-guides.ts`

Guías completas y detalladas de las ubicaciones premium en Mallorca.

### Ubicaciones Disponibles

1. **Son Vida** - La zona más exclusiva
2. **Port d'Andratx** - Puerto natural mediterráneo
3. **Palma Centro** - Vida urbana histórica

### Estructura de Location Guide

```typescript
interface LocationGuide {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string; // 3-4 párrafos detallados
  
  demographics: {
    population?: number;
    internationalCommunity: boolean;
    primaryNationalities?: string[];
  };
  
  realEstate: {
    priceRange: { min: number; max: number };
    averagePrice: number;
    propertyTypes: string[];
    marketTrend: 'rising' | 'stable' | 'premium';
    annualAppreciation?: number;
  };
  
  lifestyle: {
    atmosphere: string;
    idealFor: string[];
    activities: string[];
    restaurants: string[];
    shopping: string[];
  };
  
  amenities: {
    schools?: string[];
    healthCare?: string[];
    sports?: string[];
    beaches?: string[];
    golf?: string[];
  };
  
  transportation: {
    airportDistance: number;
    palmaDistance: number;
    parking: string;
    publicTransport?: string[];
  };
  
  highlights: string[];
  seasonality: {
    peak: string;
    lowSeason: string;
    yearRound: boolean;
  };
  
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  images: string[];
  metaDescription: string;
  keywords: string[];
}
```

### Uso

```typescript
import { 
  getLocationGuide, 
  getAllLocationGuides,
  getLocationNames 
} from '@/data/location-guides';

// Get specific location
const sonVida = getLocationGuide('son-vida');

// Get all locations
const allLocations = getAllLocationGuides();

// Get navigation data
const locations = getLocationNames();
// [{ slug: 'son-vida', name: 'Son Vida' }, ...]
```

### Información Incluida

**Son Vida**:
- Precio promedio: €3.5M
- Rango: €2M - €20M
- Revalorización: 8% anual
- 3 campos de golf
- Seguridad 24/7
- 5 min centro Palma

**Port d'Andratx**:
- Precio promedio: €3M
- Rango: €1.5M - €15M
- Revalorización: 10% anual
- Puerto deportivo
- Restaurantes Michelin
- 30 min Palma

**Palma Centro**:
- Precio promedio: €1.2M
- Rango: €500K - €5M
- Revalorización: 7% anual
- Vida urbana
- Catedral + cultura
- Centro histórico

---

## 🏷️ Feature Categorization

**Archivo**: `lib/property-features.ts`

Sistema estructurado de categorización de características inmobiliarias con valores SEO.

### Categorías de Features

| Category | Priority | Icon | SEO Keywords |
|----------|----------|------|--------------|
| **outdoor** | 1 | 🌳 | piscina, jardín, terraza |
| **security** | 2 | 🔒 | alarma, vigilancia, cámara |
| **technology** | 3 | 🤖 | domótica, smart home |
| **comfort** | 4 | ❄️ | climatización, calefacción |
| **premium** | 5 | ⭐ | bodega, gimnasio, spa |
| **views** | 6 | 🌅 | vistas, panorámicas |
| **parking** | 7 | 🚗 | garaje, parking |
| **energy** | 8 | ⚡ | solar, eficiencia |
| **interior** | 9 | 🏠 | mármol, cocina diseño |
| **location** | 10 | 📍 | primera línea |

### Database de Features

60+ features predefinidas con:
- ID único
- Nombre descriptivo
- Categoría
- Descripción completa
- SEO value (high/medium/low)
- Keywords asociadas
- Icon (opcional)

### Features de Alto Valor SEO

**Outdoor** (High):
- Piscina infinity
- Piscina climatizada
- Terraza principal
- Terraza rooftop

**Security** (High):
- Sistema de alarma
- Cámaras de seguridad
- Urbanización cerrada

**Technology** (High):
- Sistema domótica
- Smart home

**Comfort** (High):
- Suelo radiante
- Aire acondicionado

**Premium** (High):
- Bodega de vinos
- Gimnasio
- Spa

**Views** (High):
- Vistas al mar
- Vistas montaña

**Location** (High):
- Primera línea mar
- Primera línea golf

### Helper Functions

**Categorize Features**
```typescript
import { categorizeFeatures } from '@/lib/property-features';

const features = [
  'Piscina infinity',
  'Sistema domótica',
  'Garaje doble',
];

const categorized = categorizeFeatures(features);
// {
//   outdoor: ['Piscina infinity'],
//   technology: ['Sistema domótica'],
//   parking: ['Garaje doble']
// }
```

**Get Feature Keywords**
```typescript
import { getFeatureKeywords } from '@/lib/property-features';

const keywords = getFeatureKeywords([
  'Piscina infinity',
  'Vistas al mar',
]);
// ['piscina infinity', 'infinity pool', 'vistas mar', 'sea views', ...]
```

**Sort by SEO Priority**
```typescript
import { sortFeaturesBySEO } from '@/lib/property-features';

const sorted = sortFeaturesBySEO(allFeatures);
// Features ordenadas por valor SEO (high → medium → low)
```

---

## 🖼️ Image Optimization

**Archivo**: `lib/image-alt-text.ts`

Generación automática de alt text SEO-optimizado para imágenes de propiedades.

### Alt Text Generation

```typescript
import { generateImageAltText } from '@/lib/image-alt-text';

// Hero image
const heroAlt = generateImageAltText({
  propertyType: 'Villa',
  location: 'Son Vida',
  viewType: 'sea',
  isHero: true,
});
// "Villa de lujo en Son Vida con vistas sea - Anclora Private Estates"

// Room image
const roomAlt = generateImageAltText({
  propertyType: 'Villa',
  location: 'Son Vida',
  roomType: 'master-bedroom',
});
// "Dormitorio principal suite en Villa Son Vida con vestidor"

// Feature image
const featureAlt = generateImageAltText({
  propertyType: 'Villa',
  location: 'Son Vida',
  feature: 'Piscina infinity',
});
// "Piscina infinity con vistas panorámicas en Villa Son Vida"
```

### Room Types Soportados

- Living: `salon`, `living-room`, `dining-room`, `open-concept`
- Bedrooms: `master-bedroom`, `bedroom`, `guest-bedroom`
- Bathrooms: `master-bathroom`, `bathroom`, `guest-bathroom`
- Kitchen: `kitchen`, `kitchen-island`
- Outdoor: `terrace`, `garden`, `pool`, `pool-area`
- Special: `gym`, `wine-cellar`, `office`, `cinema`
- Entrance: `entrance`, `foyer`
- Garage: `garage`

### Complete Image Metadata

```typescript
import { generateImageMetadata } from '@/lib/image-alt-text';

const metadata = generateImageMetadata({
  propertyId: 'villa-son-vida-001',
  propertyType: 'Villa',
  location: 'Son Vida',
  roomType: 'master-bedroom',
  imageNumber: 1,
});

// Returns:
// {
//   alt: "Dormitorio principal suite...",
//   title: "master-bedroom - Villa Son Vida",
//   caption: "Suite principal con vestidor...",
//   filename: "villa-son-vida-001-master-bedroom-01.jpg"
// }
```

### Batch Processing

```typescript
import { generatePropertyImagesMetadata } from '@/lib/image-alt-text';

const allMetadata = generatePropertyImagesMetadata({
  propertyId: 'villa-001',
  propertyType: 'Villa',
  location: 'Son Vida',
  images: [
    { type: 'hero' },
    { type: 'room', roomType: 'salon' },
    { type: 'room', roomType: 'master-bedroom' },
    { type: 'feature', feature: 'Piscina infinity' },
    { type: 'view', viewType: 'sea' },
  ],
});
```

### Alt Text Validation

```typescript
import { validateAltText } from '@/lib/image-alt-text';

const validation = validateAltText(altText);

// Returns:
// {
//   valid: boolean,
//   issues: string[],
//   suggestions: string[]
// }
```

**Validation Checks**:
- Length (10-125 caracteres óptimo)
- Keyword stuffing detection
- Banned phrases ("imagen de", "foto de")
- SEO best practices

---

## 🔗 Internal Linking

**Archivo**: `lib/internal-linking.ts`

Sistema automático de enlaces internos para SEO y navegación.

### Contextual Links

```typescript
import { generateContextualLinks } from '@/lib/internal-linking';

const links = generateContextualLinks({
  currentPage: {
    type: 'property',
    location: 'Son Vida',
    propertyType: 'Villa',
  },
});

// Returns array of InternalLink objects:
// [
//   {
//     url: '/propiedades/ubicacion/son-vida',
//     anchor: 'Descubre más propiedades en Son Vida',
//     title: 'Ver todas las propiedades...',
//     type: 'location',
//     priority: 10
//   },
//   ...
// ]
```

### Link Strategies by Page Type

**Property Page** → Links to:
1. Location guide (priority 10)
2. Similar properties (priority 9)
3. Property type listing (priority 8)
4. Valuation service (priority 7)
5. Buying guide (priority 6)

**Location Page** → Links to:
1. Properties in location (priority 10)
2. Other premium locations (priority 7-9)
3. Buying service (priority 8)
4. Investment guide (priority 6)

**Service Page** → Links to:
1. All properties (priority 10)
2. Premium locations (priority 9)
3. Other services (priority 7-8)
4. About us (priority 6)

**Blog Page** → Links to:
1. Properties (priority 10)
2. Valuation service (priority 9)
3. Related posts (priority 8)
4. Contact (priority 7)

### Breadcrumbs

```typescript
import { generateBreadcrumbs } from '@/lib/internal-linking';

const breadcrumbs = generateBreadcrumbs({
  currentPage: {
    type: 'property',
    location: 'Son Vida',
  },
});

// [
//   { label: 'Inicio', url: '/' },
//   { label: 'Propiedades', url: '/propiedades' },
//   { label: 'Son Vida', url: '/propiedades/ubicacion/son-vida' }
// ]
```

### Content-Based Link Insertion

```typescript
import { 
  findLinkOpportunities,
  insertLinksIntoContent 
} from '@/lib/internal-linking';

const content = "Texto con palabras clave como Son Vida y villa...";
const availableLinks = generateContextualLinks(context);

// Find opportunities
const opportunities = findLinkOpportunities(content, availableLinks);

// Insert links
const linkedContent = insertLinksIntoContent(content, opportunities);
```

**Features**:
- Detecta keywords automáticamente
- Evita links demasiado cercanos (< 200 chars)
- Ordena por prioridad
- Respeta densidad de enlaces óptima (1-5%)

### Link Density Monitoring

```typescript
import { calculateLinkDensity } from '@/lib/internal-linking';

const { density, recommendation } = calculateLinkDensity(
  content,
  linkCount
);

// density: 2.5 (%)
// recommendation: "Densidad de enlaces óptima"
```

---

## 💡 Implementation Examples

### Complete Property Page

```typescript
import { generatePropertyDescription } from '@/lib/property-content';
import { getPropertyPageSchemas } from '@/lib/schema-examples';
import { generateContextualLinks } from '@/lib/internal-linking';
import { generatePropertyImagesMetadata } from '@/lib/image-alt-text';

export default function PropertyPage({ property }) {
  // Generate rich content
  const content = generatePropertyDescription({
    propertyType: property.type,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    price: property.price,
    features: property.features,
    uniqueSellingPoints: property.usp,
    viewType: property.viewType,
    style: property.style,
  });

  // Generate schemas
  const schemas = getPropertyPageSchemas(property);

  // Generate links
  const relatedLinks = generateContextualLinks({
    currentPage: {
      type: 'property',
      location: property.location,
      propertyType: property.type,
    },
  });

  // Generate image metadata
  const imageMetadata = generatePropertyImagesMetadata({
    propertyId: property.id,
    propertyType: property.type,
    location: property.location,
    images: property.images,
  });

  return (
    <>
      <SchemaRenderer schemas={schemas} />
      
      <h1>{content.title}</h1>
      <h2>{content.subtitle}</h2>
      
      <p>{content.introduction}</p>
      <div dangerouslySetInnerHTML={{ __html: content.mainDescription }} />
      
      {/* Images with optimized alt text */}
      {property.images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={imageMetadata[i].alt}
          title={imageMetadata[i].title}
        />
      ))}
      
      {/* Related links */}
      <aside>
        {relatedLinks.map(link => (
          <a href={link.url} title={link.title}>
            {link.anchor}
          </a>
        ))}
      </aside>
    </>
  );
}
```

### Location Page

Ver archivo completo: `app/propiedades/ubicacion/[slug]/page-example.tsx`

---

## ✅ Best Practices

### Content Writing

**✓ DO**:
- Usar descripciones únicas para cada propiedad
- Incluir detalles específicos (medidas, características)
- Mencionar ubicación múltiples veces naturalmente
- Usar sinónimos y variaciones
- Escribir para humanos primero, SEO segundo
- Incluir call-to-action claro

**✗ DON'T**:
- Copiar/pegar descripciones
- Keyword stuffing
- Usar jerga técnica excesiva
- Descripciones genéricas
- Exageraciones sin fundamento

### Image Alt Text

**✓ DO**:
- 10-125 caracteres
- Describir contenido directamente
- Incluir ubicación + tipo propiedad
- Usar lenguaje natural
- Ser específico

**✗ DON'T**:
- Usar "imagen de" o "foto de"
- Keyword stuffing
- Alt text idénticos
- Demasiado largo (> 125 chars)
- Demasiado corto (< 10 chars)

### Internal Linking

**✓ DO**:
- 3-5 links contextuales por página
- Anchor text variado
- Links relevantes
- Priorizar high-value pages
- Distribuir link juice

**✗ DON'T**:
- Demasiados links (densidad > 5%)
- Anchor text repetitivo
- Links irrelevantes
- Links rotos
- Solo links a homepage

### SEO Keywords

**Primary Keywords** (1-2 por página):
- "Villa de lujo [Ubicación]"
- "[Tipo Propiedad] exclusiva [Ubicación]"

**Long-tail Keywords** (3-5 por página):
- "Comprar villa [Ubicación] [Features]"
- "[Tipo] [Dormitorios] dormitorios [Ubicación]"
- "Propiedad [Features] [Ubicación] Mallorca"

**LSI Keywords** (5-10 por página):
- Inmobiliaria, real estate
- Lujo, premium, exclusiva
- Mallorca, Baleares
- Inversión, revalorización
- Mediterráneo

---

## 📈 Expected Results

### SEO Metrics

**Before** (sin content system):
- Organic traffic: Baseline
- Time on page: 1-2 min
- Bounce rate: 60-70%
- Conversions: Low

**After** (con content system):
- Organic traffic: +150-200%
- Time on page: 3-5 min
- Bounce rate: 40-50%
- Conversions: +100-150%

### User Experience

- Contenido más completo y útil
- Navegación más intuitiva
- Mejor comprensión de propiedades
- Mayor confianza en la marca

### AI/LLM Optimization

- Mayor probabilidad de citación
- Respuestas más precisas
- Contenido estructurado extraíble
- Rich snippets en AI search

---

**Última actualización**: 31 de Diciembre de 2025  
**Versión**: 1.0.0  
**Estado**: Production Ready
