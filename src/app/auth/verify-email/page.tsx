'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerificationEmail, completeRegistration } = useHybridAuth();
  
  const token = searchParams.get('token');
  const role = searchParams.get('role') as 'Buyer' | 'Seller' | null;
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      handleEmailVerification(token);
    }
  }, [token]);

  const handleEmailVerification = async (verificationToken: string) => {
    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyEmail(verificationToken);
      
      if (result.success) {
        setVerificationStatus('success');
        
        // If role is provided, complete registration
        if (role) {
          setTimeout(async () => {
            try {
              const completeResult = await completeRegistration(role);
              if (completeResult.success) {
                // Redirect to appropriate dashboard
                if (role === 'Buyer') {
                  router.push('/dashboard/provider');
                } else {
                  router.push('/dashboard/seller');
                }
              } else {
                setError(completeResult.message || 'Failed to complete registration');
                setVerificationStatus('error');
              }
            } catch (err) {
              setError('Failed to complete registration');
              setVerificationStatus('error');
            }
          }, 2000);
        }
      } else {
        setError(result.message || 'Email verification failed');
        setVerificationStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email address not found. Please try signing up again.');
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(result.message || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return {
          title: 'Email Verified Successfully!',
          message: role 
            ? `Welcome! Your ${role.toLowerCase()} account is being set up...`
            : 'Your email has been verified successfully!'
        };
      case 'error':
        return {
          title: 'Verification Failed',
          message: error || 'The verification link is invalid or has expired.'
        };
      case 'expired':
        return {
          title: 'Link Expired',
          message: 'This verification link has expired. Please request a new one.'
        };
      default:
        return {
          title: 'Verifying Email...',
          message: 'Please wait while we verify your email address.'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {isVerifying ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            ) : (
              getStatusIcon()
            )}
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {statusInfo.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {statusInfo.message}
          </p>

          {/* Error Display */}
          {error && verificationStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Resend Success */}
          {resendSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                Verification email sent successfully! Please check your inbox.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            {verificationStatus === 'success' && role && (
              <div className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </div>
            )}

            {verificationStatus === 'error' && email && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                {isResending ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
                <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            )}

            {verificationStatus === 'success' && !role && (
              <Link
                href="/auth/login"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>Continue to Login</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}

            {(verificationStatus === 'error' || verificationStatus === 'expired') && (
              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Try Signing Up Again</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>Back to Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-primary hover:text-primary-dark underline"
                >
                  resend verification email
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}