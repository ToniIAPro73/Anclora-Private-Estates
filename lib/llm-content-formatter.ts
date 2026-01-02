/**
 * LLM Content Formatter
 * Optimiza contenido para consumo por Large Language Models
 * 
 * @module llm-content-formatter
 */

/**
 * Content format types optimized for LLMs
 */
export type LLMContentFormat = 
  | 'structured-markdown'
  | 'semantic-html'
  | 'json-ld'
  | 'plain-text'
  | 'qa-pairs';

/**
 * Structured content block
 */
export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'quote' | 'code' | 'definition';
  level?: number; // For headings: 1-6
  content: string;
  metadata?: {
    importance?: 'critical' | 'high' | 'medium' | 'low';
    topic?: string;
    entities?: string[];
    keywords?: string[];
  };
}

/**
 * Entity extraction result
 */
export interface ExtractedEntity {
  text: string;
  type: 'location' | 'price' | 'date' | 'person' | 'organization' | 'property' | 'feature';
  value?: string | number | Date;
  confidence: number;
}

/**
 * Format content for optimal LLM understanding
 */
export function formatForLLM(
  content: string,
  format: LLMContentFormat = 'structured-markdown'
): string {
  switch (format) {
    case 'structured-markdown':
      return formatAsStructuredMarkdown(content);
    case 'semantic-html':
      return formatAsSemanticHTML(content);
    case 'json-ld':
      return formatAsJSONLD(content);
    case 'plain-text':
      return formatAsPlainText(content);
    case 'qa-pairs':
      return formatAsQAPairs(content);
    default:
      return content;
  }
}

/**
 * Format as structured markdown with clear hierarchy
 */
function formatAsStructuredMarkdown(content: string): string {
  const blocks = parseContentBlocks(content);
  
  return blocks
    .map(block => {
      switch (block.type) {
        case 'heading':
          return '#'.repeat(block.level || 2) + ' ' + block.content;
        
        case 'paragraph':
          return block.content;
        
        case 'list':
          return block.content
            .split('\n')
            .map(item => '- ' + item.trim())
            .join('\n');
        
        case 'definition':
          return `**${block.content.split(':')[0]}**: ${block.content.split(':').slice(1).join(':')}`;
        
        case 'quote':
          return `> ${block.content}`;
        
        case 'code':
          return `\`\`\`\n${block.content}\n\`\`\``;
        
        default:
          return block.content;
      }
    })
    .join('\n\n');
}

/**
 * Format as semantic HTML with clear structure
 */
function formatAsSemanticHTML(content: string): string {
  const blocks = parseContentBlocks(content);
  
  return blocks
    .map(block => {
      const importance = block.metadata?.importance || 'medium';
      const dataAttrs = `data-importance="${importance}" data-type="${block.type}"`;
      
      switch (block.type) {
        case 'heading':
          return `<h${block.level || 2} ${dataAttrs}>${block.content}</h${block.level || 2}>`;
        
        case 'paragraph':
          return `<p ${dataAttrs}>${block.content}</p>`;
        
        case 'list':
          const items = block.content
            .split('\n')
            .map(item => `<li>${item.trim()}</li>`)
            .join('\n');
          return `<ul ${dataAttrs}>\n${items}\n</ul>`;
        
        case 'definition':
          const [term, ...def] = block.content.split(':');
          return `<dl ${dataAttrs}><dt>${term}</dt><dd>${def.join(':')}</dd></dl>`;
        
        case 'quote':
          return `<blockquote ${dataAttrs}>${block.content}</blockquote>`;
        
        case 'table':
          return `<table ${dataAttrs}>${block.content}</table>`;
        
        default:
          return `<div ${dataAttrs}>${block.content}</div>`;
      }
    })
    .join('\n');
}

/**
 * Format as JSON-LD for structured data
 */
function formatAsJSONLD(content: string): string {
  const blocks = parseContentBlocks(content);
  
  const structuredContent = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    articleBody: blocks.map(block => ({
      '@type': getSchemaType(block.type),
      text: block.content,
      ...(block.metadata?.importance && { importance: block.metadata.importance }),
      ...(block.metadata?.keywords && { keywords: block.metadata.keywords }),
    })),
  };
  
  return JSON.stringify(structuredContent, null, 2);
}

/**
 * Format as plain text optimized for LLMs
 */
function formatAsPlainText(content: string): string {
  // Remove HTML tags
  let text = content.replace(/<[^>]+>/g, '');
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Add clear section breaks
  text = text.replace(/\n\n+/g, '\n\n---\n\n');
  
  return text;
}

/**
 * Format as Q&A pairs for conversational AI
 */
