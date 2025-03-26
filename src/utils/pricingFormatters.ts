
import { PriceGrid } from "@/components/admin/pricingTypes";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { distanceRanges } from "@/hooks/usePricingGrids";

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
      // Make sure all distance ranges are represented
      const priceMap: Record<string, string> = {};
      
      // First, initialize all ranges with "0.00"
      distanceRanges.forEach(range => {
        priceMap[range.id] = "0.00";
      });
      
      // Then update with actual values from database
      rows.forEach(row => {
        priceMap[row.distance_range_id] = row.price_ht.toString();
      });
      
      // Create the grid with prices in the correct order
      const grid: PriceGrid = {
        vehicleTypeId: vehicleTypeId,
        vehicleTypeName: vehicleType.name,
        prices: distanceRanges.map(range => ({
          rangeId: range.id,
          priceHT: priceMap[range.id]
        }))
      };
      
      priceGrids.push(grid);
    }
  }
  
  console.log('Formatted price grids:', priceGrids);
  return priceGrids;
};
