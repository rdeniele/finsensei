'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import TermsAndConditions from '@/components/TermsAndConditions';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Show terms and conditions before proceeding
    setShowTerms(true);
  };

  const handleAcceptTerms = async () => {
    setShowTerms(false);
    setLoading(true);

    try {
      // Use the test API to get more detailed error information
      const response = await fetch('/api/test-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Signup API error:', result);
        
        // Handle specific error cases
        if (result.error?.includes('Anonymous sign-ins are disabled')) {
          throw new Error('Signup is currently disabled. Please contact support.');
        } else if (result.error?.includes('already registered')) {
          throw new Error("This email is already registered. Please sign in instead.");
        } else {
          throw new Error(result.error || 'Failed to create account. Please try again.');
        }
      }

      setIsVerificationSent(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineTerms = () => {
    setShowTerms(false);
    setError('You must accept the Terms and Conditions to create an account.');
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Verify Your Email</h2>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
              We&apos;ve sent a verification link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t see the email? Check your spam folder as well.
            </p>
          </div>
          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Create an Account</h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            Join FinSensei to start managing your finances
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 bg-white"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 bg-white"
              placeholder="Create a password"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 bg-white"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            By creating an account, you agree to our{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Terms and Conditions
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner />
                <span className="ml-2">Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <TermsAndConditions
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
          type="signup"
        />
      )}
    </div>
  );
}