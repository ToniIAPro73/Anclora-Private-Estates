/**
 * Internal Linking Strategy System
 * Anclora Private Estates
 * 
 * Automated internal linking for SEO and user navigation
 */

export interface InternalLink {
  url: string;
  anchor: string;
  title: string;
  rel?: string;
  type: 'property' | 'location' | 'service' | 'blog' | 'page';
  priority: number;
}

export interface LinkContext {
  currentPage: {
    type: 'property' | 'location' | 'service' | 'blog' | 'home';
    id?: string;
    location?: string;
    propertyType?: string;
  };
  content?: string;
}

// ==============================================
// LINK GENERATION STRATEGIES
// ==============================================

/**
 * Generate contextual internal links based on page context
 */
export function generateContextualLinks(context: LinkContext): InternalLink[] {
  const links: InternalLink[] = [];

  switch (context.currentPage.type) {
    case 'property':
      links.push(...getPropertyPageLinks(context));
      break;
    case 'location':
      links.push(...getLocationPageLinks(context));
      break;
    case 'service':
      links.push(...getServicePageLinks(context));
      break;
    case 'blog':
      links.push(...getBlogPageLinks());
      break;
    case 'home':
      links.push(...getHomePageLinks());
      break;
  }

  // Sort by priority
  return links.sort((a, b) => b.priority - a.priority);
}

/**
 * Get links for property detail pages
 */
function getPropertyPageLinks(context: LinkContext): InternalLink[] {
  const links: InternalLink[] = [];
  const { location, propertyType } = context.currentPage;

  // 1. Link to location guide (High priority)
  if (location) {
    links.push({
      url: `/propiedades/ubicacion/${slugify(location)}`,
      anchor: `Descubre más propiedades en ${location}`,
      title: `Ver todas las propiedades disponibles en ${location}`,
      type: 'location',
      priority: 10,
    });
  }

  // 2. Link to property type listing
  if (propertyType) {
    links.push({
      url: `/propiedades?type=${slugify(propertyType)}`,
      anchor: `Ver todas las ${propertyType}s disponibles`,
      title: `Explorar ${propertyType}s de lujo en Mallorca`,
      type: 'property',
      priority: 8,
    });
  }

  // 3. Link to valuation service
  links.push({
    url: '/servicios/valoracion',
    anchor: 'Solicita una valoración gratuita de tu propiedad',
    title: 'Servicio de valoración profesional',
    type: 'service',
    priority: 7,
  });

  // 4. Link to buying guide
  links.push({
    url: '/blog/guia-comprar-propiedad-mallorca',
    anchor: 'Guía completa para comprar propiedad en Mallorca',
    title: 'Lee nuestra guía paso a paso',
    type: 'blog',
    priority: 6,
  });

  // 5. Similar properties (would be dynamic)
  links.push({
    url: `/propiedades?location=${slugify(location || '')}&similar=true`,
    anchor: 'Propiedades similares en la zona',
    title: 'Ver propiedades similares',
    type: 'property',
    priority: 9,
  });

  return links;
}

/**
 * Get links for location guide pages
 */
function getLocationPageLinks(context: LinkContext): InternalLink[] {
  const links: InternalLink[] = [];
  const { location } = context.currentPage;

  // 1. Link to properties in this location
  if (location) {
    links.push({
      url: `/propiedades?location=${slugify(location)}`,
      anchor: `Ver todas las propiedades en ${location}`,
      title: `Explora propiedades de lujo en ${location}`,
      type: 'property',
      priority: 10,
    });
  }

  // 2. Link to other premium locations
  const otherLocations = ['Son Vida', 'Port d\'Andratx', 'Palma Centro']
    .filter(loc => loc !== location);

  otherLocations.forEach((loc, index) => {
    links.push({
      url: `/propiedades/ubicacion/${slugify(loc)}`,
      anchor: `Descubre ${loc}`,
      title: `Guía de ${loc}`,
      type: 'location',
      priority: 7 - index,
    });
  });

  // 3. Link to buying service
  links.push({
    url: '/servicios/compra',
    anchor: 'Asesoría personalizada para comprar en esta zona',
    title: 'Servicio de asesoría en compra',
    type: 'service',
    priority: 8,
  });

  // 4. Link to investment guide
  links.push({
    url: '/blog/invertir-inmobiliaria-mallorca',
    anchor: 'Por qué invertir en Mallorca',
    title: 'Guía de inversión inmobiliaria',
    type: 'blog',
    priority: 6,
  });

  return links;
}

/**
 * Get links for service pages
 */
