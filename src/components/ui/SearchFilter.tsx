'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  placeholder?: string;
  filters?: {
    category?: {
      label: string;
      options: FilterOption[];
      value: string;
      onChange: (value: string) => void;
    };
    sort?: {
      label: string;
      options: FilterOption[];
      value: string;
      onChange: (value: string) => void;
    };
    price?: {
      label: string;
      min: number;
      max: number;
      value: { min: number; max: number };
      onChange: (value: { min: number; max: number }) => void;
    };
  };
  className?: string;
  showFilters?: boolean;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  placeholder = 'Search products...',
  filters,
  className,
  showFilters = true
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters?.category?.value && filters.category.value !== 'all') count++;
    if (filters?.sort?.value && filters.sort.value !== 'default') count++;
    if (filters?.price?.value && (filters.price.value.min > filters.price.min || filters.price.value.max < filters.price.max)) count++;
    setActiveFilters(count);
  }, [filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchValue);
  };

  const clearFilters = () => {
    if (filters?.category) filters.category.onChange('all');
    if (filters?.sort) filters.sort.onChange('default');
    if (filters?.price) filters.price.onChange({ min: filters.price.min, max: filters.price.max });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white shadow-sm"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      {showFilters && filters && (
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilters > 0 && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                {activeFilters}
              </span>
            )}
            <ChevronDown className={cn('w-4 h-4 transition-transform', isFilterOpen && 'rotate-180')} />
          </button>

          {/* Clear Filters */}
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </button>
          )}

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
              {/* Category Filter */}
              {filters.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filters.category.label}
                  </label>
                  <select
                    value={filters.category.value}
                    onChange={(e) => filters.category!.onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {filters.category.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} {option.count && `(${option.count})`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort Filter */}
              {filters.sort && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filters.sort.label}
                  </label>
                  <select
                    value={filters.sort.value}
                    onChange={(e) => filters.sort!.onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {filters.sort.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              {filters.price && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filters.price.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.price.value.min}
                      onChange={(e) => filters.price!.onChange({
                        ...filters.price!.value,
                        min: Number(e.target.value)
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.price.value.max}
                      onChange={(e) => filters.price!.onChange({
                        ...filters.price!.value,
                        max: Number(e.target.value)
                      })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick filter chips for common categories
 */
export function FilterChips({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  className 
}: {
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            activeCategory === category.value
              ? 'bg-primary-100 text-primary-700 border border-primary-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
          )}
        >
          {category.label}
          {category.count && (
            <span className="ml-1 text-xs opacity-75">({category.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
