# Sistema GEO (Generative Engine Optimization)
## Documentación Completa - Anclora Private Estates

---

## 1. Visión General del Sistema

### 1.1 Objetivo
Optimizar todo el contenido de Anclora Private Estates para motores de IA generativos (ChatGPT, Claude, Perplexity, Google SGE) maximizando la visibilidad, citación y conversión de tráfico proveniente de búsquedas conversacionales.

### 1.2 Motores Objetivo
- **ChatGPT** (OpenAI): GPTBot, ChatGPT-User
- **Claude** (Anthropic): anthropic-ai, claude-web
- **Perplexity**: PerplexityBot
- **Google SGE**: Google-Extended
- **Meta AI**: FacebookBot
- **Otros**: CCBot (Common Crawl)

### 1.3 Diferencia entre SEO tradicional y GEO

| Aspecto | SEO Tradicional | GEO |
|---------|-----------------|-----|
| Objetivo | Rankings en SERP | Citaciones en respuestas AI |
| Formato | Keywords + Links | Conversacional + Estructurado |
| Medición | CTR, posición | Citaciones, menciones |
| Contenido | Optimizado para crawlers | Optimizado para comprensión AI |
| Longitud | 1,000-2,000 palabras | Respuestas concisas + contexto profundo |

---

## 2. Arquitectura del Sistema

### 2.1 Módulos Principales

```
lib/
├── geo-optimization.ts          (Core GEO)
├── faq-schema.ts                (FAQs optimizados)
├── llm-content-formatter.ts     (Formateador LLM)
├── ai-citation-optimizer.ts     (Optimizador citaciones)
└── featured-snippets.ts         (Snippets destacados)
```

### 2.2 Flujo de Optimización

```
Contenido Original
      ↓
[1] Análisis y Estructura (llm-content-formatter)
      ↓
[2] Generación FAQs (faq-schema)
      ↓
[3] Optimización Citaciones (ai-citation-optimizer)
      ↓
[4] Featured Snippets (featured-snippets)
      ↓
[5] Meta GEO (geo-optimization)
      ↓
Contenido GEO-Optimizado
```

---

## 3. Configuración de Crawlers AI

### 3.1 Permitir/Bloquear Crawlers

**Permitir todos los crawlers AI** (Recomendado para Anclora):
```html
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
<meta name="citation-needed" content="true" />
<meta name="ai-optimized" content="true" />
```

**Bloquear crawlers AI** (Si se desea):
```html
<meta name="robots" content="noai, noimageai" />
<meta name="ChatGPT" content="noindex" />
<meta name="GPTBot" content="noindex" />
<meta name="anthropic-ai" content="noindex" />
<meta name="claude-web" content="noindex" />
<meta name="PerplexityBot" content="noindex" />
```

**En robots.txt**:
```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: claude-web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### 3.2 Headers HTTP para Crawlers

**Opt-in (Permitir entrenamiento)**:
```typescript
{
  'X-Robots-Tag': 'all',
  'X-AI-Training': 'yes',
  'X-AI-Citation-Preferred': 'true'
}
```

**Opt-out (Bloquear entrenamiento)**:
```typescript
{
  'X-Robots-Tag': 'noai, noimageai',
  'X-AI-Training': 'no'
}
```

---

## 4. Sistema de Citaciones

### 4.1 Tipos de Contenido Citable

```typescript
type CitableContentType =
  | 'statistic'      // Datos numéricos
  | 'definition'     // Definiciones de términos
  | 'fact'           // Hechos verificables
  | 'quote'          // Citas textuales
  | 'process'        // Procesos paso a paso
  | 'comparison'     // Comparaciones
  | 'list';          // Listas
