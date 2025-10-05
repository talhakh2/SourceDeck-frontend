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
    <div className="py-16 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20"></div>
      
      <div className="container-responsive relative z-10">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose Our Marketplace?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We've simplified the process of finding and buying quality product research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-lg mb-4 hover-lift group">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 hover-lift">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-6">
                What You Get With Every Purchase
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl p-8 hover-lift">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Join 50,000+ Successful Buyers
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our buyers have generated over $100M in revenue using research from our marketplace
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="hover-lift">
                    <div className="text-2xl font-bold text-blue-600">4.8/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                  </div>
                  <div className="hover-lift">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
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
