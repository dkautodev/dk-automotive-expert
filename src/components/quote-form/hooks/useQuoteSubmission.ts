
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useQuoteSubmission = (
  form: UseFormReturn<QuoteFormValues>,
  setLoading: (loading: boolean) => void,
  setStep: (step: number) => void,
  distance: number | null,
  priceHT: string | null,
  priceTTC: string | null
) => {
  const onSubmit = async (data: QuoteFormValues) => {
    console.log("Starting form submission with data:", data);
    setLoading(true);
    
    try {
      const formData = {
        ...data,
        distance: distance ? `${distance}` : "",
        priceHT,
        priceTTC
      };
      
      console.log("Sending quote request with data:", formData);
      
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error("Informations de contact manquantes");
      }
      
      console.log("Envoi de la requête à la fonction Supabase...");
      
      const { data: responseData, error } = await supabase.functions.invoke('send-quote-request', {
        body: formData
      });

      if (error) {
        console.error("Error from function invocation:", error);
        throw new Error(`Erreur lors de l'appel de la fonction: ${error.message}`);
      }

      console.log("Quote request sent successfully, response:", responseData);
      toast.success(
        "Votre demande a été envoyée avec succès. Nous vous répondrons sous 24h."
      );
      form.reset();
      setStep(1);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error(`Une erreur est survenue lors de l'envoi de votre demande: ${error.message || "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit };
};
