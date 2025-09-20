'use client';

import { Search, CreditCard, Download, TrendingUp } from 'lucide-react';

export function SimplifiedHowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "1. Find Research",
      description: "Browse our marketplace or use our smart search to find research that matches your needs",
      color: "blue"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "2. Purchase Securely",
      description: "Buy with confidence using our secure payment system with buyer protection",
      color: "green"
    },
    {
      icon: <Download className="h-8 w-8 text-purple-600" />,
      title: "3. Get Instant Access",
      description: "Download your research immediately and start implementing your new product idea",
      color: "purple"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "4. Launch & Succeed",
      description: "Follow the proven strategies and watch your business grow with validated insights",
      color: "orange"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get from idea to implementation in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 z-0">
                  <div className={`absolute top-0 left-0 h-full w-1/2 bg-${step.color}-200`}></div>
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${step.color}-100 rounded-full mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect research for your business goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn btn-primary"
              >
                Contact Support
              </a>
              <a
                href="/how-it-works"
                className="btn btn-outline"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
