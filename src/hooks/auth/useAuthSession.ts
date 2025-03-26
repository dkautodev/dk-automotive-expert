
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserRole } from './types';

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
        let role: UserRole | null = null;
        
        if (session?.user) {
          // Check if role is in metadata
          role = (session.user.user_metadata?.role as UserRole) || null;
          
          // If role not in metadata, check if email is admin
          if (!role && session.user.email === 'dkautomotive70@gmail.com') {
            role = 'admin';
          }
        }
        
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
      let role: UserRole | null = null;
      
      if (session?.user) {
        // Check if role is in metadata
        role = (session.user.user_metadata?.role as UserRole) || null;
        
        // If role not in metadata, check if email is admin
        if (!role && session.user.email === 'dkautomotive70@gmail.com') {
          role = 'admin';
        }
      }
      
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
