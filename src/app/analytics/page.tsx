'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  Dashboard, 
  DashboardHeader, 
  DashboardContent, 
  DashboardStatsGrid, 
  DashboardMain,
  DashboardSection 
} from '@/components/ui/Dashboard';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Star, 
  ArrowLeft, 
  Calendar, 
  BarChart3,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { apiClient, formatCurrency, Product } from '@/lib/api';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  ratingGrowth: number;
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

interface ChartData {
  name: string;
  revenue: number;
  orders: number;
  products: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageRating: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    ratingGrowth: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch real data
      const [productsResponse, salesResponse] = await Promise.all([
        apiClient.request<{ data: Product[] }>('/products/my-products'),
        apiClient.request<{ data: Sale[] }>('/purchases/seller-sales')
      ]);

      const allProducts = productsResponse.success ? productsResponse.data?.data || [] : [];
      const allSales = salesResponse.success ? salesResponse.data?.data || [] : [];

      // Calculate analytics
      const totalRevenue = allSales.reduce((sum, s) => sum + s.amount, 0);
      const totalOrders = allSales.length;
      const totalProducts = allProducts.length;
      const averageRating = totalProducts > 0 
        ? allProducts.reduce((sum, p) => sum + (p.rating?.average || 0), 0) / totalProducts 
        : 0;

      // Calculate time-based metrics
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      const currentPeriodSales = allSales.filter(sale => new Date(sale.createdAt) >= startDate);
      const currentPeriodRevenue = currentPeriodSales.reduce((sum, s) => sum + s.amount, 0);
      
