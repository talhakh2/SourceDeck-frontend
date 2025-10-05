'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';

/**
 * Theme toggle component with dropdown for theme selection
 */
export function ThemeToggle() {
  const themeContext = useTheme();
  
  // Handle case where context might not be fully initialized
  if (!themeContext) {
    return null;
  }
  
  const { theme, resolvedTheme, setTheme, toggleTheme } = themeContext;

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="relative group">
      {/* Quick toggle button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      >
        {resolvedTheme === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </Button>

      {/* Theme selection dropdown */}
      <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" role="menu" aria-label="Theme selection">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            role="menuitem"
            aria-checked={theme === value}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${
              theme === value
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {theme === value && (
              <div className="ml-auto w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Simple theme toggle button without dropdown
 */
export function SimpleThemeToggle() {
  const themeContext = useTheme();
  
  // Handle case where context might not be fully initialized
  if (!themeContext) {
    return null;
  }
  
  const { resolvedTheme, toggleTheme } = themeContext;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {resolvedTheme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  );
}
