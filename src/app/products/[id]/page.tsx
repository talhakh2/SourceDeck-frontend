'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Shield,
  CheckCircle,
  User,
  Building,
  MapPin,
  Globe,
  Clock,
  Edit
} from 'lucide-react';
import { apiClient, Product, formatCurrency, formatDate } from '@/lib/api';
import { useHybridAuth } from '@/contexts/HybridAuthContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useHybridAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (product && user) {
      checkAccess();
    }
  }, [product, user]);

  const fetchProduct = async () => {
    try {
      const response = await apiClient.getProduct(params.id as string);

      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        setError(response.message || 'Product not found');
      }
    } catch (error) {
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccess = async () => {
    try {
      // Check if user is the seller of this product
      if (user && product && user._id === product.sellerId?._id) {
        setHasAccess(true);
        fetchFullProduct();
        return;
      }
      
      // For buyers, check if they have purchased the product
      if (user && user.role === 'Buyer') {
        const response = await apiClient.verifyAccess(params.id as string);
        if (response.success && response.data?.hasAccess) {
          setHasAccess(true);
          fetchFullProduct();
        }
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const fetchFullProduct = async () => {
    try {
      const response = await apiClient.request<{ product: Product }>(`/products/${params.id}/full`);
      if (response.success && response.data) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error('Error fetching full product:', error);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // TODO: Implement actual purchase flow with Stripe
      const response = await apiClient.createPurchase({
        productId: params.id as string,
        amount: product?.price || 0,
        paymentProvider: 'stripe',
        paymentProviderTransactionId: 'temp_' + Date.now()
      });

      if (response.success) {
        setHasAccess(true);
        fetchFullProduct();
      } else {
        setError(response.message || 'Purchase failed');
      }
    } catch (error) {
      setError('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="badge badge-primary">{product.category}</span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {product.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    {product.purchaseCount} purchases
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* KPI Summary */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Key Performance Indicators</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {product.previewData.kpiSummary.roiPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">ROI Percentage</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(product.previewData.kpiSummary.estimatedCost)}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Cost</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(product.previewData.kpiSummary.revenueForecast)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue Forecast</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Details (if purchased) */}
            {hasAccess && product.fullData ? (
              <>
                {/* Detailed KPIs */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Detailed Analysis</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Financial Metrics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profit Margin</span>
                            <span className="font-semibold">{product.fullData.detailedKpis.profitMargin}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payback Period</span>
                            <span className="font-semibold">{product.fullData.detailedKpis.paybackPeriod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Market Size</span>
                            <span className="font-semibold">{product.fullData.detailedKpis.marketSize}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourcing Strategy */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Sourcing Strategy</h2>
                  </div>
                  <div className="card-content">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {product.fullData.sourcingStrategy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Launch Plan */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Launch Plan</h2>
                  </div>
                  <div className="card-content">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {product.fullData.launchPlan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {product.fullData.additionalNotes && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Additional Notes</h2>
                    </div>
                    <div className="card-content">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {product.fullData.additionalNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Download */}
                {product.pdfUrl && (
                  <div className="card">
                    <div className="card-content">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download className="h-6 w-6 text-primary-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">Detailed Report</h3>
                            <p className="text-sm text-gray-600">Download the complete research report</p>
                          </div>
                        </div>
                        <a
                          href={product.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Preview Mode */
              <div className="card">
                <div className="card-content text-center py-12">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Unlock Full Access
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Purchase this product to access the complete sourcing strategy, 
                    launch plan, and detailed analysis.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Detailed KPIs & Metrics</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Complete Sourcing Strategy</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Step-by-step Launch Plan</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="card sticky top-8">
              <div className="card-content">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatCurrency(product.price)}
                  </div>
                  <p className="text-gray-600">One-time purchase</p>
                </div>

                {hasAccess ? (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {user && product && user._id === product.sellerId?._id ? 'Your Product' : 'You have access!'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user && product && user._id === product.sellerId?._id 
                        ? 'You can view and edit all the detailed information.' 
                        : 'You can view all the detailed information above.'}
                    </p>
                    {user && product && user._id === product.sellerId?._id && (
                      <Link
                        href={`/products/${product._id}/edit`}
                        className="btn btn-primary btn-lg w-full mb-4"
                      >
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Product
                      </Link>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="btn btn-primary btn-lg w-full mb-4"
                  >
                    {isPurchasing ? (
                      <>
                        <div className="spinner w-5 h-5 mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Unlock Full Access'
                    )}
                  </button>
                )}

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Lifetime access to updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">About the Provider</h3>
              </div>
              <div className="card-content">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.sellerId.name}</h4>
                    {product.sellerId.profile?.company && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        {product.sellerId.profile.company}
                      </div>
                    )}
                  </div>
                </div>

                {product.sellerId.profile?.bio && (
                  <p className="text-gray-600 text-sm mb-4">
                    {product.sellerId.profile.bio}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  {product.sellerId.profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {product.sellerId.profile.location}
                    </div>
                  )}
                  {product.sellerId.profile?.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a
                        href={product.sellerId.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-500"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Published {formatDate(product.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
