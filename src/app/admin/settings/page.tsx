'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface Settings {
  id?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  two_factor_auth: boolean;
  language: string;
  timezone: string;
  maintenance_mode: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    email_notifications: true,
    push_notifications: true,
    two_factor_auth: false,
    language: 'en',
    timezone: 'UTC',
    maintenance_mode: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default settings
          const { data: newSettings, error: insertError } = await supabase
            .from('settings')
            .insert([settings])
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newSettings);
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setError(error.message || 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setError(null);
      setSuccess(null);

      const { error } = await supabase
        .from('settings')
        .upsert({ ...settings, ...newSettings });

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...newSettings }));
      setSuccess('Settings updated successfully');
    } catch (error: any) {
      console.error('Error updating settings:', error);
      setError(error.message || 'Failed to update settings');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage platform settings and configurations
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* Notifications Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <BellIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ email_notifications: !settings.email_notifications })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.email_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.email_notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications in your browser
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ push_notifications: !settings.push_notifications })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.push_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.push_notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Security
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Two-Factor Authentication
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ two_factor_auth: !settings.two_factor_auth })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.two_factor_auth ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.two_factor_auth ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Platform
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Temporarily disable the platform for maintenance
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ maintenance_mode: !settings.maintenance_mode })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.maintenance_mode ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.maintenance_mode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-gray-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Localization
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSettings({ timezone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 