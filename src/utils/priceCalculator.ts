
import { supabase } from '@/integrations/supabase/client';
import { calculateTTC } from './priceCalculations';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    const { data, error } = await supabase
      .from('price_grids')
      .select('*')
      .eq('vehicle_type_id', vehicleTypeId)
      .order('distance_range_id', { ascending: true });

    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error(`Aucune grille tarifaire trouvée pour ${vehicleTypeId}`);
    }

    // Déterminer la tranche de distance appropriée
    let selectedPrice = null;
    
    for (const row of data) {
      const rangeId = row.distance_range_id;
      const isPerKm = row.is_per_km;
      
      // Cas spécial pour "701+"
      if (rangeId === '701+' && distance > 700) {
        selectedPrice = isPerKm ? 
          { priceHT: parseFloat(row.price_ht) * distance, isPerKm } : 
          { priceHT: parseFloat(row.price_ht), isPerKm };
        break;
      }
      
      // Extraire les nombres de la tranche (ex: "1-10" => [1, 10])
      const matches = rangeId.match(/(\d+)-(\d+)/);
      if (matches) {
        const min = parseInt(matches[1]);
        const max = parseInt(matches[2]);
        
        if (distance >= min && distance <= max) {
          selectedPrice = isPerKm ? 
            { priceHT: parseFloat(row.price_ht) * distance, isPerKm } : 
            { priceHT: parseFloat(row.price_ht), isPerKm };
          break;
        }
      }
    }

    if (!selectedPrice) {
      // Utiliser le prix par défaut de la tranche la plus élevée
      const lastPrice = data[data.length - 1];
      selectedPrice = lastPrice.is_per_km ? 
        { priceHT: parseFloat(lastPrice.price_ht) * distance, isPerKm: true } : 
        { priceHT: parseFloat(lastPrice.price_ht), isPerKm: false };
    }

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
