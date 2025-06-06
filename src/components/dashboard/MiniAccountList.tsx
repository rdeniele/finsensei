import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import AddAccountModal from '@/components/accounts/AddAccountModal';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface MiniAccountListProps {
  accounts: Account[];
  onAccountAdded: () => void;
}

export default function MiniAccountList({ accounts, onAccountAdded }: MiniAccountListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const getAccountIcon = (balance: string) => {
    const amount = parseFloat(balance);
    return (
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        amount >= 0 ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <svg className={`w-4 h-4 ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      </div>
    );
  };

  const handleAccountClick = () => {
    router.push('/accounts');
  };

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold dark:text-white">Accounts</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          + Add Account
        </button>
      </div>

      <div className="space-y-2">
        {accounts.slice(0, 2).map((account) => (
          <div
            key={account.id}
            onClick={handleAccountClick}
            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div>
              <h3 className="font-medium text-sm dark:text-white">{account.account_name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(account.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${
                parseFloat(account.balance) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(parseFloat(account.balance), userCurrency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {accounts.length > 2 && (
        <button
          onClick={handleAccountClick}
          className="mt-2 text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 w-full text-center"
        >
          View All Accounts
        </button>
      )}

      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSuccess={onAccountAdded}
        />
      )}
    </div>
  );
} 