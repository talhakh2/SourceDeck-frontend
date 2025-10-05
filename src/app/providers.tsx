'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import { HybridAuthProvider } from '@/contexts/HybridAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MiniCart } from '@/components/cart/MiniCart';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HybridAuthProvider>
          <NotificationProvider>
            <PurchaseProvider>
              <CartProvider>
                <AppProvider>
                  {children}
                  <MiniCart />
                  {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
                </AppProvider>
              </CartProvider>
            </PurchaseProvider>
          </NotificationProvider>
        </HybridAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
