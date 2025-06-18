import { createClient } from '@supabase/supabase-js';
import { RateLimitError } from './rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Helper function to check for rate limit errors
const isRateLimitError = (error: any): boolean => {
  return error?.message?.includes('rate limit') || 
         error?.code === '429' || 
         error?.message?.includes('Request rate limit reached');
};

// Helper function to get retry delay with exponential backoff
const getRetryDelay = (retryCount: number): number => {
  const delay = Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
    MAX_RETRY_DELAY
  );
  return delay + Math.random() * 1000; // Add jitter
};

// Wrapper function for authentication operations with retry logic
export const withAuthRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  let lastError: any;
  
  for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (isRateLimitError(error)) {
        if (retryCount < MAX_RETRIES - 1) {
          const delay = getRetryDelay(retryCount);
          console.log(`Rate limit hit for ${operationName}, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new RateLimitError(`Rate limit reached for ${operationName}`);
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

// Enhanced authentication methods with retry logic
export const signIn = async (email: string, password: string) => {
  return withAuthRetry(
    async () => {
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    'signIn'
  );
};

export const signUp = async (email: string, password: string) => {
  return withAuthRetry(
    async () => {
      const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    'signUp'
  );
};

export const signOut = async () => {
  return withAuthRetry(
    async () => {
      const { error } = await supabaseAuth.auth.signOut();
      if (error) throw error;
    },
    'signOut'
  );
};

export const resetPassword = async (email: string) => {
  return withAuthRetry(
    async () => {
      const { data, error } = await supabaseAuth.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    },
    'resetPassword'
  );
};

export const getSession = async () => {
  return withAuthRetry(
    async () => {
      const { data: { session }, error } = await supabaseAuth.auth.getSession();
      if (error) throw error;
      return session;
    },
    'getSession'
  );
};

export const getUser = async () => {
  return withAuthRetry(
    async () => {
      const { data: { user }, error } = await supabaseAuth.auth.getUser();
      if (error) throw error;
      return user;
    },
    'getUser'
  );
}; 