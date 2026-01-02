/**
 * Schema Implementation Examples
 * Real-world usage of structured data schemas
 */

import {
  generateAccommodationSchema,
  generateRealEstateListingSchema,
  generateServiceSchema,
  generateVideoSchema,
  generateReviewSchema,
  generatePersonSchema,
  generateEventSchema,
  generateHowToSchema,
  generateWebSiteSchema,
  generateCollectionPageSchema,
} from '@/lib/schema';
import { getBreadcrumbSchema, getOrganizationSchema } from '@/lib/seo';

interface PropertySchemaSource {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
  };
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  totalRooms?: number;
  size: number;
  images: string[];
  features?: string[];
  amenities?: string[];
  yearBuilt?: number;
  createdAt?: string;
  validThrough?: string;
  videoTour?: {
    uploadDate: string;
    embedUrl: string;
    duration: string;
  };
}

interface TeamMember {
  name: string;
  position: string;
  photo?: string;
  email?: string;
  phone?: string;
  socialLinks?: string[];
}

interface BlogPostSchemaSource {
  title: string;
  excerpt: string;
  coverImage: string;
  readingTime: string;
  steps?: Array<{ name: string; text: string; image?: string }>;
  type?: string;
  category: string;
  slug: string;
}

interface Testimonial {
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface OpenHouseEvent {
  propertyTitle: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: string;
}

interface LocationSchemaSource {
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  slug: string;
}
// ==============================================
// PROPERTY PAGE SCHEMAS
// ==============================================

/**
 * Complete schema for property detail page
 * Combines multiple schemas for rich results
 */
export function getPropertyPageSchemas(property: PropertySchemaSource) {
  const schemas = [];

  // 1. Accommodation Schema (primary)
  schemas.push(
    generateAccommodationSchema({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      address: {
        street: property.address?.street,
        city: property.address?.city || property.location,
        region: property.address?.region || 'Islas Baleares',
        postalCode: property.address?.postalCode,
        country: 'ES',
      },
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      images: property.images,
      features: property.features,
      amenities: property.amenities,
    })
  );

  // 2. RealEstateListing Schema (alternative/complementary)
  schemas.push(
    generateRealEstateListingSchema({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      address: {
        street: property.address?.street,
        city: property.address?.city || property.location,
        region: property.address?.region || 'Islas Baleares',
        postalCode: property.address?.postalCode,
        country: 'ES',
      },
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      totalRooms: property.totalRooms,
      size: property.size,
      images: property.images,
      yearBuilt: property.yearBuilt,
      datePosted: property.createdAt,
      validThrough: property.validThrough,
    })
  );

  // 3. Breadcrumb Schema
  schemas.push(
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Propiedades', url: '/propiedades' },
      { name: property.location, url: `/propiedades/ubicacion/${property.location.toLowerCase()}` },
      { name: property.title, url: `/propiedades/${property.id}` },
    ])
  );

  // 4. Video Schema (if property has video tour)
  if (property.videoTour) {
    schemas.push(
      generateVideoSchema({
        title: `Tour Virtual - ${property.title}`,
        description: `Recorrido virtual completo de ${property.title} en ${property.location}`,
        thumbnailUrl: property.images[0],
        uploadDate: property.videoTour.uploadDate,
        embedUrl: property.videoTour.embedUrl,
        duration: property.videoTour.duration,
      })
    );
  }

  return schemas;
}

// ==============================================
// SERVICES PAGE SCHEMAS
// ==============================================

/**
 * Schema for service pages (compra, venta, gestión, valoración)
 */
export function getServicePageSchemas(serviceType: string) {
  const services = {
    compra: {
      type: 'PropertyBuying',
      name: 'Asesoría en Compra de Propiedades de Lujo',
      description: 'Servicio integral de asesoramiento para la compra de propiedades exclusivas en Mallorca. Análisis de mercado, búsqueda personalizada y acompañamiento en todo el proceso.',
    },
    venta: {
      type: 'PropertySelling',
      name: 'Venta de Propiedades Exclusivas',
      description: 'Comercialización y venta de propiedades de lujo en Mallorca. Marketing premium, fotografía profesional, visitas cualificadas y negociación experta.',
    },
    gestion: {
      type: 'PropertyManagement',
      name: 'Gestión Integral de Propiedades',
      description: 'Gestión completa de propiedades de lujo: mantenimiento, administración, alquileres vacacionales y atención a propietarios e inquilinos.',
    },
    valoracion: {
      type: 'PropertyValuation',
      name: 'Valoración Profesional de Propiedades',
      description: 'Tasación y valoración de propiedades de lujo en Mallorca. Análisis de mercado, comparables y certificación profesional.',
      priceDescription: 'Desde €500',
    },
  };

  const service = services[serviceType as keyof typeof services];

  return [
    generateServiceSchema({
      serviceType: service.type,
      name: service.name,
      description: service.description,
      priceDescription: service.priceDescription,
    }),
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Servicios', url: '/servicios' },
      { name: service.name, url: `/servicios/${serviceType}` },
    ]),
  ];
}

// ==============================================
// PROPERTIES LISTING PAGE SCHEMAS
// ==============================================

