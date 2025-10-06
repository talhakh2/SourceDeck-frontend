'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { formatCurrency } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, clearCart } = useCart();
  const { user } = useHybridAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleCheckout = () => {
    console.log('Checkout button clicked');
    console.log('User:', user);
    console.log('Items:', items);
    
    if (!user) {
      console.log('No user, redirecting to login');
      // Redirect to login if not authenticated
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    
    if (user.role !== 'buyer') {
      console.log('User is not a buyer, showing error');
      toast.error('Only buyers can make purchases. Please switch to buyer account.');
      return;
    }
    
    console.log('Redirecting to checkout page');
    // Redirect to checkout
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container-responsive py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added any product research to your cart yet. 
              Start exploring our marketplace to find valuable insights.
            </p>
            <Link
              href="/products"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              Browse Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/products"
            className="btn btn-ghost btn-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.product._id} className="p-6">
                    <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {item.product.category?.charAt(0) || 'P'}
                          </span>
                        </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {item.product.title || 'Untitled Product'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {item.product.category || 'Uncategorized'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <span>Margin: {item.product.previewData?.estimatedMargin || 0}%</span>
                              <span>Avg. Price: {formatCurrency(item.product.previewData?.averageSellingPrice || 0)}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {formatCurrency(item.product.price || 0)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Item Actions */}
                        <div className="flex items-center justify-end mt-4">
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Platform Fee (5%)</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(totalPrice * 0.05)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Processing Fee</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(2.99)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-primary-600">
                      {formatCurrency(totalPrice + (totalPrice * 0.05) + 2.99)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="spinner w-5 h-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>🔒 Secure Checkout</span>
                  <span>💳 Multiple Payment Options</span>
                  <span>✅ 30-Day Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}