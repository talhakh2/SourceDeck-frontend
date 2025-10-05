'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart, Share2, CheckCircle, DollarSign, TrendingUp, Search, Calendar, Package } from 'lucide-react';
import { Product, formatCurrency } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import toast from 'react-hot-toast';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onViewDetails, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, isInCart } = useCart();
  const { user } = useHybridAuth();
  const { isPurchased } = usePurchase();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (user.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }
    addItem(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.previewData.productName || product.title,
        url: `${window.location.origin}/products/${product._id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(product);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isInUserCart = isInCart(product._id);
  const isPurchasedByUser = isPurchased(product._id);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Title and Price */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              by {product.sellerId?.name || 'Unknown Seller'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Research Report</div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.previewData.confidenceScore >= 8 && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              High Confidence
            </span>
          )}
          {product.purchaseCount > 10 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Popular
            </span>
          )}
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {product.previewData.productCategory}
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Monthly Sales</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{product.previewData.estimatedMonthlySales}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg. Price</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(product.previewData.averageSellingPrice)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Margin</div>
            <div className="text-sm font-semibold text-green-600">{product.previewData.estimatedMargin}%</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
            <div className="text-sm font-semibold text-blue-600">{product.previewData.confidenceScore}/10</div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Monthly Revenue</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{product.previewData.estimatedMonthlyRevenue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Search Volume</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{product.previewData.searchVolumeBracket}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Seasonality</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{product.previewData.seasonality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Competition</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{product.previewData.competitionLevel}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{product.views || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              <span>{product.purchaseCount || 0} purchases</span>
            </div>
          </div>
          <span>{formatDate(product.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          
          {isPurchasedByUser ? (
            <button className="flex-1 btn btn-success btn-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Purchased
            </button>
          ) : isInUserCart ? (
            <button className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              In Cart
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex-1 btn btn-primary btn-sm flex items-center justify-center gap-2"
              disabled={!user || user.role !== 'buyer'}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}