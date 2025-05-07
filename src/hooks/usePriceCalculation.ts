
import { getPriceForVehicleAndDistance } from '@/services/pricing/localPricingGridsService';
import { calculateTTC } from '@/utils/priceCalculations';

export const usePriceCalculation = () => {
  const calculatePrice = async (vehicleType: string, distance: number) => {
    try {
      const { priceHT, isPerKm } = await getPriceForVehicleAndDistance(vehicleType, distance);
      
      const formattedPriceHT = priceHT.toFixed(2);
      const formattedPriceTTC = calculateTTC(formattedPriceHT);
      
      return {
        priceHT: formattedPriceHT,
        priceTTC: formattedPriceTTC,
        isPerKm
      };
    } catch (error) {
      console.error("Erreur lors du calcul du prix:", error);
      return {
        priceHT: "0.00",
        priceTTC: "0.00",
        isPerKm: false
      };
    }
  };
  
  return { calculatePrice };
};
