'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, auth } from './supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
  const authStateChangeTimeout = useRef<NodeJS.Timeout>();
  const mounted = useRef(false);

  const handleAuthStateChange = useCallback(async (event: string, currentSession: Session | null) => {
    if (!mounted.current) return;

    // Clear any existing timeout
    if (authStateChangeTimeout.current) {
      clearTimeout(authStateChangeTimeout.current);
    }

    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user as User);
        
        // Only redirect if on an auth page
        if (pathname?.startsWith('/auth/')) {
          router.replace('/dashboard');
          toast.success('Successfully signed in!');
        }
      }
    } else if (event === 'SIGNED_OUT') {
      setSession(null);
      setUser(null);
      
      // Only redirect if not already on an auth page or home page
      if (!pathname?.startsWith('/auth/') && pathname !== '/') {
        router.replace('/auth/signin');
        toast.success('Successfully signed out!');
      }
    }

    // Set a timeout to ensure loading state is cleared
    authStateChangeTimeout.current = setTimeout(() => {
      if (mounted.current) {
        setLoading(false);
      }
    }, 250);
  }, [router, pathname]);

  useEffect(() => {
    mounted.current = true;

    const initializeAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        // Get current session first
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          toast.error('Failed to initialize session');
          throw sessionError;
        }

        if (mounted.current) {
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user as User);
            
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
        }
      } catch (error) {
        if (mounted.current) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initialize auth
    initializeAuth();

    return () => {
      mounted.current = false;
      if (authStateChangeTimeout.current) {
        clearTimeout(authStateChangeTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, router, pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (!data.session) {
        const noSessionError = new Error('No session returned');
        toast.error(noSessionError.message);
        return { error: noSessionError };
      }

      setSession(data.session);
      setUser(data.user as User);
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { error };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
        toast.error(error.message);
        return { error };
      }

      toast.success('Please check your email to verify your account');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      return { error };
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      router.replace('/');
    } catch (error: any) {
      toast.error('Failed to sign out');
      throw error;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
    return localStorage.getItem('finsensei_auth');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('finsensei_auth', token);
  }
} 