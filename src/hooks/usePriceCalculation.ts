
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, getDistanceRangeId } from '@/utils/priceCalculations';
import { toast } from 'sonner';

export const usePriceCalculation = () => {
  /**
   * Calcule le prix en fonction du type de véhicule et de la distance
   * Version utilisant la table pricing_grids_public
   */
  const calculatePrice = async (vehicleType: string, distance: number) => {
    try {
      console.log(`Calculer le prix pour ${vehicleType} sur ${distance} km`);
      
      // Déterminer la tranche de distance
      const rangeId = getDistanceRangeId(distance);
      console.log(`Tranche de distance identifiée: ${rangeId}`);
      
      // Récupération du prix depuis Supabase
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('price_ht, type_tarif')
        .eq('vehicle_category', vehicleType)
        .is('min_distance', null) // Pour les tarifs fixes
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        
        // Prix par défaut si erreur
        const defaultPricePerKm = 1.0;
        const priceHT = defaultPricePerKm * distance + 20; // 20€ de forfait de base
        const priceTTC = priceHT * 1.2;
        
        console.log(`Prix par défaut calculé: ${priceHT}€ HT, ${priceTTC}€ TTC`);
        
        return {
          priceHT: formatPrice(priceHT),
          priceTTC: formatPrice(priceTTC),
          isPerKm: true
        };
      }
      
      if (!data) {
        console.warn(`Aucun prix trouvé pour ${vehicleType}, utilisation du prix par défaut`);
        
        // Prix par défaut
        const defaultPricePerKm = 1.0;
        const priceHT = defaultPricePerKm * distance + 20; // 20€ de forfait de base
        const priceTTC = priceHT * 1.2;
        
        console.log(`Prix par défaut calculé: ${priceHT}€ HT, ${priceTTC}€ TTC`);
        
        return {
          priceHT: formatPrice(priceHT),
          priceTTC: formatPrice(priceTTC),
          isPerKm: true
        };
      }
      
      // Calcul du prix final
      let finalPriceHT: number;
      const isPerKm = data.type_tarif === 'au_km';
      
      if (isPerKm) {
        finalPriceHT = data.price_ht * distance;
        console.log(`Calcul par km: ${data.price_ht} € x ${distance} km = ${finalPriceHT} €`);
      } else {
        finalPriceHT = data.price_ht;
        console.log(`Prix forfaitaire: ${finalPriceHT} €`);
      }
      
      // Ajoute un forfait de base pour les courtes distances si prix au km
      if (isPerKm && distance < 100) {
        finalPriceHT += 20;
        console.log(`Ajout d'un forfait de base de 20€, prix total: ${finalPriceHT} €`);
      }
      
      // Calcul du prix TTC
      const finalPriceTTC = finalPriceHT * 1.2;
      
      console.log(`Prix calculé: ${finalPriceHT}€ HT, ${finalPriceTTC}€ TTC`);
      
      return {
        priceHT: formatPrice(finalPriceHT),
        priceTTC: formatPrice(finalPriceTTC),
        isPerKm
      };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      toast.error('Erreur lors du calcul du prix. Un prix par défaut sera utilisé.');
      
      // Prix par défaut en cas d'erreur
      const defaultPrice = distance * 1.2 + 20;
      
      return {
        priceHT: formatPrice(defaultPrice),
        priceTTC: formatPrice(defaultPrice * 1.2),
        isPerKm: true
      };
    }
  };
  
  // Pour être compatible avec les composants qui utilisent isCalculating
  return { 
    calculatePrice,
    isCalculating: false,
    priceHT: null,
    priceTTC: null
  };
};
