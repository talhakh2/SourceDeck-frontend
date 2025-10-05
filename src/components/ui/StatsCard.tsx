'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Stats card props
 */
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: ReactNode;
  description?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Stats card component for displaying metrics
 */
export function StatsCard({
  title,
  value,
  change,
  icon,
  description,
  loading = false,
  className,
  onClick
}: StatsCardProps) {
  const changeConfig = {
    increase: {
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300'
    },
    decrease: {
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300'
    },
    neutral: {
      icon: Minus,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300'
    }
  };

  const config = change ? changeConfig[change.type] : null;
  const ChangeIcon = config?.icon;

  if (loading) {
    return (
      <div className={cn('card animate-pulse', className)}>
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'card hover-lift transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {description}
              </p>
            )}
            {change && (
              <div className="flex items-center gap-1">
                <div className={cn('p-1 rounded-full', config?.bgColor)}>
                  {ChangeIcon && <ChangeIcon className={cn('h-3 w-3', config?.color)} />}
                </div>
                <span className={cn('text-sm font-medium', config?.text)}>
                  {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                  {Math.abs(change.value)}%
                </span>
                {change.period && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {change.period}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Stats grid component for organizing multiple stats cards
 */
export interface StatsGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function StatsGrid({ 
  children, 
  columns = 4, 
  className 
}: StatsGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={cn(
      'grid gap-6',
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Quick stats card variants for common use cases
 */
export interface QuickStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon?: ReactNode;
  className?: string;
}

export function QuickStatsCard({
  title,
  value,
  change,
  period = 'vs last month',
  icon,
  className
}: QuickStatsCardProps) {
  const changeType = change
    ? change > 0
      ? 'increase'
      : change < 0
      ? 'decrease'
      : 'neutral'
    : undefined;

  return (
    <StatsCard
      title={title}
      value={value}
      change={changeType && change !== undefined ? { value: Math.abs(change), type: changeType, period } : undefined}
      icon={icon}
      className={className}
    />
  );
}

