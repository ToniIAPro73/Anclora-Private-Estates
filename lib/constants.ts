import type { PropertyType, PropertyStatus, BlogCategory, BudgetRange, Timeline } from '@/types';

/**
 * CONSTANTES DE LA APLICACIÓN
 * Anclora Private Estates
 */

// ==========================================
// PROPIEDADES
// ==========================================

export const PROPERTY_TYPES: Array<{ value: PropertyType; label: { es: string; en: string } }> = [
  { value: 'villa', label: { es: 'Villa', en: 'Villa' } },
  { value: 'apartment', label: { es: 'Apartamento', en: 'Apartment' } },
  { value: 'penthouse', label: { es: 'Ático', en: 'Penthouse' } },
  { value: 'estate', label: { es: 'Finca', en: 'Estate' } },
  { value: 'land', label: { es: 'Terreno', en: 'Land' } },
];

export const PROPERTY_STATUSES: Array<{ value: PropertyStatus; label: { es: string; en: string } }> = [
  { value: 'available', label: { es: 'Disponible', en: 'Available' } },
  { value: 'reserved', label: { es: 'Reservada', en: 'Reserved' } },
  { value: 'sold', label: { es: 'Vendida', en: 'Sold' } },
  { value: 'off-market', label: { es: 'Off-Market', en: 'Off-Market' } },
];

export const MALLORCA_REGIONS = [
  'Son Vida',
  'Palma Centro',
  'Paseo Marítimo',
  'Port d\'Andratx',
  'Puerto Portals',
  'Valldemossa',
  'Deià',
  'Sóller',
  'Pollensa',
  'Alcúdia',
  'Santa Ponsa',
  'Calvià',
  'Bendinat',
  'Costa d\'en Blanes',
] as const;

export const PRICE_RANGES = [
  { 
    min: 0, 
    max: 500000, 
    label: { es: 'Hasta 500.000€', en: 'Up to €500K' } 
  },
  { 
    min: 500000, 
    max: 1000000, 
    label: { es: '500.000€ - 1M€', en: '€500K - €1M' } 
  },
  { 
    min: 1000000, 
    max: 2000000, 
    label: { es: '1M€ - 2M€', en: '€1M - €2M' } 
  },
  { 
    min: 2000000, 
    max: 5000000, 
    label: { es: '2M€ - 5M€', en: '€2M - €5M' } 
  },
  { 
    min: 5000000, 
    max: Infinity, 
    label: { es: 'Más de 5M€', en: 'Over €5M' } 
  },
];

export const BEDROOM_OPTIONS = [
  { value: 1, label: { es: '1 Dormitorio', en: '1 Bedroom' } },
  { value: 2, label: { es: '2 Dormitorios', en: '2 Bedrooms' } },
  { value: 3, label: { es: '3 Dormitorios', en: '3 Bedrooms' } },
  { value: 4, label: { es: '4 Dormitorios', en: '4 Bedrooms' } },
  { value: 5, label: { es: '5+ Dormitorios', en: '5+ Bedrooms' } },
];

// ==========================================
// BLOG
// ==========================================

export const BLOG_CATEGORIES: Array<{ value: BlogCategory; label: { es: string; en: string } }> = [
  { value: 'market-insights', label: { es: 'Análisis de Mercado', en: 'Market Insights' } },
  { value: 'property-spotlight', label: { es: 'Propiedades Destacadas', en: 'Property Spotlight' } },
  { value: 'lifestyle', label: { es: 'Estilo de Vida', en: 'Lifestyle' } },
  { value: 'investment', label: { es: 'Inversión', en: 'Investment' } },
  { value: 'news', label: { es: 'Noticias', en: 'News' } },
];

// ==========================================
// FORMULARIOS
// ==========================================

export const BUDGET_RANGES: Array<{ value: BudgetRange; label: { es: string; en: string } }> = [
  { value: 'under-500k', label: { es: 'Menos de 500.000€', en: 'Under €500,000' } },
  { value: '500k-1m', label: { es: '500.000€ - 1M€', en: '€500,000 - €1M' } },
  { value: '1m-2m', label: { es: '1M€ - 2M€', en: '€1M - €2M' } },
  { value: '2m-5m', label: { es: '2M€ - 5M€', en: '€2M - €5M' } },
  { value: 'over-5m', label: { es: 'Más de 5M€', en: 'Over €5M' } },
];

