'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new signup page
    router.replace('/signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Redirecting to new signup page...</p>
      </div>
    </div>
  );
}
