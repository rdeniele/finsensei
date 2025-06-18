'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    if (!loading && !user && !isRedirecting) {
      setIsRedirecting(true);
      // Add a small delay before redirect to prevent flash
      redirectTimeout = setTimeout(() => {
        router.replace('/auth/signin');
      }, 100);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [loading, user, router, isRedirecting]);

  // Show loading spinner while checking auth or during redirect
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // If we have a user, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
} 