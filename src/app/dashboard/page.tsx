'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import FinancialMetrics from '@/components/dashboard/FinancialMetrics';
import FinancialChart from '@/components/dashboard/FinancialChart';
import MiniAccountList from '@/components/dashboard/MiniAccountList';
import MiniTransactionList from '@/components/dashboard/MiniTransactionList';
import CoachButton from '@/components/FinancialCoach/CoachButton';
import AdviceDisplay from '@/components/FinancialCoach/AdviceDisplay';
import { fetchFinancialAdvice } from '@/services/gemini';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Account, Transaction } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getGoals } from '@/services/goalService';
import type { FinancialGoal } from '@/types/supabase';

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [accountsData, transactionsData, goalsData] = await Promise.all([
        api.getAccounts(),
        api.getTransactions(),
        getGoals(user.id)
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
      setGoals(goalsData.filter(goal => goal.status === 'active'));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    fetchData();
  }, [user, router, fetchData]);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // Prepare chart data
  const chartData = {
    labels: ['Income', 'Expenses', 'Net Balance'],
    incomeData: [totalIncome, 0, 0],
    expenseData: [0, totalExpenses, 0],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.email || 'User'}</p>
              </div>
              <CoachButton accounts={accounts} transactions={transactions}/>
            </div>

            {advice && <AdviceDisplay advice={advice} isLoading={isLoading} error={error} />}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <FinancialMetrics
                income={totalIncome}
                expenses={totalExpenses}
                netBalance={netBalance}
                currency={user?.currency || 'USD'}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6 dark:text-white">Financial Overview</h2>
                  <FinancialChart
                    labels={chartData.labels}
                    incomeData={chartData.incomeData}
                    expenseData={chartData.expenseData}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6 dark:text-white">Financial Insights</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3 dark:text-gray-300">
                      <span className="text-2xl">💡</span>
                      <span>{totalIncome > 0 ? `You saved ${((netBalance / totalIncome) * 100).toFixed(1)}% of your income overall.` : 'Add income to see your savings rate.'}</span>
                    </li>
                    <li className="flex items-start space-x-3 dark:text-gray-300">
                      <span className="text-2xl">⚠️</span>
                      <span>{totalExpenses > 0 ? `Your expenses are ${((totalExpenses / (totalIncome || 1)) * 100).toFixed(1)}% of your income.` : 'No expenses recorded yet.'}</span>
                    </li>
                    <li className="flex items-start space-x-3 dark:text-gray-300">
                      <span className="text-2xl">📈</span>
                      <span>{netBalance >= 0 ? 'Your net balance is positive. Keep it up!' : 'Your net balance is negative. Review your expenses.'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold dark:text-white">Active Goals</h2>
                    <button
                      onClick={() => router.push('/goals')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  {goals.length > 0 ? (
                    <div className="space-y-4">
                      {goals.map(goal => {
                        const account = accounts.find(a => a.id === goal.account_id);
                        const progress = (goal.current_amount / goal.target_amount) * 100;
                        
                        return (
                          <div
                            key={goal.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {goal.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {account?.account_name || 'Unknown Account'}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>{progress.toFixed(1)}% Complete</span>
                              <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No active goals yet</p>
                      <button
                        onClick={() => router.push('/goals')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Goal
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <MiniAccountList 
                    accounts={accounts} 
                    onAccountAdded={fetchData}
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <MiniTransactionList 
                    transactions={transactions}
                    accounts={accounts}
                    onTransactionAdded={fetchData}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}