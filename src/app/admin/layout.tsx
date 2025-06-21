'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const ADMIN_EMAILS = ['rondenielep13@gmail.com', 'work.rparagoso@gmail.com'];

const navigation = [
  { name: 'Overview', href: '/admin', icon: ChartBarIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Coin Management', href: '/admin/coins', icon: CurrencyDollarIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      if (!ADMIN_EMAILS.includes(user.email || '')) {
        router.push('/');
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </Link>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>Logged in as:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              <Link
                href="/admin"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Overview
              </Link>
              <Link
                href="/admin/analytics"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Analytics
              </Link>
              <Link
                href="/admin/users"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Users
              </Link>
              <Link
                href="/admin/coins"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Coin Management
              </Link>
              <Link
                href="/admin/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 