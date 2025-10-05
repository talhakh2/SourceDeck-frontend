'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  TrendingUp, 
  Package, 
  Plus,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useHybridAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();

  // Close mobile nav when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Determine active tab based on current path
  useEffect(() => {
    if (pathname === '/') setActiveTab('home');
    else if (pathname.startsWith('/products')) setActiveTab('search');
    else if (pathname.startsWith('/cart')) setActiveTab('cart');
    else if (pathname.startsWith('/dashboard')) setActiveTab('dashboard');
  }, [pathname]);

  const getNavigation = () => {
    if (user) {
      if (user.role === 'seller') {
        return [
          { name: 'Dashboard', href: '/dashboard/seller', icon: Home },
          { name: 'My Products', href: '/products', icon: Package },
          { name: 'My Sales', href: '/sales', icon: ShoppingCart },
        ];
      } else {
        return [
          { name: 'Dashboard', href: '/dashboard/provider', icon: TrendingUp },
          { name: 'My Purchases', href: '/dashboard/provider?tab=purchases', icon: Package },
        ];
      }
    }
    return [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Browse Products', href: '/products/browse', icon: Search },
      { name: 'How It Works', href: '/how-it-works', icon: TrendingUp },
    ];
  };

  const navigation = getNavigation();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn('md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors', className)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Navigation Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full mt-1">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{item.name}</span>
                        {item.name === 'Cart' && totalItems > 0 && (
                          <span className="ml-auto px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Additional Actions */}
                {user && (
                  <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link
                      href="/notifications"
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Bell className="w-5 h-5" />
                      <span>Notifications</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}

                {/* Auth Links for non-logged in users */}
                {!user && (
                  <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Bottom navigation bar for mobile
 */
export function BottomNav({ className }: { className?: string }) {
  const { user } = useHybridAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();

  const getBottomNavItems = () => {
    if (user) {
      if (user.role === 'seller') {
        return [
          { name: 'Dashboard', href: '/dashboard/seller', icon: TrendingUp },
          { name: 'Products', href: '/products', icon: Search },
          { name: 'Create', href: '/products/create', icon: Plus },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      } else {
        return [
          { name: 'Browse', href: '/products', icon: Search },
          { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: totalItems },
          { name: 'Dashboard', href: '/dashboard/provider', icon: TrendingUp },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      }
    }
    return [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Products', href: '/products', icon: Search },
      { name: 'How It Works', href: '/how-it-works', icon: TrendingUp },
      { name: 'Sign In', href: '/auth/login', icon: User },
    ];
  };

  const items = getBottomNavItems();

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden', className)}>
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
