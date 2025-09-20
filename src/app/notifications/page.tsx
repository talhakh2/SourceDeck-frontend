'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  EyeOff,
  ShoppingCart,
  CreditCard,
  Package,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';

interface Notification {
  _id: string;
  type: 'purchase' | 'sale' | 'message' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Replace with actual API call
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          type: 'purchase',
          title: 'Purchase Successful',
          message: 'You have successfully purchased "High-ROI Kitchen Gadget Research" for $99.99. You now have full access to all details.',
          timestamp: '2024-01-15T10:30:00Z',
          isRead: false,
          actionUrl: '/products/prod1',
          actionText: 'View Product',
          priority: 'high'
        },
        {
          _id: '2',
          type: 'sale',
          title: 'New Sale!',
          message: 'Your product "SaaS Market Analysis" was purchased by John Smith for $149.99.',
          timestamp: '2024-01-15T09:15:00Z',
          isRead: false,
          actionUrl: '/dashboard/provider',
          actionText: 'View Dashboard',
          priority: 'high'
        },
        {
          _id: '3',
          type: 'message',
          title: 'New Message',
          message: 'You received a new message from Sarah Johnson regarding your product listing.',
          timestamp: '2024-01-15T08:45:00Z',
          isRead: true,
          actionUrl: '/messages',
          actionText: 'View Message',
          priority: 'medium'
        },
        {
          _id: '4',
          type: 'system',
          title: 'Profile Update Required',
          message: 'Please complete your profile information to improve your visibility on our platform.',
          timestamp: '2024-01-14T16:20:00Z',
          isRead: true,
          actionUrl: '/profile/edit',
          actionText: 'Update Profile',
          priority: 'medium'
        },
        {
          _id: '5',
          type: 'promotion',
          title: 'Special Offer',
          message: 'Get 20% off your next purchase! Use code SAVE20 at checkout. Offer expires in 3 days.',
          timestamp: '2024-01-14T14:00:00Z',
          isRead: true,
          actionUrl: '/products',
          actionText: 'Shop Now',
          priority: 'low'
        },
        {
          _id: '6',
          type: 'system',
          title: 'Payment Method Updated',
          message: 'Your payment method has been successfully updated.',
          timestamp: '2024-01-13T11:30:00Z',
          isRead: true,
          priority: 'low'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsUnread = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="h-5 w-5 text-green-600" />;
      case 'sale':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      case 'promotion':
        return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-gray-300';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Notifications
              </h1>
              <p className="mt-2 text-gray-600">
                Stay updated with your account activity and platform updates
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-outline btn-sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'unread'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'read'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </nav>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`card border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="card-content">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{formatTimestamp(notification.timestamp)}</span>
                              <span className="capitalize">{notification.type}</span>
                              <span className="capitalize">{notification.priority} priority</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {notification.actionUrl && notification.actionText && (
                              <a
                                href={notification.actionUrl}
                                className="btn btn-primary btn-sm"
                              >
                                {notification.actionText}
                              </a>
                            )}
                            
                            <div className="flex items-center gap-1">
                              {notification.isRead ? (
                                <button
                                  onClick={() => markAsUnread(notification._id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Mark as unread"
                                >
                                  <EyeOff className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Mark as read"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteNotification(notification._id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="Delete notification"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {filter === 'unread' ? 'No unread notifications' : 
                 filter === 'read' ? 'No read notifications' : 
                 'No notifications yet'}
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filter === 'unread' ? 'You\'re all caught up! New notifications will appear here.' :
                 filter === 'read' ? 'You haven\'t read any notifications yet.' :
                 'You\'ll receive notifications about your account activity, purchases, and platform updates here.'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="btn btn-primary"
                >
                  View All Notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
