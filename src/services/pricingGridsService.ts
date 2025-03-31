
/**
 * Service permettant d'obtenir les prix depuis la grille tarifaire
 */

import { supabase } from '@/integrations/supabase/client';
import { PriceGrid } from '@/components/admin/pricingTypes';
import { toast } from 'sonner';
import { formatDBRowsToGrids } from '@/utils/pricingFormatters';
import { distanceRanges } from '@/hooks/usePricingGrids';

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

// Récupérer toutes les grilles de prix
export const fetchPriceGrids = async (): Promise<any[]> => {
  console.log('Fetching price grids from database');
  try {
    const { data, error } = await supabase
      .from('price_grids')
      .select('*')
      .order('vehicle_type_id', { ascending: true })
      .order('distance_range_id', { ascending: true });

    if (error) {
      console.error('Error fetching price grids:', error);
      throw new Error(`Error fetching price grids: ${error.message}`);
    }

    console.log(`Retrieved ${data?.length || 0} price grid entries`);
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchPriceGrids:', error);
    throw error;
  }
};

// Mettre à jour un prix dans la base de données
export const updatePriceInDB = async (
  vehicleTypeId: string, 
  rangeId: string, 
  priceHT: number
): Promise<void> => {
  console.log(`Updating price for ${vehicleTypeId}, range ${rangeId}: ${priceHT}`);
  try {
    // Vérifier si le prix existe déjà
    const { data: existingPrice, error: checkError } = await supabase
      .from('price_grids')
      .select('*')
      .eq('vehicle_type_id', vehicleTypeId)
      .eq('distance_range_id', rangeId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing price:', checkError);
      throw new Error(`Error checking existing price: ${checkError.message}`);
    }

    // Déterminer si le prix est par km en fonction de la tranche
    const range = distanceRanges.find(r => r.id === rangeId);
    if (!range) {
      throw new Error(`Range not found: ${rangeId}`);
    }
    
    const isPerKm = range?.perKm || false;
    const vehicleTypeName = getVehicleTypeName(vehicleTypeId);
    
    if (existingPrice) {
      // Mettre à jour le prix existant
      const { error: updateError } = await supabase
        .from('price_grids')
        .update({ 
          price_ht: priceHT,
          is_per_km: isPerKm,
          updated_at: new Date().toISOString()
        })
        .eq('vehicle_type_id', vehicleTypeId)
        .eq('distance_range_id', rangeId);

      if (updateError) {
        console.error('Error updating price:', updateError);
        throw new Error(`Error updating price: ${updateError.message}`);
      }
    } else {
      // Insérer un nouveau prix
      const { error: insertError } = await supabase
        .from('price_grids')
        .insert({ 
          vehicle_type_id: vehicleTypeId,
          vehicle_type_name: vehicleTypeName,
          distance_range_id: rangeId,
          distance_range_label: range.label,
          price_ht: priceHT,
          is_per_km: isPerKm
        });

      if (insertError) {
        console.error('Error inserting price:', insertError);
        throw new Error(`Error inserting price: ${insertError.message}`);
      }
    }
    
    console.log(`Successfully updated price for ${vehicleTypeId}, range ${rangeId}`);
  } catch (error: any) {
    console.error('Error updating price in DB:', error);
    throw error;
  }
};