      const previousStartDate = new Date(startDate.getTime() - daysBack * 24 * 60 * 60 * 1000);
      const previousPeriodSales = allSales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= previousStartDate && saleDate < startDate;
      });
      const previousPeriodRevenue = previousPeriodSales.reduce((sum, s) => sum + s.amount, 0);

      // Calculate growth percentages
      const revenueGrowth = previousPeriodRevenue > 0 
        ? Math.round(((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100)
        : currentPeriodRevenue > 0 ? 100 : 0;

      const ordersGrowth = previousPeriodSales.length > 0 
        ? Math.round(((currentPeriodSales.length - previousPeriodSales.length) / previousPeriodSales.length) * 100)
        : currentPeriodSales.length > 0 ? 100 : 0;

      // Generate chart data
      const chartData = generateChartData(allSales, allProducts, daysBack);
      
      setAnalytics({
        totalRevenue,
        totalOrders,
        totalProducts,
        averageRating: Math.round(averageRating * 10) / 10,
        revenueGrowth,
        ordersGrowth,
        productsGrowth: 0, // Will implement later
        ratingGrowth: 0 // Will implement later
      });
      
      setProducts(allProducts);
      setSales(allSales);
      setChartData(chartData);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const generateChartData = (sales: Sale[], products: Product[], days: number) => {
    const data: ChartData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate >= dayStart && saleDate < dayEnd;
      });
      
      const dayProducts = products.filter(product => {
        const productDate = new Date(product.createdAt);
        return productDate >= dayStart && productDate < dayEnd;
      });
      
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: daySales.reduce((sum, s) => sum + s.amount, 0),
        orders: daySales.length,
        products: dayProducts.length
      });
    }
    
    return data;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <ProtectedRoute requiredRole="seller">
      <Dashboard>
        <DashboardHeader
          title="Analytics Dashboard"
          description="Track your performance and optimize your sales strategy"
          actions={
            <div className="flex items-center gap-3">
              <Link href="/dashboard/seller" className="btn btn-outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-sm"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
        />

        <DashboardContent>
          <DashboardStatsGrid>
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(analytics.totalRevenue)}
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
              change={{ value: analytics.revenueGrowth, type: 'increase', period: 'vs last month' }}
              description="Your total earnings from sales"
            />
            <StatsCard
              title="Total Orders"
              value={analytics.totalOrders}
              icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
              change={{ value: analytics.ordersGrowth, type: 'increase', period: 'this week' }}
              description="Number of completed sales"
            />
            <StatsCard
              title="Active Products"
              value={analytics.totalProducts}
              icon={<Package className="h-6 w-6 text-purple-600" />}
              change={{ value: analytics.productsGrowth, type: 'increase', period: 'this month' }}
              description="Products currently listed"
            />
            <StatsCard
              title="Average Rating"
              value={`${analytics.averageRating}/5.0`}
              icon={<Star className="h-6 w-6 text-yellow-600" />}
              change={{ value: analytics.ratingGrowth, type: 'increase', period: 'this month' }}
              description="Customer satisfaction score"
            />
          </DashboardStatsGrid>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <DashboardSection title="Revenue Trend">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Revenue Trend</h3>
                </div>
                <div className="card-content">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'revenue' ? formatCurrency(Number(value)) : value,
                            name === 'revenue' ? 'Revenue' : 'Orders'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Orders Chart */}
            <DashboardSection title="Orders Trend">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Orders Trend</h3>
                </div>
                <div className="card-content">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Performance */}
            <DashboardSection title="Product Performance">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Product Performance</h3>
                </div>
                <div className="card-content">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="products" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </DashboardSection>

            {/* Top Products */}
            <DashboardSection title="Top Products by Revenue">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Top Products by Revenue</h3>
                </div>
                <div className="card-content">
                  <div className="space-y-3">
                    {products
                      .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
                      .slice(0, 5)
                      .map((product, index) => (
                        <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{product.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(product.price)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{product.purchaseCount || 0} sales</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </DashboardSection>
          </div>

          {/* Performance Insights */}
          <DashboardSection title="Product Performance">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Performance Insights</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`p-4 border rounded-lg ${
                    analytics.revenueGrowth >= 0 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {analytics.revenueGrowth >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className={`font-medium ${
                        analytics.revenueGrowth >= 0 
                          ? 'text-green-900 dark:text-green-100' 
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        Revenue {analytics.revenueGrowth >= 0 ? 'Growth' : 'Decline'}
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      analytics.revenueGrowth >= 0 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      Your revenue has {analytics.revenueGrowth >= 0 ? 'increased' : 'decreased'} by {Math.abs(analytics.revenueGrowth)}% compared to the previous period. 
                      {analytics.revenueGrowth >= 0 
                        ? ' This is a positive trend that shows your business is growing.' 
                        : ' Consider promoting your products or adding new listings to improve performance.'
                      }
                    </p>
                  </div>

                  <div className={`p-4 border rounded-lg ${
                    analytics.ordersGrowth >= 0 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Order Volume</h4>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You&apos;ve processed {analytics.totalOrders} orders with a {analytics.ordersGrowth}% change this period. 
                      {analytics.ordersGrowth >= 0 
                        ? ' Great job on increasing your order volume!' 
                        : ' Consider optimizing your product listings to increase conversion.'
                      }
                    </p>
                  </div>

                  <div className={`p-4 border rounded-lg ${
                    analytics.averageRating >= 4.0 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : analytics.averageRating >= 3.0 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Star className={`h-5 w-5 ${
                        analytics.averageRating >= 4.0 
                          ? 'text-green-600' 
                          : analytics.averageRating >= 3.0 
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`} />
                      <h4 className={`font-medium ${
                        analytics.averageRating >= 4.0 
                          ? 'text-green-900 dark:text-green-100' 
                          : analytics.averageRating >= 3.0 
                            ? 'text-yellow-900 dark:text-yellow-100'
                            : 'text-red-900 dark:text-red-100'
                      }`}>
                        Customer Satisfaction
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      analytics.averageRating >= 4.0 
                        ? 'text-green-700 dark:text-green-300' 
                        : analytics.averageRating >= 3.0 
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : 'text-red-700 dark:text-red-300'
                    }`}>
                      Your average rating of {analytics.averageRating}/5.0 shows {
                        analytics.averageRating >= 4.0 
                          ? 'excellent customer satisfaction. Keep up the great work!' 
                          : analytics.averageRating >= 3.0 
                            ? 'good customer satisfaction. There&apos;s room for improvement.'
                            : 'poor customer satisfaction. Focus on product quality and customer service.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>
        </DashboardContent>
      </Dashboard>
    </ProtectedRoute>
  );
}
