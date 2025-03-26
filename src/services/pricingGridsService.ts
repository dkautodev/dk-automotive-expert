
import { supabase } from '@/integrations/supabase/client';
import { PriceGrid, PriceRange } from '@/components/admin/pricingTypes';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { distanceRanges } from '@/hooks/usePricingGrids';

// Fetch price grids from the database
export const fetchPriceGrids = async () => {
  console.log('Fetching price grids from database');
  const { data, error } = await supabase
    .from('price_grids')
    .select('*')
    .order('vehicle_type_id', { ascending: true })
    .order('distance_range_id', { ascending: true });

  if (error) {
    console.error('Error fetching price grids:', error);
    throw error;
  }

  console.log('Fetched price grids:', data);
  return data;
};

// Initialize default price grids in the database
export const initializeDefaultPriceGrids = async () => {
  const defaultGrids: PriceGrid[] = vehicleTypes.map((vehicleType) => ({
    vehicleTypeId: vehicleType.id,
    vehicleTypeName: vehicleType.name,
    prices: distanceRanges.map((range) => ({
      rangeId: range.id,
      priceHT: "0.00", // Set default price to 0
    })),
  }));

  // Insert default data into database
  for (const grid of defaultGrids) {
    for (const price of grid.prices) {
      const range = distanceRanges.find(r => r.id === price.rangeId);
      try {
        await supabase.from('price_grids').insert({
          vehicle_type_id: grid.vehicleTypeId,
          vehicle_type_name: grid.vehicleTypeName,
          distance_range_id: price.rangeId,
          distance_range_label: range?.label || '',
          price_ht: 0, // Set default price to 0
          is_per_km: range?.perKm || false
        });
      } catch (err) {
        console.error(`Error inserting default price for ${grid.vehicleTypeId}, range ${price.rangeId}:`, err);
        throw err;
      }
    }
  }

  return defaultGrids;
};

// Update a single price in the database
export const updatePriceInDB = async (
  vehicleTypeId: string,
  rangeId: string,
  priceHT: number
) => {
  console.log(`Updating price in DB for ${vehicleTypeId}, range ${rangeId}: ${priceHT}`);
  
  try {
    const { data, error } = await supabase
      .from('price_grids')
      .update({ price_ht: priceHT })
      .eq('vehicle_type_id', vehicleTypeId)
      .eq('distance_range_id', rangeId);

    if (error) {
      console.error(`Error updating price for ${vehicleTypeId}, range ${rangeId}:`, error);
      throw error;
    }
    
    console.log(`Successfully updated price for ${vehicleTypeId}, range ${rangeId}`, data);
    return true;
  } catch (err) {
    console.error(`Exception updating price for ${vehicleTypeId}, range ${rangeId}:`, err);
    throw err;
  }
};

// Get price for a specific vehicle type and distance
export const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
  try {
    const { data, error } = await supabase
      .from('price_grids')
      .select('*')
      .eq('vehicle_type_id', vehicleTypeId)
      .order('distance_range_id', { ascending: true });

    if (error) {
      console.error(`Error getting price for ${vehicleTypeId}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Aucune grille tarifaire trouvée pour ${vehicleTypeId}`);
    }

    // Déterminer la tranche de distance appropriée
    let selectedPrice = null;
    
    for (const row of data) {
      const rangeId = row.distance_range_id;
      const isPerKm = row.is_per_km;
      
      // Gérer le cas spécial "701+"
      if (rangeId === '701+' && distance > 700) {
        selectedPrice = isPerKm ? 
          { priceHT: row.price_ht * distance, isPerKm } : 
          { priceHT: row.price_ht, isPerKm };
        break;
      }
      
      // Extraire les nombres de la tranche (ex: "1-10" => [1, 10])
      const rangeParts = rangeId.split('-').map(Number);
      
      // Pour les autres tranches
      if (rangeParts.length === 2) {
        const [min, max] = rangeParts;
        if (distance >= min && distance <= max) {
          selectedPrice = isPerKm ? 
            { priceHT: row.price_ht * distance, isPerKm } : 
            { priceHT: row.price_ht, isPerKm };
          break;
        }
      }
    }

    if (!selectedPrice) {
      throw new Error(`Aucun prix trouvé pour la distance ${distance}km et le véhicule ${vehicleTypeId}`);
    }

    return selectedPrice;
  } catch (err) {
    console.error(`Exception getting price for ${vehicleTypeId}, distance ${distance}:`, err);
    throw err;
  }
};
