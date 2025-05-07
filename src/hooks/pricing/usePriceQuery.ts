
import { calculateTTC } from '@/utils/priceCalculations';
import { getPriceForVehicleAndDistance as getPrice } from '@/services/pricing/localPricingGridsService';

export const usePriceQuery = () => {
  // Fonction pour obtenir les prix pour un type de véhicule et une distance
  const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
    try {
      const selectedPrice = await getPrice(vehicleTypeId, distance);
      
      return {
        priceHT: selectedPrice.priceHT.toString(),
        priceTTC: calculateTTC(selectedPrice.priceHT.toString()),
        isPerKm: selectedPrice.isPerKm
      };
    } catch (error: any) {
      console.error('Error getting price:', error);
      return null;
    }
  };

  return { getPriceForVehicleAndDistance };
};
