'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  profile: {
    name: string;
  } | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    updateAdminProfile();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'work.rparagoso@gmail.com') {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error('Failed to fetch profiles');
      }

      // Get the current user's data
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching current user:', userError);
        throw new Error('Failed to fetch current user');
      }

      // Create a combined users array with the current user and profiles
      const combinedUsers = profiles.map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        created_at: profile.created_at,
        last_sign_in_at: null, // We don't have this info without admin API
        is_admin: profile.email === 'work.rparagoso@gmail.com',
        profile: {
          name: profile.name || ''
        }
      }));

      // Add current user if not in profiles
      if (currentUser && !profiles.find(p => p.user_id === currentUser.id)) {
        combinedUsers.push({
          id: currentUser.id,
          email: currentUser.email || '',
          created_at: currentUser.created_at,
          last_sign_in_at: null,
          is_admin: currentUser.email === 'work.rparagoso@gmail.com',
          profile: {
            name: currentUser.email?.split('@')[0] || ''
          }
        });
      }

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setError(null);
      // Since we're using email-based admin check, we'll just refresh the list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      setError(error.message || 'Failed to update admin status');
    }
  };

  const updateAdminProfile = async () => {
    try {
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update the admin's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: 'Ron Paragoso' })
        .eq('user_id', session.user.id);

      if (updateError) {
        console.error('Error updating admin profile:', updateError);
        throw new Error('Failed to update admin profile');
      }

      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin profile:', error);
      setError(error.message || 'Failed to update admin profile');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/settings/profile"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Your Profile
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Created
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Last Sign In
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <UserIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.profile?.name || user.email}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            {user.is_admin ? (
                              <>
                                <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                                <span>Admin</span>
                              </>
                            ) : (
                              <>
                                <ShieldExclamationIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span>User</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.last_sign_in_at
                            ? new Date(user.last_sign_in_at).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/settings/profile?userId=${user.id}`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              Edit Profile
                            </Link>
                            <button
                              onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                              className={`text-${user.is_admin ? 'red' : 'indigo'}-600 hover:text-${user.is_admin ? 'red' : 'indigo'}-900 dark:text-${user.is_admin ? 'red' : 'indigo'}-400 dark:hover:text-${user.is_admin ? 'red' : 'indigo'}-300`}
                            >
                              {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 