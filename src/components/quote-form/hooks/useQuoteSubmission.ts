
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
      console.log('With additional info - Distance:', distance, 'Price HT:', priceHT, 'Price TTC:', priceTTC, 'Is Per Km:', isPerKm);
      
      // Prepare the data for submission including price information
      const submissionData = {
        ...data,
        distance: distance ? `${distance} km` : undefined,
        priceHT,
        priceTTC,
        isPerKm
      };
      
      // Call the Supabase edge function to send the quote request
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'send-quote-request', 
        {
          body: submissionData
        }
      );
      
      if (functionError) {
        console.error('Error from edge function:', functionError);
        throw new Error(functionError.message || 'Error in send-quote-request function');
      }
      
      console.log('Response from send-quote-request function:', responseData);
      
      // Display success message
      toast.success('Votre demande de devis a été envoyée avec succès !');
      
      // Reset form and go back to step 1
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
