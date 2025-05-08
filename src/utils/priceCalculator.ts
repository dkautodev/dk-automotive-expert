
import { calculateTTC } from './priceCalculations';
import { supabase } from '@/integrations/supabase/client';

/**
 * Calcule le prix pour un type de véhicule et une distance donnée
 * en utilisant directement la table pricing_grids_public
 */
export const calculatePrice = async (vehicleTypeId: string, distance: number) => {
  try {
    console.log(`Calculating price for vehicle type: ${vehicleTypeId} and distance: ${distance}km`);
    
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
    
    console.log('Price data found:', priceData);
    
    // Calculer le prix final
    let finalPriceHT: number;
    const isPerKm = priceData.type_tarif === 'km';
    
    if (isPerKm) {
      // Prix au kilomètre
      finalPriceHT = priceData.price_ht * distance;
      console.log(`Per km price: ${priceData.price_ht} € × ${distance} km = ${finalPriceHT} €`);
    } else {
      // Prix forfaitaire
      finalPriceHT = priceData.price_ht;
      console.log(`Fixed price: ${finalPriceHT} €`);
    }
    
    const priceHTString = finalPriceHT.toFixed(2);
    const priceTTCString = calculateTTC(priceHTString);
    
    console.log(`Final price calculated: HT=${priceHTString}€, TTC=${priceTTCString}€, Type=${isPerKm ? 'per km' : 'fixed'}`);
    
    return {
      priceHT: priceHTString,
      priceTTC: priceTTCString,
      isPerKm: isPerKm
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
