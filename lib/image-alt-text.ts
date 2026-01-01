/**
 * Image Alt Text Generator
 * Anclora Private Estates
 * 
 * SEO-optimized alt text generation for property images
 */

export interface ImageAltTextOptions {
  propertyType: string;
  location: string;
  roomType?: string;
  viewType?: string;
  feature?: string;
  imageNumber?: number;
  isHero?: boolean;
}

// ==============================================
// ALT TEXT TEMPLATES
// ==============================================

/**
 * Generate SEO-optimized alt text for property images
 */
export function generateImageAltText({
  propertyType,
  location,
  roomType,
  viewType,
  feature,
  imageNumber,
  isHero = false,
}: ImageAltTextOptions): string {
  // Hero image (main property image)
  if (isHero) {
    if (viewType) {
      return `${propertyType} de lujo en ${location} con vistas ${viewType} - Anclora Private Estates`;
    }
    return `${propertyType} de lujo en ${location} Mallorca - Anclora Private Estates`;
  }

  // Room-specific images
  if (roomType) {
    const roomDescriptions = getRoomDescription(roomType, propertyType, location);
    return roomDescriptions;
  }

  // Feature-specific images
  if (feature) {
    return getFeatureDescription(feature, propertyType, location);
  }

  // View images
  if (viewType) {
    return `Vistas ${viewType} desde ${propertyType} en ${location}`;
  }

  // Generic numbered image
  if (imageNumber) {
    return `${propertyType} en ${location} - Vista ${imageNumber}`;
  }

  // Fallback
  return `${propertyType} de lujo en ${location} Mallorca`;
}

/**
 * Get room-specific descriptions
 */
function getRoomDescription(
  roomType: string,
  propertyType: string,
  location: string
): string {
  const descriptions: Record<string, string> = {
    // Living areas
    'salon': `Salón principal de ${propertyType} de lujo en ${location} con diseño contemporáneo`,
    'living-room': `Amplio salón con vistas en ${propertyType} ${location} Mallorca`,
    'dining-room': `Comedor elegante en ${propertyType} exclusiva ${location}`,
    'open-concept': `Espacio de concepto abierto en ${propertyType} moderna ${location}`,
    
    // Bedrooms
    'master-bedroom': `Dormitorio principal suite en ${propertyType} ${location} con vestidor`,
    'bedroom': `Dormitorio amplio y luminoso en ${propertyType} ${location}`,
    'guest-bedroom': `Dormitorio de invitados en ${propertyType} de lujo ${location}`,
    
    // Bathrooms
    'master-bathroom': `Baño principal en suite con acabados de lujo en ${location}`,
    'bathroom': `Baño de diseño contemporáneo en ${propertyType} ${location}`,
    'guest-bathroom': `Baño de cortesía en ${propertyType} exclusiva ${location}`,
    
    // Kitchen
    'kitchen': `Cocina de diseño equipada con electrodomésticos alta gama en ${location}`,
    'kitchen-island': `Isla central de cocina en ${propertyType} moderna ${location}`,
    
    // Outdoor
    'terrace': `Terraza con vistas panorámicas en ${propertyType} ${location}`,
    'garden': `Jardín mediterráneo en ${propertyType} de lujo ${location}`,
    'pool': `Piscina privada en ${propertyType} exclusiva ${location} Mallorca`,
    'pool-area': `Zona de piscina con tumbonas en ${propertyType} ${location}`,
    
    // Special rooms
    'gym': `Gimnasio privado equipado en ${propertyType} de lujo ${location}`,
    'wine-cellar': `Bodega de vinos climatizada en ${propertyType} exclusiva ${location}`,
    'office': `Despacho con vistas en ${propertyType} ${location}`,
    'cinema': `Sala de cine privada en ${propertyType} de lujo ${location}`,
    
    // Entrance
    'entrance': `Entrada principal elegante en ${propertyType} ${location}`,
    'foyer': `Hall de entrada espacioso en ${propertyType} de lujo ${location}`,
    
    // Garage
    'garage': `Garaje privado en ${propertyType} exclusiva ${location}`,
  };

  return descriptions[roomType] || `${roomType} en ${propertyType} ${location}`;
}

/**
 * Get feature-specific descriptions
 */
function getFeatureDescription(
  feature: string,
  propertyType: string,
  location: string
): string {
  const featureLower = feature.toLowerCase();

  if (featureLower.includes('piscina') || featureLower.includes('pool')) {
    if (featureLower.includes('infinity')) {
      return `Piscina infinity con vistas panorámicas en ${propertyType} ${location}`;
    }
    return `Piscina privada en ${propertyType} de lujo ${location} Mallorca`;
  }

  if (featureLower.includes('jardín') || featureLower.includes('garden')) {
    return `Jardín mediterráneo diseñado en ${propertyType} ${location}`;
  }

  if (featureLower.includes('vista') || featureLower.includes('view')) {
    if (featureLower.includes('mar') || featureLower.includes('sea')) {
      return `Vistas panorámicas al mar Mediterráneo desde ${propertyType} ${location}`;
    }
    if (featureLower.includes('montaña') || featureLower.includes('mountain')) {
      return `Vistas a la Serra de Tramuntana desde ${propertyType} ${location}`;
    }
    return `Vistas panorámicas desde ${propertyType} en ${location}`;
  }

  if (featureLower.includes('terraza') || featureLower.includes('terrace')) {
    return `Terraza amplia con zona chill-out en ${propertyType} ${location}`;
  }

  if (featureLower.includes('cocina') || featureLower.includes('kitchen')) {
    return `Cocina de diseño con isla central en ${propertyType} ${location}`;
  }

  // Generic feature
  return `${feature} en ${propertyType} de lujo ${location} Mallorca`;
}

