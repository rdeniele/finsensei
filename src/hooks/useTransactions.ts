import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return { transactions, loading, error };
}; 