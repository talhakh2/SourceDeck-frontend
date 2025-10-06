'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingCart, 
  Eye, 
  Download,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient, formatCurrency, formatDate } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Purchase {
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
    pdfUrl?: string;
  };
  sellerId: {
    _id: string;
    name: string;
    email: string;
    profile?: {
      company?: string;
    };
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  accessGrantedAt?: string;
}


export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchData();
    
    // If coming from successful checkout, show success message
    if (searchParams.get('purchase') === 'success') {
      toast.success('Purchase completed successfully!');
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching purchases...');
      console.log('Auth token:', localStorage.getItem('authToken'));
      
      // Fetch buyer's purchases
      const response = await apiClient.request<{ data: Purchase[] }>('/purchases/my-purchases');
      console.log('Purchases response:', response);
      
      if (response.success && response.data) {
        const purchasesData = response.data.data;
        console.log('Purchases data:', purchasesData);
        setPurchases(purchasesData);
      } else {
        console.error('Failed to fetch purchases:', response.message);
        setError(response.message || 'Failed to fetch purchases');
      }
    } catch (error: any) {
      console.error('Error fetching purchases:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
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
        <LoadingSpinner size="lg" text="Loading purchases..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }


  const displayedPurchases = showAll ? purchases : purchases.slice(0, 5);
  const hasMorePurchases = purchases.length > 5;

  return (
    <ProtectedRoute requiredRole="buyer">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container-responsive py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/products/browse"
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Purchases</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Your purchased product research</p>
            </div> */}
          </div>

          {/* Purchased Items */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Purchased Items</h3>
              <button 
                onClick={handleRefresh}
                className="btn btn-outline btn-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="card-content">
              {purchases.length > 0 ? (
                <div className="space-y-4">
                  {displayedPurchases.map((purchase) => (
                    <div key={purchase._id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{purchase.productId.title}</h4>
                          <span className={`badge ${getStatusBadge(purchase.status)}`}>
                            {purchase.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">by {purchase.sellerId.name}</p>
                        {purchase.sellerId.profile?.company && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{purchase.sellerId.profile.company}</p>
                        )}
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(purchase.amount)}</span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/products/${purchase.productId._id}`}
                            className="btn btn-outline btn-sm"
                            title="View Product"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {purchase.status === 'completed' && purchase.productId.pdfUrl && (
                            <button
                              onClick={() => handleDownloadPDF(purchase.productId._id, purchase.productId.title)}
                              className="btn btn-primary btn-sm"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* View More Button */}
                  {hasMorePurchases && !showAll && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setShowAll(true)}
                        className="btn btn-outline"
                      >
                        View More ({purchases.length - 5} more)
                      </button>
                    </div>
                  )}
                  
                  {/* Show Less Button */}
                  {hasMorePurchases && showAll && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setShowAll(false)}
                        className="btn btn-outline"
                      >
                        Show Less
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No purchases yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Start by browsing and purchasing product research to build your library.</p>
                  <Link href="/products/browse" className="btn btn-primary">
                    <Package className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
