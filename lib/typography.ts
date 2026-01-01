/**
 * TYPOGRAPHY UTILITIES
 * Predefined text styles for consistent typography across the application
 */

export const typography = {
  // Headings - Serif (Playfair Display)
  h1: 'font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight',
  h2: 'font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
  h3: 'font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight',
  h4: 'font-serif text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug',
  h5: 'font-serif text-xl md:text-2xl lg:text-3xl font-medium leading-snug',
  h6: 'font-serif text-lg md:text-xl lg:text-2xl font-medium leading-normal',

  // Display - Larger sizes for hero sections
  display1: 'font-serif text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight',
  display2: 'font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight',

  // Body Text - Sans (Montserrat)
  bodyLg: 'font-sans text-lg md:text-xl leading-relaxed',
  body: 'font-sans text-base md:text-lg leading-relaxed',
  bodySm: 'font-sans text-sm md:text-base leading-relaxed',
  bodyXs: 'font-sans text-xs md:text-sm leading-normal',

  // Special Text Styles
  lead: 'font-sans text-xl md:text-2xl font-light leading-relaxed text-gray-600',
  quote: 'font-serif text-2xl md:text-3xl font-medium italic leading-relaxed',
  caption: 'font-sans text-xs md:text-sm text-gray-500 leading-normal',
  overline: 'font-sans text-xs uppercase tracking-widest font-semibold',

  // Labels and UI Text
  label: 'font-sans text-sm font-medium leading-none',
  labelLg: 'font-sans text-base font-medium leading-none',
  labelSm: 'font-sans text-xs font-medium leading-none',

  // Links
  link: 'font-sans text-base text-anclora-gold hover:text-anclora-gold-dark underline-offset-4 hover:underline transition-colors',
  linkSm: 'font-sans text-sm text-anclora-gold hover:text-anclora-gold-dark underline-offset-4 hover:underline transition-colors',

  // Button Text
  buttonLg: 'font-sans text-lg font-semibold tracking-wide uppercase',
  button: 'font-sans text-base font-semibold tracking-wide uppercase',
  buttonSm: 'font-sans text-sm font-semibold tracking-wide uppercase',
} as const;

export type TypographyVariant = keyof typeof typography;

/**
 * Helper function to get typography classes
 * 
 * @example
 * <h1 className={getTypography('h1')}>Title</h1>
 * <p className={getTypography('body')}>Content</p>
 */
export function getTypography(variant: TypographyVariant): string {
  return typography[variant];
}
