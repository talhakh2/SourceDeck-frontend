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
    <div className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/30"></div>
      
      <div className="container-responsive relative z-10">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get from idea to implementation in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative slide-up" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 z-0">
                  <div className={`absolute top-0 left-0 h-full w-1/2 bg-${step.color}-200 transition-all duration-1000 delay-${index * 200}`}></div>
                </div>
              )}
              
              <div className="relative z-10 hover-lift">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-full mb-4 group hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center slide-up">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto hover-lift">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our team is here to help you find the perfect research for your business goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn btn-primary hover-lift"
              >
                Contact Support
              </a>
              <a
                href="/how-it-works"
                className="btn btn-outline hover-lift"
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
