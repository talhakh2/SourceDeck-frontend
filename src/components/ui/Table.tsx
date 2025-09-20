'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Table component props
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

/**
 * Table header props
 */
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

/**
 * Table body props
 */
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

/**
 * Table row props
 */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  hover?: boolean;
  selected?: boolean;
}

/**
 * Table cell props
 */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  variant?: 'default' | 'header';
}

/**
 * Table header cell props
 */
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

/**
 * Table container props
 */
export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  scrollable?: boolean;
}

/**
 * Main table component
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, variant = 'default', size = 'md', hover = false, className, ...props }, ref) => {
    const variantClasses = {
      default: 'divide-y divide-gray-200 dark:divide-gray-700',
      striped: 'divide-y divide-gray-200 dark:divide-gray-700',
      bordered: 'border border-gray-200 dark:border-gray-700'
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base'
    };

    return (
      <table
        ref={ref}
        className={cn(
          'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
          variantClasses[variant],
          sizeClasses[size],
          hover && 'hover:bg-gray-50 dark:hover:bg-gray-800',
          className
        )}
        {...props}
      >
        {children}
      </table>
    );
  }
);

Table.displayName = 'Table';

/**
 * Table container component
 */
export function TableContainer({ 
  children, 
  scrollable = false, 
  className, 
  ...props 
}: TableContainerProps) {
  return (
    <div
      className={cn(
        'overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg',
        scrollable && 'overflow-x-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Table header component
 */
export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn('bg-gray-50 dark:bg-gray-800', className)}
      {...props}
    >
      {children}
    </thead>
  );
}

/**
 * Table body component
 */
export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn('bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700', className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

/**
 * Table row component
 */
export function TableRow({ 
  children, 
  hover = false, 
  selected = false, 
  className, 
  ...props 
}: TableRowProps) {
  return (
    <tr
      className={cn(
        hover && 'hover:bg-gray-50 dark:hover:bg-gray-800',
        selected && 'bg-primary-50 dark:bg-primary-900/20',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

/**
 * Table header cell component
 */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ 
    children, 
    sortable = false, 
    sortDirection, 
    onSort, 
    className, 
    ...props 
  }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700',
          className
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <div className="flex flex-col">
              <svg
                className={cn(
                  'w-3 h-3',
                  sortDirection === 'asc' ? 'text-primary-600' : 'text-gray-400'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
              <svg
                className={cn(
                  'w-3 h-3 -mt-1',
                  sortDirection === 'desc' ? 'text-primary-600' : 'text-gray-400'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
              </svg>
            </div>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

/**
 * Table cell component
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const variantClasses = {
      default: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
      header: 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'
    };

    return (
      <td
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

/**
 * Empty state component for tables
 */
export interface TableEmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function TableEmptyState({ 
  title, 
  description, 
  action, 
  icon 
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={100} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          {icon && (
            <div className="w-12 h-12 text-gray-400 mb-4">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}
          {action && action}
        </div>
      </td>
    </tr>
  );
}

