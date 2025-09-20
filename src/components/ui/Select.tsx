'use client';

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Select option interface
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Select component props interface
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Select component with custom styling and options
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder = 'Select an option',
      error,
      helperText,
      label,
      fullWidth = false,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const variantClasses = {
      default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
      filled: 'border-transparent bg-gray-100 dark:bg-gray-700',
    };

    const selectClasses = cn(
      // Base styles
      'flex w-full rounded-lg border px-3 py-2 text-sm transition-colors',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'appearance-none cursor-pointer',
      // Full width
      fullWidth && 'w-full',
      // Size variants
      sizeClasses[size],
      // Variant styles
      variantClasses[variant],
      // Focus styles
      {
        'focus:border-primary-500 focus:ring-primary-500': !hasError,
        'focus:border-red-500 focus:ring-red-500': hasError,
      },
      // Error styles
      hasError && 'border-red-500 dark:border-red-400',
      // Icon padding
      leftIcon && 'pl-10',
      (rightIcon || true) && 'pr-10',
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

        {/* Select container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Select */}
          <select
            className={selectClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Right icon or chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            {rightIcon || <ChevronDown className="w-4 h-4" />}
          </div>

          {/* Error icon */}
          {hasError && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
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

Select.displayName = 'Select';

/**
 * Multi-select component using checkboxes
 */
export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  maxHeight?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  error,
  helperText,
  label,
  fullWidth = false,
  maxHeight = '200px',
  className,
}: MultiSelectProps) {
  const hasError = !!error;

  const handleOptionToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Selected options display */}
      <div className="min-h-[2.5rem] p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg">
        {selectedOptions.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            {placeholder}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full"
              >
                {option.label}
                <button
                  type="button"
                  onClick={() => handleOptionToggle(option.value)}
                  className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Options dropdown */}
      <div
        className={cn(
          'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden',
          hasError && 'border-red-500 dark:border-red-400'
        )}
        style={{ maxHeight }}
      >
        <div className="overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => handleOptionToggle(option.value)}
                disabled={option.disabled}
                className="sr-only"
              />
              <div className={cn(
                'w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors',
                value.includes(option.value)
                  ? 'bg-primary-600 border-primary-600'
                  : 'border-gray-300 dark:border-gray-600'
              )}>
                {value.includes(option.value) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              {option.icon && (
                <span className="mr-2 text-gray-400 dark:text-gray-500">
                  {option.icon}
                </span>
              )}
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {option.label}
              </span>
            </label>
          ))}
        </div>
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
