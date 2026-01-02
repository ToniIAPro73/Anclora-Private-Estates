/**
 * Location Guides - Mallorca Premium Areas
 * Anclora Private Estates
 * 
 * Comprehensive location guides for SEO and user information
 */

import type { Translation } from '@/types';

export interface LocationGuide {
  id: string;
  name: string;
  slug: string;
  tagline: Translation;
  description: Translation;
  overview: Translation;
  demographics: {
    population?: number;
    internationalCommunity: boolean;
    primaryNationalities?: Translation;
  };
  realEstate: {
    priceRange: {
      min: number;
      max: number;
    };
    averagePrice: number;
    propertyTypes: Translation;
    marketTrend: 'rising' | 'stable' | 'premium';
    annualAppreciation?: number;
  };
  lifestyle: {
    atmosphere: Translation;
    idealFor: Translation;
    activities: Translation;
    restaurants: Translation;
    shopping: Translation;
  };
  amenities: {
    schools?: Translation;
    healthCare?: Translation;
    sports?: Translation;
    beaches?: Translation;
    golf?: Translation;
  };
  transportation: {
    airportDistance: number;
    palmaDistance: number;
    parking: Translation;
    publicTransport?: Translation;
  };
  highlights: Translation;
  seasonality: {
    peak: Translation;
    lowSeason: Translation;
    yearRound: boolean;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  metaDescription: Translation;
  keywords: string[];
}

// ==============================================
// SON VIDA
// ==============================================

export const sonVida: LocationGuide = {
  id: 'son-vida',
  name: 'Son Vida',
  slug: 'son-vida',
  tagline: {
    es: 'La Zona Residencial Más Exclusiva de Mallorca',
    en: 'The Most Exclusive Residential Area in Mallorca',
    de: 'Das exklusivste Wohnviertel auf Mallorca',
  },
  description: {
    es: 'Son Vida representa el pináculo del lujo residencial en Mallorca. Esta exclusiva urbanización en las colinas de Palma combina privacidad absoluta, seguridad 24 horas y proximidad al centro de la ciudad.',
    en: 'Son Vida represents the pinnacle of residential luxury in Mallorca. This exclusive development in the hills of Palma combines absolute privacy, 24-hour security, and proximity to the city center.',
    de: 'Son Vida stellt den Gipfel des luxuriösen Wohnens auf Mallorca dar. Diese exklusive Siedlung in den Hügeln von Palma bietet absolute Privatsphäre, 24-Stunden-Sicherheitsdienst und die Nähe zum Stadtzentrum.',
  },
  
  overview: {
    es: `Son Vida es sinónimo de exclusividad en Mallorca. Situada en las colinas al noreste de Palma, esta zona residencial de lujo ofrece vistas panorámicas a la bahía de Palma y las montañas de Tramuntana. Con tres campos de golf de campeonato, el Hotel Castillo Son Vida y villas de diseño excepcional, Son Vida es el hogar de la élite internacional.`,
    en: `Son Vida is synonymous with exclusivity in Mallorca. Located in the hills northeast of Palma, this luxury residential area offers panoramic views of Palma Bay and the Tramuntana mountains. With three championship golf courses, the Castillo Son Vida Hotel, and villas of exceptional design, Son Vida is home to the international elite.`,
    de: `Son Vida ist ein Synonym für Exklusivität auf Mallorca. In den Hügeln nordöstlich von Palma gelegen, bietet diese Luxuswohngegend einen Panoramablick auf die Bucht von Palma und das Tramuntana-Gebirge. Mit drei Meisterschaftsgolfplätzen, dem Castillo Son Vida Hotel und Villen von außergewöhnlichem Design ist Son Vida die Heimat der internationalen Elite.`,
  },

  demographics: {
    population: 1500,
    internationalCommunity: true,
    primaryNationalities: {
      es: 'Alemanes, Británicos, Escandinavos, Españoles',
      en: 'Germans, British, Scandinavians, Spanish',
      de: 'Deutsche, Briten, Skandinavier, Spanier',
    },
  },

  realEstate: {
    priceRange: {
      min: 2000000,
      max: 20000000,
    },
    averagePrice: 3500000,
    propertyTypes: {
      es: 'Villas de Lujo, Mansiones, Chalets Modernos',
      en: 'Luxury Villas, Mansions, Modern Chalets',
      de: 'Luxusvillen, Herrenhäuser, moderne Chalets',
    },
    marketTrend: 'premium',
    annualAppreciation: 8,
  },

  lifestyle: {
    atmosphere: {
      es: 'Exclusivo, tranquilo, seguro. Ambiente internacional con privacidad total.',
      en: 'Exclusive, quiet, secure. International atmosphere with total privacy.',
      de: 'Exklusiv, ruhig, sicher. Internationale Atmosphäre mit absoluter Privatsphäre.',
    },
    idealFor: {
      es: 'Familias de alto poder adquisitivo, Ejecutivos internacionales, Amantes del golf',
      en: 'High-net-worth families, International executives, Golf lovers',
      de: 'Vermögende Familien, internationale Führungskräfte, Golfliebhaber',
    },
    activities: {
      es: 'Golf, Tenis, Ciclismo, Senderismo, Gastronomía de lujo',
      en: 'Golf, Tennis, Cycling, Hiking, Luxury gastronomy',
      de: 'Golf, Tennis, Radfahren, Wandern, Luxusgastronomie',
    },
    restaurants: {
      es: 'Es Racó d\'es Teix, Zaranda, Restaurante Son Vida',
      en: 'Es Racó d\'es Teix, Zaranda, Son Vida Restaurant',
      de: 'Es Racó d\'es Teix, Zaranda, Son Vida Restaurant',
    },
    shopping: {
      es: 'Palma Centro, FAN Mallorca, Porto Pi',
      en: 'Palma Center, FAN Mallorca, Porto Pi',
      de: 'Palma Zentrum, FAN Mallorca, Porto Pi',
    },
  },

  amenities: {
    schools: {
      es: 'Bellver International College, Agora Portals, Eurocampus',
      en: 'Bellver International College, Agora Portals, Eurocampus',
      de: 'Bellver International College, Agora Portals, Eurocampus',
    },
    healthCare: {
      es: 'Hospital Quirónsalud Palmaplanas, Clínica Juaneda',
      en: 'Quirónsalud Palmaplanas Hospital, Juaneda Clinic',
      de: 'Krankenhaus Quirónsalud Palmaplanas, Klinik Juaneda',
    },
    sports: {
      es: 'Real Golf de Bendinat, Son Vida Golf, Son Quint Golf, Club de Tenis Son Vida',
      en: 'Real Golf de Bendinat, Son Vida Golf, Son Quint Golf, Son Vida Tennis Club',
      de: 'Real Golf de Bendinat, Son Vida Golf, Son Quint Golf, Tennisclub Son Vida',
    },
    golf: {
      es: 'Son Vida Golf, Son Muntaner Golf, Son Quint Golf',
      en: 'Son Vida Golf, Son Muntaner Golf, Son Quint Golf',
      de: 'Son Vida Golf, Son Muntaner Golf, Son Quint Golf',
    },
  },

  transportation: {
    airportDistance: 12,
    palmaDistance: 5,
    parking: {
      es: 'Garaje privado múltiple incluido',
      en: 'Multiple private garage included',
      de: 'Mehrere private Garagen inklusive',
    },
    publicTransport: {
      es: 'Bus línea 46, Taxis',
      en: 'Bus line 46, Taxis',
      de: 'Buslinie 46, Taxis',
    },
  },

  highlights: {
    es: 'Seguridad 24/7, Vistas panorámicas, Campos de golf, Hotel 5* Lujo',
    en: '24/7 Security, Panoramic views, Golf courses, 5* Luxury Hotel',
    de: '24/7 Sicherheit, Panoramablick, Golfplätze, 5* Luxushotel',
  },

  seasonality: {
    peak: {
      es: 'Todo el año',
      en: 'Year-round',
      de: 'Ganzjährig',
    },
    lowSeason: {
      es: 'N/A',
      en: 'N/A',
      de: 'N/A',
    },
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

  metaDescription: {
    es: 'Son Vida: Villas de lujo, golf de campeonato, seguridad 24h.',
    en: 'Son Vida: Luxury villas, championship golf, 24h security.',
    de: 'Son Vida: Luxusvillen, Meisterschaftsgolf, 24h Sicherheit.',
  },

  keywords: [
    'son vida mallorca',
    'villas lujo son vida',
    'propiedades exclusivas palma',
    'golf son vida',
  ],
};

// ==============================================
// PORT D'ANDRATX
// ==============================================

export const portAndratx: LocationGuide = {
  id: 'port-andratx',
  name: 'Port d\'Andratx',
  slug: 'port-andratx',
  tagline: {
    es: 'El Puerto Natural Más Bello del Mediterráneo',
    en: 'The Most Beautiful Natural Port in the Mediterranean',
    de: 'Der schönste Naturhafen im Mittelmeer',
  },
  description: {
    es: 'Port d\'Andratx combina el encanto de un auténtico pueblo marinero mallorquín con la sofisticación de un destino internacional de primer nivel.',
    en: 'Port d\'Andratx combines the charm of an authentic Mallorcan fishing village with the sophistication of a top-tier international destination.',
    de: 'Port d\'Andratx kombiniert den Charme eines authentischen mallorquinischen Fischerdorfes mit der Raffinesse eines erstklassigen internationalen Reiseziels.',
  },
  
  overview: {
    es: `Port d'Andratx es uno de los puertos naturales más hermosos y protegidos del Mediterráneo. Situado en la costa suroeste de Mallorca, este exclusivo enclave ha sabido mantener su autenticidad mientras se convierte en uno de los destinos preferidos de la élite europea.`,
    en: `Port d'Andratx is one of the most beautiful and protected natural harbors in the Mediterranean. Located on the southwest coast of Mallorca, this exclusive enclave has managed to maintain its authenticity while becoming one of the preferred destinations for the European elite.`,
    de: `Port d'Andratx ist einer der schönsten und bestgeschützten Naturhäfen im Mittelmeer. An der Südwestküste Mallorcas gelegen, hat es diese exklusive Enklave verstanden, ihre Authentizität zu bewahren, während sie zu einem der bevorzugten Reiseziele der europäischen Elite wurde.`,
  },

  demographics: {
    population: 3000,
    internationalCommunity: true,
    primaryNationalities: {
      es: 'Alemanes, Escandinavos, Británicos, Españoles',
      en: 'Germans, Scandinavians, British, Spanish',
      de: 'Deutsche, Skandinavier, Briten, Spanier',
    },
  },

  realEstate: {
    priceRange: {
      min: 1500000,
      max: 15000000,
    },
    averagePrice: 3000000,
    propertyTypes: {
      es: 'Villas Primera Línea, Apartamentos Puerto, Villas con Vistas',
      en: 'First-line Villas, Port Apartments, Villas with Views',
      de: 'Villen in erster Meereslinie, Hafenapartments, Villen mit Aussicht',
    },
    marketTrend: 'rising',
    annualAppreciation: 10,
  },

  lifestyle: {
    atmosphere: {
      es: 'Sofisticado pero relajado. Mediterráneo auténtico con servicios internacionales.',
      en: 'Sophisticated yet relaxed. Authentic Mediterranean with international services.',
      de: 'Raffiniert und dennoch entspannt. Authentisch mediterran mit internationalen Dienstleistungen.',
    },
    idealFor: {
      es: 'Amantes del mar y la navegación, Gourmets, Familias, Inversores',
      en: 'Sea and sailing lovers, Gourmets, Families, Investors',
      de: 'Meer- und Segelliebhaber, Feinschmecker, Familien, Investoren',
    },
    activities: {
      es: 'Navegación, Senderismo, Ciclismo, Buceo, Pesca deportiva',
      en: 'Sailing, Hiking, Cycling, Diving, Sport fishing',
      de: 'Segeln, Wandern, Radfahren, Tauchen, Sportfischen',
    },
    restaurants: {
      es: 'Oliu, Villa Italia, Trespais, Rocamar, Moments',
      en: 'Oliu, Villa Italia, Trespais, Rocamar, Moments',
      de: 'Oliu, Villa Italia, Trespais, Rocamar, Moments',
    },
    shopping: {
      es: 'Boutiques locales, Galerías de arte, Andratx pueblo',
      en: 'Local boutiques, Art galleries, Andratx town',
      de: 'Lokale Boutiquen, Kunstgalerien, Andratx Dorf',
    },
  },

  amenities: {
    schools: {
      es: 'Col·legi Rei Jaume III, Colegios internacionales cercanos',
      en: 'Rei Jaume III School, Nearby international schools',
      de: 'Schule Rei Jaume III, nahegelegene internationale Schulen',
    },
    healthCare: {
      es: 'Centro de Salud Andratx, Hospital de Ponent',
      en: 'Andratx Health Center, Ponent Hospital',
      de: 'Gesundheitszentrum Andratx, Krankenhaus Ponent',
    },
    sports: {
      es: 'Club Náutico Port d\'Andratx, Club de Vela, Centro de buceo',
      en: 'Port d\'Andratx Yacht Club, Sailing Club, Diving Center',
      de: 'Yachtclub Port d\'Andratx, Segelclub, Tauchzentrum',
    },
    beaches: {
      es: 'Cala Llamp, Cala Moragues, Cala Egos, Camp de Mar',
      en: 'Cala Llamp, Cala Moragues, Cala Egos, Camp de Mar',
      de: 'Cala Llamp, Cala Moragues, Cala Egos, Camp de Mar',
    },
  },

  transportation: {
    airportDistance: 45,
    palmaDistance: 30,
    parking: {
      es: 'Amplio en propiedades privadas',
      en: 'Ample in private properties',
      de: 'Großzügig auf Privatgrundstücken',
    },
    publicTransport: {
      es: 'Bus línea 102 a Palma',
      en: 'Bus line 102 to Palma',
      de: 'Buslinie 102 nach Palma',
    },
  },

  highlights: {
    es: 'Puerto natural, Gastronomía gourmet, Primera línea exclusiva',
    en: 'Natural harbor, Gourmet gastronomy, Exclusive first line',
    de: 'Naturhafen, Gourmetgastronomie, exklusive erste Linie',
  },

  seasonality: {
    peak: {
      es: 'Mayo a Octubre',
      en: 'May to October',
      de: 'Mai bis Oktober',
    },
    lowSeason: {
      es: 'Noviembre a Abril',
      en: 'November to April',
      de: 'November bis April',
    },
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

  metaDescription: {
    es: 'Port d\'Andratx: Villas primera línea, yates de lujo, gastronomía gourmet.',
    en: 'Port d\'Andratx: First-line villas, luxury yachts, gourmet gastronomy.',
    de: 'Port d\'Andratx: Villen in erster Meereslinie, Luxusyachten, Gourmetgastronomie.',
  },

  keywords: [
    'port andratx mallorca',
    'villas puerto andratx',
    'primera linea puerto andratx',
  ],
};

// ==============================================
// PALMA CENTRO
// ==============================================

export const palmaCentro: LocationGuide = {
  id: 'palma-centro',
  name: 'Palma Centro',
  slug: 'palma-centro',
  tagline: {
    es: 'Historia, Cultura y Vida Urbana Mediterránea',
    en: 'History, Culture, and Mediterranean Urban Life',
    de: 'Geschichte, Kultur und mediterranes Stadtleben',
  },
  description: {
    es: 'El casco antiguo de Palma combina más de 2000 años de historia con la vibrante vida cosmopolita de una capital mediterránea moderna.',
    en: 'The old town of Palma combines over 2000 years of history with the vibrant cosmopolitan life of a modern Mediterranean capital.',
    de: 'Die Altstadt von Palma verbindet über 2000 Jahre Geschichte mit dem pulsierenden kosmopolitischen Leben einer modernen mediterranen Hauptstadt.',
  },
  
  overview: {
    es: `Palma Centro es un tesoro arquitectónico donde conviven palacios góticos, patios renacentistas y edificios modernistas. Vivir en el casco antiguo significa estar a pasos de la Catedral, boutiques de lujo y cultura constante.`,
    en: `Palma Center is an architectural treasure where Gothic palaces, Renaissance courtyards, and Modernist buildings coexist. Living in the old town means being steps away from the Cathedral, luxury boutiques, and constant culture.`,
    de: `Palma Zentrum ist ein architektonischer Schatz, in dem gotische Paläste, Renaissance-Innenhöfe und modernistische Gebäude nebeneinander existieren. Das Leben in der Altstadt bedeutet, nur wenige Schritte von der Kathedrale, Luxusboutiquen und ständiger Kultur entfernt zu sein.`,
  },

  demographics: {
    population: 25000,
    internationalCommunity: true,
    primaryNationalities: {
      es: 'Españoles, Alemanes, Británicos, Franceses, Italianos',
      en: 'Spanish, Germans, British, French, Italians',
      de: 'Spanier, Deutsche, Briten, Franzosen, Italiener',
    },
  },

  realEstate: {
    priceRange: {
      min: 500000,
      max: 5000000,
    },
    averagePrice: 1200000,
    propertyTypes: {
      es: 'Áticos con Terraza, Apartamentos Históricos, Penthouses Modernistas',
      en: 'Penthouses with Terrace, Historical Apartments, Modernist Penthouses',
      de: 'Penthouses mit Terrasse, historische Apartments, modernistische Penthouses',
    },
    marketTrend: 'rising',
    annualAppreciation: 7,
  },

  lifestyle: {
    atmosphere: {
      es: 'Urbano, cosmopolita, cultural. Mediterráneo con sofisticación europea.',
      en: 'Urban, cosmopolitan, cultural. Mediterranean with European sophistication.',
      de: 'Urban, kosmopolitisch, kulturell. Mediterran mit europäischer Raffinesse.',
    },
    idealFor: {
      es: 'Amantes de la cultura y el arte, Profesionales, Inversores',
      en: 'Culture and art lovers, Professionals, Investors',
      de: 'Kultur- und Kunstliebhaber, Berufstätige, Investoren',
    },
    activities: {
      es: 'Galerías, Teatros, Compras lujo, Gastronomía, Mercados',
      en: 'Galleries, Theaters, Luxury shopping, Gastronomy, Markets',
      de: 'Galerien, Theater, Luxus-Shopping, Gastronomie, Märkte',
    },
    restaurants: {
      es: 'Marc Fosh, Adrián Quetglas, Andreu Genestra',
      en: 'Marc Fosh, Adrián Quetglas, Andreu Genestra',
      de: 'Marc Fosh, Adrián Quetglas, Andreu Genestra',
    },
    shopping: {
      es: 'Paseo del Borne, Jaume III, Santa Catalina, Mercat de l\'Olivar',
      en: 'Paseo del Borne, Jaume III, Santa Catalina, Olivars Market',
      de: 'Paseo del Borne, Jaume III, Santa Catalina, Mercat de l\'Olivar',
    },
  },

  amenities: {
    schools: {
      es: 'Colegios privados en Palma, Instituto Ramon Llull',
      en: 'Private schools in Palma, Ramon Llull Institute',
      de: 'Privatschulen in Palma, Institut Ramon Llull',
    },
    healthCare: {
      es: 'Hospital Son Espases, Quirónsalud Palmaplanas, Clínica Juaneda',
      en: 'Son Espases Hospital, Quirónsalud Palmaplanas, Juaneda Clinic',
      de: 'Krankenhaus Son Espases, Quirónsalud Palmaplanas, Klinik Juaneda',
    },
    sports: {
      es: 'Club Náutico Palma, Real Club Náutico, Gimnasios boutique',
      en: 'Palma Yacht Club, Real Yacht Club, Boutique gyms',
      de: 'Yachtclub Palma, Real Yachtclub, Boutique-Studios',
    },
  },

  transportation: {
    airportDistance: 10,
    palmaDistance: 0,
    parking: {
      es: 'Parkings públicos y privados',
      en: 'Public and private parkings',
      de: 'Öffentliche und private Parkplätze',
    },
    publicTransport: {
      es: 'Metro, Autobuses EMT, Bici pública',
      en: 'Metro, EMT Buses, Public bike',
      de: 'U-Bahn, EMT-Busse, öffentliches Fahrrad',
    },
  },

  highlights: {
    es: 'Catedral, Paseo del Borne, Casco antiguo, Vida cultural',
    en: 'Cathedral, Paseo del Borne, Old town, Cultural life',
    de: 'Kathedrale, Paseo del Borne, Altstadt, Kulturleben',
  },

  seasonality: {
    peak: {
      es: 'Todo el año',
      en: 'Year-round',
      de: 'Ganzjährig',
    },
    lowSeason: {
      es: 'N/A',
      en: 'N/A',
      de: 'N/A',
    },
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

  metaDescription: {
    es: 'Palma Centro: Áticos con terraza, apartamentos exclusivos. Historia y cultura.',
    en: 'Palma Center: Penthouses with terrace, exclusive apartments. History and culture.',
    de: 'Palma Zentrum: Penthouses mit Terrasse, exklusive Apartments. Geschichte und Kultur.',
  },

  keywords: [
    'palma centro mallorca',
    'atico palma centro',
    'casco antiguo palma',
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
