'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Dashboard, DashboardHeader, DashboardContent } from '@/components/ui/Dashboard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ShoppingCart, 
  Star, 
  Package, 
  AlertCircle,
  ArrowLeft,
  Home,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { formatDate } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Notification['type']>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'product':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'sale':
        return '/sales';
      case 'product':
        return notification.data?.productId ? `/products/${notification.data.productId}` : '/products';
      case 'review':
        return notification.data?.productId ? `/products/${notification.data.productId}` : '/products';
      default:
        return '/dashboard/seller';
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
      toast.success('Notification marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleRefresh = async () => {
    await refreshNotifications();
    toast.success('Notifications refreshed');
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) || 
      (filter === 'read' && notification.isRead);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesFilter && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <Dashboard>
        <DashboardHeader
          title="Notifications"
          description="Stay updated with your product sales, reviews, and system updates"
          actions={
            <div className="flex items-center gap-3">
              <Link href="/dashboard/seller" className="btn btn-outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <Button
                variant="outline"
                onClick={handleRefresh}
                leftIcon={<Bell className="h-4 w-4" />}
              >
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  onClick={handleMarkAllAsRead}
                  leftIcon={<CheckCheck className="h-4 w-4" />}
                >
                  Mark All Read
                </Button>
              )}
            </div>
          }
        />

        <DashboardContent>
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/dashboard/seller" className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">Notifications</span>
            </nav>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Notifications</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{notifications.length}</h3>
                  </div>
                  <Bell className="h-8 w-8 text-primary-500" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{unreadCount}</h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Read</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{notifications.length - unreadCount}</h3>
                  </div>
                  <Check className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="card-content">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === 'all' 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === 'unread' 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === 'read' 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Read ({notifications.length - unreadCount})
                  </button>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Types</option>
                    <option value="sale">Sales</option>
                    <option value="review">Reviews</option>
                    <option value="product">Products</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="card">
            <div className="card-content">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Link
                      key={notification._id}
                      href={getNotificationLink(notification)}
                      onClick={() => handleMarkAsRead(notification)}
                      className={`block p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-200 hover:shadow-md ${
                        !notification.isRead 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`text-lg font-medium ${
                              !notification.isRead 
                                ? 'text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              notification.type === 'sale' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              notification.type === 'review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              notification.type === 'product' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${
                            !notification.isRead 
                              ? 'text-gray-800 dark:text-gray-200' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMarkAsRead(notification);
                              }}
                              leftIcon={<Check className="h-3 w-3" />}
                            >
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {filter === 'all' 
                      ? "You'll see updates about your products and sales here"
                      : `No ${filter} notifications found`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </DashboardContent>
      </Dashboard>
    </ProtectedRoute>
  );
}