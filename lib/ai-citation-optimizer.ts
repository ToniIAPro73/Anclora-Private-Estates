/**
 * AI Citation Optimizer
 * Optimiza contenido para ser citado por ChatGPT, Claude, Perplexity, etc.
 * 
 * @module ai-citation-optimizer
 */

/**
 * Citation-worthy content types
 */
export type CitableContentType =
  | 'statistic'
  | 'definition'
  | 'fact'
  | 'quote'
  | 'process'
  | 'comparison'
  | 'list';

/**
 * Citation-optimized content block
 */
export interface CitableContent {
  id: string;
  type: CitableContentType;
  content: string;
  source: string;
  url: string;
  confidence: 'high' | 'medium' | 'low';
  lastVerified: Date;
  attributes?: Record<string, string>;
}

/**
 * Citation format for different AI engines
 */
export interface CitationFormat {
  engine: 'chatgpt' | 'claude' | 'perplexity' | 'google-sge';
  format: string;
  example: string;
}

/**
 * Recommended citation formats for major AI engines
 */
export const CITATION_FORMATS: CitationFormat[] = [
  {
    engine: 'chatgpt',
    format: '[Source: {source}]({url})',
    example: '[Source: Anclora Private Estates](https://anclora.com/blog/guia-compra)',
  },
  {
    engine: 'claude',
    format: '{content} (Source: {source} - {url})',
    example: 'El precio medio es 2M € (Source: Anclora - https://anclora.com)',
  },
  {
    engine: 'perplexity',
    format: '{content}^[1] where [1]: {url}',
    example: 'Son Vida es la zona más exclusiva^[1] where [1]: https://anclora.com',
  },
  {
    engine: 'google-sge',
    format: '{content} - {source}',
    example: 'El ITP es 8-11% del precio - Anclora Private Estates',
  },
];

/**
 * Optimize content block for citations
 */
export function optimizeForCitation(content: {
  text: string;
  type: CitableContentType;
  context?: string;
}): CitableContent {
  const optimized: CitableContent = {
    id: generateCitationId(),
    type: content.type,
    content: content.text,
    source: 'Anclora Private Estates',
    url: 'https://anclora.com',
    confidence: 'high',
    lastVerified: new Date(),
  };
  
  // Add type-specific optimizations
  switch (content.type) {
    case 'statistic':
      optimized.content = ensureNumbersAreClear(content.text);
      optimized.attributes = {
        'data-type': 'statistic',
        'data-verifiable': 'true',
      };
      break;
    
    case 'definition':
      optimized.content = formatAsDefinition(content.text);
      optimized.attributes = {
        'data-type': 'definition',
        'data-term': extractTerm(content.text),
      };
      break;
    
    case 'fact':
      optimized.content = ensureFactIsClear(content.text);
      optimized.attributes = {
        'data-type': 'fact',
        'data-verifiable': 'true',
      };
      break;
    
    case 'quote':
      optimized.content = `"${content.text}"`;
      optimized.attributes = {
        'data-type': 'quote',
      };
      break;
    
    case 'process':
      optimized.content = formatAsProcess(content.text);
      optimized.attributes = {
        'data-type': 'process',
        'data-steps': countSteps(content.text).toString(),
      };
      break;
    
    case 'comparison':
      optimized.content = formatAsComparison(content.text);
      optimized.attributes = {
        'data-type': 'comparison',
      };
      break;
    
    case 'list':
      optimized.content = formatAsList(content.text);
      optimized.attributes = {
        'data-type': 'list',
        'data-items': countListItems(content.text).toString(),
      };
      break;
  }
  
  return optimized;
}

/**
 * Generate unique citation ID
 */
