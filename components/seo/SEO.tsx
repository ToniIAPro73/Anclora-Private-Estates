/**
 * SEO Component
 * Wrapper for adding JSON-LD structured data to pages
 */

import Script from 'next/script';

type JsonLdSchema = Record<string, unknown>;

interface SEOProps {
  jsonLd?: JsonLdSchema | JsonLdSchema[];
  children?: React.ReactNode;
}

export function SEO({ jsonLd, children }: SEOProps) {
  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <>
      {children}
      {schemas.map((schema, index) => (
        <Script
          key={`json-ld-${index}`}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              ...schema,
            }),
          }}
        />
      ))}
    </>
  );
}

/**
 * SEO Head component for additional meta tags
 */
interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
}

export function SEOHead({ 
  title, 
  description, 
  keywords = [], 
  canonical,
  noIndex = false 
}: SEOHeadProps) {
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Additional meta tags */}
      <meta name="author" content="Anclora Private Estates" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geographic tags */}
      <meta name="geo.region" content="ES-PM" />
      <meta name="geo.placename" content="Palma de Mallorca" />
      <meta name="geo.position" content="39.5696;2.6502" />
      <meta name="ICBM" content="39.5696, 2.6502" />
    </>
  );
}
