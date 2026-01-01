import React from 'react';
import { Search, Eye, FileText, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ContactForm } from '@/components/shared/ContactForm';

const process = [
  {
    icon: Search,
    title: 'Consulta Inicial',
    description: 'Entendemos tus necesidades, presupuesto y preferencias para crear un perfil de búsqueda personalizado.',
  },
  {
    icon: Eye,
    title: 'Búsqueda y Selección',
    description: 'Accedemos a nuestro portfolio exclusivo y red de contactos para identificar propiedades que cumplan tus criterios.',
  },
  {
    icon: FileText,
    title: 'Visitas y Due Diligence',
    description: 'Coordinamos visitas, revisiones técnicas y análisis legal de las propiedades seleccionadas.',
  },
  {
    icon: Award,
    title: 'Negociación',
    description: 'Negociamos en tu nombre para asegurar las mejores condiciones posibles.',
  },
  {
    icon: CheckCircle,
    title: 'Cierre',
    description: 'Te acompañamos hasta la firma final, coordinando con notarios, abogados y entidades financieras.',
  },
];

const benefits = [
  'Acceso a propiedades off-market no disponibles públicamente',
  'Conocimiento profundo del mercado inmobiliario de Mallorca',
  'Red de contactos con propietarios y desarrolladores',
  'Negociación profesional que puede ahorrarte hasta un 10%',
  'Coordinación completa del proceso de compra',
  'Asesoramiento legal y financiero de confianza',
];

/**
 * Compra Service Page
 */
export default function CompraPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Servicio de Compra
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Encuentra la propiedad perfecta en Mallorca con acceso exclusivo 
              a las mejores oportunidades del mercado.
            </p>
          </Container>
        </Section>

        {/* Benefits */}
        <Section background="beige" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                  ¿Por qué comprar con Anclora?
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Nuestro servicio de compra va más allá de mostrar propiedades. 
                  Te damos acceso a un ecosistema exclusivo de oportunidades y 
                  expertise que no encontrarás en portales públicos.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-anclora-gold flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-6">
                  Inicia tu búsqueda
                </h3>
                <ContactForm type="consultation" />
              </div>
            </div>
          </Container>
        </Section>

        {/* Process */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Nuestro Proceso
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Un enfoque estructurado que garantiza eficiencia y resultados
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-anclora-gold/20 -translate-x-1/2 z-0" />
                    )}
                    
                    <div className="relative bg-beige rounded-lg p-6 hover:shadow-md transition-shadow z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-anclora-gold text-white flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <Icon className="w-8 h-8 text-anclora-gold" />
                      </div>
                      
                      <h3 className="font-serif text-xl font-semibold text-gray-dark mb-3">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="gradient" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              Comienza tu búsqueda hoy
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Agenda una consulta sin compromiso y descubre cómo podemos ayudarte.
            </p>
            <a href="/contacto?tipo=consulta">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Agendar Consulta
              </Button>
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
