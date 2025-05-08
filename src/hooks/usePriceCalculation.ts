
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
      
      if (!result) {
        console.error('Aucun prix trouvé pour ce véhicule et cette distance');
        return null;
      }
      
      let finalPriceHT: number;
      
      // Si le prix est au kilomètre, multiplier par la distance
      if (result.isPerKm) {
        finalPriceHT = parseFloat(result.priceHT) * distance;
        console.log(`Prix au km: ${result.priceHT} * ${distance} = ${finalPriceHT}`);
      } else {
        finalPriceHT = parseFloat(result.priceHT);
        console.log(`Prix fixe: ${finalPriceHT}`);
      }
      
      const formattedPriceHT = formatPrice(finalPriceHT);
      
      // Calculer le prix TTC (TVA 20%)
      const formattedPriceTTC = calculateTTC(formattedPriceHT);
      
      console.log(`Prix calculé: HT=${formattedPriceHT}€, TTC=${formattedPriceTTC}€`);
      
      return {
        priceHT: formattedPriceHT,
        priceTTC: formattedPriceTTC,
        isPerKm: result.isPerKm
      };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    calculatePrice,
    isCalculating
  };
};
