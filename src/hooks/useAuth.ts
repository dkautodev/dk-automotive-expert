import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'client' | 'admin' | 'chauffeur';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    role: null
  });

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthState({
          user: session?.user || null,
          session,
          loading: false,
          error: null,
          isAuthenticated: !!session,
          role: (session?.user?.user_metadata?.role as UserRole) || null
        });
      } catch (error: any) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error.message,
          isAuthenticated: false,
          role: null
        });
      }
    };

    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user || null,
        session,
        loading: false,
        error: null,
        isAuthenticated: !!session,
        role: (session?.user?.user_metadata?.role as UserRole) || null
      });
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, metadata: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  };

  const fetchUserProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    return profileData;
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut: async () => {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        role: null
      });
    },
    fetchUserProfile
  };
};
