'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react';
import { apiClient, Product } from '@/lib/api';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import toast from 'react-hot-toast';

// Constants for dropdown options
const estimatedMonthlySalesOptions = [
  '0-100', '100-500', '500-1000', '1000-5000', '5000-10000', '10000+'
];

const estimatedMonthlyRevenueOptions = [
  '$0-$1K', '$1K-$5K', '$5K-$10K', '$10K-$50K', '$50K-$100K', '$100K+'
];

const competitionLevels = ['Low', 'Medium', 'High'];

const searchVolumeBrackets = [
  'Low (0-1K)', 'Medium (1K-10K)', 'High (10K-100K)', 'Very High (100K+)'
];

const fbaFeesCategories = ['Low', 'Medium', 'High'];

const seasonalityOptions = ['Year-round', 'Seasonal', 'Holiday-specific'];

const bsrMovementOptions = ['Stable', 'Volatile', 'Declining', 'Growing'];

const supplierRegions = ['China', 'India', 'Vietnam', 'Thailand', 'Mexico', 'USA', 'Europe'];

const deliveryTimeOptions = ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months'];

const launchComplexityOptions = ['Low', 'Medium', 'High'];

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
  'Industrial & Scientific',
  'Baby Products',
  'Grocery & Gourmet Food'
];

