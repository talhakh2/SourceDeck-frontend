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
    category: 'Physical Products',
    price: '',
    status: 'draft',
    previewData: {
      kpiSummary: {
        roiPercentage: '',
        estimatedCost: '',
        revenueForecast: ''
      }
    },
    fullData: {
      detailedKpis: {
        roiPercentage: '',
        estimatedCost: '',
        revenueForecast: '',
        profitMargin: '',
        paybackPeriod: '1-3 months',
        marketSize: 'Small'
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
    'Physical Products',
    'SaaS',
    'Digital Products',
    'Services',
    'Other'
  ];

  const paybackPeriods = [
    '1-3 months',
    '3-6 months',
    '6-12 months',
    '12+ months'
  ];

  const marketSizes = [
    'Small',
    'Medium',
    'Large',
    'Enterprise'
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

  // Load product data
  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      // First get the basic product info
      const response = await apiClient.getProduct(params.id as string);
      if (response.success && response.data) {
        const product = response.data.product;
        
        // Check if user is the seller
        if (user && user._id !== product.sellerId?._id) {
          toast.error('You can only edit your own products', {
            duration: 4000,
            icon: '❌',
          });
          router.push(`/products/${params.id}`);
          return;
        }

        // Now fetch the full product data
        try {
          const fullResponse = await apiClient.request<{ product: Product }>(`/products/${params.id}/full`);
          if (fullResponse.success && fullResponse.data) {
            const fullProduct = fullResponse.data.product;
            setFormData({
              title: fullProduct.title || '',
              category: fullProduct.category || 'Physical Products',
              price: fullProduct.price?.toString() || '',
              status: fullProduct.status || 'draft',
              previewData: {
                kpiSummary: {
                  roiPercentage: fullProduct.previewData?.kpiSummary?.roiPercentage?.toString() || '',
                  estimatedCost: fullProduct.previewData?.kpiSummary?.estimatedCost?.toString() || '',
                  revenueForecast: fullProduct.previewData?.kpiSummary?.revenueForecast?.toString() || ''
                }
              },
              fullData: {
                detailedKpis: {
                  roiPercentage: fullProduct.fullData?.detailedKpis?.roiPercentage?.toString() || '',
                  estimatedCost: fullProduct.fullData?.detailedKpis?.estimatedCost?.toString() || '',
                  revenueForecast: fullProduct.fullData?.detailedKpis?.revenueForecast?.toString() || '',
                  profitMargin: fullProduct.fullData?.detailedKpis?.profitMargin?.toString() || '',
                  paybackPeriod: fullProduct.fullData?.detailedKpis?.paybackPeriod || '1-3 months',
                  marketSize: fullProduct.fullData?.detailedKpis?.marketSize || 'Small'
                },
                sourcingStrategy: fullProduct.fullData?.sourcingStrategy || '',
                launchPlan: fullProduct.fullData?.launchPlan || '',
                additionalNotes: fullProduct.fullData?.additionalNotes || ''
              },
              tags: fullProduct.tags || [],
              pdfUrl: fullProduct.pdfUrl || ''
            });
          } else {
            // Fallback to basic product data if full data is not available
            setFormData({
              title: product.title || '',
              category: product.category || 'Physical Products',
              price: product.price?.toString() || '',
              status: product.status || 'draft',
              previewData: {
                kpiSummary: {
                  roiPercentage: product.previewData?.kpiSummary?.roiPercentage?.toString() || '',
                  estimatedCost: product.previewData?.kpiSummary?.estimatedCost?.toString() || '',
                  revenueForecast: product.previewData?.kpiSummary?.revenueForecast?.toString() || ''
                }
              },
              fullData: {
                detailedKpis: {
                  roiPercentage: product.fullData?.detailedKpis?.roiPercentage?.toString() || '',
                  estimatedCost: product.fullData?.detailedKpis?.estimatedCost?.toString() || '',
                  revenueForecast: product.fullData?.detailedKpis?.revenueForecast?.toString() || '',
                  profitMargin: product.fullData?.detailedKpis?.profitMargin?.toString() || '',
                  paybackPeriod: product.fullData?.detailedKpis?.paybackPeriod || '1-3 months',
                  marketSize: product.fullData?.detailedKpis?.marketSize || 'Small'
                },
                sourcingStrategy: product.fullData?.sourcingStrategy || '',
                launchPlan: product.fullData?.launchPlan || '',
                additionalNotes: product.fullData?.additionalNotes || ''
              },
              tags: product.tags || [],
              pdfUrl: product.pdfUrl || ''
            });
          }
        } catch (error) {
          console.error('Error fetching full product data:', error);
          // Use basic product data as fallback
          setFormData({
            title: product.title || '',
            category: product.category || 'Physical Products',
            price: product.price?.toString() || '',
            status: product.status || 'draft',
            previewData: {
              kpiSummary: {
                roiPercentage: product.previewData?.kpiSummary?.roiPercentage?.toString() || '',
                estimatedCost: product.previewData?.kpiSummary?.estimatedCost?.toString() || '',
                revenueForecast: product.previewData?.kpiSummary?.revenueForecast?.toString() || ''
              }
            },
            fullData: {
              detailedKpis: {
                roiPercentage: product.fullData?.detailedKpis?.roiPercentage?.toString() || '',
                estimatedCost: product.fullData?.detailedKpis?.estimatedCost?.toString() || '',
                revenueForecast: product.fullData?.detailedKpis?.revenueForecast?.toString() || '',
                profitMargin: product.fullData?.detailedKpis?.profitMargin?.toString() || '',
                paybackPeriod: product.fullData?.detailedKpis?.paybackPeriod || '1-3 months',
                marketSize: product.fullData?.detailedKpis?.marketSize || 'Small'
              },
              sourcingStrategy: product.fullData?.sourcingStrategy || '',
              launchPlan: product.fullData?.launchPlan || '',
              additionalNotes: product.fullData?.additionalNotes || ''
            },
            tags: product.tags || [],
            pdfUrl: product.pdfUrl || ''
          });
        }
      } else {
        toast.error('Product not found', {
          duration: 4000,
          icon: '❌',
        });
        router.push('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product', {
        duration: 4000,
        icon: '❌',
      });
      router.push('/products');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Product title is required';
        if (value.length < VALIDATION.TITLE_MIN_LENGTH) return `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`;
        if (value.length > VALIDATION.TITLE_MAX_LENGTH) return `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`;
        return '';
      
      case 'price':
        if (!value) return 'Price is required';
        const price = parseFloat(value);
        if (isNaN(price) || price < 1) return 'Price must be at least $1';
        return '';
      
      case 'fullData.sourcingStrategy':
        if (!value.trim()) return 'Sourcing strategy is required';
        if (value.length < VALIDATION.DESCRIPTION_MIN_LENGTH) return `Sourcing strategy must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters (currently ${value.length})`;
        if (value.length > VALIDATION.DESCRIPTION_MAX_LENGTH) return `Sourcing strategy cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
        return '';
      
      case 'fullData.launchPlan':
        if (!value.trim()) return 'Launch plan is required';
        if (value.length < VALIDATION.DESCRIPTION_MIN_LENGTH) return `Launch plan must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters (currently ${value.length})`;
        if (value.length > VALIDATION.DESCRIPTION_MAX_LENGTH) return `Launch plan cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
        return '';
      
      case 'fullData.additionalNotes':
        if (value.length > VALIDATION.DESCRIPTION_MAX_LENGTH) return `Additional notes cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    const titleError = validateField('title', formData.title);
    if (titleError) newErrors.title = titleError;
    
    const priceError = validateField('price', formData.price);
    if (priceError) newErrors.price = priceError;
    
    const sourcingError = validateField('fullData.sourcingStrategy', formData.fullData.sourcingStrategy);
    if (sourcingError) newErrors['fullData.sourcingStrategy'] = sourcingError;
    
    const launchError = validateField('fullData.launchPlan', formData.fullData.launchPlan);
    if (launchError) newErrors['fullData.launchPlan'] = launchError;
    
    const notesError = validateField('fullData.additionalNotes', formData.fullData.additionalNotes);
    if (notesError) newErrors['fullData.additionalNotes'] = notesError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const response = await apiClient.updateProduct(params.id as string, formData);
      if (response.success) {
        toast.success('Product updated successfully!', {
          duration: 3000,
          icon: '✅',
        });
        router.push(`/products/${params.id}`);
      } else {
        // Handle backend validation errors
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
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        
        if (keys.length === 2) {
          // Handle 2-level nesting (e.g., fullData.sourcingStrategy)
          (newData as any)[keys[0]] = {
            ...(newData as any)[keys[0]],
            [keys[1]]: value
          };
        } else if (keys.length === 3) {
          // Handle 3-level nesting (e.g., previewData.kpiSummary.roiPercentage)
          (newData as any)[keys[0]] = {
            ...(newData as any)[keys[0]],
            [keys[1]]: {
              ...((newData as any)[keys[0]] as any)[keys[1]],
              [keys[2]]: value
            }
          };
        }
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
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
                Edit Product
              </h1>
              <p className="mt-2 text-gray-600">
                Update your product research and insights
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
                Provide the essential details about your product research.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.title.length}/{VALIDATION.TITLE_MAX_LENGTH} characters, minimum {VALIDATION.TITLE_MIN_LENGTH})
                  </span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g., High-ROI Kitchen Gadget Research - 300% Profit Potential"
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
                    <span className="text-xs text-gray-500 ml-2">(minimum $1.00)</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="1"
                    step="0.01"
                    className={`input ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="99.00"
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
                  Product Status *
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
                <div className="mt-2 text-xs text-gray-500">
                  💡 <strong>Draft:</strong> Not visible to buyers. <strong>Published:</strong> Visible to buyers. <strong>Archived:</strong> Hidden from buyers.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn btn-outline"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-primary flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Data */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Preview Data</h2>
              <p className="card-description">
                This information will be visible to all users before purchase.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="previewData.kpiSummary.roiPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    ROI Percentage *
                  </label>
                  <input
                    type="number"
                    id="previewData.kpiSummary.roiPercentage"
                    name="previewData.kpiSummary.roiPercentage"
                    required
                    min="0"
                    step="0.1"
                    className="input"
                    placeholder="25.0"
                    value={formData.previewData.kpiSummary.roiPercentage}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="previewData.kpiSummary.estimatedCost" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost *
                  </label>
                  <input
                    type="number"
                    id="previewData.kpiSummary.estimatedCost"
                    name="previewData.kpiSummary.estimatedCost"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="1000.00"
                    value={formData.previewData.kpiSummary.estimatedCost}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="previewData.kpiSummary.revenueForecast" className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue Forecast *
                  </label>
                  <input
                    type="number"
                    id="previewData.kpiSummary.revenueForecast"
                    name="previewData.kpiSummary.revenueForecast"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="5000.00"
                    value={formData.previewData.kpiSummary.revenueForecast}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Full Data */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Detailed Information</h2>
              <p className="card-description">
                This information will only be visible to users who purchase your product.
              </p>
            </div>
            <div className="card-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="fullData.detailedKpis.profitMargin" className="block text-sm font-medium text-gray-700 mb-2">
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    id="fullData.detailedKpis.profitMargin"
                    name="fullData.detailedKpis.profitMargin"
                    min="0"
                    max="100"
                    step="0.1"
                    className="input"
                    placeholder="15.0"
                    value={formData.fullData.detailedKpis.profitMargin}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="fullData.detailedKpis.paybackPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                    Payback Period
                  </label>
                  <select
                    id="fullData.detailedKpis.paybackPeriod"
                    name="fullData.detailedKpis.paybackPeriod"
                    className="input"
                    value={formData.fullData.detailedKpis.paybackPeriod}
                    onChange={handleChange}
                  >
                    {paybackPeriods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fullData.detailedKpis.marketSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Market Size
                  </label>
                  <select
                    id="fullData.detailedKpis.marketSize"
                    name="fullData.detailedKpis.marketSize"
                    className="input"
                    value={formData.fullData.detailedKpis.marketSize}
                    onChange={handleChange}
                  >
                    {marketSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fullData.sourcingStrategy" className="block text-sm font-medium text-gray-700 mb-2">
                  Sourcing Strategy *
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.fullData.sourcingStrategy.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters, minimum {VALIDATION.DESCRIPTION_MIN_LENGTH})
                  </span>
                </label>
                <textarea
                  id="fullData.sourcingStrategy"
                  name="fullData.sourcingStrategy"
                  required
                  rows={8}
                  className={`input ${errors['fullData.sourcingStrategy'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Describe your sourcing strategy, suppliers, and procurement process. Include details about supplier research, cost analysis, quality control measures, and procurement processes. This should be comprehensive and provide real value to buyers..."
                  value={formData.fullData.sourcingStrategy}
                  onChange={handleChange}
                />
                {errors['fullData.sourcingStrategy'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors['fullData.sourcingStrategy']}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  💡 <strong>Tip:</strong> Include supplier contacts, cost breakdowns, quality standards, and contingency plans. The more detailed, the more valuable to buyers.
                </div>
              </div>

              <div>
                <label htmlFor="fullData.launchPlan" className="block text-sm font-medium text-gray-700 mb-2">
                  Launch Plan *
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.fullData.launchPlan.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters, minimum {VALIDATION.DESCRIPTION_MIN_LENGTH})
                  </span>
                </label>
                <textarea
                  id="fullData.launchPlan"
                  name="fullData.launchPlan"
                  required
                  rows={8}
                  className={`input ${errors['fullData.launchPlan'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Provide a detailed step-by-step launch plan. Include pre-launch activities, marketing strategies, distribution channels, customer acquisition tactics, and post-launch optimization. This should be actionable and comprehensive..."
                  value={formData.fullData.launchPlan}
                  onChange={handleChange}
                />
                {errors['fullData.launchPlan'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors['fullData.launchPlan']}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  💡 <strong>Tip:</strong> Include timelines, budgets, marketing channels, target audiences, and success metrics. Make it actionable for buyers.
                </div>
              </div>

              <div>
                <label htmlFor="fullData.additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                  <span className="text-xs text-gray-500 ml-2">
                    ({formData.fullData.additionalNotes.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters, optional)
                  </span>
                </label>
                <textarea
                  id="fullData.additionalNotes"
                  name="fullData.additionalNotes"
                  rows={6}
                  className={`input ${errors['fullData.additionalNotes'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Any additional insights, tips, considerations, market trends, competitive analysis, or recommendations for success..."
                  value={formData.fullData.additionalNotes}
                  onChange={handleChange}
                />
                {errors['fullData.additionalNotes'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors['fullData.additionalNotes']}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  💡 <strong>Optional:</strong> Add market insights, competitive analysis, potential challenges, or any other valuable information for buyers.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading || Object.keys(errors).length > 0}
                className={`btn ${Object.keys(errors).length > 0 ? 'btn-disabled' : 'btn-primary'}`}
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2" />
                    Updating...
                  </>
                ) : Object.keys(errors).length > 0 ? (
                  <>
                    <span className="text-red-500 mr-2">⚠️</span>
                    Fix Errors to Continue
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
