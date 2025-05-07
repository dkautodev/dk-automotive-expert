
import { useState } from 'react';
import { getPriceForVehicleAndDistance } from '@/services/pricing/localPricingGridsService';
import { calculateTTC, formatPrice } from '@/utils/priceCalculations';

export const usePriceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculer le prix en fonction du type de véhicule et de la distance
  const calculatePrice = async (vehicleType: string, distance: number) => {
    setIsCalculating(true);
    try {
      console.log(`Calculer le prix pour véhicule ${vehicleType} et distance ${distance}km`);
      
      // Obtenir le prix HT de la grille tarifaire
      const result = await getPriceForVehicleAndDistance(vehicleType, distance);
      const priceHT = formatPrice(result.priceHT);
      
      // Calculer le prix TTC (TVA 20%)
      const priceTTC = calculateTTC(priceHT);
      
      console.log(`Prix calculé: HT=${priceHT}€, TTC=${priceTTC}€`);
      
      return {
        priceHT,
        priceTTC,
        isPerKm: result.isPerKm
      };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      return {
        priceHT: '0.00',
        priceTTC: '0.00',
        isPerKm: false
      };
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculatePrice,
    isCalculating
  };
};
