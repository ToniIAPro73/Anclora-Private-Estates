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
    },
    description: {
      es: 'Impresionante villa de diseño contemporáneo con vistas panorámicas a la bahía de Palma. Esta propiedad única combina elegancia atemporal con las comodidades más modernas, situada en la zona residencial más prestigiosa de Mallorca.',
      en: 'Stunning contemporary design villa with panoramic views of Palma Bay. This unique property combines timeless elegance with the most modern amenities, located in the most prestigious residential area of Mallorca.',
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
        },
        isPrimary: true,
      },
      {
        id: 'img-001-2',
        url: '/assets/images/properties/villa-son-vida-02.jpg',
        alt: {
          es: 'Salón principal con vistas panorámicas',
          en: 'Main living room with panoramic views',
        },
      },
      {
        id: 'img-001-3',
        url: '/assets/images/properties/villa-son-vida-03.jpg',
        alt: {
          es: 'Piscina infinity con vistas a Palma',
          en: 'Infinity pool overlooking Palma',
        },
      },
    ],
    features: [
      {
        id: 'feat-001-1',
        name: { es: 'Piscina Infinity', en: 'Infinity Pool' },
        value: 'Sí',
        icon: 'waves',
      },
      {
        id: 'feat-001-2',
        name: { es: 'Gimnasio Privado', en: 'Private Gym' },
        value: 'Sí',
        icon: 'dumbbell',
      },
      {
        id: 'feat-001-3',
        name: { es: 'Bodega de Vinos', en: 'Wine Cellar' },
        value: 'Sí',
        icon: 'wine',
      },
      {
        id: 'feat-001-4',
        name: { es: 'Sistema Domótica', en: 'Smart Home System' },
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
    slug: 'atico-paseo-maritimo-palma',
    title: {
      es: 'Ático de Lujo en Paseo Marítimo',
      en: 'Luxury Penthouse on Paseo Marítimo',
    },
    description: {
      es: 'Ático espectacular en primera línea de mar con terrazas envolventes y vistas directas al puerto deportivo. Acabados de máxima calidad y diseño interior firmado por reconocido estudio de interiorismo.',
      en: 'Spectacular seafront penthouse with wrap-around terraces and direct marina views. Top quality finishes and interior design by renowned interior design studio.',
    },
    type: 'penthouse',
    status: 'available',
    price: 2800000,
    currency: 'EUR',
    location: {
      address: 'Paseo Marítimo, 12',
      city: 'Palma de Mallorca',
      region: 'Centro',
      country: 'España',
      postalCode: '07014',
      coordinates: {
        lat: 39.5656,
        lng: 2.6301,
      },
    },
    images: [
      {
        id: 'img-002-1',
        url: '/assets/images/properties/penthouse-palma-01.jpg',
        alt: {
          es: 'Terraza principal con vistas al puerto',
          en: 'Main terrace overlooking the port',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-002-1',
        name: { es: 'Terraza 360°', en: '360° Terrace' },
        value: '200m²',
        icon: 'sun',
      },
      {
        id: 'feat-002-2',
        name: { es: 'Jacuzzi Exterior', en: 'Outdoor Jacuzzi' },
        value: 'Sí',
        icon: 'droplet',
      },
    ],
    bedrooms: 4,
    bathrooms: 4,
    area: 380,
    yearBuilt: 2022,
    isExclusive: false,
    isFeatured: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: 'prop-003',
    slug: 'finca-historica-valldemossa',
    title: {
      es: 'Finca Histórica con Olivos Centenarios',
      en: 'Historic Estate with Century-Old Olive Trees',
    },
    description: {
      es: 'Excepcional finca del siglo XVIII completamente restaurada respetando su arquitectura original. Rodeada de 10 hectáreas de olivares centenarios con producción propia de aceite ecológico. Privacidad absoluta y vistas a la Serra de Tramuntana.',
      en: 'Exceptional 18th century estate completely restored respecting its original architecture. Surrounded by 10 hectares of century-old olive groves with own organic oil production. Absolute privacy and views of Serra de Tramuntana.',
    },
    type: 'estate',
    status: 'off-market',
    price: 8500000,
    currency: 'EUR',
    priceOnRequest: true,
    location: {
      address: 'Carretera Valldemossa-Deià, Km 3',
      city: 'Valldemossa',
      region: 'Serra de Tramuntana',
      country: 'España',
      postalCode: '07170',
      coordinates: {
        lat: 39.7094,
        lng: 2.6231,
      },
    },
    images: [
      {
        id: 'img-003-1',
        url: '/assets/images/properties/finca-valldemossa-01.jpg',
        alt: {
          es: 'Vista aérea de la finca histórica',
          en: 'Aerial view of historic estate',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-003-1',
        name: { es: 'Olivos Centenarios', en: 'Century-Old Olives' },
        value: '10 hectáreas',
        icon: 'tree',
      },
      {
        id: 'feat-003-2',
        name: { es: 'Casita de Huéspedes', en: 'Guest House' },
        value: '2 unidades',
        icon: 'home',
      },
      {
        id: 'feat-003-3',
        name: { es: 'Pozo Propio', en: 'Private Well' },
        value: 'Sí',
        icon: 'droplet',
      },
    ],
    bedrooms: 8,
    bathrooms: 7,
    area: 1200,
    plotSize: 100000,
    yearBuilt: 1780,
    isExclusive: true,
    isFeatured: true,
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'prop-004',
    slug: 'villa-moderna-puerto-andratx',
    title: {
      es: 'Villa Moderna Frente al Mar',
      en: 'Modern Seafront Villa',
    },
    description: {
      es: 'Villa de arquitectura contemporánea con acceso directo al mar y amarre privado. Diseño minimalista con grandes ventanales que maximizan las vistas al puerto de Andratx.',
      en: 'Contemporary architecture villa with direct sea access and private mooring. Minimalist design with large windows maximizing views of Port Andratx.',
    },
    type: 'villa',
    status: 'reserved',
    price: 5200000,
    currency: 'EUR',
    location: {
      address: 'Avinguda de Mateu Bosch, 25',
      city: 'Port d\'Andratx',
      region: 'Andratx',
      country: 'España',
      postalCode: '07157',
    },
    images: [
      {
        id: 'img-004-1',
        url: '/assets/images/properties/villa-andratx-01.jpg',
        alt: {
          es: 'Villa moderna con vistas al puerto',
          en: 'Modern villa with port views',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-004-1',
        name: { es: 'Amarre Privado', en: 'Private Mooring' },
        value: '15m',
        icon: 'anchor',
      },
      {
        id: 'feat-004-2',
        name: { es: 'Ascensor Panorámico', en: 'Panoramic Elevator' },
        value: 'Sí',
        icon: 'arrow-up',
      },
    ],
    bedrooms: 6,
    bathrooms: 5,
    area: 550,
    plotSize: 1800,
    yearBuilt: 2023,
    isExclusive: true,
    isFeatured: false,
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'prop-005',
    slug: 'apartamento-casco-antiguo-palma',
    title: {
      es: 'Apartamento Exclusivo en Casco Antiguo',
      en: 'Exclusive Apartment in Old Town',
    },
    description: {
      es: 'Apartamento de lujo completamente reformado en edificio histórico del siglo XVI. Techos con vigas originales y acabados contemporáneos en el corazón del casco antiguo de Palma.',
      en: 'Luxury apartment completely renovated in historic 16th century building. Original beam ceilings and contemporary finishes in the heart of Palma\'s old town.',
    },
    type: 'apartment',
    status: 'available',
    price: 950000,
    currency: 'EUR',
    location: {
      address: 'Carrer de Can Savellà, 8',
      city: 'Palma de Mallorca',
      region: 'Casco Antiguo',
      country: 'España',
      postalCode: '07001',
    },
    images: [
      {
        id: 'img-005-1',
        url: '/assets/images/properties/apartment-palma-01.jpg',
        alt: {
          es: 'Salón con techos de vigas originales',
          en: 'Living room with original beam ceilings',
        },
        isPrimary: true,
      },
    ],
    features: [
      {
        id: 'feat-005-1',
        name: { es: 'Vigas Originales', en: 'Original Beams' },
        value: 'Siglo XVI',
        icon: 'building',
      },
      {
        id: 'feat-005-2',
        name: { es: 'Patio Interior', en: 'Interior Patio' },
        value: 'Privado',
        icon: 'square',
      },
    ],
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    yearBuilt: 1580,
    isExclusive: false,
    isFeatured: false,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-22'),
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
