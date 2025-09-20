'use client';

import Link from 'next/link';
import { 
  Search, 
  CreditCard, 
  Download, 
  TrendingUp, 
  Users, 
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Eye,
  ShoppingCart,
  FileText,
  BarChart3
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: 'Browse & Discover',
      description: 'Explore our marketplace of verified product research and market insights.',
      details: [
        'Filter by category, price, and ROI',
        'Read detailed previews and KPIs',
        'Check provider credentials and reviews'
      ]
    },
    {
      icon: ShoppingCart,
      title: 'Purchase & Unlock',
      description: 'Buy the research you need and get instant access to full details.',
      details: [
        'Secure payment processing',
        'Instant access after purchase',
        '30-day money-back guarantee'
      ]
    },
    {
      icon: Download,
      title: 'Access & Implement',
      description: 'Download resources and start implementing your new product strategy.',
      details: [
        'Complete sourcing strategies',
        'Step-by-step launch plans',
        'Detailed market analysis'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Scale & Succeed',
      description: 'Use the insights to launch successful products and grow your business.',
      details: [
        'Track your progress',
        'Access ongoing support',
        'Join our success community'
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Research',
      description: 'All research is vetted by our team of experts to ensure quality and accuracy.'
    },
    {
      icon: Users,
      title: 'Expert Providers',
      description: 'Connect with experienced researchers and industry professionals.'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Insights',
      description: 'Get access to real market data and proven strategies.'
    },
    {
      icon: CheckCircle,
      title: 'Guaranteed Results',
      description: 'We stand behind our research with a 30-day money-back guarantee.'
    }
  ];

  const roles = [
    {
      title: 'For Sellers',
      icon: ShoppingCart,
      description: 'Find proven product opportunities and market insights',
      benefits: [
        'Access to verified market research',
        'Detailed sourcing strategies',
        'Step-by-step launch plans',
        'ROI projections and analysis'
      ],
      cta: 'Start Buying Research',
      ctaLink: '/products'
    },
    {
      title: 'For Providers',
      icon: FileText,
      description: 'Monetize your research expertise and market knowledge',
      benefits: [
        'List your research for sale',
        'Set your own pricing',
        'Reach thousands of sellers',
        'Track your earnings'
      ],
      cta: 'Start Selling Research',
      ctaLink: '/auth/register'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-primary py-20">
        <div className="container-responsive text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Our platform connects sellers with proven product research and market insights. 
            Here's how you can get started and succeed.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From discovery to implementation, we make it easy to access and use 
              high-quality product research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-10 w-10 text-primary-600" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2">
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-primary-600"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most trusted marketplace for product research and market insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <feature.icon className="h-8 w-8 text-primary-600" />
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

      {/* Roles Section */}
      <div className="bg-white py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're looking to buy research or sell your expertise, 
              our platform has everything you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="card">
                <div className="card-content">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <role.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600">
                      {role.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {role.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={role.ctaLink}
                    className="btn btn-primary w-full"
                  >
                    {role.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gray-50 py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our platform has helped sellers and researchers achieve their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  $2M+ Revenue Generated
                </h3>
                <p className="text-gray-600">
                  Our sellers have generated over $2 million in revenue using insights from our platform.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  10,000+ Active Users
                </h3>
                <p className="text-gray-600">
                  Join thousands of sellers and researchers who trust our platform for their business needs.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-content text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  95% Success Rate
                </h3>
                <p className="text-gray-600">
                  Our research has helped 95% of users achieve their product launch goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-20">
        <div className="container-responsive text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of successful sellers and researchers. 
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn btn-secondary btn-lg">
              Get Started Free
            </Link>
            <Link href="/products" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-600">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
