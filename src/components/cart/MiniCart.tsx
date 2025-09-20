'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/api';

export function MiniCart() {
  const { items, totalItems, totalPrice, isOpen, closeCart, removeItem } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen || items.length === 0) {
    return null;
  }

  const handleRemoveItem = (productId: string) => {
    setIsAnimating(true);
    removeItem(productId);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className={`flex gap-3 p-3 bg-gray-50 rounded-lg transition-all duration-200 ${
                      isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        {item.product.category?.charAt(0) || 'P'}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.product.title || 'Untitled Product'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.product.category || 'Uncategorized'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.product.price || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                  View Cart
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}