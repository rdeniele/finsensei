'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FinancialErrorBoundary from '@/components/ui/FinancialErrorBoundary';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getAccounts } from '@/lib/db';
import type { Transaction, Account } from '@/types/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Helper function to format currency
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
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

  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      const [accountsData, transactionsData] = await Promise.all([
        getAccounts(user.id),
        getTransactions(user.id)
      ]);
      
      setAccounts(accountsData || []);
      setTransactions(transactionsData.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchData();
  }, [user, router, fetchData]);

  const handleCreateTransaction = async () => {
    setIsModalOpen(false);
    fetchData();
  };

  const handleUpdateTransaction = async () => {
    setIsModalOpen(false);
    setSelectedTransaction(undefined);
    fetchData();
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const { error } = await deleteTransaction(transactionId, user!.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
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

  const userCurrency = 'USD';

  return (
    <ProtectedRoute>
      <FinancialErrorBoundary feature="transactions">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
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
            
            <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Manage your financial transactions
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <Card>
            <div className="px-4 py-5 sm:p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No transactions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    Get started by creating a new transaction.
                  </p>
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
              ) : (
                <div>
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                      <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Transaction History
                      </h2>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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
                  <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                              >
                                Source
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                              >
                                Type
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                              >
                                Account
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.map((transaction) => {
                              const account = accounts.find((a) => a.id === transaction.account_id);
                              const toAccount = transaction.to_account_id
                                ? accounts.find((a) => a.id === transaction.to_account_id)
                                : null;
                              return (
                                <tr key={transaction.id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 dark:text-white sm:pl-0">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    {transaction.source}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    <span
                                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                        transaction.transaction_type === 'income'
                                          ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                                          : transaction.transaction_type === 'expense'
                                          ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                                          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                                      }`}
                                    >
                                      {transaction.transaction_type.charAt(0).toUpperCase() +
                                        transaction.transaction_type.slice(1)}
                                    </span>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    {formatCurrency(transaction.amount, userCurrency)}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    {account?.account_name}
                                    {toAccount && ` → ${toAccount.account_name}`}
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <button
                                      onClick={() => handleDeleteTransaction(transaction.id)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTransaction(undefined);
            }}
            onSuccess={selectedTransaction ? handleUpdateTransaction : handleCreateTransaction}
            accounts={accounts}
          />
        </main>
      </div>
    </FinancialErrorBoundary>
  </ProtectedRoute>
  );
}
