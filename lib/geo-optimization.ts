/**
 * GEO (Generative Engine Optimization) System
 * Optimización para motores generativos: ChatGPT, Claude, Perplexity, Google SGE
 * 
 * @module geo-optimization
 */

/**
 * Supported AI Crawlers and their User-Agents
 */
export const AI_CRAWLERS = {
  // OpenAI
  CHATGPT: 'ChatGPT-User',
  GPT_BOT: 'GPTBot',
  
  // Anthropic
  CLAUDE: 'anthropic-ai',
  CLAUDE_WEB: 'claude-web',
  
  // Perplexity
  PERPLEXITY: 'PerplexityBot',
  
  // Google
  GOOGLE_EXTENDED: 'Google-Extended',
  
  // Meta
  META_AI: 'FacebookBot',
  
  // Generic
  CC_BOT: 'CCBot',
} as const;

/**
 * Configuration for GEO optimization
 */
export interface GEOConfig {
  enableAICrawlers: boolean;
  enableStructuredData: boolean;
  enableCitationMarkers: boolean;
  enableVoiceOptimization: boolean;
  preferredCitationFormat: 'markdown' | 'html' | 'both';
  targetEngines: Array<keyof typeof AI_CRAWLERS>;
}

/**
 * Default GEO configuration
 */
export const DEFAULT_GEO_CONFIG: GEOConfig = {
  enableAICrawlers: true,
  enableStructuredData: true,
  enableCitationMarkers: true,
  enableVoiceOptimization: true,
  preferredCitationFormat: 'both',
  targetEngines: ['CHATGPT', 'CLAUDE', 'PERPLEXITY', 'GOOGLE_EXTENDED'],
};

/**
 * GEO Content Structure
 * Optimized structure for AI understanding
 */
export interface GEOContentStructure {
  mainEntity: string;
  entityType: string;
  keyFacts: string[];
  briefAnswer: string;
  detailedAnswer: string;
  citations: Citation[];
  relatedQuestions: string[];
  lastUpdated: Date;
}

/**
 * Citation format for AI engines
 */
export interface Citation {
  id: string;
  text: string;
  url: string;
  type: 'fact' | 'quote' | 'statistic' | 'definition';
  source?: string;
  date?: Date;
}

/**
 * Content chunk optimized for AI consumption
 */
export interface AIContentChunk {
  id: string;
  type: 'paragraph' | 'list' | 'table' | 'definition' | 'example' | 'faq';
  content: string;
  context?: string;
  importance: 'high' | 'medium' | 'low';
  keywords: string[];
  citeable: boolean;
}

/**
 * Generate robots meta tags for AI crawlers
 */
export function generateAIRobotsMeta(config: Partial<GEOConfig> = {}): string {
  const fullConfig = { ...DEFAULT_GEO_CONFIG, ...config };
  
  if (!fullConfig.enableAICrawlers) {
    return `
<meta name="robots" content="noai, noimageai" />
<meta name="ChatGPT" content="noindex" />
<meta name="GPTBot" content="noindex" />
<meta name="anthropic-ai" content="noindex" />
<meta name="claude-web" content="noindex" />
<meta name="PerplexityBot" content="noindex" />
    `.trim();
  }

  // Allow AI crawlers
  return `
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
<meta name="citation-needed" content="true" />
<meta name="ai-optimized" content="true" />
  `.trim();
}

/**
 * Generate citation markers for content
 * Makes it easy for AI to cite specific claims
 */
export function addCitationMarkers(
  content: string,
  citations: Citation[]
): string {
  let markedContent = content;
  
  citations.forEach((citation, index) => {
    const citationNumber = index + 1;
    
    // Add HTML citation marker
    const marker = `<cite data-citation-id="${citation.id}" data-citation-number="${citationNumber}">[${citationNumber}]</cite>`;
    
    // Add after the cited text
    markedContent = markedContent.replace(
      citation.text,
      `${citation.text}${marker}`
    );
  });
  
  return markedContent;
}

/**
 * Generate citation list at the end of content
 */
export function generateCitationList(citations: Citation[]): string {
  const citationHTML = citations
    .map((citation, index) => {
      const number = index + 1;
      return `
<li id="citation-${citation.id}" data-citation-type="${citation.type}">
  <strong>[${number}]</strong> ${citation.text}
  ${citation.source ? `<br><em>Fuente: ${citation.source}</em>` : ''}
  ${citation.date ? `<br><time datetime="${citation.date.toISOString()}">${citation.date.toLocaleDateString('es-ES')}</time>` : ''}
  <br><a href="${citation.url}" rel="nofollow">Verificar fuente →</a>
</li>
      `.trim();
    })
    .join('\n');

  return `
<section class="citations" aria-label="Referencias y Fuentes">
  <h2>Referencias</h2>
  <ol class="citation-list">
    ${citationHTML}
  </ol>
</section>
  `.trim();
}

/**
 * Structure content for optimal AI understanding
 */
