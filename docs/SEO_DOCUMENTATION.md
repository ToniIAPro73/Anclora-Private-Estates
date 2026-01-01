# SEO SYSTEM DOCUMENTATION - ANCLORA PRIVATE ESTATES

Sistema completo de optimización SEO/AEO/GEO implementado en las Fases 5.1-5.2.

---

## ARQUITECTURA DEL SISTEMA

### Estructura de Archivos
```
lib/
  └─ seo.ts                      # Utilidades y generadores SEO
  └─ metadata.ts                 # Sistema de metadata dinámica

components/
  └─ seo/
      └─ SEO.tsx                 # Componente wrapper SEO
      └─ StructuredData.tsx      # JSON-LD schemas

app/
  ├─ layout.tsx                  # Metadata global
  ├─ robots.ts                   # robots.txt dinámico
  ├─ sitemap.ts                  # sitemap.xml dinámico
  └─ [page]/page.tsx            # Metadata por página
```

### Flujo de Datos
```
1. Page Request
2. generateMetadata() → Metadata dinámica
3. SEO Component → Schema JSON-LD
4. robots.ts → Configuración bots
5. sitemap.ts → URLs indexables
```

---

## IMPLEMENTACIÓN BÁSICA

### 1. Página Estándar

```typescript
// app/sobre-nosotros/page.tsx
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Sobre Nosotros - Anclora Private Estates',
  description: 'Agencia inmobiliaria de lujo en Mallorca especializada en propiedades premium.',
  url: '/sobre-nosotros',
});

export default function AboutPage() {
  return <div>Contenido...</div>;
}
```

### 2. Página de Propiedad

```typescript
// app/propiedades/[id]/page.tsx
import { generatePropertyMetadata } from '@/lib/seo';
import { SEO } from '@/components/seo/SEO';

export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);
  
  return generatePropertyMetadata({
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    images: property.images,
  });
}

export default function PropertyPage({ property }) {
  return (
    <>
      <SEO schema={getPropertySchema(property)} />
      {/* Contenido de la propiedad */}
    </>
  );
}
```

---

## SISTEMA DE METADATA

### Función generateMetadata()

**Archivo:** `lib/seo.ts`

**Parámetros:**
- `title`: string - Título de la página
- `description`: string - Descripción meta
- `url`: string - URL relativa
- `image?`: string - Imagen OG opcional
- `type?`: 'website' | 'article' - Tipo OG
- `noindex?`: boolean - Bloquear indexación

**Retorna:**
```typescript
{
  title: string,
  description: string,
  keywords?: string[],
  openGraph: {
    title: string,
    description: string,
    url: string,
    siteName: string,
    images: Array,
    locale: string,
    type: string,
  },
  twitter: {
    card: string,
    title: string,
    description: string,
    images: Array,
  },
  alternates: {
    canonical: string,
    languages: Object,
  },
  robots?: {
    index: boolean,
    follow: boolean,
  }
}
```

### Configuración Base

```typescript
// lib/seo.ts
export const SEO_CONFIG = {
  siteName: 'Anclora Private Estates',
  siteUrl: 'https://anclora.es',
  defaultLocale: 'es-ES',
  locales: ['es-ES', 'en-US'],
  defaultImage: '/og-default.jpg',
  twitterHandle: '@ancloraestates',
};
```

---

## STRUCTURED DATA (JSON-LD)

### Schema RealEstateAgent

```typescript
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Anclora Private Estates",
  "image": "https://anclora.es/logo.png",
  "url": "https://anclora.es",
  "telephone": "+34-971-123-456",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Example 123",
    "addressLocality": "Palma",
    "addressRegion": "Mallorca",
    "postalCode": "07001",
    "addressCountry": "ES"
  },
  "priceRange": "€€€€",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "19:00"
    }
  ]
}
```

### Schema Product (Propiedad)

```typescript
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Villa de Lujo en Son Vida",
  "image": ["url1.jpg", "url2.jpg"],
  "description": "Espectacular villa...",
  "offers": {
    "@type": "Offer",
    "price": "2500000",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://anclora.es/propiedades/villa-son-vida"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "bedrooms",
      "value": "5"
    },
    {
      "@type": "PropertyValue",
      "name": "bathrooms",
      "value": "4"
    }
  ]
}
```

### Schema Breadcrumb

```typescript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://anclora.es"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Propiedades",
      "item": "https://anclora.es/propiedades"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Villa Son Vida"
    }
  ]
}
```

---

## ROBOTS.TXT

**Archivo:** `app/robots.ts`

```typescript
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: 'https://anclora.es/sitemap.xml',
  };
}
```

**Output generado:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://anclora.es/sitemap.xml
```

---

## SITEMAP.XML

**Archivo:** `app/sitemap.ts`

```typescript
export default async function sitemap() {
  const baseUrl = 'https://anclora.es';
  
  // Páginas estáticas
  const routes = ['', '/sobre-nosotros', '/contacto'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));
  
  // Propiedades dinámicas
  const properties = await getProperties();
  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/propiedades/${property.id}`,
    lastModified: new Date(property.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  return [...routes, ...propertyRoutes];
}
```

---

## CANONICAL URLS

### Implementación Automática

