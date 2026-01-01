import React from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps {
  size?: ContainerSize;
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

/**
 * Container Component
 * 
 * Responsive container with predefined max-widths
 * 
 * @example
 * <Container size="lg">
 *   <h1>Content</h1>
 * </Container>
 */
export function Container({
  size = 'lg',
  className = '',
  children,
  as: Component = 'div',
}: ContainerProps) {
  const classes = `w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`;

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
}
