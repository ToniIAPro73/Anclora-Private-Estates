import type { Property } from '@/types';

/**
 * PROPIEDADES DE EJEMPLO
 * Datos ficticios para desarrollo y testing
 * En producción, estas propiedades vendrán de la API/CRM
 */

export const sampleProperties: Property[] = [
  {
    id: 'prop-001',
    slug: 'villa-mediterranea-son-vida',
    title: {
      es: 'Villa Mediterránea Exclusiva en Son Vida',
      en: 'Exclusive Mediterranean Villa in Son Vida',
      de: 'Exklusive mediterrane Villa in Son Vida',
    },
    description: {
      es: 'Impresionante villa de diseño contemporáneo con vistas panorámicas a la bahía de Palma. Esta propiedad única combina elegancia atemporal con las comodidades más modernas, situada en la zona residencial más prestigiosa de Mallorca.',
      en: 'Stunning contemporary design villa with panoramic views of Palma Bay. This unique property combines timeless elegance with the most modern amenities, located in the most prestigious residential area of Mallorca.',
      de: 'Atemberaubende Villa in zeitgenössischem Design mit Panoramablick auf die Bucht von Palma. Dieses einzigartige Anwesen kombiniert zeitlose Eleganz mit modernsten Annehmlichkeiten und befindet sich in der prestigeträchtigsten Wohngegend Mallorcas.',
    },
    type: 'villa',
    status: 'available',
    price: 3500000,
    currency: 'EUR',
    location: {
      address: 'Camino Son Rapinya, 40',
      city: 'Palma de Mallorca',
      region: 'Son Vida',
      country: 'España',
      postalCode: '07013',
      coordinates: {
        lat: 39.5867,
        lng: 2.6196,
      },
    },
    images: [
      {
        id: 'img-001-1',
        url: '/assets/images/properties/villa-son-vida-01.jpg',
        alt: {
          es: 'Fachada principal de villa en Son Vida',
          en: 'Main facade of villa in Son Vida',
          de: 'Hauptfassade der Villa in Son Vida',
        },
        isPrimary: true,
      },
      {
        id: 'img-001-2',
        url: '/assets/images/properties/villa-son-vida-02.jpg',
        alt: {
          es: 'Salón principal con vistas panorámicas',
          en: 'Main living room with panoramic views',
          de: 'Hauptwohnzimmer mit Panoramablick',
        },
      },
      {
        id: 'img-001-3',
        url: '/assets/images/properties/villa-son-vida-03.jpg',
        alt: {
          es: 'Piscina infinity con vistas a Palma',
          en: 'Infinity pool overlooking Palma',
          de: 'Infinity-Pool mit Blick auf Palma',
        },
      },
    ],
    features: [
      {
        id: 'feat-001-1',
        name: { es: 'Piscina Infinity', en: 'Infinity Pool', de: 'Infinity-Pool' },
        value: 'Sí',
        icon: 'waves',
      },
      {
        id: 'feat-001-2',
        name: { es: 'Gimnasio Privado', en: 'Private Gym', de: 'Privates Fitnessstudio' },
        value: 'Sí',
        icon: 'dumbbell',
      },
      {
        id: 'feat-001-3',
        name: { es: 'Bodega de Vinos', en: 'Wine Cellar', de: 'Weinkeller' },
        value: 'Sí',
        icon: 'wine',
      },
      {
        id: 'feat-001-4',
        name: { es: 'Sistema Domótica', en: 'Smart Home System', de: 'Smart-Home-System' },
        value: 'Completo',
        icon: 'smartphone',
      },
    ],
    bedrooms: 5,
    bathrooms: 6,
    area: 650,
    plotSize: 2500,
    yearBuilt: 2021,
    isExclusive: true,
    isFeatured: true,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 'prop-002',
    slug: 'apartamento-lujo-puerto-portals',
    title: {
      es: 'Ático de Lujo frente al Mar en Puerto Portals',
      en: 'Luxury Waterfront Penthouse in Puerto Portals',
      de: 'Luxuriöses Penthouse direkt am Meer in Puerto Portals',
    },
    description: {
      es: 'Exclusivo ático reformado con materiales de primera calidad, situado en primera línea del prestigioso puerto deportivo de Puerto Portals. Disfruta de amplias terrazas y acceso directo a la playa.',
      en: 'Exclusive penthouse renovated with premium materials, located on the front line of the prestigious Puerto Portals marina. Enjoy large terraces and direct access to the beach.',
      de: 'Exklusives Penthouse, renoviert mit hochwertigen Materialien, in erster Reihe zum prestigeträchtigen Yachthafen Puerto Portals. Genießen Sie große Terrassen und direkten Zugang zum Strand.',
    },
    type: 'penthouse',
    status: 'available',
    price: 1850000,
    currency: 'EUR',
    location: {
      address: 'Paseo de Portals, 12',
      city: 'Calvià',
      region: 'Puerto Portals',
      country: 'España',
      postalCode: '07181',
      coordinates: {
        lat: 39.5312,
        lng: 2.5645,
      },
    },
    images: [
      {
        id: 'img-002-1',
        url: '/assets/images/properties/penthouse-portals-01.jpg',
        alt: {
          es: 'Vista desde la terraza del ático',
          en: 'View from the penthouse terrace',
          de: 'Blick von der Penthouse-Terrasse',
        },
        isPrimary: true,
      },
      {
        id: 'img-002-2',
        url: '/assets/images/properties/penthouse-portals-02.jpg',
        alt: {
          es: 'Cocina moderna de planta abierta',
          en: 'Modern open plan kitchen',
          de: 'Moderne offene Küche',
        },
      },
    ],
    features: [
      {
        id: 'feat-002-1',
        name: { es: 'Terraza Privada', en: 'Private Terrace', de: 'Private Terrasse' },
        value: '80m²',
        icon: 'maximize',
      },
      {
        id: 'feat-002-2',
        name: { es: 'Acceso Playa', en: 'Beach Access', de: 'Strandzugang' },
        value: 'Directo',
        icon: 'sun',
      },
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    yearBuilt: 2020,
    isExclusive: false,
    isFeatured: true,
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: 'prop-003',
    slug: 'finca-historica-arta',
    title: {
      es: 'Finca Histórica Reformada con Vistas a la Montaña',
      en: 'Renovated Historical Estate with Mountain Views',
      de: 'Renovierte historische Finca mit Bergblick',
    },
    description: {
      es: 'Auténtica posesión mallorquina del siglo XVIII meticulosamente restaurada conservando su carácter original y añadiendo elementos de confort moderno. Rodeada de campos de olivos y total privacidad.',
      en: 'Authentic 18th century Mallorcan possession meticulously restored preserving its original character and adding modern comfort elements. Surrounded by olive groves and total privacy.',
      de: 'Authentisches mallorquinisches Anwesen aus dem 18. Jahrhundert, akribisch restauriert, unter Wahrung des ursprünglichen Charakters und Hinzufügung moderner Komfortelemente. Umgeben von Olivenhainen und absoluter Privatsphäre.',
    },
    type: 'estate',
    status: 'reserved',
    price: 4750000,
    currency: 'EUR',
    location: {
      address: 'Carretera Artà-Canyamel, km 4',
      city: 'Artà',
      region: 'Levante',
      country: 'España',
      postalCode: '07570',
    },
    images: [
      {
        id: 'img-003-1',
        url: '/assets/images/properties/finca-arta-01.jpg',
        alt: {
          es: 'Fachada de piedra tradicional',
          en: 'Traditional stone facade',
          de: 'Traditionelle Steinfassade',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-003-1',
        name: { es: 'Terreno', en: 'Land Plot', de: 'Grundstück' },
        value: '15.000m²',
        icon: 'layout',
      },
      {
        id: 'feat-003-2',
        name: { es: 'Casa Invitados', en: 'Guest House', de: 'Gästehaus' },
        value: 'Sí',
        icon: 'home',
      },
    ],
    bedrooms: 6,
    bathrooms: 5,
    area: 520,
    plotSize: 15000,
    yearBuilt: 1780,
    isExclusive: true,
    isFeatured: true,
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'prop-004',
    slug: 'parcela-exclusiva-andratx',
    title: {
      es: 'Parcela con Proyecto Licenciado en Puerto de Andratx',
      en: 'Plot with Licensed Project in Port d Andratx',
      de: 'Grundstück mit lizenziertem Projekt in Port d Andratx',
    },
    description: {
      es: 'Última parcela disponible en la cima de Mon Port con licencia para construir una villa de lujo de 500m². Vistas impresionantes al puerto y al mar abierto.',
      en: 'Last available plot at the top of Mon Port with license to build a 500sqm luxury villa. Breathtaking views of the harbor and the open sea.',
      de: 'Letztes verfügbares Grundstück auf dem Gipfel von Mon Port mit Lizenz zum Bau einer 500 m² großen Luxusvilla. Atemberaubender Blick auf den Hafen und das offene Meer.',
    },
    type: 'land',
    status: 'available',
    price: 2200000,
    currency: 'EUR',
    location: {
      address: 'Calle Mon Port, 88',
      city: 'Andratx',
      region: 'Puerto de Andratx',
      country: 'España',
      postalCode: '07157',
    },
    images: [
      {
        id: 'img-004-1',
        url: '/assets/images/properties/land-andratx-01.jpg',
        alt: {
          es: 'Vistas desde la parcela',
          en: 'Views from the plot',
          de: 'Blick vom Grundstück',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-004-1',
        name: { es: 'Licencia Obra', en: 'Building License', de: 'Baugenehmigung' },
        value: 'Concedida',
        icon: 'file-text',
      },
    ],
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    plotSize: 1200,
    isExclusive: false,
    isFeatured: false,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'prop-005',
    slug: 'villa-moderna-santa-ponsa',
    title: {
      es: 'Villa de Nueva Construcción en Santa Ponsa',
      en: 'New Build Villa in Santa Ponsa',
      de: 'Neubau-Villa in Santa Ponsa',
    },
    description: {
      es: 'Villa ultramoderna situada a pocos pasos del campo de golf de Santa Ponsa. Diseño minimalista con grandes ventanales que inundan la casa de luz natural.',
      en: 'Ultra-modern villa located just steps from Santa Ponsa golf course. Minimalist design with large windows that flood the house with natural light.',
      de: 'Ultramoderne Villa, nur wenige Schritte vom Golfplatz Santa Ponsa entfernt. Minimalistisches Design mit großen Fenstern, die das Haus mit natürlichem Licht durchfluten.',
    },
    type: 'villa',
    status: 'available',
    price: 2950000,
    currency: 'EUR',
    location: {
      address: 'Avenida del Golf, 55',
      city: 'Calvià',
      region: 'Santa Ponsa',
      country: 'España',
    },
    images: [
      {
        id: 'img-005-1',
        url: '/assets/images/properties/villa-santa-ponsa-01.jpg',
        alt: {
          es: 'Diseño exterior minimalista',
          en: 'Minimalist exterior design',
          de: 'Minimalistisches Außendesign',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-005-1',
        name: { es: 'Cerca del Golf', en: 'Near Golf', de: 'In der Nähe vom Golfplatz' },
        value: '50m',
        icon: 'flag',
      },
      {
        id: 'feat-005-2',
        name: { es: 'Calefacción Suelo', en: 'Underfloor Heating', de: 'Fußbodenheizung' },
        value: 'Sí',
        icon: 'thermometer',
      },
    ],
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    plotSize: 1000,
    yearBuilt: 2024,
    isExclusive: true,
    isFeatured: false,
    createdAt: new Date('2024-11-30'),
    updatedAt: new Date('2024-12-25'),
  },
  {
    id: 'prop-006',
    slug: 'apartamento-moderno-palma-tenis',
    title: {
      es: 'Apartamento de Diseño en Santa Catalina',
      en: 'Designer Apartment in Santa Catalina',
      de: 'Designer-Appartement in Santa Catalina',
    },
    description: {
      es: 'Elegante apartamento situado en el barrio más cosmopolita de Palma. Reformado integralmente con un estilo industrial chic y terraza privada.',
      en: 'Elegant apartment located in the most cosmopolitan neighborhood of Palma. Fully renovated with an industrial chic style and private terrace.',
      de: 'Elegantes Appartement im kosmopolitischsten Viertel von Palma. Komplett renoviert im Industrial-Chic-Stil und mit privater Terrasse.',
    },
    type: 'apartment',
    status: 'available',
    price: 890000,
    currency: 'EUR',
    location: {
      address: 'Calle de la Fabrica, 22',
      city: 'Palma de Mallorca',
      region: 'Santa Catalina',
      country: 'España',
    },
    images: [
      {
        id: 'img-006-1',
        url: '/assets/images/properties/apt-catalina-01.jpg',
        alt: {
          es: 'Interiores de estilo industrial',
          en: 'Industrial style interiors',
          de: 'Interieurs im Industriestil',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-006-1',
        name: { es: 'Aire Acondicionado', en: 'Air Conditioning', de: 'Klimaanlage' },
        value: 'Sí',
        icon: 'wind',
      },
    ],
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    yearBuilt: 1950,
    isExclusive: false,
    isFeatured: false,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
];

/**
 * Propiedades destacadas (featured)
 */
export const featuredProperties = sampleProperties.filter(p => p.isFeatured);

/**
 * Propiedades off-market
 */
export const offMarketProperties = sampleProperties.filter(
  p => p.status === 'off-market'
);

/**
 * Estadísticas del portfolio
 */
export const portfolioStats = {
  totalProperties: sampleProperties.length,
  averagePrice: Math.round(
    sampleProperties.reduce((sum, p) => sum + p.price, 0) / sampleProperties.length
  ),
  locationCoverage: [...new Set(sampleProperties.map(p => p.location.region))].length,
  exclusiveListings: sampleProperties.filter(p => p.isExclusive).length,
};
