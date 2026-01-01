import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'private-estates' | 'nexus-group' | 'cognitive-solutions';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoType = 'full' | 'mark';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  type?: LogoType;
  className?: string;
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 120, height: 30 },
  md: { width: 180, height: 45 },
  lg: { width: 240, height: 60 },
  xl: { width: 320, height: 80 },
};

const markSizeMap: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 30, height: 30 },
  md: { width: 40, height: 40 },
  lg: { width: 60, height: 60 },
  xl: { width: 80, height: 80 },
};

const logoPathMap: Record<LogoVariant, string> = {
  'private-estates': '/assets/logos/anclora-private-estates.svg',
  'nexus-group': '/assets/logos/anclora-nexus-group.svg',
  'cognitive-solutions': '/assets/logos/anclora-cognitive-solutions.svg',
};

const logoMarkPath = '/assets/logos/anclora-private-estates-mark.svg';

/**
 * Logo Component
 * 
 * Renders Anclora brand logos with different variants and sizes
 * 
 * @example
 * <Logo variant="private-estates" size="md" />
 * <Logo variant="nexus-group" size="lg" type="full" />
 * <Logo type="mark" size="sm" />
 */
export function Logo({
  variant = 'private-estates',
  size = 'md',
  type = 'full',
  className = '',
}: LogoProps) {
  const dimensions = type === 'mark' ? markSizeMap[size] : sizeMap[size];
  const logoPath = type === 'mark' ? logoMarkPath : logoPathMap[variant];
  
  const altText = type === 'mark' 
    ? 'Anclora' 
    : variant === 'private-estates' 
      ? 'Anclora Private Estates'
      : variant === 'nexus-group'
        ? 'Anclora Nexus Group'
        : 'Anclora Cognitive Solutions';

  return (
    <Image
      src={logoPath}
      alt={altText}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority
    />
  );
}
