/**
 * FAQ Schema System - Advanced
 * Optimizado para motores generativos y featured snippets
 * 
 * @module faq-schema
 */

import type { WithContext } from 'schema-dts';

/**
 * FAQ Item structure
 */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  keywords?: string[];
  relatedQuestions?: string[];
  lastUpdated?: Date;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * FAQ Category for organization
 */
export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  questions: FAQItem[];
}

/**
 * Common FAQs for Anclora Private Estates
 */
export const COMMON_FAQS: Record<string, FAQItem[]> = {
  compra: [
    {
      id: 'faq-compra-1',
      question: '¿Cuánto cuesta comprar una villa de lujo en Mallorca?',
      answer: 'El precio de una villa de lujo en Mallorca varía significativamente según la ubicación y características. En zonas prime como Son Vida o Port d\'Andratx, los precios oscilan entre 3-15 millones de euros. En otras áreas exclusivas como Calvià o Deià, puedes encontrar propiedades desde 1.5 millones. Los factores que más influyen son: ubicación, vistas al mar, tamaño de la parcela, estado de conservación y calidades.',
      category: 'compra',
      keywords: ['precio', 'villa', 'mallorca', 'lujo', 'coste'],
      importance: 'critical',
    },
    {
      id: 'faq-compra-2',
      question: '¿Cuánto tiempo tarda el proceso de compra en Mallorca?',
      answer: 'El proceso de compra en Mallorca suele durar entre 2-3 meses desde la oferta hasta la escritura. Los pasos incluyen: (1) Reserva con contrato de arras (1-2 semanas), (2) Due diligence y obtención de NIE (2-4 semanas), (3) Firma del contrato privado (1 semana), (4) Firma de escritura ante notario (2-4 semanas). Los compradores extranjeros pueden necesitar tiempo adicional para obtener financiación o NIE.',
      category: 'compra',
      keywords: ['proceso', 'tiempo', 'plazos', 'compra'],
      importance: 'high',
    },
    {
      id: 'faq-compra-3',
      question: '¿Necesito NIE para comprar una propiedad en Mallorca?',
      answer: 'Sí, todos los compradores extranjeros necesitan un NIE (Número de Identificación de Extranjero) para comprar propiedad en España. El NIE es un número fiscal obligatorio para cualquier transacción económica importante. Puedes solicitarlo en el consulado español de tu país o directamente en España. El proceso suele tardar 2-4 semanas. En Anclora te ayudamos con todo el proceso.',
      category: 'compra',
      keywords: ['NIE', 'extranjero', 'documento', 'requisito'],
      importance: 'critical',
    },
  ],
  
  impuestos: [
    {
      id: 'faq-impuestos-1',
      question: '¿Qué impuestos hay que pagar al comprar en Mallorca?',
      answer: 'Los principales impuestos al comprar en Mallorca son: (1) ITP (Impuesto de Transmisiones Patrimoniales): 8-11% para viviendas de segunda mano según el valor, (2) IVA: 10% + AJD 1.5% para obra nueva, (3) Notaría y registro: aproximadamente 1-2% del precio. En una compra de 2 millones €, los gastos totales suelen rondar 180-220.000 €. Es importante presupuestar un 10-12% adicional al precio de compra.',
      category: 'impuestos',
      keywords: ['impuestos', 'ITP', 'IVA', 'costes', 'gastos'],
      importance: 'critical',
    },
    {
      id: 'faq-impuestos-2',
      question: '¿Hay que pagar impuestos anuales por una propiedad en Mallorca?',
      answer: 'Sí, los propietarios pagan varios impuestos anuales: (1) IBI (Impuesto sobre Bienes Inmuebles): 0.4-1.3% del valor catastral anualmente, (2) Plusvalía municipal: solo al vender, (3) IRPF: si alquilas la propiedad, (4) Impuesto de Patrimonio: si tu patrimonio supera 700.000 €. Para una villa de 2M €, el IBI suele rondar 2.000-5.000 € al año.',
      category: 'impuestos',
      keywords: ['IBI', 'impuestos anuales', 'mantenimiento', 'costes'],
      importance: 'high',
    },
  ],
  
  financiacion: [
    {
      id: 'faq-financiacion-1',
      question: '¿Pueden los extranjeros obtener hipoteca en España?',
      answer: 'Sí, los extranjeros pueden obtener hipotecas en España, pero las condiciones son más estrictas. Los bancos españoles suelen financiar hasta el 60-70% del valor de tasación (vs 80% para residentes). Se requiere: (1) NIE, (2) Cuenta bancaria española, (3) Documentación de ingresos (últimos 3 años), (4) Aval o garantías adicionales. Los tipos de interés para no residentes suelen ser 0.5-1% más altos que para residentes.',
      category: 'financiacion',
      keywords: ['hipoteca', 'extranjero', 'financiación', 'banco'],
      importance: 'critical',
    },
    {
      id: 'faq-financiacion-2',
      question: '¿Qué bancos ofrecen las mejores hipotecas en Mallorca?',
      answer: 'Los principales bancos que ofrecen hipotecas competitivas en Mallorca son: Sabadell, BBVA, CaixaBank, Santander y Bankinter. Para extranjeros, Sabadell y BBVA suelen tener las mejores condiciones. Es recomendable: (1) Comparar al menos 3 ofertas, (2) Negociar la vinculación de productos, (3) Considerar hipotecas con tipo fijo o mixto dado el entorno de tipos. En Anclora trabajamos con asesores hipotecarios independientes.',
      category: 'financiacion',
      keywords: ['banco', 'hipoteca', 'mejores', 'comparación'],
      importance: 'high',
    },
  ],
  
  inversion: [
    {
      id: 'faq-inversion-1',
      question: '¿Es rentable invertir en una villa de lujo en Mallorca?',
      answer: 'Sí, invertir en lujo en Mallorca puede ser muy rentable. Los datos muestran: (1) Apreciación anual: 3-8% dependiendo de la zona, (2) Rentabilidad por alquiler vacacional: 4-6% bruto anual, (3) Demanda constante de alquileres de lujo, (4) Mercado estable incluso en crisis. Las mejores zonas para inversión son: Son Vida, Port d\'Andratx, Puerto Portals y Santa Ponsa. El ROI típico combinando apreciación y alquiler es 6-10% anual.',
      category: 'inversion',
      keywords: ['rentabilidad', 'inversión', 'ROI', 'alquiler'],
      importance: 'critical',
    },
    {
      id: 'faq-inversion-2',
      question: '¿Qué zonas de Mallorca tienen mejor potencial de revalorización?',
      answer: 'Las zonas con mejor potencial de revalorización en Mallorca son: (1) Son Vida: Zona consolidada, alta demanda, cerca de Palma (+5-8% anual), (2) Port d\'Andratx: Exclusividad máxima, oferta limitada (+4-7%), (3) Calvià Costa: Playa, servicios, infraestructura (+4-6%), (4) Palma Centro: Creciente demanda, turismo urbano (+6-10%), (5) Deià/Sóller: Autenticidad, patrimonio (+3-5%). Las propiedades con vistas al mar y buen estado suelen revalorizarse más.',
      category: 'inversion',
      keywords: ['revalorización', 'zonas', 'mejores', 'potencial'],
      importance: 'critical',
    },
  ],
  
  golden_visa: [
    {
      id: 'faq-golden-1',
      question: '¿Cómo funciona la Golden Visa en España?',
      answer: 'La Golden Visa española otorga residencia a inversores extranjeros. Requisitos: (1) Inversión mínima de 500.000 € en inmuebles, (2) Seguro médico privado, (3) Fondos suficientes, (4) Sin antecedentes penales. Beneficios: Residencia renovable cada 2 años, libertad de movimiento en Schengen, posibilidad de trabajar, vía hacia nacionalidad tras 10 años. No requiere residir en España (solo visitar 1 vez cada 2 años).',
      category: 'golden_visa',
      keywords: ['golden visa', 'residencia', 'inversión', 'requisitos'],
      importance: 'critical',
    },
  ],
};

