// Mock notification data for development/testing
import { Notification } from '@/contexts/NotificationContext';

export const mockNotifications: Notification[] = [
  {
    _id: '1',
    type: 'sale',
    title: 'New Sale! 🎉',
    message: 'Your product "Amazon FBA Product Research" was purchased by John Doe for $29.99',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    data: {
      productId: 'product-1',
      saleId: 'sale-1'
    }
  },
  {
    _id: '2',
    type: 'review',
    title: 'New Review Received',
    message: 'Sarah Johnson left a 5-star review for "E-commerce Product Analysis"',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    data: {
      productId: 'product-2',
      reviewId: 'review-1'
    }
  },
  {
    _id: '3',
    type: 'product',
    title: 'Product Performance Update',
    message: 'Your product "Dropshipping Research Guide" received 15 new views today',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    data: {
      productId: 'product-3'
    }
  },
  {
    _id: '4',
    type: 'sale',
    title: 'Payment Processed',
    message: 'Payment of $49.99 has been processed for "Advanced Market Research"',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    data: {
      productId: 'product-4',
      saleId: 'sale-2'
    }
  },
  {
    _id: '5',
    type: 'system',
    title: 'Welcome to Sellables!',
    message: 'Your seller account has been activated. Start by creating your first product listing.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    data: {}
  },
  {
    _id: '6',
    type: 'product',
    title: 'Product Featured',
    message: 'Your product "Shopify Store Optimization" was featured in the marketplace homepage',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    data: {
      productId: 'product-5'
    }
  }
];

// Function to generate random notifications for testing
export const generateRandomNotification = (): Notification => {
  const types: Notification['type'][] = ['sale', 'review', 'product', 'system'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  const titles = {
    sale: ['New Sale! 🎉', 'Payment Received', 'Order Completed'],
    review: ['New Review Received', '5-Star Review!', 'Customer Feedback'],
    product: ['Product Performance Update', 'Views Increased', 'Product Featured'],
    system: ['System Update', 'Account Update', 'Feature Available']
  };
  
  const messages = {
    sale: [
      'Your product was purchased for $29.99',
      'Payment of $49.99 has been processed',
      'New order received for your product'
    ],
    review: [
      'Customer left a 5-star review',
      'New review received for your product',
      'Great feedback from a buyer'
    ],
    product: [
      'Your product received 15 new views today',
      'Product performance has improved',
      'Your listing is trending'
    ],
    system: [
      'New feature available in your dashboard',
      'System maintenance completed',
      'Your account has been updated'
    ]
  };
  
  return {
    _id: `mock_${Date.now()}_${Math.random()}`,
    type: randomType,
    title: titles[randomType][Math.floor(Math.random() * titles[randomType].length)],
    message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
    isRead: Math.random() > 0.3, // 70% chance of being read
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
    data: {
      productId: `product_${Math.floor(Math.random() * 10)}`,
      saleId: randomType === 'sale' ? `sale_${Math.floor(Math.random() * 10)}` : undefined,
      reviewId: randomType === 'review' ? `review_${Math.floor(Math.random() * 10)}` : undefined
    }
  };
};
