'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired' | 'already-verified'>('pending');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerificationEmail, completeRegistration } = useHybridAuth();
  
  const token = searchParams.get('token');
  const role = searchParams.get('role') as 'Buyer' | 'Seller' | null;
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && !hasAttemptedVerification) {
      handleEmailVerification(token);
      setHasAttemptedVerification(true);
    }
  }, [token, hasAttemptedVerification]);

  // Countdown effect for redirect
  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [redirectCountdown]);

  // Timeout effect to prevent stuck verification
  useEffect(() => {
    if (isVerifying && hasAttemptedVerification) {
      const timeout = setTimeout(() => {
        if (verificationStatus === 'pending') {
          setVerificationStatus('error');
          setError('Verification is taking longer than expected. Please try resending the verification email.');
          setIsVerifying(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isVerifying, hasAttemptedVerification, verificationStatus]);

  const handleEmailVerification = async (verificationToken: string) => {
    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyEmail(verificationToken);
      
      if (result.success) {
        // Check if the message indicates email was already verified
        if (result.message?.includes('already verified') || result.message?.includes('Email already verified')) {
          setVerificationStatus('already-verified');
          setRedirectCountdown(3);
          // Clear stored email since verification is already complete
          localStorage.removeItem('pendingVerificationEmail');
          sessionStorage.removeItem('pendingVerificationEmail');
          // Still redirect after showing the message
          setTimeout(() => {
            if (result.data?.user?.role) {
              const userRole = result.data.user.role;
              if (userRole === 'buyer') {
                router.push('/dashboard/provider');
              } else if (userRole === 'seller') {
                router.push('/dashboard/seller');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          }, 3000);
        } else {
          setVerificationStatus('success');
          setRedirectCountdown(2);
          // Clear stored email since verification is successful
          localStorage.removeItem('pendingVerificationEmail');
          sessionStorage.removeItem('pendingVerificationEmail');
          // For successful verification, redirect after a short delay
          setTimeout(() => {
            if (result.data?.user?.role) {
              const userRole = result.data.user.role;
              if (userRole === 'buyer') {
                router.push('/dashboard/provider');
              } else if (userRole === 'seller') {
                router.push('/dashboard/seller');
              } else {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          }, 2000);
        }
      } else {
        // Handle different error scenarios
        const errorMessage = result.message || 'Email verification failed';
        
        if (errorMessage.includes('Invalid or expired') || errorMessage.includes('expired')) {
          setVerificationStatus('expired');
          setError('This verification link has expired or is invalid. Please request a new one.');
        } else if (errorMessage.includes('already exists') || errorMessage.includes('already verified')) {
          setVerificationStatus('already-verified');
          setError('This email has already been verified. You can now log in.');
          setRedirectCountdown(3);
          // Redirect after showing the message
          setTimeout(() => {
            const userRole = role?.toLowerCase();
            if (userRole === 'buyer') {
              router.push('/dashboard/provider');
            } else if (userRole === 'seller') {
              router.push('/dashboard/seller');
            } else {
              router.push('/');
            }
          }, 3000);
        } else {
          setVerificationStatus('error');
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    console.log('Resend button clicked!');
    console.log('Email from URL:', email);
    console.log('localStorage email:', localStorage.getItem('pendingVerificationEmail'));
    console.log('sessionStorage email:', sessionStorage.getItem('pendingVerificationEmail'));
    
    // Try to get email from multiple sources
    let emailToUse = email; // From URL params
    
    if (!emailToUse) {
      // Try to get from localStorage (stored during registration)
      emailToUse = localStorage.getItem('pendingVerificationEmail');
    }
    
    if (!emailToUse) {
      // Try to get from sessionStorage
      emailToUse = sessionStorage.getItem('pendingVerificationEmail');
    }
    
    console.log('Email to use:', emailToUse);
    
    if (!emailToUse) {
      setError('Unable to find your email address. Please try signing up again.');
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      console.log('Calling resendVerificationEmail with:', emailToUse);
      const result = await resendVerificationEmail(emailToUse);
      console.log('Resend result:', result);
      
      if (result.success) {
        setResendSuccess(true);
        setVerificationStatus('pending'); // Reset to pending state
        setHasAttemptedVerification(false); // Allow retry
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(result.message || 'Failed to resend verification email');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
      case 'already-verified':
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
            : 'Your email has been verified successfully! Redirecting you to your dashboard...'
        };
      case 'already-verified':
        return {
          title: 'Email Already Verified!',
          message: 'Your email has already been verified. Redirecting you to your dashboard...'
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

          {/* Debug Info */}
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Email from URL: {email || 'None'}</p>
            <p>Verification Status: {verificationStatus}</p>
            <p>Is Verifying: {isVerifying ? 'Yes' : 'No'}</p>
            <p>Has Attempted: {hasAttemptedVerification ? 'Yes' : 'No'}</p>
            <p>localStorage email: {typeof window !== 'undefined' ? localStorage.getItem('pendingVerificationEmail') || 'None' : 'N/A'}</p>
          </div>

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
            {/* Test button to verify click functionality */}
            <button
              onClick={() => {
                console.log('Test button clicked!');
                alert('Test button works!');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Test Button (Click to verify button works)
            </button>

            {/* Always show resend button */}
            {verificationStatus !== 'success' && verificationStatus !== 'already-verified' && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {isResending ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="h-5 w-5" />
                )}
                <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            )}

            {(verificationStatus === 'success' || verificationStatus === 'already-verified') && redirectCountdown > 0 && (
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-500">
                  Redirecting to your dashboard in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                </div>
                <button
                  onClick={() => {
                    const userRole = role?.toLowerCase();
                    if (userRole === 'buyer') {
                      router.push('/dashboard/provider');
                    } else if (userRole === 'seller') {
                      router.push('/dashboard/seller');
                    } else {
                      router.push('/');
                    }
                  }}
                  className="text-sm text-primary hover:text-primary-dark underline"
                >
                  Continue now
                </button>
              </div>
            )}

            {/* Show resend button for error, expired, or when stuck on pending */}
            {(verificationStatus === 'error' || verificationStatus === 'expired' || 
              (verificationStatus === 'pending' && !isVerifying && hasAttemptedVerification)) && email && (
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

            {/* Show resend button for pending state with helpful message */}
            {verificationStatus === 'pending' && !isVerifying && hasAttemptedVerification && (
              <div className="text-center text-sm text-gray-500 mb-4">
                Didn't receive the email? Check your spam folder or resend the verification email.
              </div>
            )}

            {/* Show helpful message when no email is available for resend */}
            {!email && (verificationStatus === 'error' || verificationStatus === 'expired') && (
              <div className="text-center text-sm text-gray-500 mb-4">
                If you didn't receive the verification email, please try signing up again or contact support.
              </div>
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
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
            {email && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full btn-outline flex items-center justify-center space-x-2 text-sm"
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}