function getServicePageLinks(context: LinkContext): InternalLink[] {
  const links: InternalLink[] = [];

  // 1. Link to all properties
  links.push({
    url: '/propiedades',
    anchor: 'Explora nuestro portfolio de propiedades exclusivas',
    title: 'Ver todas las propiedades',
    type: 'property',
    priority: 10,
  });

  // 2. Link to premium locations
  links.push({
    url: '/propiedades/ubicacion/son-vida',
    anchor: 'Propiedades en Son Vida',
    title: 'Zona residencial más exclusiva',
    type: 'location',
    priority: 9,
  });

  // 3. Link to other services
  const services = [
    { slug: 'compra', name: 'Asesoría en Compra' },
    { slug: 'venta', name: 'Servicios de Venta' },
    { slug: 'gestion', name: 'Gestión Integral' },
    { slug: 'valoracion', name: 'Valoración Profesional' },
  ];

  services.forEach((service, index) => {
    if (context.currentPage.id !== service.slug) {
      links.push({
        url: `/servicios/${service.slug}`,
        anchor: service.name,
        title: `Conoce nuestro servicio de ${service.name.toLowerCase()}`,
        type: 'service',
        priority: 7 - index,
      });
    }
  });

  // 4. Link to about us
  links.push({
    url: '/sobre-nosotros',
    anchor: 'Conoce a nuestro equipo de expertos',
    title: 'Sobre Anclora Private Estates',
    type: 'page',
    priority: 6,
  });

  return links;
}

/**
 * Get links for blog pages
 */
function getBlogPageLinks(): InternalLink[] {
  const links: InternalLink[] = [];

  // 1. Link to properties
  links.push({
    url: '/propiedades',
    anchor: 'Explora nuestras propiedades exclusivas',
    title: 'Ver portfolio completo',
    type: 'property',
    priority: 10,
  });

  // 2. Link to related blog posts (would be dynamic)
  links.push({
    url: '/blog',
    anchor: 'Más artículos sobre el mercado inmobiliario de Mallorca',
    title: 'Leer más artículos',
    type: 'blog',
    priority: 8,
  });

  // 3. Link to valuation service
  links.push({
    url: '/servicios/valoracion',
    anchor: 'Solicita una valoración gratuita',
    title: 'Valora tu propiedad',
    type: 'service',
    priority: 9,
  });

  // 4. Link to contact
  links.push({
    url: '/contacto',
    anchor: 'Contacta con nuestros expertos',
    title: 'Contacto',
    type: 'page',
    priority: 7,
  });

  return links;
}

/**
 * Get links for homepage
 */
function getHomePageLinks(): InternalLink[] {
  return [
    {
      url: '/propiedades',
      anchor: 'Explora nuestro portfolio de propiedades exclusivas',
      title: 'Ver todas las propiedades',
      type: 'property',
      priority: 10,
    },
    {
      url: '/propiedades/ubicacion/son-vida',
      anchor: 'Descubre Son Vida',
      title: 'La zona más exclusiva de Mallorca',
      type: 'location',
      priority: 9,
    },
    {
      url: '/servicios',
      anchor: 'Nuestros servicios premium',
      title: 'Servicios inmobiliarios de lujo',
      type: 'service',
      priority: 8,
    },
    {
      url: '/blog',
      anchor: 'Guías y consejos sobre el mercado inmobiliario',
      title: 'Lee nuestro blog',
      type: 'blog',
      priority: 7,
    },
  ];
}

// ==============================================
// ANCHOR TEXT VARIATIONS
// ==============================================

/**
 * Generate varied anchor texts for same destination
 * Avoids over-optimization
 */
export function generateAnchorVariations(
  baseAnchor: string,
  _context: string
): string[] {
  const variations: Record<string, string[]> = {
    'propiedades': [
      'nuestras propiedades exclusivas',
      'portfolio de propiedades de lujo',
      'propiedades disponibles',
      'descubre nuestras propiedades',
      'propiedades en Mallorca',
    ],
    'son vida': [
      'propiedades en Son Vida',
      'Son Vida, la zona más exclusiva',
      'villas de lujo en Son Vida',
      'descubre Son Vida',
      'Son Vida Mallorca',
    ],
    'valoracion': [
      'valoración gratuita',
      'valora tu propiedad',
      'tasación profesional',
      'solicita una valoración',
      'servicio de valoración',
    ],
  };

  const key = Object.keys(variations).find(k =>
    baseAnchor.toLowerCase().includes(k)
  );

  return key ? variations[key] : [baseAnchor];
}

// ==============================================
// CONTENT-BASED LINK INSERTION
// ==============================================

