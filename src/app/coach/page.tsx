'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { getFinancialAdvice } from '@/services/coachService';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import type { Account } from '@/lib/supabase';
import type { Transaction } from '@/lib/supabase';
import type { LearningTip } from '@/services/gemini';

export default function CoachPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [advice, setAdvice] = useState<LearningTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        api.getAccounts(),
        api.getTransactions()
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    try {
      setLoading(true);
      const advice = await getFinancialAdvice(accounts, transactions, user?.currency || 'USD');
      setAdvice(advice);
    } catch (error) {
      console.error('Error getting financial advice:', error);
      setError('Failed to get financial advice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Coach</h1>
            <button
              onClick={handleGetAdvice}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Get Advice
            </button>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {advice.length > 0 && (
            <div className="space-y-4">
              {advice.map((tip, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{tip.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{tip.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Source: {tip.source}</span>
                    {tip.type === 'video' && tip.url && (
                      <a 
                        href={tip.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Watch Video
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}