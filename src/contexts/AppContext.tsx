'use client';

import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useHybridAuth } from './HybridAuthContext';
import { useCart } from './CartContext';

interface AppContextType {
  // This context combines auth and cart functionality
  // and handles cart merging when user logs in
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useHybridAuth();
  const { mergeGuestCart } = useCart();

  // Refs to prevent infinite loops
  const hasMergedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Merge guest cart when user logs in - FIXED to prevent infinite loops
  useEffect(() => {
    const currentUserId = user?._id || null;
    
    // Only merge if user changed and we haven't merged for this user yet
    if (user && currentUserId !== lastUserIdRef.current && !hasMergedRef.current) {
      lastUserIdRef.current = currentUserId;
      hasMergedRef.current = true;
      
      // Small delay to ensure cart context is ready
      const timer = setTimeout(() => {
        mergeGuestCart();
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Reset merge flag when user logs out
    if (!user) {
      hasMergedRef.current = false;
      lastUserIdRef.current = null;
    }
  }, [user?._id, mergeGuestCart]);

  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
