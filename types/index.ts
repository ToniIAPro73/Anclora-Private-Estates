// ============================================
// TIPOS GENERALES
// ============================================

export type Language = 'es' | 'en' | 'de';

export interface Translation {
  es: string;
  en: string;
  de: string;
}

// ============================================
// PROPIEDADES (PROPERTIES)
// ============================================

export type PropertyType = 
  | 'villa' 
  | 'apartment' 
  | 'penthouse' 
  | 'estate' 
  | 'land';

export type PropertyStatus = 
  | 'available' 
  | 'reserved' 
  | 'sold' 
  | 'off-market';

export interface PropertyImage {
  id: string;
  url: string;
  alt: Translation;
  caption?: Translation;
  isPrimary?: boolean;
}

export interface PropertyFeature {
  id: string;
  name: Translation;
  value: string | number;
  icon?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Property {
  id: string;
  slug: string;
  title: Translation;
  description: Translation;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: 'EUR' | 'USD';
  priceOnRequest?: boolean;
  location: PropertyLocation;
  images: PropertyImage[];
  features: PropertyFeature[];
  bedrooms: number;
  bathrooms: number;
  area: number; // m²
  plotSize?: number; // m²
  yearBuilt?: number;
  isExclusive?: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// FORMULARIOS DE CONTACTO
// ============================================

export type ContactFormType = 
  | 'general' 
  | 'property-inquiry' 
  | 'valuation' 
  | 'consultation';

export type BudgetRange =
  | 'under-500k'
  | '500k-1m'
  | '1m-2m'
  | '2m-5m'
  | 'over-5m';

export type Timeline =
  | 'immediate'
  | '1-3-months'
  | '3-6-months'
  | '6-12-months'
  | 'no-rush';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  language: Language;
  formType: ContactFormType;
  propertyId?: string;
  budget?: BudgetRange;
  timeline?: Timeline;
  newsletter?: boolean;
  privacyAccepted: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  leadId?: string;
  error?: string;
}

// ============================================
// LEADS Y CRM
// ============================================

export type LeadSource = 
  | 'website' 
  | 'facebook' 
  | 'google' 
  | 'referral' 
  | 'direct';

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'meeting' 
  | 'negotiation' 
  | 'closed-won' 
  | 'closed-lost';

export interface LeadScore {
  total: number;
  factors: {
    budget: number;
    timeline: number;
    engagement: number;
    profile: number;
  };
}

export interface Lead {
  id: string;
  contactData: ContactFormData;
  source: LeadSource;
  status: LeadStatus;
  score: LeadScore;
  assignedTo?: string;
  notes?: string[];
  interactions: LeadInteraction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadInteraction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'property-view' | 'note';
  description: string;
  performedBy: string;
  timestamp: Date;
}

// ============================================
// BLOG Y CONTENIDO
// ============================================

export type BlogCategory = 
  | 'market-insights' 
  | 'property-spotlight' 
  | 'lifestyle' 
  | 'investment' 
  | 'news';

export interface BlogAuthor {
  id: string;
  name: string;
  title: Translation;
  avatar?: string;
  bio?: Translation;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: Translation;
  excerpt: Translation;
  content: Translation;
  category: BlogCategory;
  author: BlogAuthor;
  coverImage: string;
  tags: string[];
  readingTime: number; // minutes
  isPublished: boolean;
  isFeatured?: boolean;
  publishedAt: Date;
  updatedAt: Date;
}

// ============================================
// NAVEGACIÓN Y UI
// ============================================

export interface NavItem {
  label: Translation;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube';
  url: string;
  label: Translation;
}

export interface SEOData {
  title: Translation;
  description: Translation;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export interface SiteSection {
  id: string;
  name: string;
  component: string;
  order: number;
  content?: Record<string, any>;
}

export interface PageConfig {
  path: string;
  sections: SiteSection[];
}

export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'youtube';

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ============================================
// WEBHOOKS Y EVENTOS
// ============================================

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  signature?: string;
}

export interface N8NWebhookData {
  leadData: ContactFormData;
  source: LeadSource;
  timestamp: string;
  score?: LeadScore;
}

// ============================================
// UTILIDADES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
