
import { supabase } from '@/integrations/supabase/client';

export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      // Cas spécial pour l'administrateur
      if (email === 'dkautomotive70@gmail.com') {
        // Essayez d'abord de se connecter normalement avec Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error) {
          return data;
        }
        
        // Si la connexion échoue avec une erreur, créez un compte s'il n'existe pas
        console.log("Tentative de création d'un compte admin");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'admin' }
          }
        });
        
        if (!signUpError) {
          // Essayez de vous connecter à nouveau après l'inscription
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          return signInData;
        }
        
        throw error;
      } else {
        // Pour les utilisateurs réguliers, tentez d'abord de vous connecter via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!authError) {
          return authData;
        }
        
        // Si l'authentification Supabase échoue, essayez de vérifier dans la table public.users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
          
        if (userError || !userData) {
          throw new Error('Identifiant ou mot de passe incorrect');
        }
        
        // Vérifier si le mot de passe correspond
        if (userData.password !== password) {
          throw new Error('Identifiant ou mot de passe incorrect');
        }
        
        // Créer un utilisateur dans Supabase Auth pour maintenir la session
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'client' }
          }
        });
        
        if (signUpError) {
          // Si l'utilisateur existe déjà, tentez de vous connecter
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            throw signInError;
          }
          
          return signInData;
        }
        
        return signUpData;
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
      
      if (error) {
        // Vérifiez si l'utilisateur existe déjà
        if (error.message.includes("User already registered")) {
          // Essayez de mettre à jour le rôle de l'utilisateur à la place
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
