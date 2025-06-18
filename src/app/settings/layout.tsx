'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Profile', href: '/settings/profile', icon: UserIcon },
  { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
  { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? 'text-indigo-500 dark:text-indigo-400'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <main className="mt-8 lg:mt-0 lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
} 