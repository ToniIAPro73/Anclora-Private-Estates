import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-anclora-gold hover:bg-anclora-gold-dark text-white shadow-md hover:shadow-lg',
  secondary: 'bg-black hover:bg-gray-900 text-white shadow-md hover:shadow-lg',
  outline: 'border-2 border-anclora-gold text-anclora-gold hover:bg-anclora-gold hover:text-white',
  ghost: 'text-anclora-gold hover:bg-anclora-gold/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

/**
 * Button Component
 * 
 * Versatile button with multiple variants and states
 * 
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
 * <Button variant="primary" isLoading>Loading...</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-anclora-gold focus:ring-offset-2';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}
