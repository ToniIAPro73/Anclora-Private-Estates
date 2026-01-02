/**
 * SEO Meta Tags System
 * Anclora Private Estates
 * 
 * Dynamic meta tags generation with Open Graph, Twitter Cards, and canonical URLs
 */

import { Metadata } from 'next';

// Base configuration
export const siteConfig = {
  name: 'Anclora Private Estates',
  description: 'Agencia inmobiliaria de lujo en Mallorca especializada en propiedades exclusivas. El privilegio de la privacidad en el Mediterráneo.',
  url: 'https://ancloraprivateestates.com',
  ogImage: 'https://ancloraprivateestates.com/images/og-default.jpg',
  links: {
    twitter: 'https://twitter.com/ancloraprivate',
    linkedin: 'https://linkedin.com/company/anclora-private-estates',
    instagram: 'https://instagram.com/ancloraprivateestates',
  },
  locale: 'es_ES',
  type: 'website',
};

// Property type for metadata
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

/**
 * Generate complete metadata for a page
 */
export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
  noFollow = false,
  canonical,
  alternates,
}: SEOProps = {}): Metadata {
  const pageTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.name;
  
  const pageUrl = url 
    ? `${siteConfig.url}${url}` 
    : siteConfig.url;

  const metadata: Metadata = {
    title: pageTitle,
    description,
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: pageUrl,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image],
      creator: '@ancloraprivate',
      site: '@ancloraprivate',
    },

    // Canonical and alternates
    alternates: alternates || {
      canonical: canonical || pageUrl,
      languages: {
        'es': pageUrl,
        'en': `${pageUrl}?lang=en`,
      },
    },

    // Additional metadata
    metadataBase: new URL(siteConfig.url),
    
    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/site.webmanifest',

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
  };

  // Article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime || authors)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors?.map(author => author) || [],
      tags,
    };
  }

  // Product-specific metadata (for properties)
  if (type === 'product') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'product',
    };
  }

  return metadata;
}

/**
 * Generate metadata for property pages
 */
export function generatePropertyMetadata({
  id,
  title,
  description,
  price,
  location,
  bedrooms,
  bathrooms,
  size,
  images,
  features,
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  features: string[];
}): Metadata {
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);

  const enhancedDescription = `${description} ${bedrooms} dormitorios, ${bathrooms} baños, ${size}m². ${location}, Mallorca. ${formattedPrice}. ${features.slice(0, 3).join(', ')}.`;

  return generateMetadata({
    title: `${title} - ${location}`,
    description: enhancedDescription.slice(0, 160),
    image: images[0],
    url: `/propiedades/${id}`,
    type: 'product',
    tags: [location, 'Mallorca', 'Luxury Real Estate', ...features],
  });
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata({
  title,
  excerpt,
  slug,
  publishedAt,
  updatedAt,
  author,
  tags,
  coverImage,
}: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  coverImage?: string;
}): Metadata {
  return generateMetadata({
    title,
    description: excerpt,
    image: coverImage || siteConfig.ogImage,
    url: `/blog/${slug}`,
    type: 'article',
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    authors: [author],
    tags,
  });
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      ...data,
    }),
  };
}

/**
 * Organization Schema
 */
export function getOrganizationSchema() {
  return generateJsonLd({
    '@type': 'RealEstateAgent',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: siteConfig.ogImage,
    telephone: '+34 971 XXX XXX',
    email: 'info@ancloraprivateestates.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palma',
      addressRegion: 'Islas Baleares',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.5696,
      longitude: 2.6502,
    },
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.instagram,
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 39.5696,
        longitude: 2.6502,
      },
      geoRadius: '50000',
    },
    priceRange: '€€€€',
    knowsAbout: [
      'Luxury Real Estate',
      'Property Investment',
      'Property Management',
      'Real Estate Valuation',
    ],
  });
}

/**
 * Breadcrumb Schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return generateJsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  });
}

/**
 * Property Schema (Product)
 */
export function getPropertySchema({
  id,
  title,
  description,
  price,
  location,
  bedrooms,
  bathrooms,
  size,
  images,
  features,
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  features: string[];
}) {
  return generateJsonLd({
    '@type': 'Product',
    name: title,
    description,
    image: images,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/propiedades/${id}`,
    },
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Bedrooms',
        value: bedrooms,
      },
      {
        '@type': 'PropertyValue',
        name: 'Bathrooms',
        value: bathrooms,
      },
      {
        '@type': 'PropertyValue',
        name: 'Floor Area',
        value: size,
        unitText: 'MTK',
      },
      {
        '@type': 'PropertyValue',
        name: 'Location',
        value: location,
      },
      ...features.map(feature => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature,
      })),
    ],
  });
}

/**
 * Article Schema
 */
export function getArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  coverImage,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  coverImage?: string;
}) {
  return generateJsonLd({
    '@type': 'Article',
    headline: title,
    description,
    image: coverImage || siteConfig.ogImage,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${slug}`,
    },
  });
}

/**
 * FAQ Schema
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd({
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * LocalBusiness Schema
 */
export function getLocalBusinessSchema() {
  return generateJsonLd({
    '@type': 'RealEstateAgent',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: siteConfig.ogImage,
    telephone: '+34 971 XXX XXX',
    email: 'info@ancloraprivateestates.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Example 123',
      addressLocality: 'Palma de Mallorca',
      addressRegion: 'Islas Baleares',
      postalCode: '07001',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.5696,
      longitude: 2.6502,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.linkedin,
      siteConfig.links.instagram,
    ],
    priceRange: '€€€€',
  });
}
