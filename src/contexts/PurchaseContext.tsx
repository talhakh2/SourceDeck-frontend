'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useHybridAuth } from './HybridAuthContext';
import { apiClient } from '@/lib/api';

interface PurchaseContextType {
  purchasedProducts: Set<string>;
  isPurchased: (productId: string) => boolean;
  checkPurchaseStatus: (productId: string) => Promise<boolean>;
  refreshPurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchasedProducts, setPurchasedProducts] = useState<Set<string>>(new Set());
  const { user } = useHybridAuth();

  // Refs to prevent infinite loops
  const hasInitializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const checkPurchaseStatus = useCallback(async (productId: string): Promise<boolean> => {
    if (!user || user.role !== 'Buyer') return false;
    
    try {
      const response = await apiClient.verifyAccess(productId);
      if (response.success && response.data?.hasAccess) {
        setPurchasedProducts(prev => new Set([...prev, productId]));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }, [user]);

  const refreshPurchases = useCallback(async () => {
    if (!user || user.role !== 'Buyer') return;
    
    try {
      const response = await apiClient.getMyPurchases();
      if (response.success && response.data?.data) {
        const productIds = response.data.data.map((purchase: any) => purchase.productId._id);
        setPurchasedProducts(new Set(productIds));
      }
    } catch (error) {
      console.error('Error refreshing purchases:', error);
    }
  }, [user]);

  const isPurchased = useCallback((productId: string): boolean => {
    return purchasedProducts.has(productId);
  }, [purchasedProducts]);

  // Load purchases when user logs in - FIXED to prevent infinite loops
  useEffect(() => {
    const currentUserId = user?._id || null;
    
    // Only refresh if user changed or first time
    if (currentUserId !== lastUserIdRef.current || !hasInitializedRef.current) {
      lastUserIdRef.current = currentUserId;
      hasInitializedRef.current = true;
      
      if (user && user.role === 'buyer') {
        refreshPurchases();
      } else {
        setPurchasedProducts(new Set());
      }
    }
  }, [user?._id, user?.role, refreshPurchases]);

  return (
    <PurchaseContext.Provider
      value={{
        purchasedProducts,
        isPurchased,
        checkPurchaseStatus,
        refreshPurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}