```typescript
// lib/seo.ts
export function generateMetadata(params) {
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${params.url}`;
  
  return {
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es-ES': `${canonicalUrl}`,
        'en-US': `${canonicalUrl}/en`,
      },
    },
  };
}
```

### HTML Generado

```html
<link rel="canonical" href="https://anclora.es/propiedades/villa-son-vida" />
<link rel="alternate" hreflang="es-ES" href="https://anclora.es/propiedades/villa-son-vida" />
<link rel="alternate" hreflang="en-US" href="https://anclora.es/propiedades/villa-son-vida/en" />
```

---

## OPEN GRAPH TAGS

### Configuración Completa

```typescript
openGraph: {
  title: 'Villa de Lujo en Son Vida - Anclora',
  description: 'Espectacular villa de 500m² con 5 dormitorios...',
  url: 'https://anclora.es/propiedades/villa-son-vida',
  siteName: 'Anclora Private Estates',
  images: [
    {
      url: 'https://anclora.es/images/properties/villa-1.jpg',
      width: 1200,
      height: 630,
      alt: 'Villa de Lujo en Son Vida',
    },
  ],
  locale: 'es_ES',
  type: 'website',
}
```

### HTML Generado

```html
<meta property="og:title" content="Villa de Lujo en Son Vida - Anclora" />
<meta property="og:description" content="Espectacular villa de 500m²..." />
<meta property="og:url" content="https://anclora.es/propiedades/villa-son-vida" />
<meta property="og:site_name" content="Anclora Private Estates" />
<meta property="og:image" content="https://anclora.es/images/properties/villa-1.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="es_ES" />
<meta property="og:type" content="website" />
```

---

## TWITTER CARDS

### Configuración

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'Villa de Lujo en Son Vida',
  description: 'Espectacular villa de 500m²...',
  images: ['https://anclora.es/images/properties/villa-1.jpg'],
  creator: '@ancloraestates',
}
```

### HTML Generado

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Villa de Lujo en Son Vida" />
<meta name="twitter:description" content="Espectacular villa de 500m²..." />
<meta name="twitter:image" content="https://anclora.es/images/properties/villa-1.jpg" />
<meta name="twitter:creator" content="@ancloraestates" />
```

---

## TESTING Y VALIDACIÓN

### Herramientas Recomendadas

1. **Google Search Console**
   - URL: https://search.google.com/search-console
   - Verificar indexación
   - Inspeccionar URLs
   - Ver errores

2. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Validar schemas JSON-LD
   - Ver preview de resultados

3. **Schema.org Validator**
   - URL: https://validator.schema.org
   - Validar sintaxis JSON-LD

4. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug
   - Validar Open Graph tags
   - Limpiar caché

5. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Validar Twitter Cards

### Comandos de Testing

```bash
# Verificar robots.txt
curl https://anclora.es/robots.txt

# Verificar sitemap.xml
curl https://anclora.es/sitemap.xml

# Verificar metadata de página
curl -I https://anclora.es/propiedades/villa-son-vida
```

---

## BEST PRACTICES

### Meta Tags

1. **Title Tag**
   - Longitud: 50-60 caracteres
   - Include keyword principal
   - Include brand name
   - Formato: "Keyword | Brand"

2. **Meta Description**
   - Longitud: 150-160 caracteres
   - Include CTA
   - Include keyword secundario
   - Convincente y descriptivo

3. **Keywords**
   - Máximo 10 keywords
   - Relevantes al contenido
   - Mix de head y long-tail

### Structured Data

1. **JSON-LD sobre Microdata**
   - Más fácil de mantener
   - Mejor para debugging
   - Recomendado por Google

2. **Validar siempre**
   - Usar Rich Results Test
   - Verificar errores
   - Actualizar según cambios Google

3. **Schemas relevantes**
   - RealEstateAgent (organización)
   - Product (propiedades)
   - BreadcrumbList (navegación)
   - FAQPage (preguntas frecuentes)

### Performance

1. **Lazy Loading**
   - Images below fold
   - Defer non-critical JS
   - Async loading schemas

2. **Caching**
   - Metadata estática en build
   - Cache-Control headers
   - CDN para assets

3. **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

---

## CHECKLIST DE IMPLEMENTACIÓN

### Por Página

- [ ] Title tag optimizado (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] Canonical URL configurada
- [ ] Open Graph tags completos
- [ ] Twitter Cards configurados
- [ ] Schema JSON-LD implementado
- [ ] Breadcrumbs si aplica
- [ ] Images con alt text
- [ ] Internal linking
- [ ] Mobile responsive

### Global

- [ ] robots.txt configurado
- [ ] sitemap.xml generado
- [ ] Google Search Console verificado
- [ ] Google Analytics instalado
- [ ] 404 page customizada
- [ ] SSL certificado activo
- [ ] Performance >90 Lighthouse
- [ ] Schema Organization
- [ ] Favicon completo
- [ ] Multiidioma si aplica

---

## ARCHIVOS DE REFERENCIA

### Ubicaciones

```
/lib/seo.ts                          # Utilidades SEO
/lib/metadata.ts                     # Sistema metadata
/components/seo/SEO.tsx              # Componente wrapper
/components/seo/StructuredData.tsx   # JSON-LD schemas
/app/robots.ts                       # robots.txt
/app/sitemap.ts                      # sitemap.xml
/app/layout.tsx                      # Metadata global
```

### Importaciones Típicas

```typescript
import { generateMetadata } from '@/lib/seo';
import { SEO } from '@/components/seo/SEO';
import { getPropertySchema, getBreadcrumbSchema } from '@/lib/metadata';
```

---

## SOPORTE Y RECURSOS

### Documentación Oficial

- **Next.js Metadata**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Schema.org**: https://schema.org
- **Google Search Central**: https://developers.google.com/search
- **Open Graph Protocol**: https://ogp.me

### Herramientas

- Google Search Console
- Google Rich Results Test
- Schema Markup Validator
- Screaming Frog SEO Spider
- Ahrefs / SEMrush

---

**Última actualización:** 2026-01-01  
**Versión:** 1.0  
**Fases:** 5.1 - 5.2 Completadas
