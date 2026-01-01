/**
 * Blog Content Templates
 * Anclora Private Estates
 * 
 * Pre-built content templates for different post types
 */

import { BlogPostType } from './blog-system';

export interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'callout' | 'code' | 'table' | 'image';
  content: string;
  level?: number; // For headings
  items?: string[]; // For lists
  ordered?: boolean; // For lists
  author?: string; // For quotes
  variant?: 'info' | 'warning' | 'success' | 'tip'; // For callouts
  language?: string; // For code blocks
  headers?: string[]; // For tables
  rows?: string[][]; // For tables
  src?: string; // For images
  alt?: string; // For images
  caption?: string; // For images
}

export interface BlogTemplate {
  type: BlogPostType;
  title: string;
  sections: ContentSection[];
}

// ==============================================
// GUIDE TEMPLATE
// ==============================================

export const guideTemplate: BlogTemplate = {
  type: 'guide',
  title: 'Guía Completa para [Tema]',
  sections: [
    {
      type: 'paragraph',
      content: 'Introducción que explica qué cubre esta guía y por qué es importante para el lector.',
    },
    {
      type: 'callout',
      variant: 'info',
      content: '💡 **Consejo**: Destaca el valor principal que obtendrá el lector al completar esta guía.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Por qué es importante [Tema]',
    },
    {
      type: 'paragraph',
      content: 'Explica el contexto y la importancia del tema. Usa datos y estadísticas si es posible.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Paso 1: [Primer Paso]',
    },
    {
      type: 'paragraph',
      content: 'Descripción detallada del primer paso.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Punto clave 1',
        'Punto clave 2',
        'Punto clave 3',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      content: '✅ **Consejo de experto**: Tip específico relacionado con este paso.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Paso 2: [Segundo Paso]',
    },
    {
      type: 'paragraph',
      content: 'Descripción detallada del segundo paso.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Errores Comunes a Evitar',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '❌ Error 1: Descripción y cómo evitarlo',
        '❌ Error 2: Descripción y cómo evitarlo',
        '❌ Error 3: Descripción y cómo evitarlo',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Preguntas Frecuentes',
    },
    {
      type: 'paragraph',
      content: '**P: Pregunta frecuente 1?**\nR: Respuesta detallada.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Conclusión',
    },
    {
      type: 'paragraph',
      content: 'Resume los puntos clave y ofrece próximos pasos.',
    },
    {
      type: 'callout',
      variant: 'success',
      content: '🎯 **Próximo paso**: Call to action específico (contactar, agendar consulta, etc.)',
    },
  ],
};

// ==============================================
// MARKET ANALYSIS TEMPLATE
// ==============================================

