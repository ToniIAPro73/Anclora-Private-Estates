import React from 'react';
import Image from 'next/image';

export type LogoVariant =
  | 'private-estates'
  | 'nexus-group'
  | 'cognitive-solutions';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const logoPathMap: Record<LogoVariant, string> = {
  'private-estates': '/assets/logos/anclora-private-estates.png',
  'nexus-group': '/assets/logos/anclora-nexus-group.png',
  'cognitive-solutions': '/assets/logos/anclora-cognitive-solutions.svg',
};

const logoMarkPath = '/assets/logos/anclora-private-estates.png';

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
  className = '',
}: LogoProps) {
  const dimensions = type === 'mark' ? markSizeMap[size] : sizeMap[size];
  const logoPath = type === 'mark' ? logoMarkPath : logoPathMap[variant];

  const altText =
    type === 'mark'
      ? 'Anclora'
      : variant === 'private-estates'
        ? 'Anclora Private Estates'
        : variant === 'nexus-group'
          ? 'Anclora Nexus Group'
          : 'Anclora Cognitive Solutions';

  return (
    <Image
      src={logoPath}
      alt={`Anclora ${variant === 'private-estates' ? 'Private Estates' : 'Nexus Group'}`}
      width={200}
      height={80}
      className={`${sizeClass} w-auto ${className}`}
      priority
    />
  );
}
