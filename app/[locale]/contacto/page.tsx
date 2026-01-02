import React from 'react';
import { Mail, Phone, MapPin, Clock, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Header, Footer, Section, Container } from '@/components/layout';
import { ContactForm } from '@/components/shared/ContactForm';
import siteConfig from '@/lib/config';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'info@ancloraprivateestates.com',
    href: 'mailto:info@ancloraprivateestates.com',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    value: '+34 971 XXX XXX',
    href: 'tel:+34971XXXXXX',
  },
  {
    icon: MapPin,
    title: 'Dirección',
    value: 'Palma de Mallorca, Islas Baleares',
    href: null,
  },
  {
    icon: Clock,
    title: 'Horario',
    value: 'Lun-Vie: 9:00 - 18:00',
    href: null,
  },
];

const socialLinks = [
  { icon: Linkedin, href: siteConfig.socialLinks.linkedin, label: 'LinkedIn' },
  { icon: Instagram, href: siteConfig.socialLinks.instagram, label: 'Instagram' },
  { icon: Facebook, href: siteConfig.socialLinks.facebook, label: 'Facebook' },
];

/**
 * Contact Page
 */
export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <Section background="dark" padding="lg">
          <Container size="lg" className="text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              Contacto
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos 
              en menos de 24 horas.
            </p>
          </Container>
        </Section>

        {/* Contact Info & Form */}
        <Section background="beige" padding="xl">
          <Container size="xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-dark mb-6">
                    Información de Contacto
                  </h2>
                  
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      const content = (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-anclora-gold/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-anclora-gold" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">{info.title}</p>
                            <p className="text-gray-dark font-medium">{info.value}</p>
                          </div>
                        </div>
                      );

                      return info.href ? (
                        <a
                          key={index}
                          href={info.href}
                          className="block hover:opacity-80 transition-opacity"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={index}>{content}</div>
                      );
                    })}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-serif text-xl font-semibold text-gray-dark mb-4">
                    Síguenos
                  </h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-lg bg-white flex items-center justify-center hover:bg-anclora-gold hover:text-white transition-colors shadow-md"
                          aria-label={social.label}
                        >
                          <Icon className="w-6 h-6" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-serif text-xl font-semibold text-gray-dark mb-4">
                    Horario de Atención
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Lunes - Viernes</span>
                      <span className="font-medium">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span className="font-medium">10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo</span>
                      <span className="font-medium">Cerrado</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    * Citas fuera de horario disponibles bajo solicitud
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="font-serif text-3xl font-bold text-gray-dark mb-6">
                    Envíanos un Mensaje
                  </h2>
                  <ContactForm type="general" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Map Placeholder */}
        <Section background="white" padding="none">
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Mapa interactivo</p>
              <p className="text-sm">Palma de Mallorca, Islas Baleares</p>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section background="beige" padding="lg">
          <Container size="lg">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-gray-dark mb-6">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold text-lg text-gray-dark mb-2">
                  ¿Cuánto tiempo toma recibir una respuesta?
                </h3>
                <p className="text-gray-600">
                  Respondemos todos los mensajes en menos de 24 horas, 
                  generalmente en menos de 6 horas durante horario laboral.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-dark mb-2">
                  ¿Ofrecen consultas virtuales?
                </h3>
                <p className="text-gray-600">
                  Sí, ofrecemos consultas por videollamada para clientes 
                  que no pueden visitarnos en persona.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-dark mb-2">
                  ¿Trabajan con clientes internacionales?
                </h3>
                <p className="text-gray-600">
                  Absolutamente. El 70% de nuestros clientes son internacionales. 
                  Hablamos inglés, alemán, francés y español.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-dark mb-2">
                  ¿Cuál es su comisión?
                </h3>
                <p className="text-gray-600">
                  Nuestras comisiones varían según el tipo de servicio y 
                  propiedad. Contacta con nosotros para una cotización personalizada.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
