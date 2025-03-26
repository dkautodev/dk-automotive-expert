
import { PriceGrid } from '@/components/admin/pricingTypes';

// Formats database rows into PriceGrid objects
export const formatDBRowsToGrids = (rows: any[]): PriceGrid[] => {
  if (!rows || rows.length === 0) return [];
  
  const vehicleTypeIds = [...new Set(rows.map(row => row.vehicle_type_id))];
  
  const formattedGrids: PriceGrid[] = vehicleTypeIds.map(vehicleTypeId => {
    const vehicleRows = rows.filter(row => row.vehicle_type_id === vehicleTypeId);
    const vehicleTypeName = vehicleRows[0]?.vehicle_type_name || '';
    
    const prices = vehicleRows.map(row => ({
      rangeId: row.distance_range_id,
      priceHT: row.price_ht.toString(),
    }));
    
    return {
      vehicleTypeId,
      vehicleTypeName,
      prices,
    };
  });
  
  return formattedGrids;
};
