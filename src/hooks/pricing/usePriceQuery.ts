
import { calculateTTC } from '@/utils/priceCalculations';
import { getPriceForVehicleAndDistance as getPrice } from '@/services/pricingGridsService';

export const usePriceQuery = () => {
  // Function to get prices for a vehicle type and distance
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
