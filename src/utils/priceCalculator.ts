
import { calculateTTC } from './priceCalculations';
import { supabase } from '@/integrations/supabase/client';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 * en utilisant directement la table pricing_grids_public
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    // Obtenir le prix depuis la table pricing_grids_public
    const { data: priceData, error } = await supabase
      .from('pricing_grids_public')
      .select('*')
      .eq('vehicle_category', vehicleTypeId)
      .lte('min_distance', distance)
      .gte('max_distance', distance)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du prix:', error);
      return {
        priceHT: "0.00",
        priceTTC: "0.00",
        isPerKm: false,
        error: error.message
      };
    }
    
    if (!priceData) {
      console.warn(`Aucun prix trouvé pour le véhicule ${vehicleTypeId} à la distance ${distance}`);
      return {
        priceHT: "0.00",
        priceTTC: "0.00",
        isPerKm: false,
        error: "Prix non trouvé"
      };
    }
    
    // Calculer le prix final
    let finalPriceHT: number;
    
    if (priceData.type_tarif === 'par_km') {
      finalPriceHT = priceData.price_ht * distance;
    } else {
      finalPriceHT = priceData.price_ht;
    }
    
    const priceHTString = finalPriceHT.toString();
    
    return {
      priceHT: priceHTString,
      priceTTC: calculateTTC(priceHTString),
      isPerKm: priceData.type_tarif === 'par_km'
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
