'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import FinancialMetrics from '@/components/dashboard/FinancialMetrics';
import FinancialChart from '@/components/dashboard/FinancialChart';
import MiniAccountList from '@/components/dashboard/MiniAccountList';
import MiniTransactionList from '@/components/dashboard/MiniTransactionList';
import CoachButton from '@/components/FinancialCoach/CoachButton';
import AdviceDisplay from '@/components/FinancialCoach/AdviceDisplay';
import { fetchFinancialAdvice } from '@/lib/gemini';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/auth';
import { api, Account, Transaction } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { token, isAuthenticated, user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const fetchData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        api.getAccounts(token!),
        api.getTransactions(token!)
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals whenever accounts or transactions change
  useEffect(() => {
    const newTotalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const newTotalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const newNetBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

    setTotalIncome(newTotalIncome);
    setTotalExpenses(newTotalExpenses);
    setNetBalance(newNetBalance);
  }, [accounts, transactions]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    fetchData();
  }, [token, isAuthenticated, router]);

  const handleGetAdvice = async () => {
    try {
      const financialData = {
        accounts,
        transactions,
        totalIncome,
        totalExpenses,
        netBalance,
        currency: user?.currency || 'USD'
      };

      return await fetchFinancialAdvice(financialData);
    } catch (error) {
      console.error('Error getting financial advice:', error);
      throw error;
    }
  };

  // Prepare chart data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse();

  const chartData = {
    labels: last6Months,
    incomeData: last6Months.map(month => {
      return transactions
        .filter(t => {
          const date = new Date(t.date);
          return date.toLocaleString('default', { month: 'short' }) === month && 
                 t.transaction_type === 'income';
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }),
    expenseData: last6Months.map(month => {
      return transactions
        .filter(t => {
          const date = new Date(t.date);
          return date.toLocaleString('default', { month: 'short' }) === month && 
                 t.transaction_type === 'expense';
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'User'}</p>
            </div>
            <CoachButton accounts={accounts} transactions={transactions} />
          </div>

          {advice && <AdviceDisplay advice={advice} isLoading={loading} error={error} />}

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
  );
}