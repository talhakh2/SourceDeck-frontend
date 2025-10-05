'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-500', className)} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              item.current ? 'text-gray-900 font-medium' : 'text-gray-500'
            )}>
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
          )}
        </div>
      ))}
    </nav>
  );
}

/**
 * Breadcrumb for product pages
 */
export function ProductBreadcrumb({ 
  category, 
  productName, 
  className 
}: { 
  category?: string; 
  productName?: string; 
  className?: string; 
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Products', href: '/products' },
    ...(category ? [{ label: category, href: `/products?category=${encodeURIComponent(category)}` }] : []),
    ...(productName ? [{ label: productName, current: true }] : []),
  ];

  return <Breadcrumb items={items} className={className} />;
}

/**
 * Breadcrumb for dashboard pages
 */
export function DashboardBreadcrumb({ 
  section, 
  subsection, 
  className 
}: { 
  section?: string; 
  subsection?: string; 
  className?: string; 
}) {
  const items: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    ...(section ? [{ label: section, href: `/dashboard/${section}` }] : []),
    ...(subsection ? [{ label: subsection, current: true }] : []),
  ];

  return <Breadcrumb items={items} className={className} />;
}
