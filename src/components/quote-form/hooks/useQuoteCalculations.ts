
import { useState } from 'react';
import { toast } from 'sonner';
import { QuoteFormValues } from '../quoteFormSchema';
import { calculatePrice } from '@/utils/priceCalculator';

export const useQuoteCalculations = (
  form: any,
  setDistance: (distance: number | null) => void,
  setPriceHT: (price: string | null) => void,
  setPriceTTC: (price: string | null) => void,
  setIsPerKm: (isPerKm: boolean) => void
) => {
  const [calculating, setCalculating] = useState(false);

  const calculateQuote = async (data: Partial<QuoteFormValues>) => {
    if (!data.vehicle_type || !data.pickup_address || !data.delivery_address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    setCalculating(true);
    try {
      // Simulate distance calculation (in a real app, you'd use a mapping API)
      const distanceData = await simulateDistanceCalculation(
        data.pickup_address!,
        data.delivery_address!
      );

      if (!distanceData.success) {
        toast.error('Erreur lors du calcul de la distance: ' + distanceData.error);
        return false;
      }

      setDistance(distanceData.distance);

      // Calculate price based on vehicle type and distance
      const priceResult = await calculatePrice(data.vehicle_type!, distanceData.distance);

      if (!priceResult || priceResult.error) {
        toast.error('Erreur lors du calcul du prix: ' + (priceResult?.error || 'Prix non disponible'));
        return false;
      }

      console.log('Price calculation result:', priceResult);

      // Set price variables
      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      setIsPerKm(priceResult.isPerKm);

      return true;
    } catch (error: any) {
      console.error('Error during calculation:', error);
      toast.error('Erreur lors du calcul: ' + error.message);
      return false;
    } finally {
      setCalculating(false);
    }
  };

  // Function to simulate distance calculation
  const simulateDistanceCalculation = async (
    originAddress: string,
    destinationAddress: string
  ): Promise<{ success: boolean; distance: number; error?: string }> => {
    try {
      // In a real app, you'd use Google Maps API or similar
      // For demo purposes, we'll generate a random distance between 20 and 500 km
      const distance = Math.floor(Math.random() * 481) + 20;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        distance
      };
    } catch (error: any) {
      console.error('Distance calculation error:', error);
      return {
        success: false,
        distance: 0,
        error: error.message || 'Erreur inconnue'
      };
    }
  };

  return {
    calculateQuote,
    calculating
  };
};
