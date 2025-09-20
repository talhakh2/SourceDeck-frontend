'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Dashboard layout component props
 */
export interface DashboardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Dashboard header props
 */
export interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Dashboard stats card props
 */
export interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: ReactNode;
  className?: string;
}

/**
 * Dashboard section props
 */
export interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Dashboard tabs props
 */
export interface DashboardTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * Main dashboard layout component
 */
export function Dashboard({ children, className }: DashboardProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {children}
    </div>
  );
}

/**
 * Dashboard header component
 */
export function DashboardHeader({ 
  title, 
  description, 
  actions, 
  className 
}: DashboardHeaderProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700', className)}>
      <div className="container-responsive py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
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
 * Dashboard stats card component
 */
export function DashboardStatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  className 
}: DashboardStatsCardProps) {
  const changeClasses = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className={cn(
      'card hover-lift',
      className
    )}>
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            {change && (
              <p className={cn('text-sm font-medium', changeClasses[change.type])}>
                {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                {Math.abs(change.value)}%
              </p>
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
 * Dashboard section component
 */
export function DashboardSection({ 
  title, 
  description, 
  children, 
  actions, 
  className 
}: DashboardSectionProps) {
  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">{title}</h2>
            {description && (
              <p className="card-description">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Dashboard tabs component
 */
export function DashboardTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}: DashboardTabsProps) {
  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-700', className)}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

/**
 * Dashboard content wrapper
 */
export function DashboardContent({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('container-responsive py-8', className)}>
      {children}
    </div>
  );
}

/**
 * Dashboard grid for stats cards
 */
export function DashboardStatsGrid({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Dashboard main content area
 */
export function DashboardMain({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('space-y-8', className)}>
      {children}
    </div>
  );
}

