/**
 * Blog System Architecture
 * Anclora Private Estates
 * 
 * Complete blog post management system
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
    caption?: string;
  };
  author: Author;
  categories: Category[];
  tags: Tag[];
  publishedAt: Date;
  updatedAt: Date;
  readingTime: number; // minutes
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  relatedPosts?: string[]; // Post IDs
  status: 'draft' | 'published' | 'archived';
  views?: number;
  featured?: boolean;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  role: string;
  email?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  seoTitle?: string;
  seoDescription?: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

// ==============================================
// BLOG CATEGORIES
// ==============================================

export const blogCategories: Category[] = [
  {
    id: 'guias-compra',
    name: 'Guías de Compra',
    slug: 'guias-compra',
    description: 'Guías completas para comprar propiedad en Mallorca',
    icon: '📖',
    color: '#C5A059',
    seoTitle: 'Guías para Comprar Propiedad en Mallorca',
    seoDescription: 'Guías paso a paso para comprar tu propiedad de lujo en Mallorca. Consejos de expertos, proceso legal, financiación.',
  },
  {
    id: 'mercado-inmobiliario',
    name: 'Mercado Inmobiliario',
    slug: 'mercado-inmobiliario',
    description: 'Análisis del mercado inmobiliario de lujo en Mallorca',
    icon: '📊',
    color: '#1F2937',
    seoTitle: 'Análisis del Mercado Inmobiliario de Mallorca',
    seoDescription: 'Tendencias, precios y análisis del mercado inmobiliario de lujo en Mallorca. Datos actualizados y perspectivas de expertos.',
  },
  {
    id: 'ubicaciones',
    name: 'Ubicaciones',
    slug: 'ubicaciones',
    description: 'Guías detalladas de las mejores zonas de Mallorca',
    icon: '📍',
    color: '#059669',
    seoTitle: 'Guías de Ubicaciones en Mallorca',
    seoDescription: 'Descubre las mejores zonas para vivir en Mallorca. Guías completas de Son Vida, Port d\'Andratx, Palma y más.',
  },
  {
    id: 'inversion',
    name: 'Inversión Inmobiliaria',
    slug: 'inversion',
    description: 'Estrategias y consejos de inversión inmobiliaria',
    icon: '💰',
    color: '#DC2626',
    seoTitle: 'Inversión Inmobiliaria en Mallorca',
    seoDescription: 'Guías de inversión inmobiliaria en Mallorca. ROI, fiscalidad, estrategias de rentabilidad y gestión de patrimonio.',
  },
  {
    id: 'estilo-vida',
    name: 'Estilo de Vida',
    slug: 'estilo-vida',
    description: 'Vida en Mallorca: cultura, gastronomía, actividades',
    icon: '🌴',
    color: '#2563EB',
    seoTitle: 'Estilo de Vida en Mallorca',
    seoDescription: 'Descubre el estilo de vida mediterráneo en Mallorca. Gastronomía, cultura, deportes y experiencias únicas.',
  },
  {
    id: 'legal-fiscal',
    name: 'Legal y Fiscal',
    slug: 'legal-fiscal',
    description: 'Aspectos legales y fiscales de comprar en Mallorca',
    icon: '⚖️',
    color: '#7C3AED',
    seoTitle: 'Aspectos Legales y Fiscales en Mallorca',
    seoDescription: 'Guía legal y fiscal para comprar propiedad en Mallorca. Impuestos, notario, registro, residencia y visado.',
  },
  {
    id: 'reformas-diseno',
    name: 'Reformas y Diseño',
    slug: 'reformas-diseno',
    description: 'Inspiración y consejos para reformas y diseño interior',
    icon: '🏗️',
    color: '#EA580C',
    seoTitle: 'Reformas y Diseño de Interiores',
    seoDescription: 'Ideas y consejos para reformar y diseñar tu propiedad en Mallorca. Tendencias, materiales y profesionales.',
  },
  {
    id: 'sostenibilidad',
    name: 'Sostenibilidad',
    slug: 'sostenibilidad',
    description: 'Construcción sostenible y eficiencia energética',
    icon: '🌱',
    color: '#10B981',
    seoTitle: 'Propiedades Sostenibles en Mallorca',
    seoDescription: 'Guía de sostenibilidad inmobiliaria. Certificaciones energéticas, renovables, construcción eco-friendly.',
  },
];

// ==============================================
// BLOG POST TYPES
// ==============================================

export type BlogPostType = 
  | 'guide'           // Guía paso a paso
  | 'howto'          // Tutorial práctico
  | 'market-analysis' // Análisis de mercado
  | 'location-guide'  // Guía de ubicación
  | 'news'           // Noticias del sector
  | 'interview'      // Entrevista
  | 'case-study'     // Caso de éxito
  | 'checklist'      // Checklist/Lista
  | 'comparison';    // Comparativa

export interface BlogPostTemplate {
  type: BlogPostType;
  name: string;
  description: string;
  structure: string[];
  estimatedReadingTime: number;
  seoOptimization: string[];
}

export const blogPostTemplates: Record<BlogPostType, BlogPostTemplate> = {
  guide: {
    type: 'guide',
    name: 'Guía Completa',
    description: 'Guía exhaustiva sobre un tema específico',
    structure: [
      'Introducción y contexto',
      'Por qué es importante',
      'Pasos detallados (numerados)',
      'Consejos de expertos',
      'Errores comunes a evitar',
      'Recursos adicionales',
      'FAQ',
      'Conclusión y próximos pasos',
    ],
    estimatedReadingTime: 15,
    seoOptimization: [
      'Use HowTo schema',
      'Include step-by-step instructions',
      'Add FAQ schema',
      'Use numbered lists',
      'Include internal links to related services',
    ],
  },
  
  howto: {
    type: 'howto',
    name: 'Tutorial Práctico',
    description: 'Tutorial paso a paso para realizar una acción específica',
    structure: [
      'Introducción breve',
      'Requisitos previos',
      'Paso 1: [Acción]',
      'Paso 2: [Acción]',
      'Paso 3: [Acción]',
      '(Más pasos según necesidad)',
      'Consejos adicionales',
      'Conclusión',
    ],
    estimatedReadingTime: 8,
    seoOptimization: [
      'Use HowTo schema',
      'Include images/screenshots per step',
      'Clear action verbs',
      'Time estimates per step',
    ],
  },
  
  'market-analysis': {
    type: 'market-analysis',
    name: 'Análisis de Mercado',
    description: 'Análisis detallado del mercado inmobiliario',
    structure: [
      'Resumen ejecutivo',
      'Tendencias actuales',
      'Análisis de precios',
      'Oferta y demanda',
      'Zonas destacadas',
      'Proyecciones futuras',
      'Recomendaciones',
      'Fuentes y metodología',
    ],
    estimatedReadingTime: 12,
    seoOptimization: [
      'Include statistics and data',
      'Use charts/graphs',
      'Link to property listings',
      'Update regularly',
      'Add date to title',
    ],
  },
  
  'location-guide': {
    type: 'location-guide',
    name: 'Guía de Ubicación',
    description: 'Guía completa de una zona específica',
    structure: [
      'Overview de la zona',
      'Historia y carácter',
      'Mercado inmobiliario',
      'Estilo de vida',
      'Servicios y amenidades',
      'Transporte y accesibilidad',
      'Pros y contras',
      'Propiedades destacadas',
      'Conclusión',
    ],
    estimatedReadingTime: 10,
    seoOptimization: [
      'Use Place schema',
      'Include map/coordinates',
      'Link to properties in area',
      'Add local business schema',
      'Include photos',
    ],
  },
  
  news: {
    type: 'news',
    name: 'Noticia',
    description: 'Noticia o actualización del sector',
    structure: [
      'Lead (5W1H)',
      'Contexto',
      'Desarrollo de la noticia',
      'Impacto y consecuencias',
      'Opiniones de expertos',
      'Conclusión',
    ],
    estimatedReadingTime: 5,
    seoOptimization: [
      'Use NewsArticle schema',
      'Include publication date prominently',
      'Link to sources',
      'Keep updated',
      'Add related news',
    ],
  },
  
  interview: {
    type: 'interview',
    name: 'Entrevista',
    description: 'Entrevista con experto o cliente',
    structure: [
      'Introducción del entrevistado',
      'Contexto de la entrevista',
      'Pregunta 1 y respuesta',
      'Pregunta 2 y respuesta',
      '(Más Q&A)',
      'Conclusión y agradecimientos',
      'Sobre el entrevistado',
    ],
    estimatedReadingTime: 10,
    seoOptimization: [
      'Use Person schema',
      'Format as Q&A',
      'Include author bio',
      'Add pull quotes',
      'Include related content',
    ],
  },
  
  'case-study': {
    type: 'case-study',
    name: 'Caso de Éxito',
    description: 'Caso de éxito de cliente',
    structure: [
      'Overview del cliente',
      'Desafío/Necesidad',
      'Solución propuesta',
      'Proceso de implementación',
      'Resultados obtenidos',
      'Testimonial',
      'Lecciones aprendidas',
      'Call to action',
    ],
    estimatedReadingTime: 8,
    seoOptimization: [
      'Use Review schema',
      'Include before/after',
      'Add testimonial quote',
      'Link to similar properties',
      'Include CTA',
    ],
  },
  
  checklist: {
    type: 'checklist',
    name: 'Checklist',
    description: 'Lista de verificación o checklist',
    structure: [
      'Introducción y contexto',
      'Por qué necesitas esta checklist',
      'Checklist (items con checkbox)',
      'Consejos para cada item',
      'Conclusión',
      'Descarga PDF (opcional)',
    ],
    estimatedReadingTime: 6,
    seoOptimization: [
      'Use ItemList schema',
      'Make items actionable',
      'Include printable version',
      'Add visual checkboxes',
      'Include download CTA',
    ],
  },
  
  comparison: {
    type: 'comparison',
    name: 'Comparativa',
    description: 'Comparación entre opciones',
    structure: [
      'Introducción',
      'Criterios de comparación',
      'Opción A: Descripción y análisis',
      'Opción B: Descripción y análisis',
      '(Más opciones si aplica)',
      'Tabla comparativa',
      'Veredicto',
      'Recomendaciones',
    ],
    estimatedReadingTime: 10,
    seoOptimization: [
      'Use comparison table',
      'Include pros/cons',
      'Add summary box',
      'Link to related content',
      'Include CTA per option',
    ],
  },
};

// ==============================================
// CONTENT HELPERS
// ==============================================

/**
 * Calculate reading time
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate blog post excerpt
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Cut at last complete word
  const excerpt = text.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');
  
  return lastSpace > 0 ? excerpt.substring(0, lastSpace) + '...' : excerpt + '...';
}

/**
 * Generate blog post slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return blogCategories.find(cat => cat.slug === slug);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(
  posts: BlogPost[],
  categorySlug: string
): BlogPost[] {
  return posts.filter(post =>
    post.categories.some(cat => cat.slug === categorySlug)
  );
}

/**
 * Get posts by tag
 */
export function getPostsByTag(
  posts: BlogPost[],
  tagSlug: string
): BlogPost[] {
  return posts.filter(post =>
    post.tags.some(tag => tag.slug === tagSlug)
  );
}

/**
 * Get posts by author
 */
export function getPostsByAuthor(
  posts: BlogPost[],
  authorSlug: string
): BlogPost[] {
  return posts.filter(post => post.author.slug === authorSlug);
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured === true);
}

/**
 * Get recent posts
 */
export function getRecentPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return posts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

/**
 * Get popular posts (by views)
 */
export function getPopularPosts(
  posts: BlogPost[],
  limit: number = 5
): BlogPost[] {
  return posts
    .filter(post => post.status === 'published' && post.views)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}