// ==============================================
// IMAGE METADATA GENERATOR
// ==============================================

export interface ImageMetadata {
  alt: string;
  title: string;
  caption?: string;
  filename: string;
}

/**
 * Generate complete image metadata
 */
export function generateImageMetadata({
  propertyId,
  propertyType,
  location,
  roomType,
  viewType,
  feature,
  imageNumber,
  isHero = false,
}: ImageAltTextOptions & { propertyId: string }): ImageMetadata {
  const alt = generateImageAltText({
    propertyType,
    location,
    roomType,
    viewType,
    feature,
    imageNumber,
    isHero,
  });

  // Generate title (shorter, more focused)
  let title = '';
  if (isHero) {
    title = `${propertyType} ${location}`;
  } else if (roomType) {
    title = `${roomType} - ${propertyType} ${location}`;
  } else if (feature) {
    title = `${feature} - ${location}`;
  } else {
    title = `${propertyType} ${location} ${imageNumber || ''}`;
  }

  // Generate caption (longer, more descriptive)
  let caption = '';
  if (roomType) {
    caption = getRoomCaption(roomType, propertyType, location);
  } else if (feature) {
    caption = getFeatureCaption(feature, propertyType, location);
  }

  // Generate filename
  const filename = generateImageFilename({
    propertyId,
    roomType,
    feature,
    imageNumber,
    isHero,
  });

  return {
    alt,
    title,
    caption,
    filename,
  };
}

/**
 * Generate SEO-friendly image filename
 */
function generateImageFilename({
  propertyId,
  roomType,
  feature,
  imageNumber,
  isHero,
}: {
  propertyId: string;
  roomType?: string;
  feature?: string;
  imageNumber?: number;
  isHero?: boolean;
}): string {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const parts = [propertyId];

  if (isHero) {
    parts.push('hero');
  } else if (roomType) {
    parts.push(sanitize(roomType));
  } else if (feature) {
    parts.push(sanitize(feature));
  }

  if (imageNumber) {
    parts.push(imageNumber.toString().padStart(2, '0'));
  }

  return `${parts.join('-')}.jpg`;
}

/**
 * Get room caption
 */
function getRoomCaption(
  roomType: string,
  propertyType: string,
  location: string
): string {
  const captions: Record<string, string> = {
    'salon': `Amplio salón con acabados de lujo y acceso directo a la terraza. ${propertyType} en ${location}.`,
    'master-bedroom': `Suite principal con vestidor, baño en suite y vistas panorámicas. ${propertyType} ${location}.`,
    'kitchen': `Cocina de diseño completamente equipada con electrodomésticos de alta gama. ${location}, Mallorca.`,
    'pool': `Piscina privada rodeada de terrazas y zonas de descanso. ${propertyType} de lujo en ${location}.`,
    'terrace': `Terraza con zona chill-out y vistas panorámicas. Perfecta para disfrutar del clima mediterráneo.`,
  };

  return captions[roomType] || '';
}

/**
 * Get feature caption
 */
function getFeatureCaption(
  feature: string,
  propertyType: string,
  location: string
): string {
  const featureLower = feature.toLowerCase();

  if (featureLower.includes('piscina')) {
    return `Espectacular piscina privada con zona de solárium. ${propertyType} de lujo en ${location}.`;
  }

  if (featureLower.includes('jardín')) {
    return `Jardín mediterráneo cuidadosamente diseñado con especies autóctonas. ${location}, Mallorca.`;
  }

  return '';
}

// ==============================================
// BATCH IMAGE PROCESSING
// ==============================================

/**
 * Generate metadata for multiple property images
 */
export function generatePropertyImagesMetadata({
  propertyId,
  propertyType,
  location,
  images,
}: {
  propertyId: string;
  propertyType: string;
  location: string;
  images: Array<{
    type: 'hero' | 'room' | 'feature' | 'view' | 'generic';
    roomType?: string;
    feature?: string;
    viewType?: string;
  }>;
}): ImageMetadata[] {
  return images.map((image, index) => {
    return generateImageMetadata({
      propertyId,
      propertyType,
      location,
      roomType: image.roomType,
      feature: image.feature,
      viewType: image.viewType,
      imageNumber: index + 1,
      isHero: image.type === 'hero',
    });
  });
}

// ==============================================
// ALT TEXT VALIDATION
// ==============================================

/**
 * Validate alt text for SEO best practices
 */
export function validateAltText(altText: string): {
  valid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Length check
  if (altText.length < 10) {
    issues.push('Alt text demasiado corto');
    suggestions.push('Añadir más contexto descriptivo');
  }

  if (altText.length > 125) {
    issues.push('Alt text demasiado largo (> 125 caracteres)');
    suggestions.push('Reducir a 100-125 caracteres para mejor SEO');
  }

  // Keyword stuffing check
  const words = altText.toLowerCase().split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordFrequency).filter(
    ([word, count]) => count > 2 && word.length > 3
  );

  if (repeatedWords.length > 0) {
    issues.push('Posible keyword stuffing detectado');
    suggestions.push(`Palabras repetidas: ${repeatedWords.map(([w]) => w).join(', ')}`);
  }

  // Phrases to avoid
  const bannedPhrases = [
    'imagen de',
    'foto de',
    'picture of',
    'image of',
  ];

  bannedPhrases.forEach(phrase => {
    if (altText.toLowerCase().includes(phrase)) {
      issues.push(`Evitar usar "${phrase}" en alt text`);
      suggestions.push('Describir directamente el contenido');
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    suggestions,
  };
}
