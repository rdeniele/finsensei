import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AddAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAccountModal({ onClose, onSuccess }: AddAccountModalProps) {
  const [accountName, setAccountName] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('You must be logged in to create an account');
      }

      if (!accountName.trim()) {
        throw new Error('Account name is required');
      }

      if (!balance.trim()) {
        throw new Error('Balance is required');
      }

      const balanceNum = parseFloat(balance);
      if (isNaN(balanceNum)) {
        throw new Error('Invalid balance amount');
      }

      await api.createAccount(accountName, balanceNum);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Account</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Balance</label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 