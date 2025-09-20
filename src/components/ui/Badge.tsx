'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variant types
 */
export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'outline';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge component props interface
 */
export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
}

/**
 * Badge component with multiple variants and sizes
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-1">{icon}</span>
      )}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

/**
 * Status badge component for displaying status information
 */
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    inactive: { variant: 'error' as const, text: 'Inactive' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    completed: { variant: 'success' as const, text: 'Completed' },
    cancelled: { variant: 'error' as const, text: 'Cancelled' },
    draft: { variant: 'secondary' as const, text: 'Draft' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}

/**
 * Role badge component for user roles
 */
export interface RoleBadgeProps {
  role: 'Buyer' | 'Seller' | 'Admin';
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleConfig = {
    Buyer: { variant: 'info' as const, text: 'Buyer' },
    Seller: { variant: 'primary' as const, text: 'Seller' },
    Admin: { variant: 'warning' as const, text: 'Admin' },
  };

  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
}

/**
 * Category badge component for product categories
 */
export interface CategoryBadgeProps {
  category: string;
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export function CategoryBadge({ 
  category, 
  className, 
  removable = false, 
  onRemove 
}: CategoryBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={className}
      removable={removable}
      onRemove={onRemove}
    >
      {category}
    </Badge>
  );
}

/**
 * Notification badge component for showing counts
 */
export interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  size?: BadgeSize;
}

export function NotificationBadge({ 
  count, 
  max = 99, 
  className, 
  size = 'sm' 
}: NotificationBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge 
      variant="error" 
      size={size}
      className={cn('min-w-[1.25rem] justify-center', className)}
    >
      {displayCount}
    </Badge>
  );
}

/**
 * Price badge component for displaying prices
 */
export interface PriceBadgeProps {
  price: number;
  currency?: string;
  className?: string;
  variant?: 'default' | 'sale' | 'premium';
}

export function PriceBadge({ 
  price, 
  currency = 'USD', 
  className,
  variant = 'default'
}: PriceBadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    sale: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    premium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  return (
    <Badge 
      variant="default"
      className={cn(variantClasses[variant], className)}
    >
      {formatPrice(price, currency)}
    </Badge>
  );
}
