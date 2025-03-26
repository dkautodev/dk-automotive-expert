
import { calculateTTC } from './priceCalculations';
import { getPriceForVehicleAndDistance } from '@/services/pricingGridsService';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    const selectedPrice = await getPriceForVehicleAndDistance(vehicleTypeId, distance);
    
    if (!selectedPrice) {
      return {
        priceHT: "0.00",
        priceTTC: "0.00",
        isPerKm: false,
        error: "Prix non trouvé"
      };
    }
    
    const priceHTString = selectedPrice.priceHT.toString();
    
    return {
      priceHT: priceHTString,
      priceTTC: calculateTTC(priceHTString),
      isPerKm: selectedPrice.isPerKm
    };
  } catch (error: any) {
    console.error('Erreur lors du calcul du prix:', error);
    return {
      priceHT: "0.00",
      priceTTC: "0.00",
      isPerKm: false,
      error: error.message
    };
  }
};
