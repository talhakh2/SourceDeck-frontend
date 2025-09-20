'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Edit, 
  Trash2,
  Package,
  Star
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient, Product, formatCurrency, formatDate } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { ConfirmationModal } from '@/components/ui/Modal';
import { 
  Dashboard, 
  DashboardHeader, 
  DashboardContent, 
  DashboardStatsGrid, 
  DashboardMain,
  DashboardTabs,
  DashboardSection 
} from '@/components/ui/Dashboard';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ProductStats {
  totalProducts: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
}

interface Sale {
  _id: string;
  productId: {
    _id: string;
    title: string;
  };
  buyerId: {
    name: string;
    email: string;
  };
  amount: number;
  status: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Confirmation modal hook
  const { 
    isOpen: isConfirmOpen, 
    title: confirmTitle, 
    description: confirmDescription, 
    confirmText, 
    cancelText, 
    variant: confirmVariant, 
    loading: confirmLoading, 
    onConfirm: handleConfirm, 
    onCancel: hideConfirmation,
    showConfirmation
  } = useConfirmationModal();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch seller's products
      const productsResponse = await apiClient.request<{ data: Product[] }>('/products/my-products');
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data.data);
      }

      // Fetch seller's sales
      const salesResponse = await apiClient.request<{ data: Sale[] }>('/purchases/seller-sales');
      if (salesResponse.success && salesResponse.data) {
        setSales(salesResponse.data.data);
      }

      // Calculate stats
      const totalProducts = productsResponse.data?.data?.length || 0;
      const totalViews = productsResponse.data?.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const totalSales = salesResponse.data?.data?.length || 0;
      const totalRevenue = salesResponse.data?.data?.reduce((sum, s) => sum + s.amount, 0) || 0;
      const averageRating = productsResponse.data?.data?.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / totalProducts || 0;

      setStats({
        totalProducts,
        totalViews,
        totalSales,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      });

    } catch (error) {
      console.error('Error fetching seller dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find(p => p._id === productId);
    const productName = product?.title || 'this product';
    
    // Show confirmation modal
    showConfirmation({
      title: 'Delete Product',
      description: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const response = await apiClient.request(`/products/${productId}`, {
            method: 'DELETE'
          });
          
          if (response.success) {
            toast.success('Product deleted successfully');
            fetchData(); // Refresh data
          } else {
            toast.error(response.message || 'Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product');
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'badge-secondary',
      published: 'badge-success',
      archived: 'badge-warning'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'badge-secondary';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const dashboardActions = (
    <Link href="/products/create">
      <Button leftIcon={<Plus className="h-4 w-4" />}>
        Create New Product
      </Button>
    </Link>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products', count: products.length },
    { id: 'sales', label: 'Sales', count: sales.length }
  ];

  return (
    <ProtectedRoute requiredRole="Seller">
      <Dashboard>
        <DashboardHeader
          title="Seller Dashboard"
          description="Manage your product research listings and track your sales"
          actions={dashboardActions}
        />

        <DashboardContent>
          <DashboardStatsGrid>
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Package className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Total Views"
              value={stats.totalViews.toLocaleString()}
              icon={<Eye className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Total Sales"
              value={stats.totalSales}
              icon={<ShoppingCart className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={<DollarSign className="h-6 w-6 text-primary-600" />}
            />
          </DashboardStatsGrid>

          <DashboardTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Products */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Products</h3>
                  <Link href="/products/create" className="btn btn-outline btn-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Link>
                </div>
                <div className="card-content">
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`badge ${getStatusBadge(product.status || 'draft')}`}>
                              {product.status || 'draft'}
                            </span>
                            <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{product.views}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                      <p className="text-gray-600 mb-4">Start by creating your first product research listing.</p>
                      <Link href="/products/create" className="btn btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Product
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Sales */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Sales</h3>
                </div>
                <div className="card-content">
                  {sales.length > 0 ? (
                    <div className="space-y-4">
                      {sales.slice(0, 5).map((sale) => (
                        <div key={sale._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{sale.productId.title}</h4>
                            <p className="text-sm text-gray-600">Sold to {sale.buyerId.name}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{formatCurrency(sale.amount)}</span>
                            <span className="text-sm text-gray-600">{formatDate(sale.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
                      <p className="text-gray-600">Your sales will appear here once buyers purchase your products.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">My Products</h3>
                <Link href="/products/create" className="btn btn-primary btn-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Link>
              </div>
              <div className="card-content">
                {products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <span className={`badge ${getStatusBadge(product.status || 'draft')}`}>
                              {product.status || 'draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {product.views} views
                            </div>
                            <div className="flex items-center gap-1">
                              <ShoppingCart className="h-4 w-4" />
                              {product.purchaseCount} sales
                            </div>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {product.rating.average} ({product.rating.count})
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/products/${product._id}`}
                              className="btn btn-outline btn-sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/products/${product._id}/edit`}
                              className="btn btn-outline btn-sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
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
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first product research listing to begin selling.</p>
                    <Link href="/products/create" className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Sales History</h3>
              </div>
              <div className="card-content">
                {sales.length > 0 ? (
                  <div className="space-y-4">
                    {sales.map((sale) => (
                      <div key={sale._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{sale.productId.title}</h4>
                          <p className="text-sm text-gray-600">Sold to {sale.buyerId.name}</p>
                          <p className="text-xs text-gray-500">{sale.buyerId.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(sale.amount)}</span>
                          <div className="text-right">
                            <span className="text-sm text-gray-600">{formatDate(sale.createdAt)}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                {sale.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No sales yet</h3>
                    <p className="text-gray-600">Your sales will appear here once buyers purchase your products.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DashboardContent>
        
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={hideConfirmation}
          onConfirm={handleConfirm}
          title={confirmTitle}
          description={confirmDescription}
          confirmText={confirmText}
          cancelText={cancelText}
          variant={confirmVariant}
          loading={confirmLoading}
        />
      </Dashboard>
    </ProtectedRoute>
  );
}