```

### 4.2 Estructura de Contenido Citable

```typescript
{
  id: 'cite-12345',
  type: 'statistic',
  content: 'El precio medio de una villa en Son Vida es 3-8 millones €',
  source: 'Anclora Private Estates',
  url: 'https://anclora.com/guias/comprar-mallorca',
  confidence: 'high',
  lastVerified: new Date('2025-01-01')
}
```

### 4.3 Formatos de Citación por Motor

**ChatGPT**:
```markdown
[Source: Anclora Private Estates](https://anclora.com/guias/comprar-mallorca)
```

**Claude**:
```
El precio medio es 2M € (Source: Anclora - https://anclora.com)
```

**Perplexity**:
```
Son Vida es la zona más exclusiva^[1]

[1]: https://anclora.com/zonas/son-vida
```

**Google SGE**:
```
El ITP es 8-11% del precio - Anclora Private Estates
```

### 4.4 Ejemplo de Implementación

```typescript
const priceData = optimizeForCitation({
  text: 'Una villa de lujo en Mallorca cuesta entre 1.5 y 15 millones de euros',
  type: 'statistic',
  context: 'pricing'
});

const markup = generateCitationMarkup(priceData);
```

**Output HTML**:
```html
<div class="citable-content" 
     id="cite-12345" 
     data-type="statistic"
     data-source="Anclora Private Estates"
     data-url="https://anclora.com"
     data-confidence="high">
  Una villa de lujo en Mallorca cuesta entre 1.5 y 15 millones de euros
  <cite class="source-attribution">
    <a href="https://anclora.com" rel="nofollow">Fuente: Anclora Private Estates</a>
  </cite>
</div>
```

---

## 5. Featured Snippets (Posición 0)

### 5.1 Tipos de Snippets

#### Paragraph Snippet
- **Longitud óptima**: 40-60 palabras
- **Uso**: Respuestas directas a preguntas
- **Ejemplo**: "¿Cuánto cuesta una villa en Mallorca?"

```typescript
generateParagraphSnippet({
  question: '¿Cuánto cuesta una villa de lujo en Mallorca?',
  answer: 'Una villa de lujo en Mallorca cuesta entre 1.5 y 15 millones de euros. En zonas prime como Son Vida o Port d\'Andratx, los precios oscilan entre 3-15M €.',
  details: 'Factores: ubicación, vistas, parcela, estado.'
});
```

#### List Snippet
- **Longitud óptima**: 3-8 items
- **Uso**: Procesos, pasos, rankings
- **Ejemplo**: "¿Cómo comprar en Mallorca?"

```typescript
generateListSnippet({
  question: '¿Cómo comprar una propiedad en Mallorca?',
  items: [
    'Obtener NIE',
    'Reserva con arras (10%)',
    'Due diligence legal',
    'Obtención de hipoteca',
    'Firma contrato privado',
    'Pago de impuestos',
    'Firma escritura',
    'Registro propiedad'
  ]
});
```

#### Table Snippet
- **Dimensiones óptimas**: 3-10 filas, 2-4 columnas
- **Uso**: Comparaciones, datos estructurados
- **Ejemplo**: "¿Mejores zonas de Mallorca?"

```typescript
generateTableSnippet({
  question: '¿Cuáles son las mejores zonas para comprar en Mallorca?',
  headers: ['Zona', 'Precio Medio', 'Tipo', 'Revalorización'],
  rows: [
    ['Son Vida', '3-8M €', 'Urbano exclusivo', '5-8% anual'],
    ['Port d\'Andratx', '4-15M €', 'Costa exclusiva', '4-7% anual'],
    ['Puerto Portals', '2-6M €', 'Puerto deportivo', '4-6% anual']
  ]
});
```

### 5.2 Validación de Calidad

```typescript
const validation = validateSnippetQuality(snippet);
console.log(validation);
// {
//   isValid: true,
//   score: 92,
//   issues: [],
//   recommendations: ['Add more specific data points']
// }
```

---

## 6. Sistema de FAQs

### 6.1 FAQs Predefinidos por Categoría

**Compra** (3 FAQs):
- ¿Cuánto cuesta comprar una villa de lujo en Mallorca?
- ¿Cuánto tiempo tarda el proceso de compra?
- ¿Necesito NIE para comprar?

**Impuestos** (2 FAQs):
- ¿Qué impuestos hay que pagar al comprar?
- ¿Hay que pagar impuestos anuales?

**Financiación** (2 FAQs):
- ¿Pueden los extranjeros obtener hipoteca?
- ¿Qué bancos ofrecen mejores hipotecas?

**Inversión** (2 FAQs):
- ¿Es rentable invertir en villa de lujo?
- ¿Qué zonas tienen mejor potencial?

**Golden Visa** (1 FAQ):
- ¿Cómo funciona la Golden Visa?

### 6.2 Estructura FAQ

```typescript
{
  id: 'faq-compra-1',
  question: '¿Cuánto cuesta comprar una villa de lujo en Mallorca?',
  answer: 'El precio de una villa de lujo en Mallorca varía significativamente según la ubicación y características. En zonas prime como Son Vida o Port d\'Andratx, los precios oscilan entre 3-15 millones de euros...',
  category: 'compra',
  keywords: ['precio', 'villa', 'mallorca', 'lujo'],
  importance: 'critical'
}
```

### 6.3 Schema FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta una villa en Mallorca?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Una villa de lujo en Mallorca cuesta..."
      }
    }
  ]
}
```

### 6.4 Validación de FAQs

```typescript
const validation = validateFAQQuality(faq);
// {
//   isValid: true,
//   score: 95,
//   issues: []
// }
```

**Criterios**:
- Pregunta: 20-100 caracteres, formato interrogativo
- Respuesta: 100-500 caracteres (ideal para snippets)
- Keywords: Mínimo 3
- Categoría: Asignada

---

## 7. Formateador de Contenido para LLMs

### 7.1 Formatos Disponibles

```typescript
type LLMContentFormat = 
  | 'structured-markdown'
  | 'semantic-html'
  | 'json-ld'
  | 'plain-text'
  | 'qa-pairs';
```

### 7.2 Extracción de Entidades

**Tipos de entidades detectadas**:
- **Precios**: €2.5M, 3 millones €, 500.000 EUR
- **Ubicaciones**: Mallorca, Son Vida, Port d'Andratx
- **Fechas**: 2025, Enero 2025, 2-4 semanas
- **Features**: piscina, jardín, vistas al mar, 4 dormitorios

**Ejemplo**:
```typescript
const entities = extractEntities(content);
// [
//   { text: '3M €', type: 'price', value: 3000000, confidence: 0.9 },
//   { text: 'Son Vida', type: 'location', value: 'Son Vida', confidence: 1.0 },
//   { text: 'piscina', type: 'feature', confidence: 0.85 }
// ]
```

### 7.3 Marcadores Semánticos

```html
<span class="semantic-price" data-type="price">3M €</span>
<span class="semantic-location" data-type="location">Son Vida</span>
<span class="semantic-property-type" data-type="property">villa</span>
```

### 7.4 Generación de Resumen

```typescript
const summary = generateLLMSummary(content, 200);
// {
//   summary: 'Guía completa para comprar villa de lujo en Mallorca...',
//   keyPoints: [
//     'Precios entre 1.5-15M €',
//     'Proceso 2-3 meses',
//     'NIE obligatorio'
//   ],
//   entities: [...]
// }
```

---

## 8. Optimización para Búsqueda por Voz

### 8.1 Características
- **Longitud óptima**: 20-30 palabras
- **Estilo**: Conversacional, directo
- **Formato**: Respuesta completa en una frase

### 8.2 Ejemplo

**Input**:
```
Para comprar una propiedad en Mallorca necesitas obtener un NIE, 
reservar con arras del 10%, hacer due diligence legal, obtener 
financiación si es necesario, firmar contrato privado, pagar 
impuestos del 8-11%, y finalmente firmar escritura ante notario.
```

**Output optimizado para voz**:
```typescript
const voice = optimizeForVoiceSearch(content);
// {
//   voiceOptimized: 'Para comprar en Mallorca necesitas NIE, 
//                    reserva 10%, due diligence, financiación, 
//                    contrato, impuestos 8-11% y escritura notarial.',
//   answerLength: 22  // palabras
// }
```

---

## 9. Scoring y Validación GEO

### 9.1 Sistema de Puntuación

```typescript
const score = calculateGEOScore({
  title: 'Guía Completa para Comprar en Mallorca',
  description: 'Guía paso a paso...',
  content: '...',
  wordCount: 2500,
  hasHeadings: true,
  hasFAQ: true,
  hasCitations: true,
  hasSchema: true,
  hasImages: true,
  allImagesHaveAlt: true
});

// {
//   score: 95,
//   breakdown: {
//     title: 15,
//     description: 15,
//     contentLength: 20,
//     structure: 15,
//     faq: 15,
//     citations: 10,
//     schema: 10,
//     images: 10
//   },
//   grade: 'A'
// }
```

### 9.2 Criterios de Evaluación

| Criterio | Peso | Puntos Max |
|----------|------|------------|
| Title (30-60 chars) | 15% | 15 |
| Description (120-160 chars) | 15% | 15 |
| Content length (300-2000 words) | 20% | 20 |
| Structure (headings) | 15% | 15 |
| FAQ section | 15% | 15 |
| Citations | 10% | 10 |
| Schema markup | 10% | 10 |
| Images + alt text | 10% | 10 |

**Grades**:
- A: 90-100 puntos
- B: 80-89 puntos
- C: 70-79 puntos
- D: 60-69 puntos
- F: <60 puntos

---

## 10. Mejores Prácticas GEO

### 10.1 Contenido

✅ **Hacer**:
- Respuestas concisas (40-60 palabras) al inicio
- Datos específicos con números
- Definiciones claras de términos
- Lenguaje conversacional
- Actualizar fechas regularmente

❌ **Evitar**:
- Lenguaje incierto ("probablemente", "quizás")
- Contenido demasiado largo sin estructura
- Jerga sin definir
- Contenido desactualizado

### 10.2 Estructura

✅ **Hacer**:
- Tabla de contenidos clickeable
- Secciones con IDs (#precios, #proceso)
- FAQs al final de cada página
- Listas numeradas para procesos
- Tablas para comparaciones

❌ **Evitar**:
- Párrafos largos sin breaks
- Falta de headings
- Estructura plana sin jerarquía

### 10.3 Datos Técnicos

✅ **Hacer**:
- Schema.org (FAQPage, Article, HowTo)
- Meta tags GEO
- Citation markers
- Semantic HTML
- Alt text descriptivo

❌ **Evitar**:
- Schema incorrecto o incompleto
- Meta tags faltantes
- HTML no semántico
- Imágenes sin alt

---

## 11. Implementación Paso a Paso

### Paso 1: Configurar Meta Tags

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* GEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1" />
        <meta name="citation-needed" content="true" />
        <meta name="ai-optimized" content="true" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Paso 2: Crear Contenido GEO-Optimizado

```tsx
// app/guias/[slug]/page.tsx
import { generateFAQSchema, COMMON_FAQS } from '@/lib/faq-schema';
import { generateParagraphSnippet } from '@/lib/featured-snippets';

export default function GuiaPage() {
  const faqs = COMMON_FAQS.compra;
  const faqSchema = generateFAQSchema(faqs);
  
  const snippet = generateParagraphSnippet({
    question: '¿Cuánto cuesta...?',
    answer: '...'
  });
  
  return (
    <>
      <SchemaRenderer schemas={[faqSchema]} />
      {/* Contenido */}
    </>
  );
}
```

### Paso 3: Añadir Citaciones

```tsx
const keyFacts = [
  'El proceso tarda 2-3 meses',
  'NIE es obligatorio',
  'Impuestos: 10-12% adicional'
];

const citableBlocks = keyFacts.map(fact => 
  optimizeForCitation({
    text: fact,
    type: 'fact'
  })
);
```

### Paso 4: Implementar FAQs

```tsx
<section id="faqs">
  <h2>Preguntas Frecuentes</h2>
  <div dangerouslySetInnerHTML={{ 
    __html: generateFAQHTML(faqs) 
  }} />
</section>
```

### Paso 5: Validar Calidad

```tsx
const validation = validateGEOReadiness({
  title: pageTitle,
  description: pageDescription,
  content: pageContent,
  hasSchema: true,
  hasCitations: true,
  hasStructuredAnswers: true
});

if (validation.score < 70) {
  console.warn('GEO score bajo:', validation.issues);
}
```

---

## 12. Métricas y KPIs

### 12.1 Métricas de Visibilidad

**Citaciones en AI**:
- Menciones en ChatGPT: Objetivo 50/mes
- Menciones en Claude: Objetivo 30/mes
- Menciones en Perplexity: Objetivo 40/mes
- Featured Snippets Google: Objetivo 20

**Herramientas**:
- Google Search Console (featured snippets)
- Brand monitoring (Brand24, Mention)
- Analytics personalizado (tracking referrers AI)

### 12.2 Métricas de Tráfico

**Tráfico desde AI**:
- Conversational search traffic
- Zero-click searches answered
- AI-generated referrals

**Conversión**:
- Leads from AI sources
- Engagement rate AI traffic
- Time on site AI vs organic

### 12.3 Dashboard Propuesto

```
GEO Performance Dashboard
├── Visibility Metrics
│   ├── AI Citations (50/mes target)
│   ├── Featured Snippets (20 target)
│   └── Voice Search Answers (30/mes target)
├── Traffic Metrics
│   ├── AI Referral Traffic
│   ├── Conversational Search Traffic
│   └── Zero-Click Conversions
├── Quality Metrics
│   ├── Avg GEO Score (90+ target)
│   ├── FAQ Coverage (100%)
│   └── Citation Quality (95%+ confidence)
└── Conversion Metrics
    ├── AI-sourced Leads
    ├── Engagement Rate
    └── ROI AI vs SEO
```

---

## 13. Roadmap de Implementación

### Fase 1: Fundación (Semana 1-2)
- [x] Implementar sistema core GEO
- [x] Configurar meta tags
- [x] Crear biblioteca FAQs
- [x] Sistema de citaciones
- [x] Featured snippets optimizer
- [ ] Testing en páginas piloto

### Fase 2: Contenido (Semana 3-4)
- [ ] Optimizar todas las guías
- [ ] Optimizar páginas de ubicaciones
- [ ] Optimizar fichas de propiedades
- [ ] Crear FAQ page centralizada
- [ ] Implementar voz search

### Fase 3: Escala (Mes 2)
- [ ] Automatización de scoring
- [ ] Dashboard de métricas
- [ ] A/B testing snippets
- [ ] Optimización iterativa

### Fase 4: Avanzado (Mes 3+)
- [ ] Personalización por motor AI
- [ ] Content refresh automation
- [ ] Advanced analytics
- [ ] Multi-language GEO

---

## 14. Checklist de Implementación

### Por Página

- [ ] Title 30-60 caracteres
- [ ] Description 120-160 caracteres
- [ ] Meta tags GEO completos
- [ ] Contenido 300-2000 palabras
- [ ] Headings jerárquicos (H1-H3)
- [ ] FAQ section con schema
- [ ] 3-5 featured snippets
- [ ] 5-10 citable blocks
- [ ] Voice-optimized answer
- [ ] Semantic markers
- [ ] Images con alt text
- [ ] Internal links
- [ ] Schema markup
- [ ] Last updated date
- [ ] GEO score 90+

### Por Sección

- [ ] Guías (10 páginas)
- [ ] Ubicaciones (8 páginas)
- [ ] Propiedades (50+ listings)
- [ ] Blog (50+ posts)
- [ ] FAQs centralizadas
- [ ] Glosario de términos

---

## 15. Recursos y Referencias

### Documentación Oficial
- Schema.org: https://schema.org/
- Google Search Central: https://developers.google.com/search
- OpenAI GPTBot: https://platform.openai.com/docs/gptbot
- Anthropic Claude: https://www.anthropic.com/

### Herramientas
- Schema Validator: https://validator.schema.org/
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

### Monitoreo
- Google Search Console
- Brand monitoring tools
- Analytics (GA4, Plausible)

---

## Conclusión

El sistema GEO de Anclora Private Estates proporciona una ventaja competitiva significativa en la era de la búsqueda conversacional. Con una implementación completa, esperamos:

- **50-100 citaciones mensuales** en motores AI
- **20+ featured snippets** en Google
- **30% del tráfico** desde búsquedas conversacionales
- **Higher conversion rate** (AI traffic suele ser más cualificado)

La clave está en mantener contenido actualizado, estructurado y optimizado continuamente basándose en las métricas de rendimiento.