export const marketAnalysisTemplate: BlogTemplate = {
  type: 'market-analysis',
  title: 'Análisis del Mercado Inmobiliario [Ubicación/Sector] [Mes/Trimestre] [Año]',
  sections: [
    {
      type: 'heading',
      level: 2,
      content: 'Resumen Ejecutivo',
    },
    {
      type: 'callout',
      variant: 'info',
      content: '📊 **Datos clave**: 3-5 datos principales en formato bullet point',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Tendencias del Mercado',
    },
    {
      type: 'paragraph',
      content: 'Análisis de las principales tendencias observadas en el período.',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '📈 Tendencia 1: Descripción y datos',
        '📊 Tendencia 2: Descripción y datos',
        '💰 Tendencia 3: Descripción y datos',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Análisis de Precios',
    },
    {
      type: 'table',
      headers: ['Zona', 'Precio Medio €/m²', 'Variación', 'Tendencia'],
      rows: [
        ['Zona 1', '5,500', '+8%', '↗'],
        ['Zona 2', '4,200', '+5%', '↗'],
        ['Zona 3', '3,800', '+3%', '→'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Oferta y Demanda',
    },
    {
      type: 'paragraph',
      content: 'Análisis del equilibrio entre oferta y demanda.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Zonas Destacadas',
    },
    {
      type: 'paragraph',
      content: 'Análisis de las zonas con mejor rendimiento.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Proyecciones',
    },
    {
      type: 'callout',
      variant: 'warning',
      content: '⚠️ **Importante**: Estas proyecciones se basan en datos actuales y pueden variar según condiciones del mercado.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Recomendaciones para Inversores',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Recomendación 1',
        'Recomendación 2',
        'Recomendación 3',
      ],
    },
    {
      type: 'paragraph',
      content: '**Fuentes**: Lista de fuentes y metodología utilizada.',
    },
  ],
};

// ==============================================
// LOCATION GUIDE TEMPLATE
// ==============================================

export const locationGuideTemplate: BlogTemplate = {
  type: 'location-guide',
  title: 'Guía Completa de [Ubicación]: Vivir en [Zona]',
  sections: [
    {
      type: 'paragraph',
      content: 'Introducción atractiva sobre la zona, destacando su carácter único.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Overview de [Ubicación]',
    },
    {
      type: 'paragraph',
      content: 'Descripción general: historia, carácter, ambiente.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Mercado Inmobiliario',
    },
    {
      type: 'paragraph',
      content: 'Análisis del mercado inmobiliario en la zona.',
    },
    {
      type: 'callout',
      variant: 'info',
      content: '💰 **Precios**: Rango de precios y precio medio €/m²',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Estilo de Vida',
    },
    {
      type: 'paragraph',
      content: 'Descripción del día a día viviendo en esta zona.',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Restaurantes y Gastronomía',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '🍽️ Restaurante 1 - Especialidad',
        '🍽️ Restaurante 2 - Especialidad',
        '🍽️ Restaurante 3 - Especialidad',
      ],
    },
    {
      type: 'heading',
      level: 3,
      content: 'Actividades y Ocio',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Actividad 1',
        'Actividad 2',
        'Actividad 3',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Servicios y Amenidades',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Educación',
    },
    {
      type: 'paragraph',
      content: 'Colegios e instituciones educativas.',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Salud',
    },
    {
      type: 'paragraph',
      content: 'Centros de salud y hospitales.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Transporte y Accesibilidad',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '✈️ Aeropuerto: XX minutos',
        '🚗 Centro Palma: XX minutos',
        '🚌 Transporte público: Líneas disponibles',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Pros y Contras',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Ventajas',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '✅ Ventaja 1',
        '✅ Ventaja 2',
        '✅ Ventaja 3',
      ],
    },
    {
      type: 'heading',
      level: 3,
      content: 'Consideraciones',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '⚠️ Consideración 1',
        '⚠️ Consideración 2',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Conclusión',
    },
    {
      type: 'paragraph',
      content: 'Resumen y recomendación final sobre para quién es ideal esta zona.',
    },
    {
      type: 'callout',
      variant: 'success',
      content: '🏠 **Ver propiedades**: [Link a propiedades en esta ubicación]',
    },
  ],
};

// ==============================================
// CHECKLIST TEMPLATE
// ==============================================

export const checklistTemplate: BlogTemplate = {
  type: 'checklist',
  title: 'Checklist: [Tema]',
  sections: [
    {
      type: 'paragraph',
      content: 'Breve introducción explicando el propósito de la checklist.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content: '💡 **Tip**: Imprime esta checklist o guárdala para usarla durante el proceso.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Fase 1: [Nombre de Fase]',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '☐ Item 1: Descripción',
        '☐ Item 2: Descripción',
        '☐ Item 3: Descripción',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Fase 2: [Nombre de Fase]',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '☐ Item 1: Descripción',
        '☐ Item 2: Descripción',
        '☐ Item 3: Descripción',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Consejos Adicionales',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '✅ Consejo 1',
        '✅ Consejo 2',
        '✅ Consejo 3',
      ],
    },
    {
      type: 'callout',
      variant: 'success',
      content: '📥 **Descarga**: [Link a PDF descargable de la checklist]',
    },
  ],
};

// ==============================================
// COMPARISON TEMPLATE
// ==============================================

