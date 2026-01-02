/**
 * MAPA DE SECCIONES Y ESTRUCTURA DE CONTENIDOS
 * Anclora Private Estates
 * 
 * Define la estructura completa de todas las páginas del sitio
 */

export const siteMap = {
  // ==========================================
  // HOMEPAGE - Landing Page Principal
  // ==========================================
  homepage: {
    path: '/',
    sections: [
      {
        id: 'hero',
        name: 'Hero Section - Anclora Nexus Group',
        component: 'HeroSection',
        order: 1,
        content: {
          type: 'video-background',
          videoUrl: '/assets/videos/hero-mediterranean-architecture.mp4',
          logo: '/assets/logos/anclora-nexus-group.svg',
          headline: 'Cimentando el futuro, codificando el valor',
          subheadline: 'El ecosistema donde la excelencia inmobiliaria...',
          ctas: [
            {
              type: 'primary',
              text: 'Descubrir Propiedades Exclusivas',
              href: '#anclora-private-estates',
              audience: 'investor'
            },
            {
              type: 'secondary',
              text: 'Optimizar mi Agencia con IA',
              href: '#anclora-cognitive-solutions',
              audience: 'agent'
            }
          ]
        }
      },
      {
        id: 'problem',
        name: 'Problem/Opportunity Section',
        component: 'ProblemSection',
        order: 2,
        content: {
          type: 'two-column',
          title: 'Dos mundos, una solución integral',
          columns: [
            {
              audience: 'investor',
              icon: 'key',
              title: 'Para el Inversor',
              description: 'Encontrar una propiedad que trascienda...'
            },
            {
              audience: 'agent',
              icon: 'brain',
              title: 'Para el Agente',
              description: 'Maximizar el potencial de cada lead...'
            }
          ]
        }
      },
      {
        id: 'anclora-private-estates',
        name: 'Anclora Private Estates - B2C',
        component: 'PrivateEstatesSection',
        order: 3,
        content: {
          type: 'feature-showcase',
          background: 'beige-warm',
          logo: '/assets/logos/anclora-private-estates.svg',
          title: 'Anclora Private Estates',
          tagline: 'El privilegio de la privacidad en el Mediterráneo',
          description: 'No somos una agencia más. Somos curadores de estilos de vida...',
          features: [
            {
              icon: 'diamond',
              title: 'Curación de Activos',
              description: 'Selección manual de propiedades con potencial de legado'
            },
            {
              icon: 'shield-check',
              title: 'Confidencialidad Absoluta',
              description: 'Su privacidad es la base de nuestra relación'
            },
            {
              icon: 'user-check',
              title: 'Asesoría Integral',
              description: 'Desde la búsqueda hasta la gestión post-compra'
            }
          ],
          cta: {
            text: 'Solicitar Consulta Privada',
            href: '/contacto?tipo=consulta',
            type: 'primary'
          },
          compliance: 'Una marca de Anclora Nexus Group | Brokered by eXp Realty Spain'
        }
      },
      {
        id: 'anclora-cognitive-solutions',
        name: 'Anclora Cognitive Solutions - B2B',
        component: 'CognitiveSolutionsSection',
        order: 4,
        content: {
          type: 'feature-showcase',
          background: 'dark',
          logo: '/assets/logos/anclora-cognitive-solutions.svg',
          title: 'Anclora Cognitive Solutions',
          tagline: 'Inteligencia que transforma negocios',
          description: 'Transformamos su agencia inmobiliaria en un sistema operativo autónomo...',
          features: [
            {
              icon: 'bot',
              title: 'Agente IA 24/7',
              description: 'Respuesta instantánea a leads de portales como Idealista'
            },
            {
              icon: 'workflow',
              title: 'Automatización de Seguimiento',
              description: 'Nutrición persistente que convierte leads fríos en clientes'
            },
            {
              icon: 'chart-line',
              title: 'Dashboard de ROI',
              description: 'Tome decisiones basadas en datos, no en intuiciones'
            }
          ],
          cta: {
            text: 'Realizar mi Auditoría IA Gratuita',
            href: 'https://chatgpt.com/g/g-YOUR_GPT_ID',
            type: 'primary',
            external: true
          }
        }
      },
      {
        id: 'social-proof',
        name: 'Social Proof & Trust',
        component: 'SocialProofSection',
        order: 5,
        content: {
          type: 'logo-grid',
          title: 'Alianzas estratégicas y tecnología de vanguardia',
          logos: {
            technology: [
              { name: 'Make.com', logo: '/assets/logos/partners/make.svg' },
              { name: 'OpenAI', logo: '/assets/logos/partners/openai.svg' },
              { name: 'n8n', logo: '/assets/logos/partners/n8n.svg' }
            ],
            realEstate: [
              { name: 'eXp Realty', logo: '/assets/logos/partners/exp-realty.svg' },
              { name: 'MLS', logo: '/assets/logos/partners/mls.svg' }
            ]
          }
        }
      },
      {
        id: 'featured-properties',
        name: 'Featured Properties Carousel',
        component: 'FeaturedPropertiesSection',
        order: 6,
        content: {
          type: 'property-carousel',
          title: 'Propiedades Destacadas',
          subtitle: 'Selección exclusiva en Mallorca',
          limit: 6,
          filters: ['featured'],
          cta: {
            text: 'Ver Todas las Propiedades',
            href: '/propiedades'
          }
        }
      },
      {
        id: 'cta-final',
        name: 'Final CTA Section',
        component: 'FinalCtaSection',
        order: 7,
        content: {
          type: 'dual-cta',
          background: 'gradient-anclora',
          title: '¿Listo para dar el siguiente paso?',
          subtitle: 'Hablemos de su proyecto',
          ctas: [
            {
              text: 'Explorar Propiedades',
              href: '/propiedades',
              type: 'primary'
            },
            {
              text: 'Contactar',
              href: '/contacto',
              type: 'secondary'
            }
          ]
        }
      }
    ]
  },

  // ==========================================
  // PROPIEDADES - Catálogo
  // ==========================================
  properties: {
    path: '/propiedades',
    sections: [
      {
        id: 'properties-hero',
        name: 'Properties Page Hero',
        component: 'PageHero',
        content: {
          title: 'Propiedades Exclusivas',
          subtitle: 'Descubra nuestra selección curada de propiedades de lujo en Mallorca',
          background: '/assets/images/properties-hero.jpg'
        }
      },
      {
        id: 'properties-filters',
        name: 'Filters & Search',
        component: 'PropertyFilters',
        content: {
          filters: ['type', 'location', 'priceRange', 'bedrooms', 'status'],
          sortOptions: ['price-asc', 'price-desc', 'newest', 'featured']
        }
      },
      {
        id: 'properties-grid',
        name: 'Properties Grid',
        component: 'PropertiesGrid',
        content: {
          layout: 'grid',
          itemsPerPage: 12,
          pagination: true
        }
      }
    ]
  },

  // ==========================================
  // SERVICIOS
  // ==========================================
  services: {
    path: '/servicios',
    sections: [
      {
        id: 'services-hero',
        name: 'Services Hero',
        component: 'PageHero',
        content: {
          title: 'Nuestros Servicios',
          subtitle: 'Asesoría integral en cada paso del camino'
        }
      },
      {
        id: 'services-grid',
        name: 'Services Grid',
        component: 'ServicesGrid',
        content: {
          services: ['buy', 'sell', 'valuation', 'management']
        }
      }
    ]
  },

  // ==========================================
  // SOBRE NOSOTROS
  // ==========================================
  about: {
    path: '/nosotros',
    sections: [
      {
        id: 'about-hero',
        name: 'About Hero',
        component: 'PageHero'
      },
      {
        id: 'our-story',
        name: 'Our Story',
        component: 'StorySection'
      },
      {
        id: 'our-philosophy',
        name: 'Our Philosophy',
        component: 'PhilosophySection'
      },
      {
        id: 'our-values',
        name: 'Our Values',
        component: 'ValuesSection'
      },
      {
        id: 'team',
        name: 'Team',
        component: 'TeamSection'
      }
    ]
  },

  // ==========================================
  // BLOG
  // ==========================================
  blog: {
    path: '/blog',
    sections: [
      {
        id: 'blog-hero',
        name: 'Blog Hero',
        component: 'PageHero'
      },
      {
        id: 'blog-featured',
        name: 'Featured Post',
        component: 'FeaturedPost'
      },
      {
        id: 'blog-categories',
        name: 'Categories Filter',
        component: 'CategoriesFilter'
      },
      {
        id: 'blog-grid',
        name: 'Posts Grid',
        component: 'BlogGrid'
      }
    ]
  },

  // ==========================================
  // CONTACTO
  // ==========================================
  contact: {
    path: '/contacto',
    sections: [
      {
        id: 'contact-hero',
        name: 'Contact Hero',
        component: 'PageHero',
        content: {
          title: 'Hablemos de su Proyecto',
          subtitle: 'Estamos aquí para ayudarle'
        }
      },
      {
        id: 'contact-form',
        name: 'Contact Form',
        component: 'ContactForm',
        content: {
          formTypes: ['general', 'property-inquiry', 'valuation', 'consultation']
        }
      },
      {
        id: 'contact-info',
        name: 'Contact Information',
        component: 'ContactInfo',
        content: {
          showMap: true,
          showHours: true,
          showSocial: true
        }
      }
    ]
  }
};

