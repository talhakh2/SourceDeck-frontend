'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Page header props
 */
export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Page header component for consistent page layouts
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
  size = 'md'
}: PageHeaderProps) {
  const sizeClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8'
  };

  const titleSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700',
      sizeClasses[size],
      className
    )}>
      <div className="container-responsive">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-400 mx-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className={cn(
              'font-display font-bold text-gray-900 dark:text-gray-100',
              titleSizeClasses[size]
            )}>
              {title}
            </h1>
            {description && (
              <p className={cn(
                'mt-2 text-gray-600 dark:text-gray-400',
                size === 'sm' ? 'text-sm' : 'text-base'
              )}>
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Section header component for subsections
 */
export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  size = 'md'
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8'
  };

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
      sizeClasses[size],
      className
    )}>
      <div>
        <h2 className={cn(
          'font-semibold text-gray-900 dark:text-gray-100',
          titleSizeClasses[size]
        )}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

