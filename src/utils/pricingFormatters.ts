
import { PriceGrid } from "@/components/admin/pricingTypes";
import { vehicleTypes } from "@/lib/vehicleTypes";

// Function to convert database rows to application price grid structure
export const formatDBRowsToGrids = (dbRows: any[]): PriceGrid[] => {
  console.log('Formatting DB rows to grids:', dbRows);
  
  // Group by vehicle type
  const vehicleGroups: Record<string, any[]> = {};
  
  dbRows.forEach(row => {
    if (!vehicleGroups[row.vehicle_type_id]) {
      vehicleGroups[row.vehicle_type_id] = [];
    }
    vehicleGroups[row.vehicle_type_id].push(row);
  });
  
  // Convert each group to a PriceGrid
  const priceGrids: PriceGrid[] = [];
  
  for (const vehicleTypeId in vehicleGroups) {
    const rows = vehicleGroups[vehicleTypeId];
    const vehicleType = vehicleTypes.find(v => v.id === vehicleTypeId);
    
    if (vehicleType) {
      const grid: PriceGrid = {
        vehicleTypeId: vehicleTypeId,
        vehicleTypeName: vehicleType.name,
        prices: rows.map(row => ({
          rangeId: row.distance_range_id,
          priceHT: row.price_ht.toString()
        }))
      };
      
      priceGrids.push(grid);
    }
  }
  
  console.log('Formatted price grids:', priceGrids);
  return priceGrids;
};
