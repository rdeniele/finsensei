'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!session) {
          router.push('/auth/signin');
          return;
        }
      } catch (error) {
        console.error('ProtectedRoute - Session check error:', error);
        router.push('/auth/signin');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [session, router]);

  if (loading || isCheckingSession) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 