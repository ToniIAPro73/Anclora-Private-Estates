/**
 * GEO-Optimized Page Example
 * Página de guía con todas las optimizaciones GEO implementadas
 * /app/guias/comprar-mallorca/page.tsx
 */

import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { SchemaRenderer } from '@/components/seo/SchemaRenderer';
import { 
  generateGEOMetaTags,
  generateAIContext,
  optimizeForVoiceSearch,
} from '@/lib/geo-optimization';
import { generateFAQSchema, COMMON_FAQS, generateFAQHTML } from '@/lib/faq-schema';
import {
  generateCitationMarkup,
  optimizePageForCitations,
} from '@/lib/ai-citation-optimizer';
import {
  generateParagraphSnippet,
  generateListSnippet,
  generateTableSnippet,
  generateSnippetHTML,
} from '@/lib/featured-snippets';

export async function generateMetadata(): Promise<Metadata> {
  const geoMeta = generateGEOMetaTags({
    title: 'Guía Completa para Comprar Propiedad de Lujo en Mallorca 2025',
    description: 'Guía completa paso a paso para comprar villa o apartamento de lujo en Mallorca. Precios, impuestos, proceso legal y mejores zonas.',
    keywords: ['comprar', 'mallorca', 'villa', 'lujo', 'guía', 'proceso', 'impuestos'],
    author: 'Toni IA - Anclora Private Estates',
    lastModified: new Date(),
  });

  return generateSEOMetadata({
    title: 'Guía Completa para Comprar Propiedad de Lujo en Mallorca 2025',
    description: 'Guía completa paso a paso para comprar villa o apartamento de lujo en Mallorca. Precios, impuestos, proceso legal y mejores zonas.',
    url: '/guias/comprar-mallorca',
    type: 'article',
    additionalMeta: geoMeta,
  });
}

