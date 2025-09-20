'use client';

import { useState } from 'react';
import { CreditCard, Shield, Download, CheckCircle, Lock } from 'lucide-react';

interface SimplifiedCheckoutProps {
  product: {
    _id: string;
    title: string;
    price: number;
    sellerId: {
      name: string;
      verification?: {
        emailVerified: boolean;
      };
    };
  };
  onPurchase: (paymentData: any) => Promise<void>;
}

export function SimplifiedCheckout({ product, onPurchase }: SimplifiedCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      await onPurchase({
        paymentMethod,
        productId: product._id,
        amount: product.price
      });
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
        <p className="text-blue-100">Secure checkout with instant access</p>
      </div>

      <div className="p-6">
        {/* Product Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              by {product.sellerId.name}
              {product.sellerId.verification?.emailVerified && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Verified Seller
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${product.price}
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Credit/Debit Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}>
                {paymentMethod === 'paypal' && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <div className="w-5 h-5 bg-blue-600 rounded mr-3 flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">PayPal</div>
                <div className="text-sm text-gray-500">Pay with your PayPal account</div>
              </div>
            </label>
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Get</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Complete research report</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Implementation guide</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Lifetime access</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">30-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-purple-600" />
            <span>Instant Access</span>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="spinner w-5 h-5" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              Complete Purchase - ${product.price}
            </>
          )}
        </button>

        {/* Trust Message */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Your payment is secure and encrypted. You'll get instant access to your purchase.
        </p>
      </div>
    </div>
  );
}
