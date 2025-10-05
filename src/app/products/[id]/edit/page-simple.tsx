'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react';
import { apiClient, Product } from '@/lib/api';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useHybridAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    status: 'draft',
    previewData: {
      productCategory: '',
      subCategory: '',
      estimatedMonthlySales: '0-100' as const,
      estimatedMonthlyRevenue: '$0-$1K' as const,
      averageSellingPrice: '',
      competitionLevel: 'Low' as const,
      searchVolumeBracket: 'Low (0-1K)' as const,
      estimatedMargin: '',
      fbaFeesCategory: 'Low' as const,
      seasonality: 'Year-round' as const,
      confidenceScore: 5,
      productName: '',
      keywords: [] as string[],
      asin: '',
      supplierInformation: ''
    },
    fullData: {
      deeperKpis: {
        estimatedMonthlySales: '0-100' as const,
        demandTrendChart: '',
        competitorReviewDistribution: '',
        averageBsrMovement: 'Stable' as const,
        ppcLandscape: {
          cpc: '',
          budget: ''
        },
        targetPricePoint: '',
        landedCost: '',
        fbaFees: '',
        netMarginBreakdown: ''
      },
      profitabilityBreakdown: {
        customerPainPoints: '',
        bundlingIdeas: '',
        discountOffersTemplates: '',
        materialUpgrades: ''
      },
      differentiationOpportunities: {
        supplierRegion: 'China' as const,
        moq: '',
        deliveryTime: '1-2 weeks' as const,
        launchComplexity: 'Low' as const
      },
      productInformation: {
        productName: '',
        keywords: [] as string[],
        asin: '',
        supplierLink: ''
      },
      sourcingStrategy: '',
      launchPlan: '',
      additionalNotes: ''
    },
    tags: [] as string[],
    pdfUrl: ''
  });
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Electronics',
    'Home & Kitchen',
    'Health & Personal Care',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive',
    'Pet Supplies',
    'Books',
    'Clothing & Accessories',
    'Garden & Outdoor',
    'Office Products',
    'Baby Products',
    'Tools & Home Improvement',
    'Other'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', description: 'Not visible to buyers' },
    { value: 'published', label: 'Published', description: 'Visible to buyers' },
    { value: 'archived', label: 'Archived', description: 'Hidden from buyers' }
  ];

  // Validation constants
  const VALIDATION = {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MIN_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 5000,
    TAG_MAX_LENGTH: 50,
    MAX_TAGS: 10
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setIsLoadingProduct(true);
      const response = await apiClient.getFullProductDetails(params.id as string);
      
      if (response.success && response.data?.product) {
        const fullProduct = response.data.product;
        
        setFormData({
          title: fullProduct.title || '',
          category: fullProduct.category || 'Electronics',
          price: fullProduct.price?.toString() || '',
          status: fullProduct.status || 'draft',
          previewData: {
            productCategory: fullProduct.previewData?.productCategory || '',
            subCategory: fullProduct.previewData?.subCategory || '',
            estimatedMonthlySales: (fullProduct.previewData?.estimatedMonthlySales as any) || '0-100',
            estimatedMonthlyRevenue: (fullProduct.previewData?.estimatedMonthlyRevenue as any) || '$0-$1K',
            averageSellingPrice: fullProduct.previewData?.averageSellingPrice?.toString() || '',
            competitionLevel: (fullProduct.previewData?.competitionLevel as any) || 'Low',
            searchVolumeBracket: (fullProduct.previewData?.searchVolumeBracket as any) || 'Low (0-1K)',
            estimatedMargin: fullProduct.previewData?.estimatedMargin?.toString() || '',
            fbaFeesCategory: (fullProduct.previewData?.fbaFeesCategory as any) || 'Low',
            seasonality: (fullProduct.previewData?.seasonality as any) || 'Year-round',
            confidenceScore: fullProduct.previewData?.confidenceScore || 5,
            productName: fullProduct.previewData?.productName || '',
            keywords: fullProduct.previewData?.keywords || [],
            asin: fullProduct.previewData?.asin || '',
            supplierInformation: fullProduct.previewData?.supplierInformation || ''
          },
          fullData: {
            deeperKpis: {
              estimatedMonthlySales: (fullProduct.fullData?.deeperKpis?.estimatedMonthlySales as any) || '0-100',
              demandTrendChart: fullProduct.fullData?.deeperKpis?.demandTrendChart || '',
              competitorReviewDistribution: fullProduct.fullData?.deeperKpis?.competitorReviewDistribution || '',
              averageBsrMovement: (fullProduct.fullData?.deeperKpis?.averageBsrMovement as any) || 'Stable',
              ppcLandscape: {
                cpc: fullProduct.fullData?.deeperKpis?.ppcLandscape?.cpc?.toString() || '',
                budget: fullProduct.fullData?.deeperKpis?.ppcLandscape?.budget?.toString() || ''
              },
              targetPricePoint: fullProduct.fullData?.deeperKpis?.targetPricePoint?.toString() || '',
              landedCost: fullProduct.fullData?.deeperKpis?.landedCost?.toString() || '',
              fbaFees: fullProduct.fullData?.deeperKpis?.fbaFees?.toString() || '',
              netMarginBreakdown: fullProduct.fullData?.deeperKpis?.netMarginBreakdown || ''
            },
            profitabilityBreakdown: {
              customerPainPoints: fullProduct.fullData?.profitabilityBreakdown?.customerPainPoints || '',
              bundlingIdeas: fullProduct.fullData?.profitabilityBreakdown?.bundlingIdeas || '',
              discountOffersTemplates: fullProduct.fullData?.profitabilityBreakdown?.discountOffersTemplates || '',
              materialUpgrades: fullProduct.fullData?.profitabilityBreakdown?.materialUpgrades || ''
            },
            differentiationOpportunities: {
              supplierRegion: (fullProduct.fullData?.differentiationOpportunities?.supplierRegion as any) || 'China',
              moq: fullProduct.fullData?.differentiationOpportunities?.moq?.toString() || '',
              deliveryTime: (fullProduct.fullData?.differentiationOpportunities?.deliveryTime as any) || '1-2 weeks',
              launchComplexity: (fullProduct.fullData?.differentiationOpportunities?.launchComplexity as any) || 'Low'
            },
            productInformation: {
              productName: fullProduct.fullData?.productInformation?.productName || '',
              keywords: fullProduct.fullData?.productInformation?.keywords || [],
              asin: fullProduct.fullData?.productInformation?.asin || '',
              supplierLink: fullProduct.fullData?.productInformation?.supplierLink || ''
            },
            sourcingStrategy: fullProduct.fullData?.sourcingStrategy || '',
            launchPlan: fullProduct.fullData?.launchPlan || '',
            additionalNotes: fullProduct.fullData?.additionalNotes || ''
          },
          tags: fullProduct.tags || [],
          pdfUrl: fullProduct.pdfUrl || ''
        });
      } else {
        toast.error('Failed to load product');
        router.push('/dashboard/seller');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/dashboard/seller');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      const response = await apiClient.updateProduct(params.id as string, formData);
      if (response.success) {
        toast.success('Product updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
        router.push('/dashboard/seller');
      } else {
        if (response.errors) {
          const backendErrors: Record<string, string> = {};
          response.errors.forEach((error: any) => {
            backendErrors[error.path || 'general'] = error.msg;
          });
          setErrors(backendErrors);
        }
        toast.error(response.message || 'Failed to update product', {
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Edit Amazon FBA Product Research
              </h1>
              <p className="mt-2 text-gray-600">
                Update your product research details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500">⚠️</span>
                <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="flex items-center gap-2">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Basic Information</h2>
              <p className="card-description">
                Update the essential details about your Amazon FBA product research.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., High-Margin Kitchen Gadget Research - 300% Profit Potential"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="input"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="1"
                    step="0.01"
                    className={`input ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="99.99"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'draft' }));
                      handleSubmit(new Event('submit') as any);
                    }}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
