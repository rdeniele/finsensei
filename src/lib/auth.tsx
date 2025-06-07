'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserData {
  currency?: string;
  name?: string;
}

interface User extends SupabaseUser {
  currency?: string;
  name?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;

      if (data?.user) {
        const userData: UserData = {
          currency: 'USD',
          name: email.split('@')[0]
        };
        setUserData(userData);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'Failed to create account. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function setUserData(userData: UserData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
} 