import React from 'react';
import { ShoppingBag, TrendingUp, Calculator, Building } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { ServiceCard } from '@/components/services/ServiceCard';

const services = [
  {
    icon: ShoppingBag,
    title: 'Compra',
    description: 'Te ayudamos a encontrar la propiedad perfecta en Mallorca que se ajuste a tus necesidades y presupuesto.',
    features: [
      'Búsqueda personalizada según criterios',
      'Acceso a propiedades off-market exclusivas',
      'Asesoramiento durante todo el proceso',
      'Negociación profesional en tu nombre',
      'Coordinación de visitas y due diligence',
    ],
    href: '/servicios/compra',
    cta: 'Más información',
  },
  {
    icon: TrendingUp,
    title: 'Venta',
    description: 'Maximiza el valor de tu propiedad con nuestra estrategia de marketing digital y red de compradores internacionales.',
    features: [
      'Valoración profesional de mercado',
      'Marketing digital avanzado',
      'Fotografía y video profesional',
      'Red internacional de compradores cualificados',
      'Negociación y cierre exitoso',
    ],
    href: '/servicios/venta',
    cta: 'Más información',
  },
  {
    icon: Calculator,
    title: 'Valoración',
    description: 'Obtén una valoración precisa y actualizada de tu propiedad basada en análisis de mercado y datos reales.',
    features: [
      'Análisis comparativo de mercado (CMA)',
      'Inspección física de la propiedad',
      'Informe detallado con datos',
      'Recomendaciones de mejora',
      'Sin compromiso de venta',
    ],
    href: '/servicios/valoracion',
    cta: 'Solicitar valoración',
  },
  {
    icon: Building,
    title: 'Gestión',
    description: 'Gestión integral de tu propiedad de inversión para maximizar rentabilidad y tranquilidad.',
    features: [
      'Gestión de alquileres vacacionales',
      'Mantenimiento y reparaciones',
      'Administración financiera',
      'Coordinación con proveedores',
      'Reportes mensuales detallados',
    ],
    href: '/servicios/gestion',
    cta: 'Más información',
  },
];

/**
 * Services Hub Page
 * 
 * Overview of all Anclora Private Estates services
 */
export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Servicios integrales de real estate de lujo en Mallorca. 
              Desde la búsqueda hasta la gestión, te acompañamos en cada paso.
            </p>
          </Container>
        </Section>

        {/* Services Grid */}
        <Section background="beige" padding="xl">
          <Container size="xl">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section background="white" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              ¿No estás seguro de qué servicio necesitas?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Agenda una consulta gratuita y te ayudaremos a identificar 
              la mejor estrategia para tus objetivos inmobiliarios.
            </p>
            <a
              href="/contacto?tipo=consulta"
              className="inline-block px-8 py-4 bg-anclora-gold text-white font-semibold rounded-md hover:bg-anclora-gold-dark transition-colors"
            >
              Agendar Consulta Gratuita
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
