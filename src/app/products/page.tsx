'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { Dashboard, DashboardHeader, DashboardContent } from '@/components/ui/Dashboard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { 
  Plus, 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  ShoppingCart, 
  Star,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { apiClient, formatCurrency, formatDate, Product } from '@/lib/api';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import toast from 'react-hot-toast';

interface ProductStats {
  totalProducts: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useHybridAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Confirmation modal hook
  const {
    isOpen: isConfirmOpen, 
    title: confirmTitle, 
    description: confirmDescription, 
    onConfirm: onConfirmAction,
    showConfirmation, 
    hideConfirmation
  } = useConfirmationModal();

  // For buyers, redirect to browse page
  const isBuyer = user && user.role === 'buyer';

  useEffect(() => {
    if (isBuyer) {
      router.push('/products/browse');
      return;
    }
    fetchProducts();
  }, [isBuyer, statusFilter, sortBy, sortOrder, router]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let endpoint = '/products';
      
      // For sellers, fetch their own products; for buyers, fetch all products
      if (user && user.role === 'seller') {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          setError('Please log in to view your products.');
          return;
        }
        endpoint = '/products/seller/my-products';
      }
      
      const response = await apiClient.request<{ data: Product[] }>(endpoint);
      if (response.success && response.data) {
        setProducts(response.data.data);
        if (user && user.role === 'seller') {
          calculateStats(response.data.data);
        }
      } else {
        setError(response.message || 'Failed to fetch products.');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      
      // Handle specific error cases
      if (err.message?.includes('Invalid id format')) {
        setError('Authentication error. Please log out and log back in.');
      } else if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('Please log in to view your products.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (products: Product[]) => {
    const totalProducts = products.length;
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.purchaseCount || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.purchaseCount || 0)), 0);
    const averageRating = totalProducts > 0 
      ? products.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / totalProducts 
      : 0;

    setStats({
      totalProducts,
      totalViews,
      totalSales,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    showConfirmation({
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await apiClient.request(`/products/${productId}`, {
            method: 'DELETE'
          });
          
          if (response.success) {
            toast.success('Product deleted successfully');
            fetchProducts();
          } else {
            toast.error(response.message || 'Failed to delete product.');
          }
        } catch (err: any) {
          console.error('Error deleting product:', err);
          toast.error(err.message || 'An unexpected error occurred.');
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return 'badge-success';
      case 'draft': return 'badge-warning';
      case 'archived': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'sales':
        aValue = a.purchaseCount || 0;
        bValue = b.purchaseCount || 0;
        break;
      case 'rating':
        aValue = a.rating?.average || 0;
        bValue = b.rating?.average || 0;
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                // Clear auth token and redirect to login
                localStorage.removeItem('authToken');
                window.location.href = '/auth/login';
              }}
              className="btn btn-primary"
            >
              Go to Login
            </button>
            <button
              onClick={fetchProducts}
              className="btn btn-outline ml-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <Dashboard>
        <DashboardHeader
          title="My Products"
          description="Manage your product research listings and track performance"
          actions={
            <div className="flex items-center gap-3">
              <Link href="/dashboard/seller" className="btn btn-outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <Link href="/products/create" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Link>
            </div>
          }
        />

        <DashboardContent>
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/dashboard/seller" className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">My Products</span>
            </nav>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProducts}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSales}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card mb-6">
            <div className="card-content">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="views">Views</option>
                    <option value="sales">Sales</option>
                    <option value="rating">Rating</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Products ({filteredProducts.length})</h3>
            </div>
            <div className="card-content">
              {sortedProducts.length > 0 ? (
                <div className="space-y-4">
                  {sortedProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{product.title}</h4>
                          <span className={`badge ${getStatusBadge(product.status || 'draft')}`}>
                            {product.status || 'draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{product.category}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {product.views || 0} views
                          </div>
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="h-4 w-4" />
                            {product.purchaseCount || 0} sales
                          </div>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {product.rating.average} ({product.rating.count})
                            </div>
                          )}
                          <div className="text-gray-400">
                            Created {formatDate(product.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(product.price)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">per research</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="btn btn-outline btn-sm"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/products/${product._id}/edit`}
                            className="btn btn-outline btn-sm"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="btn btn-outline btn-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Start by creating your first product research listing to begin selling.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Link href="/products/create" className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Product
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </DashboardContent>
      </Dashboard>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{confirmTitle}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{confirmDescription}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={hideConfirmation}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmAction}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}