/**
 * Property Features Categorization & Optimization
 * Anclora Private Estates
 * 
 * Structured feature system for SEO and user experience
 */

export interface FeatureCategory {
  id: string;
  name: string;
  icon: string;
  priority: number;
  seoKeywords: string[];
}

export interface PropertyFeature {
  id: string;
  name: string;
  category: string;
  description: string;
  seoValue: 'high' | 'medium' | 'low';
  keywords: string[];
  icon?: string;
}

// ==============================================
// FEATURE CATEGORIES
// ==============================================

export const featureCategories: Record<string, FeatureCategory> = {
  // High-value categories (most searched)
  outdoor: {
    id: 'outdoor',
    name: 'Espacios Exteriores',
    icon: '🌳',
    priority: 1,
    seoKeywords: ['piscina', 'jardín', 'terraza', 'exterior', 'outdoor'],
  },
  
  security: {
    id: 'security',
    name: 'Seguridad',
    icon: '🔒',
    priority: 2,
    seoKeywords: ['alarma', 'seguridad', 'vigilancia', 'cámara', 'control acceso'],
  },

  technology: {
    id: 'technology',
    name: 'Tecnología',
    icon: '🤖',
    priority: 3,
    seoKeywords: ['domótica', 'smart home', 'automatización', 'tecnología'],
  },

  comfort: {
    id: 'comfort',
    name: 'Confort y Climatización',
    icon: '❄️',
    priority: 4,
    seoKeywords: ['climatización', 'calefacción', 'aire acondicionado', 'confort'],
  },

  premium: {
    id: 'premium',
    name: 'Extras Premium',
    icon: '⭐',
    priority: 5,
    seoKeywords: ['bodega', 'gimnasio', 'spa', 'cine', 'premium', 'lujo'],
  },

  views: {
    id: 'views',
    name: 'Vistas',
    icon: '🌅',
    priority: 6,
    seoKeywords: ['vistas', 'panorámicas', 'mar', 'montaña', 'golf'],
  },

  parking: {
    id: 'parking',
    name: 'Parking y Garaje',
    icon: '🚗',
    priority: 7,
    seoKeywords: ['garaje', 'parking', 'aparcamiento', 'plaza'],
  },

  energy: {
    id: 'energy',
    name: 'Eficiencia Energética',
    icon: '⚡',
    priority: 8,
    seoKeywords: ['solar', 'fotovoltaica', 'eficiencia', 'sostenible', 'aerotermia'],
  },

  interior: {
    id: 'interior',
    name: 'Acabados Interiores',
    icon: '🏠',
    priority: 9,
    seoKeywords: ['mármol', 'parquet', 'cocina', 'baño', 'acabados'],
  },

  location: {
    id: 'location',
    name: 'Ubicación',
    icon: '📍',
    priority: 10,
    seoKeywords: ['primera línea', 'centro', 'tranquilo', 'acceso', 'ubicación'],
  },
};

// ==============================================
// PROPERTY FEATURES DATABASE
// ==============================================

