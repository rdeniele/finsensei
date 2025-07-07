import type { Account, Transaction } from '@/types/supabase';
import * as db from './db';
import { supabase } from './supabase';
import { withRetry, RateLimitError } from './rateLimit';

const API_BASE_URL = '/api'; // This should use the rewrite path, not the full Railway URL

// Define interface types for API requests and responses
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  name: string;
  email: string;
}

export interface ErrorResponse {
  error: string;
}

export interface Advice {
  content: string;
  timestamp: string;
}

export { type Account, type Transaction };

// Get the current session
const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  return session;
};

// Helper function to check for rate limit errors
const checkRateLimit = (error: any) => {
  if (error?.message?.includes('rate limit') || error?.code === '429') {
    throw new RateLimitError('Rate limit reached');
  }
  throw error;
};

export const api = {
  // Auth
  signup: async (data: SignupRequest): Promise<AuthResponse | ErrorResponse> => {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (response.status === 429) {
        throw new RateLimitError('Rate limit reached');
      }
      return response.json();
    });
  },

  signin: async (data: SigninRequest): Promise<AuthResponse | ErrorResponse> => {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}/auth/signin/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (response.status === 429) {
        throw new RateLimitError('Rate limit reached');
      }
      return response.json();
    });
  },

  // Accounts
  getAccounts: async (): Promise<Account[]> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) checkRateLimit(error);
        return data || [];
      } catch (error) {
        checkRateLimit(error);
        throw new Error('Failed to fetch accounts');
      }
    });
  },

  createAccount: async (accountName: string, balance: number): Promise<Account> => {
    return withRetry(async () => {
      try {
        if (!accountName || accountName.length > 100) {
          throw new Error('Account name must be between 1 and 100 characters');
        }
        
        const session = await getSession();
        const { data, error } = await supabase
          .from('accounts')
          .insert([
            {
              user_id: session.user.id,
              account_name: accountName,
              balance: balance
            }
          ])
          .select()
          .single();

        if (error) checkRateLimit(error);
        return data;
      } catch (error) {
        checkRateLimit(error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create account');
      }
    });
  },

  updateAccount: async (accountId: string, updates: Partial<Account>): Promise<Account> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { data, error } = await supabase
          .from('accounts')
          .update(updates)
          .eq('id', accountId)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) checkRateLimit(error);
        return data;
      } catch (error) {
        checkRateLimit(error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update account');
      }
    });
  },

  deleteAccount: async (accountId: string): Promise<void> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { error } = await supabase
          .from('accounts')
          .delete()
          .eq('id', accountId)
          .eq('user_id', session.user.id);

        if (error) checkRateLimit(error);
      } catch (error) {
        checkRateLimit(error);
        throw new Error('Failed to delete account');
      }
    });
  },
  
  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: false });

        if (error) checkRateLimit(error);
        return data || [];
      } catch (error) {
        checkRateLimit(error);
        throw new Error('Failed to fetch transactions');
      }
    });
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'user_id'>): Promise<Transaction> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { data, error } = await supabase
          .from('transactions')
          .insert([
            {
              ...transaction,
              user_id: session.user.id
            }
          ])
          .select()
          .single();

        if (error) checkRateLimit(error);
        return data;
      } catch (error) {
        checkRateLimit(error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create transaction');
      }
    });
  },

  updateTransaction: async (transactionId: string, updates: Partial<Transaction>): Promise<Transaction> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { data, error } = await supabase
          .from('transactions')
          .update(updates)
          .eq('id', transactionId)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) checkRateLimit(error);
        return data;
      } catch (error) {
        checkRateLimit(error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update transaction');
      }
    });
  },

  deleteTransaction: async (transactionId: string): Promise<void> => {
    return withRetry(async () => {
      try {
        const session = await getSession();
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', transactionId)
          .eq('user_id', session.user.id);

        if (error) checkRateLimit(error);
      } catch (error) {
        checkRateLimit(error);
        throw new Error('Failed to delete transaction');
      }
    });
  },

  getFinancialAdvice: async (token: string): Promise<Response> => {
    return withRetry(async () => {
      const response = await fetch(`${API_BASE_URL}/coach/advice/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (response.status === 429) {
        throw new RateLimitError('Rate limit reached');
      }
      return response;
    });
  }
};