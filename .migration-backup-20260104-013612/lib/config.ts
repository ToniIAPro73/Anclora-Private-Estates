/**
 * CONFIGURACIÓN GENERAL DEL SITIO
 * Anclora Private Estates
 */

export const siteConfig = {
  // Información básica
  name: 'Anclora Private Estates',
  shortName: 'Anclora',
  tagline: {
    es: 'El privilegio de la privacidad en el Mediterráneo',
    en: 'The privilege of privacy in the Mediterranean',
  },
  description: {
    es: 'Agencia inmobiliaria de lujo en Mallorca. Propiedades exclusivas, confidencialidad absoluta y asesoría integral para inversores de alto patrimonio.',
    en: 'Luxury real estate agency in Mallorca. Exclusive properties, absolute confidentiality, and comprehensive advisory for high-net-worth investors.',
  },

  // URLs y dominios
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ancloraprivateestates.com',
  domain: 'ancloraprivateestates.com',

  // Idiomas
  languages: {
    default: 'es',
    supported: ['es', 'en'],
  },

  // Contacto
  contact: {
    email: 'info@ancloraprivateestates.com',
    phone: '+34 XXX XXX XXX',
    whatsapp: '+34 XXX XXX XXX',
    address: {
      es: 'Mallorca, Islas Baleares, España',
      en: 'Mallorca, Balearic Islands, Spain',
    },
  },

  // Horario
  businessHours: {
    es: {
      weekdays: 'Lunes - Viernes: 9:00 - 19:00',
      saturday: 'Sábado: 10:00 - 14:00',
      sunday: 'Domingo: Cerrado',
    },
    en: {
      weekdays: 'Monday - Friday: 9:00 AM - 7:00 PM',
      saturday: 'Saturday: 10:00 AM - 2:00 PM',
      sunday: 'Sunday: Closed',
    },
  },

  // Redes sociales
  social: {
    linkedin: 'https://linkedin.com/company/anclora-private-estates',
    instagram: 'https://instagram.com/ancloraprivateestates',
    facebook: 'https://facebook.com/ancloraprivateestates',
    twitter: 'https://twitter.com/ancloraestates',
    youtube: 'https://youtube.com/@ancloraprivateestates',
  },

  // Compliance y legal
  compliance: {
    es: 'Una marca de Anclora Nexus Group | Brokered by eXp Realty Spain',
    en: 'A brand of Anclora Nexus Group | Brokered by eXp Realty Spain',
    license: 'API XXX-XXXX', // Actualizar con número real
  },

  // Brand colors
  colors: {
    primary: '#C5A059', // Gold
    primaryLight: '#D4B575',
    primaryDark: '#A6834A',
    black: '#000000',
    grayDark: '#1A1A1A',
    grayMedium: '#4A4A4A',
    grayLight: '#E5E5E5',
    beige: '#F5F5DC',
    beigeLight: '#FAF9F6',
    white: '#FFFFFF',
  },

  // Tipografías
  fonts: {
    sans: 'Montserrat, system-ui, sans-serif',
    serif: 'Playfair Display, Georgia, serif',
  },

  // Configuración de propiedades
  properties: {
    // Rangos de precio (en EUR)
    priceRanges: [
      { min: 0, max: 500000, label: { es: 'Hasta 500.000€', en: 'Up to €500K' } },
      { min: 500000, max: 1000000, label: { es: '500.000€ - 1M€', en: '€500K - €1M' } },
      { min: 1000000, max: 2000000, label: { es: '1M€ - 2M€', en: '€1M - €2M' } },
      { min: 2000000, max: 5000000, label: { es: '2M€ - 5M€', en: '€2M - €5M' } },
      { min: 5000000, max: Infinity, label: { es: 'Más de 5M€', en: 'Over €5M' } },
    ],

    // Tipos de propiedad
    types: [
      { value: 'villa', label: { es: 'Villa', en: 'Villa' } },
      { value: 'apartment', label: { es: 'Apartamento', en: 'Apartment' } },
      { value: 'penthouse', label: { es: 'Ático', en: 'Penthouse' } },
      { value: 'estate', label: { es: 'Finca', en: 'Estate' } },
      { value: 'land', label: { es: 'Terreno', en: 'Land' } },
    ],

    // Regiones principales
    regions: [
      'Son Vida',
      'Palma Centro',
      'Paseo Marítimo',
      'Port d\'Andratx',
      'Valldemossa',
      'Deià',
      'Sóller',
      'Pollensa',
      'Alcúdia',
      'Santa Ponsa',
    ],

    // Items por página
    itemsPerPage: 12,
  },

  // Blog
  blog: {
    postsPerPage: 9,
    categories: [
      { value: 'market-insights', label: { es: 'Análisis de Mercado', en: 'Market Insights' } },
      { value: 'property-spotlight', label: { es: 'Propiedades Destacadas', en: 'Property Spotlight' } },
      { value: 'lifestyle', label: { es: 'Estilo de Vida', en: 'Lifestyle' } },
      { value: 'investment', label: { es: 'Inversión', en: 'Investment' } },
      { value: 'news', label: { es: 'Noticias', en: 'News' } },
    ],
  },

  // Features del sitio
  features: {
    enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
    enableProperties: process.env.NEXT_PUBLIC_ENABLE_PROPERTIES === 'true',
    enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM === 'true',
    enableNewsletter: true,
    enableChatWidget: false, // Activar cuando esté integrado WhatsApp
    enableAnalytics: process.env.NODE_ENV === 'production',
  },

  // Analytics IDs
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixel: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    plausible: {
      domain: 'ancloraprivateestates.com',
    },
  },

  // SEO defaults
  seo: {
    keywords: {
      es: [
        'inmobiliaria de lujo Mallorca',
        'villas exclusivas Mallorca',
        'propiedades premium Palma',
        'real estate Mallorca',
        'fincas de lujo',
        'áticos Paseo Marítimo',
        'inversión inmobiliaria Baleares',
      ],
      en: [
        'luxury real estate Mallorca',
        'exclusive villas Mallorca',
        'premium properties Palma',
        'Mallorca real estate',
        'luxury estates',
        'penthouses Paseo Marítimo',
        'real estate investment Balearics',
      ],
    },
    ogImage: '/assets/images/og-default.jpg',
    twitterHandle: '@ancloraestates',
  },

  // Configuración de robots.txt
  robots: {
    allowedBots: [
      'Googlebot',
      'Bingbot',
      'Google-Extended', // Para Gemini
      'GPTBot', // Para ChatGPT
      'PerplexityBot', // Para Perplexity
      'Applebot', // Para Apple Intelligence
      'ClaudeBot', // Para Claude
      'anthropic-ai', // Alternativo para Claude
    ],
  },

  // Cookies y privacy
  cookies: {
    essential: ['session', 'csrf'],
    analytics: ['_ga', '_gid', 'plausible'],
    marketing: ['_fbp', 'fr'],
  },

  // Integraciones backend
  integrations: {
    n8n: {
      baseUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.ancloraprivateestates.com',
      endpoints: {
        contactGeneral: '/webhook/contact-general',
        propertyInquiry: '/webhook/contact-property-inquiry',
        valuation: '/webhook/contact-valuation',
        consultation: '/webhook/contact-consultation',
      },
    },
    twentyCRM: {
      apiUrl: process.env.TWENTY_CRM_API_URL,
    },
    mautic: {
      baseUrl: process.env.MAUTIC_BASE_URL,
    },
    altcha: {
      challengeUrl: process.env.NEXT_PUBLIC_ALTCHA_CHALLENGE_URL || '/api/altcha/challenge',
    },
  },
};

/**
 * Configuración de Anclora Cognitive Solutions (B2B)
 */
export const cognitiveSolutionsConfig = {
  name: 'Anclora Cognitive Solutions',
  tagline: {
    es: 'Inteligencia que transforma negocios',
    en: 'Intelligence that transforms businesses',
  },
  gptAuditUrl: 'https://chatgpt.com/g/g-YOUR_GPT_ID', // Actualizar con GPT real
  services: [
    {
      id: 'ai-agent',
      name: { es: 'Agente IA 24/7', en: '24/7 AI Agent' },
      icon: 'bot',
    },
    {
      id: 'automation',
      name: { es: 'Automatización', en: 'Automation' },
      icon: 'workflow',
    },
    {
      id: 'analytics',
      name: { es: 'Analytics & ROI', en: 'Analytics & ROI' },
      icon: 'chart-line',
    },
  ],
};

export default siteConfig;
