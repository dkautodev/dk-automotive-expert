
import { useEffect, useState, useMemo } from 'react';
import { AuthState, UserProfile } from './types';
import { toast } from 'sonner';
import { mockAuthService } from '@/services/auth/mockAuthService';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
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
        const authState = await mockAuthService.getSession();
        
        setState({
          user: authState.user,
          session: authState.session,
          loading: false,
          error: null,
          isAuthenticated: authState.isAuthenticated,
          role: authState.user?.role as any,
        });
        
        if (authState.profile) {
          setProfile(authState.profile);
        }
      } catch (error: any) {
        console.error('Error fetching session:', error);
        setState({
          user: null,
          session: null,
          loading: false,
          error: error.message,
          isAuthenticated: false,
          role: null,
        });
      }
    };

    fetchInitialSession();

    // Mettre en place un observateur d'événements d'authentification
    const { unsubscribe } = mockAuthService.onAuthStateChange(
      async (authState) => {
        setState({
          user: authState.user,
          session: authState.session,
          loading: false,
          error: null,
          isAuthenticated: authState.isAuthenticated,
          role: authState.user?.role as any,
        });
        
        if (authState.profile) {
          setProfile(authState.profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const authState = await mockAuthService.signIn(email, password);
      
      // L'état sera mis à jour par l'observateur d'événements
      return authState;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await mockAuthService.signOut();
      // L'état sera mis à jour par l'observateur d'événements
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const fetchProfile = async () => {
    // Cette fonction n'est plus nécessaire car le profil est déjà inclus
    // dans l'état d'authentification dans notre mise en œuvre mockée
    console.log("fetchProfile appelé - cette fonction est maintenant un no-op");
  };

  return useMemo(() => ({
    ...state,
    profile,
    signIn,
    signOut,
    fetchProfile
  }), [state, profile]);
};
