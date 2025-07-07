'use client';

import { useTheme } from '@/lib/theme';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function ThemeDemo() {
  const { theme, effectiveTheme, setTheme } = useTheme();

  const themes = [
    { 
      value: 'light' as const, 
      label: 'Light Mode', 
      icon: SunIcon,
      description: 'Clean and bright interface'
    },
    { 
      value: 'dark' as const, 
      label: 'Dark Mode', 
      icon: MoonIcon,
      description: 'Easy on the eyes for low-light conditions'
    },
    { 
      value: 'system' as const, 
      label: 'System Mode', 
      icon: ComputerDesktopIcon,
      description: 'Follows your device preferences automatically'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Theme System Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Current theme: <span className="font-semibold">{theme}</span>
          {theme === 'system' && (
            <span className="ml-2 text-sm">
              (using {effectiveTheme})
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;
          
          return (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-3">
                <div className={`p-3 rounded-full ${
                  isSelected 
                    ? 'bg-blue-100 dark:bg-blue-800' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                
                <div className="text-center">
                  <h3 className={`font-semibold ${
                    isSelected 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {themeOption.label}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isSelected 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {themeOption.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Theme Features:
        </h3>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>• Automatic system preference detection</li>
          <li>• Persistent theme selection across sessions</li>
          <li>• Smooth transitions between themes</li>
          <li>• Real-time system theme change detection</li>
          <li>• Accessible dropdown theme selector in navbar</li>
        </ul>
      </div>
    </div>
  );
}
