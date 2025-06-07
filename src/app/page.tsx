'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const redirect = async () => {
      try {
        if (!loading) {
          if (user) {
            await router.push('/dashboard');
          } else {
            await router.push('/auth/signin');
          }
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    redirect();
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner />
    </div>
  );
}