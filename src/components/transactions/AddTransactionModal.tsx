import { useState, useEffect } from 'react';
import { Account } from '../../types/supabase';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createTransaction } from '@/lib/db';
import CustomSelect from '@/components/ui/CustomSelect';
import BaseModal from '@/components/ui/BaseModal';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: Account[];
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess, accounts }: AddTransactionModalProps) {
  const { user } = useAuth();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [account, setAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setSource('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setAccount('');
      setToAccount('');
      setTransactionType('expense');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!amount.trim()) {
        throw new Error('Amount is required');
      }
      if (!date.trim()) {
        throw new Error('Date is required');
      }
      if (!account) {
        throw new Error('Account is required');
      }
      if (transactionType === 'transfer' && !toAccount) {
        throw new Error('Destination account is required for transfer');
      }
      if (transactionType === 'transfer' && account === toAccount) {
        throw new Error('Source and destination accounts must be different');
      }
      if (!source.trim()) {
        throw new Error('Source/Description is required');
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Amount must be a positive number');
      }

      const { error } = await createTransaction(user!.id, {
        amount: amountNum,
        date,
        account_id: account,
        transaction_type: transactionType,
        source: source,
        to_account_id: transactionType === 'transfer' ? toAccount : null,
        user_id: user!.id
      });

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to create transaction. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Check if there are accounts available
  if (!accounts || accounts.length === 0) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Accounts Available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            You need to create at least one account before you can add transactions.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                // You could add navigation to accounts page here
                window.location.href = '/accounts';
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Create Account
            </button>
          </div>
        </div>
      </BaseModal>
    );
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomSelect
          label="Type"
          value={transactionType}
          onChange={(value) => setTransactionType(value as 'income' | 'expense' | 'transfer')}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
            { value: 'transfer', label: 'Transfer' }
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter amount"
            required
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
            required
          />
        </div>

        <CustomSelect
          label={transactionType === 'transfer' ? 'From Account' : 'Account'}
          value={account}
          onChange={setAccount}
          options={[
            { value: '', label: 'Select an account' },
            ...accounts.map((acc) => ({
              value: acc.id,
              label: acc.account_name
            }))
          ]}
        />

        {transactionType === 'transfer' && (
          <CustomSelect
            label="To Account"
            value={toAccount}
            onChange={setToAccount}
            options={[
              { value: '', label: 'Select destination account' },
              ...accounts
                .filter((acc) => acc.id !== account)
                .map((acc) => ({
                  value: acc.id,
                  label: acc.account_name
                }))
            ]}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source/Description
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter transaction source"
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
} 