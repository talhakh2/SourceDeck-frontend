'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Eye, 
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  ArrowLeft,
  Home,
  Grid,
  List,
  Heart,
  Share2,
  Clock,
  MapPin,
  Building,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { apiClient, formatCurrency, formatDate, Product } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

function ProductsBrowseContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(filters);

  const { addItem } = useCart();
  const { user } = useHybridAuth();

  useEffect(() => {
    fetchProducts();
  }, [appliedFilters]);

  // Apply URL search parameters when component mounts or URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';
    
    if (urlSearch !== filters.search || urlCategory !== filters.category) {
      const newFilters = {
        ...filters,
        search: urlSearch,
        category: urlCategory
      };
      setFilters(newFilters);
      setAppliedFilters(newFilters);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (appliedFilters.search && appliedFilters.search.trim().length >= 2) {
        queryParams.append('search', appliedFilters.search.trim());
      }
      if (appliedFilters.category !== 'all') {
        queryParams.append('category', appliedFilters.category);
      }
      if (appliedFilters.minPrice > 0) {
        queryParams.append('minPrice', appliedFilters.minPrice.toString());
      }
      if (appliedFilters.maxPrice < 1000) {
        queryParams.append('maxPrice', appliedFilters.maxPrice.toString());
      }
      queryParams.append('sortBy', appliedFilters.sortBy);
      queryParams.append('sortOrder', appliedFilters.sortOrder);
      
      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.request<{ data: Product[] }>(endpoint, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        setProducts(response.data.data);
      } else {
        setError(response.message || 'Failed to fetch products.');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (user.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }
    
    addItem(product);
    toast.success(`Added ${product.title} to cart`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const categories = [
    'all',
    'Electronics',
    'Home & Kitchen',
    'Health & Personal Care',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive',
    'Pet Supplies',
    'Books',
    'Clothing & Accessories',
    'Garden & Outdoor',
    'Office Products',
    'Baby Products',
    'Tools & Home Improvement',
    'Other'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <ErrorMessage message={error} />
          <div className="mt-4">
            <button
              onClick={fetchProducts}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={user ? (user.role === 'buyer' ? '/my-purchases' : '/dashboard/seller') : '/'}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Research</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Clear
                </button>
              </div>

              {JSON.stringify(filters) !== JSON.stringify(appliedFilters) && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">Filters changed</p>
                </div>
              )}

              <form onSubmit={handleSearch} className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) || 0 })}
                      className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) || 1000 })}
                      className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all mb-2"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="views">Views</option>
                    <option value="purchaseCount">Sales</option>
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  >
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                  </select>
                </div>

                <Button type="button" onClick={applyFilters} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Apply Filters
                </Button>
              </form>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{products.length}</span> products found
              </p>
            </div>

            {products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div className="p-6">
                        {/* Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-base leading-tight">
                              {product.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg">
                              {product.previewData?.productCategory || product.category}
                            </span>
                            {product.previewData?.subCategory && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                                {product.previewData.subCategory}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="space-y-3 mb-5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Monthly Sales</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {product.previewData?.estimatedMonthlySales || 'N/A'}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Revenue</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {product.previewData?.estimatedMonthlyRevenue || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Avg Price</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {product.previewData?.averageSellingPrice ? formatCurrency(product.previewData.averageSellingPrice) : 'N/A'}
                              </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Competition</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {product.previewData?.competitionLevel || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Metrics */}
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Search Volume</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {product.previewData?.searchVolumeBracket || 'N/A'}
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Margin</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {product.previewData?.estimatedMargin ? `${product.previewData.estimatedMargin}%` : 'N/A'}
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">FBA Fees</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {product.previewData?.fbaFeesCategory || 'N/A'}
                            </p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Seasonality</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {product.previewData?.seasonality || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Confidence Score */}
                        {product.previewData?.confidenceScore && (
                          <div className="mb-5 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Zap className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Confidence Score</span>
                              </div>
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {product.previewData.confidenceScore}/10
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-gray-400 to-gray-900 rounded-full transition-all duration-500"
                                style={{ width: `${(product.previewData.confidenceScore / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
                          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(product.price)}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            one-time purchase
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mb-4">
                          <Link
                            href={`/products/${product._id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                          {user && user.role === 'buyer' ? (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="inline-flex items-center justify-center p-2.5 border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white rounded-xl transition-colors"
                              title="Add to Cart"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          ) : !user ? (
                            <Link
                              href="/auth/login"
                              className="inline-flex items-center justify-center p-2.5 border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white rounded-xl transition-colors"
                              title="Login to Add to Cart"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Link>
                          ) : null}
                        </div>

                        {/* Provider */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {product.sellerId?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {formatDate(product.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="p-5 flex-1">
                        <div className="flex items-start gap-4">
                          {/* Left Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2 line-clamp-1">
                                {product.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg">
                                  {product.previewData?.productCategory || product.category}
                                </span>
                                {product.previewData?.subCategory && (
                                  <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                                    {product.previewData.subCategory}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Sales</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.estimatedMonthlySales || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Revenue</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.estimatedMonthlyRevenue || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Price</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.averageSellingPrice ? formatCurrency(product.previewData.averageSellingPrice) : 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Competition</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.competitionLevel || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Margin</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.estimatedMargin ? `${product.previewData.estimatedMargin}%` : 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Confidence</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {product.previewData?.confidenceScore ? `${product.previewData.confidenceScore}/10` : 'N/A'}
                                </p>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-4 gap-2">
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Search Vol.</p>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  {product.previewData?.searchVolumeBracket || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">FBA Fees</p>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  {product.previewData?.fbaFeesCategory || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Seasonality</p>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  {product.previewData?.seasonality || 'N/A'}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Seller</p>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {product.sellerId?.name || 'Anonymous'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(product.price)}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                one-time
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/products/${product._id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                              {user && user.role === 'buyer' ? (
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="inline-flex items-center justify-center p-2 border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white rounded-lg transition-colors"
                                  title="Add to Cart"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </button>
                              ) : !user ? (
                                <Link
                                  href="/auth/login"
                                  className="inline-flex items-center justify-center p-2 border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white rounded-lg transition-colors"
                                  title="Login to Add to Cart"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsBrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    }>
      <ProductsBrowseContent />
    </Suspense>
  );
}