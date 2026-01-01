import React from 'react';
import { Award, Target, Heart, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { OptimizedImage } from '@/components/ui';

const values = [
  {
    icon: Award,
    title: 'Excelencia',
    description: 'Estándares de servicio excepcionales en cada interacción y transacción.',
  },
  {
    icon: Heart,
    title: 'Integridad',
    description: 'Transparencia total y honestidad en todas nuestras relaciones comerciales.',
  },
  {
    icon: Target,
    title: 'Resultados',
    description: 'Enfoque orientado a objetivos medibles y resultados concretos para nuestros clientes.',
  },
  {
    icon: Sparkles,
    title: 'Innovación',
    description: 'Adopción de tecnología y metodologías avanzadas en el sector inmobiliario.',
  },
];

const team = [
  {
    name: 'Antonio García',
    role: 'Founder & CEO',
    bio: 'Experto en real estate de lujo con 15+ años de experiencia en Mallorca.',
    image: '/assets/images/placeholders/property-placeholder.svg',
  },
  {
    name: 'María Sánchez',
    role: 'Head of Sales',
    bio: 'Especialista en ventas internacionales con dominio de 5 idiomas.',
    image: '/assets/images/placeholders/property-placeholder.svg',
  },
  {
    name: 'Javier Ruiz',
    role: 'Technology Director',
    bio: 'Arquitecto de soluciones AI con expertise en automatización inmobiliaria.',
    image: '/assets/images/placeholders/property-placeholder.svg',
  },
];

const milestones = [
  { year: '2020', event: 'Fundación de Anclora Private Estates' },
  { year: '2021', event: '+50M€ en transacciones cerradas' },
  { year: '2022', event: 'Lanzamiento de Anclora Cognitive Solutions' },
  { year: '2023', event: 'Expansión a mercados internacionales' },
  { year: '2024', event: '+100 propiedades gestionadas' },
];

/**
 * About Page
 */
export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="xl">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Sobre Anclora
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Redefiniendo el real estate de lujo en Mallorca a través de 
              tecnología, expertise y servicio excepcional.
            </p>
          </Container>
        </Section>

        {/* Story */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                  Nuestra Historia
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Anclora Private Estates nació de una visión clara: transformar 
                    la experiencia de compra y venta de propiedades de lujo en Mallorca 
                    combinando el conocimiento local profundo con tecnología de vanguardia.
                  </p>
                  <p>
                    En 2020, identificamos una oportunidad única en el mercado inmobiliario 
                    mallorquín. Mientras las agencias tradicionales dependían de métodos 
                    convencionales, nosotros apostamos por la innovación: segmentación 
                    algorítmica, automatización inteligente y una red internacional de 
                    compradores HNWI.
                  </p>
                  <p>
                    Hoy, Anclora no es solo una agencia inmobiliaria. Somos un grupo 
                    empresarial con dos verticales: Anclora Private Estates (B2C) y 
                    Anclora Cognitive Solutions (B2B), ofreciendo servicios de IA a 
                    otras agencias del sector.
                  </p>
                </div>
              </div>

              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <OptimizedImage
                  src="/assets/images/placeholders/hero-placeholder.svg"
                  alt="Anclora Office Mallorca"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  objectFit="cover"
                />
              </div>
            </div>
          </Container>
        </Section>

        {/* Philosophy */}
        <Section background="beige" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
              Nuestra Filosofía
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Creemos que el real estate de lujo requiere un equilibrio perfecto 
              entre tecnología avanzada y toque humano. Nuestros algoritmos 
              encuentran a los compradores ideales, pero son nuestras relaciones 
              personales las que cierran las operaciones.
            </p>
          </Container>
        </Section>

        {/* Values */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Nuestros Valores
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-anclora-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-anclora-gold" />
                    </div>
                    
                    <h3 className="font-serif text-xl font-semibold text-gray-dark mb-3">
                      {value.title}
                    </h3>
                    
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Timeline */}
        <Section background="gradient" padding="lg">
          <Container size="lg">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Nuestro Camino
              </h2>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-anclora-gold/30 hidden md:block" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    <div className={`flex items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}>
                      {/* Content */}
                      <div className={`flex-1 ${
                        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                      }`}>
                        <div className="bg-white rounded-lg shadow-md p-6 inline-block">
                          <div className="text-2xl font-bold text-anclora-gold mb-2">
                            {milestone.year}
                          </div>
                          <div className="text-gray-700">
                            {milestone.event}
                          </div>
                        </div>
                      </div>

                      {/* Dot */}
                      <div className="hidden md:block w-4 h-4 rounded-full bg-anclora-gold border-4 border-white shadow-lg z-10" />

                      {/* Spacer */}
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section background="white" padding="xl">
          <Container size="xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Nuestro Equipo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Profesionales apasionados por el real estate y la tecnología
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative h-80 rounded-lg overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-shadow">
                    <OptimizedImage
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      objectFit="cover"
                      className="grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-semibold text-gray-dark mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-anclora-gold font-medium mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section background="dark" padding="lg">
          <Container size="md" className="text-center">
            <h2 className="font-serif text-4xl font-bold mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Descubre cómo podemos ayudarte con tus objetivos inmobiliarios
            </p>
            <a
              href="/contacto"
              className="inline-block px-8 py-4 bg-anclora-gold text-white font-semibold rounded-md hover:bg-anclora-gold-dark transition-colors"
            >
              Contactar
            </a>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
