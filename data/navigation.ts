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
    },
    href: '/',
  },
  {
    label: {
      es: 'Propiedades',
      en: 'Properties',
    },
    href: '/propiedades',
    children: [
      {
        label: {
          es: 'Todas las Propiedades',
          en: 'All Properties',
        },
        href: '/propiedades',
      },
      {
        label: {
          es: 'Villas de Lujo',
          en: 'Luxury Villas',
        },
        href: '/propiedades?tipo=villa',
      },
      {
        label: {
          es: 'Áticos Exclusivos',
          en: 'Exclusive Penthouses',
        },
        href: '/propiedades?tipo=penthouse',
      },
      {
        label: {
          es: 'Fincas y Estates',
          en: 'Estates & Fincas',
        },
        href: '/propiedades?tipo=estate',
      },
      {
        label: {
          es: 'Off-Market',
          en: 'Off-Market',
        },
        href: '/propiedades?status=off-market',
      },
    ],
  },
  {
    label: {
      es: 'Servicios',
      en: 'Services',
    },
    href: '/servicios',
    children: [
      {
        label: {
          es: 'Compra de Propiedades',
          en: 'Property Acquisition',
        },
        href: '/servicios/compra',
      },
      {
        label: {
          es: 'Venta de Propiedades',
          en: 'Property Sales',
        },
        href: '/servicios/venta',
      },
      {
        label: {
          es: 'Valoración Gratuita',
          en: 'Free Valuation',
        },
        href: '/servicios/valoracion',
      },
      {
        label: {
          es: 'Gestión Post-Compra',
          en: 'Post-Purchase Management',
        },
        href: '/servicios/gestion',
      },
    ],
  },
  {
    label: {
      es: 'Sobre Nosotros',
      en: 'About Us',
    },
    href: '/nosotros',
  },
  {
    label: {
      es: 'Insights',
      en: 'Insights',
    },
    href: '/blog',
  },
  {
    label: {
      es: 'Contacto',
      en: 'Contact',
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
    },
    links: [
      {
        label: {
          es: 'Sobre Nosotros',
          en: 'About Us',
        },
        href: '/nosotros',
      },
      {
        label: {
          es: 'Nuestra Filosofía',
          en: 'Our Philosophy',
        },
        href: '/nosotros#filosofia',
      },
      {
        label: {
          es: 'Equipo',
          en: 'Team',
        },
        href: '/nosotros#equipo',
      },
      {
        label: {
          es: 'Trabaja con Nosotros',
          en: 'Work With Us',
        },
        href: '/nosotros#carreras',
      },
    ],
  },
  services: {
    title: {
      es: 'Servicios',
      en: 'Services',
    },
    links: [
      {
        label: {
          es: 'Compra',
          en: 'Buy',
        },
        href: '/servicios/compra',
      },
      {
        label: {
          es: 'Venta',
          en: 'Sell',
        },
        href: '/servicios/venta',
      },
      {
        label: {
          es: 'Valoración',
          en: 'Valuation',
        },
        href: '/servicios/valoracion',
      },
      {
        label: {
          es: 'Gestión',
          en: 'Management',
        },
        href: '/servicios/gestion',
      },
    ],
  },
  properties: {
    title: {
      es: 'Propiedades',
      en: 'Properties',
    },
    links: [
      {
        label: {
          es: 'Villas',
          en: 'Villas',
        },
        href: '/propiedades?tipo=villa',
      },
      {
        label: {
          es: 'Áticos',
          en: 'Penthouses',
        },
        href: '/propiedades?tipo=penthouse',
      },
      {
        label: {
          es: 'Fincas',
          en: 'Estates',
        },
        href: '/propiedades?tipo=estate',
      },
      {
        label: {
          es: 'Off-Market',
          en: 'Off-Market',
        },
        href: '/propiedades?status=off-market',
      },
    ],
  },
  legal: {
    title: {
      es: 'Legal',
      en: 'Legal',
    },
    links: [
      {
        label: {
          es: 'Política de Privacidad',
          en: 'Privacy Policy',
        },
        href: '/legal/privacidad',
      },
      {
        label: {
          es: 'Términos y Condiciones',
          en: 'Terms & Conditions',
        },
        href: '/legal/terminos',
      },
      {
        label: {
          es: 'Cookies',
          en: 'Cookies',
        },
        href: '/legal/cookies',
      },
      {
        label: {
          es: 'Aviso Legal',
          en: 'Legal Notice',
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
    },
    href: '/propiedades',
  },
  secondary: {
    label: {
      es: 'Solicitar Consulta',
      en: 'Request Consultation',
    },
    href: '/contacto?tipo=consulta',
  },
  valuation: {
    label: {
      es: 'Valoración Gratuita',
      en: 'Free Valuation',
    },
    href: '/servicios/valoracion',
  },
  aiAudit: {
    label: {
      es: 'Auditoría IA Gratuita',
      en: 'Free AI Audit',
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
    },
  },
  {
    platform: 'instagram' as const,
    url: 'https://instagram.com/ancloraprivateestates',
    label: {
      es: 'Instagram',
      en: 'Instagram',
    },
  },
  {
    platform: 'facebook' as const,
    url: 'https://facebook.com/ancloraprivateestates',
    label: {
      es: 'Facebook',
      en: 'Facebook',
    },
  },
];
