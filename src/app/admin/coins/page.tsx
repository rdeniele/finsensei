'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { coinService, refreshDailyCoinsForAllUsers } from '@/services/coinService';
import type { CoinPurchase, CoinTransaction } from '@/types/coin';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function AdminCoinsPage() {
  const [purchases, setPurchases] = useState<CoinPurchase[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<CoinPurchase | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [purchasesData, transactionsData] = await Promise.all([
        coinService.getAllCoinPurchases(),
        coinService.getAllCoinTransactions()
      ]);
      setPurchases(purchasesData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading coin data:', error);
      setError('Failed to fetch data. Please check your admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePurchase = async (purchaseId: string) => {
    try {
      const success = await coinService.completeCoinPurchase(purchaseId);
      if (success) {
        await loadData();
        setShowModal(false);
        setSelectedPurchase(null);
      } else {
        setError('Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      setError('Failed to complete purchase');
    }
  };

  const handleUpdateStatus = async (purchaseId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setUpdating(purchaseId);
    try {
      await coinService.updateCoinPurchaseStatus(purchaseId, status, adminNotes);
      await loadData();
      setShowModal(false);
      setSelectedPurchase(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDailyRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const count = await refreshDailyCoinsForAllUsers();
      setRefreshCount(count);
      // Show success message
      alert(`Successfully refreshed daily coins for ${count} users!`);
    } catch (error) {
      console.error('Error refreshing daily coins:', error);
      setError('Error refreshing daily coins. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const createTestPurchase = async () => {
    try {
      if (!user) {
        alert('Please sign in to create a test purchase');
        return;
      }
      
      const testPurchase = await coinService.createCoinPurchase(
        user.id,
        user.email || 'admin@example.com',
        user.email?.split('@')[0] || 'Admin User',
        'bronze',
        5000,
        5.00
      );
      
      if (testPurchase) {
        alert('Test purchase created successfully!');
        await loadData(); // Reload the data
      } else {
        // Check if the purchase was actually created by reloading data
        await loadData();
        const currentPurchases = await coinService.getAllCoinPurchases();
        const testPurchaseExists = currentPurchases.some(p => 
          p.user_email === (user.email || 'admin@example.com') && p.plan_type === 'bronze'
        );
        
        if (testPurchaseExists) {
          alert('Test purchase was created successfully! (Check the table below)');
        } else {
          alert('Failed to create test purchase. Please check console for details.');
        }
      }
    } catch (error) {
      console.error('Error creating test purchase:', error);
      alert('Error creating test purchase. Check console for details.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coin Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage coin purchases and daily refresh</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                <button
                  onClick={loadData}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daily Refresh Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Coin Refresh</h2>
              <p className="text-gray-600 dark:text-gray-400">Manually trigger daily coin refresh for all users</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={createTestPurchase}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Create Test Purchase
              </button>
              <button
                onClick={handleDailyRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                {refreshing ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Refreshing...</span>
                  </div>
                ) : (
                  'Refresh Daily Coins for All Users'
                )}
              </button>
            </div>
          </div>
          {refreshCount !== null && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-green-800 dark:text-green-200">
                Successfully refreshed daily coins for {refreshCount} users!
              </p>
            </div>
          )}
        </div>

        {/* Coin Purchases Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Coin Purchase Requests</h2>
          </div>
          
          {purchases.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No coin purchase requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {purchase.user_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {purchase.user_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(purchase.plan_type)}`}>
                          {purchase.plan_type.charAt(0).toUpperCase() + purchase.plan_type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {purchase.coins_amount.toLocaleString()} coins
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ${purchase.price_usd}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {purchase.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateStatus(purchase.id, 'confirmed')}
                              disabled={updating === purchase.id}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                            >
                              {updating === purchase.id ? 'Updating...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(purchase.id, 'cancelled')}
                              disabled={updating === purchase.id}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                            >
                              {updating === purchase.id ? 'Updating...' : 'Cancel'}
                            </button>
                          </div>
                        )}
                        {purchase.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(purchase.id, 'completed')}
                            disabled={updating === purchase.id}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                          >
                            {updating === purchase.id ? 'Updating...' : 'Complete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 