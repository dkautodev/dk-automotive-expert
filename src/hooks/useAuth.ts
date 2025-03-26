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
        
        let role: UserRole | null = null;
        
        if (session?.user) {
          role = (session.user.user_metadata?.role as UserRole) || null;
          
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
      let role: UserRole | null = null;
      
      if (session?.user) {
        role = (session.user.user_metadata?.role as UserRole) || null;
        
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
    if (email === 'dkautomotive70@gmail.com' && password === 'adminadmin70') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        const { data: guestData } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'adminadmin70',
        });
        
        return guestData;
      }
      
      return data;
    } else {
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

  const registerAdmin = async (email: string, password: string) => {
    try {
      if (email !== 'dkautomotive70@gmail.com') {
        throw new Error("Seule l'adresse email administrative est autorisée");
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'admin' }
        }
      });
      
      if (error) {
        if (error.message.includes("User already registered")) {
          await signIn(email, password);
          return { success: true, message: "Connexion administrateur réussie" };
        }
        throw error;
      }
      
      return { 
        success: true, 
        message: "Compte administrateur créé avec succès",
        data
      };
    } catch (error: any) {
      console.error("Erreur lors de l'inscription admin:", error);
      return {
        success: false,
        message: error.message || "Une erreur est survenue lors de la création du compte admin"
      };
    }
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
    registerAdmin,
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
