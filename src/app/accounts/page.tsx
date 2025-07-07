'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '@/lib/db';
import Navbar from '@/components/ui/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FinancialErrorBoundary from '@/components/ui/FinancialErrorBoundary';
import AddAccountModal from '@/components/accounts/AddAccountModal';
import Link from 'next/link';
import {
  PlusIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import type { Account } from '@/types/supabase';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { account_name: string; balance: string }) => void;
  initialData?: Account;
  currency: string;
}

function AccountModal({ isOpen, onClose, onSubmit, initialData, currency }: AccountModalProps) {
  const [accountName, setAccountName] = useState(initialData?.account_name || '');
  const [balance, setBalance] = useState(initialData?.balance || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setAccountName(initialData.account_name);
      setBalance(initialData.balance);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setError('Account name is required');
      return;
    }
    if (!balance.toString().trim()) {
      setError('Balance is required');
      return;
    }
    onSubmit({ account_name: accountName, balance: balance.toString() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {initialData ? 'Edit Account' : 'Add New Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter account name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Balance ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter initial balance"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { user } = useAuth();

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await getAccounts(user.id);
      setAccounts(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreateAccount = async (data: { account_name: string; balance: string }) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (!user.id) {
        throw new Error('User ID is missing');
      }
      
      if (!data.account_name.trim()) {
        throw new Error('Account name is required');
      }
      
      const balance = parseFloat(data.balance);
      if (isNaN(balance)) {
        throw new Error('Invalid balance amount');
      }
      
      await createAccount(
        user.id, 
        data.account_name, 
        balance,
        'checking', // default account type
        user.currency || 'USD' // use user's currency or default to USD
      );
      
      await fetchAccounts();
      setIsModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const handleUpdateAccount = async (data: { account_name: string; balance: string }) => {
    if (!selectedAccount) return;
    
    try {
      setError(null);
      await updateAccount(selectedAccount.id, {
        account_name: data.account_name,
        balance: parseFloat(data.balance),
      });
      await fetchAccounts();
      setSelectedAccount(null);
      setIsModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update account');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      setError(null);
      await deleteAccount(accountId);
      await fetchAccounts();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete account');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Please sign in to view your accounts.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <FinancialErrorBoundary feature="accounts">
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back to Dashboard Button */}
            <div className="mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Account
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-300">
                  <WalletIcon className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No accounts yet</h3>
                  <p className="text-sm">Get started by adding your first account</p>
                </div>
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {account.account_name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {account.account_type || 'General'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedAccount(account)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(account.balance || 0, account.currency || 'USD')}
                  </p>
                </div>
              ))
            )}
          </div>

          <AccountModal
            isOpen={isModalOpen || !!selectedAccount}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedAccount(null);
            }}
            onSubmit={selectedAccount ? handleUpdateAccount : handleCreateAccount}
            initialData={selectedAccount || undefined}
            currency={user?.currency || 'USD'}
          />
        </main>
      </div>
    </ProtectedRoute>
  </FinancialErrorBoundary>
  );
}
