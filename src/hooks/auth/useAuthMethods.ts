
import { supabase } from '@/integrations/supabase/client';

export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      // Special handling for admin
      if (email === 'dkautomotive70@gmail.com' && password === 'adminadmin70') {
        // Try to sign in normally first
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error) {
          return data;
        }
        
        // If sign-in fails with error, create account if it doesn't exist
        console.log("Tentative de création d'un compte admin");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'admin' }
          }
        });
        
        if (!signUpError) {
          // Try to sign in again after signup
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          return signInData;
        }
        
        throw error;
      } else {
        // Regular sign in for other users
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        return data;
      }
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
    return await supabase.auth.signOut();
  };

  const registerAdmin = async (email: string, password: string) => {
    try {
      // Check if this is the designated admin email
      if (email !== 'dkautomotive70@gmail.com') {
        throw new Error("Seule l'adresse email administrative est autorisée");
      }
      
      // Attempt to create an admin account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'admin' }
        }
      });
      
      if (error) {
        // Check if user already exists
        if (error.message.includes("User already registered")) {
          // Try to update the user's role instead
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

  return {
    signIn,
    signUp,
    signOut,
    registerAdmin
  };
};
