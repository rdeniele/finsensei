import { useState, useEffect } from 'react';
import { Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getAccounts } from '@/lib/db';

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
        const { data, error } = await getAccounts(user.id);
        
        if (error) {
          throw new Error(error);
        }

        setAccounts(data || []);
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