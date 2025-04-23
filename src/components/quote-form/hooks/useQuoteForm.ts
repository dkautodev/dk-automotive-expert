
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { quoteFormSchema, type QuoteFormValues } from '../quoteFormSchema';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { supabase } from '@/integrations/supabase/client';

export const useQuoteForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  
  const { calculateDistance } = useDistanceCalculation();
  const { calculatePrice } = usePriceCalculation();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      mission_type: 'livraison',
      vehicle_type: '',
      brand: '',
      model: '',
      year: '',
      fuel: '',
      licensePlate: '',
      pickup_address: '',
      delivery_address: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      
      // Initialize address fields
      pickupStreetNumber: '',
      pickupStreetType: 'Rue',
      pickupStreetName: '',
      pickupComplement: '',
      pickupPostalCode: '',
      pickupCity: '',
      pickupCountry: 'France',
      
      deliveryStreetNumber: '',
      deliveryStreetType: 'Rue',
      deliveryStreetName: '',
      deliveryComplement: '',
      deliveryPostalCode: '',
      deliveryCity: '',
      deliveryCountry: 'France',
    }
  });

  const nextStep = async (data: Partial<QuoteFormValues>) => {
    if (step === 2) {
      try {
        // Calculer la distance
        const calculatedDistance = await calculateDistance(
          data.pickup_address!,
          data.delivery_address!
        );
        
        setDistance(calculatedDistance);
        
        // Calculer le prix
        const { priceHT: calculatedPriceHT, priceTTC: calculatedPriceTTC } = 
          await calculatePrice(data.vehicle_type!, calculatedDistance);
        
        setPriceHT(calculatedPriceHT);
        setPriceTTC(calculatedPriceTTC);
        
        // Mettre à jour le formulaire avec ces valeurs
        form.setValue('distance', calculatedDistance.toString());
        form.setValue('price_ht', calculatedPriceHT);
        form.setValue('price_ttc', calculatedPriceTTC);
      } catch (error) {
        console.error('Erreur lors du calcul:', error);
        toast.error("Erreur lors du calcul de la distance et du prix");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    
    try {
      console.log("Envoi de la demande de devis:", {
        ...data,
        distance,
        priceHT,
        priceTTC
      });
      
      const { error } = await supabase.functions.invoke('send-quote-request', {
        body: {
          ...data,
          distance: distance ? `${distance}` : "",
          priceHT,
          priceTTC
        }
      });

      if (error) {
        console.error("Erreur lors de l'appel de la fonction:", error);
        throw error;
      }

      toast.success(
        "Votre demande a été envoyée avec succès. Nous vous répondrons sous 24h."
      );
      form.reset();
      setStep(1);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande: " + (error.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    nextStep,
    prevStep,
    onSubmit
  };
};
