import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'private-estates' | 'nexus-group';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const logoPathMap: Record<LogoVariant, string> = {
  'private-estates': '/assets/logos/anclora-private-estates.svg',
  'nexus-group': '/assets/logos/anclora-nexus-group.svg',
};

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24',
};

/**
 * Logo Component
 * 
 * Displays Anclora brand logos
 * ACTUALIZADO: Eliminado variant 'cognitive-solutions'
 */
export function Logo({
  variant = 'private-estates',
  size = 'md',
  className = '',
}: LogoProps) {
  const logoPath = logoPathMap[variant];
  const sizeClass = sizeClasses[size];

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
