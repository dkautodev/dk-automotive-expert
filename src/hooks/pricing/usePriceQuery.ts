
import { supabase } from '@/services/mockSupabaseClient';
import { calculateTTC, getDistanceRangeId } from '@/utils/priceCalculations';

export const usePriceQuery = () => {
  // Fonction pour obtenir les prix pour un type de véhicule et une distance
  const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
    try {
      console.log(`Récupération du prix pour ${vehicleTypeId} et ${distance} km`);
      
      // Déterminer la tranche de distance
      const rangeId = getDistanceRangeId(distance);
      console.log(`Tranche de distance identifiée: ${rangeId}`);
      
      // Récupération du prix depuis la table publique
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('price_ht, is_per_km')
        .eq('vehicle_type_id', vehicleTypeId)
        .eq('distance_range_id', rangeId)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        return null;
      }
      
      if (!data) {
        console.warn(`Aucun prix trouvé pour ${vehicleTypeId} dans la tranche ${rangeId}`);
        return null;
      }
      
      // Calcul du prix final
      let finalPriceHT: number;
      
      if (data.is_per_km) {
        finalPriceHT = data.price_ht * distance;
      } else {
        finalPriceHT = data.price_ht;
      }
      
      // Ajouter un forfait de base pour les courtes distances si prix au km
      if (data.is_per_km && distance < 100) {
        finalPriceHT += 20;
      }
      
      return {
        priceHT: finalPriceHT.toString(),
        priceTTC: calculateTTC(finalPriceHT.toString()),
        isPerKm: data.is_per_km
      };
    } catch (error: any) {
      console.error('Error getting price:', error);
      return null;
    }
  };

  return { getPriceForVehicleAndDistance };
};
