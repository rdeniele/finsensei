'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { api, Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Helper function to format currency
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD', 
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
    if (!balance.trim()) {
      setError('Balance is required');
      return;
    }
    onSubmit({ account_name: accountName, balance });
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
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchAccounts();
  }, [token, isAuthenticated, router]);

  const fetchAccounts = async () => {
    try {
      const accountsData = await api.getAccounts(token!);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to fetch accounts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (data: { account_name: string; balance: string }) => {
    try {
      await api.createAccount(token!, {
        account_name: data.account_name,
        balance: parseFloat(data.balance)
      });
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Failed to create account. Please try again later.');
    }
  };

  const handleUpdateAccount = async (data: { account_name: string; balance: string }) => {
    if (!selectedAccount) return;
    try {
      await api.updateAccount(token!, selectedAccount.id, {
        account_name: data.account_name,
        balance: parseFloat(data.balance)
      });
      setIsModalOpen(false);
      setSelectedAccount(undefined);
      fetchAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      setError('Failed to update account. Please try again later.');
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await api.deleteAccount(token!, accountId);
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold dark:text-white">Accounts</h1>
          </div>
          <button
            onClick={() => {
              setSelectedAccount(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Account</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">{account.account_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(account.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    parseFloat(account.balance) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(parseFloat(account.balance), userCurrency)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No accounts</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new account.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Account
              </button>
            </div>
          </div>
        )}

        <AccountModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAccount(undefined);
          }}
          onSubmit={selectedAccount ? handleUpdateAccount : handleCreateAccount}
          initialData={selectedAccount}
          currency={userCurrency}
        />
      </main>
    </div>
  );
}
