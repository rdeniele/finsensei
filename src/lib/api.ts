import { createBrowserClient } from '@supabase/ssr';
import type { Account, Transaction } from './supabase';
import * as db from './db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

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

export const api = {
  // Auth
  signup: async (data: SignupRequest): Promise<AuthResponse | ErrorResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  signin: async (data: SigninRequest): Promise<AuthResponse | ErrorResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Accounts
  getAccounts: async (): Promise<Account[]> => {
    try {
      const session = await getSession();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  },

  createAccount: async (accountName: string, balance: number): Promise<Account> => {
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create account');
    }
  },

  updateAccount: async (accountId: string, updates: Partial<Account>): Promise<Account> => {
    try {
      const session = await getSession();
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update account');
    }
  },

  deleteAccount: async (accountId: string): Promise<void> => {
    try {
      const session = await getSession();
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  },
  
  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const session = await getSession();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'user_id'>): Promise<Transaction> => {
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create transaction');
    }
  },

  updateTransaction: async (transactionId: string, updates: Partial<Transaction>): Promise<Transaction> => {
    try {
      const session = await getSession();
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update transaction');
    }
  },

  deleteTransaction: async (transactionId: string): Promise<void> => {
    try {
      const session = await getSession();
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  },

  getFinancialAdvice: async (token: string): Promise<Response> => {
    return fetch(`${API_BASE_URL}/coach/advice/`, {
      headers: { 'Authorization': `Token ${token}` }
    });
  }
};