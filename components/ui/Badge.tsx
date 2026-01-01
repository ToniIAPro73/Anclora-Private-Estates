import React from 'react';
import { X } from 'lucide-react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-anclora-gold/10 text-anclora-gold',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

/**
 * Badge Component
 * 
 * Small status indicator or label
 * 
 * @example
 * <Badge variant="success">Available</Badge>
 * <Badge variant="primary" size="lg">Featured</Badge>
 */
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

/**
 * Tag Component
 * 
 * Removable tag/chip component
 * 
 * @example
 * <Tag onRemove={() => removeTag('luxury')}>Luxury</Tag>
 * <Tag>Villa</Tag>
 */
export function Tag({
  children,
  onRemove,
  className = '',
}: TagProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-anclora-gold/10 text-anclora-gold border border-anclora-gold/20 transition-colors duration-200';
  const hoverClasses = onRemove ? 'hover:bg-anclora-gold/20' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <span className={classes}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-anclora-gold-dark focus:outline-none"
          aria-label="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
