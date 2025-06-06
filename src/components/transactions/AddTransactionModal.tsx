import { useState, useEffect } from 'react';
import { api, Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accounts: Account[];
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess, accounts }: AddTransactionModalProps) {
  const { token } = useAuth();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [account, setAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [error, setError] = useState('');

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
    if (!amount.trim()) {
      setError('Amount is required');
      return;
    }
    if (!date.trim()) {
      setError('Date is required');
      return;
    }
    if (!account) {
      setError('Account is required');
      return;
    }
    if (transactionType === 'transfer' && !toAccount) {
      setError('Destination account is required for transfer');
      return;
    }
    if (transactionType === 'transfer' && account === toAccount) {
      setError('Source and destination accounts must be different');
      return;
    }

    try {
      const payload: any = {
        amount: parseFloat(amount),
        date,
        account: parseInt(account),
        transaction_type: transactionType,
      };
      if (transactionType === 'transfer') {
        payload.to_account = parseInt(toAccount);
      } else {
        payload.source = source;
      }
      await api.createTransaction(token!, payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('Failed to create transaction. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense' | 'transfer')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
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
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {transactionType === 'transfer' ? 'From Account' : 'Account'}
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_name}
                </option>
              ))}
            </select>
          </div>
          {transactionType === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Account
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select destination account</option>
                {accounts
                  .filter((acc) => acc.id.toString() !== account)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          {transactionType !== 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source/Description
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter transaction source"
              />
            </div>
          )}
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 