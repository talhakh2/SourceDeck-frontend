'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useHybridAuth } from './HybridAuthContext';
import { apiClient } from '@/lib/api';
import { mockNotifications, generateRandomNotification } from '@/lib/mockNotifications';

export interface Notification {
  _id: string;
  type: 'sale' | 'review' | 'product' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    productId?: string;
    saleId?: string;
    reviewId?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, '_id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useHybridAuth();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use mock data for development
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotifications(mockNotifications);
        return;
      }
      
      const response = await apiClient.request<{ data: Notification[] }>('/notifications');
      if (response.success && response.data) {
        setNotifications(response.data.data);
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      // Fallback to mock data in case of API error
      if (process.env.NODE_ENV === 'development') {
        setNotifications(mockNotifications);
      } else {
        setError(err.message || 'Failed to fetch notifications');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // For development, just update local state
      if (process.env.NODE_ENV === 'development') {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
        return;
      }
      
      const response = await apiClient.request(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // For development, just update local state
      if (process.env.NODE_ENV === 'development') {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        return;
      }
      
      const response = await apiClient.request('/notifications/read-all', {
        method: 'PUT'
      });
      
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const addNotification = (notification: Omit<Notification, '_id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      _id: `temp_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
