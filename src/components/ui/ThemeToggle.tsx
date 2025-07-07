'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const themeOptions = [
  { value: 'light' as const, label: 'Light', icon: SunIcon },
  { value: 'dark' as const, label: 'Dark', icon: MoonIcon },
  { value: 'system' as const, label: 'System', icon: ComputerDesktopIcon },
];

export default function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = themeOptions.find(option => option.value === theme);
  const CurrentIcon = currentOption?.icon || SunIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Theme selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        <ChevronDownIcon 
          className={`w-3 h-3 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          
          {theme === 'system' && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                {effectiveTheme === 'dark' ? (
                  <MoonIcon className="w-3 h-3" />
                ) : (
                  <SunIcon className="w-3 h-3" />
                )}
                <span>Using {effectiveTheme}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 