/**
 * Anclora Private Estates — módulo central de branding
 * Categoría: Ultra Premium
 * Contrato: ANCLORA_BRANDING_MASTER_CONTRACT + ANCLORA_ULTRA_PREMIUM_APP_CONTRACT
 *
 * Fuente única de verdad para nombre, assets, tokens canónicos y tipografía.
 * Assets finales (icono, favicon) pendientes de entrega por el usuario.
 */
export const PE_BRAND = {
  // Identidad
  name: 'Anclora Private Estates',
  shortName: 'Private Estates',
  description: 'Exclusividad elevada a obra de arte. Bienes raíces de lujo en Mallorca.',

  // Assets actuales (pendiente sustitución por assets finales)
  logoPath: '/Logo_Anclora_Private_Estates_sin_texto.png',
  faviconPath: '/pe_favicon.ico',
  faviconPrefix: 'pe_',

  // Paleta ultra-premium canónica (ANCLORA_BRANDING_COLOR_TOKENS — Ultra Premium)
  accentGold: '#D4AF37',
  accentGoldLight: '#E6C96E',
  accentGoldDim: '#B8962E',
  secondaryTeal: '#3AA090',
  backgroundDark: '#07252F',
  surfaceDark: '#0B313F',
  iconInterior: '#1A3035',

  // Borde de icono — Oro pulido (escalera: plata mono → plata → cobre → ORO)
  iconBorderPeak: '#F0D060',
  iconBorderMid: '#D4AF37',
  iconBorderShadow: '#8B7322',

  // Tipografía ultra-premium canónica (ANCLORA_BRANDING_TYPOGRAPHY)
  fontDisplay: 'Cardo',       // Display / H1-H2 — serif
  fontSans: 'Inter',          // Body / UI — sans-serif
  fontAccent: 'Fraunces',     // Acentos editoriales — serif

  // Idiomas soportados
  locales: ['es', 'en', 'de', 'fr'] as const,

  // Grupo de contrato
  contractGroup: 'Ultra Premium',
} as const
