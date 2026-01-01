import React from 'react';
import { Camera, Target, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ContactForm } from '@/components/shared/ContactForm';

const strategy = [
  {
    icon: Camera,
    title: 'Marketing Premium',
    description: 'Fotografía profesional, video drone 4K, tour virtual 360° y staging digital para presentar tu propiedad de forma excepcional.',
  },
  {
    icon: Target,
    title: 'Segmentación Algorítmica',
    description: 'Campañas de Facebook Ads dirigidas con precisión a compradores HNWI que buscan activamente en tu rango de precio.',
  },
  {
    icon: Users,
    title: 'Red Internacional',
    description: 'Acceso directo a nuestra base de compradores cualificados de Alemania, UK, Francia y Escandinavia.',
  },
  {
    icon: TrendingUp,
    title: 'Pricing Estratégico',
    description: 'Análisis de mercado basado en datos para posicionar tu propiedad con el precio óptimo que maximiza valor y velocidad de venta.',
  },
];

const advantages = [
  {
    title: 'Alcance Digital',
    stat: '50K+',
    description: 'Alcance mensual en redes sociales',
  },
  {
    title: 'Tiempo de Venta',
    stat: '45 días',
    description: 'Promedio para propiedades de lujo',
  },
  {
    title: 'Compradores Cualificados',
    stat: '95%',
    description: 'Con pre-aprobación financiera',
  },
];

/**
 * Venta Service Page
 */
export default function VentaPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Servicio de Venta
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Vende tu propiedad al mejor precio en el menor tiempo posible 
              con nuestra estrategia de marketing digital avanzado.
            </p>
          </Container>
        </Section>

        {/* Stats */}
        <Section background="white" padding="md">
          <Container size="xl">
            <div className="grid md:grid-cols-3 gap-8">
              {advantages.map((adv, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold text-anclora-gold mb-2">
                    {adv.stat}
                  </div>
                  <div className="font-serif text-xl font-semibold text-gray-dark mb-2">
                    {adv.title}
                  </div>
                  <div className="text-gray-600">
                    {adv.description}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Strategy */}
        <Section background="beige" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                Nuestra Estrategia
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tecnología y experiencia trabajando juntas para vender tu propiedad
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {strategy.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-8">
                    <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-anclora-gold" />
                    </div>
                    
                    <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-4">
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

        {/* Contact Form */}
        <Section background="white" padding="lg">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                  ¿Listo para vender?
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Comienza con una valoración gratuita sin compromiso. 
                  Te proporcionaremos un análisis detallado del mercado y 
                  una estrategia personalizada para tu propiedad.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-anclora-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-dark">Valoración Profesional</p>
                      <p className="text-gray-600">Análisis comparativo de mercado (CMA) detallado</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-anclora-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-dark">Plan de Marketing</p>
                      <p className="text-gray-600">Estrategia personalizada para tu propiedad</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-anclora-gold flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-dark">Sin Compromiso</p>
                      <p className="text-gray-600">Consulta gratuita, sin obligación de venta</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-beige rounded-lg p-8">
                <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-6">
                  Solicita tu valoración
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
              Vende con confianza
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Miles de compradores cualificados están buscando propiedades como la tuya.
            </p>
            <a href="/contacto?tipo=valoracion">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Solicitar Valoración Gratuita
              </Button>
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