export const propertyFeatures: Record<string, PropertyFeature> = {
  // OUTDOOR FEATURES (High SEO value)
  'pool-infinity': {
    id: 'pool-infinity',
    name: 'Piscina Infinity',
    category: 'outdoor',
    description: 'Piscina de borde infinito con efecto visual de continuidad con el horizonte',
    seoValue: 'high',
    keywords: ['piscina infinity', 'piscina desbordante', 'infinity pool'],
    icon: '🏊',
  },

  'pool-heated': {
    id: 'pool-heated',
    name: 'Piscina Climatizada',
    category: 'outdoor',
    description: 'Piscina con sistema de climatización para uso durante todo el año',
    seoValue: 'high',
    keywords: ['piscina climatizada', 'piscina calefactada', 'heated pool'],
  },

  'pool-standard': {
    id: 'pool-standard',
    name: 'Piscina',
    category: 'outdoor',
    description: 'Piscina privada',
    seoValue: 'high',
    keywords: ['piscina', 'pool', 'swimming pool'],
  },

  'garden-mediterranean': {
    id: 'garden-mediterranean',
    name: 'Jardín Mediterráneo',
    category: 'outdoor',
    description: 'Jardín diseñado con plantas autóctonas mediterráneas de bajo mantenimiento',
    seoValue: 'medium',
    keywords: ['jardín mediterráneo', 'jardín diseño', 'mediterranean garden'],
  },

  'garden-tropical': {
    id: 'garden-tropical',
    name: 'Jardín Tropical',
    category: 'outdoor',
    description: 'Jardín con especies tropicales y sistema de riego automatizado',
    seoValue: 'medium',
    keywords: ['jardín tropical', 'tropical garden'],
  },

  'terrace-main': {
    id: 'terrace-main',
    name: 'Terraza Principal',
    category: 'outdoor',
    description: 'Amplia terraza conectada con salón principal',
    seoValue: 'high',
    keywords: ['terraza', 'terrace', 'outdoor living'],
  },

  'terrace-rooftop': {
    id: 'terrace-rooftop',
    name: 'Terraza en Azotea',
    category: 'outdoor',
    description: 'Terraza privada en la azotea con vistas panorámicas',
    seoValue: 'high',
    keywords: ['terraza azotea', 'rooftop terrace', 'ático'],
  },

  'bbq-area': {
    id: 'bbq-area',
    name: 'Zona de Barbacoa',
    category: 'outdoor',
    description: 'Área exterior equipada para barbacoas y comidas al aire libre',
    seoValue: 'medium',
    keywords: ['barbacoa', 'bbq', 'outdoor kitchen'],
  },

  'outdoor-kitchen': {
    id: 'outdoor-kitchen',
    name: 'Cocina Exterior',
    category: 'outdoor',
    description: 'Cocina completamente equipada en el exterior',
    seoValue: 'medium',
    keywords: ['cocina exterior', 'outdoor kitchen', 'summer kitchen'],
  },

  // SECURITY FEATURES (High SEO value)
  'alarm-system': {
    id: 'alarm-system',
    name: 'Sistema de Alarma',
    category: 'security',
    description: 'Sistema de alarma conectado a central de seguridad',
    seoValue: 'high',
    keywords: ['alarma', 'alarm system', 'seguridad'],
  },

  'security-cameras': {
    id: 'security-cameras',
    name: 'Cámaras de Seguridad',
    category: 'security',
    description: 'Sistema de videovigilancia con grabación',
    seoValue: 'high',
    keywords: ['cámaras seguridad', 'videovigilancia', 'cctv'],
  },

  'gated-community': {
    id: 'gated-community',
    name: 'Urbanización Cerrada',
    category: 'security',
    description: 'Urbanización con control de acceso y seguridad privada',
    seoValue: 'high',
    keywords: ['urbanización cerrada', 'gated community', 'seguridad 24h'],
  },

  'access-control': {
    id: 'access-control',
    name: 'Control de Acceso',
    category: 'security',
    description: 'Sistema de control de accesos con videoportero',
    seoValue: 'medium',
    keywords: ['control acceso', 'videoportero', 'access control'],
  },

  // TECHNOLOGY FEATURES (High SEO value)
  'smart-home': {
    id: 'smart-home',
    name: 'Sistema Domótica',
    category: 'technology',
    description: 'Sistema inteligente de control de iluminación, climatización y seguridad',
    seoValue: 'high',
    keywords: ['domótica', 'smart home', 'automatización', 'home automation'],
  },

  'fiber-internet': {
    id: 'fiber-internet',
    name: 'Fibra Óptica',
    category: 'technology',
    description: 'Conexión de fibra óptica de alta velocidad',
    seoValue: 'medium',
    keywords: ['fibra óptica', 'internet alta velocidad', 'fiber'],
  },

  'sound-system': {
    id: 'sound-system',
    name: 'Sistema de Sonido',
    category: 'technology',
    description: 'Sistema de audio integrado en toda la vivienda',
    seoValue: 'low',
    keywords: ['sonido', 'audio', 'music system'],
  },

  // COMFORT FEATURES (High SEO value)
  'underfloor-heating': {
    id: 'underfloor-heating',
    name: 'Calefacción Suelo Radiante',
    category: 'comfort',
    description: 'Sistema de calefacción por suelo radiante en toda la vivienda',
    seoValue: 'high',
    keywords: ['suelo radiante', 'calefacción', 'underfloor heating'],
  },

  'air-conditioning': {
    id: 'air-conditioning',
    name: 'Aire Acondicionado',
    category: 'comfort',
    description: 'Sistema de aire acondicionado centralizado',
    seoValue: 'high',
    keywords: ['aire acondicionado', 'climatización', 'air conditioning'],
  },

  'fireplace': {
    id: 'fireplace',
    name: 'Chimenea',
    category: 'comfort',
    description: 'Chimenea de leña o gas en salón principal',
    seoValue: 'medium',
    keywords: ['chimenea', 'fireplace', 'hogar'],
  },

  // PREMIUM FEATURES (High SEO value)
  'wine-cellar': {
    id: 'wine-cellar',
    name: 'Bodega de Vinos',
    category: 'premium',
    description: 'Bodega climatizada para almacenamiento de vinos',
    seoValue: 'high',
    keywords: ['bodega vinos', 'wine cellar', 'cava'],
  },

  'gym': {
    id: 'gym',
    name: 'Gimnasio',
    category: 'premium',
    description: 'Sala equipada como gimnasio privado',
    seoValue: 'high',
    keywords: ['gimnasio', 'gym', 'fitness'],
  },

  'spa': {
    id: 'spa',
    name: 'Spa',
    category: 'premium',
    description: 'Zona spa con sauna, jacuzzi y/o hammam',
    seoValue: 'high',
    keywords: ['spa', 'sauna', 'jacuzzi', 'wellness'],
  },

  'cinema-room': {
    id: 'cinema-room',
    name: 'Sala de Cine',
    category: 'premium',
    description: 'Sala dedicada con proyector y sistema de sonido cinematográfico',
    seoValue: 'medium',
    keywords: ['sala cine', 'home cinema', 'home theater'],
  },

  'elevator': {
    id: 'elevator',
    name: 'Ascensor',
    category: 'premium',
    description: 'Ascensor privado interno',
    seoValue: 'medium',
    keywords: ['ascensor', 'elevator', 'lift'],
  },

  // VIEWS (High SEO value)
  'sea-views': {
    id: 'sea-views',
    name: 'Vistas al Mar',
    category: 'views',
    description: 'Vistas panorámicas al mar Mediterráneo',
    seoValue: 'high',
    keywords: ['vistas mar', 'sea views', 'mediterráneo'],
  },

  'mountain-views': {
    id: 'mountain-views',
    name: 'Vistas a la Montaña',
    category: 'views',
    description: 'Vistas a la Serra de Tramuntana',
    seoValue: 'high',
    keywords: ['vistas montaña', 'mountain views', 'tramuntana'],
  },

  'golf-views': {
    id: 'golf-views',
    name: 'Vistas al Golf',
    category: 'views',
    description: 'Vistas al campo de golf',
    seoValue: 'medium',
    keywords: ['vistas golf', 'golf views'],
  },

  // PARKING (Medium SEO value)
  'garage-double': {
    id: 'garage-double',
    name: 'Garaje Doble',
    category: 'parking',
    description: 'Garaje privado para dos vehículos',
    seoValue: 'medium',
    keywords: ['garaje', 'parking', 'garage'],
  },

  'garage-triple': {
    id: 'garage-triple',
    name: 'Garaje Triple',
    category: 'parking',
    description: 'Garaje privado para tres o más vehículos',
    seoValue: 'medium',
    keywords: ['garaje', 'parking múltiple', 'garage'],
  },

  // ENERGY (Medium SEO value)
  'solar-panels': {
    id: 'solar-panels',
    name: 'Paneles Solares',
    category: 'energy',
    description: 'Sistema de paneles solares fotovoltaicos',
    seoValue: 'medium',
    keywords: ['paneles solares', 'solar panels', 'fotovoltaica'],
  },

  'aerothermal': {
    id: 'aerothermal',
    name: 'Aerotermia',
    category: 'energy',
    description: 'Sistema de climatización por aerotermia de alta eficiencia',
    seoValue: 'medium',
    keywords: ['aerotermia', 'aerothermal', 'eficiencia energética'],
  },

  // INTERIOR (Medium SEO value)
  'marble-floors': {
    id: 'marble-floors',
    name: 'Suelos de Mármol',
    category: 'interior',
    description: 'Pavimento de mármol en zonas nobles',
    seoValue: 'medium',
    keywords: ['mármol', 'marble', 'suelos lujo'],
  },

  'designer-kitchen': {
    id: 'designer-kitchen',
    name: 'Cocina de Diseño',
    category: 'interior',
    description: 'Cocina equipada con electrodomésticos de alta gama',
    seoValue: 'high',
    keywords: ['cocina diseño', 'designer kitchen', 'cocina lujo'],
  },

  // LOCATION (High SEO value)
  'beachfront': {
    id: 'beachfront',
    name: 'Primera Línea de Mar',
    category: 'location',
    description: 'Propiedad en primera línea con acceso directo a la playa',
    seoValue: 'high',
    keywords: ['primera línea', 'beachfront', 'frente mar'],
  },

  'golf-frontline': {
    id: 'golf-frontline',
    name: 'Primera Línea de Golf',
    category: 'location',
    description: 'Propiedad con acceso directo al campo de golf',
    seoValue: 'high',
    keywords: ['primera línea golf', 'golf frontline'],
  },
};

