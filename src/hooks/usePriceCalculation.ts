
import { formatPrice } from '@/utils/priceCalculations';

export const usePriceCalculation = () => {
  /**
   * Calcule le prix en fonction du type de véhicule et de la distance
   * Version simplifiée pour le projet sans Supabase
   */
  const calculatePrice = async (vehicleType: string, distance: number) => {
    try {
      console.log(`Calculer le prix pour ${vehicleType} sur ${distance} km`);
      
      // Simulation d'un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Tarifs de base par type de véhicule (en € par km)
      const basePrices: Record<string, number> = {
        'small_car': 0.5,
        'medium_car': 0.75,
        'large_car': 1,
        'van': 1.2,
        'small_truck': 1.5,
        'large_truck': 2,
        'default': 1
      };
      
      // Utilise le tarif correspondant au type de véhicule ou le tarif par défaut
      const pricePerKm = basePrices[vehicleType] || basePrices.default;
      
      // Calcul du prix HT
      let priceHT = pricePerKm * distance;
      
      // Ajoute un forfait de base
      priceHT += 20;
      
      // Calcul du prix TTC (TVA 20%)
      const priceTTC = priceHT * 1.2;
      
      console.log(`Prix calculé: ${priceHT}€ HT, ${priceTTC}€ TTC`);
      
      return {
        priceHT: formatPrice(priceHT),
        priceTTC: formatPrice(priceTTC),
        isPerKm: true
      };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      return {
        priceHT: '0.00',
        priceTTC: '0.00',
        isPerKm: false
      };
    }
  };
  
  return { calculatePrice };
};
