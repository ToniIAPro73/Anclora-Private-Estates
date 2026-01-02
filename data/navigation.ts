import type { NavItem } from '@/types';

/**
 * NAVEGACIÓN PRINCIPAL - ANCLORA PRIVATE ESTATES
 * 
 * Estructura de navegación para el sitio web
 * Organizada por audiencia dual: Inversores HNWI y Agentes Inmobiliarios
 */

export const mainNavigation: NavItem[] = [
  {
    label: {
      es: 'Inicio',
      en: 'Home',
      de: 'Startseite',
    },
    href: '/',
  },
  {
    label: {
      es: 'Propiedades',
      en: 'Properties',
      de: 'Immobilien',
    },
    href: '/propiedades',
    children: [
      {
        label: {
          es: 'Todas las Propiedades',
          en: 'All Properties',
          de: 'Alle Immobilien',
        },
        href: '/propiedades',
      },
      {
        label: {
          es: 'Villas de Lujo',
          en: 'Luxury Villas',
          de: 'Luxusvillen',
        },
        href: '/propiedades?tipo=villa',
      },
      {
        label: {
          es: 'Áticos Exclusivos',
          en: 'Exclusive Penthouses',
          de: 'Exklusive Penthouses',
        },
        href: '/propiedades?tipo=penthouse',
      },
      {
        label: {
          es: 'Fincas y Estates',
          en: 'Estates & Fincas',
          de: 'Fincas & Estates',
        },
        href: '/propiedades?tipo=estate',
      },
      {
        label: {
          es: 'Off-Market',
          en: 'Off-Market',
          de: 'Off-Market',
        },
        href: '/propiedades?status=off-market',
      },
    ],
  },
  {
    label: {
      es: 'Servicios',
      en: 'Services',
      de: 'Dienstleistungen',
    },
    href: '/servicios',
    children: [
      {
        label: {
          es: 'Compra de Propiedades',
          en: 'Property Acquisition',
          de: 'Immobilienerwerb',
        },
        href: '/servicios/compra',
      },
      {
        label: {
          es: 'Venta de Propiedades',
          en: 'Property Sales',
          de: 'Immobilienverkauf',
        },
        href: '/servicios/venta',
      },
      {
        label: {
          es: 'Valoración Gratuita',
          en: 'Free Valuation',
          de: 'Kostenlose Bewertung',
        },
        href: '/servicios/valoracion',
      },
      {
        label: {
          es: 'Gestión Post-Compra',
          en: 'Post-Purchase Management',
          de: 'After-Sales-Management',
        },
        href: '/servicios/gestion',
      },
    ],
  },
  {
    label: {
      es: 'Sobre Nosotros',
      en: 'About Us',
      de: 'Über uns',
    },
    href: '/nosotros',
  },
  {
    label: {
      es: 'Insights',
      en: 'Insights',
      de: 'Insights',
    },
    href: '/blog',
  },
  {
    label: {
      es: 'Contacto',
      en: 'Contact',
      de: 'Kontakt',
    },
    href: '/contacto',
  },
];

/**
 * NAVEGACIÓN FOOTER
 */