export default function ComprarMallorcaGuiaPage() {
  // Generate featured snippets
  const priceSnippet = generateParagraphSnippet({
    question: '¿Cuánto cuesta una villa de lujo en Mallorca?',
    answer: 'Una villa de lujo en Mallorca cuesta entre 1.5 y 15 millones de euros. En zonas prime como Son Vida o Port d\'Andratx, los precios oscilan entre 3-15M €, mientras que en otras áreas exclusivas como Calvià puedes encontrar desde 1.5M €.',
    details: 'Los factores que influyen son: ubicación, vistas al mar, tamaño de parcela, estado y calidades.',
  });

  const processSnippet = generateListSnippet({
    question: '¿Cómo comprar una propiedad en Mallorca?',
    items: [
      'Obtener NIE (Número de Identificación de Extranjero)',
      'Reserva con contrato de arras (10% del precio)',
      'Due diligence y revisión legal',
      'Obtención de hipoteca si es necesario',
      'Firma del contrato privado de compraventa',
      'Pago de impuestos (ITP 8-11% o IVA 10%)',
      'Firma de escritura ante notario',
      'Inscripción en Registro de la Propiedad',
    ],
    intro: 'El proceso de compra en Mallorca sigue estos 8 pasos:',
  });

  const zonesSnippet = generateTableSnippet({
    question: '¿Cuáles son las mejores zonas para comprar en Mallorca?',
    headers: ['Zona', 'Precio Medio', 'Tipo', 'Revalorización'],
    rows: [
      ['Son Vida', '3-8M €', 'Urbano exclusivo', '5-8% anual'],
      ['Port d\'Andratx', '4-15M €', 'Costa exclusiva', '4-7% anual'],
      ['Puerto Portals', '2-6M €', 'Puerto deportivo', '4-6% anual'],
      ['Santa Ponsa', '1.5-4M €', 'Residencial', '3-5% anual'],
      ['Deià', '2-8M €', 'Pueblo auténtico', '3-5% anual'],
    ],
    caption: 'Comparativa de zonas de lujo en Mallorca',
  });

  // Get FAQs for this page
  const compraFAQs = COMMON_FAQS.compra;
  const impuestosFAQs = COMMON_FAQS.impuestos;
  const financiacionFAQs = COMMON_FAQS.financiacion;
  const allFAQs = [...compraFAQs, ...impuestosFAQs, ...financiacionFAQs];

  // Generate schemas
  const faqSchema = generateFAQSchema(allFAQs);
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Guía Completa para Comprar Propiedad de Lujo en Mallorca 2025',
    description: 'Guía paso a paso con toda la información necesaria para comprar una propiedad de lujo en Mallorca.',
    author: {
      '@type': 'Person',
      name: 'Toni IA',
      jobTitle: 'CEO & Founder',
      worksFor: {
        '@type': 'Organization',
        name: 'Anclora Private Estates',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Anclora Private Estates',
      logo: {
        '@type': 'ImageObject',
        url: 'https://anclora.com/logo.png',
      },
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString(),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo Comprar una Propiedad de Lujo en Mallorca',
    description: 'Guía paso a paso del proceso de compra',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Obtener NIE',
        text: 'Solicitar el Número de Identificación de Extranjero en el consulado o en España. Proceso: 2-4 semanas.',
      },
      {
        '@type': 'HowToStep',
        name: 'Buscar Propiedad',
        text: 'Trabajar con una agencia inmobiliaria de confianza. Visitar propiedades y evaluar ubicación, estado y precio.',
      },
      {
        '@type': 'HowToStep',
        name: 'Reserva',
        text: 'Firmar contrato de arras y depositar 10% del precio. Este contrato es vinculante.',
      },
      {
        '@type': 'HowToStep',
        name: 'Due Diligence',
        text: 'Revisar documentación legal: nota simple, licencias, deudas. Contratar abogado especializado.',
      },
      {
        '@type': 'HowToStep',
        name: 'Financiación',
        text: 'Si necesitas hipoteca, solicitar pre-aprobación. Bancos financian 60-70% para no residentes.',
      },
      {
        '@type': 'HowToStep',
        name: 'Contrato Privado',
        text: 'Firmar compraventa privada. Acordar fecha de escritura pública.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pago de Impuestos',
        text: 'Pagar ITP (8-11%) para segunda mano o IVA (10%) + AJD (1.5%) para obra nueva.',
      },
      {
        '@type': 'HowToStep',
        name: 'Escritura y Registro',
        text: 'Firma ante notario y registro en el Registro de la Propiedad. Proceso: 1-2 meses.',
      },
    ],
  };

  // Create citable content
  const keyFacts = [
    'El proceso de compra en Mallorca tarda entre 2-3 meses desde la oferta hasta la escritura.',
    'Los compradores extranjeros necesitan NIE obligatoriamente para comprar propiedad en España.',
    'Los impuestos al comprar representan aproximadamente 10-12% adicional al precio de compra.',
    'Las zonas más exclusivas de Mallorca son Son Vida, Port d\'Andratx y Puerto Portals.',
    'Los bancos españoles financian hasta 60-70% del valor para compradores no residentes.',
  ];

  const statistics = [
    { label: 'Precio medio villa lujo', value: '3-8 millones €' },
    { label: 'Tiempo proceso compra', value: '2-3 meses' },
    { label: 'ITP segunda mano', value: '8-11%' },
    { label: 'Revalorización anual', value: '3-8%' },
    { label: 'Financiación no residentes', value: '60-70%' },
  ];

  const { citableBlocks } = optimizePageForCitations({
    title: 'Guía Completa para Comprar en Mallorca',
    content: '',
    keyFacts,
    statistics,
  });

  // Voice search optimization
  const voiceAnswer = optimizeForVoiceSearch(
    'Para comprar una propiedad en Mallorca necesitas obtener un NIE, reservar con arras del 10%, hacer due diligence legal, obtener financiación si es necesario, firmar contrato privado, pagar impuestos del 8-11%, y finalmente firmar escritura ante notario.'
  );

  return (
    <>
      <SchemaRenderer schemas={[articleSchema, howToSchema, faqSchema]} />
      
      {/* AI Robots Meta in head would be added via layout */}
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero with voice-optimized answer */}
        <header className="mb-12">
          <h1 className="font-serif text-5xl mb-4">
            Guía Completa para Comprar Propiedad de Lujo en Mallorca 2025
          </h1>
          
          {/* Featured snippet optimized intro */}
          <div 
            className="text-xl text-gray-700 mb-6 p-6 bg-gold/10 rounded-lg"
            data-voice-answer="true"
          >
            <strong>Respuesta rápida:</strong> {voiceAnswer.voiceOptimized}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Por Toni IA</span>
            <span>•</span>
            <time dateTime="2025-01-01">Actualizado: Enero 2025</time>
            <span>•</span>
            <span>15 min lectura</span>
          </div>
        </header>

        {/* Table of Contents - AI friendly */}
        <nav className="mb-12 p-6 bg-gray-50 rounded-lg" aria-label="Contenidos">
          <h2 className="font-bold text-lg mb-4">Contenidos</h2>
          <ol className="space-y-2">
            <li><a href="#precios" className="text-gold hover:underline">1. Precios de Propiedades de Lujo</a></li>
            <li><a href="#proceso" className="text-gold hover:underline">2. Proceso de Compra Paso a Paso</a></li>
            <li><a href="#zonas" className="text-gold hover:underline">3. Mejores Zonas para Invertir</a></li>
            <li><a href="#impuestos" className="text-gold hover:underline">4. Impuestos y Costes</a></li>
            <li><a href="#financiacion" className="text-gold hover:underline">5. Financiación para Extranjeros</a></li>
            <li><a href="#faqs" className="text-gold hover:underline">6. Preguntas Frecuentes</a></li>
          </ol>
        </nav>

        {/* Featured Snippet: Price */}
        <section id="precios" className="mb-12">
          {generateSnippetHTML(priceSnippet)}
        </section>

        {/* Citable key facts */}
        <section className="mb-12">
          <h2 className="font-serif text-3xl mb-6">Datos Clave</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citableBlocks.filter(b => b.type === 'fact').map(block => (
              <div 
                key={block.id}
                className="p-4 bg-white border border-gray-200 rounded-lg"
                dangerouslySetInnerHTML={{ __html: generateCitationMarkup(block) }}
              />
            ))}
          </div>
        </section>

        {/* Featured Snippet: Process */}
        <section id="proceso" className="mb-12">
          {generateSnippetHTML(processSnippet)}
          
          {/* Detailed process with semantic markers */}
          <div className="mt-8 space-y-6">
            <h3 className="font-semibold text-xl">Detalles de Cada Paso</h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-white border-l-4 border-gold">
                <h4 className="font-bold mb-2">1. Obtener NIE</h4>
                <p>
                  El <span className="semantic-term" data-type="definition">NIE (Número de Identificación de Extranjero)</span> es 
                  obligatorio para comprar propiedad en España. Puedes solicitarlo en el consulado español de tu país 
                  o directamente en España. El proceso tarda <span className="semantic-time" data-type="duration">2-4 semanas</span>.
                </p>
              </div>

              <div className="p-6 bg-white border-l-4 border-gold">
                <h4 className="font-bold mb-2">2. Reserva con Arras</h4>
                <p>
                  Una vez encuentres la propiedad ideal, deberás firmar un contrato de arras y depositar 
                  <span className="semantic-price" data-type="percentage">10% del precio</span>. Este contrato es 
                  vinculante para ambas partes.
                </p>
              </div>

              <div className="p-6 bg-white border-l-4 border-gold">
                <h4 className="font-bold mb-2">3. Due Diligence Legal</h4>
                <p>
                  Esencial revisar: nota simple del registro, licencias de construcción, deudas pendientes (IBI, comunidad), 
                  cargas e hipotecas. Recomendamos contratar un abogado especializado en inmobiliaria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Snippet: Zones Table */}
        <section id="zonas" className="mb-12">
          {generateSnippetHTML(zonesSnippet)}
          
          <div className="mt-8">
            <h3 className="font-semibold text-xl mb-4">Análisis Detallado por Zona</h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h4 className="font-bold text-lg mb-2">Son Vida</h4>
                <p className="mb-4">
                  La zona más exclusiva de <span className="semantic-location" data-type="location">Palma</span>. 
                  Urbanización cerrada con seguridad 24/7, campo de golf, y vistas panorámicas. 
                  Precio: <span className="semantic-price" data-type="price">3-8M €</span>.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Distancia al centro: 5 minutos</li>
                  <li>✓ Colegios internacionales cercanos</li>
                  <li>✓ Campo de golf Son Vida</li>
                  <li>✓ Revalorización: 5-8% anual</li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h4 className="font-bold text-lg mb-2">Port d'Andratx</h4>
                <p className="mb-4">
                  Puerto exclusivo en la costa suroeste. Ambiente cosmopolita con restaurantes de lujo y puerto deportivo. 
                  Precio: <span className="semantic-price" data-type="price">4-15M €</span>.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Distancia a Palma: 25 minutos</li>
                  <li>✓ Puerto deportivo de lujo</li>
                  <li>✓ Vistas espectaculares al mar</li>
                  <li>✓ Revalorización: 4-7% anual</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics - Citable */}
        <section id="impuestos" className="mb-12">
          <h2 className="font-serif text-3xl mb-6">Impuestos y Costes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {citableBlocks.filter(b => b.type === 'statistic').map(block => (
              <div 
                key={block.id}
                className="p-6 bg-gold/5 rounded-lg border border-gold/20"
                dangerouslySetInnerHTML={{ __html: generateCitationMarkup(block) }}
              />
            ))}
          </div>

          <div className="prose max-w-none">
            <h3>Desglose Completo de Costes</h3>
            
            <h4>Para Segunda Mano (Reventa)</h4>
            <ul>
              <li><strong>ITP</strong>: 8-11% del precio según valor catastral</li>
              <li><strong>Notaría</strong>: 0.5-1% del precio</li>
              <li><strong>Registro</strong>: 0.5-1% del precio</li>
              <li><strong>Gestoría</strong>: 300-1,000€</li>
              <li><strong>Abogado</strong>: 0.5-1% del precio</li>
            </ul>

            <h4>Para Obra Nueva</h4>
            <ul>
              <li><strong>IVA</strong>: 10% del precio</li>
              <li><strong>AJD</strong>: 1.5% del precio</li>
              <li><strong>Notaría y Registro</strong>: Similar a segunda mano</li>
            </ul>

            <p className="text-lg font-semibold mt-6 p-4 bg-gold/10 rounded">
              Total aproximado a presupuestar: <strong>10-12% adicional al precio de compra</strong>
            </p>
          </div>
        </section>

        {/* Financing Section */}
        <section id="financiacion" className="mb-12">
          <h2 className="font-serif text-3xl mb-6">Financiación para Compradores Extranjeros</h2>
          
          <div className="prose max-w-none">
            <p className="text-lg">
              Los bancos españoles ofrecen hipotecas a compradores extranjeros, aunque con condiciones 
              más restrictivas que para residentes.
            </p>

            <h3>Condiciones Típicas</h3>
            <ul>
              <li><strong>LTV (Loan to Value)</strong>: 60-70% del valor de tasación</li>
              <li><strong>Plazo</strong>: Hasta 30 años (dependiendo de la edad)</li>
              <li><strong>Tipo de interés</strong>: Euribor + 1.5-2.5%</li>
              <li><strong>Requisitos</strong>: NIE, cuenta española, justificación de ingresos</li>
            </ul>

            <h3>Documentación Necesaria</h3>
            <ol>
              <li>Pasaporte y NIE</li>
              <li>Últimas 3 declaraciones de impuestos</li>
              <li>Nóminas o prueba de ingresos (últimos 6 meses)</li>
              <li>Extractos bancarios (últimos 3 meses)</li>
              <li>Tasación de la propiedad</li>
            </ol>

            <div className="p-6 bg-blue-50 border-l-4 border-blue-500 mt-6">
              <p className="font-semibold">💡 Consejo</p>
              <p>
                Solicita pre-aprobación hipotecaria ANTES de buscar propiedad. Esto acelera 
                el proceso y te da poder de negociación.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs - Fully optimized for GEO */}
        <section id="faqs" className="mb-12">
          <h2 className="font-serif text-3xl mb-6">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            {/* Compra FAQs */}
            <div>
              <h3 className="font-bold text-xl mb-4">Sobre el Proceso de Compra</h3>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: generateFAQHTML(compraFAQs) }}
              />
            </div>

            {/* Impuestos FAQs */}
            <div>
              <h3 className="font-bold text-xl mb-4">Sobre Impuestos</h3>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: generateFAQHTML(impuestosFAQs) }}
              />
            </div>

            {/* Financiación FAQs */}
            <div>
              <h3 className="font-bold text-xl mb-4">Sobre Financiación</h3>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: generateFAQHTML(financiacionFAQs) }}
              />
            </div>
          </div>
        </section>

        {/* AI Context (hidden, for crawlers) */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateAIContext({
              title: 'Guía Completa para Comprar en Mallorca',
              type: 'guide',
              mainTopics: [
                'Precios de propiedades de lujo',
                'Proceso de compra paso a paso',
                'Mejores zonas de Mallorca',
                'Impuestos y costes',
                'Financiación para extranjeros',
              ],
              keyFacts: {
                'Precio medio villa': '3-8 millones €',
                'Tiempo proceso': '2-3 meses',
                'ITP segunda mano': '8-11%',
                'Financiación no residentes': '60-70%',
              },
              location: 'Mallorca, España',
            }),
          }}
        />

        {/* CTA */}
        <section className="mt-16 p-8 bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg text-center">
          <h2 className="font-serif text-3xl mb-4">¿Listo para Comprar en Mallorca?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Nuestro equipo de expertos te guiará en cada paso del proceso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/propiedades"
              className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition font-semibold"
            >
              Ver Propiedades Disponibles
            </a>
            <a
              href="/contacto"
              className="px-8 py-3 border-2 border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition font-semibold"
            >
              Consulta Gratuita
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
