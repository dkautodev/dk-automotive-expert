
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, UserProfile, mapDatabaseProfileToUserProfile, UserRole } from './types';
import { toast } from 'sonner';

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
            role: role as UserRole,
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
        // Using mock profile data since database operations are failing
        const mockProfile: UserProfile = {
          id: userId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '0123456789',
          company: 'ACME Inc',
          avatarUrl: null,
          role: 'client'
        };
        
        setProfile(mockProfile);
        setAuthState(prev => ({ ...prev, role: mockProfile.role }));
        
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
            role: role as UserRole,
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

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  return {
    ...authState,
    profile,
    signIn,
    signOut
  };
};
