'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Building, 
  MapPin, 
  Globe, 
  Star, 
  Clock, 
  Users, 
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useSeller } from '@/hooks/useSellers';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatDate } from '@/lib/api';

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id as string;
  
  const { data: provider, isLoading, error } = useSeller(providerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message="Provider not found or failed to load." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/vas" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Providers
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Provider Avatar & Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mx-auto lg:mx-0">
                <img
                  src={provider.avatar || '/api/placeholder/128/128'}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Provider Details */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                    {provider.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {provider.title || provider.profile?.company || 'Professional Service Provider'}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold">{provider.rating || 4.5}</span>
                      <span className="text-gray-500">({provider.reviewCount || 0} reviews)</span>
                    </div>
                    {provider.isVerified && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatCurrency(provider.hourlyRate || 25)}/hr
                    </div>
                    <div className="text-sm text-gray-500">
                      {provider.availability || 'Available'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn btn-primary">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Provider
                    </button>
                    <Link href={`/products?seller=${provider._id}`} className="btn btn-outline">
                      View Products
                    </Link>
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
            {/* About */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">About</h2>
              </div>
              <div className="card-content">
                <p className="text-gray-600 leading-relaxed">
                  {provider.description || provider.profile?.bio || 'Professional service provider with expertise in market research and analysis. Committed to delivering high-quality results and exceptional customer service.'}
                </p>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Skills & Expertise</h2>
              </div>
              <div className="card-content">
                <div className="flex flex-wrap gap-2">
                  {(provider.skills || ['Market Research', 'Data Analysis', 'Product Validation']).map((skill, index) => (
                    <span key={index} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience & Stats */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Experience & Stats</h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {provider.experience || '5+ years'}
                    </div>
                    <div className="text-sm text-gray-500">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {provider.completedJobs || 0}
                    </div>
                    <div className="text-sm text-gray-500">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {provider.responseTime || '< 2 hours'}
                    </div>
                    <div className="text-sm text-gray-500">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {provider.rating || 4.5}
                    </div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Contact Information</h3>
              </div>
              <div className="card-content space-y-4">
                {provider.profile?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{provider.profile.location}</span>
                  </div>
                )}
                
                {provider.profile?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={provider.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-500 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    Joined {formatDate(provider.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Languages</h3>
              </div>
              <div className="card-content">
                <div className="flex flex-wrap gap-2">
                  {(provider.languages || ['English']).map((language, index) => (
                    <span key={index} className="badge badge-secondary">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Availability</h3>
              </div>
              <div className="card-content">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${provider.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-600">
                    {provider.isOnline ? 'Online Now' : 'Offline'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {provider.availability || 'Available for new projects'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="btn btn-primary w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Conversation
              </button>
              <Link href={`/products?seller=${provider._id}`} className="btn btn-outline w-full">
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
