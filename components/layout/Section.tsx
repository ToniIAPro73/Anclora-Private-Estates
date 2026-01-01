import React from 'react';
import { Container, type ContainerSize } from './Container';

export type SectionBackground = 'white' | 'beige' | 'dark' | 'gradient';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface SectionProps {
  background?: SectionBackground;
  padding?: SectionPadding;
  containerSize?: ContainerSize;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

const backgroundClasses: Record<SectionBackground, string> = {
  white: 'bg-white',
  beige: 'bg-beige',
  dark: 'bg-gray-dark text-white',
  gradient: 'bg-gradient-to-br from-beige-light via-white to-beige',
};

const paddingClasses: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-24',
  xl: 'py-24 sm:py-32',
};

/**
 * Section Component
 * 
 * Full-width section wrapper with background and padding options
 * 
 * @example
 * <Section background="beige" padding="lg">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </Section>
 */
export function Section({
  background = 'white',
  padding = 'lg',
  containerSize = 'lg',
  className = '',
  children,
  id,
}: SectionProps) {
  const classes = `${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`;

  return (
    <section id={id} className={classes}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
