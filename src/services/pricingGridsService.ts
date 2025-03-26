
import { supabase } from '@/integrations/supabase/client';
import { PriceGrid, PriceRange } from '@/components/admin/pricingTypes';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { distanceRanges } from '@/hooks/usePricingGrids';

// Fetch price grids from the database
export const fetchPriceGrids = async () => {
  const { data, error } = await supabase
    .from('price_grids')
    .select('*')
    .order('vehicle_type_id', { ascending: true })
    .order('distance_range_id', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

// Initialize default price grids in the database
export const initializeDefaultPriceGrids = async () => {
  const defaultGrids: PriceGrid[] = vehicleTypes.map((vehicleType) => ({
    vehicleTypeId: vehicleType.id,
    vehicleTypeName: vehicleType.name,
    prices: distanceRanges.map((range) => ({
      rangeId: range.id,
      priceHT: ((Math.random() * 50) + 50).toFixed(2), // Prix aléatoire entre 50 et 100€
    })),
  }));

  // Insérer les données par défaut dans la base de données
  for (const grid of defaultGrids) {
    for (const price of grid.prices) {
      const range = distanceRanges.find(r => r.id === price.rangeId);
      await supabase.from('price_grids').insert({
        vehicle_type_id: grid.vehicleTypeId,
        vehicle_type_name: grid.vehicleTypeName,
        distance_range_id: price.rangeId,
        distance_range_label: range?.label || '',
        price_ht: parseFloat(price.priceHT), // Convertir en nombre
        is_per_km: range?.perKm || false
      });
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
  const { error } = await supabase
    .from('price_grids')
    .update({ price_ht: priceHT })
    .match({
      vehicle_type_id: vehicleTypeId,
      distance_range_id: rangeId
    });

  if (error) throw error;
};

// Get price for a specific vehicle type and distance
export const getPriceForVehicleAndDistance = async (vehicleTypeId: string, distance: number) => {
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
    
    // Gérer le cas spécial "701+"
    if (rangeId === '701+' && distance > 700) {
      selectedPrice = isPerKm ? 
        { priceHT: parseFloat(row.price_ht.toString()) * distance, isPerKm } : 
        { priceHT: parseFloat(row.price_ht.toString()), isPerKm };
      break;
    }
    
    // Extraire les nombres de la tranche (ex: "1-10" => [1, 10])
    const rangeParts = rangeId.split('-').map(Number);
    
    // Pour les autres tranches
    if (rangeParts.length === 2) {
      const [min, max] = rangeParts;
      if (distance >= min && distance <= max) {
        selectedPrice = isPerKm ? 
          { priceHT: parseFloat(row.price_ht.toString()) * distance, isPerKm } : 
          { priceHT: parseFloat(row.price_ht.toString()), isPerKm };
        break;
      }
    }
  }

  if (!selectedPrice) {
    throw new Error(`Aucun prix trouvé pour la distance ${distance}km et le véhicule ${vehicleTypeId}`);
  }

  return selectedPrice;
};
