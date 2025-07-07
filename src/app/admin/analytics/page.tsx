'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalAmount: number;
  userGrowth: number;
  transactionGrowth: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch active users (users who signed in within the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_sign_in_at', thirtyDaysAgo.toISOString());

      // Fetch total transactions
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Fetch total transaction amount
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount');
      const totalAmount = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Calculate growth rates (mock data for now)
      const userGrowth = 15; // 15% growth
      const transactionGrowth = 25; // 25% growth

      setData({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalTransactions: totalTransactions || 0,
        totalAmount,
        userGrowth,
        transactionGrowth,
      });
    } catch (error) {
      setError('Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Platform performance and usage metrics
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.totalUsers}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      data.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.userGrowth >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="ml-1">{Math.abs(data.userGrowth)}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {data.activeUsers} active users in the last 30 days
              </span>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Transactions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.totalTransactions}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      data.transactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.transactionGrowth >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="ml-1">{Math.abs(data.transactionGrowth)}%</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Total amount: ${data.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder
          </div>
        </div>

        {/* Transaction Trends */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Transaction Trends
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
} 