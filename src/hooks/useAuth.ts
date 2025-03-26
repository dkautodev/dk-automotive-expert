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
        
        // Déterminer le rôle de l'utilisateur
        let role: UserRole | null = null;
        
        if (session?.user) {
          // Vérifier si le rôle est dans les métadonnées
          role = (session.user.user_metadata?.role as UserRole) || null;
          
          // Si le rôle n'est pas dans les métadonnées, vérifier si l'email est celui de l'admin
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
      // Déterminer le rôle de l'utilisateur
      let role: UserRole | null = null;
      
      if (session?.user) {
        // Vérifier si le rôle est dans les métadonnées
        role = (session.user.user_metadata?.role as UserRole) || null;
        
        // Si le rôle n'est pas dans les métadonnées, vérifier si l'email est celui de l'admin
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

  const signIn = async (email: string, password: string) => {
    // Vérifier si l'utilisateur est l'admin avec le mot de passe codé en dur
    if (email === 'dkautomotive70@gmail.com' && password === 'adminadmin70') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Si la connexion échoue parce que le mot de passe dans Supabase est différent
      // On continue quand même car on vérifie manuellement le mot de passe
      if (error) {
        // Tenter de se connecter comme invité pour avoir une session
        const { data: guestData } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'adminadmin70',  // Utiliser le nouveau mot de passe
        });
        
        return guestData;
      }
      
      return data;
    } else {
      // Connexion normale pour les autres utilisateurs
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    }
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
      .select('*, users(email)')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    const userEmail = (profileData.users as { email: string })?.email || '';

    return {
      ...profileData,
      email: userEmail,
      company: profileData.company_name,
      siret: profileData.siret_number,
      siret_locked: false,
      vat_number_locked: false
    };
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
