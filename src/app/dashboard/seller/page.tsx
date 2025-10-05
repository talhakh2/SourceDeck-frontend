'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
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
  // Growth metrics
  revenueGrowth: number;
  salesGrowth: number;
  productsGrowth: number;
  ratingGrowth: number;
  // Time-based data
  thisWeekRevenue: number;
  lastWeekRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  thisWeekSales: number;
  lastWeekSales: number;
  thisMonthProducts: number;
  lastMonthProducts: number;
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
    averageRating: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
    productsGrowth: 0,
    ratingGrowth: 0,
    thisWeekRevenue: 0,
    lastWeekRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    thisWeekSales: 0,
    lastWeekSales: 0,
    thisMonthProducts: 0,
    lastMonthProducts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
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
    showConfirmation,
    hideConfirmation
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

      // Calculate dynamic stats
      const allProducts = productsResponse.data?.data || [];
      const allSales = salesResponse.data?.data || [];
      
      const totalProducts = allProducts.length;
      const totalViews = allProducts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalSales = allSales.length;
      const totalRevenue = allSales.reduce((sum, s) => sum + s.amount, 0);
      const averageRating = totalProducts > 0 
        ? allProducts.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / totalProducts 
        : 0;

      // Calculate time-based metrics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // This week's revenue and sales
      const thisWeekSales = allSales.filter(sale => new Date(sale.createdAt) >= oneWeekAgo);
      const thisWeekRevenue = thisWeekSales.reduce((sum, s) => sum + s.amount, 0);

      // Last week's revenue and sales
      const lastWeekSales = allSales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= twoWeeksAgo && saleDate < oneWeekAgo;
      });
      const lastWeekRevenue = lastWeekSales.reduce((sum, s) => sum + s.amount, 0);

      // This month's revenue
      const thisMonthSales = allSales.filter(sale => new Date(sale.createdAt) >= oneMonthAgo);
      const thisMonthRevenue = thisMonthSales.reduce((sum, s) => sum + s.amount, 0);

      // Last month's revenue
      const lastMonthSales = allSales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= twoMonthsAgo && saleDate < oneMonthAgo;
      });
      const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + s.amount, 0);

      // This month's products
      const thisMonthProducts = allProducts.filter(product => 
        new Date(product.createdAt) >= oneMonthAgo
      ).length;

      // Last month's products
      const lastMonthProducts = allProducts.filter(product => {
        const productDate = new Date(product.createdAt);
        return productDate >= twoMonthsAgo && productDate < oneMonthAgo;
      }).length;

      // Calculate growth percentages
      const revenueGrowth = lastWeekRevenue > 0 
        ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)
        : thisWeekRevenue > 0 ? 100 : 0;

      const salesGrowth = lastWeekSales.length > 0 
        ? Math.round(((thisWeekSales.length - lastWeekSales.length) / lastWeekSales.length) * 100)
        : thisWeekSales.length > 0 ? 100 : 0;

      const productsGrowth = lastMonthProducts > 0 
        ? Math.round(((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100)
        : thisMonthProducts > 0 ? 100 : 0;

      // For rating growth, we'll use a simple calculation
      const ratingGrowth = averageRating > 0 ? Math.round(averageRating * 10) / 10 : 0;

      setStats({
        totalProducts,
        totalViews,
        totalSales,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        revenueGrowth,
        salesGrowth,
        productsGrowth,
        ratingGrowth,
        thisWeekRevenue,
        lastWeekRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        thisWeekSales: thisWeekSales.length,
        lastWeekSales: lastWeekSales.length,
        thisMonthProducts,
        lastMonthProducts
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
    <div className="flex items-center gap-3">
      <Link href="/products/create">
        <Button leftIcon={<Plus className="h-4 w-4" />} variant="primary">
          Create Product
        </Button>
      </Link>
      <Link href="/analytics">
        <Button variant="outline" leftIcon={<TrendingUp className="h-4 w-4" />}>
          Analytics
        </Button>
      </Link>
    </div>
  );


  return (
    <ProtectedRoute requiredRole="seller">
      <Dashboard>
        <DashboardHeader
          title="Seller Dashboard"
          description="Manage your product research listings and track your sales"
          actions={dashboardActions}
        />

        <DashboardContent>
          <div className="space-y-6">
            {/* Recent Products */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Products</h3>
                <Link href="/products" className="btn btn-outline btn-sm">
                  View All
                </Link>
              </div>
              <div className="card-content">
                {products.length > 0 ? (
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{product.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`badge ${getStatusBadge(product.status || 'draft')}`}>
                            {product.status || 'draft'}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(product.price)}</span>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{product.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Start by creating your first product research listing.</p>
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
                <Link href="/sales" className="btn btn-outline btn-sm">
                  View All
                </Link>
              </div>
              <div className="card-content">
                {sales.length > 0 ? (
                  <div className="space-y-4">
                    {sales.slice(0, 5).map((sale) => (
                      <div key={sale._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{sale.productId.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Sold to {sale.buyerId.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(sale.amount)}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(sale.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No sales yet</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your sales will appear here once buyers purchase your products.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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