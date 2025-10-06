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
      console.log('Checking access for user:', user);
      console.log('Product seller ID:', product?.sellerId?._id);
      
      // Check if user is the seller of this product
      if (user && product && user._id === product.sellerId?._id) {
        console.log('User is the seller, granting access');
        setHasAccess(true);
        fetchFullProduct();
        return;
      }
      
      // For buyers, check if they have purchased the product
      if (user && user.role === 'buyer') {
        console.log('User is a buyer, checking purchase status');
        const response = await apiClient.verifyAccess(params.id as string);
        console.log('Verify access response:', response);
        
        if (response.success && response.data?.hasAccess) {
          console.log('User has access, granting full access');
          setHasAccess(true);
          fetchFullProduct();
        } else {
          console.log('User does not have access:', response.message);
        }
      } else {
        console.log('User is not a buyer or not logged in');
      }
    } catch (error) {
      console.error('Error checking access:', error);
    }
  };

  const fetchFullProduct = async () => {
    try {
      console.log('Fetching full product for ID:', params.id);
      const response = await apiClient.request<{ product: Product }>(`/products/${params.id}/full`);
      console.log('Full product response:', response);
      
      if (response.success && response.data) {
        console.log('Setting full product data:', response.data.product);
        setProduct(response.data.product);
      } else {
        console.log('Failed to fetch full product:', response.message);
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

      // DEMO MODE: Auto-complete purchase
      const purchaseData = {
        productId: params.id as string,
        amount: product?.price || 0,
        paymentProvider: 'demo',
        paymentProviderTransactionId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('Creating direct purchase with data:', purchaseData);

      const response = await apiClient.createPurchase(purchaseData);

      console.log('Direct purchase response:', response);

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
              <h1 className={`text-2xl font-display font-bold text-gray-900 ${!hasAccess ? 'blur-sm' : ''}`}>
                {hasAccess ? product.title : 'Premium Product Research Report'}
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
            {/* Product Cards - Preview Data */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Product Overview</h2>
              </div>
              <div className="card-content">
                {/* Main KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {product.previewData.estimatedMargin}%
                    </div>
                    <div className="text-sm text-gray-600">Estimated Margin</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(product.previewData.averageSellingPrice)}
                    </div>
                    <div className="text-sm text-gray-600">Average Selling Price</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {product.previewData.estimatedMonthlySales}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Sales</div>
                  </div>
                </div>

                {/* Additional Preview Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Market Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Category</span>
                        <span className="font-semibold">{product.previewData.productCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sub Category</span>
                        <span className="font-semibold">{product.previewData.subCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Competition Level</span>
                        <span className="font-semibold">{product.previewData.competitionLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Search Volume</span>
                        <span className="font-semibold">{product.previewData.searchVolumeBracket}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">FBA Fees Category</span>
                        <span className="font-semibold">{product.previewData.fbaFeesCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seasonality</span>
                        <span className="font-semibold">{product.previewData.seasonality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence Score</span>
                        <span className="font-semibold">{product.previewData.confidenceScore}/10</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>


            {/* Full Details (show all sections, blur specific fields if not purchased) */}
            {(
              <>
                {/* Deeper KPIs Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Deeper KPIs</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Sales & Demand</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Monthly Sales</span>
                            <span className="font-semibold">{product.fullData?.deeperKpis?.estimatedMonthlySales || product.previewData?.estimatedMonthlySales || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Average BSR Movement</span>
                            <span className="font-semibold">{product.fullData?.deeperKpis?.averageBsrMovement || 'Stable'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Market Analysis</h3>
                        <div className="space-y-3">
                          {/* Demand Trend Chart - SHOW */}
                          <div className="mt-4">
                            <span className="text-gray-600 block mb-2">Demand Trend Chart</span>
                            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                              {product.fullData?.deeperKpis?.demandTrendChart || '📈 Demand trend analysis available after purchase'}
                            </div>
                          </div>
                          {/* Competitor Review Distribution - SHOW */}
                          <div className="mt-4">
                            <span className="text-gray-600 block mb-2">Competitor Review Distribution</span>
                            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                              {product.fullData?.deeperKpis?.competitorReviewDistribution || '📊 Competitor analysis available after purchase'}
                            </div>
                          </div>
                          {/* PPC Landscape - SHOW */}
                          <div className="mt-4">
                            <span className="text-gray-600 block mb-2">PPC Landscape</span>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">CPC</span>
                                <span className="text-sm font-medium">
                                  {product.fullData?.deeperKpis?.ppcLandscape?.cpc 
                                    ? formatCurrency(product.fullData.deeperKpis.ppcLandscape.cpc)
                                    : product.previewData?.averageSellingPrice
                                      ? formatCurrency(product.previewData.averageSellingPrice * 0.12) // 12% of selling price
                                      : '$1.85'
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Budget</span>
                                <span className="text-sm font-medium">
                                  {product.fullData?.deeperKpis?.ppcLandscape?.budget 
                                    ? formatCurrency(product.fullData.deeperKpis.ppcLandscape.budget)
                                    : product.previewData?.averageSellingPrice
                                      ? formatCurrency(product.previewData.averageSellingPrice * 250) // $250 per $1 selling price
                                      : '$4,200.00'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profitability Breakdown Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Profitability Breakdown</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Financial Metrics</h3>
                        <div className="space-y-3">
                          {/* Target Price Point - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Target Price Point</span>
                            <span className="font-semibold">{product.fullData?.deeperKpis?.targetPricePoint ? formatCurrency(product.fullData.deeperKpis.targetPricePoint) : (product.previewData?.averageSellingPrice ? formatCurrency(product.previewData.averageSellingPrice) : 'N/A')}</span>
                          </div>
                          {/* Landed Cost - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Landed Cost</span>
                            <span className="font-semibold">
                              {product.fullData?.deeperKpis?.landedCost 
                                ? formatCurrency(product.fullData.deeperKpis.landedCost) 
                                : product.previewData?.averageSellingPrice && product.previewData?.estimatedMargin
                                  ? formatCurrency(product.previewData.averageSellingPrice * (1 - product.previewData.estimatedMargin / 100))
                                  : 'Calculating...'
                              }
                            </span>
                          </div>
                          {/* FBA Fees - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">FBA Fees</span>
                            <span className="font-semibold">
                              {product.fullData?.deeperKpis?.fbaFees 
                                ? formatCurrency(product.fullData.deeperKpis.fbaFees) 
                                : product.previewData?.averageSellingPrice
                                  ? formatCurrency(product.previewData.averageSellingPrice * 0.15) // 15% of selling price
                                  : 'Calculating...'
                              }
                            </span>
                          </div>
                          {/* Net Margin Breakdown - SHOW */}
                          <div className="mt-4">
                            <span className="text-gray-600 block mb-2">Net Margin Breakdown</span>
                            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                              {product.fullData?.deeperKpis?.netMarginBreakdown || 'Detailed margin analysis available after purchase'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Revenue Optimization</h3>
                        <div className="space-y-4">
                          {/* Bundling Ideas - SHOW */}
                          <div>
                            <span className="text-gray-600 block mb-2">Bundling Ideas</span>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {product.fullData?.profitabilityBreakdown?.bundlingIdeas || 'No bundling ideas provided'}
                            </p>
                          </div>
                          {/* Discount Offers Templates - SHOW */}
                          <div>
                            <span className="text-gray-600 block mb-2">Discount Offers Templates</span>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {product.fullData?.profitabilityBreakdown?.discountOffersTemplates || 'No discount templates provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Differentiation Opportunities Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Differentiation Opportunities {!hasAccess && <span className="text-sm text-red-600">(Premium Content)</span>}</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Premium Content</h3>
                        <div className="space-y-4">
                          {/* Customer Pain Points - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">Customer Pain Points</span>
                            <div className={`bg-gray-50 p-3 rounded-lg ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.profitabilityBreakdown?.customerPainPoints || 'Not provided'
                              ) : (
                                <span className="text-gray-500">
                                  Customers often struggle with setup complexity and lack of integration with existing smart home systems. 
                                  The current market offerings have limited customization options and poor customer support.
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Material Upgrades - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">Material Upgrades</span>
                            <div className={`bg-gray-50 p-3 rounded-lg ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.profitabilityBreakdown?.materialUpgrades || 'Not provided'
                              ) : (
                                <span className="text-gray-500">
                                  Consider upgrading to premium materials like aluminum housing, tempered glass display, 
                                  and reinforced connectors for better durability and premium feel.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supplier Feasibility Section */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Supplier Feasibility</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Supplier Information</h3>
                        <div className="space-y-3">
                          {/* Supplier Region - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Supplier Region</span>
                            <span className="font-semibold">{product.fullData?.differentiationOpportunities?.supplierRegion || 'China'}</span>
                          </div>
                          {/* MOQ - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">MOQ (Minimum Order Quantity)</span>
                            <span className="font-semibold">{product.fullData?.differentiationOpportunities?.moq || '500'}</span>
                          </div>
                          {/* Delivery Time - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Time</span>
                            <span className="font-semibold">{product.fullData?.differentiationOpportunities?.deliveryTime || '2-4 weeks'}</span>
                          </div>
                          {/* Launch Complexity - SHOW */}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Launch Complexity</span>
                            <span className="font-semibold">{product.fullData?.differentiationOpportunities?.launchComplexity || 'Medium'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Information Section (Blur when not purchased) */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Product Information {!hasAccess && <span className="text-sm text-red-600">(Premium Content)</span>}</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
                        <div className="space-y-4">
                          {/* Product Name - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">Product Name</span>
                            <div className={`bg-gray-50 p-3 rounded-lg ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.productInformation?.productName || 'Not provided'
                              ) : (
                                <span className="text-gray-500">Premium Smart Home Device with Advanced Features</span>
                              )}
                            </div>
                          </div>
                          {/* Keywords - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">Keywords</span>
                            <div className={`flex flex-wrap gap-2 ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.productInformation?.keywords?.map((keyword, index) => (
                                  <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                                    {keyword}
                                  </span>
                                )) || <span className="text-gray-500">No keywords provided</span>
                              ) : (
                                <>
                                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">smart device</span>
                                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">home automation</span>
                                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">premium quality</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Amazon & Supplier Details</h3>
                        <div className="space-y-4">
                          {/* ASIN - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">ASIN</span>
                            <div className={`bg-gray-50 p-3 rounded-lg font-mono ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.productInformation?.asin || 'Not provided'
                              ) : (
                                <span className="text-gray-500">B08XXXXXXX</span>
                              )}
                            </div>
                          </div>
                          {/* Supplier Link - Blur when not purchased */}
                          <div>
                            <span className="text-gray-600 block mb-2">Supplier Link</span>
                            <div className={`bg-gray-50 p-3 rounded-lg ${!hasAccess ? 'blur-sm' : ''}`}>
                              {hasAccess ? (
                                product.fullData?.productInformation?.supplierLink ? (
                                  <a 
                                    href={product.fullData.productInformation.supplierLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-500 underline"
                                  >
                                    {product.fullData.productInformation.supplierLink}
                                  </a>
                                ) : (
                                  <span className="text-gray-500">Not provided</span>
                                )
                              ) : (
                                <span className="text-gray-500">https://supplier.example.com/product</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourcing Strategy - Hide when not purchased */}
                {hasAccess && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Sourcing Strategy</h2>
                    </div>
                    <div className="card-content">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {product.fullData?.sourcingStrategy || 'No sourcing strategy provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Launch Plan - Hide when not purchased */}
                {hasAccess && (
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Launch Plan</h2>
                    </div>
                    <div className="card-content">
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {product.fullData?.launchPlan || 'No launch plan provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes - Hide when not purchased */}
                {hasAccess && product.fullData?.additionalNotes && (
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
                  <div>
                    <div className="text-center mb-4">
                      <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Unlock Premium Content
                      </h3>
                      <p className="text-sm text-gray-600">
                        Purchase to reveal product name, ASIN, supplier link, and detailed insights
                      </p>
                    </div>
                    
                    {/* Demo Mode Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">Demo Mode</span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Payment will be automatically processed as successful.
                      </p>
                    </div>
                    
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
                    <div className="text-xs text-gray-500 text-center">
                      Debug: hasAccess={hasAccess ? 'true' : 'false'}, user={user ? 'logged in' : 'not logged in'}
                    </div>
                  </div>
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
                    <span>Published {product.publishedAt ? formatDate(product.publishedAt) : 'Not published'}</span>
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
