/**
 * Featured Snippets Optimizer
 * Optimiza contenido para aparecer en posición 0 de Google
 * 
 * @module featured-snippets
 */

/**
 * Types of featured snippets
 */
export type SnippetType =
  | 'paragraph'
  | 'list'
  | 'table'
  | 'accordion'
  | 'video';

/**
 * Featured snippet structure
 */
export interface FeaturedSnippet {
  id: string;
  type: SnippetType;
  query: string;
  answer: string;
  details?: string;
  metadata?: {
    wordCount?: number;
    hasSchema?: boolean;
    confidence?: number;
  };
}

/**
 * Optimal lengths for different snippet types
 */
export const SNIPPET_OPTIMAL_LENGTHS = {
  paragraph: { min: 40, max: 60, ideal: 50 },
  list: { min: 3, max: 8, ideal: 5 },
  table: { rows: { min: 3, max: 10, ideal: 5 }, cols: { min: 2, max: 4, ideal: 3 } },
} as const;

/**
 * Common question patterns for real estate
 */
export const QUESTION_PATTERNS = {
  price: [
    '¿Cuánto cuesta {item} en {location}?',
    '¿Cuál es el precio de {item} en {location}?',
    '¿Precio medio de {item} en {location}?',
  ],
  
  process: [
    '¿Cómo comprar {item} en {location}?',
    '¿Qué hacer para {action}?',
    '¿Pasos para {action}?',
  ],
  
  comparison: [
    '¿Diferencia entre {item1} y {item2}?',
    '{item1} vs {item2}',
    '¿Qué es mejor {item1} o {item2}?',
  ],
  
  definition: [
    '¿Qué es {term}?',
    '¿Qué significa {term}?',
    'Definición de {term}',
  ],
  
  best: [
    '¿Mejores {items} en {location}?',
    '¿Dónde {action} en {location}?',
    'Top {items} en {location}',
  ],
} as const;

/**
 * Generate paragraph snippet
 */
export function generateParagraphSnippet(params: {
  question: string;
  answer: string;
  details?: string;
}): FeaturedSnippet {
  // Optimize answer length (40-60 words ideal)
  const words = params.answer.split(/\s+/);
  const wordCount = words.length;
  
  let optimizedAnswer = params.answer;
  
  // If too long, extract first sentence or truncate
  if (wordCount > 60) {
    const firstSentence = params.answer.split(/[.!?]/)[0] + '.';
    const firstSentenceWords = firstSentence.split(/\s+/).length;
    
    if (firstSentenceWords <= 60) {
      optimizedAnswer = firstSentence;
    } else {
      optimizedAnswer = words.slice(0, 60).join(' ') + '...';
    }
  }
  
  // Ensure it starts with a capital letter
  optimizedAnswer = optimizedAnswer.charAt(0).toUpperCase() + optimizedAnswer.slice(1);
  
  return {
    id: generateSnippetId(),
    type: 'paragraph',
    query: params.question,
    answer: optimizedAnswer,
    details: params.details,
    metadata: {
      wordCount: optimizedAnswer.split(/\s+/).length,
      confidence: calculateConfidence(optimizedAnswer),
    },
  };
}

/**
 * Generate list snippet
 */
export function generateListSnippet(params: {
  question: string;
  items: string[];
  intro?: string;
}): FeaturedSnippet {
  // Optimize list length (3-8 items ideal)
  let items = params.items;
  
  if (items.length > 8) {
    items = items.slice(0, 8);
  } else if (items.length < 3 && items.length > 0) {
    // Too few items, add context if possible
  }
  
  // Format items
  const formattedItems = items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  
  const answer = params.intro
    ? `${params.intro}\n\n${formattedItems}`
    : formattedItems;
  
  return {
    id: generateSnippetId(),
    type: 'list',
    query: params.question,
    answer,
    metadata: {
      wordCount: answer.split(/\s+/).length,
      confidence: items.length >= 3 && items.length <= 8 ? 0.9 : 0.6,
    },
  };
}

