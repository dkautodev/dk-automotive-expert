
import { useState } from 'react';
import { toast } from 'sonner';
import { QuoteFormValues } from '../quoteFormSchema';
import { supabase } from '@/integrations/supabase/client';

export const useQuoteSubmission = (
  form: any,  
  setLoading: (loading: boolean) => void,
  setStep: (step: number) => void,
  distance: number | null,
  priceHT: string | null,
  priceTTC: string | null
) => {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: QuoteFormValues): Promise<{ success: boolean; error?: any }> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Envoi du devis avec les données:', data);
      console.log('Calculs - Distance:', distance, 'Prix HT:', priceHT, 'Prix TTC:', priceTTC);
      
      // Validation des champs obligatoires
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        console.error('Validation échouée:', errors);
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Préparation des données complètes
      const submissionData = {
        ...data,
        distance: distance ? distance.toString() : "Non calculée",
        priceHT: priceHT || "Non calculé",
        priceTTC: priceTTC || "Non calculé",
        timestamp: new Date().toISOString(),
        // Données formatées pour l'email
        contactEmail: data.email,
        destinationEmail: 'contact@dkautomotive.fr'
      };
      
      console.log('Données complètes à envoyer:', submissionData);
      
      // Appel de la fonction edge pour envoyer les emails
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'send-quote-request', 
        {
          body: submissionData
        }
      );
      
      if (functionError) {
        console.error('Erreur de la fonction edge:', functionError);
        throw new Error(functionError.message || 'Erreur lors de l\'envoi du devis');
      }
      
      console.log('Réponse de la fonction send-quote-request:', responseData);
      
      // Message de succès
      toast.success('Votre demande de devis a été envoyée avec succès ! Vous recevrez une copie par email.');
      
      // Reset du formulaire et retour à l'étape 1
      form.reset();
      setStep(1);
      
      return { success: true };
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      const errorMessage = error.message || 'Erreur inconnue lors de l\'envoi du devis';
      setError(errorMessage);
      toast.error('Erreur lors de l\'envoi du devis: ' + errorMessage);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return { onSubmit, error };
};
