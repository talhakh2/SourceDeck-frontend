'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { Product, apiClient } from '@/lib/api';
import { useHybridAuth } from './HybridAuthContext';
import toast from 'react-hot-toast';

export interface CartItem {
  product: Product;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (productId: string) => boolean;
  refreshCart: () => Promise<void>;
  mergeGuestCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useHybridAuth();

  // Refs to prevent infinite loops
  const itemsRef = useRef<CartItem[]>([]);
  const hasInitializedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Generate cart key based on user
  const cartKey = useMemo(() => {
    if (typeof window === 'undefined') return 'cart';
    
    if (user && user._id) {
      return `cart_${user._id}`;
    }
    
    // For guest users, use session-based key
    let guestKey = localStorage.getItem('guest_session_id');
    if (!guestKey) {
      guestKey = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guest_session_id', guestKey);
    }
    return `cart_${guestKey}`;
  }, [user]);

  // Load cart from localStorage (for guest users or fallback)
  const loadLocalCart = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const cartWithDates = parsedCart
          .map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
          .filter((item: any) => {
            return item.product && 
                   item.product._id && 
                   item.product.title && 
                   typeof item.product.price === 'number' && 
                   !isNaN(item.product.price);
          });
        setItems(cartWithDates);
        itemsRef.current = cartWithDates;
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
      localStorage.removeItem(cartKey);
    }
  }, [cartKey]);

  // Save cart to localStorage
  const saveLocalCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }, [cartKey]);

  // Load cart from database (for authenticated users)
  const loadDatabaseCart = useCallback(async () => {
    if (!user || user.role !== 'buyer' || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.getCart();
      
      if (response.success && response.data?.cart) {
        const dbCart = response.data.cart;
        const dbItems = dbCart.items
          .map((item: any) => ({
            product: item.productId, // Backend populates this as productId
            addedAt: new Date(item.addedAt)
          }))
          .filter((item: any) => {
            return item.product && 
                   item.product._id && 
                   item.product.title && 
                   typeof item.product.price === 'number' && 
                   !isNaN(item.product.price);
          });
        setItems(dbItems);
        itemsRef.current = dbItems;
        saveLocalCart(dbItems); // Sync to localStorage
      }
    } catch (error) {
      console.error('Error loading database cart:', error);
      console.error('Error details:', error.response || error.message);
      // Fallback to local cart
      loadLocalCart();
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, saveLocalCart, loadLocalCart]);

  // Initialize cart on mount and user changes - FIXED to prevent infinite loops
  useEffect(() => {
    const currentUserId = user?._id || null;
    
    // Only initialize if user changed or first time
    if (currentUserId !== lastUserIdRef.current || !hasInitializedRef.current) {
      lastUserIdRef.current = currentUserId;
      hasInitializedRef.current = true;
      
      if (user && user.role === 'buyer') {
        loadDatabaseCart();
      } else {
        loadLocalCart();
      }
      setIsLoaded(true);
    }
  }, [user?._id, user?.role]); // Only depend on user ID and role

  // Save to localStorage whenever items change (for guest users) - FIXED
  useEffect(() => {
    if (isLoaded && (!user || user.role !== 'buyer')) {
      saveLocalCart(itemsRef.current);
    }
  }, [items, isLoaded, user?.role, saveLocalCart]); // Removed user dependency

  // Listen for cart updates from other tabs
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const { items: newItems, cartKey: eventCartKey } = event.detail;
      if (eventCartKey === cartKey) {
        setItems(newItems);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
      };
    }
  }, [cartKey]);

  // Broadcast cart changes to other tabs
  const broadcastCartUpdate = useCallback((cartItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { items: cartItems, cartKey } 
      }));
    }
  }, [cartKey]);

  const addItem = async (product: Product) => {
    // Check if item already exists
    const existingItem = itemsRef.current.find(item => item.product._id === product._id);
    if (existingItem) {
      toast.error(`${product.title} is already in your cart`, {
        duration: 2000,
        icon: '⚠️',
      });
      return;
    }

    const newItem = { product, addedAt: new Date() };
    const newItems = [...itemsRef.current, newItem];
    setItems(newItems);
    itemsRef.current = newItems;

    // If user is authenticated, sync with database
    if (user && user.role === 'buyer') {
      try {
        console.log('Adding item to database cart:', product._id);
        console.log('User:', user);
        console.log('User ID:', user._id);
        console.log('User role:', user.role);
        console.log('Auth token:', localStorage.getItem('authToken'));
        
        // Check if token exists and is valid format
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found in localStorage');
          toast.error('Authentication token not found. Please login again.');
          return;
        }
        
        // Decode token to check if it's valid (basic check)
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            console.error('Invalid token format');
            toast.error('Invalid authentication token. Please login again.');
            return;
          }
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
        } catch (tokenError) {
          console.error('Error decoding token:', tokenError);
          toast.error('Invalid authentication token. Please login again.');
          return;
        }
        
        const response = await apiClient.addToCart(product._id);
        console.log('Add to cart response:', response);
        
        // Database cart will be updated, no need to update local state
      } catch (error) {
        console.error('Error adding item to database cart:', error);
        console.error('Error details:', error.response || error.message);
        toast.error('Failed to add item to cart. Please try again.');
        // Revert local state
        setItems(itemsRef.current);
        return;
      }
    }

    toast.success(`Added ${product.title} to cart`, {
      duration: 2000,
      icon: '✅',
    });
    
    // Show cart briefly when item is added
    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 2000);
    
    // Broadcast update
    broadcastCartUpdate(newItems);
  };

  const removeItem = async (productId: string) => {
    const itemToRemove = itemsRef.current.find(item => item.product._id === productId);
    if (!itemToRemove) return;

    const newItems = itemsRef.current.filter(item => item.product._id !== productId);
    setItems(newItems);
    itemsRef.current = newItems;

    // If user is authenticated, sync with database
    if (user && user.role === 'buyer') {
      try {
        await apiClient.removeFromCart(productId);
      } catch (error) {
        console.error('Error removing item from database cart:', error);
        toast.error('Failed to remove item from cart. Please try again.');
        // Revert local state
        setItems(itemsRef.current);
        return;
      }
    }

    toast.success(`Removed ${itemToRemove.product.title} from cart`, {
      duration: 2000,
      icon: '🗑️',
    });
    
    // Broadcast update
    broadcastCartUpdate(newItems);
  };

  const clearCart = async () => {
    const previousItems = itemsRef.current;
    setItems([]);
    itemsRef.current = [];

    // If user is authenticated, sync with database
    if (user && user.role === 'buyer') {
      try {
        await apiClient.clearCart();
      } catch (error) {
        console.error('Error clearing database cart:', error);
        toast.error('Failed to clear cart. Please try again.');
        // Revert local state
        setItems(previousItems);
        itemsRef.current = previousItems;
        return;
      }
    }

    toast.success('Cart cleared successfully', {
      duration: 2000,
      icon: '🧹',
    });
    
    // Broadcast update
    broadcastCartUpdate([]);
  };

  const refreshCart = async () => {
    if (user && user.role === 'buyer') {
      await loadDatabaseCart();
    }
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const isInCart = (productId: string) => {
    return itemsRef.current.some(item => item.product._id === productId);
  };

  const mergeGuestCart = useCallback(() => {
    try {
      // Find all guest cart keys
      const guestKeys = Object.keys(localStorage).filter(key => key.startsWith('cart_guest_'));
      
      if (guestKeys.length > 0) {
        let mergedItems: CartItem[] = [...itemsRef.current];
        
        guestKeys.forEach(guestKey => {
          const guestCart = localStorage.getItem(guestKey);
          if (guestCart) {
            const guestItems = JSON.parse(guestCart);
            const guestItemsWithDates = guestItems.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt)
            }));
            
            guestItemsWithDates.forEach((guestItem: CartItem) => {
              const existingItem = mergedItems.find(item => item.product._id === guestItem.product._id);
              if (!existingItem) {
                // Add new item only if it doesn't exist
                mergedItems.push(guestItem);
              }
            });
            
            // Clear this guest cart
            localStorage.removeItem(guestKey);
          }
        });
        
        // Clear guest session ID
        localStorage.removeItem('guest_session_id');
        
        setItems(mergedItems);
        itemsRef.current = mergedItems;
        
        // If user is authenticated, sync merged cart to database
        if (user && user.role === 'buyer') {
          const itemsToSync = mergedItems.map(item => ({
            productId: item.product._id,
            addedAt: item.addedAt
          }));
          
          apiClient.syncCart(itemsToSync).catch(error => {
            console.error('Error syncing merged cart:', error);
          });
        }
        
        toast.success('Cart items merged successfully!', {
          duration: 3000,
          icon: '🛒',
        });
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  }, [user]);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (typeof price === 'number' ? price : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isOpen,
        isLoaded,
        isLoading,
        addItem,
        removeItem,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        isInCart,
        refreshCart,
        mergeGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}