// ==============================================
// FEATURE HELPERS
// ==============================================

/**
 * Get features by category
 */
export function getFeaturesByCategory(categoryId: string): PropertyFeature[] {
  return Object.values(propertyFeatures).filter(
    feature => feature.category === categoryId
  );
}

/**
 * Get high-value SEO features
 */
export function getHighValueFeatures(): PropertyFeature[] {
  return Object.values(propertyFeatures).filter(
    feature => feature.seoValue === 'high'
  );
}

/**
 * Categorize raw features array
 */
export function categorizeFeatures(features: string[]): Record<string, string[]> {
  const categorized: Record<string, string[]> = {};

  features.forEach(feature => {
    // Try to match with known features
    const knownFeature = Object.values(propertyFeatures).find(
      f => f.name.toLowerCase() === feature.toLowerCase()
    );

    if (knownFeature) {
      const category = knownFeature.category;
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(feature);
    } else {
      // Uncategorized
      if (!categorized['other']) {
        categorized['other'] = [];
      }
      categorized['other'].push(feature);
    }
  });

  return categorized;
}

/**
 * Get feature keywords for SEO
 */
export function getFeatureKeywords(features: string[]): string[] {
  const keywords: string[] = [];

  features.forEach(feature => {
    const knownFeature = Object.values(propertyFeatures).find(
      f => f.name.toLowerCase() === feature.toLowerCase()
    );

    if (knownFeature) {
      keywords.push(...knownFeature.keywords);
    }
  });

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Sort features by SEO priority
 */
export function sortFeaturesBySEO(features: string[]): string[] {
  return features.sort((a, b) => {
    const featureA = Object.values(propertyFeatures).find(
      f => f.name.toLowerCase() === a.toLowerCase()
    );
    const featureB = Object.values(propertyFeatures).find(
      f => f.name.toLowerCase() === b.toLowerCase()
    );

    if (!featureA || !featureB) return 0;

    const seoOrder = { high: 1, medium: 2, low: 3 };
    return seoOrder[featureA.seoValue] - seoOrder[featureB.seoValue];
  });
}
