'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Dashboard, 
  DashboardHeader, 
  DashboardContent, 
  DashboardMain,
  DashboardSection 
} from '@/components/ui/Dashboard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  User,
  Package,
  TrendingUp,
  Filter,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Home,
  Star
} from 'lucide-react';
import { apiClient, formatCurrency, formatDate } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

interface Sale {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    category?: string;
    description?: string;
    rating?: {
      average: number;
      count: number;
    };
    views?: number;
    purchaseCount?: number;
    status?: string;
  };
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  notes?: string;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  thisWeekSales: number;
  thisWeekRevenue: number;
  thisMonthSales: number;
  thisMonthRevenue: number;
  topProduct: {
    title: string;
    sales: number;
    revenue: number;
  } | null;
  recentActivity: number;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    thisWeekSales: 0,
    thisWeekRevenue: 0,
    thisMonthSales: 0,
    thisMonthRevenue: 0,
    topProduct: null,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.request<{ data: Sale[] }>('/purchases/seller-sales');
      if (response.success && response.data) {
        const salesData = response.data.data;
        setSales(salesData);
        
        // Calculate dynamic stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const totalSales = salesData.length;
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.amount, 0);
        const pendingOrders = salesData.filter(sale => sale.status === 'pending').length;
        const completedOrders = salesData.filter(sale => sale.status === 'completed').length;
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        
        // This week stats
        const thisWeekSales = salesData.filter(sale => 
          new Date(sale.createdAt) >= oneWeekAgo
        ).length;
        const thisWeekRevenue = salesData
          .filter(sale => new Date(sale.createdAt) >= oneWeekAgo)
          .reduce((sum, sale) => sum + sale.amount, 0);
        
        // This month stats
        const thisMonthSales = salesData.filter(sale => 
          new Date(sale.createdAt) >= oneMonthAgo
        ).length;
        const thisMonthRevenue = salesData
          .filter(sale => new Date(sale.createdAt) >= oneMonthAgo)
          .reduce((sum, sale) => sum + sale.amount, 0);
        
        // Top product
        const productSales = salesData.reduce((acc, sale) => {
          const productId = sale.productId._id;
          if (!acc[productId]) {
            acc[productId] = {
              title: sale.productId.title,
              sales: 0,
              revenue: 0
            };
          }
          acc[productId].sales += 1;
          acc[productId].revenue += sale.amount;
          return acc;
        }, {} as Record<string, { title: string; sales: number; revenue: number }>);
        
        const topProduct = Object.values(productSales).reduce((max, product) => 
          product.sales > max.sales ? product : max, 
          { title: '', sales: 0, revenue: 0 }
        );
        
        // Recent activity (sales in last 24 hours)
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recentActivity = salesData.filter(sale => 
          new Date(sale.createdAt) >= oneDayAgo
        ).length;
        
        setStats({
          totalSales,
          totalRevenue,
          pendingOrders,
          completedOrders,
          averageOrderValue,
          thisWeekSales,
          thisWeekRevenue,
          thisMonthSales,
          thisMonthRevenue,
          topProduct: topProduct.sales > 0 ? topProduct : null,
          recentActivity
        });
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        icon: Clock,
        label: 'Pending'
      },
      completed: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        icon: CheckCircle,
        label: 'Completed'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        icon: XCircle,
        label: 'Cancelled'
      },
      refunded: { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
        icon: XCircle,
        label: 'Refunded'
      }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const filteredSales = sales.filter(sale => {
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      sale.productId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.buyerId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.buyerId.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading sales data..." />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <Dashboard>
        <DashboardHeader
          title="My Sales"
          description="Manage your product sales and track order history."
          actions={
            <Link href="/dashboard/seller" className="btn btn-outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
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
              <span className="text-gray-900 dark:text-gray-100 font-medium">My Sales</span>
            </nav>
          </div>

          {/* Sales Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSales}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.thisWeekSales} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(stats.thisWeekRevenue)} this week
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingOrders}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.completedOrders} completed
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(stats.averageOrderValue)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stats.recentActivity} recent orders
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          {stats.topProduct && (
            <div className="mb-8">
              <div className="card">
                <div className="card-content">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Top Product</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                        {stats.topProduct.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.topProduct.sales} sales • {formatCurrency(stats.topProduct.revenue)} • This month: {stats.thisMonthSales} sales ({formatCurrency(stats.thisMonthRevenue)})
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Star className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="card mb-6">
            <div className="card-content">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders, products, or customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sales Orders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {filteredSales.length} of {sales.length} orders
              </p>
            </div>
            <div className="card-content">
              {filteredSales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Order</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale) => {
                        const statusConfig = getStatusBadge(sale.status);
                        const StatusIcon = statusConfig.icon;
                        
                        return (
                          <tr key={sale._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">#{sale._id.slice(-8)}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{sale.paymentMethod || 'Credit Card'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <Link 
                                  href={`/products/${sale.productId._id}`}
                                  className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  {sale.productId.title}
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(sale.productId.price)}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{sale.buyerId.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{sale.buyerId.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(sale.amount)}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(sale.createdAt)}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No sales found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'No orders match your current filters.' 
                      : 'Your sales will appear here once customers purchase your products.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </DashboardContent>
      </Dashboard>
    </ProtectedRoute>
  );
}
