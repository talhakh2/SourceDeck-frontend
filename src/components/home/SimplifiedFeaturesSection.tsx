'use client';

import { Shield, Zap, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';

export function SimplifiedFeaturesSection() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Verified Research",
      description: "All research is validated by our team and comes with money-back guarantee"
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Instant Access",
      description: "Get immediate access to your purchased research and start implementing today"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Expert Sellers",
      description: "Buy from successful entrepreneurs and researchers with proven track records"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Proven Results",
      description: "See real ROI data and success metrics from actual implementations"
    }
  ];

  const benefits = [
    "Skip months of research and testing",
    "Access to exclusive market insights",
    "Detailed implementation guides included",
    "Direct access to successful entrepreneurs",
    "Regular updates and support",
    "30-day money-back guarantee"
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Why Choose Our Marketplace?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've simplified the process of finding and buying quality product research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                What You Get With Every Purchase
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Join 50,000+ Successful Buyers
                </h4>
                <p className="text-gray-600 mb-6">
                  Our buyers have generated over $100M in revenue using research from our marketplace
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">4.8/5</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
