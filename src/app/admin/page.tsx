'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/ui/Navbar';
import {
  ArrowUpIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: UserGroupIcon,
      href: '/admin/users',
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      description: 'View platform usage and performance metrics',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Coin Management',
      description: 'Manage coin purchases and transactions',
      icon: CurrencyDollarIcon,
      href: '/admin/coins',
      color: 'bg-yellow-500',
    },
    {
      title: 'Settings',
      description: 'Configure platform settings and preferences',
      icon: CogIcon,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      if (user?.email !== 'work.rparagoso@gmail.com') {
        router.push('/');
        return;
      }

      setLoading(false);
    }
  }, [user, session, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {authLoading ? 'Checking authentication...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={feature.href}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Manage {feature.title}
                  <ArrowUpIcon className="ml-1 h-4 w-4 transform rotate-45" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 