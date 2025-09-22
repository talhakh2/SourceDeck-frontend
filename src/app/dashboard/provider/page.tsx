'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  Download,
  Star,
  TrendingUp,
  Package,
  CreditCard,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient, formatCurrency, formatDate } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
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

interface Purchase {
  _id: string;
  productId: {
    _id: string;
    title: string;
    category: string;
    price: number;
    pdfUrl?: string;
  };
  sellerId: {
    _id: string;
    name: string;
    profile: {
      company?: string;
    };
  };
  amount: number;
  status: string;
  accessGranted: boolean;
  createdAt: string;
  accessGrantedAt?: string;
}

interface Stats {
  totalPurchases: number;
  totalSpent: number;
  completedPurchases: number;
  pendingPurchases: number;
  averagePurchaseValue: number;
}

export default function BuyerDashboard() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPurchases: 0,
    totalSpent: 0,
    completedPurchases: 0,
    pendingPurchases: 0,
    averagePurchaseValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch buyer's purchases
      const response = await apiClient.request<{ data: Purchase[] }>('/purchases/my-purchases');
      if (response.success && response.data) {
        const purchasesData = response.data.data;
        setPurchases(purchasesData);

        // Calculate stats
        const totalPurchases = purchasesData.length;
        const totalSpent = purchasesData.reduce((sum, p) => sum + p.amount, 0);
        const completedPurchases = purchasesData.filter(p => p.status === 'completed').length;
        const pendingPurchases = purchasesData.filter(p => p.status === 'pending').length;
        const averagePurchaseValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

        setStats({
          totalPurchases,
          totalSpent,
          completedPurchases,
          pendingPurchases,
          averagePurchaseValue
        });
      }
    } catch (error) {
      console.error('Error fetching buyer dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (productId: string, productTitle: string) => {
    try {
      const response = await apiClient.request<{ downloadUrl: string }>(`/products/${productId}/download`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `${productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_research.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
      } else {
        toast.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-error',
      refunded: 'badge-secondary'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'badge-secondary';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const dashboardActions = (
    <Link href="/products">
      <Button leftIcon={<Package className="h-4 w-4" />}>
        Browse Products
      </Button>
    </Link>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'purchases', label: 'My Purchases', count: purchases.length },
    { id: 'research', label: 'Research Tools' }
  ];

  return (
    <ProtectedRoute requiredRole="buyer">
      <Dashboard>
        <DashboardHeader
          title="Buyer Dashboard"
          description="Manage your purchased product research and track your investments"
          actions={dashboardActions}
        />

        <DashboardContent>
          <DashboardStatsGrid>
            <StatsCard
              title="Total Purchases"
              value={stats.totalPurchases}
              icon={<ShoppingCart className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Total Spent"
              value={formatCurrency(stats.totalSpent)}
              icon={<DollarSign className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Completed"
              value={stats.completedPurchases}
              icon={<CheckCircle className="h-6 w-6 text-primary-600" />}
            />
            <StatsCard
              title="Avg. Purchase"
              value={formatCurrency(stats.averagePurchaseValue)}
              icon={<TrendingUp className="h-6 w-6 text-primary-600" />}
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
              {/* Recent Purchases */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Purchases</h3>
                  <Link href="/products" className="btn btn-outline btn-sm">
                    <Package className="h-4 w-4 mr-2" />
                    Browse More
                  </Link>
                </div>
                <div className="card-content">
                  {purchases.length > 0 ? (
                    <div className="space-y-4">
                      {purchases.slice(0, 5).map((purchase) => (
                        <div key={purchase._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{purchase.productId.title}</h4>
                            <p className="text-sm text-gray-600">by {purchase.sellerId.name}</p>
                            {purchase.sellerId.profile?.company && (
                              <p className="text-xs text-gray-500">{purchase.sellerId.profile.company}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(purchase.status)}
                              <span className={`badge ${getStatusBadge(purchase.status)}`}>
                                {purchase.status}
                              </span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(purchase.amount)}</span>
                            <span className="text-sm text-gray-600">{formatDate(purchase.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                      <p className="text-gray-600 mb-4">Start by browsing and purchasing product research.</p>
                      <Link href="/products" className="btn btn-primary">
                        <Package className="h-4 w-4 mr-2" />
                        Browse Products
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Purchase Status</h3>
                  </div>
                  <div className="card-content">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-medium text-green-600">{stats.completedPurchases}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-medium text-yellow-600">{stats.pendingPurchases}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Investment Summary</h3>
                  </div>
                  <div className="card-content">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Invested</span>
                        <span className="font-medium">{formatCurrency(stats.totalSpent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average per Purchase</span>
                        <span className="font-medium">{formatCurrency(stats.averagePurchaseValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Purchase History</h3>
              </div>
              <div className="card-content">
                {purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{purchase.productId.title}</h4>
                            <span className={`badge ${getStatusBadge(purchase.status)}`}>
                              {purchase.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">by {purchase.sellerId.name}</p>
                          {purchase.sellerId.profile?.company && (
                            <p className="text-xs text-gray-500 mb-2">{purchase.sellerId.profile.company}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Purchased {formatDate(purchase.createdAt)}
                            </div>
                            {purchase.accessGrantedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Access granted {formatDate(purchase.accessGrantedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(purchase.amount)}</span>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/products/${purchase.productId._id}`}
                              className="btn btn-outline btn-sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {purchase.status === 'completed' && purchase.productId.pdfUrl && (
                              <button
                                onClick={() => handleDownloadPDF(purchase.productId._id, purchase.productId.title)}
                                className="btn btn-outline btn-sm"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No purchases yet</h3>
                    <p className="text-gray-600 mb-6">Start by browsing and purchasing product research to build your library.</p>
                    <Link href="/products" className="btn btn-primary">
                      <Package className="h-4 w-4 mr-2" />
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Research Library</h3>
                <p className="text-sm text-gray-600">Access your completed research purchases</p>
              </div>
              <div className="card-content">
                {purchases.filter(p => p.status === 'completed').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchases
                      .filter(p => p.status === 'completed')
                      .map((purchase) => (
                        <div key={purchase._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 line-clamp-2">{purchase.productId.title}</h4>
                            <span className="badge badge-success">Completed</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">by {purchase.sellerId.name}</p>
                          <p className="text-xs text-gray-500 mb-4">{purchase.productId.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{formatCurrency(purchase.amount)}</span>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/products/${purchase.productId._id}`}
                                className="btn btn-outline btn-sm"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              {purchase.productId.pdfUrl && (
                                <button
                                  onClick={() => handleDownloadPDF(purchase.productId._id, purchase.productId.title)}
                                  className="btn btn-primary btn-sm"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No research library yet</h3>
                    <p className="text-gray-600 mb-6">Your completed purchases will appear here for easy access.</p>
                    <Link href="/products" className="btn btn-primary">
                      <Package className="h-4 w-4 mr-2" />
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </DashboardContent>
      </Dashboard>
    </ProtectedRoute>
  );
}