# Blog System Architecture - Documentación Completa
## Anclora Private Estates

---

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura de Datos](#estructura-de-datos)
3. [Sistema de Categorías](#sistema-de-categorías)
4. [Sistema de Autores](#sistema-de-autores)
5. [Algoritmo de Posts Relacionados](#algoritmo-de-posts-relacionados)
6. [RSS & Feeds](#rss--feeds)
7. [Templates de Contenido](#templates-de-contenido)
8. [Implementación de Páginas](#implementación-de-páginas)
9. [SEO y Schema Markup](#seo-y-schema-markup)
10. [Guía de Implementación](#guía-de-implementación)
11. [Best Practices](#best-practices)

---

## Arquitectura del Sistema

### Overview

El sistema de blog de Anclora está diseñado como una arquitectura modular y escalable que soporta:

- ✅ 8 categorías de contenido especializadas
- ✅ Sistema de autores con perfiles completos
- ✅ Algoritmo inteligente de posts relacionados
- ✅ RSS/Atom/JSON feeds
- ✅ Templates pre-diseñados para diferentes tipos de contenido
- ✅ SEO avanzado con Schema.org
- ✅ Sistema de tags y búsqueda

### Componentes Principales

```
blog-system/
├── lib/
│   ├── blog-system.ts          # Sistema base, tipos, helpers
│   ├── related-posts.ts        # Algoritmo de recomendaciones
│   ├── rss-feed.ts             # Generación de feeds
│   ├── author-system.ts        # Gestión de autores
│   ├── blog-templates.ts       # Templates de contenido
│   └── (integra con seo.ts, schema.ts, internal-linking.ts)
├── app/
│   └── blog/
│       ├── page.tsx                    # Listado principal
│       ├── [slug]/page.tsx             # Post individual
│       ├── categoria/[slug]/page.tsx   # Página de categoría
│       └── autor/[slug]/page.tsx       # Página de autor
└── data/
    └── posts.json / database           # Almacenamiento de posts
```

---

## Estructura de Datos

### BlogPost Interface

```typescript
interface BlogPost {
  id: string;                    // Único identificador
  slug: string;                  // URL-friendly slug
  title: string;                 // Título del post
  excerpt: string;               // Resumen (160 chars max)
  content: string;               // Contenido HTML/Markdown
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  author: Author;                // Objeto autor completo
  categories: Category[];        // Array de categorías
  tags: Tag[];                   // Array de tags
  publishedAt: Date;             // Fecha publicación
  updatedAt: Date;               // Última actualización
  readingTime: number;           // Minutos de lectura
  seo: {
    title: string;               // SEO title (60 chars)
    description: string;         // Meta description (160 chars)
    keywords: string[];          // Keywords SEO
    canonicalUrl?: string;
  };
  relatedPosts?: string[];       // IDs de posts relacionados
  status: 'draft' | 'published' | 'archived';
  views?: number;                // Contador de vistas
  featured?: boolean;            // Post destacado
}
```

### Author Interface

```typescript
interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;                   // Biografía corta
  avatar: string;                // URL imagen perfil
  role: string;                  // Cargo
  email?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface AuthorProfile extends Author {
  totalPosts: number;
  totalViews: number;
  expertise: string[];           // Áreas de especialidad
  languages: string[];           // Idiomas
  joinedDate: Date;
  featuredIn?: string[];         // Medios donde aparece
  achievements?: string[];       // Logros
  education?: string[];          // Formación académica
  certifications?: string[];     // Certificaciones
}
```

### Category Interface

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;                 // Emoji o icono
  color?: string;                // Color hex (#C5A059)
  seoTitle?: string;
  seoDescription?: string;
  postCount?: number;
}
```

---

## Sistema de Categorías

### 8 Categorías Especializadas

#### 1. Guías de Compra (`guias-compra`)
- **Descripción**: Guías completas para comprar propiedad en Mallorca
- **Color**: #C5A059 (Gold)
- **Icon**: 📖
- **Tipos de posts**: Guides, HowTo, Checklists
- **Ejemplos**: "Guía Completa para Comprar en Mallorca", "Checklist del Comprador"

#### 2. Mercado Inmobiliario (`mercado-inmobiliario`)
- **Descripción**: Análisis del mercado inmobiliario de lujo
- **Color**: #1F2937 (Gray)
- **Icon**: 📊
- **Tipos de posts**: Market Analysis, News
- **Ejemplos**: "Análisis Q4 2024", "Tendencias del Mercado"

#### 3. Ubicaciones (`ubicaciones`)
- **Descripción**: Guías detalladas de las mejores zonas
- **Color**: #059669 (Green)
- **Icon**: 📍
- **Tipos de posts**: Location Guides
- **Ejemplos**: "Vivir en Son Vida", "Port d'Andratx: Guía Completa"

#### 4. Inversión Inmobiliaria (`inversion`)
- **Descripción**: Estrategias y consejos de inversión
- **Color**: #DC2626 (Red)
- **Icon**: 💰
- **Tipos de posts**: Guides, Case Studies
- **Ejemplos**: "ROI en Mallorca", "Estrategias de Inversión"

#### 5. Estilo de Vida (`estilo-vida`)
- **Descripción**: Vida en Mallorca: cultura, gastronomía, actividades
- **Color**: #2563EB (Blue)
- **Icon**: 🌴
- **Tipos de posts**: Location Guides, Interviews
- **Ejemplos**: "Mejores Restaurantes", "Actividades de Ocio"

#### 6. Legal y Fiscal (`legal-fiscal`)
- **Descripción**: Aspectos legales y fiscales
- **Color**: #7C3AED (Purple)
- **Icon**: ⚖️
- **Tipos de posts**: Guides, HowTo
- **Ejemplos**: "Impuestos al Comprar", "Golden Visa"

#### 7. Reformas y Diseño (`reformas-diseno`)
- **Descripción**: Inspiración y consejos para reformas
- **Color**: #EA580C (Orange)
- **Icon**: 🏗️
- **Tipos de posts**: Guides, Interviews
- **Ejemplos**: "Tendencias en Diseño", "Reforma de Lujo"

#### 8. Sostenibilidad (`sostenibilidad`)
- **Descripción**: Construcción sostenible y eficiencia energética
- **Color**: #10B981 (Emerald)
- **Icon**: 🌱
- **Tipos de posts**: Guides, Case Studies
- **Ejemplos**: "Certificación LEED", "Energía Solar"

### Uso de Categorías

```typescript
import { blogCategories, getCategoryBySlug } from '@/lib/blog-system';

// Obtener todas las categorías
const allCategories = blogCategories;

// Obtener categoría específica
const inversionCategory = getCategoryBySlug('inversion');

// Filtrar posts por categoría
const categoryPosts = posts.filter(post =>
  post.categories.some(cat => cat.slug === 'inversion')
);
```

---

## Sistema de Autores

### Autores de Anclora

El sistema incluye 3 autores pre-definidos:

#### 1. Toni IA - CEO & Founder
- **Expertise**: Mercado Inmobiliario, IA, Marketing Digital
- **Idiomas**: Español, Catalán, Inglés
- **Certificaciones**: CLHMS, API

#### 2. María García - Asesora Senior de Inversiones
- **Expertise**: Inversión, Fiscalidad Internacional, Golden Visa
- **Idiomas**: Español, Inglés, Alemán
- **Certificaciones**: CFP, API

#### 3. Juan Martínez - Arquitecto & Consultor
- **Expertise**: Arquitectura de Lujo, Diseño, Construcción Sostenible
- **Idiomas**: Español, Catalán, Inglés, Italiano
- **Certificaciones**: Arquitecto Colegiado, LEED AP, Passivhaus

### Funciones de Autor

```typescript
// Obtener autor por slug
const author = getAuthorBySlug('toni-ia');

// Calcular estadísticas
const stats = calculateAuthorStats(author, allPosts);
// Returns: { totalPosts, totalViews, avgViewsPerPost, mostPopularPost, recentPosts, categoriesWritten }

// Posts del autor
const authorPosts = getAuthorRecentPosts(author, allPosts, 10);
const popularPosts = getAuthorMostReadPosts(author, allPosts, 5);

// Agrupar por categoría
const grouped = groupAuthorPostsByCategory(authorPosts);

// SEO para página de autor
const seo = generateAuthorSEO(author, stats);
const schema = generateAuthorPersonSchema(author, stats, 'https://anclora.com');
```

---

## Algoritmo de Posts Relacionados

### Cómo Funciona

El sistema usa un **algoritmo de scoring ponderado** con 4 factores:

1. **Similitud de Categorías (40%)**: Posts en las mismas categorías
2. **Similitud de Tags (30%)**: Tags compartidos
3. **Recencia (20%)**: Posts más recientes tienen mayor score
4. **Popularidad (10%)**: Posts con más vistas

### Scoring

```
Score Final = (CategoryScore × 0.4) + (TagScore × 0.3) + (RecencyScore × 0.2) + (PopularityScore × 0.1)
```

#### Category Similarity
- **1.0**: Todas las categorías coinciden
- **0.5-0.9**: Algunas categorías coinciden (Jaccard similarity)
- **0.0**: Ninguna categoría coincide

#### Tag Similarity
- Jaccard similarity: `shared_tags / (tags1 + tags2 - shared_tags)`

#### Recency Score
- 0-7 días: 1.0
- 7-30 días: 0.8
- 30-90 días: 0.5
- 90-180 días: 0.3
- 180+ días: 0.1

#### Popularity Score
- Normalizado entre 0-1 basado en views relativas

### Uso

```typescript
import { findRelatedPosts, getRelatedPostsWithScores } from '@/lib/related-posts';

// Encontrar posts relacionados
const related = findRelatedPosts(currentPost, allPosts, {
  limit: 5,
  minScore: 0.2,
  weightCategory: 0.4,
  weightTag: 0.3,
  weightRecency: 0.2,
  weightPopularity: 0.1,
});

// Ver scores (para debugging)
const withScores = getRelatedPostsWithScores(currentPost, allPosts, {
  limit: 5,
});
// Returns: [{ post, score, reasons: ['Misma categoría', '3 tags en común', ...] }]
```

### Recomendaciones Avanzadas

```typescript
// Recomendaciones basadas en historial de lectura
const recommendations = getRecommendedPosts(readingHistory, allPosts, 10);

// "Continuar leyendo" (misma serie/categoría)
const continueReading = getContinueReadingSuggestions(currentPost, allPosts);

// "También te puede gustar" (diversidad basada en tags)
const youMightLike = getYouMightAlsoLike(currentPost, allPosts);

// Posts trending
const trending = getTrendingPosts(allPosts, 5);
```

---

## RSS & Feeds

### Formatos Soportados

1. **RSS 2.0** (`/feed.xml`)
2. **Atom** (`/atom.xml`)
3. **JSON Feed 1.1** (`/feed.json`)

### Generación de Feeds

```typescript
import { generateRSSFeed, generateAtomFeed, generateJSONFeed } from '@/lib/rss-feed';

const config = {
  title: 'Anclora Private Estates Blog',
  description: 'Últimas noticias sobre el mercado inmobiliario de lujo en Mallorca',
  link: 'https://anclora.com',
  language: 'es',
  copyright: '© 2025 Anclora Private Estates',
  managingEditor: 'blog@anclora.com (Anclora Editorial Team)',
  webMaster: 'tech@anclora.com (Anclora Tech Team)',
  imageUrl: 'https://anclora.com/images/logo.png',
};

// RSS 2.0
const rss = generateRSSFeed(posts, config);

// Atom
const atom = generateAtomFeed(posts, config);

// JSON Feed
const jsonFeed = generateJSONFeed(posts, config);
```

### Feeds por Categoría

```typescript
// RSS para categoría específica
const categoryRSS = generateCategoryRSSFeed(posts, category, config);

// Atom para categoría específica
const categoryAtom = generateCategoryAtomFeed(posts, category, config);
```

### Implementación en Next.js

```typescript
// app/feed.xml/route.ts
import { generateRSSFeed } from '@/lib/rss-feed';

export async function GET() {
  const posts = await getAllPosts();
  const rss = generateRSSFeed(posts, config);

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

---

## Templates de Contenido

### 9 Tipos de Post Templates

#### 1. Guide (Guía Completa)
- **Estructura**: Intro → Pasos → Consejos → FAQ → Conclusión
- **Lectura**: 15 min
- **Schema**: HowTo + FAQ
- **Uso**: Guías exhaustivas sobre un tema

#### 2. HowTo (Tutorial)
- **Estructura**: Intro → Requisitos → Pasos → Consejos
- **Lectura**: 8 min
- **Schema**: HowTo
- **Uso**: Tutoriales paso a paso

#### 3. Market Analysis (Análisis de Mercado)
- **Estructura**: Resumen → Tendencias → Precios → Proyecciones
- **Lectura**: 12 min
- **Schema**: Article + Dataset
- **Uso**: Análisis trimestral/mensual del mercado

#### 4. Location Guide (Guía de Ubicación)
- **Estructura**: Overview → Mercado → Lifestyle → Servicios
- **Lectura**: 10 min
- **Schema**: Place + CollectionPage
- **Uso**: Guías completas de zonas

#### 5. News (Noticia)
- **Estructura**: Lead (5W1H) → Contexto → Impacto
- **Lectura**: 5 min
- **Schema**: NewsArticle
- **Uso**: Noticias del sector

#### 6. Interview (Entrevista)
- **Estructura**: Intro → Q&A → Conclusión
- **Lectura**: 10 min
- **Schema**: Person + Interview
- **Uso**: Entrevistas con expertos

#### 7. Case Study (Caso de Éxito)
- **Estructura**: Cliente → Desafío → Solución → Resultados
- **Lectura**: 8 min
- **Schema**: Review
- **Uso**: Casos de éxito de clientes

#### 8. Checklist
- **Estructura**: Intro → Checklist items → Consejos
- **Lectura**: 6 min
- **Schema**: ItemList
- **Uso**: Listas de verificación

#### 9. Comparison (Comparativa)
- **Estructura**: Intro → Opción A/B → Tabla → Veredicto
- **Lectura**: 10 min
- **Schema**: Comparison
- **Uso**: Comparaciones entre opciones

### Uso de Templates

```typescript
import { getTemplateByType, sectionsToHTML, sectionsToMarkdown } from '@/lib/blog-templates';

// Obtener template
const template = getTemplateByType('guide');

// Convertir a HTML
const html = sectionsToHTML(template.sections);

// Convertir a Markdown
const markdown = sectionsToMarkdown(template.sections);
```

---

## Implementación de Páginas

### 1. Post Individual (`/blog/[slug]`)

**Características**:
- Hero con imagen destacada
- Breadcrumbs
- Meta info (autor, fecha, tiempo lectura)
- Contenido con tabla de contenidos
- Tags
- Biografía de autor
- Botones compartir (Twitter, LinkedIn, Facebook, WhatsApp)
- Posts relacionados (3)
- Newsletter CTA

**Schema Markup**:
- BlogPosting
- Article
- Person (autor)
- BreadcrumbList

### 2. Listado de Blog (`/blog`)

**Características**:
- Hero con buscador
- Navegación de categorías (sticky)
- Posts destacados (featured)
- Grid de posts (12 por página)
- Paginación
- Filtros (categoría, búsqueda)
- Newsletter CTA

**Schema Markup**:
- WebSite
- CollectionPage
- ItemList

### 3. Página de Categoría (`/blog/categoria/[slug]`)

**Características**:
- Hero con color de categoría
- Breadcrumbs
- Stats (número de posts)
- Grid de posts de la categoría
- Categorías relacionadas
- Newsletter CTA específico

**Schema Markup**:
- CollectionPage
- BreadcrumbList
- ItemList

### 4. Página de Autor (`/blog/autor/[slug]`)

**Características**:
- Header con avatar y bio
- Stats (posts, vistas, promedio)
- Social links
- Expertise y idiomas
- Posts más populares
- Posts recientes por categoría
- Formación y logros
- CTA de contacto

**Schema Markup**:
- Person
- ProfilePage
- ItemList (portfolio)

---

## SEO y Schema Markup

### Meta Tags

Cada página implementa:
```typescript
{
  title: 'Título optimizado (60 chars max)',
  description: 'Meta description (160 chars max)',
  keywords: ['keyword1', 'keyword2', ...],
  canonical: 'https://anclora.com/blog/slug',
  openGraph: {
    type: 'article',
    image: 'featured-image.jpg',
    publishedTime: '2024-01-01T00:00:00Z',
    modifiedTime: '2024-01-02T00:00:00Z',
    authors: ['Author Name'],
    tags: ['tag1', 'tag2'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter title',
    description: 'Twitter description',
    image: 'twitter-image.jpg',
  },
}
```

### Structured Data

#### BlogPosting Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "image": "featured-image.jpg",
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-02",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Anclora Private Estates"
  },
  "description": "Post excerpt",
  "articleBody": "Full content"
}
```

### Internal Linking

El sistema automáticamente genera links internos contextuales:

**Para Post de Blog**:
1. Link a guía de ubicación (priority 10)
2. Link a propiedades similares (9)
3. Link a tipo de propiedad (8)
4. Link a servicio de valoración (7)
5. Link a guía de compra (6)

**Implementación**:
```typescript
const contextualLinks = generateContextualLinks({
  currentPage: {
    type: 'blog',
    categories: post.categories.map(c => c.slug),
  },
});
```

---

## Guía de Implementación

### Paso 1: Setup Database/CMS

#### Opción A: Base de Datos (Recomendado)
```sql
-- PostgreSQL Schema
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  author_id UUID REFERENCES authors(id),
  published_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reading_time INTEGER,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  status VARCHAR(20) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false
);

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(7),
  seo_title VARCHAR(60),
  seo_description VARCHAR(160)
);

CREATE TABLE post_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

#### Opción B: CMS Headless

Configurar en **Sanity**, **Contentful**, **Strapi**, etc.:

```typescript
// Sanity Schema Example
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text', validation: Rule => Rule.max(160) },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'featuredImage', type: 'image', options: { hotspot: true } },
    { name: 'author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'seo', type: 'object', fields: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'text' },
      { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
    ]},
  ],
};
```

### Paso 2: Crear Data Fetching Functions

```typescript
// lib/blog-data.ts
import { BlogPost, Category, Author } from './blog-system';

export async function getAllPosts(): Promise<BlogPost[]> {
  // Implementar fetch desde database/CMS
  const posts = await db.query('SELECT * FROM blog_posts WHERE status = $1', ['published']);
  return posts.rows.map(mapToBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const result = await db.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
  return result.rows[0] ? mapToBlogPost(result.rows[0]) : null;
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  // Implementar query con JOIN
  return [];
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const result = await db.query('SELECT * FROM blog_posts WHERE featured = true LIMIT 3');
  return result.rows.map(mapToBlogPost);
}

function mapToBlogPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: {
      url: row.featured_image_url,
      alt: row.featured_image_alt,
    },
    author: row.author, // Populate con JOIN
    categories: row.categories, // Populate con JOIN
    tags: row.tags, // Populate con JOIN
    publishedAt: new Date(row.published_at),
    updatedAt: new Date(row.updated_at),
    readingTime: row.reading_time,
    seo: {
      title: row.seo_title,
      description: row.seo_description,
      keywords: row.seo_keywords || [],
    },
    status: row.status,
    views: row.views,
    featured: row.featured,
  };
}
```

### Paso 3: Implementar Páginas

Copiar los archivos example y adaptar:

```bash
# Copiar páginas example a producción
cp app/blog/page-example.tsx app/blog/page.tsx
cp app/blog/[slug]/page-example.tsx app/blog/[slug]/page.tsx
cp app/blog/categoria/[slug]/page-example.tsx app/blog/categoria/[slug]/page.tsx
cp app/blog/autor/[slug]/page-example.tsx app/blog/autor/[slug]/page.tsx
```

Actualizar imports en cada archivo:
```typescript
// Cambiar
import { getAllPosts } from './mock-data';

// Por
import { getAllPosts } from '@/lib/blog-data';
```

### Paso 4: Configurar Feeds

```typescript
// app/feed.xml/route.ts
import { generateRSSFeed } from '@/lib/rss-feed';
import { getAllPosts } from '@/lib/blog-data';

export async function GET() {
  const posts = await getAllPosts();
  
  const rss = generateRSSFeed(posts, {
    title: 'Anclora Private Estates Blog',
    description: 'Últimas noticias sobre el mercado inmobiliario de lujo en Mallorca',
    link: 'https://anclora.com',
    language: 'es',
    copyright: '© 2025 Anclora Private Estates',
    managingEditor: 'blog@anclora.com (Anclora Editorial Team)',
    webMaster: 'tech@anclora.com (Anclora Tech Team)',
    imageUrl: 'https://anclora.com/images/logo.png',
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

Similar para `/atom.xml/route.ts` y `/feed.json/route.ts`.

### Paso 5: Configurar Sitemap

Agregar blog posts al sitemap existente:

```typescript
// app/sitemap.ts
import { getAllPosts } from '@/lib/blog-data';

export default async function sitemap() {
  const posts = await getAllPosts();

  const blogPosts = posts.map(post => ({
    url: `https://anclora.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...existingUrls,
    ...blogPosts,
  ];
}
```

### Paso 6: Testing

```bash
# 1. Verificar builds
npm run build

# 2. Test páginas localmente
npm run dev

# Visitar:
# - http://localhost:3000/blog
# - http://localhost:3000/blog/test-post-slug
# - http://localhost:3000/blog/categoria/guias-compra
# - http://localhost:3000/blog/autor/toni-ia

# 3. Validar feeds
# - http://localhost:3000/feed.xml
# - http://localhost:3000/atom.xml
# - http://localhost:3000/feed.json

# 4. Validar schemas
# Google Rich Results Test: https://search.google.com/test/rich-results
# Schema Validator: https://validator.schema.org/
```

---

## Best Practices

### Contenido

#### DO ✅
- Escribir títulos descriptivos y atractivos (50-60 chars)
- Usar subtítulos (H2, H3) para estructura
- Incluir imágenes cada 300-500 palabras
- Optimizar alt text de imágenes
- Usar listas y bullet points
- Incluir llamadas a la acción
- Actualizar posts antiguos regularmente

#### DON'T ❌
- Usar clickbait en títulos
- Escribir párrafos de más de 4 líneas
- Usar jerga técnica sin explicar
- Olvidar meta descriptions
- Duplicar contenido
- Ignorar formato mobile

### SEO

#### Checklist por Post
- [ ] Título optimizado (50-60 chars, keyword principal)
- [ ] Meta description (150-160 chars, incluye CTA)
- [ ] Slug limpio y descriptivo
- [ ] Imagen destacada (1200x630px min)
- [ ] Alt text en todas las imágenes
- [ ] Headers jerárquicos (H1 → H2 → H3)
- [ ] Internal links (3-5 por post)
- [ ] External links a fuentes autorizadas
- [ ] Schema markup implementado
- [ ] Velocidad de carga < 3s

### Frecuencia de Publicación

**Recomendado**:
- **Guías de Compra**: 1-2 / mes
- **Mercado Inmobiliario**: Análisis trimestral (4 / año)
- **Ubicaciones**: 1 / mes (rotar zonas)
- **Inversión**: 2-3 / mes
- **Estilo de Vida**: 2-3 / mes
- **Legal y Fiscal**: Cuando hay cambios normativos
- **Reformas y Diseño**: 1-2 / mes
- **Sostenibilidad**: 1 / mes

**Total**: 12-15 posts / mes

### Promoción

#### Canales
1. **Newsletter**: Enviar digest semanal
2. **Social Media**: LinkedIn (B2B), Instagram (lifestyle)
3. **Email Automation**: n8n workflows para nuevos posts
4. **Internal Linking**: Agregar links en posts antiguos
5. **Propiedades**: Vincular posts relevantes en listados

#### Timing
- **LinkedIn**: Martes-Jueves, 8-10 AM
- **Instagram**: Todos los días, 7-9 PM
- **Newsletter**: Viernes, 10 AM

---

## Métricas y KPIs

### Tracking (Google Analytics 4)

```typescript
// Eventos a trackear
- blog_view: { post_id, post_title, category }
- blog_engagement: { scroll_depth, time_on_page }
- blog_share: { platform, post_id }
- blog_cta_click: { cta_type, post_id }
- newsletter_subscribe: { source: 'blog' }
```

### KPIs Principales

1. **Tráfico Orgánico**: +200% en 12 meses
2. **Tiempo en Página**: > 3 minutos
3. **Bounce Rate**: < 50%
4. **CTR en SERPs**: > 3%
5. **Conversión Newsletter**: 5-10%
6. **Conversión Leads**: 2-5%

### Reporting

**Mensual**:
- Top 10 posts por tráfico
- Top 10 posts por conversión
- Categorías más populares
- Autores más leídos
- Keywords ranking

**Trimestral**:
- ROI del blog (leads generados × valor)
- Tendencias de contenido
- Análisis competitivo
- Actualización de estrategia

---

## Roadmap Futuro

### Q1 2025
- [ ] Implementar sistema de comentarios
- [ ] Newsletter automation con n8n
- [ ] A/B testing de CTAs
- [ ] Blog en inglés (i18n)

### Q2 2025
- [ ] Podcast integration
- [ ] Video content embeds
- [ ] Interactive calculators
- [ ] Personalized recommendations

### Q3 2025
- [ ] AI-powered content suggestions
- [ ] Advanced analytics dashboard
- [ ] Content collaboration workflow
- [ ] Guest author system

---

## Conclusión

El Blog System de Anclora está diseñado para:

✅ **Escalabilidad**: Soporta cientos de posts sin degradación  
✅ **SEO**: Optimización completa con Schema.org  
✅ **UX**: Navegación intuitiva y rápida  
✅ **Performance**: Caching y CDN ready  
✅ **Mantenibilidad**: Código modular y documentado  

**Impacto Esperado** (12 meses):
- 📈 +15,000 visitas mensuales orgánicas
- 📧 +500 suscriptores newsletter
- 🏠 +100 leads cualificados/mes
- 💰 ROI: €50,000-100,000 en comisiones

---

**Documentación Versión**: 1.0  
**Última Actualización**: Diciembre 2024  
**Autor**: Toni IA - Anclora Private Estates
