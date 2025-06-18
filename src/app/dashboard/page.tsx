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
import LearningHub from '@/components/dashboard/LearningHub';
import ProfessionalCoach from '@/components/dashboard/ProfessionalCoach';
import { fetchFinancialAdvice } from '@/services/gemini';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Account, Transaction } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getGoals } from '@/services/goalService';
import type { FinancialGoal } from '@/types/supabase';
import {
  ChartBarIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarIcon,
  FlagIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ScaleIcon,
  BoltIcon,
  PlusIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
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
    }
  }, [user]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: user.id,
                name: user.email?.split('@')[0] || 'User',
                email: user.email
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    setIsLoading(true);
    Promise.all([fetchData(), fetchProfile()])
      .catch(error => {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, authLoading, router, fetchData, fetchProfile]);

  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // Prepare chart data
  const chartData = {
    labels: ['Income', 'Expenses', 'Net Balance'],
    incomeData: [totalIncome, 0, 0],
    expenseData: [0, totalExpenses, 0],
  };

  // Add these calculations before the return statement
  const averageTransactionAmount = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length 
    : 0;

  const monthlyExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0) / 12;

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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <UserCircleIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold dark:text-white">
                    Welcome back, {profile?.name || user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Here&apos;s your financial overview</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👨‍💼</span>
                    <div>
                      <p className="font-medium">Coming Soon</p>
                      <p className="text-sm text-blue-100">Talk with Professional Coach</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-medium">Coming Soon</p>
                      <p className="text-sm text-green-100">Earn Money with Taskr</p>
                    </div>
                  </div>
                </div>
                <Link href="/donate" className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white hover:opacity-90 transition-opacity">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">❤️</span>
                    <div>
                      <p className="font-medium">Support Us</p>
                      <p className="text-sm text-purple-100">Help Keep FinSensei Free</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalIncome, user?.currency || 'USD')}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <ArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalExpenses, user?.currency || 'USD')}
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <ArrowDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(netBalance, user?.currency || 'USD')}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <ScaleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {totalIncome > 0 ? `${((netBalance / totalIncome) * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <BanknotesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Charts and Insights */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Financial Overview</h2>
                </div>
                <FinancialChart
                  labels={chartData.labels}
                  incomeData={chartData.incomeData}
                  expenseData={chartData.expenseData}
                  accounts={accounts}
                  transactions={transactions}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                    <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Financial Insights</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Savings</p>
                        <p className="font-medium dark:text-white">
                          {formatCurrency(netBalance / 12, user?.currency || 'USD')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <ArrowTrendingDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Expenses</p>
                        <p className="font-medium dark:text-white">
                          {formatCurrency(monthlyExpenses, user?.currency || 'USD')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Goals and Lists */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                      <FlagIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-xl font-semibold dark:text-white">Active Goals</h2>
                  </div>
                  <button
                    onClick={() => router.push('/goals')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    View All
                  </button>
                </div>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.slice(0, 2).map(goal => {
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
                              {formatCurrency(goal.current_amount, user?.currency || 'USD')} / {formatCurrency(goal.target_amount, user?.currency || 'USD')}
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
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400 mb-3">No active goals yet</p>
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
                <MiniAccountList accounts={accounts} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <MiniTransactionList transactions={transactions} accounts={accounts} />
              </div>
            </div>
          </div>

          {/* Learning Hub Section */}
          <div className="mt-6">
            <LearningHub />
          </div>
        </main>

        {/* Floating AI Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <CoachButton accounts={accounts} transactions={transactions} />
        </div>
      </div>
    </ProtectedRoute>
  );
}