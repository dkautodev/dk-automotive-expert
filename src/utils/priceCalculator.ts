
import { calculateTTC } from './priceCalculations';
import { getPriceForVehicleAndDistance } from '@/services/pricingGridsService';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    const selectedPrice = await getPriceForVehicleAndDistance(vehicleTypeId, distance);
    
    return {
      priceHT: selectedPrice.priceHT.toFixed(2),
      priceTTC: calculateTTC(selectedPrice.priceHT.toFixed(2)),
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
