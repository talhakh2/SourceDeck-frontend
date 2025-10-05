'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Shield, Users, Star, ArrowRight } from 'lucide-react';

export function SimplifiedHeroSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products/browse?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <div className="relative gradient-primary dark:bg-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      
      <div className="container-responsive py-16 lg:py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-6 fade-in">
            Find Proven Product Research
            <span className="block gradient-text">That Actually Works</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto slide-up">
            Skip the guesswork. Buy validated product research from successful entrepreneurs and researchers.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 slide-up">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for product research, categories, or keywords..."
                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 py-2 m-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-300 mb-12 scale-in">
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full hover-lift">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full hover-lift">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">10,000+ Verified Sellers</span>
            </div>
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full hover-lift">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">4.8/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full hover-lift">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="font-medium">50,000+ Successful Purchases</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
            <Link
              href="/auth/register/buyer"
              className="btn btn-primary btn-lg px-8 py-4 text-lg hover-lift"
            >
              Start Buying Research
            </Link>
            <Link
              href="/auth/register/seller"
              className="btn btn-outline btn-lg px-8 py-4 text-lg hover-lift"
            >
              Start Selling Research
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Categories Quick Access */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="container-responsive py-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Popular Categories</h3>
            <p className="text-gray-600 dark:text-gray-400">Jump into the most searched research areas</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'E-commerce', 'SaaS', 'Mobile Apps', 'Digital Products', 
              'Marketing', 'Finance', 'Health & Fitness'
            ].map((category) => (
              <Link
                key={category}
                href={`/products/browse?category=${encodeURIComponent(category)}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 rounded-full text-sm font-medium transition-colors"
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