/**
 * Generate FAQ Schema.org markup
 */
export function generateFAQSchema(faqs: FAQItem[]): WithContext<Record<string, unknown>> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        dateCreated: faq.lastUpdated?.toISOString() || new Date().toISOString(),
      },
      ...(faq.keywords && {
        keywords: faq.keywords.join(', '),
      }),
    })),
  };
}

/**
 * Generate single FAQ item schema
 */
export function generateSingleFAQSchema(faq: FAQItem): Record<string, unknown> {
  return {
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
      dateCreated: faq.lastUpdated?.toISOString() || new Date().toISOString(),
    },
  };
}

/**
 * Generate FAQ HTML with microdata
 */
export function generateFAQHTML(faqs: FAQItem[]): string {
  return faqs
    .map(
      faq => `
<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
  <h3 itemprop="name">${faq.question}</h3>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <div itemprop="text">
      ${faq.answer}
    </div>
  </div>
</div>
    `.trim()
    )
    .join('\n\n');
}

/**
 * Generate FAQ for featured snippet optimization
 */
export function optimizeFAQForSnippet(faq: FAQItem): {
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  bulletPoints?: string[];
} {
  // Extract first sentence as short answer
  const sentences = faq.answer.split(/[.!?]+/);
  const shortAnswer = sentences[0]?.trim() + '.';
  
  // Extract bullet points if present
  const bulletPoints = faq.answer.match(/\(\d+\)[^(]+/g)?.map(bp => bp.trim());
  
  return {
    question: faq.question,
    shortAnswer,
    fullAnswer: faq.answer,
    bulletPoints,
  };
}

/**
 * Generate FAQ JSON for AI consumption
 */
export function generateFAQJSON(faqs: FAQItem[]): string {
  const faqData = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords,
    importance: faq.importance,
  }));
  
  return JSON.stringify(faqData, null, 2);
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: string): FAQItem[] {
  return COMMON_FAQS[category] || [];
}

