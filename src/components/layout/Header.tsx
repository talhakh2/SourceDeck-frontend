'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, ShoppingCart, Bell, LogOut, Settings, Package, TrendingUp, Plus, Home, BarChart3 } from 'lucide-react';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileNav } from '@/components/ui/MobileNav';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useHybridAuth();
  const { totalItems, openCart } = useCart();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
      if (!target.closest('[data-notification-menu]')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          { name: 'My Purchases', href: '/dashboard/provider?tab=purchases', icon: ShoppingCart },
        ];
      }
    }
    return [
      { name: 'Browse Products', href: '/products/browse' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'About', href: '/about' },
    ];
  };

  // Check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/dashboard/seller') {
      return pathname === '/dashboard/seller' || pathname === '/analytics';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navigation = getNavigation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover-lift group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-marketplace-va rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">
                Sellables
              </span>
            </Link>

            {/* Desktop Navigation - Left Side */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = 'icon' in item ? item.icon : null;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl ${
                      active
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-200 dark:hover:border-primary-800'
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent className={`w-4 h-4 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                    )}
                    <span>{item.name}</span>
                    {active && (
                      <div className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side - Actions & User Menu */}
          <div className="flex items-center space-x-1">
            {/* Search Bar - Available for all users */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search products, categories..."
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all duration-200 shadow-sm ${
                      isSearchFocused 
                        ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-gray-400 dark:hover:border-gray-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                  />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* Theme toggle */}
              <ThemeToggle />

              {/* Search button for mobile - available for all users */}
              <button 
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) {
                    searchInput.focus();
                  }
                }}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications - only show for authenticated users */}
              {user && (
                <div className="relative" data-notification-menu>
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative transition-all duration-200 group"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                  >
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDropdown 
                    isOpen={isNotificationOpen} 
                    onClose={() => setIsNotificationOpen(false)} 
                  />
                </div>
              )}

              {/* Cart - only show for buyers */}
              {user && user.role === 'buyer' && (
                <button 
                  onClick={openCart}
                  className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl relative transition-all duration-200 group border border-transparent hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
              )}

              {/* Quick action button for buyers only */}
              {user && user.role === 'buyer' && (
                <Link
                  href="/products"
                  className="hidden sm:flex items-center space-x-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transform border border-green-500/20"
                  title="Browse Products"
                >
                  <Package className="w-4 h-4" />
                  <span>Browse</span>
                </Link>
              )}

              {/* User menu */}
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  aria-label="User menu"
                >
                  {user ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="hidden md:block text-sm font-medium">{user.name || 'User'}</span>
                    </>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name || 'User'}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full mt-1">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href={user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller'}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
                            Dashboard
                          </Link>
                          
                          {user.role === 'seller' && (
                            <>
                              <Link
                                href="/analytics"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
                                Analytics
                              </Link>
                              <Link
                                href="/products/create"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Plus className="w-4 h-4 mr-3 text-gray-400" />
                                Create Product
                              </Link>
                            </>
                          )}
                          
                          <Link
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3 text-gray-400" />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="text-center">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Welcome to Sellables</p>
                            <p className="text-xs text-gray-500">Sign in to access your account</p>
                          </div>
                          
                          <div className="py-2">
                            <Link
                              href="/auth/login"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4 mr-3 text-gray-400" />
                              Sign In
                            </Link>
                            <Link
                              href="/auth/register"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Plus className="w-4 h-4 mr-3 text-gray-400" />
                              Create Account
                            </Link>
                          </div>
                          
                          <div className="border-t border-gray-100 py-2">
                            <Link
                              href="/auth/register/seller"
                              className="flex items-center px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <TrendingUp className="w-4 h-4 mr-3" />
                              Become a Seller
                            </Link>
                            <Link
                              href="/auth/register/buyer"
                              className="flex items-center px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-3" />
                              Start Buying
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation for Sellers */}
            {user && user.role === 'seller' && (
              <div className="md:hidden flex items-center space-x-1">
                {navigation.map((item) => {
                  const IconComponent = 'icon' in item ? item.icon : null;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                      title={item.name}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" />}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Mobile menu button */}
            <MobileNav />
          </div>
        </div>

        {/* Mobile Search Bar - available for all users */}
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="mobile-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-primary-600 hover:text-primary-700 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

      </div>
    </header>
  );
}