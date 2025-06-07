import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction, Account } from '@/types/supabase';
import { useAuth } from '@/lib/auth';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface MiniTransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  onTransactionAdded: () => void;
}

export default function MiniTransactionList({ transactions, accounts, onTransactionAdded }: MiniTransactionListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleTransactionClick = () => {
    router.push('/transactions');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return '↑';
      case 'expense':
        return '↓';
      default:
        return '•';
    }
  };

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold dark:text-white">Recent Transactions</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          + Add Transaction
        </button>
      </div>

      <div className="space-y-2">
        {transactions.slice(0, 3).map((transaction) => (
          <div
            key={transaction.id}
            onClick={handleTransactionClick}
            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base dark:text-white">
                {getTransactionIcon(transaction.transaction_type)}
              </span>
              <div>
                <h3 className="font-medium text-sm dark:text-white">{transaction.source}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.date} • {accounts.find(acc => acc.id === transaction.account_id)?.account_name || 'Unknown Account'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${
                transaction.transaction_type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.transaction_type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, userCurrency)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {transactions.length > 3 && (
        <button
          onClick={handleTransactionClick}
          className="mt-2 text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 w-full text-center"
        >
          View All Transactions
        </button>
      )}

      {showAddModal && (
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={onTransactionAdded}
          accounts={accounts}
        />
      )}
    </div>
  );
} 