
import { useState } from 'react';
import { toast } from 'sonner';
import { QuoteFormValues } from '../quoteFormSchema';

export const useQuoteSubmission = (
  form: any,  
  setLoading: (loading: boolean) => void,
  setStep: (step: number) => void,
  distance: number | null,
  priceHT: string | null,
  priceTTC: string | null
) => {
  const onSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    
    try {
      console.log('Submitting quote with values:', data);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log price and distance info
      console.log('Price and distance information:', {
        distance,
        priceHT,
        priceTTC
      });
      
      // Simulate successful quote submission
      toast.success('Votre demande de devis a été envoyée avec succès !');
      
      // Reset form
      form.reset();
      
      // Reset to step 1
      setStep(1);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast.error('Erreur lors de l\'envoi du devis: ' + (error.message || 'Erreur inconnue'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return { onSubmit };
};
