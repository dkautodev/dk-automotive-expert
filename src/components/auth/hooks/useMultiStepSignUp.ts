
import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { CompleteSignUpType } from "../schemas/signUpStepSchema";
import { supabase } from '@/integrations/supabase/client';

export const useMultiStepSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: CompleteSignUpType) => {
    setIsLoading(true);
    
    try {
      // Construire l'adresse complète
      const formattedAddress = `${data.street}, ${data.postalCode} ${data.city}, ${data.country}`;
      
      console.log("Envoi de la demande d'inscription avec les données:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone,
        address: formattedAddress,
        siret: data.siret,
        vatNumber: data.vatNumber
      });
      
      // Créer l'utilisateur dans Supabase Auth
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
      
      // Créer un profil pour cet utilisateur
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            company_name: data.company,
            phone: data.phone,
            billing_address: formattedAddress,
            siret_number: data.siret,
            vat_number: data.vatNumber
          }
        ]);
        
      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        toast.warning("Votre compte a été créé mais votre profil n'a pas pu être enregistré complètement.");
      } else {
        console.log("Profil créé avec succès");
      }
          
      toast.success("Inscription réussie ! Veuillez vérifier votre boîte mail pour confirmer votre compte.");
      
      // Redirection immédiate vers la page d'authentification
      navigate('/auth', { state: { email: data.email } });
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast.error(error.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
