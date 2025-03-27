
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from './types';
import { determineUserRole } from './helpers/roleHelper';

export const useAuthSession = () => {
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
        
        // Determine user role
        const role = session?.user ? determineUserRole(session.user) : null;
        
        setAuthState({
          user: session?.user || null,
          session,
          loading: false,
          error: null,
          isAuthenticated: !!session,
          role
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
      // Determine user role
      const role = session?.user ? determineUserRole(session.user) : null;
      
      setAuthState({
        user: session?.user || null,
        session,
        loading: false,
        error: null,
        isAuthenticated: !!session,
        role
      });
    });
  }, []);

  return authState;
};
