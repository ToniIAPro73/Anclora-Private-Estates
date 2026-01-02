import React from 'react';
import { Calendar, Wrench, Euro, FileText, Users, ArrowRight } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { ContactForm } from '@/components/shared/ContactForm';

const services = [
  {
    icon: Calendar,
    title: 'Gestión de Alquileres',
    description: 'Publicación en plataformas, check-in/check-out, limpieza y atención al huésped.',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento',
    description: 'Inspecciones regulares, reparaciones preventivas y gestión de proveedores.',
  },
  {
    icon: Euro,
    title: 'Administración Financiera',
    description: 'Cobro de rentas, pago de facturas, gestión fiscal y reportes detallados.',
  },
  {
    icon: FileText,
    title: 'Documentación',
    description: 'Contratos, seguros, licencias turísticas y cumplimiento normativo.',
  },
  {
    icon: Users,
    title: 'Atención 24/7',
    description: 'Soporte continuo para inquilinos y propietarios ante cualquier incidencia.',
  },
];

const pricing = [
  {
    title: 'Gestión Básica',
    price: '8-10%',
    description: 'De los ingresos por alquiler',
    features: [
      'Cobro de rentas',
      'Inspecciones mensuales',
      'Coordinación de mantenimiento',
      'Reporte trimestral',
    ],
  },
  {
    title: 'Gestión Premium',
    price: '12-15%',
    description: 'De los ingresos por alquiler',
    features: [
      'Todo lo anterior',
      'Gestión de alquiler vacacional',
      'Marketing y publicidad',
      'Atención 24/7',
      'Reporte mensual detallado',
    ],
    featured: true,
  },
];

/**
 * Gestión Service Page
 */
export default function GestionPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Gestión de Propiedades
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Maximiza la rentabilidad de tu inversión inmobiliaria mientras 
              disfrutas de tranquilidad total.
            </p>
          </Container>
        </Section>

        {/* Services */}
        <Section background="beige" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Servicios Incluidos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Gestión integral para que no tengas que preocuparte de nada
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="w-12 h-12 rounded-full bg-anclora-gold/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-anclora-gold" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-gray-dark mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Pricing */}
        <Section background="white" padding="lg">
          <Container size="xl">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Planes de Gestión
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {pricing.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-8 ${
                    plan.featured
                      ? 'bg-anclora-gold text-white shadow-xl scale-105'
                      : 'bg-beige'
                  }`}
                >
                  {plan.featured && (
                    <div className="text-sm font-semibold uppercase tracking-wide mb-4">
                      Más Popular
                    </div>
                  )}
                  
                  <h3 className={`font-serif text-2xl font-semibold mb-2 ${
                    plan.featured ? 'text-white' : 'text-gray-dark'
                  }`}>
                    {plan.title}
                  </h3>
                  
                  <div className={`text-4xl font-bold mb-2 ${
                    plan.featured ? 'text-white' : 'text-anclora-gold'
                  }`}>
                    {plan.price}
                  </div>
                  
                  <p className={`text-sm mb-6 ${
                    plan.featured ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={plan.featured ? 'text-white' : 'text-anclora-gold'}>
                          ✓
                        </span>
                        <span className={plan.featured ? 'text-white/90' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-beige rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-6 text-center">
                Solicita más información
              </h3>
              <ContactForm type="consultation" />
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="gradient" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              Convierte tu propiedad en un activo productivo
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nuestro equipo de gestión se encarga de todo para que tú solo recibas los beneficios.
            </p>
            <a href="/contacto?tipo=consulta">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Consultar Planes
              </Button>
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
