'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { getGoals, createGoal, deleteGoal, addContribution, updateGoal } from '@/services/goalService';
import type { FinancialGoal } from '@/types/supabase';
import Navbar from '@/components/ui/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AddGoalModal from '@/components/goals/AddGoalModal';
import EditGoalModal from '@/components/goals/EditGoalModal';

export default function GoalsPage() {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<FinancialGoal | null>(null);
  const [showContributionModal, setShowContributionModal] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const userGoals = await getGoals(user.id);
    setGoals(userGoals);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleCreateGoal = async (formData: FormData) => {
    if (!user) return;

    const accountId = formData.get('accountId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const targetAmount = parseFloat(formData.get('targetAmount') as string);
    const startDate = formData.get('startDate') as string;
    const targetDate = formData.get('targetDate') as string;

    const newGoal = await createGoal(
      user.id,
      accountId,
      name,
      description,
      targetAmount,
      startDate,
      targetDate
    );

    if (newGoal) {
      setGoals(prev => [newGoal, ...prev]);
      setShowCreateModal(false);
    }
  };

  const handleEditGoal = async (formData: FormData) => {
    if (!showEditModal) return;

    const accountId = formData.get('accountId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const targetAmount = parseFloat(formData.get('targetAmount') as string);
    const startDate = formData.get('startDate') as string;
    const targetDate = formData.get('targetDate') as string;

    const updatedGoal = await updateGoal(
      showEditModal.id,
      accountId,
      name,
      description,
      targetAmount,
      startDate,
      targetDate
    );

    if (updatedGoal) {
      setGoals(prev => prev.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      ));
      setShowEditModal(null);
    }
  };

  const handleAddContribution = async (goalId: string, formData: FormData) => {
    try {
      const amount = parseFloat(formData.get('amount') as string);
      const contributionDate = formData.get('contributionDate') as string;
      const notes = formData.get('notes') as string;

      if (!amount || amount <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
      }

      if (!contributionDate) {
        alert('Please select a contribution date');
        return;
      }

      const contribution = await addContribution(goalId, amount, contributionDate, notes);
      if (contribution) {
        await loadGoals(); // Reload goals to get updated amounts
        setShowContributionModal(null);
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      alert(`Failed to add contribution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const success = await deleteGoal(goalId);
      if (success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                No Goals Yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Start your financial journey by creating your first goal
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => {
                const account = accounts.find(a => a.id === goal.account_id);
                const progress = (goal.current_amount / goal.target_amount) * 100;
                
                return (
                  <div
                    key={goal.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                          {goal.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Account: {account?.account_name || 'Unknown'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowEditModal(goal)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="Edit goal"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Delete goal"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => setShowContributionModal(goal.id)}
                          className="text-green-500 hover:text-green-700 p-1"
                          aria-label="Add contribution"
                        >
                          ➕
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                      {goal.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          ${goal.current_amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          ${goal.target_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <p>Start: {new Date(goal.start_date).toLocaleDateString()}</p>
                        <p>Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl"
            aria-label="Create new goal"
          >
            +
          </button>

          {/* Add Goal Modal */}
          <AddGoalModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateGoal}
          />

          {/* Edit Goal Modal */}
          {showEditModal && (
            <EditGoalModal
              isOpen={true}
              onClose={() => setShowEditModal(null)}
              onSubmit={handleEditGoal}
              goal={showEditModal}
            />
          )}

          {/* Add Contribution Modal */}
          {showContributionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Add Contribution
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAddContribution(showContributionModal, formData);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="contributionDate"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowContributionModal(null)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add Contribution
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 