function formatAsQAPairs(content: string): string {
  const blocks = parseContentBlocks(content);
  const pairs: string[] = [];
  
  for (let i = 0; i < blocks.length - 1; i++) {
    const current = blocks[i];
    const next = blocks[i + 1];
    
    // If heading followed by paragraph/list, treat as Q&A
    if (current.type === 'heading' && (next.type === 'paragraph' || next.type === 'list')) {
      pairs.push(`Q: ${current.content}\nA: ${next.content}`);
    }
  }
  
  return pairs.join('\n\n');
}

/**
 * Parse content into structured blocks
 */
function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let currentBlock: ContentBlock | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    // Detect heading
    if (line.match(/^#{1,6}\s/)) {
      if (currentBlock) blocks.push(currentBlock);
      const level = (line.match(/^#+/) || [''])[0].length;
      currentBlock = {
        id: `block-${blocks.length}`,
        type: 'heading',
        level,
        content: line.replace(/^#+\s*/, ''),
        metadata: { importance: level <= 2 ? 'high' : 'medium' },
      };
    }
    // Detect list
    else if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
      if (currentBlock?.type !== 'list') {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          id: `block-${blocks.length}`,
          type: 'list',
          content: '',
        };
      }
      currentBlock.content += (currentBlock.content ? '\n' : '') + line.replace(/^[-*]\s|^\d+\.\s/, '');
    }
    // Detect definition
    else if (line.match(/^[A-Z][^:]+:\s/)) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        id: `block-${blocks.length}`,
        type: 'definition',
        content: line,
        metadata: { importance: 'high' },
      };
    }
    // Regular paragraph
    else {
      if (currentBlock?.type !== 'paragraph') {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = {
          id: `block-${blocks.length}`,
          type: 'paragraph',
          content: '',
        };
      }
      currentBlock.content += (currentBlock.content ? ' ' : '') + line;
    }
  }
  
  if (currentBlock) blocks.push(currentBlock);
  
  return blocks;
}

/**
 * Get Schema.org type for content block
 */
function getSchemaType(blockType: ContentBlock['type']): string {
  const typeMap: Record<ContentBlock['type'], string> = {
    heading: 'Heading',
    paragraph: 'Paragraph',
    list: 'ItemList',
    table: 'Table',
    quote: 'Quotation',
    code: 'SoftwareSourceCode',
    definition: 'DefinedTerm',
  };
  
  return typeMap[blockType] || 'Thing';
}

/**
 * Extract entities from content for better LLM understanding
 */
export function extractEntities(content: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];
  
  // Extract prices (€, EUR, millions)
  const priceRegex = /€?\s*(\d+(?:[.,]\d+)?)\s*(millones?|M|mil|K)?\s*(?:€|EUR)?/gi;
  let match;
  while ((match = priceRegex.exec(content)) !== null) {
    entities.push({
      text: match[0],
      type: 'price',
      value: parsePrice(match[1], match[2]),
      confidence: 0.9,
    });
  }
  
  // Extract locations (capitalized words + known locations)
  const knownLocations = [
    'Mallorca', 'Palma', 'Son Vida', 'Port d\'Andratx', 'Puerto Portals',
    'Calvià', 'Santa Ponsa', 'Deià', 'Sóller', 'Pollença', 'Andratx',
  ];
  
  knownLocations.forEach(location => {
    if (content.includes(location)) {
      entities.push({
        text: location,
        type: 'location',
        value: location,
        confidence: 1.0,
      });
    }
  });
  
  // Extract dates
  const dateRegex = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4})\b/g;
  while ((match = dateRegex.exec(content)) !== null) {
    entities.push({
      text: match[0],
      type: 'date',
      confidence: 0.8,
    });
  }
  
  // Extract property features
  const features = [
    'piscina', 'jardín', 'garaje', 'terraza', 'vistas al mar', 'playa',
    'dormitorios', 'baños', 'm²', 'metros cuadrados', 'parcela',
  ];
  
  features.forEach(feature => {
    const regex = new RegExp(`\\b${feature}\\b`, 'gi');
    if (regex.test(content)) {
      entities.push({
        text: feature,
        type: 'feature',
        confidence: 0.85,
      });
    }
  });
  
  return entities;
}

/**
 * Parse price string to number
 */
function parsePrice(amount: string, unit?: string): number {
  const num = parseFloat(amount.replace(',', '.'));
  
  if (!unit) return num;
  
  const unitLower = unit.toLowerCase();
  if (unitLower.includes('millon') || unitLower === 'm') {
    return num * 1000000;
  } else if (unitLower.includes('mil') || unitLower === 'k') {
    return num * 1000;
  }
  
  return num;
}

/**
 * Add semantic markers to content for LLM consumption
 */
