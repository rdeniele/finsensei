'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type SigninRequest, type AuthResponse, type ErrorResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signinData: SigninRequest = { email, password };
      const response: AuthResponse | ErrorResponse = await api.signin(signinData);
      
      if ('token' in response) {
        // It's an AuthResponse
        login(response.token, {
          id: String(response.user_id),
          name: response.name,
          email: response.email,
          currency: 'USD' // Default currency
        });
      } else {
        // It's an ErrorResponse
        setError(response.error || 'Sign in failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <span>Don&apos;t have an account? </span>
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}