/**
 * Get all FAQ categories
 */
export function getAllFAQCategories(): string[] {
  return Object.keys(COMMON_FAQS);
}

/**
 * Search FAQs by keyword
 */
export function searchFAQs(keyword: string): FAQItem[] {
  const lowerKeyword = keyword.toLowerCase();
  const allFAQs = Object.values(COMMON_FAQS).flat();
  
  return allFAQs.filter(
    faq =>
      faq.question.toLowerCase().includes(lowerKeyword) ||
      faq.answer.toLowerCase().includes(lowerKeyword) ||
      faq.keywords?.some(k => k.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Generate FAQ sitemap
 */
export function generateFAQSitemap(): string {
  const allFAQs = Object.values(COMMON_FAQS).flat();
  
  const urls = allFAQs.map(
    faq => `
  <url>
    <loc>https://anclora.com/faq/${faq.id}</loc>
    <lastmod>${(faq.lastUpdated || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
    `.trim()
  );
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

/**
 * FAQ templates for different property types
 */
export const FAQ_TEMPLATES = {
  villa: {
    title: 'Preguntas Frecuentes sobre Villas de Lujo',
    questions: [
      '¿Cuál es el precio medio de una villa en {location}?',
      '¿Qué incluye normalmente una villa de lujo?',
      '¿Cuánto cuestan los gastos de mantenimiento anuales?',
      '¿Puedo alquilar mi villa cuando no la uso?',
      '¿Qué servicios de gestión están disponibles?',
    ],
  },
  
  apartamento: {
    title: 'Preguntas Frecuentes sobre Apartamentos de Lujo',
    questions: [
      '¿Cuál es el precio medio por m² en {location}?',
      '¿Qué gastos de comunidad tendré que pagar?',
      '¿Los apartamentos incluyen plaza de garaje?',
      '¿Hay restricciones para alquileres vacacionales?',
      '¿Qué servicios ofrece el edificio?',
    ],
  },
  
  finca: {
    title: 'Preguntas Frecuentes sobre Fincas Rústicas',
    questions: [
      '¿Se puede construir en una finca rústica en Mallorca?',
      '¿Qué permisos necesito para reformar una finca?',
      '¿Hay limitaciones de agua o electricidad?',
      '¿Puedo usar la finca para turismo rural?',
      '¿Qué costes de mantenimiento tiene una finca?',
    ],
  },
};

/**
 * Generate contextual FAQs for a property
 */
export function generatePropertyFAQs(property: {
  type: string;
  location: string;
  price: number;
  features: string[];
}): FAQItem[] {
  const template = FAQ_TEMPLATES[property.type as keyof typeof FAQ_TEMPLATES] || FAQ_TEMPLATES.villa;
  
  return template.questions.map((question, index) => ({
    id: `faq-property-${property.type}-${index}`,
    question: question.replace('{location}', property.location),
    answer: `Información específica sobre ${question.toLowerCase()} en ${property.location}.`,
    category: property.type,
    importance: 'medium' as const,
  }));
}

/**
 * Generate FAQ page metadata
 */
export function generateFAQPageMeta(category?: string): {
  title: string;
  description: string;
  keywords: string[];
} {
  if (category) {
    const faqs = getFAQsByCategory(category);
    return {
      title: `Preguntas Frecuentes sobre ${category.charAt(0).toUpperCase() + category.slice(1)} | Anclora`,
      description: `Respuestas a las ${faqs.length} preguntas más frecuentes sobre ${category} en el mercado inmobiliario de lujo en Mallorca.`,
      keywords: faqs.flatMap(f => f.keywords || []),
    };
  }
  
  return {
    title: 'Preguntas Frecuentes | Anclora Private Estates',
    description: 'Encuentra respuestas a todas tus preguntas sobre comprar, invertir y vivir en propiedades de lujo en Mallorca.',
    keywords: ['FAQ', 'preguntas', 'respuestas', 'mallorca', 'inmobiliaria'],
  };
}

/**
 * Validate FAQ quality for GEO
 */
export function validateFAQQuality(faq: FAQItem): {
  isValid: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;
  
  // Question length
  if (faq.question.length < 20 || faq.question.length > 100) {
    issues.push('Question length not optimal (20-100 chars)');
    score -= 15;
  }
  
  // Question should be a question
  if (!faq.question.includes('?') && !faq.question.match(/^(Cómo|Qué|Cuándo|Dónde|Por qué|Cuál)/i)) {
    issues.push('Question should be in question format');
    score -= 20;
  }
  
  // Answer length
  if (faq.answer.length < 100) {
    issues.push('Answer too short (min 100 chars)');
    score -= 20;
  } else if (faq.answer.length > 500) {
    issues.push('Answer too long (max 500 chars for featured snippets)');
    score -= 10;
  }
  
  // Keywords
  if (!faq.keywords || faq.keywords.length === 0) {
    issues.push('Missing keywords');
    score -= 15;
  }
  
  // Category
  if (!faq.category) {
    issues.push('Missing category');
    score -= 10;
  }
  
  return {
    isValid: score >= 70,
    score,
    issues,
  };
}

/**
 * Export default
 */
const faqSchema = {
  generateFAQSchema,
  generateSingleFAQSchema,
  generateFAQHTML,
  optimizeFAQForSnippet,
  generateFAQJSON,
  getFAQsByCategory,
  getAllFAQCategories,
  searchFAQs,
  generateFAQSitemap,
  generatePropertyFAQs,
  generateFAQPageMeta,
  validateFAQQuality,
  COMMON_FAQS,
  FAQ_TEMPLATES,
};

export default faqSchema;
