import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getAccounts } from '@/lib/db';
import type { Account } from '@/types/supabase';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getAccounts(user.id);
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  return { accounts, loading, error };
}; 