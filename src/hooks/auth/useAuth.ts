
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserProfile, mapDatabaseProfileToUserProfile } from './types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    role: null,
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          const user = session.user;
          const role = user?.user_metadata?.role || 'client';
          
          setAuthState({
            user,
            session,
            loading: false,
            error: null,
            isAuthenticated: true,
            role: role,
          });
          
          // Fetch user profile
          await fetchUserProfile(user.id);
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            role: null,
          });
        }
      } catch (error: any) {
        console.error('Error fetching session:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error.message,
          isAuthenticated: false,
          role: null,
        });
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          throw error;
        }
        
        const userProfile = mapDatabaseProfileToUserProfile(data);
        setProfile(userProfile);
        
        // Update role from profile
        if (userProfile?.role) {
          setAuthState(prev => ({ ...prev, role: userProfile.role }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchInitialSession();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          const role = user?.user_metadata?.role || 'client';
          
          setAuthState({
            user,
            session,
            loading: false,
            error: null,
            isAuthenticated: true,
            role: role,
          });
          
          // Fetch user profile
          await fetchUserProfile(user.id);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            role: null,
          });
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    ...authState,
    profile,
  };
};
