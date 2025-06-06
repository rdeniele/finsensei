'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFinancialAdvice } from '@/lib/gemini';
import CoachModal from '@/components/FinancialCoach/CoachModal';
import CoachButton from '@/components/FinancialCoach/CoachButton';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function CoachPage() {
  const [showModal, setShowModal] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const handleGetAdvice = async (): Promise<string> => {
    setLoading(true);
    try {
      const [accounts, transactions] = await Promise.all([
        api.getAccounts(token!),
        api.getTransactions(token!)
      ]);

      const financialData = {
        accounts,
        transactions,
        totalIncome: transactions
          .filter(t => t.transaction_type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpenses: transactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0),
        netBalance: accounts.reduce((sum, a) => sum + Number(a.balance), 0),
        currency: 'USD'
      };

      const adviceData = await fetchFinancialAdvice(financialData);
      setAdvice(adviceData);
      setShowModal(true);
      return adviceData;
    } catch (error) {
      console.error('Error fetching financial advice:', error);
      throw new Error('Failed to fetch advice. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Financial Coach</h1>
      <button
        onClick={() => handleGetAdvice()}
        disabled={loading}
        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Getting Advice...' : 'Get Financial Advice'}
      </button>
      {showModal && (
        <CoachModal onClose={() => setShowModal(false)} onGetAdvice={handleGetAdvice} />
      )}
    </div>
  );
}