'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/ui/Navbar';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

function ProfileContent() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'work.rparagoso@gmail.com') {
        // Handle admin-specific logic here if needed
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/signin');
          return;
        }

        const targetUserId = userId || session.user.id;
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  user_id: targetUserId,
                  name: session.user.email?.split('@')[0] || 'User'
                }
              ])
              .select()
              .single();

            if (createError) throw createError;
            setName(newProfile.name);
          } else {
            throw error;
          }
        } else {
          setName(data.name);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      const targetUserId = userId || session.user.id;
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('user_id', targetUserId);

      if (error) throw error;

      setSuccess('Profile updated successfully');
      if (userId) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          {userId && (
            <button
              onClick={() => router.push('/admin/users')}
              className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Users
            </button>
          )}

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h2>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Enter your display name"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      This name will be displayed across the application
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon: Configure your notification preferences
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <ShieldCheckIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon: Manage your security preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfileSettings() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileContent />
    </Suspense>
  );
} 