/**
 * Find opportunities to insert links in content
 */
export function findLinkOpportunities(
  content: string,
  availableLinks: InternalLink[]
): Array<{
  position: number;
  link: InternalLink;
  matchedText: string;
}> {
  const opportunities: Array<{
    position: number;
    link: InternalLink;
    matchedText: string;
  }> = [];

  // Keywords to match
  const keywords: Record<string, string[]> = {
    location: ['Son Vida', 'Port d\'Andratx', 'Palma', 'Mallorca'],
    property: ['villa', 'apartamento', 'ático', 'propiedad', 'inmueble'],
    service: ['compra', 'venta', 'gestión', 'valoración', 'asesoría'],
  };

  // Find matches in content
  Object.entries(keywords).forEach(([type, words]) => {
    words.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      let match;

      while ((match = regex.exec(content)) !== null) {
        // Find relevant link
        const relevantLink = availableLinks.find(
          link => link.type === type && link.anchor.toLowerCase().includes(keyword.toLowerCase())
        );

        if (relevantLink) {
          opportunities.push({
            position: match.index,
            link: relevantLink,
            matchedText: match[0],
          });
        }
      }
    });
  });

  // Sort by priority and remove duplicates close to each other
  return opportunities
    .sort((a, b) => b.link.priority - a.link.priority)
    .filter((opp, index, arr) => {
      // Avoid links too close to each other (< 200 chars)
      return !arr.some(
        (other, otherIndex) =>
          otherIndex < index &&
          Math.abs(other.position - opp.position) < 200
      );
    });
}

/**
 * Insert links into content
 */
export function insertLinksIntoContent(
  content: string,
  opportunities: Array<{
    position: number;
    link: InternalLink;
    matchedText: string;
  }>
): string {
  // Sort by position (descending) to maintain positions during insertion
  const sortedOpportunities = [...opportunities].sort(
    (a, b) => b.position - a.position
  );

  let result = content;

  sortedOpportunities.forEach(opp => {
    const linkHtml = `<a href="${opp.link.url}" title="${opp.link.title}"${
      opp.link.rel ? ` rel="${opp.link.rel}"` : ''
    }>${opp.matchedText}</a>`;

    result =
      result.slice(0, opp.position) +
      linkHtml +
      result.slice(opp.position + opp.matchedText.length);
  });

  return result;
}

// ==============================================
// BREADCRUMB NAVIGATION
// ==============================================

export interface BreadcrumbItem {
  label: string;
  url: string;
}

/**
 * Generate breadcrumb navigation
 */
export function generateBreadcrumbs(
  context: LinkContext
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
  ];

  switch (context.currentPage.type) {
    case 'property':
      breadcrumbs.push({ label: 'Propiedades', url: '/propiedades' });
      if (context.currentPage.location) {
        breadcrumbs.push({
          label: context.currentPage.location,
          url: `/propiedades/ubicacion/${slugify(context.currentPage.location)}`,
        });
      }
      break;

    case 'location':
      breadcrumbs.push({ label: 'Propiedades', url: '/propiedades' });
      if (context.currentPage.location) {
        breadcrumbs.push({
          label: context.currentPage.location,
          url: `/propiedades/ubicacion/${slugify(context.currentPage.location)}`,
        });
      }
      break;

    case 'service':
      breadcrumbs.push({ label: 'Servicios', url: '/servicios' });
      break;

    case 'blog':
      breadcrumbs.push({ label: 'Blog', url: '/blog' });
      break;
  }

  return breadcrumbs;
}

// ==============================================
// RELATED CONTENT
// ==============================================

/**
 * Get related content recommendations
 */
export function getRelatedContent(context: LinkContext): InternalLink[] {
  // Get contextual links
  const contextualLinks = generateContextualLinks(context);

  // Filter top 3-5 most relevant
  return contextualLinks.slice(0, 5);
}

// ==============================================
// HELPERS
// ==============================================

/**
 * Slugify text for URLs
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Calculate link density (for SEO monitoring)
 */
export function calculateLinkDensity(content: string, linkCount: number): {
  density: number;
  recommendation: string;
} {
  const wordCount = content.split(/\s+/).length;
  const density = (linkCount / wordCount) * 100;

  let recommendation = '';
  if (density < 1) {
    recommendation = 'Considerar añadir más enlaces internos';
  } else if (density > 5) {
    recommendation = 'Densidad de enlaces alta - considerar reducir';
  } else {
    recommendation = 'Densidad de enlaces óptima';
  }

  return { density, recommendation };
}
