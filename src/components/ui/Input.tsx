'use client';

import React, { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Input component props interface
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

/**
 * Input component with label, error states, and icons
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const isPassword = type === 'password';
    const hasError = !!error;

    const inputClasses = cn(
      // Base styles
      'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Full width
      fullWidth && 'w-full',
      // Variant styles
      {
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800': variant === 'default',
        'border-transparent bg-gray-100 dark:bg-gray-700': variant === 'filled',
      },
      // Focus styles
      {
        'focus:border-primary-500 focus:ring-primary-500': !hasError,
        'focus:border-red-500 focus:ring-red-500': hasError,
      },
      // Error styles
      hasError && 'border-red-500 dark:border-red-400',
      // Icon padding
      leftIcon && 'pl-10',
      (rightIcon || isPassword) && 'pr-10',
      className
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {/* Right icon or password toggle */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {isPassword ? (
                <PasswordToggle />
              ) : (
                rightIcon
              )}
            </div>
          )}

          {/* Error icon */}
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Helper text or error */}
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Password toggle component
 */
function PasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      tabIndex={-1}
    >
      {showPassword ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );
}

/**
 * Textarea component
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const textareaClasses = cn(
      // Base styles
      'flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm transition-colors',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'resize-vertical',
      // Full width
      fullWidth && 'w-full',
      // Variant styles
      {
        'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800': variant === 'default',
        'border-transparent bg-gray-100 dark:bg-gray-700': variant === 'filled',
      },
      // Focus styles
      {
        'focus:border-primary-500 focus:ring-primary-500': !hasError,
        'focus:border-red-500 focus:ring-red-500': hasError,
      },
      // Error styles
      hasError && 'border-red-500 dark:border-red-400',
      className
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          className={textareaClasses}
          ref={ref}
          disabled={disabled}
          {...props}
        />

        {/* Helper text or error */}
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
