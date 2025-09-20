'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Shield, Users, Star, ArrowRight } from 'lucide-react';

export function SimplifiedHeroSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container-responsive py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Find Proven Product Research
            <span className="block text-blue-600">That Actually Works</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Skip the guesswork. Buy validated product research from successful entrepreneurs and researchers.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for product research, categories, or keywords..."
                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 py-2 m-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 mb-12">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>10,000+ Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>50,000+ Successful Purchases</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register/buyer"
              className="btn btn-primary btn-lg px-8 py-4 text-lg"
            >
              Start Buying Research
            </Link>
            <Link
              href="/auth/register/seller"
              className="btn btn-outline btn-lg px-8 py-4 text-lg"
            >
              Start Selling Research
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Categories Quick Access */}
      <div className="bg-white border-t">
        <div className="container-responsive py-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Popular Categories</h3>
            <p className="text-gray-600">Jump into the most searched research areas</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'E-commerce', 'SaaS', 'Mobile Apps', 'Digital Products', 
              'Marketing', 'Finance', 'Health & Fitness'
            ].map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
