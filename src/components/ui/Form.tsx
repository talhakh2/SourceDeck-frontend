'use client';

import { ReactNode, FormHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Form component props interface
 */
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * Form component with consistent spacing and styling
 */
export function Form({
  children,
  className,
  spacing = 'md',
  ...props
}: FormProps) {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <form
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
}

/**
 * Form field wrapper component
 */
export interface FormFieldProps {
  children: ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
}

export function FormField({
  children,
  className,
  required = false,
  error,
  label,
  description,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Form group component for grouping related fields
 */
export interface FormGroupProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function FormGroup({
  children,
  className,
  title,
  description,
}: FormGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form actions component for buttons
 */
export interface FormActionsProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({
  children,
  className,
  align = 'right',
}: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn(
      'flex items-center gap-3 pt-4',
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Form section component for dividing forms into sections
 */
export interface FormSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  children,
  className,
  title,
  description,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  return (
    <div className={cn(
      'border border-gray-200 dark:border-gray-700 rounded-lg p-6',
      className
    )}>
      {(title || description) && (
        <div className="mb-6 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form error component for displaying form-level errors
 */
export interface FormErrorProps {
  error: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  return (
    <div className={cn(
      'p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
      className
    )}>
      <p className="text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    </div>
  );
}

/**
 * Form success component for displaying success messages
 */
export interface FormSuccessProps {
  message: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  return (
    <div className={cn(
      'p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg',
      className
    )}>
      <p className="text-sm text-green-600 dark:text-green-400">
        {message}
      </p>
    </div>
  );
}

/**
 * Form loading component for showing loading state
 */
export interface FormLoadingProps {
  message?: string;
  className?: string;
}

export function FormLoading({ message = 'Loading...', className }: FormLoadingProps) {
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </span>
      </div>
    </div>
  );
}
