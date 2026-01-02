import React from 'react';
import { FileText, BarChart, Home, CheckCircle, ArrowRight } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ContactForm } from '@/components/shared/ContactForm';

const included = [
  {
    icon: Home,
    title: 'Inspección Física',
    description: 'Visita presencial para evaluar estado, ubicación y características únicas.',
  },
  {
    icon: BarChart,
    title: 'Análisis Comparativo',
    description: 'CMA detallado con ventas recientes de propiedades similares en la zona.',
  },
  {
    icon: FileText,
    title: 'Informe Completo',
    description: 'Documento profesional con valoración, datos de mercado y recomendaciones.',
  },
];

const benefits = [
  'Valoración basada en datos reales de mercado',
  'Análisis de tendencias y proyecciones',
  'Recomendaciones para maximizar valor',
  'Informe en 48-72 horas',
  'Sin compromiso de venta',
  'Válido para refinanciación o herencias',
];

/**
 * Valoración Service Page
 */
export default function ValoracionPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Valoración Profesional
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Conoce el valor real de tu propiedad con un análisis profesional 
              basado en datos actualizados del mercado de Mallorca.
            </p>
          </Container>
        </Section>

        {/* What's Included */}
        <Section background="beige" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                ¿Qué incluye?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {included.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-anclora-gold" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-gray-dark mb-3">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Benefits & Form */}
        <Section background="white" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                  ¿Por qué valorar tu propiedad?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Ya sea que estés pensando en vender, refinanciar o simplemente 
                  quieras conocer el valor actual de tu inversión, una valoración 
                  profesional te da información precisa para tomar decisiones informadas.
                </p>

                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-anclora-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-beige rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Nota:</strong> La valoración es gratuita y sin compromiso. 
                    Recibirás un informe profesional completo sin obligación de 
                    contratar nuestros servicios de venta.
                  </p>
                </div>
              </div>

              <div className="bg-beige rounded-lg p-8 sticky top-24">
                <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-6">
                  Solicita tu valoración gratuita
                </h3>
                <ContactForm type="valuation" />
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="gradient" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              Conoce el valor de tu propiedad
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Informe profesional en 48-72 horas, completamente gratis.
            </p>
            <a href="/contacto?tipo=valoracion">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Solicitar Valoración
              </Button>
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
