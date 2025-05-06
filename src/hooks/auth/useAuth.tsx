
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, User } from '@supabase/supabase-js';
import { AuthState, UserProfile } from './types';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Reset state to initial values
  const resetState = () => {
    setUser(null);
    setProfile(null);
  };

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // Get current user from supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          resetState();
          return;
        }
        
        if (user) {
          setUser(user);
          await fetchProfile();
        } else {
          resetState();
        }
      } catch (error) {
        console.error('Error in auth hook:', error);
        resetState();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setUser(session.user);
        await fetchProfile();
      } else {
        resetState();
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Fetch user profile
  const fetchProfile = async () => {
    try {
      // Mock profile data since we're not connecting to the database
      const mockProfileData = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        phone: '+33123456789',
        company: 'ACME Corp',
        role: 'client'
      };
      
      setProfile(mockProfileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      let message = 'Erreur lors de la connexion';
      
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          message = 'Email ou mot de passe invalide';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Veuillez confirmer votre email avant de vous connecter';
        }
      }
      
      toast.error(message);
      throw error;
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      resetState();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  // Memoize state to avoid unnecessary re-renders
  const state = useMemo<AuthState>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    profile,
    signIn,
    signOut,
    fetchProfile,
  }), [user, isLoading, profile]);

  return state;
};
