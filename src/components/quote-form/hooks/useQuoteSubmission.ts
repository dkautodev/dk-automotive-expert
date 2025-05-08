
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
  priceTTC: string | null,
  isPerKm: boolean = false
) => {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: QuoteFormValues): Promise<{ success: boolean; error?: any }> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting quote with values:', data);
      console.log('With additional calculations - Distance:', distance, 'Price HT:', priceHT, 'Price TTC:', priceTTC, 'Is Per Km:', isPerKm);
      
      // Validate required fields
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        console.error('Form validation failed:', errors);
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Prepare complete submission data
      const submissionData = {
        ...data,
        distance: distance ? distance.toString() : "Non calculée",
        priceHT: priceHT || "Non calculé",
        priceTTC: priceTTC || "Non calculé",
        isPerKm,
        // Add current timestamp
        timestamp: new Date().toISOString()
      };
      
      console.log('Complete submission data:', submissionData);
      
      // Call the edge function to send the quote request
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'send-quote-request', 
        {
          body: submissionData
        }
      );
      
      if (functionError) {
        console.error('Error from edge function:', functionError);
        throw new Error(functionError.message || 'Erreur lors de l\'envoi du devis');
      }
      
      console.log('Response from send-quote-request function:', responseData);
      
      // Show success message
      toast.success('Votre demande de devis a été envoyée avec succès !');
      
      // Reset form and return to step 1
      form.reset();
      setStep(1);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting quote:', error);
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
