'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Eye, ShoppingCart, TrendingUp, DollarSign, Calendar, Plus, CheckCircle } from 'lucide-react';
import { apiClient, Product, ProductFilters, formatCurrency, formatDate } from '@/lib/api';
import { LoadingSpinner, CardSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCart } from '@/contexts/CartContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { addItem, isInCart } = useCart();
  const { user } = useHybridAuth();
  const { isPurchased } = usePurchase();

  const categories = [
    'All Categories',
    'E-commerce',
    'SaaS',
    'Mobile Apps',
    'Digital Products',
    'Physical Products',
    'Services',
    'Marketing',
    'Finance',
    'Health & Fitness',
    'Education',
    'Entertainment',
    'Other'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'roiPercentage', label: 'ROI: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'purchaseCount', label: 'Most Purchased' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, sortOrder, currentPage]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: ProductFilters = {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && selectedCategory !== 'All Categories' && { category: selectedCategory }),
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const response = await apiClient.getProducts(filters);

      if (response.success && response.data) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (user.role !== 'Buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }
    
    addItem(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleViewProduct = (product: Product) => {
    if (!user) {
      toast.error('Please login to view product details');
      return;
    }
    
    if (user.role !== 'Buyer') {
      toast.error('Only buyers can view product details');
      return;
    }
    
    window.location.href = `/products/${product._id}`;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Product Research Marketplace
              </h1>
              <p className="mt-2 text-gray-600">
                Discover proven product research and market insights
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {user && user.role === 'Seller' ? (
                <Link
                  href="/dashboard/seller"
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105 transform"
                >
                  <TrendingUp className="h-4 w-4" />
                  Manage My Products
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium hover:scale-105 transform"
                >
                  <Plus className="h-4 w-4" />
                  Become a Seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg">Filters</h3>
              </div>
              <div className="card-content space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                    >
                      <Search className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </form>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="input"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="input"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    className="input"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {error ? (
              <ErrorMessage
                message={error}
                onRetry={fetchProducts}
                className="mb-6"
              />
            ) : null}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="card hover-lift">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                {product.title}
                              </h3>
                              {user && user.role === 'Buyer' && isPurchased(product._id) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Purchased
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="badge badge-primary">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {formatCurrency(product.price)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-600">ROI</span>
                            </div>
                            <span className="font-semibold text-green-600">
                              {product.previewData.kpiSummary.roiPercentage}%
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600">Est. Cost</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(product.previewData.kpiSummary.estimatedCost)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-gray-600">Revenue</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(product.previewData.kpiSummary.revenueForecast)}
                            </span>
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {product.rating?.average || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.rating?.count || 0} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {product.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="h-4 w-4" />
                              {product.purchaseCount}
                            </div>
                          </div>
                          <span>{formatDate(product.createdAt)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>by {product.sellerId?.name || 'Unknown Seller'}</span>
                              {product.sellerId?.verification?.emailVerified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            {product.sellerId?.profile?.company && (
                              <span className="block text-xs text-gray-500">
                                {product.sellerId.profile.company}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
                          >
                            View Details
                          </button>
                          {user && user.role === 'Buyer' ? (
                            isPurchased(product._id) ? (
                              <Link
                                href={`/products/${product._id}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                              >
                                <CheckCircle className="h-4 w-4" />
                                View Purchase
                              </Link>
                            ) : isInCart(product._id) ? (
                              <Link
                                href="/cart"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                In Cart
                              </Link>
                            ) : (
                              <button 
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transform"
                              >
                                <Plus className="h-4 w-4" />
                                Add to Cart
                              </button>
                            )
                          ) : (
                            <Link
                              href="/auth/login"
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                            >
                              <Plus className="h-4 w-4" />
                              Login to Buy
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="btn btn-outline btn-sm"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`btn btn-sm ${
                            currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="btn btn-outline btn-sm"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse all products.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