/**
 * Generate table snippet
 */
export function generateTableSnippet(params: {
  question: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}): FeaturedSnippet {
  // Validate table dimensions
  if (params.rows.length < 3 || params.rows.length > 10) {
    throw new Error('Table should have 3-10 rows for optimal snippet performance');
  }
  
  if (params.headers.length < 2 || params.headers.length > 4) {
    throw new Error('Table should have 2-4 columns for optimal snippet performance');
  }
  
  // Generate HTML table
  const table = `
<table>
  ${params.caption ? `<caption>${params.caption}</caption>` : ''}
  <thead>
    <tr>
      ${params.headers.map(h => `<th>${h}</th>`).join('\n      ')}
    </tr>
  </thead>
  <tbody>
    ${params.rows
      .map(
        row => `
    <tr>
      ${row.map(cell => `<td>${cell}</td>`).join('\n      ')}
    </tr>`
      )
      .join('\n  ')}
  </tbody>
</table>
  `.trim();
  
  return {
    id: generateSnippetId(),
    type: 'table',
    query: params.question,
    answer: table,
    metadata: {
      hasSchema: true,
      confidence: 0.95,
    },
  };
}

/**
 * Generate snippet ID
 */
function generateSnippetId(): string {
  return `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(answer: string): number {
  const words = answer.split(/\s+/).length;
  const hasNumber = /\d+/.test(answer);
  const hasSpecifics = /€|\d+%|[A-Z][a-z]+ [0-9]{4}/.test(answer);
  
  let confidence = 0.5;
  
  // Optimal length
  if (words >= 40 && words <= 60) confidence += 0.3;
  else if (words >= 30 && words <= 70) confidence += 0.2;
  else confidence += 0.1;
  
  // Has numbers/specifics
  if (hasNumber) confidence += 0.1;
  if (hasSpecifics) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

/**
 * Common real estate queries and optimized snippets
 */
export const REAL_ESTATE_SNIPPETS: FeaturedSnippet[] = [
  // Price queries
  {
    id: 'snippet-price-villa-mallorca',
    type: 'paragraph',
    query: '¿Cuánto cuesta una villa de lujo en Mallorca?',
    answer: 'Una villa de lujo en Mallorca cuesta entre 1.5 y 15 millones de euros, dependiendo de la ubicación. En zonas prime como Son Vida o Port d\'Andratx, los precios oscilan entre 3-15M €, mientras que en otras áreas exclusivas como Calvià puedes encontrar desde 1.5M €.',
    details: 'Los factores que más influyen en el precio son: ubicación, vistas al mar, tamaño de la parcela (mínimo 1,000m²), estado de conservación y calidades de construcción.',
    metadata: {
      wordCount: 58,
      confidence: 0.95,
    },
  },
  
  // Process queries
  {
    id: 'snippet-process-compra',
    type: 'list',
    query: '¿Cómo comprar una propiedad en Mallorca?',
    answer: `El proceso de compra en Mallorca sigue estos pasos:

1. Obtener NIE (Número de Identificación de Extranjero)
2. Reserva de la propiedad con contrato de arras (10% del precio)
3. Due diligence y revisión legal de la propiedad
4. Obtención de hipoteca si es necesario (60-70% para no residentes)
5. Firma del contrato privado de compraventa
6. Pago de impuestos (ITP 8-11% o IVA 10% + AJD 1.5%)
7. Firma de escritura pública ante notario
8. Inscripción en el Registro de la Propiedad`,
    metadata: {
      confidence: 0.9,
    },
  },
  
  // Comparison queries
  {
    id: 'snippet-comparison-zonas',
    type: 'table',
    query: '¿Diferencia entre Son Vida y Port d\'Andratx?',
    answer: '<table><thead><tr><th>Característica</th><th>Son Vida</th><th>Port d\'Andratx</th></tr></thead><tbody><tr><td>Precio medio</td><td>3-8M €</td><td>4-15M €</td></tr><tr><td>Distancia Palma</td><td>5 min</td><td>25 min</td></tr><tr><td>Tipo</td><td>Urbano exclusivo</td><td>Costa exclusiva</td></tr><tr><td>Servicios</td><td>Golf, colegios</td><td>Puerto deportivo</td></tr><tr><td>Revalorización</td><td>5-8% anual</td><td>4-7% anual</td></tr></tbody></table>',
    metadata: {
      hasSchema: true,
      confidence: 0.95,
    },
  },
  
  // Definition queries
  {
    id: 'snippet-definition-nie',
    type: 'paragraph',
    query: '¿Qué es el NIE en España?',
    answer: 'El NIE (Número de Identificación de Extranjero) es un número fiscal obligatorio para cualquier extranjero que realice transacciones económicas en España, incluyendo compras de propiedades. Se solicita en el consulado español o en España y tarda 2-4 semanas en obtenerse.',
    metadata: {
      wordCount: 48,
      confidence: 0.9,
    },
  },
  
  // Tax queries
  {
    id: 'snippet-impuestos-compra',
    type: 'list',
    query: '¿Qué impuestos hay que pagar al comprar en Mallorca?',
    answer: `Los principales impuestos al comprar en Mallorca son:

1. ITP (Impuesto de Transmisiones Patrimoniales): 8-11% para segunda mano
2. IVA: 10% + AJD 1.5% para obra nueva
3. Notaría y registro: aproximadamente 1-2% del precio
4. Gestoría y abogados: 0.5-1% del precio

Total aproximado: 10-12% adicional al precio de compra`,
    metadata: {
      confidence: 0.95,
    },
  },
];

/**
 * Generate HTML with snippet optimization
 */
export function generateSnippetHTML(snippet: FeaturedSnippet): string {
  const baseAttrs = `
    data-snippet-type="${snippet.type}"
    data-snippet-id="${snippet.id}"
    itemscope
    itemtype="https://schema.org/Question"
  `.trim();
  
  switch (snippet.type) {
    case 'paragraph':
      return `
<div class="featured-snippet" ${baseAttrs}>
  <h2 itemprop="name">${snippet.query}</h2>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <p itemprop="text">${snippet.answer}</p>
    ${snippet.details ? `<p class="details">${snippet.details}</p>` : ''}
  </div>
</div>
      `.trim();
    
    case 'list':
      return `
<div class="featured-snippet" ${baseAttrs}>
  <h2 itemprop="name">${snippet.query}</h2>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <div itemprop="text">
      ${snippet.answer.split('\n').filter(line => line.match(/^\d+\./))
        .map(line => `<div>${line}</div>`)
        .join('\n')}
    </div>
  </div>
</div>
      `.trim();
    
    case 'table':
      return `
<div class="featured-snippet" ${baseAttrs}>
  <h2 itemprop="name">${snippet.query}</h2>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <div itemprop="text">
      ${snippet.answer}
    </div>
  </div>
</div>
      `.trim();
    
    default:
      return snippet.answer;
  }
}

/**
 * Validate snippet quality
 */
export function validateSnippetQuality(snippet: FeaturedSnippet): {
  isValid: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Check query format
  if (!snippet.query.includes('?') && !snippet.query.match(/^(Cómo|Qué|Cuándo|Dónde|Por qué|Cuál)/i)) {
    issues.push('Query should be in question format');
    score -= 20;
  }
  
  // Type-specific validation
  switch (snippet.type) {
    case 'paragraph':
      const wordCount = snippet.answer.split(/\s+/).length;
      if (wordCount < 40 || wordCount > 60) {
        issues.push(`Paragraph length not optimal (${wordCount} words, ideal: 40-60)`);
        score -= 15;
      }
      break;
    
    case 'list':
      const items = snippet.answer.split('\n').filter(line => line.match(/^\d+\./));
      if (items.length < 3 || items.length > 8) {
        issues.push(`List length not optimal (${items.length} items, ideal: 3-8)`);
        score -= 15;
      }
      break;
    
    case 'table':
      if (!snippet.answer.includes('<table>')) {
        issues.push('Table snippet must contain HTML table');
        score -= 30;
      }
      break;
  }
  
  // Check answer clarity
  if (snippet.answer.includes('probablemente') || snippet.answer.includes('quizás')) {
    recommendations.push('Remove hedging language for clearer answers');
    score -= 10;
  }
  
  // Check specificity
  if (!/\d+/.test(snippet.answer)) {
    recommendations.push('Add specific numbers/data to increase credibility');
    score -= 5;
  }
  
  return {
    isValid: score >= 70,
    score,
    issues,
    recommendations,
  };
}

/**
 * Generate schema for featured snippet
 */
export function generateSnippetSchema(snippet: FeaturedSnippet): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: {
      '@type': 'Question',
      name: snippet.query,
      acceptedAnswer: {
        '@type': 'Answer',
        text: snippet.answer,
      },
    },
  };
}

/**
 * Optimize content for specific query
 */
export function optimizeForQuery(query: {
  question: string;
  type: SnippetType;
  context: string;
}): {
  optimizedContent: string;
  snippet: FeaturedSnippet;
  improvements: string[];
} {
  const improvements: string[] = [];
  let snippet: FeaturedSnippet;
  
  switch (query.type) {
    case 'paragraph':
      snippet = generateParagraphSnippet({
        question: query.question,
        answer: query.context.substring(0, 300),
      });
      improvements.push('Extracted concise paragraph answer');
      break;
    
    case 'list':
      const items = extractListItems(query.context);
      snippet = generateListSnippet({
        question: query.question,
        items,
      });
      improvements.push(`Created list with ${items.length} items`);
      break;
    
    case 'table':
      improvements.push('Table format requires manual creation');
      snippet = {
        id: generateSnippetId(),
        type: 'table',
        query: query.question,
        answer: 'Table content needs to be structured',
      };
      break;
    
    default:
      snippet = generateParagraphSnippet({
        question: query.question,
        answer: query.context,
      });
  }
  
  return {
    optimizedContent: snippet.answer,
    snippet,
    improvements,
  };
}

/**
 * Extract list items from text
 */
function extractListItems(text: string): string[] {
  // Try numbered lists
  let items = text.match(/\d+\.\s*([^\n]+)/g);
  if (items && items.length >= 3) {
    return items.map(item => item.replace(/^\d+\.\s*/, '').trim());
  }
  
  // Try bulleted lists
  items = text.match(/[-*]\s*([^\n]+)/g);
  if (items && items.length >= 3) {
    return items.map(item => item.replace(/^[-*]\s*/, '').trim());
  }
  
  // Try sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences.slice(0, 8).map(s => s.trim());
}

/**
 * Best practices for featured snippets
 */
export const SNIPPET_BEST_PRACTICES = {
  paragraph: {
    wordCount: '40-60 words',
    startWith: 'Direct answer',
    include: 'Specific numbers/data',
    avoid: 'Hedging language',
  },
  
  list: {
    items: '3-8 items',
    format: 'Numbered or bulleted',
    itemLength: '10-20 words per item',
    order: 'Logical sequence',
  },
  
  table: {
    rows: '3-10 rows',
    columns: '2-4 columns',
    headers: 'Clear column headers',
    data: 'Concise cell content',
  },
  
  general: {
    structure: 'Use semantic HTML',
    schema: 'Add FAQ schema',
    format: 'Clean, scannable layout',
    update: 'Keep content fresh',
  },
};

/**
 * Export default
 */
const featuredSnippets = {
  generateParagraphSnippet,
  generateListSnippet,
  generateTableSnippet,
  generateSnippetHTML,
  validateSnippetQuality,
  generateSnippetSchema,
  optimizeForQuery,
  REAL_ESTATE_SNIPPETS,
  SNIPPET_OPTIMAL_LENGTHS,
  QUESTION_PATTERNS,
  SNIPPET_BEST_PRACTICES,
};

export default featuredSnippets;
