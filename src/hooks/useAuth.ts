
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'client' | 'admin' | 'chauffeur';

interface AuthState {
  user: User | null;
  session: any | null;
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
        setAuthState(prevState => ({ ...prevState, loading: true, error: null }));

        const { data: { session } } = await supabase.auth.getSession();

        setAuthState({
          user: session?.user || null,
          session: session || null,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error.message || 'Failed to get session',
        });
      }
    };

    getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false,
        error: null,
      });
    });
  }, []);

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

  const signOut = async () => {
    try {
      setAuthState(prevState => ({ ...prevState, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthState({ 
        user: null, 
        session: null, 
        loading: false, 
        error: null,
        isAuthenticated: false,
        role: null
      });
    } catch (error: any) {
      setAuthState(prevState => ({ 
        ...prevState, 
        loading: false, 
        error: error.message,
        isAuthenticated: false,
        role: null
      }));
    }
  };

  return {
    ...authState,
    signOut,
    fetchUserProfile
  };
};
