/**
 * SchemaRenderer Component
 * Helper component for rendering multiple JSON-LD schemas
 */

import Script from 'next/script';

type JsonLdSchema = Record<string, unknown>;

interface SchemaRendererProps {
  schemas: JsonLdSchema | JsonLdSchema[];
}

/**
 * Renders one or more JSON-LD schemas
 * Automatically adds @context if not present
 */
export function SchemaRenderer({ schemas }: SchemaRendererProps) {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

  return (
    <>
      {schemaArray.map((schema, index) => {
        // Ensure @context is present
        const fullSchema = {
          '@context': 'https://schema.org',
          ...schema,
        };

        return (
          <Script
            key={`schema-${index}`}
            id={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(fullSchema, null, 0),
            }}
            strategy="afterInteractive"
          />
        );
      })}
    </>
  );
}

/**
 * Page wrapper that includes schemas
 */
interface PageWithSchemaProps {
  schemas: JsonLdSchema | JsonLdSchema[];
  children: React.ReactNode;
}

export function PageWithSchema({ schemas, children }: PageWithSchemaProps) {
  return (
    <>
      <SchemaRenderer schemas={schemas} />
      {children}
    </>
  );
}

/**
 * Validate schema before rendering (development only)
 */
export function validateSchema(schema: JsonLdSchema): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true;
  }

  const requiredFields = ['@type'];
  
  for (const field of requiredFields) {
    if (!(schema as Record<string, unknown>)[field]) {
      console.warn(`Schema validation warning: Missing required field "${field}"`, schema);
      return false;
    }
  }

  return true;
}

/**
 * Hook to generate schemas on client side if needed
 */
export function useSchema(generateFn: () => JsonLdSchema | JsonLdSchema[]) {
  const schemas = generateFn();
  
  if (process.env.NODE_ENV === 'development') {
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
    schemaArray.forEach(schema => validateSchema(schema));
  }
  
  return schemas;
}
