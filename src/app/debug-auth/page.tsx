'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugAuthPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResult('Testing Supabase connection...\n');

    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setTestResult(prev => prev + `❌ Database connection failed: ${error.message}\n`);
      } else {
        setTestResult(prev => prev + `✅ Database connection successful\n`);
      }

      // Test auth configuration
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setTestResult(prev => prev + `❌ Auth configuration error: ${authError.message}\n`);
      } else {
        setTestResult(prev => prev + `✅ Auth configuration successful\n`);
      }

      setTestResult(prev => prev + '\n📋 Next Steps:\n');
      setTestResult(prev => prev + '1. Go to Supabase Dashboard > Authentication > Settings\n');
      setTestResult(prev => prev + '2. Ensure "Enable email signups" is ON\n');
      setTestResult(prev => prev + '3. Ensure "Enable email confirmations" is ON\n');
      setTestResult(prev => prev + '4. Check Site URL is set to http://localhost:3000\n');
      setTestResult(prev => prev + '5. Add http://localhost:3000/** to Redirect URLs\n');

    } catch (error: any) {
      setTestResult(prev => prev + `❌ Unexpected error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Debug
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Supabase Configuration Test
          </h2>
          
          <button
            onClick={testSupabaseConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Test Results:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-sm whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Manual Fix Instructions
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">1. Check Supabase Authentication Settings</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to <strong>Authentication {'>'}{' '}Settings</strong></li>
                <li>Ensure <strong>"Enable email signups"</strong> is turned ON</li>
                <li>Ensure <strong>"Enable email confirmations"</strong> is turned ON</li>
                <li>Make sure <strong>"Disable anonymous sign-ins"</strong> is OFF</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">2. Check Site URL Configuration</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>In Authentication {'>'}{' '}Settings, set <strong>Site URL</strong> to: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">http://localhost:3000</code></li>
                <li>Add <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">http://localhost:3000/**</code> to <strong>Redirect URLs</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">3. Apply Database Migrations</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Go to <strong>SQL Editor</strong> in Supabase dashboard</li>
                <li>Run the migration: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">20240324000001_fix_profile_creation.sql</code></li>
                <li>Run the migration: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">20240324000000_update_daily_coins_to_20.sql</code></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">4. Test Signup Again</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>After making these changes, try signing up again</li>
                <li>Check the browser console for any error messages</li>
                <li>If issues persist, check the Supabase logs in the dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 