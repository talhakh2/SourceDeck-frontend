'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { apiClient } from '@/lib/api';

/**
 * Seller/Provider interface
 */
export interface Seller {
  _id: string;
  name: string;
  email: string;
  role: 'Seller';
  profile?: {
    company?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  isVerified?: boolean;
  createdAt: string;
  lastLogin?: string;
  // Additional fields for VA page
  title?: string;
  description?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: number;
  availability?: string;
  languages?: string[];
  skills?: string[];
  experience?: string;
  responseTime?: string;
  completedJobs?: number;
  isOnline?: boolean;
}

/**
 * Hook to fetch sellers/providers from the API
 */
export function useSellers(options?: {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}) {
  return useQuery(
    ['sellers'],
    async () => {
      // This would call an actual API endpoint to fetch sellers
      // For now, we'll return mock data that matches the seed data
      const mockSellers: Seller[] = [
        {
          _id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@digitalgrowth.com',
          role: 'Seller',
          profile: {
            company: 'Digital Growth Agency',
            bio: 'Specialized in e-commerce product research and market analysis. 5+ years experience helping businesses find profitable products.',
            location: 'San Francisco, CA',
            website: 'https://digitalgrowth.com'
          },
          isVerified: true,
          createdAt: new Date().toISOString(),
          title: 'E-commerce Product Research Specialist',
          description: 'Expert in Amazon FBA product research with 5+ years of experience. I help sellers find profitable products and analyze market trends.',
          avatar: '/api/placeholder/100/100',
          rating: 4.9,
          reviewCount: 127,
          hourlyRate: 25,
          availability: 'Available Now',
          languages: ['English', 'Spanish'],
          skills: ['Product Research', 'Market Analysis', 'Amazon FBA', 'Keyword Research'],
          experience: '5+ years',
          responseTime: '< 1 hour',
          completedJobs: 342,
          isOnline: true
        },
        {
          _id: '2',
          name: 'Michael Chen',
          email: 'michael@productinsights.co',
          role: 'Seller',
          profile: {
            company: 'Product Insights Co.',
            bio: 'Data-driven product research expert with focus on SaaS and digital products. Proven track record of 200%+ ROI recommendations.',
            location: 'Austin, TX',
            website: 'https://productinsights.co'
          },
          isVerified: true,
          createdAt: new Date().toISOString(),
          title: 'Digital Marketing & Research VA',
          description: 'Specialized in digital marketing research and competitor analysis. I provide comprehensive market insights and growth strategies.',
          avatar: '/api/placeholder/100/100',
          rating: 4.8,
          reviewCount: 89,
          hourlyRate: 20,
          availability: 'Available in 2 hours',
          languages: ['English', 'Tagalog'],
          skills: ['Digital Marketing', 'Competitor Analysis', 'SEO Research', 'Social Media'],
          experience: '3+ years',
          responseTime: '< 2 hours',
          completedJobs: 156,
          isOnline: false
        },
        {
          _id: '3',
          name: 'Emily Rodriguez',
          email: 'emily@marketresearch.pro',
          role: 'Seller',
          profile: {
            company: 'Market Research Pro',
            bio: 'Full-service market research agency specializing in physical product validation and sourcing strategies.',
            location: 'Miami, FL',
            website: 'https://marketresearch.pro'
          },
          isVerified: true,
          createdAt: new Date().toISOString(),
          title: 'Market Research & Data Analysis Specialist',
          description: 'Full-service market research agency specializing in physical product validation and sourcing strategies. Expert in data analysis and comprehensive research reports.',
          avatar: '/api/placeholder/100/100',
          rating: 4.9,
          reviewCount: 203,
          hourlyRate: 30,
          availability: 'Available Now',
          languages: ['English', 'Spanish'],
          skills: ['Market Research', 'Data Analysis', 'Product Validation', 'Sourcing Strategies'],
          experience: '7+ years',
          responseTime: '< 30 minutes',
          completedJobs: 456,
          isOnline: true
        },
        {
          _id: '4',
          name: 'David Kim',
          email: 'david@ecomresearch.io',
          role: 'Seller',
          profile: {
            company: 'E-Commerce Research IO',
            bio: 'E-commerce veteran with 8+ years experience. Expert in trending products, supplier networks, and launch strategies.',
            location: 'Seattle, WA',
            website: 'https://ecomresearch.io'
          },
          isVerified: true,
          createdAt: new Date().toISOString(),
          title: 'E-commerce Research Specialist',
          description: 'E-commerce veteran with 8+ years experience. Expert in trending products, supplier networks, and launch strategies.',
          avatar: '/api/placeholder/100/100',
          rating: 4.7,
          reviewCount: 156,
          hourlyRate: 28,
          availability: 'Available Today',
          languages: ['English', 'Korean'],
          skills: ['E-commerce Research', 'Supplier Networks', 'Launch Strategies', 'Trend Analysis'],
          experience: '8+ years',
          responseTime: '< 2 hours',
          completedJobs: 289,
          isOnline: false
        },
        {
          _id: '5',
          name: 'Lisa Thompson',
          email: 'lisa@productlab.agency',
          role: 'Seller',
          profile: {
            company: 'Product Lab Agency',
            bio: 'Innovation-focused agency helping businesses discover next-generation products in emerging markets.',
            location: 'New York, NY',
            website: 'https://productlab.agency'
          },
          isVerified: true,
          createdAt: new Date().toISOString(),
          title: 'Innovation & Product Discovery Specialist',
          description: 'Innovation-focused agency helping businesses discover next-generation products in emerging markets.',
          avatar: '/api/placeholder/100/100',
          rating: 4.8,
          reviewCount: 98,
          hourlyRate: 35,
          availability: 'Available Now',
          languages: ['English', 'French'],
          skills: ['Innovation Research', 'Emerging Markets', 'Product Discovery', 'Market Trends'],
          experience: '6+ years',
          responseTime: '< 1 hour',
          completedJobs: 201,
          isOnline: true
        }
      ];

      return mockSellers;
    },
    {
      enabled: options?.enabled ?? true,
      refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

/**
 * Hook to fetch a specific seller by ID
 */
export function useSeller(sellerId: string) {
  return useQuery(
    ['seller', sellerId],
    async () => {
      // This would call an actual API endpoint to fetch a specific seller
      // For now, we'll return mock data
      const mockSeller: Seller = {
        _id: sellerId,
        name: 'Emily Rodriguez',
        email: 'emily@marketresearch.pro',
        role: 'Seller',
        profile: {
          company: 'Market Research Pro',
          bio: 'Full-service market research agency specializing in physical product validation and sourcing strategies.',
          location: 'Miami, FL',
          website: 'https://marketresearch.pro'
        },
        isVerified: true,
        createdAt: new Date().toISOString(),
        title: 'Market Research & Data Analysis Specialist',
        description: 'Full-service market research agency specializing in physical product validation and sourcing strategies. Expert in data analysis and comprehensive research reports.',
        avatar: '/api/placeholder/100/100',
        rating: 4.9,
        reviewCount: 203,
        hourlyRate: 30,
        availability: 'Available Now',
        languages: ['English', 'Spanish'],
        skills: ['Market Research', 'Data Analysis', 'Product Validation', 'Sourcing Strategies'],
        experience: '7+ years',
        responseTime: '< 30 minutes',
        completedJobs: 456,
        isOnline: true
      };

      return mockSeller;
    },
    {
      enabled: !!sellerId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
}

/**
 * Hook to search sellers with filters
 */
export function useSearchSellers(searchParams: {
  query?: string;
  category?: string;
  minRate?: number;
  maxRate?: number;
  availability?: string;
  location?: string;
  skills?: string[];
}) {
  return useQuery(
    ['sellers', 'search', searchParams],
    async () => {
      // This would call an actual API endpoint with search parameters
      // For now, we'll return filtered mock data
      const { data: allSellers } = await useSellers().queryFn();
      
      if (!allSellers) return [];

      let filteredSellers = allSellers;

      // Apply search filters
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        filteredSellers = filteredSellers.filter(seller =>
          seller.name.toLowerCase().includes(query) ||
          seller.profile?.company?.toLowerCase().includes(query) ||
          seller.profile?.bio?.toLowerCase().includes(query) ||
          seller.skills?.some(skill => skill.toLowerCase().includes(query))
        );
      }

      if (searchParams.category) {
        filteredSellers = filteredSellers.filter(seller =>
          seller.skills?.some(skill => 
            skill.toLowerCase().includes(searchParams.category!.toLowerCase())
          )
        );
      }

      if (searchParams.minRate || searchParams.maxRate) {
        filteredSellers = filteredSellers.filter(seller => {
          const rate = seller.hourlyRate || 0;
          if (searchParams.minRate && rate < searchParams.minRate) return false;
          if (searchParams.maxRate && rate > searchParams.maxRate) return false;
          return true;
        });
      }

      if (searchParams.availability) {
        filteredSellers = filteredSellers.filter(seller =>
          seller.availability?.toLowerCase().includes(searchParams.availability!.toLowerCase())
        );
      }

      if (searchParams.location) {
        filteredSellers = filteredSellers.filter(seller =>
          seller.profile?.location?.toLowerCase().includes(searchParams.location!.toLowerCase())
        );
      }

      if (searchParams.skills && searchParams.skills.length > 0) {
        filteredSellers = filteredSellers.filter(seller =>
          searchParams.skills!.some(skill =>
            seller.skills?.some(sellerSkill =>
              sellerSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }

      return filteredSellers;
    },
    {
      enabled: true,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}
