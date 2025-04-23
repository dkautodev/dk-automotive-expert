
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
  // Enhanced input sanitization with strong protection against XSS
  const sanitizeInput = (input: string): string => {
    if (!input) return '';
    
    return input
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\\/g, '&#92;')
      .replace(/`/g, '&#96;')
      .replace(/\$/g, '&#36;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;');
  };

  // Comprehensive form data sanitization
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

  // Validate email format with more strict regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate phone number format
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(?:\+33|0)[1-9](?:[\s.-]?[0-9]{2}){4}$/;
    return phoneRegex.test(phone);
  };

  // Enhanced form submission with additional security checks
  const onSubmit = async (data: QuoteFormValues) => {
    console.log("Starting form submission with data:", data);
    setLoading(true);
    
    try {
      // Verify critical form fields directly before submission
      if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.company) {
        throw new Error("Tous les champs de contact sont requis");
      }
      
      if (!validateEmail(data.email)) {
        throw new Error("Format d'email invalide");
      }
      
      if (!validatePhone(data.phone)) {
        throw new Error("Format de téléphone invalide");
      }
      
      // Sanitize all input data to prevent XSS
      const sanitizedData = sanitizeFormData(data);
      
      // Set default values for address fields that might be missing
      // This is necessary because the form might skip some structured address inputs
      // while still having the complete addresses from Google Maps
      if (!sanitizedData.pickup_address || !sanitizedData.delivery_address) {
        throw new Error("Les adresses de départ et d'arrivée sont requises");
      }
      
      // Limiter la fréquence des requêtes pour prévenir les attaques par déni de service
      const requestKey = `quote_request_${sanitizedData.email}`;
      const lastRequest = localStorage.getItem(requestKey);
      
      if (lastRequest) {
        const timeSinceLastRequest = Date.now() - parseInt(lastRequest);
        if (timeSinceLastRequest < 60000) { // 60 secondes
          throw new Error("Veuillez attendre une minute avant de soumettre un nouveau formulaire");
        }
      }
      
      localStorage.setItem(requestKey, Date.now().toString());
      
      // Format the form data for submission with prices
      const formData = {
        ...sanitizedData,
        distance: distance ? `${distance}` : "",
        priceHT,
        priceTTC
      };
      
      console.log("Sending quote request with data:", formData);
      
      // Envoi à la fonction Supabase avec timeout de 10 secondes
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000);
      
      // Call Supabase function with security headers
      const { data: responseData, error } = await supabase.functions.invoke('send-quote-request', {
        body: formData
      });
      
      clearTimeout(timeoutId);

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