function generateCitationId(): string {
  return `cite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Ensure numbers are clearly formatted
 */
function ensureNumbersAreClear(text: string): string {
  // Format large numbers with separators
  return text.replace(/\b(\d{4,})\b/g, (match) => {
    return parseInt(match).toLocaleString('es-ES');
  });
}

/**
 * Format text as a clear definition
 */
function formatAsDefinition(text: string): string {
  // Ensure definition format: "Term: Definition"
  if (!text.includes(':')) {
    const words = text.split(' ');
    if (words.length > 3) {
      return `${words[0]}: ${words.slice(1).join(' ')}`;
    }
  }
  return text;
}

/**
 * Extract term from definition
 */
function extractTerm(text: string): string {
  const match = text.match(/^([^:]+):/);
  return match ? match[1].trim() : text.split(' ')[0];
}

/**
 * Ensure fact is clearly stated
 */
function ensureFactIsClear(text: string): string {
  // Remove hedging language for clarity
  let clear = text
    .replace(/parece que|probablemente|quizás|tal vez/gi, '')
    .trim();
  
  // Ensure it starts with a capital letter
  clear = clear.charAt(0).toUpperCase() + clear.slice(1);
  
  // Ensure it ends with proper punctuation
  if (!/[.!?]$/.test(clear)) {
    clear += '.';
  }
  
  return clear;
}

/**
 * Format as numbered process
 */
function formatAsProcess(text: string): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  if (sentences.length > 1) {
    return sentences
      .map((s, i) => `${i + 1}. ${s.trim()}`)
      .join('. ') + '.';
  }
  
  return text;
}

/**
 * Count steps in process
 */
function countSteps(text: string): number {
  const matches = text.match(/\d+\./g);
  return matches ? matches.length : text.split(/[.!?]+/).filter(s => s.trim()).length;
}

/**
 * Format as comparison
 */
function formatAsComparison(text: string): string {
  // Enhance comparison keywords
  return text
    .replace(/vs\.?|versus/gi, 'versus')
    .replace(/pero/gi, 'mientras que');
}

/**
 * Format as clear list
 */
function formatAsList(text: string): string {
  const items = text.split(/[,;]/).map(s => s.trim()).filter(s => s);
  
  if (items.length > 1) {
    return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
  }
  
  return text;
}

/**
 * Count list items
 */
function countListItems(text: string): number {
  const numbered = text.match(/\d+\./g);
  if (numbered) return numbered.length;
  
  const bulleted = text.match(/^[-*]\s/gm);
  if (bulleted) return bulleted.length;
  
  return text.split(/[,;]/).filter(s => s.trim()).length;
}

/**
 * Generate citation markup for HTML
 */
export function generateCitationMarkup(content: CitableContent): string {
  const attrs = Object.entries(content.attributes || {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  return `
<div class="citable-content" 
     id="${content.id}" 
     ${attrs}
     data-source="${content.source}"
     data-url="${content.url}"
     data-confidence="${content.confidence}"
     data-last-verified="${content.lastVerified.toISOString()}">
  ${content.content}
  <cite class="source-attribution">
    <a href="${content.url}" rel="nofollow">Fuente: ${content.source}</a>
  </cite>
</div>
  `.trim();
}

/**
 * Generate citation metadata
 */
export function generateCitationMetadata(content: CitableContent): Record<string, string> {
  return {
    'citation:title': content.content.substring(0, 100),
    'citation:url': content.url,
    'citation:source': content.source,
    'citation:type': content.type,
    'citation:confidence': content.confidence,
    'citation:verified': content.lastVerified.toISOString(),
  };
}

/**
 * Create citation-ready summary
 */
export function createCitationReadySummary(content: {
  title: string;
  mainPoints: string[];
  statistics: Array<{ label: string; value: string }>;
  source: string;
  url: string;
}): string {
  const summary = `
# ${content.title}

## Puntos Clave:
${content.mainPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

## Datos Clave:
${content.statistics.map(stat => `- **${stat.label}**: ${stat.value}`).join('\n')}

---
*Fuente: ${content.source}*  
*Más información: ${content.url}*
  `.trim();
  
  return summary;
}

/**
 * Optimize page structure for citations
 */
export function optimizePageForCitations(page: {
  title: string;
  content: string;
  keyFacts: string[];
  statistics: Array<{ label: string; value: string }>;
}): {
  optimizedHTML: string;
  citableBlocks: CitableContent[];
  metadata: Record<string, string>;
} {
  const citableBlocks: CitableContent[] = [];
  
  // Create citable blocks for key facts
  page.keyFacts.forEach((fact) => {
    citableBlocks.push(
      optimizeForCitation({
        text: fact,
        type: 'fact',
      })
    );
  });
  
  // Create citable blocks for statistics
  page.statistics.forEach(stat => {
    citableBlocks.push(
      optimizeForCitation({
        text: `${stat.label}: ${stat.value}`,
        type: 'statistic',
      })
    );
  });
  
  // Generate HTML with citation markup
  const optimizedHTML = `
<article class="citation-optimized">
  <h1>${page.title}</h1>
  
  <section class="key-facts" data-citation-section="true">
    <h2>Datos Clave</h2>
    ${citableBlocks
      .filter(b => b.type === 'fact')
      .map(b => generateCitationMarkup(b))
      .join('\n')}
  </section>
  
  <section class="statistics" data-citation-section="true">
    <h2>Estadísticas</h2>
    ${citableBlocks
      .filter(b => b.type === 'statistic')
      .map(b => generateCitationMarkup(b))
      .join('\n')}
  </section>
  
  <div class="content">
    ${page.content}
  </div>
</article>
  `.trim();
  
  // Generate metadata
  const metadata = {
    'citation:count': citableBlocks.length.toString(),
    'citation:ready': 'true',
    'citation:types': [...new Set(citableBlocks.map(b => b.type))].join(', '),
  };
  
  return {
    optimizedHTML,
    citableBlocks,
    metadata,
  };
}

/**
 * Validate content for citation quality
 */
export function validateCitationQuality(content: CitableContent): {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // Check content length
  if (content.content.length < 20) {
    issues.push('Content too short for effective citation');
    score -= 20;
  } else if (content.content.length > 300) {
    suggestions.push('Consider breaking into multiple citable blocks');
    score -= 5;
  }
  
  // Check clarity
  if (content.content.includes('probablemente') || content.content.includes('quizás')) {
    issues.push('Contains hedging language - reduce uncertainty');
    score -= 15;
  }
  
  // Check type-specific requirements
  switch (content.type) {
    case 'statistic':
      if (!/\d+/.test(content.content)) {
        issues.push('Statistic should contain numbers');
        score -= 25;
      }
      break;
    
    case 'definition':
      if (!content.content.includes(':')) {
        suggestions.push('Definition should use "Term: Definition" format');
        score -= 10;
      }
      break;
    
    case 'fact':
      if (!/[.!?]$/.test(content.content)) {
        issues.push('Fact should end with punctuation');
        score -= 10;
      }
      break;
  }
  
  // Check source and URL
  if (!content.url || !content.url.startsWith('http')) {
    issues.push('Invalid or missing URL');
    score -= 20;
  }
  
  if (!content.source || content.source.length < 3) {
    issues.push('Missing or invalid source name');
    score -= 15;
  }
  
  return {
    isValid: score >= 70,
    score,
    issues,
    suggestions,
  };
}

/**
 * Generate attribution text for AI engines
 */
export function generateAttribution(
  content: CitableContent,
  format: 'full' | 'short' | 'inline' = 'short'
): string {
  switch (format) {
    case 'full':
      return `Según ${content.source}, ${content.content}. Más información disponible en: ${content.url} (Verificado: ${content.lastVerified.toLocaleDateString('es-ES')})`;
    
    case 'short':
      return `${content.content} (Fuente: ${content.source})`;
    
    case 'inline':
      return `${content.content} [${content.source}]`;
    
    default:
      return content.content;
  }
}

/**
 * Create citation-optimized FAQ
 */
export function createCitableFAQ(faq: {
  question: string;
  answer: string;
}): CitableContent {
  return optimizeForCitation({
    text: `${faq.question} ${faq.answer}`,
    type: 'fact',
    context: 'faq',
  });
}

/**
 * Best practices for citation optimization
 */
export const CITATION_BEST_PRACTICES = {
  content: {
    beSpecific: true,
    useClearLanguage: true,
    avoidHedging: true,
    includeNumbers: true,
    provideContext: true,
  },
  
  format: {
    useStructuredData: true,
    addCitationMarkers: true,
    includeTimestamps: true,
    provideSourceLinks: true,
  },
  
  metadata: {
    includeAuthor: true,
    includeDate: true,
    includeSource: true,
    specifyType: true,
  },
  
  quality: {
    verifyFacts: true,
    updateRegularly: true,
    maintainConsistency: true,
    trackPerformance: true,
  },
};

/**
 * Export default
 */
const aiCitationOptimizer = {
  optimizeForCitation,
  generateCitationMarkup,
  generateCitationMetadata,
  createCitationReadySummary,
  optimizePageForCitations,
  validateCitationQuality,
  generateAttribution,
  createCitableFAQ,
  CITATION_FORMATS,
  CITATION_BEST_PRACTICES,
};

export default aiCitationOptimizer;
