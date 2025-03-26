
import { useState } from 'react';
import { getPriceForVehicleAndDistance } from '@/services/pricingGridsService';
import { calculateTTC } from '@/utils/priceCalculations';

export const usePriceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = async (vehicleTypeId: string, distance: number) => {
    try {
      setIsCalculating(true);
      setError(null);
      
      const result = await getPriceForVehicleAndDistance(vehicleTypeId, distance);
      
      const priceHTString = result.priceHT.toString();
      const priceTTCString = calculateTTC(priceHTString);
      
      setPriceHT(priceHTString);
      setPriceTTC(priceTTCString);
      
      setIsCalculating(false);
      return { priceHT: priceHTString, priceTTC: priceTTCString };
    } catch (err: any) {
      setError(err.message || 'Erreur lors du calcul du prix');
      setIsCalculating(false);
      throw err;
    }
  };

  return {
    calculatePrice,
    isCalculating,
    priceHT,
    priceTTC,
    error
  };
};
