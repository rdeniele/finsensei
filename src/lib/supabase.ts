import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Types for our database tables
export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
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
}; 