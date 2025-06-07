import { useState, useEffect } from 'react';
import { Account } from '@/lib/api';
import { useAuth } from '@/lib/auth';

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
        const response = await fetch('/api/accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data = await response.json();
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