/**
 * Orden de carga de componentes por prioridad
 */
export const componentLoadPriority = {
  critical: ['HeroSection', 'Navigation', 'Footer'],
  high: ['PropertyCard', 'ContactForm', 'FeaturedPropertiesSection'],
  medium: ['BlogCard', 'TeamMember', 'SocialProofSection'],
  low: ['Testimonials', 'Newsletter', 'ChatWidget']
};

/**
 * Metadata SEO por página
 */
export const pageSeoData = {
  homepage: {
    title: {
      es: 'Anclora Private Estates | Real Estate de Lujo en Mallorca',
      en: 'Anclora Private Estates | Luxury Real Estate in Mallorca',
      de: 'Anclora Private Estates | Luxusimmobilien auf Mallorca',
    },
    description: {
      es: 'Descubra propiedades de lujo exclusivas en Mallorca. Selección curada de villas y fincas premium con confidencialidad absoluta.',
      en: 'Discover exclusive luxury properties in Mallorca. Curated selection of premium villas and estates with absolute confidentiality.',
      de: 'Entdecken Sie exklusive Luxusimmobilien auf Mallorca. Kuratierte Auswahl an Premium-Villen und Anwesen mit absoluter Vertraulichkeit.',
    },
    keywords: ['luxury real estate', 'Mallorca properties', 'exclusive villas', 'private estates'],
    ogImage: '/assets/images/og-homepage.jpg'
  },
  properties: {
    title: {
      es: 'Propiedades Exclusivas | Anclora Private Estates',
      en: 'Exclusive Properties | Anclora Private Estates',
      de: 'Exklusive Immobilien | Anclora Private Estates',
    },
    description: {
      es: 'Explore nuestra colección exclusiva de propiedades de lujo en Mallorca.',
      en: 'Browse our exclusive collection of luxury properties in Mallorca.',
      de: 'Durchsuchen Sie unsere exklusive Kollektion von Luxusimmobilien auf Mallorca.',
    },
    keywords: ['properties Mallorca', 'luxury villas', 'real estate Mallorca'],
    ogImage: '/assets/images/og-properties.jpg'
  },
};
