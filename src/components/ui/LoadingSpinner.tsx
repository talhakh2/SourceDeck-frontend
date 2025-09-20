'use client';

import { cn } from '@/lib/utils';

/**
 * Loading spinner component props
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

/**
 * Loading spinner component with multiple sizes and variants
 */
export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-t-transparent',
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {text && (
          <p className={cn(
            'text-sm font-medium',
            variant === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Full page loading spinner
 */
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
}

/**
 * Inline loading spinner for buttons and small spaces
 */
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner 
      size={size} 
      variant="white" 
      className="inline-block" 
    />
  );
}

/**
 * Skeleton loading component for content placeholders
 */
export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
          className
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
            index === lines - 1 ? 'w-3/4' : 'w-full',
            className
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for product cards
 */
export function CardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="space-y-4">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Table skeleton for data tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
                colIndex === 0 ? 'w-1/4' : 'w-1/6'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}