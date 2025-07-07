'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      try {
        if (!loading && user) {
          setIsRedirecting(true);
          await router.push('/dashboard');
        }
      } catch (error) {
        setIsRedirecting(false);
      }
    };
 
    redirect();
  }, [user, loading, router]);

  // Show enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="text-center space-y-6 sm:space-y-8 max-w-sm mx-auto relative z-10">
          <div className="relative">
            <div className="scale-75 sm:scale-100 transform transition-transform duration-500">
              <LoadingSpinner />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">
              Loading FinSensei
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4 animate-fade-in animation-delay-300">
              Preparing your financial dashboard...
            </p>
          </div>
          
          {/* Enhanced loading indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show enhanced redirecting state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="text-center space-y-6 sm:space-y-8 max-w-sm mx-auto relative z-10">
        <div className="relative">
          <div className="scale-75 sm:scale-100 transform transition-transform duration-500">
            <LoadingSpinner />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-400 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">
            Welcome back!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4 animate-fade-in animation-delay-300">
            Redirecting to your dashboard...
          </p>
        </div>
        
        {/* Enhanced progress indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Success message with icon */}
        <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 animate-fade-in animation-delay-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Authentication successful</span>
        </div>
      </div>
    </div>
  );
}