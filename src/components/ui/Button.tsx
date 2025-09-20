'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button variant types
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props interface
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and states
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'cursor-pointer select-none',
      // Full width
      fullWidth && 'w-full',
      // Size variants
      {
        'h-8 px-3 text-sm': size === 'sm',
        'h-10 px-4 text-sm': size === 'md',
        'h-12 px-6 text-base': size === 'lg',
      },
      // Variant styles
      {
        // Primary variant
        'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-800 active:from-primary-800 active:to-primary-900 transform hover:-translate-y-0.5 active:translate-y-0':
          variant === 'primary',
        // Secondary variant
        'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:border-gray-700':
          variant === 'secondary',
        // Outline variant
        'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 shadow-sm hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500':
          variant === 'outline',
        // Ghost variant
        'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700':
          variant === 'ghost',
        // Danger variant
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg dark:bg-red-700 dark:hover:bg-red-600 dark:active:bg-red-500':
          variant === 'danger',
        // Success variant
        'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-500':
          variant === 'success',
        // Warning variant
        'bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 shadow-md hover:shadow-lg dark:bg-yellow-700 dark:hover:bg-yellow-600 dark:active:bg-yellow-500':
          variant === 'warning',
      },
      className
    );

    return (
      <button
        className={baseClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children && (
          <span className={cn(loading && 'opacity-0')}>{children}</span>
        )}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