export function structureForAI(content: string): AIContentChunk[] {
  const chunks: AIContentChunk[] = [];
  
  // Split by paragraphs
  const paragraphs = content.split('\n\n');
  
  paragraphs.forEach((para, index) => {
    // Detect type
    let type: AIContentChunk['type'] = 'paragraph';
    let importance: AIContentChunk['importance'] = 'medium';
    
    if (para.startsWith('- ') || para.startsWith('* ') || para.match(/^\d+\./)) {
      type = 'list';
    } else if (para.includes('|')) {
      type = 'table';
    } else if (para.match(/^[A-Z][^.!?]*:/)) {
      type = 'definition';
      importance = 'high';
    } else if (para.toLowerCase().includes('ejemplo') || para.toLowerCase().includes('por ejemplo')) {
      type = 'example';
    } else if (para.match(/^¿.+\?/)) {
      type = 'faq';
      importance = 'high';
    }
    
    // First paragraph is usually most important
    if (index === 0) {
      importance = 'high';
    }
    
    chunks.push({
      id: `chunk-${index}`,
      type,
      content: para,
      importance,
      keywords: extractKeywords(para),
      citeable: true,
    });
  });
  
  return chunks;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction
  // In production, use NLP library
  const words = text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/gi, '')
    .split(/\s+/);
  
  // Filter common words
  const stopWords = ['el', 'la', 'de', 'en', 'y', 'a', 'los', 'las', 'un', 'una', 'es', 'por', 'para', 'con', 'se', 'del', 'que'];
  
  return words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
}

/**
 * Generate context for AI understanding
 */
export function generateAIContext(page: {
  title: string;
  description: string;
  category?: string;
  keywords?: string[];
  location?: string;
}): string {
  const context = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    about: {
      '@type': 'Thing',
      name: page.category || 'Inmobiliaria de Lujo',
      description: 'Información sobre el mercado inmobiliario de lujo en Mallorca',
    },
    keywords: page.keywords?.join(', '),
    inLanguage: 'es-ES',
    spatialCoverage: page.location || 'Mallorca, España',
  };
  
  return JSON.stringify(context, null, 2);
}

/**
 * Optimize content for voice search
 * Answers should be concise and conversational
 */
export function optimizeForVoiceSearch(content: string): {
  original: string;
  voiceOptimized: string;
  answerLength: number;
} {
  // Extract first meaningful sentence
  const sentences = content.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();
  
  // Voice answers should be 20-30 words
  const words = firstSentence?.split(/\s+/) || [];
  const voiceOptimized = words.slice(0, 30).join(' ');
  
  return {
    original: content,
    voiceOptimized: voiceOptimized + (words.length > 30 ? '...' : ''),
    answerLength: words.length,
  };
}

/**
 * Generate meta tags for GEO
 */
export function generateGEOMetaTags(page: {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  lastModified?: Date;
}): Record<string, string> {
  return {
    // Standard SEO
    'description': page.description,
    'keywords': page.keywords?.join(', ') || '',
    
    // Author info for citations
    'author': page.author || 'Anclora Private Estates',
    'article:author': page.author || 'Anclora Private Estates',
    
    // Freshness
    'article:modified_time': page.lastModified?.toISOString() || new Date().toISOString(),
    'lastmod': page.lastModified?.toISOString() || new Date().toISOString(),
    
    // GEO specific
    'ai-optimized': 'true',
    'citation-ready': 'true',
    'voice-search-optimized': 'true',
    
    // Content classification
    'content-type': 'informational',
    'content-purpose': 'educational',
    
    // Geographical
    'geo.region': 'ES-PM',
    'geo.placename': 'Mallorca',
    
    // Language
    'language': 'es',
    'content-language': 'es-ES',
  };
}

/**
 * Generate summary optimized for AI
 */
export function generateAISummary(content: string, maxLength: number = 200): string {
  // Extract key sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let summary = '';
  let wordCount = 0;
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    if (wordCount + words.length <= maxLength) {
      summary += sentence.trim() + '. ';
      wordCount += words.length;
    } else {
      break;
    }
  }
  
  return summary.trim();
}

/**
 * Create content specifically for AI training opt-out
 */
export function generateAIOptOutHeaders(): Record<string, string> {
  return {
    'X-Robots-Tag': 'noai, noimageai',
    'X-AI-Training': 'no',
  };
}

/**
 * Create content specifically for AI training opt-in
 */
export function generateAIOptInHeaders(): Record<string, string> {
  return {
    'X-Robots-Tag': 'all',
    'X-AI-Training': 'yes',
    'X-AI-Citation-Preferred': 'true',
  };
}

/**
 * Validate content for GEO readiness
 */
