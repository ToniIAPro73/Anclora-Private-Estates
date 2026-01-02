/**
 * Advanced Schema Markup System
 * Anclora Private Estates
 * 
 * Complete implementation of Schema.org structured data
 */

import { siteConfig } from './seo';

// ==============================================
// BASE SCHEMA TYPES
// ==============================================

interface BaseSchema {
  '@context': string;
  '@type': string;
  '@id'?: string;
}

interface Address {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

// ==============================================
// REAL ESTATE SPECIFIC SCHEMAS
// ==============================================

/**
 * Accommodation (Property Listing)
 * For detailed property information
 */
export interface AccommodationSchema extends BaseSchema {
  '@type': 'Accommodation';
  name: string;
  description: string;
  image: string[];
  address: Address;
  geo?: GeoCoordinates;
  floorSize: {
    '@type': 'QuantitativeValue';
    value: number;
    unitCode: 'MTK';
  };
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  amenityFeature?: Array<{
    '@type': 'LocationFeatureSpecification';
    name: string;
    value: boolean | string | number;
  }>;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  offers?: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    validFrom?: string;
  };
}

export function generateAccommodationSchema({
  id,
  title,
  description,
  price,
  location,
  address,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  size,
  images,
  features,
  amenities,
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: {
    street?: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;
  };
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  features?: string[];
  amenities?: Record<string, boolean | string | number>;
}): AccommodationSchema {
  const schema: AccommodationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    '@id': `${siteConfig.url}/propiedades/${id}`,
    name: title,
    description,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.street,
      addressLocality: address?.city || location,
      addressRegion: address?.region || 'Islas Baleares',
      postalCode: address?.postalCode,
      addressCountry: address?.country || 'ES',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: size,
      unitCode: 'MTK',
    },
    numberOfBedrooms: bedrooms,
    numberOfBathroomsTotal: bathrooms,
  };

  // Add geo coordinates if available
  if (latitude && longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    };
  }

  // Add amenities
  if (amenities || features) {
    schema.amenityFeature = [];
    
    // Add features as amenities
    if (features) {
      features.forEach(feature => {
        schema.amenityFeature!.push({
          '@type': 'LocationFeatureSpecification',
          name: feature,
          value: true,
        });
      });
    }

    // Add detailed amenities
    if (amenities) {
      Object.entries(amenities).forEach(([name, value]) => {
        schema.amenityFeature!.push({
          '@type': 'LocationFeatureSpecification',
          name,
          value,
        });
      });
    }
  }

  // Add offer
  schema.offers = {
    '@type': 'Offer',
    price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    validFrom: new Date().toISOString(),
  };

  return schema;
}

/**
 * RealEstateListing
 * Specialized schema for real estate listings
 */
export interface RealEstateListingSchema extends BaseSchema {
  '@type': 'RealEstateListing';
  name: string;
  description: string;
  url: string;
  image: string[];
  datePosted: string;
  validThrough?: string;
  address: Address;
  geo?: GeoCoordinates;
  floorSize: {
    '@type': 'QuantitativeValue';
    value: number;
    unitCode: 'MTK';
  };
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  yearBuilt?: number;
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
  };
}

export function generateRealEstateListingSchema({
  id,
  title,
  description,
  price,
  location,
  address,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  totalRooms,
  size,
  images,
  yearBuilt,
  datePosted,
  validThrough,
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: {
    street?: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;
  };
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  totalRooms?: number;
  size: number;
  images: string[];
  yearBuilt?: number;
  datePosted?: string;
  validThrough?: string;
}): RealEstateListingSchema {
  const schema: RealEstateListingSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description,
    url: `${siteConfig.url}/propiedades/${id}`,
    image: images,
    datePosted: datePosted || new Date().toISOString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.street,
      addressLocality: address?.city || location,
      addressRegion: address?.region || 'Islas Baleares',
      postalCode: address?.postalCode,
      addressCountry: address?.country || 'ES',
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: size,
      unitCode: 'MTK',
    },
    numberOfBedrooms: bedrooms,
    numberOfBathroomsTotal: bathrooms,
    numberOfRooms: totalRooms,
    yearBuilt,
    validThrough,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };

  if (latitude && longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    };
  }

  return schema;
}

// ==============================================
// SERVICE SCHEMAS
// ==============================================

/**
 * Service schema for real estate services
 */
export interface ServiceSchema extends BaseSchema {
  '@type': 'Service';
  serviceType: string;
  name: string;
  description: string;
  provider: {
    '@type': 'RealEstateAgent';
    name: string;
    url: string;
  };
  areaServed: {
    '@type': 'GeoCircle';
    geoMidpoint: GeoCoordinates;
    geoRadius: string;
  };
  offers?: {
    '@type': 'Offer';
    priceCurrency: string;
    price?: number;
    priceSpecification?: string;
  };
}

