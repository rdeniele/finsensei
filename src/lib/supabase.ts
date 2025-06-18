import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Configuration error. Please contact support.');
  throw new Error('Missing required environment variables for Supabase');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'finsensei_auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development'
  }
});

let authInitialized = false;
let initializationPromise: Promise<any> | null = null;

// Enhanced auth methods with better error handling
export const auth = {
  initialize: async () => {
    // Return existing initialization if in progress
    if (initializationPromise) {
      return initializationPromise;
    }

    // Return early if already initialized
    if (authInitialized) {
      return { session: null, error: null };
    }

    // Create new initialization promise
    initializationPromise = new Promise(async (resolve) => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        authInitialized = true;
        resolve({ session, error: null });
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        resolve({
          session: null,
          error: {
            message: error.message || 'Failed to initialize authentication.'
          }
        });
      } finally {
        initializationPromise = null;
      }
    });

    return initializationPromise;
  },

  signIn: async (email: string, password: string) => {
    try {
      // Ensure auth is initialized
      await auth.initialize();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Failed to sign in. Please try again.'
        }
      };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      // Ensure auth is initialized
      await auth.initialize();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        data: null,
        error: {
          message: error.message || 'Failed to sign up. Please try again.'
        }
      };
    }
  },

  signOut: async () => {
    try {
      // Clear local storage before signing out
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('finsensei_auth');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Reset initialization flag
      authInitialized = false;
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return {
        error: {
          message: error.message || 'Failed to sign out. Please try again.'
        }
      };
    }
  },

  getCurrentSession: async () => {
    try {
      // Ensure auth is initialized
      await auth.initialize();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: any) {
      console.error('Get session error:', error);
      return {
        session: null,
        error: {
          message: error.message || 'Failed to get current session.'
        }
      };
    }
  }
};

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