export function validateGEOReadiness(content: {
  title: string;
  description: string;
  content: string;
  hasSchema: boolean;
  hasCitations: boolean;
  hasStructuredAnswers: boolean;
}): {
  isReady: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  // Check title
  if (content.title.length < 30 || content.title.length > 60) {
    issues.push('Title length not optimal (30-60 chars)');
    score -= 10;
  }
  
  // Check description
  if (content.description.length < 120 || content.description.length > 160) {
    issues.push('Description length not optimal (120-160 chars)');
    score -= 10;
  }
  
  // Check content length
  const wordCount = content.content.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push('Content too short (min 300 words)');
    score -= 20;
  }
  
  // Check schema
  if (!content.hasSchema) {
    issues.push('Missing structured data (Schema.org)');
    recommendations.push('Add FAQPage or Article schema');
    score -= 15;
  }
  
  // Check citations
  if (!content.hasCitations) {
    recommendations.push('Add citations to increase credibility');
    score -= 10;
  }
  
  // Check structured answers
  if (!content.hasStructuredAnswers) {
    recommendations.push('Add FAQ section with direct answers');
    score -= 15;
  }
  
  return {
    isReady: score >= 70,
    score,
    issues,
    recommendations,
  };
}

/**
 * Generate JSON-LD context for AI engines
 */
export function generateJSONLDContext(data: Record<string, unknown>): string {
  return `
<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>
  `.trim();
}

/**
 * Best practices for GEO content
 */
export const GEO_BEST_PRACTICES = {
  title: {
    minLength: 30,
    maxLength: 60,
    shouldIncludeKeyword: true,
    shouldBeQuestionFormat: false, // Unless FAQ
  },
  description: {
    minLength: 120,
    maxLength: 160,
    shouldAnswerQuestion: true,
    shouldIncludeCTA: false,
  },
  content: {
    minWordCount: 300,
    maxWordCount: 2000,
    idealWordCount: 800,
    shouldHaveSections: true,
    shouldHaveFAQ: true,
    shouldHaveCitations: true,
  },
  structure: {
    shouldUseHeadings: true,
    shouldUseLists: true,
    shouldUseTables: false, // Only when necessary
    shouldUseImages: true,
    imagesNeedAltText: true,
  },
  language: {
    shouldBeConversational: true,
    shouldBeDirective: false,
    shouldUseSimpleLanguage: true,
    shouldDefineJargon: true,
  },
  technical: {
    shouldHaveSchema: true,
    shouldHaveOpenGraph: true,
    shouldHaveTwitterCards: true,
    shouldHaveCanonical: true,
    shouldHaveSitemap: true,
  },
};

/**
 * Calculate GEO score for content
 */
export function calculateGEOScore(content: {
  title: string;
  description: string;
  content: string;
  wordCount: number;
  hasHeadings: boolean;
  hasFAQ: boolean;
  hasCitations: boolean;
  hasSchema: boolean;
  hasImages: boolean;
  allImagesHaveAlt: boolean;
}): {
  score: number;
  breakdown: Record<string, number>;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
} {
  const breakdown: Record<string, number> = {};
  
  // Title (15 points)
  breakdown.title = 0;
  if (content.title.length >= 30 && content.title.length <= 60) {
    breakdown.title = 15;
  } else if (content.title.length >= 20 && content.title.length <= 70) {
    breakdown.title = 10;
  } else {
    breakdown.title = 5;
  }
  
  // Description (15 points)
  breakdown.description = 0;
  if (content.description.length >= 120 && content.description.length <= 160) {
    breakdown.description = 15;
  } else if (content.description.length >= 100 && content.description.length <= 180) {
    breakdown.description = 10;
  } else {
    breakdown.description = 5;
  }
  
  // Content length (20 points)
  breakdown.contentLength = 0;
  if (content.wordCount >= 300 && content.wordCount <= 2000) {
    breakdown.contentLength = 20;
  } else if (content.wordCount >= 200 && content.wordCount <= 2500) {
    breakdown.contentLength = 15;
  } else if (content.wordCount >= 100) {
    breakdown.contentLength = 10;
  }
  
  // Structure (15 points)
  breakdown.structure = 0;
  if (content.hasHeadings) breakdown.structure += 15;
  
  // FAQ (15 points)
  breakdown.faq = content.hasFAQ ? 15 : 0;
  
  // Citations (10 points)
  breakdown.citations = content.hasCitations ? 10 : 0;
  
  // Schema (10 points)
  breakdown.schema = content.hasSchema ? 10 : 0;
  
  // Images (10 points)
  breakdown.images = 0;
  if (content.hasImages && content.allImagesHaveAlt) {
    breakdown.images = 10;
  } else if (content.hasImages) {
    breakdown.images = 5;
  }
  
  // Calculate total
  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  // Assign grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return { score, breakdown, grade };
}

/**
 * Export all functions
 */
const geoOptimization = {
  generateAIRobotsMeta,
  addCitationMarkers,
  generateCitationList,
  structureForAI,
  generateAIContext,
  optimizeForVoiceSearch,
  generateGEOMetaTags,
  generateAISummary,
  generateAIOptOutHeaders,
  generateAIOptInHeaders,
  validateGEOReadiness,
  generateJSONLDContext,
  calculateGEOScore,
  AI_CRAWLERS,
  DEFAULT_GEO_CONFIG,
  GEO_BEST_PRACTICES,
};

export default geoOptimization;
