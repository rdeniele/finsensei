'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type User = SupabaseUser & {
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    currency?: string;
  };
  currency?: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  const handleAuthStateChange = useCallback(async (event: string, currentSession: Session | null) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user as User);
        
        // Only redirect if on an auth page
        if (pathname?.startsWith('/auth/')) {
          router.replace('/dashboard');
        }
      }
    } else if (event === 'SIGNED_OUT') {
      setSession(null);
      setUser(null);
      
      // Only redirect if not already on an auth page or home page
      if (!pathname?.startsWith('/auth/') && pathname !== '/') {
        router.replace('/auth/signin');
      }
    }
    setLoading(false);
  }, [router, pathname]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          throw sessionError;
        }

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user as User);
          
          // Only redirect if on an auth page
          if (pathname?.startsWith('/auth/')) {
            router.replace('/dashboard');
          }
        } else {
          // Only redirect if not on a public route
          if (!pathname?.startsWith('/auth/') && pathname !== '/') {
            router.replace('/auth/signin');
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, handleAuthStateChange]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (!data.session) {
        return { error: new Error('No session returned') };
      }

      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        router.replace('/auth/verify');
        return { error: null };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      router.replace('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
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
      {children}
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