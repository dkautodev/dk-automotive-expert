
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
      
      // Étape 1: Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { 
            role: 'client',
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            phone: data.phone
          }
        }
      });
      
      if (authError) {
        console.error("Erreur lors de la création dans Auth:", authError);
        throw new Error("Erreur lors de la création du compte: " + authError.message);
      }
      
      console.log("Utilisateur créé avec succès dans Supabase Auth:", authData);
      
      if (!authData.user) {
        throw new Error("Impossible de créer l'utilisateur");
      }
      
      // Mock user profile creation instead of accessing the database 
      console.log("Création du profil utilisateur avec les données:", {
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        company_name: data.company,
        phone: data.phone
      });
          
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