export const footerNavigation = {
  company: {
    title: {
      es: 'Anclora Private Estates',
      en: 'Anclora Private Estates',
      de: 'Anclora Private Estates',
    },
    links: [
      {
        label: {
          es: 'Sobre Nosotros',
          en: 'About Us',
          de: 'Über uns',
        },
        href: '/nosotros',
      },
      {
        label: {
          es: 'Nuestra Filosofía',
          en: 'Our Philosophy',
          de: 'Unsere Philosophie',
        },
        href: '/nosotros#filosofia',
      },
      {
        label: {
          es: 'Equipo',
          en: 'Team',
          de: 'Team',
        },
        href: '/nosotros#equipo',
      },
      {
        label: {
          es: 'Trabaja con Nosotros',
          en: 'Work With Us',
          de: 'Karriere',
        },
        href: '/nosotros#carreras',
      },
    ],
  },
  services: {
    title: {
      es: 'Servicios',
      en: 'Services',
      de: 'Dienstleistungen',
    },
    links: [
      {
        label: {
          es: 'Compra',
          en: 'Buy',
          de: 'Kauf',
        },
        href: '/servicios/compra',
      },
      {
        label: {
          es: 'Venta',
          en: 'Sell',
          de: 'Verkauf',
        },
        href: '/servicios/venta',
      },
      {
        label: {
          es: 'Valoración',
          en: 'Valuation',
          de: 'Bewertung',
        },
        href: '/servicios/valoracion',
      },
      {
        label: {
          es: 'Gestión',
          en: 'Management',
          de: 'Management',
        },
        href: '/servicios/gestion',
      },
    ],
  },
  properties: {
    title: {
      es: 'Propiedades',
      en: 'Properties',
      de: 'Immobilien',
    },
    links: [
      {
        label: {
          es: 'Villas',
          en: 'Villas',
          de: 'Villen',
        },
        href: '/propiedades?tipo=villa',
      },
      {
        label: {
          es: 'Áticos',
          en: 'Penthouses',
          de: 'Penthouses',
        },
        href: '/propiedades?tipo=penthouse',
      },
      {
        label: {
          es: 'Fincas',
          en: 'Estates',
          de: 'Fincas',
        },
        href: '/propiedades?tipo=estate',
      },
      {
        label: {
          es: 'Off-Market',
          en: 'Off-Market',
          de: 'Off-Market',
        },
        href: '/propiedades?status=off-market',
      },
    ],
  },
  legal: {
    title: {
      es: 'Legal',
      en: 'Legal',
      de: 'Legal',
    },
    links: [
      {
        label: {
          es: 'Política de Privacidad',
          en: 'Privacy Policy',
          de: 'Datenschutzrichtlinie',
        },
        href: '/legal/privacidad',
      },
      {
        label: {
          es: 'Términos y Condiciones',
          en: 'Terms & Conditions',
          de: 'Allgemeine Geschäftsbedingungen',
        },
        href: '/legal/terminos',
      },
      {
        label: {
          es: 'Cookies',
          en: 'Cookies',
          de: 'Cookies',
        },
        href: '/legal/cookies',
      },
      {
        label: {
          es: 'Aviso Legal',
          en: 'Legal Notice',
          de: 'Impressum',
        },
        href: '/legal/aviso-legal',
      },
    ],
  },
};

/**
 * NAVEGACIÓN SECUNDARIA (CTA Buttons)
 */
export const ctaNavigation = {
  primary: {
    label: {
      es: 'Descubrir Propiedades',
      en: 'Discover Properties',
      de: 'Immobilien entdecken',
    },
    href: '/propiedades',
  },
  secondary: {
    label: {
      es: 'Solicitar Consulta',
      en: 'Request Consultation',
      de: 'Beratung anfordern',
    },
    href: '/contacto?tipo=consulta',
  },
  valuation: {
    label: {
      es: 'Valoración Gratuita',
      en: 'Free Valuation',
      de: 'Kostenlose Bewertung',
    },
    href: '/servicios/valoracion',
  },
  aiAudit: {
    label: {
      es: 'Auditoría IA Gratuita',
      en: 'Free AI Audit',
      de: 'Kostenlose KI-Audit',
    },
    href: 'https://chatgpt.com/g/g-YOUR_GPT_ID', // Actualizar con GPT real
    external: true,
  },
};

/**
 * REDES SOCIALES
 */
export const socialLinks = [
  {
    platform: 'linkedin' as const,
    url: 'https://linkedin.com/company/anclora-private-estates',
    label: {
      es: 'LinkedIn',
      en: 'LinkedIn',
      de: 'LinkedIn',
    },
  },
  {
    platform: 'instagram' as const,
    url: 'https://instagram.com/ancloraprivateestates',
    label: {
      es: 'Instagram',
      en: 'Instagram',
      de: 'Instagram',
    },
  },
  {
    platform: 'facebook' as const,
    url: 'https://facebook.com/ancloraprivateestates',
    label: {
      es: 'Facebook',
      en: 'Facebook',
      de: 'Facebook',
    },
  },
];
