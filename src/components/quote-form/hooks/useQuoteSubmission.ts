
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
  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\\/g, '&#92;');
  };

  const sanitizeFormData = (data: QuoteFormValues): QuoteFormValues => {
    const sanitized = { ...data };
    
    // Sanitize string fields
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key as keyof QuoteFormValues];
      if (typeof value === 'string') {
        sanitized[key as keyof QuoteFormValues] = sanitizeInput(value) as any;
      }
    });
    
    return sanitized;
  };

  const onSubmit = async (data: QuoteFormValues) => {
    console.log("Starting form submission with data:", data);
    setLoading(true);
    
    try {
      // Sanitize all input data to prevent XSS
      const sanitizedData = sanitizeFormData(data);
      
      // Set default values for required fields that might be missing
      if (!sanitizedData.pickupStreetNumber) sanitizedData.pickupStreetNumber = "N/A";
      if (!sanitizedData.pickupStreetName) sanitizedData.pickupStreetName = "N/A";
      if (!sanitizedData.pickupPostalCode) sanitizedData.pickupPostalCode = "N/A";
      if (!sanitizedData.pickupCity) sanitizedData.pickupCity = "N/A";
      if (!sanitizedData.deliveryStreetNumber) sanitizedData.deliveryStreetNumber = "N/A";
      if (!sanitizedData.deliveryStreetName) sanitizedData.deliveryStreetName = "N/A";
      if (!sanitizedData.deliveryPostalCode) sanitizedData.deliveryPostalCode = "N/A";
      if (!sanitizedData.deliveryCity) sanitizedData.deliveryCity = "N/A";
      
      // Vérifiez que les adresses complètes sont bien présentes
      if (!sanitizedData.pickup_address || !sanitizedData.delivery_address) {
        throw new Error("Les adresses de départ et d'arrivée sont requises");
      }
      
      const formData = {
        ...sanitizedData,
        distance: distance ? `${distance}` : "",
        priceHT,
        priceTTC
      };
      
      console.log("Sending quote request with data:", formData);
      
      // Vérification de sécurité supplémentaire pour les informations de contact
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error("Informations de contact manquantes");
      }
      
      // Limiter la fréquence des requêtes pour prévenir les attaques par déni de service
      const requestKey = `quote_request_${formData.email}`;
      const lastRequest = localStorage.getItem(requestKey);
      
      if (lastRequest) {
        const timeSinceLastRequest = Date.now() - parseInt(lastRequest);
        if (timeSinceLastRequest < 60000) { // 60 secondes
          throw new Error("Veuillez attendre une minute avant de soumettre un nouveau formulaire");
        }
      }
      
      localStorage.setItem(requestKey, Date.now().toString());
      
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
