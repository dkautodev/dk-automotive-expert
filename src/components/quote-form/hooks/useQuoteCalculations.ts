
import { useState } from 'react';
import { QuoteFormValues } from '../quoteFormSchema';
import { calculatePrice } from '@/utils/priceCalculator';
import { toast } from 'sonner';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';

export const useQuoteCalculations = (
  form: any,
  setDistance: (distance: number | null) => void,
  setPriceHT: (price: string | null) => void,
  setPriceTTC: (price: string | null) => void,
  setIsPerKm: (isPerKm: boolean) => void
) => {
  const { calculateDistance, isLoaded, isCalculating } = useDistanceCalculation();
  const [calculating, setCalculating] = useState(false);

  const calculateQuote = async (data: Partial<QuoteFormValues>): Promise<boolean> => {
    if (!isLoaded) {
      toast.error("L'API Google Maps n'est pas chargée");
      return false;
    }

    setCalculating(true);
    try {
      console.log("Calculating quote for addresses:", data.pickup_address, data.delivery_address);

      if (!data.pickup_address || !data.delivery_address) {
        toast.error("Veuillez entrer les adresses de départ et d'arrivée");
        return false;
      }

      if (!data.vehicle_type) {
        toast.error("Veuillez sélectionner un type de véhicule");
        return false;
      }

      // Calculer la distance entre les deux points
      const distanceKm = await calculateDistance(
        data.pickup_address,
        data.delivery_address
      );

      if (!distanceKm) {
        toast.error("Impossible de calculer la distance entre les deux adresses");
        return false;
      }

      console.log(`Distance calculated: ${distanceKm} km`);
      setDistance(distanceKm);

      // Calcul du prix basé sur le type de véhicule et la distance
      const priceResult = await calculatePrice(data.vehicle_type, distanceKm);
      if (!priceResult) {
        toast.error("Erreur lors du calcul du prix");
        return false;
      }

      console.log("Price calculation result:", priceResult);
      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      setIsPerKm(priceResult.isPerKm);

      return true;
    } catch (error) {
      console.error("Error calculating quote:", error);
      toast.error("Erreur lors du calcul du devis");
      return false;
    } finally {
      setCalculating(false);
    }
  };

  return {
    calculateQuote,
    calculating: calculating || isCalculating
  };
};
