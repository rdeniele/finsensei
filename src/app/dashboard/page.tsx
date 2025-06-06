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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <CoachButton accounts={accounts} transactions={transactions} />
          </div>

          {advice && <AdviceDisplay advice={advice} isLoading={loading} error={error} />}

          <FinancialMetrics
            income={totalIncome}
            expenses={totalExpenses}
            netBalance={netBalance}
            currency={user?.currency || 'USD'}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FinancialChart
                labels={chartData.labels}
                incomeData={chartData.incomeData}
                expenseData={chartData.expenseData}
              />
              {/* Financial Insights Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <ul className="space-y-2">
                    <li>
                      💡 {totalIncome > 0 ? `You saved ${((netBalance / totalIncome) * 100).toFixed(1)}% of your income overall.` : 'Add income to see your savings rate.'}
                    </li>
                    <li>
                      ⚠️ {totalExpenses > 0 ? `Your expenses are ${((totalExpenses / (totalIncome || 1)) * 100).toFixed(1)}% of your income.` : 'No expenses recorded yet.'}
                    </li>
                    <li>
                      📈 {netBalance >= 0 ? 'Your net balance is positive. Keep it up!' : 'Your net balance is negative. Review your expenses.'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <MiniAccountList 
                accounts={accounts} 
                onAccountAdded={fetchData}
              />
              <MiniTransactionList 
                transactions={transactions}
                accounts={accounts}
                onTransactionAdded={fetchData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}