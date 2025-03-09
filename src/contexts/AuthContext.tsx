
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  isLoading: false, // Set to false by default
  isAuthenticated: true, // Set to true to always bypass auth checks
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false to prevent loading state

  // Auth listener is still implemented but authentication is bypassed
  useEffect(() => {
    const getSession = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      }
    };

    // Get the initial session
    getSession();

    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // Cleanup on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Override the isAuthenticated value to always return true
  const value = {
    session,
    user,
    isLoading,
    isAuthenticated: true, // Always set to true to bypass authentication
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
