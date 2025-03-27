
import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { SignUpFormData } from "../schemas/signUpSchema";
import { supabase } from '@/integrations/supabase/client';

export const useSignUpSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    
    try {
      // Ajouter des logs pour le débogage
      console.log("Envoi de la demande d'inscription avec les données:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone
      });
      
      // Étape 1: Créer l'utilisateur dans la table public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: data.email,
            password: data.password,
            user_type: 'client'
          }
        ])
        .select()
        .single();
        
      if (userError) {
        console.error("Erreur lors de la création de l'utilisateur:", userError);
        throw new Error("Erreur lors de la création de l'utilisateur. " + userError.message);
      }
      
      console.log("Utilisateur créé avec succès dans public.users:", userData);
      
      // Étape 2: Créer un profil pour cet utilisateur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userData.id,
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.company,
            phone: data.phone
          }
        ]);
        
      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        throw new Error("Erreur lors de la création du profil. " + profileError.message);
      }
      
      console.log("Profil créé avec succès");
      
      // Étape 3: Créer également un utilisateur dans Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { 
            role: 'client',
            firstName: data.firstName,
            lastName: data.lastName 
          }
        }
      });
      
      if (authError) {
        console.warn("Avertissement lors de la création dans Auth:", authError);
        // On ne bloque pas le processus si cette étape échoue
      }
        
      toast.success("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
      
      setTimeout(() => {
        navigate('/auth', { state: { email: data.email } });
      }, 2000);
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast.error(error.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
