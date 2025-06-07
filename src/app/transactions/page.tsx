'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getAccounts } from '@/lib/db';
import type { Transaction, Account } from '@/lib/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Helper function to format currency
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { source: string; amount: string; date: string; transaction_type: 'income' | 'expense' | 'transfer'; account: string }) => void;
  initialData?: Transaction;
  accounts: Account[];
  currency: string;
}

function TransactionModal({ isOpen, onClose, onSubmit, initialData, accounts, currency }: TransactionModalProps) {
  const [source, setSource] = useState(initialData?.source || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>(initialData?.transaction_type || 'expense');
  const [accountId, setAccountId] = useState(initialData?.account_id || accounts[0]?.id || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setSource(initialData.source);
      setAmount(initialData.amount);
      setDate(initialData.date);
      setTransactionType(initialData.transaction_type);
      setAccountId(initialData.account_id);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim()) {
      setError('Source is required');
      return;
    }
    if (!amount.toString().trim()) {
      setError('Amount is required');
      return;
    }
    if (!date.trim()) {
      setError('Date is required');
      return;
    }
    if (!accountId) {
      setError('Account is required');
      return;
    }
    onSubmit({ source, amount: amount.toString(), date, transaction_type: transactionType, account: accountId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter transaction source"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense' | 'transfer')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>
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

export default function TransactionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        getAccounts(user!.id),
        getTransactions(user!.id)
      ]);
      setAccounts(accountsData.data || []);
      setTransactions(transactionsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (data: { source: string; amount: string; date: string; transaction_type: 'income' | 'expense' | 'transfer'; account: string }) => {
    try {
      const { error } = await createTransaction(user!.id, {
        user_id: user!.id,
        account_id: data.account,
        to_account_id: null,
        transaction_type: data.transaction_type,
        source: data.source,
        amount: parseFloat(data.amount),
        date: data.date
      });
      if (error) throw error;
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction');
    }
  };

  const handleUpdateTransaction = async (data: { source: string; amount: string; date: string; transaction_type: 'income' | 'expense' | 'transfer'; account: string }) => {
    if (!selectedTransaction) return;
    try {
      const { error } = await updateTransaction(selectedTransaction.id, user!.id, {
        user_id: user!.id,
        account_id: data.account,
        to_account_id: null,
        transaction_type: data.transaction_type,
        source: data.source,
        amount: parseFloat(data.amount),
        date: data.date
      });
      if (error) throw error;
      setIsModalOpen(false);
      setSelectedTransaction(undefined);
      fetchData();
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const { error } = await deleteTransaction(transactionId, user!.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userCurrency = 'USD'; // You can get this from user preferences later

  return (
    <ProtectedRoute>
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
              <h1 className="text-3xl font-bold dark:text-white">Transactions</h1>
            </div>
            <button
              onClick={() => {
                setSelectedTransaction(undefined);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Transaction</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900/50' 
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}>
                      <svg 
                        className={`w-6 h-6 ${
                          transaction.transaction_type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {transaction.transaction_type === 'income' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">{transaction.source}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()} • {accounts.find(a => a.id === transaction.account_id)?.account_name || 'Unknown Account'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.transaction_type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, userCurrency)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {transaction.transaction_type}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);
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
                    onClick={() => handleDeleteTransaction(transaction.id)}
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

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new transaction.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Transaction
                </button>
              </div>
            </div>
          )}

          <TransactionModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTransaction(undefined);
            }}
            onSubmit={selectedTransaction ? handleUpdateTransaction : handleCreateTransaction}
            initialData={selectedTransaction}
            accounts={accounts}
            currency={userCurrency}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