/**
 * Schema for properties listing page
 */
export function getPropertiesListingSchemas(properties: Array<{ id: string }>) {
  return [
    generateCollectionPageSchema({
      title: 'Propiedades Exclusivas en Mallorca',
      description: 'Descubre nuestra selección de villas, apartamentos y penthouses de lujo en las mejores ubicaciones de Mallorca.',
      url: '/propiedades',
      items: properties.map(p => ({ url: `/propiedades/${p.id}` })),
    }),
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Propiedades', url: '/propiedades' },
    ]),
  ];
}

// ==============================================
// ABOUT PAGE SCHEMAS
// ==============================================

/**
 * Schema for about page with team members
 */
export function getAboutPageSchemas(teamMembers: TeamMember[]) {
  const schemas = [];

  // Organization schema
  schemas.push(getOrganizationSchema());

  // Person schemas for each team member
  teamMembers.forEach(member => {
    schemas.push(
      generatePersonSchema({
        name: member.name,
        jobTitle: member.position,
        image: member.photo,
        email: member.email,
        telephone: member.phone,
        socialLinks: member.socialLinks,
      })
    );
  });

  // Breadcrumb
  schemas.push(
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Sobre Nosotros', url: '/sobre-nosotros' },
    ])
  );

  return schemas;
}

// ==============================================
// BLOG POST SCHEMAS
// ==============================================

/**
 * Complete schema for blog post page
 */
export function getBlogPostSchemas(post: BlogPostSchemaSource) {
  const schemas = [];

  // Article schema (from seo.ts)
  // schemas.push(getArticleSchema(...));

  // HowTo schema if it's a guide/tutorial
  if (post.type === 'guide' && post.steps) {
    schemas.push(
      generateHowToSchema({
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
        totalTime: post.readingTime,
        steps: post.steps,
      })
    );
  }

  // Breadcrumb
  schemas.push(
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.category, url: `/blog/categoria/${post.category}` },
      { name: post.title, url: `/blog/${post.slug}` },
    ])
  );

  return schemas;
}

// ==============================================
// TESTIMONIALS PAGE SCHEMAS
// ==============================================

/**
 * Schema for testimonials/reviews page
 */
export function getTestimonialsSchemas(testimonials: Testimonial[]) {
  const schemas = [];

  // Individual review schemas
  testimonials.forEach(testimonial => {
    schemas.push(
      generateReviewSchema({
        authorName: testimonial.author,
        rating: testimonial.rating,
        reviewText: testimonial.text,
        datePublished: testimonial.date,
      })
    );
  });

  // Breadcrumb
  schemas.push(
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Testimonios', url: '/testimonios' },
    ])
  );

  return schemas;
}

// ==============================================
// OPEN HOUSE EVENT SCHEMAS
// ==============================================

/**
 * Schema for open house events
 */
export function getOpenHouseSchemas(event: OpenHouseEvent) {
  return [
    generateEventSchema({
      name: `Casa Abierta - ${event.propertyTitle}`,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      locationName: event.propertyTitle,
      address: {
        city: event.location,
        region: 'Islas Baleares',
        country: 'ES',
      },
      status: event.status || 'EventScheduled',
      attendanceMode: 'OfflineEventAttendanceMode',
    }),
  ];
}

// ==============================================
// LOCATION PAGE SCHEMAS
// ==============================================

/**
 * Schema for location-specific pages (Son Vida, Port d'Andratx, etc)
 */
export function getLocationPageSchemas(
  location: LocationSchemaSource,
  properties: Array<{ id: string }>
) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: location.name,
      description: location.description,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.latitude,
        longitude: location.longitude,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.name,
        addressRegion: 'Islas Baleares',
        addressCountry: 'ES',
      },
    },
    generateCollectionPageSchema({
      title: `Propiedades en ${location.name}`,
      description: location.description,
      url: `/propiedades/ubicacion/${location.slug}`,
      items: properties.map(p => ({ url: `/propiedades/${p.id}` })),
    }),
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Propiedades', url: '/propiedades' },
      { name: location.name, url: `/propiedades/ubicacion/${location.slug}` },
    ]),
  ];
}

// ==============================================
// CONTACT PAGE SCHEMAS
// ==============================================

/**
 * Schema for contact page
 */
export function getContactPageSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contacto - Anclora Private Estates',
      description: 'Contacta con nuestro equipo de expertos en propiedades de lujo en Mallorca',
      url: 'https://ancloraprivateestates.com/contacto',
    },
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Contacto', url: '/contacto' },
    ]),
  ];
}

// ==============================================
// HOME PAGE SCHEMAS
// ==============================================

/**
 * Complete schema for homepage
 */
export function getHomePageSchemas(featuredProperties: Array<{ id: string }>) {
  return [
    generateWebSiteSchema(),
    getOrganizationSchema(),
    generateCollectionPageSchema({
      title: 'Propiedades de Lujo en Mallorca',
      description: 'Las mejores propiedades exclusivas en Mallorca',
      url: '/',
      items: featuredProperties.map(p => ({ url: `/propiedades/${p.id}` })),
    }),
  ];
}
