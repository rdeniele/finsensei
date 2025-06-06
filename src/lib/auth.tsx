'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  currency: string; // e.g., 'USD', 'EUR', 'GBP', etc.
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateCurrency: (currency: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/auth/signin', '/auth/signup'];

// Default currency if none is set
const DEFAULT_CURRENCY = 'USD';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      // Ensure user has a currency set
      if (!parsedUser.currency) {
        parsedUser.currency = DEFAULT_CURRENCY;
      }
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    
    if (!token && !isPublicPath) {
      // Redirect to sign in if not authenticated and trying to access protected route
      router.push('/auth/signin');
    } else if (token && isPublicPath) {
      // Redirect to dashboard if authenticated and trying to access auth pages
      router.push('/dashboard');
    }
  }, [token, pathname, isLoading, router]);

  const login = (newToken: string, newUser: User) => {
    // Ensure user has a currency set
    if (!newUser.currency) {
      newUser.currency = DEFAULT_CURRENCY;
    }
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/auth/signin');
  };

  const updateCurrency = (currency: string) => {
    if (user) {
      const updatedUser = { ...user, currency };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
      updateCurrency
    }}>
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

export function setUserData(userData: UserData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
} 