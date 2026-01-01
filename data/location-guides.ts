/**
 * Location Guides - Mallorca Premium Areas
 * Anclora Private Estates
 * 
 * Comprehensive location guides for SEO and user information
 */

export interface LocationGuide {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  overview: string;
  demographics: {
    population?: number;
    internationalCommunity: boolean;
    primaryNationalities?: string[];
  };
  realEstate: {
    priceRange: {
      min: number;
      max: number;
    };
    averagePrice: number;
    propertyTypes: string[];
    marketTrend: 'rising' | 'stable' | 'premium';
    annualAppreciation?: number;
  };
  lifestyle: {
    atmosphere: string;
    idealFor: string[];
    activities: string[];
    restaurants: string[];
    shopping: string[];
  };
  amenities: {
    schools?: string[];
    healthCare?: string[];
    sports?: string[];
    beaches?: string[];
    golf?: string[];
  };
  transportation: {
    airportDistance: number;
    palmaDistance: number;
    parking: string;
    publicTransport?: string[];
  };
  highlights: string[];
  seasonality: {
    peak: string;
    lowSeason: string;
    yearRound: boolean;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  metaDescription: string;
  keywords: string[];
}

// ==============================================
// SON VIDA
// ==============================================

export const sonVida: LocationGuide = {
  id: 'son-vida',
  name: 'Son Vida',
  slug: 'son-vida',
  tagline: 'La Zona Residencial Más Exclusiva de Mallorca',
  description: 'Son Vida representa el pináculo del lujo residencial en Mallorca. Esta exclusiva urbanización en las colinas de Palma combina privacidad absoluta, seguridad 24 horas y proximidad al centro de la ciudad.',
  
  overview: `Son Vida es sinónimo de exclusividad en Mallorca. Situada en las colinas al noreste de Palma, esta zona residencial de lujo ofrece vistas panorámicas a la bahía de Palma y las montañas de Tramuntana. Con tres campos de golf de campeonato, el Hotel Castillo Son Vida y villas de diseño excepcional, Son Vida es el hogar de la élite internacional.

La urbanización cuenta con seguridad privada permanente y mantiene un ambiente de privacidad total. A pesar de estar a solo 5 minutos del centro de Palma, Son Vida es un oasis de tranquilidad donde cada propiedad es única y especial.

El precio medio de las propiedades supera los 3 millones de euros, con villas excepcionales que alcanzan los 15-20 millones. La demanda es constante y la oferta limitada, lo que garantiza una excelente revalorización a largo plazo.`,

  demographics: {
    population: 1500,
    internationalCommunity: true,
    primaryNationalities: ['Alemanes', 'Británicos', 'Escandinavos', 'Españoles'],
  },

  realEstate: {
    priceRange: {
      min: 2000000,
      max: 20000000,
    },
    averagePrice: 3500000,
    propertyTypes: ['Villas de Lujo', 'Mansiones', 'Chalets Modernos'],
    marketTrend: 'premium',
    annualAppreciation: 8,
  },

  lifestyle: {
    atmosphere: 'Exclusivo, tranquilo, seguro. Ambiente internacional con privacidad total.',
    idealFor: [
      'Familias de alto poder adquisitivo',
      'Ejecutivos internacionales',
      'Amantes del golf',
      'Quienes buscan privacidad y exclusividad',
    ],
    activities: [
      'Golf en tres campos de campeonato',
      'Tenis en clubes privados',
      'Ciclismo en rutas panorámicas',
      'Senderismo en la Serra de Tramuntana',
      'Gastronomía en restaurantes de lujo',
    ],
    restaurants: [
      'Es Racó d\'es Teix (Estrella Michelin)',
      'Zaranda (2 Estrellas Michelin) - Castillo Hotel Son Vida',
      'Restaurante Son Vida',
      'Golf Son Vida Clubhouse',
    ],
    shopping: [
      'Palma Centro (5 minutos)',
      'FAN Mallorca Shopping Center (10 minutos)',
      'Porto Pi Centro (8 minutos)',
    ],
  },

  amenities: {
    schools: [
      'Bellver International College',
      'Agora Portals International School',
      'Eurocampus',
    ],
    healthCare: [
      'Hospital Quirónsalud Palmaplanas',
      'Clínica Juaneda',
    ],
    sports: [
      'Real Golf de Bendinat',
      'Son Vida Golf',
      'Son Quint Golf',
      'Club de Tenis Son Vida',
    ],
    golf: [
      'Son Vida Golf (diseño por F. W. Hawtree)',
      'Son Muntaner Golf (diseño por Kurt Rossknecht)',
      'Son Quint Golf',
    ],
  },

  transportation: {
    airportDistance: 12,
    palmaDistance: 5,
    parking: 'Todas las propiedades incluyen garaje privado múltiple',
    publicTransport: ['Bus línea 46', 'Taxis disponibles'],
  },

  highlights: [
    'Zona residencial más exclusiva de Mallorca',
    'Seguridad privada 24/7',
    'Tres campos de golf de campeonato',
    'Vistas panorámicas a la bahía de Palma',
    'A 5 minutos del centro de Palma',
    'Hotel 5* Gran Lujo Castillo Son Vida',
    'Privacidad absoluta',
    'Comunidad internacional establecida',
  ],

  seasonality: {
    peak: 'Todo el año - Residentes permanentes',
    lowSeason: 'N/A',
    yearRound: true,
  },

  coordinates: {
    latitude: 39.5954,
    longitude: 2.6502,
  },

  images: [
    '/images/locations/son-vida/overview.jpg',
    '/images/locations/son-vida/golf.jpg',
    '/images/locations/son-vida/views.jpg',
  ],

  metaDescription: 'Son Vida, Palma: La zona residencial más exclusiva de Mallorca. Villas de lujo, golf de campeonato, seguridad 24h. Propiedades desde €2M. Revalorización 8% anual.',

  keywords: [
    'son vida mallorca',
    'villas lujo son vida',
    'propiedades exclusivas palma',
    'golf son vida',
    'inmobiliaria son vida',
    'comprar casa son vida',
  ],
};

// ==============================================
// PORT D'ANDRATX
// ==============================================

export const portAndratx: LocationGuide = {
  id: 'port-andratx',
  name: 'Port d\'Andratx',
  slug: 'port-andratx',
  tagline: 'El Puerto Natural Más Bello del Mediterráneo',
  description: 'Port d\'Andratx combina el encanto de un auténtico pueblo marinero mallorquín con la sofisticación de un destino internacional de primer nivel.',
  
  overview: `Port d'Andratx es uno de los puertos naturales más hermosos y protegidos del Mediterráneo. Situado en la costa suroeste de Mallorca, este exclusivo enclave ha sabido mantener su autenticidad mientras se convierte en uno de los destinos preferidos de la élite europea.

El puerto deportivo alberga yates de lujo y el paseo marítimo está repleto de restaurantes gourmet y galerías de arte. Las propiedades en primera línea de mar ofrecen vistas espectaculares y acceso directo al puerto. La zona residencial en las colinas circundantes proporciona privacidad y panorámicas excepcionales.

Port d'Andratx es especialmente popular entre alemanes y escandinavos, creando una comunidad internacional vibrante que respeta el carácter mediterráneo del lugar. La demanda de propiedades en primera línea supera ampliamente la oferta, convirtiendo Port d'Andratx en una de las inversiones inmobiliarias más seguras de Mallorca.`,

  demographics: {
    population: 3000,
    internationalCommunity: true,
    primaryNationalities: ['Alemanes', 'Escandinavos', 'Británicos', 'Españoles'],
  },

  realEstate: {
    priceRange: {
      min: 1500000,
      max: 15000000,
    },
    averagePrice: 3000000,
    propertyTypes: ['Villas Primera Línea', 'Apartamentos Puerto', 'Villas con Vistas'],
    marketTrend: 'rising',
    annualAppreciation: 10,
  },

  lifestyle: {
    atmosphere: 'Sofisticado pero relajado. Mediterráneo auténtico con servicios internacionales.',
    idealFor: [
      'Amantes del mar y la navegación',
      'Gourmets y sibaritas',
      'Familias que buscan calidad de vida',
      'Inversores en propiedades premium',
    ],
    activities: [
      'Navegación y deportes náuticos',
      'Senderismo en la Serra de Tramuntana',
      'Ciclismo profesional',
      'Buceo en calas vírgenes',
      'Pesca deportiva',
    ],
    restaurants: [
      'Oliu (Estrella Michelin)',
      'Villa Italia',
      'Trespais',
      'Rocamar',
      'Moments',
    ],
    shopping: [
      'Boutiques locales en el puerto',
      'Galerías de arte',
      'Andratx pueblo (5 minutos)',
      'Palma (30 minutos)',
    ],
  },

  amenities: {
    schools: [
      'Col·legi Rei Jaume III (Andratx)',
      'Colegios internacionales en zona (15-20 min)',
    ],
    healthCare: [
      'Centro de Salud Andratx',
      'Hospital de Ponent (20 minutos)',
    ],
    sports: [
      'Club Náutico Port d\'Andratx',
      'Club de Vela',
      'Centro de buceo',
    ],
    beaches: [
      'Cala Llamp',
      'Cala Moragues',
      'Cala Egos',
      'Camp de Mar (10 min)',
    ],
  },

  transportation: {
    airportDistance: 45,
    palmaDistance: 30,
    parking: 'Limitado en puerto, amplio en propiedades privadas',
    publicTransport: ['Bus línea 102 a Palma'],
  },

  highlights: [
    'Puerto natural protegido',
    'Paseo marítimo con restaurantes gourmet',
    'Primera línea de mar exclusiva',
    'Comunidad internacional establecida',
    'Calas vírgenes cercanas',
    'Atmósfera mediterránea auténtica',
    'Revalorización constante (10% anual)',
    'Senderismo en Tramuntana (UNESCO)',
  ],

  seasonality: {
    peak: 'Mayo a Octubre',
    lowSeason: 'Noviembre a Abril - Muy tranquilo',
    yearRound: false,
  },

  coordinates: {
    latitude: 39.5429,
    longitude: 2.3878,
  },

  images: [
    '/images/locations/port-andratx/harbor.jpg',
    '/images/locations/port-andratx/waterfront.jpg',
    '/images/locations/port-andratx/sunset.jpg',
  ],

  metaDescription: 'Port d\'Andratx: Puerto natural exclusivo en Mallorca. Villas primera línea, yates de lujo, gastronomía gourmet. Propiedades desde €1.5M. Revalorización 10% anual.',

  keywords: [
    'port andratx mallorca',
    'villas puerto andratx',
    'primera linea puerto andratx',
    'inmobiliaria puerto andratx',
    'comprar propiedad puerto andratx',
  ],
};

// ==============================================
// PALMA CENTRO
// ==============================================

export const palmaCentro: LocationGuide = {
  id: 'palma-centro',
  name: 'Palma Centro',
  slug: 'palma-centro',
  tagline: 'Historia, Cultura y Vida Urbana Mediterránea',
  description: 'El casco antiguo de Palma combina más de 2000 años de historia con la vibrante vida cosmopolita de una capital mediterránea moderna.',
  
  overview: `Palma Centro es un tesoro arquitectónico donde conviven palacios góticos, patios renacentistas y edificios modernistas. Vivir en el casco antiguo significa estar a pasos de la Catedral, boutiques de lujo en el Paseo del Borne, restaurantes con Estrella Michelin y una agenda cultural permanente.

Los apartamentos y áticos en edificios históricos restaurados son muy cotizados, especialmente aquellos con terrazas y vistas a la Catedral o al mar. El barrio de Santa Catalina, antiguamente marinero, se ha convertido en el epicentro gastronómico y bohemio de la ciudad.

La Lonja, Calatrava y La Seu son algunos de los barrios más exclusivos, donde cada propiedad es única. El mercado inmobiliario en Palma Centro es muy dinámico, con demanda internacional constante y oferta limitada debido a las restricciones de construcción en el casco histórico protegido.`,

  demographics: {
    population: 25000,
    internationalCommunity: true,
    primaryNationalities: ['Españoles', 'Alemanes', 'Británicos', 'Franceses', 'Italianos'],
  },

  realEstate: {
    priceRange: {
      min: 500000,
      max: 5000000,
    },
    averagePrice: 1200000,
    propertyTypes: ['Áticos con Terraza', 'Apartamentos Históricos', 'Penthouses Modernistas'],
    marketTrend: 'rising',
    annualAppreciation: 7,
  },

  lifestyle: {
    atmosphere: 'Urbano, cosmopolita, cultural. Mediterráneo con sofisticación europea.',
    idealFor: [
      'Amantes de la cultura y el arte',
      'Profesionales que trabajan en Palma',
      'Personas que valoran la vida a pie',
      'Inversores en alquiler turístico premium',
    ],
    activities: [
      'Galerías de arte y museos',
      'Teatros y conciertos',
      'Compras en boutiques de diseño',
      'Gastronomía internacional',
      'Mercados tradicionales',
    ],
    restaurants: [
      'Marc Fosh (Estrella Michelin)',
      'Adrián Quetglas (Estrella Michelin)',
      'Andreu Genestra (Estrella Michelin)',
      'Forn de Sant Joan',
      'Celler Sa Premsa',
    ],
    shopping: [
      'Paseo del Borne (boutiques lujo)',
      'Jaume III (marcas internacionales)',
      'Santa Catalina (tiendas locales)',
      'Mercat de l\'Olivar',
    ],
  },

  amenities: {
    schools: [
      'Colegios privados en Palma',
      'Instituto Ramon Llull',
    ],
    healthCare: [
      'Hospital Son Espases',
      'Hospital Quirónsalud Palmaplanas',
      'Clínica Juaneda',
    ],
    sports: [
      'Club Náutico Palma',
      'Real Club Náutico',
      'Gimnasios boutique',
    ],
  },

  transportation: {
    airportDistance: 10,
    palmaDistance: 0,
    parking: 'Limitado - parkings públicos y privados',
    publicTransport: ['Metro', 'Autobuses EMT', 'Bicicletas públicas'],
  },

  highlights: [
    'Catedral de Mallorca (La Seu)',
    'Palacio de la Almudaina',
    'Paseo del Borne - shopping de lujo',
    'Vida cultural intensa',
    'Gastronomía de primer nivel',
    'Todo accesible a pie',
    'Arquitectura histórica única',
    'Conexión perfecta (metro, aeropuerto)',
  ],

  seasonality: {
    peak: 'Todo el año',
    lowSeason: 'N/A',
    yearRound: true,
  },

  coordinates: {
    latitude: 39.5696,
    longitude: 2.6502,
  },

  images: [
    '/images/locations/palma-centro/cathedral.jpg',
    '/images/locations/palma-centro/paseo-borne.jpg',
    '/images/locations/palma-centro/santa-catalina.jpg',
  ],

  metaDescription: 'Palma Centro: Vida urbana mediterránea en casco histórico. Áticos con terraza, apartamentos exclusivos. Desde €500K. Cultura, gastronomía, shopping de lujo.',

  keywords: [
    'palma centro mallorca',
    'atico palma centro',
    'comprar apartamento palma',
    'casco antiguo palma',
    'inmobiliaria palma centro',
  ],
};

// ==============================================
// ALL LOCATIONS REGISTRY
// ==============================================

export const locationGuides: Record<string, LocationGuide> = {
  'son-vida': sonVida,
  'port-andratx': portAndratx,
  'palma-centro': palmaCentro,
  // Additional locations can be added here
};

/**
 * Get location guide by slug
 */
export function getLocationGuide(slug: string): LocationGuide | undefined {
  return locationGuides[slug];
}

/**
 * Get all location guides
 */
export function getAllLocationGuides(): LocationGuide[] {
  return Object.values(locationGuides);
}

/**
 * Get location names for navigation
 */
export function getLocationNames(): Array<{ slug: string; name: string }> {
  return Object.values(locationGuides).map(location => ({
    slug: location.slug,
    name: location.name,
  }));
}
