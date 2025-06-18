'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/ui/Navbar';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Donation {
  id: string;
  created_at: string;
  user_email: string;
  cause: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'verified' | 'rejected';
  notes: string;
}

interface MonthlyStats {
  month: string;
  total: number;
  causes: {
    [key: string]: number;
  };
}

export default function AdminDashboard() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [sortField, setSortField] = useState<keyof Donation>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);

  const adminFeatures = [
    {
      title: 'Learning Content',
      description: 'Manage educational content, videos, and resources',
      icon: AcademicCapIcon,
      href: '/admin/learning',
      color: 'bg-blue-500',
    },
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

      fetchDonations();
    }
  }, [user, session, authLoading, router]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDonations(data || []);
      calculateMonthlyStats(data || []);
    } catch (err: any) {
      console.error('Error fetching donations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (donations: Donation[]) => {
    const stats: { [key: string]: MonthlyStats } = {};
    
    donations.forEach(donation => {
      const date = new Date(donation.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!stats[monthKey]) {
        stats[monthKey] = {
          month: monthName,
          total: 0,
          causes: {}
        };
      }
      
      stats[monthKey].total += donation.amount;
      stats[monthKey].causes[donation.cause] = (stats[monthKey].causes[donation.cause] || 0) + donation.amount;
    });
    
    setMonthlyStats(Object.values(stats).sort((a, b) => {
      const [aYear, aMonth] = a.month.split(' ');
      const [bYear, bMonth] = b.month.split(' ');
      return new Date(`${bMonth} 1, ${bYear}`).getTime() - new Date(`${aMonth} 1, ${aYear}`).getTime();
    }));
  };

  const updateDonationStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchDonations();
    } catch (err: any) {
      console.error('Error updating donation:', err);
      setError(err.message);
    }
  };

  const handleSort = (field: keyof Donation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredDonations = donations
    .filter(donation => {
      if (filter !== 'all' && donation.status !== filter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          donation.user_email.toLowerCase().includes(searchLower) ||
          donation.cause.toLowerCase().includes(searchLower) ||
          donation.payment_method.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * modifier;
      }
      return 0;
    });

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    verified: donations.filter(d => d.status === 'verified').length,
    rejected: donations.filter(d => d.status === 'rejected').length,
    totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    verifiedAmount: donations
      .filter(d => d.status === 'verified')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {authLoading ? 'Checking authentication...' : 'Loading donations...'}
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your platform's content, users, and settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(feature.href)}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`${feature.color} p-3 rounded-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={fetchDonations}
            className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowPathIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ₱{stats.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stats.total} donations ({stats.verified} verified)
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verified Amount</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₱{stats.verifiedAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stats.verified} verified donations
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Pending Donations</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stats.rejected} rejected donations
            </p>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Statistics</h2>
            <div className="space-y-4">
              {monthlyStats.map((stat) => (
                <div key={stat.month} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{stat.month}</h3>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      ₱{stat.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stat.causes).map(([cause, amount]) => (
                      <div key={cause} className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{cause}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₱{amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by email, cause, or payment method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'all'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'verified'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 rounded-md ${
                    filter === 'rejected'
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('user_email')}
                  >
                    <div className="flex items-center gap-1">
                      Donor
                      {sortField === 'user_email' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('cause')}
                  >
                    <div className="flex items-center gap-1">
                      Cause
                      {sortField === 'cause' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('payment_method')}
                  >
                    <div className="flex items-center gap-1">
                      Payment Method
                      {sortField === 'payment_method' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {donation.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {donation.cause}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ₱{donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {donation.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          donation.status === 'verified'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : donation.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {donation.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateDonationStatus(donation.id, 'verified')}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => updateDonationStatus(donation.id, 'rejected')}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 