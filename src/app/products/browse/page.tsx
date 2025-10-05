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
  Building
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

  const { addItem } = useCart();
  const { user } = useHybridAuth();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.minPrice > 0) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 1000) queryParams.append('maxPrice', filters.maxPrice.toString());
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      
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
    fetchProducts();
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const categories = [
    'all',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Beauty & Health',
    'Toys & Games',
    'Books & Media',
    'Automotive',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-responsive py-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href={user ? (user.role === 'buyer' ? '/dashboard/provider' : '/dashboard/seller') : '/'}
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) || 1000 })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                    <option value="purchaseCount">Sales</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </form>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {products.length} Products Found
              </h2>
            </div>

            {products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View - GitHub Repository Style
                      <>

                        <div className="p-6">
                          {/* Product Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 text-lg">
                                {product.title}
                              </h3>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                                  {product.category}
                                </span>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                      {product.rating.average}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Research Data */}
                          <div className="space-y-4 mb-6">
                            {/* Category and Subcategory */}
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {product.previewData?.productCategory || product.category}
                              </span>
                              {product.previewData?.subCategory && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                  {product.previewData.subCategory}
                                </span>
                              )}
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Monthly Sales</div>
                                <div className="text-sm font-bold text-green-800 dark:text-green-300">
                                  {product.previewData?.estimatedMonthlySales || 'N/A'}
                                </div>
                              </div>
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Monthly Revenue</div>
                                <div className="text-sm font-bold text-blue-800 dark:text-blue-300">
                                  {product.previewData?.estimatedMonthlyRevenue || 'N/A'}
                                </div>
                              </div>
                              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Avg Price</div>
                                <div className="text-sm font-bold text-purple-800 dark:text-purple-300">
                                  {product.previewData?.averageSellingPrice ? formatCurrency(product.previewData.averageSellingPrice) : 'N/A'}
                                </div>
                              </div>
                              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Competition</div>
                                <div className="text-sm font-bold text-orange-800 dark:text-orange-300">
                                  {product.previewData?.competitionLevel || 'N/A'}
                                </div>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Search Volume</div>
                                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {product.previewData?.searchVolumeBracket || 'N/A'}
                                </div>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Margin</div>
                                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {product.previewData?.estimatedMargin ? `${product.previewData.estimatedMargin}%` : 'N/A'}
                                </div>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">FBA Fees</div>
                                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {product.previewData?.fbaFeesCategory || 'N/A'}
                                </div>
                              </div>
                              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Seasonality</div>
                                <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {product.previewData?.seasonality || 'N/A'}
                                </div>
                              </div>
                            </div>

                            {/* Confidence Score */}
                            {product.previewData?.confidenceScore && (
                              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Score</div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                        style={{ width: `${(product.previewData.confidenceScore / 10) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                      {product.previewData.confidenceScore}/10
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-2xl font-bold text-primary-600">
                                {formatCurrency(product.price)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                one-time purchase
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/products/${product._id}`}
                              className="flex-1 btn btn-primary btn-sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                            {user && user.role === 'buyer' ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="btn btn-outline btn-sm"
                                title="Add to Cart"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </button>
                            ) : !user ? (
                              <Link
                                href="/auth/login"
                                className="btn btn-outline btn-sm"
                                title="Login to Add to Cart"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Link>
                            ) : null}
                          </div>

                          {/* Provider Info */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {product.sellerId?.name || 'Anonymous'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {product.sellerId?.profile?.company || 'Independent Seller'}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(product.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // List View - Compact with All Research Data
                      <>
                        <div className="p-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {/* Product Header */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                                  <Package className="h-4 w-4 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                                    {product.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                                      {product.previewData?.productCategory || product.category}
                                    </span>
                                    {product.previewData?.subCategory && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                        {product.previewData.subCategory}
                                      </span>
                                    )}
                                  </div>
                                  
                                </div>
                              </div>
                              
                              {/* Compact Research Data - All Fields */}
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Sales</div>
                                  <div className="text-xs font-bold text-green-800 dark:text-green-300">
                                    {product.previewData?.estimatedMonthlySales || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Revenue</div>
                                  <div className="text-xs font-bold text-blue-800 dark:text-blue-300">
                                    {product.previewData?.estimatedMonthlyRevenue || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Price</div>
                                  <div className="text-xs font-bold text-purple-800 dark:text-purple-300">
                                    {product.previewData?.averageSellingPrice ? formatCurrency(product.previewData.averageSellingPrice) : 'N/A'}
                                  </div>
                                </div>
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">
                                  <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Competition</div>
                                  <div className="text-xs font-bold text-orange-800 dark:text-orange-300">
                                    {product.previewData?.competitionLevel || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Margin</div>
                                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                    {product.previewData?.estimatedMargin ? `${product.previewData.estimatedMargin}%` : 'N/A'}
                                  </div>
                                </div>
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-center">
                                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Confidence</div>
                                  <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                                    {product.previewData?.confidenceScore ? `${product.previewData.confidenceScore}/10` : 'N/A'}
                                  </div>
                                </div>
                              </div>

                              {/* Additional Metrics Row */}
                              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Search Volume</div>
                                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {product.previewData?.searchVolumeBracket || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                  <div className="text-xs text-gray-600 dark:text-gray-400">FBA Fees</div>
                                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {product.previewData?.fbaFeesCategory || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Seasonality</div>
                                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {product.previewData?.seasonality || 'N/A'}
                                  </div>
                                </div>
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded text-center">
                                  <div className="text-xs text-gray-600 dark:text-gray-400">Seller</div>
                                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {product.sellerId?.name || 'Anonymous'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-right">
        
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/products/${product._id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Link>
                                {user && user.role === 'buyer' ? (
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="btn btn-outline btn-sm"
                                    title="Add to Cart"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </button>
                                ) : !user ? (
                                  <Link
                                    href="/auth/login"
                                    className="btn btn-outline btn-sm"
                                    title="Login to Add to Cart"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
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
