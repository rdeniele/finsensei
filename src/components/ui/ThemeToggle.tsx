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
        className="flex items-center space-x-1 p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
        aria-label="Theme selector"
        aria-expanded={isOpen}
        aria-haspopup="true"
        data-theme-toggle
      >
        <CurrentIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        <ChevronDownIcon 
          className={`w-3 h-3 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 z-50 overflow-hidden">
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300'
                  }`}
                  data-theme-button
                >
                  <Icon className={`w-4 h-4 ${
                    isSelected 
                      ? 'text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`} />
                  <span className="flex-1 text-left font-medium">{option.label}</span>
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
          
          {theme === 'system' && (
            <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-750">
              <div className="flex items-center space-x-2 text-xs font-medium text-gray-700 dark:text-gray-200">
                {effectiveTheme === 'dark' ? (
                  <MoonIcon className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                ) : (
                  <SunIcon className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
                )}
                <span>Currently: {effectiveTheme} mode</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 