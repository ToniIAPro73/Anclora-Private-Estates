import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps extends Omit<LucideProps, 'size'> {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * Icon Component
 * 
 * Wrapper para Lucide React icons con tamaños predefinidos
 * 
 * @example
 * import { Home } from 'lucide-react';
 * <Icon icon={Home} size="md" />
 * <Icon icon={Home} size="lg" className="text-anclora-gold" />
 */
export function Icon({ icon: LucideIcon, size = 'md', className = '', ...props }: IconProps) {
  return <LucideIcon size={sizeMap[size]} className={className} {...props} />;
}