export function generateServiceSchema({
  serviceType,
  name,
  description,
  price,
  priceDescription,
}: {
  serviceType: string;
  name: string;
  description: string;
  price?: number;
  priceDescription?: string;
}): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name,
    description,
    provider: {
      '@type': 'RealEstateAgent',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.5696,
        longitude: 2.6502,
      },
      geoRadius: '50000', // 50km radius
    },
    offers: price || priceDescription ? {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price,
      priceSpecification: priceDescription,
    } : undefined,
  };
}

// ==============================================
// VIDEO SCHEMAS
// ==============================================

/**
 * VideoObject for property tours
 */
export interface VideoObjectSchema extends BaseSchema {
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 duration format (e.g., PT1M30S)
}

export function generateVideoSchema({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}): VideoObjectSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl,
    uploadDate,
    contentUrl,
    embedUrl,
    duration,
  };
}

// ==============================================
// REVIEW & RATING SCHEMAS
// ==============================================

/**
 * Review schema for testimonials
 */
export interface ReviewSchema extends BaseSchema {
  '@type': 'Review';
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
  };
  reviewBody: string;
  datePublished: string;
  itemReviewed: {
    '@type': 'RealEstateAgent';
    name: string;
  };
}

export function generateReviewSchema({
  authorName,
  rating,
  reviewText,
  datePublished,
}: {
  authorName: string;
  rating: number;
  reviewText: string;
  datePublished: string;
}): ReviewSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: authorName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
    },
    reviewBody: reviewText,
    datePublished,
    itemReviewed: {
      '@type': 'RealEstateAgent',
      name: siteConfig.name,
    },
  };
}

/**
 * AggregateRating for overall ratings
 */
export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export function generateAggregateRatingSchema({
  averageRating,
  reviewCount,
}: {
  averageRating: number;
  reviewCount: number;
}): AggregateRatingSchema {
  return {
    '@type': 'AggregateRating',
    ratingValue: averageRating,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

// ==============================================
// PERSON & ORGANIZATION SCHEMAS
// ==============================================

/**
 * Person schema for agents
 */
export interface PersonSchema extends BaseSchema {
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  image?: string;
  telephone?: string;
  email?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  sameAs?: string[];
}

export function generatePersonSchema({
  name,
  jobTitle,
  image,
  telephone,
  email,
  socialLinks,
}: {
  name: string;
  jobTitle?: string;
  image?: string;
  telephone?: string;
  email?: string;
  socialLinks?: string[];
}): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    image,
    telephone,
    email,
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    sameAs: socialLinks,
  };
}

// ==============================================
// EVENT SCHEMAS
// ==============================================

/**
 * Event schema for open houses, viewings
 */
export interface EventSchema extends BaseSchema {
  '@type': 'Event';
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': 'Place';
    name: string;
    address: Address;
  };
  organizer: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  locationName,
  address,
  status = 'EventScheduled',
  attendanceMode = 'OfflineEventAttendanceMode',
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  address: {
    city: string;
    region: string;
    country: string;
  };
  status?: string;
  attendanceMode?: string;
}): EventSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: address.city,
        addressRegion: address.region,
        addressCountry: address.country,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    eventStatus: `https://schema.org/${status}`,
    eventAttendanceMode: `https://schema.org/${attendanceMode}`,
  };
}

// ==============================================
// HOW-TO & FAQ SCHEMAS
// ==============================================

/**
 * HowTo schema for guides
 */
export interface HowToSchema extends BaseSchema {
  '@type': 'HowTo';
  name: string;
  description: string;
  image?: string[];
  totalTime?: string; // ISO 8601 duration
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: number;
  };
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: string;
  }>;
}

export function generateHowToSchema({
  title,
  description,
  images,
  totalTime,
  steps,
}: {
  title: string;
  description: string;
  images?: string[];
  totalTime?: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image: images,
    totalTime,
    step: steps.map(step => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}

// ==============================================
// WEBSITE NAVIGATION SCHEMA
// ==============================================

/**
 * WebSite schema with SearchAction
 */
export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ==============================================
// COLLECTION PAGE SCHEMA
// ==============================================

/**
 * CollectionPage for property listings
 */
export interface CollectionPageSchema extends BaseSchema {
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity?: {
    '@type': 'ItemList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      url: string;
    }>;
  };
}

export function generateCollectionPageSchema({
  title,
  description,
  url,
  items,
}: {
  title: string;
  description: string;
  url: string;
  items?: Array<{ url: string }>;
}): CollectionPageSchema {
  const schema: CollectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${siteConfig.url}${url}`,
  };

  if (items && items.length > 0) {
    schema.mainEntity = {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}${item.url}`,
      })),
    };
  }

  return schema;
}
