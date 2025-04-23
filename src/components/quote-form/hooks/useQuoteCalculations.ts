
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/priceCalculations';

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
      // Validation des adresses
      if (!data.pickup_address || !data.delivery_address) {
        toast.error("Les adresses de départ et d'arrivée sont requises");
        return false;
      }
      
      if (!data.vehicle_type) {
        toast.error("Le type de véhicule est requis");
        return false;
      }
      
      // Calculer la distance
      const calculatedDistance = await calculateDistance(
        data.pickup_address!,
        data.delivery_address!
      );
      
      if (calculatedDistance <= 0) {
        toast.error("Impossible de calculer la distance entre ces adresses");
        return false;
      }
      
      setDistance(calculatedDistance);
      
      // Calculer le prix
      const { priceHT: calculatedPriceHT, priceTTC: calculatedPriceTTC } = 
        await calculatePrice(data.vehicle_type!, calculatedDistance);
      
      // Formater les prix avec 2 décimales
      const formattedPriceHT = formatPrice(calculatedPriceHT);
      const formattedPriceTTC = formatPrice(calculatedPriceTTC);
      
      setPriceHT(formattedPriceHT);
      setPriceTTC(formattedPriceTTC);
      
      // Mettre à jour le formulaire avec ces valeurs
      form.setValue('distance', calculatedDistance.toString());
      form.setValue('price_ht', formattedPriceHT);
      form.setValue('price_ttc', formattedPriceTTC);

      return true;
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error("Erreur lors du calcul de la distance et du prix");
      return false;
    }
  };

  return { calculateQuote };
};
