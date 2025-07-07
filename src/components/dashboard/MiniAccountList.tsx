import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';

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
}

export default function MiniAccountList({ accounts }: MiniAccountListProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleAccountClick = () => {
    router.push('/accounts');
  };

  const userCurrency = user?.currency || 'USD';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold dark:text-white">Accounts</h2>
        <button
          onClick={handleAccountClick}
          className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
        </button>
      </div>

      <div className="space-y-2">
        {accounts.slice(0, 2).map((account) => (
          <div
            key={account.id}
            onClick={handleAccountClick}
            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div>
              <h3 className="font-medium text-sm dark:text-white">{account.account_name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Last updated: {new Date(account.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${
                account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(account.balance, userCurrency)}
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
    </div>
  );
} 