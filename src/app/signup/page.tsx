'use client';

import Link from 'next/link';
import { Store, ShoppingBag, ArrowRight, Users, TrendingUp, Target, Search, DollarSign } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900">
            Choose Your Path
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform as either a seller or buyer to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Seller Option */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="card-content text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Store className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Seller</h3>
              <p className="text-gray-600 mb-6">
                Share your research and insights with buyers worldwide. Monetize your expertise and build your reputation.
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Earn revenue from your research</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Reach global buyers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Build your expert reputation</span>
                </div>
              </div>
              
              <Link 
                href="/signup/seller"
                className="btn-primary w-full flex items-center justify-center space-x-2 group"
              >
                <span>Start Selling</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Buyer Option */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="card-content text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
                  <ShoppingBag className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Buyer</h3>
              <p className="text-gray-600 mb-6">
                Access premium research and insights from expert sellers. Make data-driven decisions for your business.
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Access quality research</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Save months of research time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Make better business decisions</span>
                </div>
              </div>
              
              <Link 
                href="/signup/buyer"
                className="btn-primary w-full flex items-center justify-center space-x-2 group"
              >
                <span>Start Buying</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