export const TIMELINES: Array<{ value: Timeline; label: { es: string; en: string } }> = [
  { value: 'immediate', label: { es: 'Inmediato', en: 'Immediate' } },
  { value: '1-3-months', label: { es: '1-3 meses', en: '1-3 months' } },
  { value: '3-6-months', label: { es: '3-6 meses', en: '3-6 months' } },
  { value: '6-12-months', label: { es: '6-12 meses', en: '6-12 months' } },
  { value: 'no-rush', label: { es: 'Sin prisa', en: 'No rush' } },
];

// ==========================================
// CONFIGURACIÓN
// ==========================================

export const ITEMS_PER_PAGE = {
  properties: 12,
  blog: 9,
  search: 20,
} as const;

export const READING_TIME_WPM = 200; // Words per minute for reading time calculation

export const PHONE_REGEX = /^(\+34|0034)?[6789]\d{8}$/; // Spanish phone validation

export const SOCIAL_PLATFORMS = [
  { 
    platform: 'linkedin', 
    name: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://linkedin.com/company/' 
  },
  { 
    platform: 'instagram', 
    name: 'Instagram',
    icon: 'instagram',
    baseUrl: 'https://instagram.com/' 
  },
  { 
    platform: 'facebook', 
    name: 'Facebook',
    icon: 'facebook',
    baseUrl: 'https://facebook.com/' 
  },
  { 
    platform: 'twitter', 
    name: 'Twitter',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/' 
  },
  { 
    platform: 'youtube', 
    name: 'YouTube',
    icon: 'youtube',
    baseUrl: 'https://youtube.com/@' 
  },
] as const;

// ==========================================
// METADATA
// ==========================================

export const DEFAULT_METADATA = {
  siteName: 'Anclora Private Estates',
  siteUrl: 'https://ancloraprivateestates.com',
  defaultLocale: 'es',
  supportedLocales: ['es', 'en'],
  twitterHandle: '@ancloraestates',
} as const;

// ==========================================
// ICONOS POR FEATURE
// ==========================================

export const FEATURE_ICONS: Record<string, string> = {
  // Property features
  pool: 'waves',
  'infinity-pool': 'waves',
  gym: 'dumbbell',
  'wine-cellar': 'wine',
  'smart-home': 'smartphone',
  terrace: 'sun',
  jacuzzi: 'droplet',
  'olive-trees': 'tree',
  'guest-house': 'home',
  well: 'droplet',
  mooring: 'anchor',
  elevator: 'arrow-up',
  'original-beams': 'building',
  patio: 'square',
  
  // Service features
  curation: 'diamond',
  confidentiality: 'shield-check',
  advisory: 'user-check',
  agent: 'bot',
  automation: 'workflow',
  dashboard: 'chart-line',
  
  // General
  location: 'map-pin',
  calendar: 'calendar',
  user: 'user',
  email: 'mail',
  phone: 'phone',
  search: 'search',
  filter: 'filter',
  heart: 'heart',
  share: 'share-2',
  download: 'download',
  check: 'check',
  cross: 'x',
  arrow: 'arrow-right',
} as const;

// ==========================================
// COLORES DE ESTADO
// ==========================================

export const STATUS_COLORS: Record<PropertyStatus, string> = {
  available: 'text-green-600',
  reserved: 'text-yellow-600',
  sold: 'text-gray-500',
  'off-market': 'text-anclora-gold',
} as const;

// ==========================================
// ANIMACIONES
// ==========================================

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const SCROLL_OFFSET = 100; // Pixels to offset when scrolling to section

// ==========================================
// VALIDACIÓN
// ==========================================

export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: PHONE_REGEX,
  },
  message: {
    minLength: 10,
    maxLength: 1000,
  },
} as const;

// ==========================================
// API ENDPOINTS
// ==========================================

export const API_ENDPOINTS = {
  contact: '/api/contact',
  webhookN8N: '/api/webhook-n8n',
  altcha: '/api/altcha/challenge',
  properties: '/api/properties',
  blog: '/api/blog',
} as const;
