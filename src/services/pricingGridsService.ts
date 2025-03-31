
/**
 * Service permettant d'obtenir les prix depuis la grille tarifaire
 */

import { supabase } from '@/integrations/supabase/client';

interface PriceResult {
  priceHT: number;
  isPerKm: boolean;
}

// Fonction pour déterminer la tranche de distance appropriée
const getDistanceRangeId = (distance: number): string => {
  if (distance <= 10) return '1-10';
  if (distance <= 20) return '11-20';
  if (distance <= 30) return '21-30';
  if (distance <= 40) return '31-40';
  if (distance <= 50) return '41-50';
  if (distance <= 60) return '51-60';
  if (distance <= 70) return '61-70';
  if (distance <= 80) return '71-80';
  if (distance <= 90) return '81-90';
  if (distance <= 100) return '91-100';
  if (distance <= 200) return '101-200';
  if (distance <= 300) return '201-300';
  if (distance <= 400) return '301-400';
  if (distance <= 500) return '401-500';
  if (distance <= 600) return '501-600';
  if (distance <= 700) return '601-700';
  return '701+';
};

// Obtenir le prix pour un type de véhicule et une distance donnée
export const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number): Promise<PriceResult> => {
  console.log(`Récupération du prix pour ${vehicleTypeId} et ${distance} km`);
  try {
    // Déterminer la tranche de distance
    const rangeId = getDistanceRangeId(distance);
    console.log(`Tranche de distance identifiée: ${rangeId}`);
    
    // Récupérer le prix depuis la base de données
    const { data, error } = await supabase
      .from('price_grids')
      .select('price_ht, is_per_km')
      .eq('vehicle_type_id', vehicleTypeId)
      .eq('distance_range_id', rangeId)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du prix:', error);
      throw new Error(`Erreur lors de la récupération du prix: ${error.message}`);
    }
    
    if (!data) {
      console.warn(`Aucun prix trouvé pour ${vehicleTypeId} dans la tranche ${rangeId}, utilisation du prix par défaut`);
      // Prix par défaut
      return {
        priceHT: distance * 1.2,
        isPerKm: true
      };
    }
    
    // Si le prix est par km, multiplier par la distance
    const finalPrice = data.is_per_km ? data.price_ht * distance : data.price_ht;
    
    console.log(`Prix HT calculé: ${finalPrice} (${data.is_per_km ? 'par km' : 'forfait'})`);
    
    return {
      priceHT: finalPrice,
      isPerKm: data.is_per_km
    };
  } catch (error: any) {
    console.error('Erreur dans le service de pricing:', error);
    // En cas d'erreur, utiliser un prix par défaut
    return {
      priceHT: distance * 2.5,
      isPerKm: true
    };
  }
};
