'use client';

import { Users, Shield, TrendingUp, Star, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Trusted",
      description: "All transactions are protected with industry-standard security and escrow protection."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Proven Results",
      description: "Our research has helped businesses generate over $100M in revenue."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Expert Community",
      description: "Connect with successful entrepreneurs and experienced researchers."
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Quality Assured",
      description: "Every piece of research is validated and comes with a satisfaction guarantee."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Successful Purchases" },
    { number: "10,000+", label: "Verified Sellers" },
    { number: "$100M+", label: "Revenue Generated" },
    { number: "4.8/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">Sellables</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're building the world's most trusted marketplace for product research, 
              connecting successful entrepreneurs with valuable market insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Sellables?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've simplified the process of finding and buying quality product research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We believe that great product research shouldn't be a barrier to success. 
              Our mission is to democratize access to high-quality market insights by 
              connecting successful entrepreneurs with experienced researchers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Buyers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Access to validated research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Direct access to successful entrepreneurs</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Sellers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Monetize your research skills</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Build your reputation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container-responsive text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs and researchers on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
            >
              Browse Research
            </a>
            <a
              href="/auth/register"
              className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
            >
              Start Selling
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}