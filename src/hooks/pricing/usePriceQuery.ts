
import { supabase } from '@/services/mockSupabaseClient';
import { calculateTTC } from '@/utils/priceCalculations';

/**
 * Helper function to determine the distance range ID based on distance
 */
export const getDistanceRangeId = (distance: number): string => {
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

export const usePriceQuery = () => {
  // Fonction pour obtenir les prix pour un type de véhicule et une distance
  const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
    try {
      console.log(`Récupération du prix pour ${vehicleTypeId} et ${distance} km`);
      
      // Recherche directe par distance plutôt que par plage
      const { data, error } = await supabase
        .from('pricing_grids_public')
        .select('*')
        .eq('vehicle_category', vehicleTypeId)
        .lte('min_distance', distance)
        .gte('max_distance', distance)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération du prix:', error);
        return null;
      }
      
      if (!data) {
        console.warn(`Aucun prix trouvé pour ${vehicleTypeId} à cette distance ${distance}`);
        return null;
      }
      
      // Calcul du prix final
      let finalPriceHT: number;
      
      if (data.type_tarif === 'km') {
        finalPriceHT = data.price_ht * distance;
        console.log(`Prix au km: ${data.price_ht} € × ${distance} km = ${finalPriceHT} €`);
      } else {
        finalPriceHT = data.price_ht;
        console.log(`Prix forfaitaire: ${finalPriceHT} €`);
      }
      
      return {
        priceHT: finalPriceHT.toFixed(2),
        priceTTC: calculateTTC(finalPriceHT.toString()),
        isPerKm: data.type_tarif === 'km'
      };
    } catch (error: any) {
      console.error('Error getting price:', error);
      return null;
    }
  };

  return { getPriceForVehicleAndDistance };
};
