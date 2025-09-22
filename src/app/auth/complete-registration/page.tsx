'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OldCompleteRegistrationRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get role from URL params and redirect to appropriate signup page
    const role = searchParams.get('role');
    
    if (role === 'seller') {
      router.replace('/signup/seller');
    } else if (role === 'buyer') {
      router.replace('/signup/buyer');
    } else {
      // Default to role selection page
      router.replace('/signup');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Redirecting to signup...</p>
      </div>
    </div>
  );
}