// Initialiser les grilles de prix par défaut
export const initializeDefaultPriceGrids = async (): Promise<PriceGrid[]> => {
  console.log('Initializing default price grids');
  try {
    const vehicleTypes = ['citadine', 'berline', 'camion', 'plateau'];
    const defaultGrids: PriceGrid[] = [];
    
    for (const vehicleTypeId of vehicleTypes) {
      const vehicleTypeName = getVehicleTypeName(vehicleTypeId);
      const prices = [];
      
      // Create default prices for each distance range
      for (const range of distanceRanges) {
        const basePrice = getDefaultBasePrice(vehicleTypeId, range.id);
        
        // Insert into database
        const { error } = await supabase
          .from('price_grids')
          .insert({
            vehicle_type_id: vehicleTypeId,
            vehicle_type_name: vehicleTypeName,
            distance_range_id: range.id,
            distance_range_label: range.label,
            price_ht: basePrice,
            is_per_km: range.perKm || false
          });
        
        if (error) {
          console.error(`Error initializing price for ${vehicleTypeId}, range ${range.id}:`, error);
        }
        
        prices.push({
          rangeId: range.id,
          priceHT: basePrice.toString()
        });
      }
      
      defaultGrids.push({
        vehicleTypeId,
        vehicleTypeName,
        prices
      });
    }
    
    console.log('Default price grids initialized successfully');
    return defaultGrids;
  } catch (error: any) {
    console.error('Error initializing default price grids:', error);
    toast.error('Erreur lors de l\'initialisation des grilles de prix');
    throw error;
  }
};

// Fonction utilitaire pour obtenir le nom du type de véhicule
const getVehicleTypeName = (vehicleTypeId: string): string => {
  switch (vehicleTypeId) {
    case 'citadine': return 'Citadine';
    case 'berline': return 'Berline';
    case 'camion': return 'Camion';
    case 'plateau': return 'Plateau';
    case 'suv': return '4x4 (ou SUV)';
    case 'utilitaire-6-12': return 'Utilitaire 6-12m3';
    case 'utilitaire-12-15': return 'Utilitaire 12-15m3';
    case 'utilitaire-15-20': return 'Utilitaire 15-20m3';
    case 'utilitaire-20-plus': return 'Utilitaire + de 20m3';
    default: return vehicleTypeId.charAt(0).toUpperCase() + vehicleTypeId.slice(1);
  }
};

// Fonction utilitaire pour déterminer un prix de base par défaut
const getDefaultBasePrice = (vehicleTypeId: string, rangeId: string): number => {
  // Prix de base selon le type de véhicule
  let baseMultiplier = 1.0;
  switch (vehicleTypeId) {
    case 'citadine': baseMultiplier = 1.0; break;
    case 'berline': baseMultiplier = 1.2; break;
    case 'camion': baseMultiplier = 1.8; break;
    case 'plateau': baseMultiplier = 2.0; break;
    case 'suv': baseMultiplier = 1.3; break;
    case 'utilitaire-6-12': baseMultiplier = 1.4; break;
    case 'utilitaire-12-15': baseMultiplier = 1.5; break;
    case 'utilitaire-15-20': baseMultiplier = 1.7; break;
    case 'utilitaire-20-plus': baseMultiplier = 1.9; break;
  }
  
  // Prix selon la distance
  if (rangeId === '1-10') return 20.0 * baseMultiplier;
  if (rangeId === '11-20') return 25.0 * baseMultiplier;
  if (rangeId === '21-30') return 30.0 * baseMultiplier;
  if (rangeId === '31-40') return 35.0 * baseMultiplier;
  if (rangeId === '41-50') return 40.0 * baseMultiplier;
  if (rangeId === '51-60') return 45.0 * baseMultiplier;
  if (rangeId === '61-70') return 50.0 * baseMultiplier;
  if (rangeId === '71-80') return 55.0 * baseMultiplier;
  if (rangeId === '81-90') return 60.0 * baseMultiplier;
  if (rangeId === '91-100') return 65.0 * baseMultiplier;
  
  // Pour les tranches avec prix par km
  if (rangeId === '101-200') return 0.95 * baseMultiplier;
  if (rangeId === '201-300') return 0.90 * baseMultiplier;
  if (rangeId === '301-400') return 0.85 * baseMultiplier;
  if (rangeId === '401-500') return 0.80 * baseMultiplier;
  if (rangeId === '501-600') return 0.75 * baseMultiplier;
  if (rangeId === '601-700') return 0.70 * baseMultiplier;
  if (rangeId === '701+') return 0.65 * baseMultiplier;
  
  return 1.0 * baseMultiplier; // Prix par défaut
};
