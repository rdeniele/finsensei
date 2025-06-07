import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import ChatModal from './ChatModal';

const FinancialCoach = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Coach</h2>
        <button
          onClick={() => setIsChatOpen(true)}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Start Chat
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Get personalized financial advice and insights from our AI-powered financial coach.
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>Get help with budgeting and saving</li>
          <li>Understand your spending patterns</li>
          <li>Receive investment recommendations</li>
          <li>Get answers to your financial questions</li>
        </ul>
      </div>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        accounts={accounts}
        transactions={transactions}
      />
    </div>
  );
}; 