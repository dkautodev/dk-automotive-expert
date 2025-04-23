
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';

export const useQuoteCalculations = (
  form: UseFormReturn<QuoteFormValues>,
  setDistance: (distance: number) => void,
  setPriceHT: (price: string) => void,
  setPriceTTC: (price: string) => void
) => {
  const { calculateDistance } = useDistanceCalculation();
  const { calculatePrice } = usePriceCalculation();

  const calculateQuote = async (data: Partial<QuoteFormValues>) => {
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

      return true;
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error("Erreur lors du calcul de la distance et du prix");
      return false;
    }
  };

  return { calculateQuote };
};
