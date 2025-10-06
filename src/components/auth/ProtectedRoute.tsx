'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHybridAuth } from '@/contexts/HybridAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'buyer' | 'seller';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isEmailVerified } = useHybridAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Check email verification for sensitive routes
      if (!isEmailVerified && (requiredRole || redirectTo !== '/auth/login')) {
        router.push('/auth/verify-email');
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate page based on user role
        if (user.role === 'buyer') {
          router.replace('/products/browse');
        } else {
          router.replace('/dashboard/seller');
        }
        return;
      }
    }
  }, [user, isLoading, isEmailVerified, requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return <>{children}</>;
}