export function addSemanticMarkers(content: string): string {
  let marked = content;
  
  // Mark important facts
  marked = marked.replace(
    /(\d+(?:[.,]\d+)?)\s*(millones?|mil|K)?\s*(?:€|EUR)/gi,
    '<span class="semantic-price" data-type="price">$&</span>'
  );
  
  // Mark locations
  const locations = [
    'Mallorca', 'Palma', 'Son Vida', 'Port d\'Andratx',
    'Calvià', 'Santa Ponsa', 'Deià', 'Sóller',
  ];
  
  locations.forEach(location => {
    const regex = new RegExp(`\\b(${location})\\b`, 'gi');
    marked = marked.replace(
      regex,
      '<span class="semantic-location" data-type="location">$1</span>'
    );
  });
  
  // Mark key terms
  const keyTerms = ['villa', 'apartamento', 'finca', 'ático', 'chalet'];
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
    marked = marked.replace(
      regex,
      '<span class="semantic-property-type" data-type="property">$1</span>'
    );
  });
  
  return marked;
}

/**
 * Generate content summary optimized for LLMs
 */
export function generateLLMSummary(content: string, maxLength: number = 200): {
  summary: string;
  keyPoints: string[];
  entities: ExtractedEntity[];
} {
  const blocks = parseContentBlocks(content);
  const entities = extractEntities(content);
  
  // Extract key points (headings + first sentence of each section)
  const keyPoints: string[] = [];
  blocks.forEach(block => {
    if (block.type === 'heading') {
      keyPoints.push(block.content);
    } else if (block.type === 'paragraph' && keyPoints.length < 5) {
      const firstSentence = block.content.split(/[.!?]/)[0] + '.';
      if (firstSentence.length < 150) {
        keyPoints.push(firstSentence);
      }
    }
  });
  
  // Generate summary
  const paragraphs = blocks.filter(b => b.type === 'paragraph');
  const summaryText = paragraphs
    .slice(0, 2)
    .map(b => b.content)
    .join(' ')
    .substring(0, maxLength) + '...';
  
  return {
    summary: summaryText,
    keyPoints: keyPoints.slice(0, 5),
    entities,
  };
}

/**
 * Create conversational context for AI
 */
export function createConversationalContext(content: {
  title: string;
  type: 'property' | 'location' | 'guide' | 'article';
  mainTopics: string[];
  keyFacts: Record<string, string>;
}): string {
  const context = `
Context Type: ${content.type}
Title: ${content.title}

Main Topics:
${content.mainTopics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

Key Facts:
${Object.entries(content.keyFacts)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

This content is about real estate in Mallorca, Spain. When answering questions:
- Focus on accuracy and specific details
- Mention prices in euros (€)
- Reference Mallorca-specific information
- Consider the luxury real estate market context
  `.trim();
  
  return context;
}

/**
 * Optimize content structure for AI comprehension
 */
export function optimizeContentStructure(content: string): {
  original: string;
  optimized: string;
  improvements: string[];
} {
  const improvements: string[] = [];
  let optimized = content;
  
  // Add clear section breaks
  if (!optimized.includes('---') && !optimized.includes('##')) {
    optimized = optimized.replace(/\n\n/g, '\n\n---\n\n');
    improvements.push('Added section breaks');
  }
  
  // Ensure headings are clear
  const blocks = parseContentBlocks(optimized);
  const hasHeadings = blocks.some(b => b.type === 'heading');
  if (!hasHeadings) {
    improvements.push('Consider adding section headings');
  }
  
  // Check for definitions
  const hasDefinitions = blocks.some(b => b.type === 'definition');
  if (!hasDefinitions && content.length > 500) {
    improvements.push('Consider adding key term definitions');
  }
  
  // Add entity markers
  optimized = addSemanticMarkers(optimized);
  improvements.push('Added semantic markers for entities');
  
  return {
    original: content,
    optimized,
    improvements,
  };
}

/**
 * Generate metadata for LLM context window
 */
export function generateLLMMetadata(content: {
  title: string;
  description: string;
  content: string;
  category?: string;
  location?: string;
  priceRange?: { min: number; max: number };
}): Record<string, unknown> {
  const entities = extractEntities(content.content);
  const summary = generateLLMSummary(content.content);
  
  return {
    title: content.title,
    description: content.description,
    category: content.category,
    location: content.location,
    priceRange: content.priceRange,
    contentLength: content.content.length,
    wordCount: content.content.split(/\s+/).length,
    entities: entities.map(e => ({ type: e.type, value: e.value })),
    keyPoints: summary.keyPoints,
    summary: summary.summary,
    language: 'es-ES',
    domain: 'real-estate',
    subDomain: 'luxury-properties',
    region: 'Mallorca, Spain',
  };
}

/**
 * Export default
 */
const llmContentFormatter = {
  formatForLLM,
  extractEntities,
  addSemanticMarkers,
  generateLLMSummary,
  createConversationalContext,
  optimizeContentStructure,
  generateLLMMetadata,
};

export default llmContentFormatter;