const statusOptions = [
  { value: 'draft', label: 'Draft', description: 'Save as draft for later editing' },
  { value: 'published', label: 'Published', description: 'Make available to buyers' },
  { value: 'archived', label: 'Archived', description: 'Archive this product research' }
];

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
      const response = await apiClient.getProduct(params.id as string);
      
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

          {/* Research Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Research Information</h2>
              <p className="card-description">
                Update the essential details about your Amazon FBA product research report.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Research Title *
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
                    Research Category *
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
                    Research Price (USD) *
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

          {/* Preview Data Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Preview Data Section</h2>
              <p className="card-description">
                Information visible on product cards and preview (publicly visible).
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category *
                  </label>
                  <select
                    id="productCategory"
                    required
                    className="input"
                    value={formData.previewData.productCategory}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, productCategory: e.target.value }
                    }))}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category *
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    required
                    className="input"
                    placeholder="e.g., Air Purifiers, Smart Home"
                    value={formData.previewData.subCategory}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, subCategory: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="estimatedMonthlySales" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Monthly Sales *
                  </label>
                  <select
                    id="estimatedMonthlySales"
                    required
                    className="input"
                    value={formData.previewData.estimatedMonthlySales}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, estimatedMonthlySales: e.target.value as any }
                    }))}
                  >
                    {estimatedMonthlySalesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="estimatedMonthlyRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Monthly Revenue *
                  </label>
                  <select
                    id="estimatedMonthlyRevenue"
                    required
                    className="input"
                    value={formData.previewData.estimatedMonthlyRevenue}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, estimatedMonthlyRevenue: e.target.value as any }
                    }))}
                  >
                    {estimatedMonthlyRevenueOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="averageSellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Average Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    id="averageSellingPrice"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="29.99"
                    value={formData.previewData.averageSellingPrice}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, averageSellingPrice: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="competitionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Competition Level *
                  </label>
                  <select
                    id="competitionLevel"
                    required
                    className="input"
                    value={formData.previewData.competitionLevel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, competitionLevel: e.target.value as any }
                    }))}
                  >
                    {competitionLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="searchVolumeBracket" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Volume Bracket *
                  </label>
                  <select
                    id="searchVolumeBracket"
                    required
                    className="input"
                    value={formData.previewData.searchVolumeBracket}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, searchVolumeBracket: e.target.value as any }
                    }))}
                  >
                    {searchVolumeBrackets.map((bracket) => (
                      <option key={bracket} value={bracket}>
                        {bracket}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="estimatedMargin" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Margin (%) *
                  </label>
                  <input
                    type="number"
                    id="estimatedMargin"
                    required
                    min="0"
                    max="100"
                    className="input"
                    placeholder="35"
                    value={formData.previewData.estimatedMargin}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, estimatedMargin: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="fbaFeesCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    FBA Fees Category *
                  </label>
                  <select
                    id="fbaFeesCategory"
                    required
                    className="input"
                    value={formData.previewData.fbaFeesCategory}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, fbaFeesCategory: e.target.value as any }
                    }))}
                  >
                    {fbaFeesCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="seasonality" className="block text-sm font-medium text-gray-700 mb-2">
                    Seasonality *
                  </label>
                  <select
                    id="seasonality"
                    required
                    className="input"
                    value={formData.previewData.seasonality}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, seasonality: e.target.value as any }
                    }))}
                  >
                    {seasonalityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="confidenceScore" className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Score (1-10) *
                  </label>
                  <input
                    type="number"
                    id="confidenceScore"
                    required
                    min="1"
                    max="10"
                    className="input"
                    placeholder="8"
                    value={formData.previewData.confidenceScore}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      previewData: { ...prev.previewData, confidenceScore: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full Data Section - Deeper KPIs */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Deeper KPIs Section</h2>
              <p className="card-description">
                Detailed metrics and analysis (visible only to purchasers).
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="targetPricePoint" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Price Point *
                  </label>
                  <input
                    type="number"
                    id="targetPricePoint"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="29.99"
                    value={formData.fullData.deeperKpis.targetPricePoint}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: { ...prev.fullData.deeperKpis, targetPricePoint: e.target.value }
                      }
                    }))}
                  />
                </div>

                <div>
                  <label htmlFor="landedCost" className="block text-sm font-medium text-gray-700 mb-2">
                    Landed Cost *
                  </label>
                  <input
                    type="number"
                    id="landedCost"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="12.50"
                    value={formData.fullData.deeperKpis.landedCost}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: { ...prev.fullData.deeperKpis, landedCost: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fbaFees" className="block text-sm font-medium text-gray-700 mb-2">
                    FBA Fees *
                  </label>
                  <input
                    type="number"
                    id="fbaFees"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="4.50"
                    value={formData.fullData.deeperKpis.fbaFees}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: { ...prev.fullData.deeperKpis, fbaFees: e.target.value }
                      }
                    }))}
                  />
                </div>

                <div>
                  <label htmlFor="averageBsrMovement" className="block text-sm font-medium text-gray-700 mb-2">
                    Average BSR Movement *
                  </label>
                  <select
                    id="averageBsrMovement"
                    required
                    className="input"
                    value={formData.fullData.deeperKpis.averageBsrMovement}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: { ...prev.fullData.deeperKpis, averageBsrMovement: e.target.value as any }
                      }
                    }))}
                  >
                    {bsrMovementOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ppcCpc" className="block text-sm font-medium text-gray-700 mb-2">
                    PPC CPC ($)
                  </label>
                  <input
                    type="number"
                    id="ppcCpc"
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="1.25"
                    value={formData.fullData.deeperKpis.ppcLandscape.cpc}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: {
                          ...prev.fullData.deeperKpis,
                          ppcLandscape: { ...prev.fullData.deeperKpis.ppcLandscape, cpc: e.target.value }
                        }
                      }
                    }))}
                  />
                </div>

                <div>
                  <label htmlFor="ppcBudget" className="block text-sm font-medium text-gray-700 mb-2">
                    PPC Budget ($)
                  </label>
                  <input
                    type="number"
                    id="ppcBudget"
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="500"
                    value={formData.fullData.deeperKpis.ppcLandscape.budget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        deeperKpis: {
                          ...prev.fullData.deeperKpis,
                          ppcLandscape: { ...prev.fullData.deeperKpis.ppcLandscape, budget: e.target.value }
                        }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profitability Breakdown Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Profitability Breakdown Section</h2>
              <p className="card-description">
                Analysis of profitability and differentiation opportunities.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="bundlingIdeas" className="block text-sm font-medium text-gray-700 mb-2">
                  Bundling Ideas *
                </label>
                <textarea
                  id="bundlingIdeas"
                  required
                  rows={4}
                  className="input"
                  placeholder="Describe potential product bundles and cross-selling opportunities..."
                  value={formData.fullData.profitabilityBreakdown.bundlingIdeas}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      profitabilityBreakdown: { ...prev.fullData.profitabilityBreakdown, bundlingIdeas: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="discountOffersTemplates" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Offers Templates *
                </label>
                <textarea
                  id="discountOffersTemplates"
                  required
                  rows={4}
                  className="input"
                  placeholder="Provide discount strategies and promotional templates..."
                  value={formData.fullData.profitabilityBreakdown.discountOffersTemplates}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      profitabilityBreakdown: { ...prev.fullData.profitabilityBreakdown, discountOffersTemplates: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="customerPainPoints" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Pain Points
                </label>
                <textarea
                  id="customerPainPoints"
                  rows={3}
                  className="input"
                  placeholder="Identify common customer complaints and pain points..."
                  value={formData.fullData.profitabilityBreakdown.customerPainPoints}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      profitabilityBreakdown: { ...prev.fullData.profitabilityBreakdown, customerPainPoints: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="materialUpgrades" className="block text-sm font-medium text-gray-700 mb-2">
                  Material Upgrades
                </label>
                <textarea
                  id="materialUpgrades"
                  rows={3}
                  className="input"
                  placeholder="Suggest material improvements and premium options..."
                  value={formData.fullData.profitabilityBreakdown.materialUpgrades}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      profitabilityBreakdown: { ...prev.fullData.profitabilityBreakdown, materialUpgrades: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Differentiation Opportunities Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Differentiation Opportunities Section</h2>
              <p className="card-description">
                Supplier and launch feasibility information.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="supplierRegion" className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier Region *
                  </label>
                  <select
                    id="supplierRegion"
                    required
                    className="input"
                    value={formData.fullData.differentiationOpportunities.supplierRegion}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        differentiationOpportunities: { ...prev.fullData.differentiationOpportunities, supplierRegion: e.target.value as any }
                      }
                    }))}
                  >
                    {supplierRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="moq" className="block text-sm font-medium text-gray-700 mb-2">
                    MOQ (Minimum Order Quantity) *
                  </label>
                  <input
                    type="number"
                    id="moq"
                    required
                    min="1"
                    className="input"
                    placeholder="500"
                    value={formData.fullData.differentiationOpportunities.moq}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        differentiationOpportunities: { ...prev.fullData.differentiationOpportunities, moq: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time *
                  </label>
                  <select
                    id="deliveryTime"
                    required
                    className="input"
                    value={formData.fullData.differentiationOpportunities.deliveryTime}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        differentiationOpportunities: { ...prev.fullData.differentiationOpportunities, deliveryTime: e.target.value as any }
                      }
                    }))}
                  >
                    {deliveryTimeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="launchComplexity" className="block text-sm font-medium text-gray-700 mb-2">
                    Launch Complexity *
                  </label>
                  <select
                    id="launchComplexity"
                    required
                    className="input"
                    value={formData.fullData.differentiationOpportunities.launchComplexity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        differentiationOpportunities: { ...prev.fullData.differentiationOpportunities, launchComplexity: e.target.value as any }
                      }
                    }))}
                  >
                    {launchComplexityOptions.map((complexity) => (
                      <option key={complexity} value={complexity}>
                        {complexity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Product Information Section</h2>
              <p className="card-description">
                Premium product details (hidden from preview, visible only to purchasers).
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  className="input"
                  placeholder="Enter the actual product name..."
                  value={formData.fullData.productInformation.productName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      productInformation: { ...prev.fullData.productInformation, productName: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="asin" className="block text-sm font-medium text-gray-700 mb-2">
                  ASIN
                </label>
                <input
                  type="text"
                  id="asin"
                  className="input"
                  placeholder="B08XXXXXXX"
                  value={formData.fullData.productInformation.asin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      productInformation: { ...prev.fullData.productInformation, asin: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="supplierLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Link
                </label>
                <input
                  type="url"
                  id="supplierLink"
                  className="input"
                  placeholder="https://supplier.example.com/product"
                  value={formData.fullData.productInformation.supplierLink}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      productInformation: { ...prev.fullData.productInformation, supplierLink: e.target.value }
                    }
                  }))}
                />
              </div>

              <div>
                <label htmlFor="productKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  id="productKeywords"
                  className="input"
                  placeholder="Enter keywords separated by commas..."
                  value={formData.fullData.productInformation.keywords.join(', ')}
                  onChange={(e) => {
                    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                    setFormData(prev => ({
                      ...prev,
                      fullData: {
                        ...prev.fullData,
                        productInformation: { ...prev.fullData.productInformation, keywords }
                      }
                    }));
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate multiple keywords with commas
                </p>
              </div>
            </div>
          </div>

          {/* Sourcing Strategy Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Sourcing Strategy</h2>
              <p className="card-description">
                Detailed sourcing strategy and supplier information (visible only to purchasers).
              </p>
            </div>
            <div className="card-content">
              <div>
                <label htmlFor="sourcingStrategy" className="block text-sm font-medium text-gray-700 mb-2">
                  Sourcing Strategy *
                </label>
                <textarea
                  id="sourcingStrategy"
                  required
                  rows={6}
                  className="input"
                  placeholder="Describe your sourcing strategy, supplier selection criteria, quality control measures, and any special requirements..."
                  value={formData.fullData.sourcingStrategy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: { ...prev.fullData, sourcingStrategy: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Launch Plan Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Launch Plan</h2>
              <p className="card-description">
                Step-by-step launch strategy and timeline (visible only to purchasers).
              </p>
            </div>
            <div className="card-content">
              <div>
                <label htmlFor="launchPlan" className="block text-sm font-medium text-gray-700 mb-2">
                  Launch Plan *
                </label>
                <textarea
                  id="launchPlan"
                  required
                  rows={6}
                  className="input"
                  placeholder="Provide a detailed launch plan including timeline, marketing strategy, inventory management, and key milestones..."
                  value={formData.fullData.launchPlan}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: { ...prev.fullData, launchPlan: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Additional Notes</h2>
              <p className="card-description">
                Any additional insights, warnings, or recommendations (visible only to purchasers).
              </p>
            </div>
            <div className="card-content">
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  rows={4}
                  className="input"
                  placeholder="Add any additional insights, market warnings, seasonal considerations, or other important notes..."
                  value={formData.fullData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: { ...prev.fullData, additionalNotes: e.target.value }
                  }))}
                />
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