export const comparisonTemplate: BlogTemplate = {
  type: 'comparison',
  title: '[Opción A] vs [Opción B]: ¿Cuál es Mejor?',
  sections: [
    {
      type: 'paragraph',
      content: 'Introducción explicando qué se va a comparar y los criterios.',
    },
    {
      type: 'heading',
      level: 2,
      content: 'Criterios de Comparación',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Criterio 1',
        'Criterio 2',
        'Criterio 3',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Opción A: [Nombre]',
    },
    {
      type: 'paragraph',
      content: 'Descripción detallada de la Opción A.',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Pros',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '✅ Pro 1',
        '✅ Pro 2',
        '✅ Pro 3',
      ],
    },
    {
      type: 'heading',
      level: 3,
      content: 'Contras',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '❌ Contra 1',
        '❌ Contra 2',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Opción B: [Nombre]',
    },
    {
      type: 'paragraph',
      content: 'Descripción detallada de la Opción B.',
    },
    {
      type: 'heading',
      level: 3,
      content: 'Pros',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '✅ Pro 1',
        '✅ Pro 2',
        '✅ Pro 3',
      ],
    },
    {
      type: 'heading',
      level: 3,
      content: 'Contras',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '❌ Contra 1',
        '❌ Contra 2',
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Tabla Comparativa',
    },
    {
      type: 'table',
      headers: ['Criterio', 'Opción A', 'Opción B', 'Ganador'],
      rows: [
        ['Precio', 'XXX', 'YYY', 'Opción A'],
        ['Calidad', 'Alta', 'Media', 'Opción A'],
        ['Accesibilidad', 'Media', 'Alta', 'Opción B'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      content: 'Veredicto',
    },
    {
      type: 'callout',
      variant: 'success',
      content: '🏆 **Recomendación**: [Opción recomendada] es mejor para [tipo de usuario/situación]',
    },
    {
      type: 'paragraph',
      content: 'Explicación del veredicto.',
    },
  ],
};

// ==============================================
// TEMPLATE HELPERS
// ==============================================

/**
 * Convert template sections to HTML
 */
export function sectionsToHTML(sections: ContentSection[]): string {
  return sections
    .map(section => {
      switch (section.type) {
        case 'heading':
          return `<h${section.level}>${section.content}</h${section.level}>`;

        case 'paragraph':
          return `<p>${section.content}</p>`;

        case 'list':
          const tag = section.ordered ? 'ol' : 'ul';
          const items = section.items
            ?.map(item => `<li>${item}</li>`)
            .join('');
          return `<${tag}>${items}</${tag}>`;

        case 'quote':
          return `<blockquote>
            <p>${section.content}</p>
            ${section.author ? `<footer>— ${section.author}</footer>` : ''}
          </blockquote>`;

        case 'callout':
          return `<div class="callout callout-${section.variant}">
            ${section.content}
          </div>`;

        case 'code':
          return `<pre><code class="language-${section.language}">${section.content}</code></pre>`;

        case 'table':
          const headers = section.headers
            ?.map(h => `<th>${h}</th>`)
            .join('');
          const rows = section.rows
            ?.map(
              row =>
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
            )
            .join('');
          return `<table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>`;

        case 'image':
          return `<figure>
            <img src="${section.src}" alt="${section.alt}" />
            ${section.caption ? `<figcaption>${section.caption}</figcaption>` : ''}
          </figure>`;

        default:
          return '';
      }
    })
    .join('\n\n');
}

/**
 * Convert template sections to Markdown
 */
export function sectionsToMarkdown(sections: ContentSection[]): string {
  return sections
    .map(section => {
      switch (section.type) {
        case 'heading':
          return `${'#'.repeat(section.level || 2)} ${section.content}`;

        case 'paragraph':
          return section.content;

        case 'list':
          const prefix = section.ordered ? '1.' : '-';
          return section.items?.map(item => `${prefix} ${item}`).join('\n');

        case 'quote':
          return `> ${section.content}${section.author ? `\n> — ${section.author}` : ''}`;

        case 'callout':
          return `\n:::${section.variant}\n${section.content}\n:::`;

        case 'code':
          return `\`\`\`${section.language}\n${section.content}\n\`\`\``;

        case 'table':
          const headers = section.headers?.join(' | ');
          const separator = section.headers?.map(() => '---').join(' | ');
          const rows = section.rows
            ?.map(row => row.join(' | '))
            .join('\n');
          return `${headers}\n${separator}\n${rows}`;

        case 'image':
          return `![${section.alt}](${section.src})${section.caption ? `\n*${section.caption}*` : ''}`;

        default:
          return '';
      }
    })
    .join('\n\n');
}

/**
 * Get template by type
 */
export function getTemplateByType(type: BlogPostType): BlogTemplate | undefined {
  const templates: Record<BlogPostType, BlogTemplate> = {
    guide: guideTemplate,
    'market-analysis': marketAnalysisTemplate,
    'location-guide': locationGuideTemplate,
    checklist: checklistTemplate,
    comparison: comparisonTemplate,
    // Add more templates as needed
    howto: guideTemplate, // Reuse guide template
    news: guideTemplate, // Custom template would be better
    interview: guideTemplate, // Custom template would be better
    'case-study': guideTemplate, // Custom template would be better
  };

  return templates[type];
}
