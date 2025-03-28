
import { supabase } from '@/integrations/supabase/client';

export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      // Tentative de connexion via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erreur d'authentification:", error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      throw error;
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

  const signOut = async () => {
    await supabase.auth.signOut();
    return Promise.resolve();
  };

  const registerAdmin = async (email: string, password: string) => {
    try {
      // Vérifiez si c'est l'email administrateur désigné
      if (email !== 'dkautomotive70@gmail.com') {
        throw new Error("Seule l'adresse email administrative est autorisée");
      }
      
      // Tentative de création d'un compte administrateur
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'admin' }
        }
      });
      
      if (error) throw error;
      
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

  return {
    signIn,
    signUp,
    signOut,
    registerAdmin
  };
};
