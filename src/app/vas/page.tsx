'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Star, 
  Users, 
  Clock, 
  Search,
  MapPin,
  Globe
} from 'lucide-react';
import { useSellers, useSearchSellers, Seller } from '@/hooks/useSellers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Using Seller interface from the hook instead of local VA interface

export default function VAPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [availability, setAvailability] = useState<string[]>([]);

  // Use the dynamic sellers hook
  const { data: sellers, isLoading, error } = useSellers();
  
  // Use search hook when filters are applied
  const searchParams = {
    query: searchTerm || undefined,
    category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
    minRate: priceRange.min,
    maxRate: priceRange.max,
    availability: availability.length > 0 ? availability[0] : undefined,
  };
  
  const { data: searchResults, isLoading: isSearching } = useSearchSellers(searchParams);
  
  // Use search results if filters are applied, otherwise use all sellers
  const displaySellers = (searchTerm || selectedCategory !== 'All Categories' || priceRange.min || priceRange.max || availability.length > 0) 
    ? searchResults 
    : sellers;
  
  const isLoadingData = isLoading || isSearching;

  const categories = [
    'All Categories',
    'Product Research',
    'Market Analysis',
    'Data Entry',
    'Customer Support',
    'Social Media',
    'Content Writing',
    'Graphic Design',
    'Web Development'
  ];

  // Dynamic data is now fetched from the useSellers hook

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now handled automatically by the useSearchSellers hook
  };

  const handlePriceRangeChange = (range: string) => {
    switch (range) {
      case '10-20':
        setPriceRange({ min: 10, max: 20 });
        break;
      case '20-30':
        setPriceRange({ min: 20, max: 30 });
        break;
      case '30+':
        setPriceRange({ min: 30 });
        break;
      default:
        setPriceRange({});
    }
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    if (checked) {
      setAvailability(prev => [...prev, availability]);
    } else {
      setAvailability(prev => prev.filter(a => a !== availability));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Virtual Assistants
              </h1>
              <p className="mt-2 text-gray-600">
                Connect with skilled VAs for product research, market analysis, and business support
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/vas/apply"
                className="btn btn-primary"
              >
                Become a VA
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg">Filters</h3>
              </div>
              <div className="card-content space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search VAs..."
                      className="input pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <Search className="h-5 w-5 text-gray-400" />
                    </button>
                  </form>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        onChange={(e) => handlePriceRangeChange(e.target.checked ? '10-20' : '')}
                      />
                      <span className="text-sm">$10 - $20</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        onChange={(e) => handlePriceRangeChange(e.target.checked ? '20-30' : '')}
                      />
                      <span className="text-sm">$20 - $30</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        onChange={(e) => handlePriceRangeChange(e.target.checked ? '30+' : '')}
                      />
                      <span className="text-sm">$30+</span>
                    </label>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        onChange={(e) => handleAvailabilityChange('Available Now', e.target.checked)}
                      />
                      <span className="text-sm">Online Now</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        onChange={(e) => handleAvailabilityChange('Available Today', e.target.checked)}
                      />
                      <span className="text-sm">Available Today</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VAs Grid */}
          <div className="flex-1">
            {error ? (
              <ErrorMessage message="Failed to load providers. Please try again." />
            ) : isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="card-content">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !displaySellers || displaySellers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No providers found</h3>
                  <p className="text-sm">Try adjusting your search criteria or browse all providers.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displaySellers.map((seller) => (
                  <div key={seller._id} className="card hover-lift">
                    <div className="card-content">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                            <img
                              src={seller.avatar || '/api/placeholder/100/100'}
                              alt={seller.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {seller.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {seller.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">
                                {seller.title || seller.profile?.company || 'Provider'}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{seller.rating || 4.5}</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({seller.reviewCount || 0} reviews)
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-600">
                                {formatCurrency(seller.hourlyRate || 25)}/hr
                              </div>
                              <div className="text-sm text-gray-500">
                                {seller.availability || 'Available'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {seller.description || seller.profile?.bio || 'Professional service provider with expertise in market research and analysis.'}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(seller.skills || ['Market Research', 'Data Analysis']).slice(0, 3).map((skill, index) => (
                          <span key={index} className="badge badge-primary text-xs">
                            {skill}
                          </span>
                        ))}
                        {(seller.skills || []).length > 3 && (
                          <span className="badge badge-secondary text-xs">
                            +{(seller.skills || []).length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {seller.profile?.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {seller.responseTime || '< 2 hours'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {seller.completedJobs || 0} jobs
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {(seller.languages || ['English']).join(', ')}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/providers/${seller._id}`} className="btn btn-outline flex-1">
                          View Profile
                        </Link>
                        <button className="btn btn-primary flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="btn btn-outline">
                Load More VAs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-20">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Need Help Finding the Right VA?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our team can help you find the perfect virtual assistant for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Get Help Finding a VA
            </Link>
            <Link href="/vas/apply" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-600">
              Become a VA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
