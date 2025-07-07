'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { UserIcon, ShieldCheckIcon, ShieldExclamationIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  coins: number;
  last_daily_refresh: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingCoins, setAddingCoins] = useState<string | null>(null);
  const [showAddCoinsModal, setShowAddCoinsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [coinsToAdd, setCoinsToAdd] = useState('');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingAdmin, setUpdatingAdmin] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(userProfile =>
      userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userProfile.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add is_admin field based on email check
      const usersWithAdminStatus = (data || []).map(user => ({
        ...user,
        is_admin: user.email === 'work.rparagoso@gmail.com' || user.email === 'ronde.paragoso@gmail.com'
      }));
      
      setUsers(usersWithAdminStatus);
    } catch (error) {
      setError('Failed to fetch users. Please check your admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoins = async () => {
    if (!selectedUser || !coinsToAdd) {
      alert('Please enter the number of coins to add');
      return;
    }

    const coins = parseInt(coinsToAdd);
    if (isNaN(coins) || coins <= 0) {
      alert('Please enter a valid number of coins');
      return;
    }

    setAddingCoins(selectedUser.user_id);
    try {
      // Update user's coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coins: selectedUser.coins + coins })
        .eq('user_id', selectedUser.user_id);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert([
          {
            user_id: selectedUser.user_id,
            transaction_type: 'bonus',
            coins_amount: coins,
            description: `Admin bonus: ${reason || 'No reason provided'}`
          }
        ]);

      if (transactionError) throw transactionError;

      alert(`Successfully added ${coins} coins to ${selectedUser.name}!`);
      setShowAddCoinsModal(false);
      setSelectedUser(null);
      setCoinsToAdd('');
      setReason('');
      await loadUsers(); // Reload the data
    } catch (error) {
      alert('Failed to add coins. Please try again.');
    } finally {
      setAddingCoins(null);
    }
  };

  const toggleAdminStatus = async (userProfile: UserProfile) => {
    if (userProfile.email === 'work.rparagoso@gmail.com' || userProfile.email === 'ronde.paragoso@gmail.com') {
      alert('Cannot modify the main admin account');
      return;
    }

    setUpdatingAdmin(userProfile.user_id);
    try {
      // For now, we'll just show a message since admin status is email-based
      // In a real implementation, you'd update a database field
      alert(`Admin status for ${userProfile.name} would be ${userProfile.is_admin ? 'removed' : 'granted'}. This feature requires database schema changes.`);
      
      // Update local state for UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userProfile.user_id 
            ? { ...user, is_admin: !user.is_admin }
            : user
        )
      );
    } catch (error) {
      alert('Failed to update admin status. Please try again.');
    } finally {
      setUpdatingAdmin(null);
    }
  };

  const openAddCoinsModal = (user: UserProfile) => {
    setSelectedUser(user);
    setShowAddCoinsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage users, their coin balances, and admin permissions</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users by name or email..."
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          )}
        </div>

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                <button
                  onClick={loadUsers}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Users</h2>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Coins
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Daily Refresh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((userProfile) => (
                    <tr key={userProfile.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <UserIcon className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userProfile.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {userProfile.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {userProfile.is_admin ? (
                            <>
                              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm text-green-700 dark:text-green-400">Admin</span>
                            </>
                          ) : (
                            <>
                              <ShieldExclamationIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">User</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <span className="font-bold text-yellow-600 dark:text-yellow-400">
                            {userProfile.coins.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">coins</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(userProfile.coins / 20)} chats remaining
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {userProfile.last_daily_refresh 
                          ? formatDate(userProfile.last_daily_refresh)
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(userProfile.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openAddCoinsModal(userProfile)}
                            disabled={addingCoins === userProfile.user_id}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          >
                            {addingCoins === userProfile.user_id ? 'Adding...' : 'Add Coins'}
                          </button>
                          {userProfile.email !== 'work.rparagoso@gmail.com' && userProfile.email !== 'ronde.paragoso@gmail.com' && (
                            <button
                              onClick={() => toggleAdminStatus(userProfile)}
                              disabled={updatingAdmin === userProfile.user_id}
                              className={`${
                                userProfile.is_admin 
                                  ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                  : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                              } disabled:opacity-50`}
                            >
                              {updatingAdmin === userProfile.user_id 
                                ? 'Updating...' 
                                : userProfile.is_admin 
                                  ? 'Remove Admin' 
                                  : 'Make Admin'
                              }
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Coins Modal */}
      {showAddCoinsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Coins to {selectedUser.name}
              </h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Balance
                </label>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {selectedUser.coins.toLocaleString()} coins
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Coins to Add
                </label>
                <input
                  type="number"
                  value={coinsToAdd}
                  onChange={(e) => setCoinsToAdd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter number of coins"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Special promotion, Customer service, etc."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
              <button
                onClick={() => {
                  setShowAddCoinsModal(false);
                  setSelectedUser(null);
                  setCoinsToAdd('');
                  setReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoins}
                disabled={addingCoins === selectedUser.user_id || !coinsToAdd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {addingCoins === selectedUser.user_id ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">Adding...</span>
                  </div>
                ) : (
                  'Add Coins'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 