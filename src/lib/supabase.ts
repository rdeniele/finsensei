import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Generate a storage key based on the project URL
const storageKey = `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey,
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') return null;
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
      },
    },
  },
});

// Types for our database tables
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id: string | null;
  transaction_type: 'income' | 'expense' | 'transfer';
  source: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
} 