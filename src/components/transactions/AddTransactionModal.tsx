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
      console.error('Error creating transaction:', error);
      setError(error instanceof Error ? error.message : 'Failed to create transaction. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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