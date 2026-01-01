import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'luxury';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border-2 border-gray-200',
  luxury: 'bg-gradient-to-br from-white to-beige-light border border-anclora-gold/20',
};

/**
 * Card Component System
 * 
 * Flexible card component with header, body, and footer sections
 * 
 * @example
 * <Card variant="luxury" hover>
 *   <CardHeader>
 *     <h3>Title</h3>
 *   </CardHeader>
 *   <CardBody>
 *     <p>Content</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 */
export function Card({
  variant = 'default',
  className = '',
  children,
  onClick,
  hover = false,
}: CardProps) {
  const baseClasses = 'rounded-lg overflow-hidden transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
