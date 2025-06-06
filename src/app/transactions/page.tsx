'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { api, Transaction, Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    account: number;
    amount: string;
    source: string;
    transaction_type: 'income' | 'expense';
    date: string;
  }) => void;
  initialData?: Transaction;
  accounts: Account[];
}

function TransactionModal({ isOpen, onClose, onSubmit, initialData, accounts }: TransactionModalProps) {
  const [accountId, setAccountId] = useState(initialData?.account || accounts[0]?.id || 0);
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [source, setSource] = useState(initialData?.source || '');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    initialData?.transaction_type || 'expense'
  );
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : 
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setAccountId(initialData.account);
      setAmount(initialData.amount);
      setSource(initialData.source);
      setTransactionType(initialData.transaction_type);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      setError('Please select an account');
      return;
    }
    if (!amount.trim()) {
      setError('Amount is required');
      return;
    }
    if (!source.trim()) {
      setError('Description is required');
      return;
    }
    onSubmit({ account: accountId, amount, source, transaction_type: transactionType, date });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'income' || value === 'expense') {
                  setTransactionType(value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export default function TransactionsPage() {
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [token, isAuthenticated, router]);

  const fetchData = async () => {
    if (!token) return;
    try {
      const [transactionsData, accountsData] = await Promise.all([
        api.getTransactions(token),
        api.getAccounts(token)
      ]);
      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (data: {
    account: number;
    amount: string;
    source: string;
    transaction_type: 'income' | 'expense';
    date: string;
  }) => {
    if (!token) return;
    try {
      await api.createTransaction(token, {
        ...data,
        amount: parseFloat(data.amount)
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction. Please try again later.');
    }
  };

  const handleUpdateTransaction = async (data: {
    account: number;
    amount: string;
    source: string;
    transaction_type: 'income' | 'expense';
    date: string;
  }) => {
    if (!token || !selectedTransaction) return;
    try {
      await api.updateTransaction(token, selectedTransaction.id, {
        ...data,
        amount: parseFloat(data.amount)
      });
      setIsModalOpen(false);
      setSelectedTransaction(undefined);
      fetchData();
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction. Please try again later.');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.deleteTransaction(token, transactionId);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again later.');
    }
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        type === 'income' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <svg className={`w-4 h-4 ${type === 'income' ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {type === 'income' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          )}
        </svg>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <button
            onClick={() => {
              setSelectedTransaction(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Transaction
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{transaction.source}</h3>
                  <p className="text-sm text-gray-500">
                    {transaction.date} • {transaction.account_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(transaction.amount), userCurrency)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.transaction_type}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTransaction(undefined);
          }}
          onSuccess={fetchData}
          accounts={accounts}
        />
      </main>
    </div>
  );
}
