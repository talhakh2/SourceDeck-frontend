'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, Plus, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    status: 'draft',
    previewData: {
      // Product Cards Section
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
      
      // Hidden fields
      productName: '',
      keywords: [] as string[],
      asin: '',
      supplierInformation: ''
    },
    fullData: {
      // Deeper KPIs Section
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
      
      // Profitability Breakdown Section
      profitabilityBreakdown: {
        customerPainPoints: '',
        bundlingIdeas: '',
        discountOffersTemplates: '',
        materialUpgrades: ''
      },
      
      // Differentiation Opportunities Section
      differentiationOpportunities: {
        supplierRegion: 'China' as const,
        moq: '',
        deliveryTime: '1-2 weeks' as const,
        launchComplexity: 'Low' as const
      },
      
      // Product Information Section
      productInformation: {
        productName: '',
        keywords: [] as string[],
        asin: '',
        supplierLink: ''
      },
      
      // Legacy fields
      sourcingStrategy: '',
      launchPlan: '',
      additionalNotes: ''
    },
    tags: [] as string[],
    pdfUrl: ''
  });
  const [newTag, setNewTag] = useState('');

  // Validation constants (matching backend)
  const VALIDATION = {
    TITLE_MIN_LENGTH: 10,
    TITLE_MAX_LENGTH: 200,
    PRICE_MIN: 1,
    CONFIDENCE_SCORE_MIN: 1,
    CONFIDENCE_SCORE_MAX: 10,
    MARGIN_MIN: 0,
    MARGIN_MAX: 100,
    MOQ_MIN: 1,
    MAX_TAGS: 10,
    TAG_MAX_LENGTH: 50,
    PRODUCT_NAME_MAX_LENGTH: 200,
    KEYWORD_MIN_LENGTH: 2,
    KEYWORD_MAX_LENGTH: 100,
    MAX_KEYWORDS: 20,
    SUPPLIER_INFO_MAX_LENGTH: 1000,
    SOURCING_STRATEGY_MAX_LENGTH: 5000,
    LAUNCH_PLAN_MAX_LENGTH: 5000
  };

  // Validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'title':
        if (!value || value.trim().length < VALIDATION.TITLE_MIN_LENGTH) {
          return `Research title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`;
        }
        if (value.length > VALIDATION.TITLE_MAX_LENGTH) {
          return `Research title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`;
        }
        return '';

      case 'price':
        const price = parseFloat(value);
        if (!value || isNaN(price) || price < VALIDATION.PRICE_MIN) {
          return `Research price must be at least $${VALIDATION.PRICE_MIN}`;
        }
        return '';

      case 'previewData.productCategory':
        if (!value || value.trim().length === 0) {
          return 'Product category is required';
        }
        return '';

      case 'previewData.subCategory':
        if (!value || value.trim().length === 0) {
          return 'Sub category is required';
        }
        return '';

      case 'previewData.averageSellingPrice':
        const asp = parseFloat(value);
        if (!value || isNaN(asp) || asp < 0) {
          return 'Average selling price must be a positive number';
        }
        return '';

      case 'previewData.estimatedMargin':
        const margin = parseFloat(value);
        if (!value || isNaN(margin) || margin < VALIDATION.MARGIN_MIN || margin > VALIDATION.MARGIN_MAX) {
          return `Estimated margin must be between ${VALIDATION.MARGIN_MIN} and ${VALIDATION.MARGIN_MAX}`;
        }
        return '';

      case 'previewData.confidenceScore':
        const score = parseInt(value);
        if (!value || isNaN(score) || score < VALIDATION.CONFIDENCE_SCORE_MIN || score > VALIDATION.CONFIDENCE_SCORE_MAX) {
          return `Confidence score must be between ${VALIDATION.CONFIDENCE_SCORE_MIN} and ${VALIDATION.CONFIDENCE_SCORE_MAX}`;
        }
        return '';

      case 'previewData.productName':
        if (value && value.length > VALIDATION.PRODUCT_NAME_MAX_LENGTH) {
          return `Product name cannot exceed ${VALIDATION.PRODUCT_NAME_MAX_LENGTH} characters`;
        }
        return '';

      case 'previewData.asin':
        if (value && !/^B[0-9A-Z]{9}$/.test(value)) {
          return 'Invalid ASIN format (should be B followed by 9 alphanumeric characters)';
        }
        return '';

      case 'previewData.supplierInformation':
        if (value && value.length > VALIDATION.SUPPLIER_INFO_MAX_LENGTH) {
          return `Supplier information cannot exceed ${VALIDATION.SUPPLIER_INFO_MAX_LENGTH} characters`;
        }
        return '';

      case 'fullData.deeperKpis.targetPricePoint':
        const tpp = parseFloat(value);
        if (!value || isNaN(tpp) || tpp < 0) {
          return 'Target price point must be a positive number';
        }
        return '';

      case 'fullData.deeperKpis.landedCost':
        const lc = parseFloat(value);
        if (!value || isNaN(lc) || lc < 0) {
          return 'Landed cost must be a positive number';
        }
        return '';

      case 'fullData.deeperKpis.fbaFees':
        const fba = parseFloat(value);
        if (!value || isNaN(fba) || fba < 0) {
          return 'FBA fees must be a positive number';
        }
        return '';

      case 'fullData.deeperKpis.ppcLandscape.cpc':
        if (value) {
          const cpc = parseFloat(value);
          if (isNaN(cpc) || cpc < 0) {
            return 'CPC must be a positive number';
          }
        }
        return '';

      case 'fullData.deeperKpis.ppcLandscape.budget':
        if (value) {
          const budget = parseFloat(value);
          if (isNaN(budget) || budget < 0) {
            return 'Budget must be a positive number';
          }
        }
        return '';

      case 'fullData.profitabilityBreakdown.bundlingIdeas':
        if (!value || value.trim().length === 0) {
          return 'Bundling ideas are required';
        }
        return '';

      case 'fullData.profitabilityBreakdown.discountOffersTemplates':
        if (!value || value.trim().length === 0) {
          return 'Discount offers templates are required';
        }
        return '';

      case 'fullData.differentiationOpportunities.moq':
        const moq = parseInt(value);
        if (!value || isNaN(moq) || moq < VALIDATION.MOQ_MIN) {
          return `MOQ must be at least ${VALIDATION.MOQ_MIN}`;
        }
        return '';

      case 'fullData.productInformation.productName':
        if (value && value.length > VALIDATION.PRODUCT_NAME_MAX_LENGTH) {
          return `Product name cannot exceed ${VALIDATION.PRODUCT_NAME_MAX_LENGTH} characters`;
        }
        return '';

      case 'fullData.productInformation.asin':
        if (value && !/^B[0-9A-Z]{9}$/.test(value)) {
          return 'Invalid ASIN format (should be B followed by 9 alphanumeric characters)';
        }
        return '';

      case 'fullData.productInformation.supplierLink':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Invalid supplier link URL';
        }
        return '';

      case 'fullData.sourcingStrategy':
        if (value && value.length > VALIDATION.SOURCING_STRATEGY_MAX_LENGTH) {
          return `Sourcing strategy cannot exceed ${VALIDATION.SOURCING_STRATEGY_MAX_LENGTH} characters`;
        }
        return '';

      case 'fullData.launchPlan':
        if (value && value.length > VALIDATION.LAUNCH_PLAN_MAX_LENGTH) {
          return `Launch plan cannot exceed ${VALIDATION.LAUNCH_PLAN_MAX_LENGTH} characters`;
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      'title',
      'price',
      'previewData.productCategory',
      'previewData.subCategory',
      'previewData.averageSellingPrice',
      'previewData.estimatedMargin',
      'previewData.confidenceScore',
      'fullData.deeperKpis.targetPricePoint',
      'fullData.deeperKpis.landedCost',
      'fullData.deeperKpis.fbaFees',
      'fullData.profitabilityBreakdown.bundlingIdeas',
      'fullData.profitabilityBreakdown.discountOffersTemplates',
      'fullData.differentiationOpportunities.moq'
    ];

    requiredFields.forEach(field => {
      const value = getNestedValue(formData, field);
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Optional fields validation
    const optionalFields = [
      'previewData.productName',
      'previewData.asin',
      'previewData.supplierInformation',
      'fullData.deeperKpis.ppcLandscape.cpc',
      'fullData.deeperKpis.ppcLandscape.budget',
      'fullData.productInformation.productName',
      'fullData.productInformation.asin',
      'fullData.productInformation.supplierLink',
      'fullData.sourcingStrategy',
      'fullData.launchPlan'
    ];

    optionalFields.forEach(field => {
      const value = getNestedValue(formData, field);
      if (value) {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
    return { ...obj };
  };

  // Helper function to get field validation status
  const getFieldStatus = (fieldName: string) => {
    const hasError = errors[fieldName];
    const isTouched = touched[fieldName];
    const value = getNestedValue(formData, fieldName);
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    
    return {
      hasError: !!hasError,
      isTouched,
      isEmpty,
      isValid: !hasError && !isEmpty,
      showError: isTouched && hasError,
      showSuccess: isTouched && !hasError && !isEmpty
    };
  };

  // Helper function to get input classes
  const getInputClasses = (fieldName: string, baseClasses: string = 'input') => {
    const status = getFieldStatus(fieldName);
    let classes = baseClasses;
    
    if (status.showError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (status.showSuccess) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    
    return classes;
  };

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

  const estimatedMonthlySalesOptions = [
    '0-100',
    '100-500',
    '500-1000',
    '1000-5000',
    '5000+'
  ];

  const estimatedMonthlyRevenueOptions = [
    '$0-$1K',
    '$1K-$5K',
    '$5K-$10K',
    '$10K-$50K',
    '$50K+'
  ];

  const competitionLevels = [
    'Low',
    'Medium',
    'High',
    'Very High'
  ];

  const searchVolumeBrackets = [
    'Low (0-1K)',
    'Medium (1K-10K)',
    'High (10K-100K)',
    'Very High (100K+)'
  ];

  const fbaFeesCategories = [
    'Low',
    'Medium',
    'High'
  ];

  const seasonalityOptions = [
    'Year-round',
    'Seasonal',
    'Holiday-specific',
    'Trend-based'
  ];

  const bsrMovementOptions = [
    'Stable',
    'Improving',
    'Declining',
    'Volatile'
  ];

  const supplierRegions = [
    'China',
    'India',
    'Vietnam',
    'Thailand',
    'Mexico',
    'USA',
    'Europe',
    'Other'
  ];

  const deliveryTimeOptions = [
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3+ months'
  ];

  const launchComplexityOptions = [
    'Low',
    'Medium',
    'High',
    'Very High'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', description: 'Not visible to buyers' },
    { value: 'published', label: 'Published', description: 'Visible to buyers' },
    { value: 'archived', label: 'Archived', description: 'Hidden from buyers' }
  ];

  // Helper functions for form handling
  const updatePreviewData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      previewData: {
        ...prev.previewData,
        [field]: value
      }
    }));
  };

  const updateFullData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      fullData: {
        ...prev.fullData,
        [section]: {
          ...(prev.fullData as any)[section],
          [field]: value
        }
      }
    }));
  };

  const updatePpcLandscape = (field: 'cpc' | 'budget', value: string) => {
    setFormData(prev => ({
      ...prev,
      fullData: {
        ...prev.fullData,
        deeperKpis: {
          ...prev.fullData.deeperKpis,
          ppcLandscape: {
            ...prev.fullData.deeperKpis.ppcLandscape,
            [field]: value
          }
        }
      }
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting', {
        duration: 4000,
        icon: '❌',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await apiClient.createProduct(formData);
      if (response.success) {
        toast.success('Product created successfully!', {
          duration: 3000,
          icon: '✅',
        });
        router.push('/dashboard/seller');
      } else {
        // Handle backend validation errors
        if (response.errors) {
          const backendErrors: Record<string, string> = {};
          response.errors.forEach((error: any) => {
            backendErrors[error.path || 'general'] = error.msg;
          });
          setErrors(backendErrors);
        }
        toast.error(response.message || 'Failed to create product', {
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Handle nested fields
    if (name.includes('.')) {
      setFormData(prev => setNestedValue(prev, name, value));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags.length < VALIDATION.MAX_TAGS) {
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
        setNewTag('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

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
                Create New Amazon FBA Product Research
              </h1>
              <p className="mt-2 text-gray-600">
                List your Amazon FBA product research and start earning from your insights
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
                Provide the essential details about your Amazon FBA product research report.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Research Title *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  {formData.title.length}/{VALIDATION.TITLE_MAX_LENGTH} characters (minimum {VALIDATION.TITLE_MIN_LENGTH})
                </p>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className={getInputClasses('title')}
                  placeholder="e.g., High-Margin Kitchen Gadget Research - 300% Profit Potential"
                  value={formData.title}
                  onChange={handleChange}
                />
                {getFieldStatus('title').showError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.title}
                  </p>
                )}
                {getFieldStatus('title').showSuccess && (
                  <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                    <span className="text-green-500">✅</span>
                    Valid research title
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
                  <p className="text-xs text-gray-500 mb-2">
                    Minimum $1.00
                  </p>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="1"
                    step="0.01"
                    className={getInputClasses('price')}
                    placeholder="99.99"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {getFieldStatus('price').showError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {errors.price}
                    </p>
                  )}
                  {getFieldStatus('price').showSuccess && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      Valid price
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards Section - Preview Data */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Product Cards Section</h2>
              <p className="card-description">
                This information will be visible to all users in the product cards.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Required field
                  </p>
                  <input
                    type="text"
                    id="productCategory"
                    name="previewData.productCategory"
                    required
                    className={getInputClasses('previewData.productCategory')}
                    placeholder="e.g., Kitchen & Dining"
                    value={formData.previewData.productCategory}
                    onChange={handleChange}
                  />
                  {getFieldStatus('previewData.productCategory').showError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠️</span>
                      {errors['previewData.productCategory']}
                    </p>
                  )}
                  {getFieldStatus('previewData.productCategory').showSuccess && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      Valid product category
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Required field
                  </p>
                  <input
                    type="text"
                    id="subCategory"
                    required
                    className={`input ${errors['previewData.subCategory'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="e.g., Kitchen Tools"
                    value={formData.previewData.subCategory}
                    onChange={(e) => updatePreviewData('subCategory', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="estimatedMonthlySales" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Monthly Sales *
                  </label>
                  <select
                    id="estimatedMonthlySales"
                    required
                    className="input"
                    value={formData.previewData.estimatedMonthlySales}
                    onChange={(e) => updatePreviewData('estimatedMonthlySales', e.target.value)}
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
                    onChange={(e) => updatePreviewData('estimatedMonthlyRevenue', e.target.value)}
                  >
                    {estimatedMonthlyRevenueOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="averageSellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Average Selling Price *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Positive number only
                  </p>
                  <input
                    type="number"
                    id="averageSellingPrice"
                    required
                    min="0"
                    step="0.01"
                    className={`input ${errors['previewData.averageSellingPrice'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="29.99"
                    value={formData.previewData.averageSellingPrice}
                    onChange={(e) => updatePreviewData('averageSellingPrice', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="estimatedMargin" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Margin (%) *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    0-100% range
                  </p>
                  <input
                    type="number"
                    id="estimatedMargin"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    className={`input ${errors['previewData.estimatedMargin'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="45.5"
                    value={formData.previewData.estimatedMargin}
                    onChange={(e) => updatePreviewData('estimatedMargin', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="competitionLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Competition Level *
                  </label>
                  <select
                    id="competitionLevel"
                    required
                    className="input"
                    value={formData.previewData.competitionLevel}
                    onChange={(e) => updatePreviewData('competitionLevel', e.target.value)}
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
                    onChange={(e) => updatePreviewData('searchVolumeBracket', e.target.value)}
                  >
                    {searchVolumeBrackets.map((bracket) => (
                      <option key={bracket} value={bracket}>
                        {bracket}
                      </option>
                    ))}
                  </select>
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
                    onChange={(e) => updatePreviewData('fbaFeesCategory', e.target.value)}
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
                    onChange={(e) => updatePreviewData('seasonality', e.target.value)}
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
                  <p className="text-xs text-gray-500 mb-2">
                    1 = Low confidence, 10 = High confidence
                  </p>
                  <input
                    type="number"
                    id="confidenceScore"
                    required
                    min="1"
                    max="10"
                    className={`input ${errors['previewData.confidenceScore'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="7"
                    value={formData.previewData.confidenceScore}
                    onChange={(e) => updatePreviewData('confidenceScore', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deeper KPIs Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Deeper KPIs Section</h2>
              <p className="card-description">
                Market analysis and competitive intelligence (visible to all users).
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="demandTrendChart" className="block text-sm font-medium text-gray-700 mb-2">
                    Demand Trend Chart
                  </label>
                  <textarea
                    id="demandTrendChart"
                    rows={3}
                    className="input"
                    placeholder="Describe the demand trend analysis..."
                    value={formData.fullData.deeperKpis.demandTrendChart}
                    onChange={(e) => updateFullData('deeperKpis', 'demandTrendChart', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="competitorReviewDistribution" className="block text-sm font-medium text-gray-700 mb-2">
                    Competitor Review Distribution
                  </label>
                  <textarea
                    id="competitorReviewDistribution"
                    rows={3}
                    className="input"
                    placeholder="Analyze competitor review patterns..."
                    value={formData.fullData.deeperKpis.competitorReviewDistribution}
                    onChange={(e) => updateFullData('deeperKpis', 'competitorReviewDistribution', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="averageBsrMovement" className="block text-sm font-medium text-gray-700 mb-2">
                    Average BSR Movement *
                  </label>
                  <select
                    id="averageBsrMovement"
                    required
                    className="input"
                    value={formData.fullData.deeperKpis.averageBsrMovement}
                    onChange={(e) => updateFullData('deeperKpis', 'averageBsrMovement', e.target.value)}
                  >
                    {bsrMovementOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="netMarginBreakdown" className="block text-sm font-medium text-gray-700 mb-2">
                    Net Margin Breakdown
                  </label>
                  <textarea
                    id="netMarginBreakdown"
                    rows={3}
                    className="input"
                    placeholder="Detailed margin analysis..."
                    value={formData.fullData.deeperKpis.netMarginBreakdown}
                    onChange={(e) => updateFullData('deeperKpis', 'netMarginBreakdown', e.target.value)}
                  />
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
                    onChange={(e) => updatePpcLandscape('cpc', e.target.value)}
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
                    onChange={(e) => updatePpcLandscape('budget', e.target.value)}
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
                Financial metrics and revenue optimization strategies (visible to all users).
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Financial Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="targetPricePoint" className="block text-sm font-medium text-gray-700 mb-2">
                        Target Price Point *
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Positive number only
                      </p>
                      <input
                        type="number"
                        id="targetPricePoint"
                        required
                        min="0"
                        step="0.01"
                        className={`input ${errors['fullData.deeperKpis.targetPricePoint'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="29.99"
                        value={formData.fullData.deeperKpis.targetPricePoint}
                        onChange={(e) => updateFullData('deeperKpis', 'targetPricePoint', e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="landedCost" className="block text-sm font-medium text-gray-700 mb-2">
                        Landed Cost *
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Positive number only
                      </p>
                      <input
                        type="number"
                        id="landedCost"
                        required
                        min="0"
                        step="0.01"
                        className={`input ${errors['fullData.deeperKpis.landedCost'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="12.50"
                        value={formData.fullData.deeperKpis.landedCost}
                        onChange={(e) => updateFullData('deeperKpis', 'landedCost', e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="fbaFees" className="block text-sm font-medium text-gray-700 mb-2">
                        FBA Fees *
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Positive number only
                      </p>
                      <input
                        type="number"
                        id="fbaFees"
                        required
                        min="0"
                        step="0.01"
                        className={`input ${errors['fullData.deeperKpis.fbaFees'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="4.50"
                        value={formData.fullData.deeperKpis.fbaFees}
                        onChange={(e) => updateFullData('deeperKpis', 'fbaFees', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Revenue Optimization</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bundlingIdeas" className="block text-sm font-medium text-gray-700 mb-2">
                        Bundling Ideas *
                      </label>
                      <textarea
                        id="bundlingIdeas"
                        required
                        rows={4}
                        className={`input ${errors['fullData.profitabilityBreakdown.bundlingIdeas'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Describe potential product bundles and cross-selling opportunities..."
                        value={formData.fullData.profitabilityBreakdown.bundlingIdeas}
                        onChange={(e) => updateFullData('profitabilityBreakdown', 'bundlingIdeas', e.target.value)}
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
                        className={`input ${errors['fullData.profitabilityBreakdown.discountOffersTemplates'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Provide discount strategies and promotional templates..."
                        value={formData.fullData.profitabilityBreakdown.discountOffersTemplates}
                        onChange={(e) => updateFullData('profitabilityBreakdown', 'discountOffersTemplates', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Differentiation Opportunities Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Differentiation Opportunities Section</h2>
              <p className="card-description">
                Premium differentiation strategies and supplier feasibility information.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Premium Differentiation</h3>
                  <div className="space-y-4">
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
                        onChange={(e) => updateFullData('profitabilityBreakdown', 'customerPainPoints', e.target.value)}
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
                        onChange={(e) => updateFullData('profitabilityBreakdown', 'materialUpgrades', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Supplier Feasibility</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="supplierRegion" className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier Region *
                      </label>
                      <select
                        id="supplierRegion"
                        required
                        className="input"
                        value={formData.fullData.differentiationOpportunities.supplierRegion}
                        onChange={(e) => updateFullData('differentiationOpportunities', 'supplierRegion', e.target.value)}
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
                      <p className="text-xs text-gray-500 mb-2">
                        Minimum 1 unit
                      </p>
                      <input
                        type="number"
                        id="moq"
                        required
                        min="1"
                        className={`input ${errors['fullData.differentiationOpportunities.moq'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="500"
                        value={formData.fullData.differentiationOpportunities.moq}
                        onChange={(e) => updateFullData('differentiationOpportunities', 'moq', e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time *
                      </label>
                      <select
                        id="deliveryTime"
                        required
                        className="input"
                        value={formData.fullData.differentiationOpportunities.deliveryTime}
                        onChange={(e) => updateFullData('differentiationOpportunities', 'deliveryTime', e.target.value)}
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
                        onChange={(e) => updateFullData('differentiationOpportunities', 'launchComplexity', e.target.value)}
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
                  onChange={(e) => updateFullData('productInformation', 'productName', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="asin" className="block text-sm font-medium text-gray-700 mb-2">
                  ASIN
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Format: B + 9 alphanumeric characters (e.g., B08XYZ1234)
                </p>
                <input
                  type="text"
                  id="asin"
                  className="input"
                  placeholder="B08XXXXXXX"
                  value={formData.fullData.productInformation.asin}
                  onChange={(e) => updateFullData('productInformation', 'asin', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="supplierLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Link
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Must start with http:// or https://
                </p>
                <input
                  type="url"
                  id="supplierLink"
                  className="input"
                  placeholder="https://supplier.example.com/product"
                  value={formData.fullData.productInformation.supplierLink}
                  onChange={(e) => updateFullData('productInformation', 'supplierLink', e.target.value)}
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
                    updateFullData('productInformation', 'keywords', keywords);
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
                  className={`input ${errors['fullData.sourcingStrategy'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Describe your sourcing strategy, supplier selection criteria, quality control measures, and any special requirements..."
                  value={formData.fullData.sourcingStrategy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      sourcingStrategy: e.target.value
                    }
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
                  className={`input ${errors['fullData.launchPlan'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Provide a detailed launch plan including timeline, marketing strategy, inventory management, and key milestones..."
                  value={formData.fullData.launchPlan}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fullData: {
                      ...prev.fullData,
                      launchPlan: e.target.value
                    }
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
                    fullData: {
                      ...prev.fullData,
                      additionalNotes: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Tags</h2>
              <p className="card-description">
                Add relevant tags to help buyers find your product research.
              </p>
            </div>
            <div className="card-content space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="input flex-1"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-outline"
                  disabled={!newTag.trim() || formData.tags.length >= VALIDATION.MAX_TAGS}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                {formData.tags.length}/{VALIDATION.MAX_TAGS} tags used
              </p>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Status & Actions</h2>
              <p className="card-description">
                Choose the initial status for your product research.
              </p>
            </div>
            <div className="card-content space-y-6">
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Create Product
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







