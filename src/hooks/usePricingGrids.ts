
import { useState } from 'react';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { PriceGrid, PriceRange } from '@/components/admin/pricingTypes';
import { calculateHT, calculateTTC } from '@/utils/priceCalculations';

// Define the distance ranges in the correct order
export const distanceRanges: PriceRange[] = [
  { id: '1-10', label: '1 - 10' },
  { id: '11-20', label: '11 - 20' },
  { id: '21-30', label: '21 - 30' },
  { id: '31-40', label: '31 - 40' },
  { id: '41-50', label: '41 - 50' },
  { id: '51-60', label: '51 - 60' },
  { id: '61-70', label: '61 - 70' },
  { id: '71-80', label: '71 - 80' },
  { id: '81-90', label: '81 - 90' },
  { id: '91-100', label: '91 - 100' },
  { id: '101-200', label: '101 - 200', perKm: true },
  { id: '201-300', label: '201 - 300', perKm: true },
  { id: '301-400', label: '301 - 400', perKm: true },
  { id: '401-500', label: '401 - 500', perKm: true },
  { id: '501-600', label: '501 - 600', perKm: true },
  { id: '601-700', label: '601 - 700', perKm: true },
  { id: '701+', label: '+ de 701', perKm: true },
];

// Sample price grid data - in a real app this would come from the database
export const initialPriceGrids: PriceGrid[] = vehicleTypes.map((vehicleType) => ({
  vehicleTypeId: vehicleType.id,
  vehicleTypeName: vehicleType.name,
  prices: distanceRanges.map((range) => ({
    rangeId: range.id,
    priceHT: ((Math.random() * 50) + 50).toFixed(2), // Random price between 50 and 100€
  })),
}));

export const usePricingGrids = () => {
  const [priceGrids, setPriceGrids] = useState<PriceGrid[]>(initialPriceGrids);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});

  const handleEditGrid = (vehicleTypeId: string) => {
    setEditingGrid(vehicleTypeId);
    
    // Initialize edited prices with current values
    const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
    if (grid) {
      const prices: Record<string, { ht: string, ttc: string }> = {};
      grid.prices.forEach(p => {
        prices[p.rangeId] = { 
          ht: p.priceHT, 
          ttc: calculateTTC(p.priceHT) 
        };
      });
      setEditedPrices(prices);
    }
  };

  const handleSaveGrid = (vehicleTypeId: string) => {
    setPriceGrids(prevGrids => {
      // Create a new array to avoid mutating the previous state
      const newGrids = [...prevGrids];
      
      // Find the grid that's being edited
      const gridIndex = newGrids.findIndex(g => g.vehicleTypeId === vehicleTypeId);
      
      if (gridIndex !== -1) {
        // Update the current grid with new prices
        newGrids[gridIndex] = {
          ...newGrids[gridIndex],
          prices: newGrids[gridIndex].prices.map(price => ({
            ...price,
            priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
          })),
        };
        
        // If the current grid is either Citadine or Berline, update the other one too
        if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
          const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
          const otherGridIndex = newGrids.findIndex(g => g.vehicleTypeId === otherGridId);
          
          if (otherGridIndex !== -1) {
            // Copy the prices from the current grid to the other grid
            newGrids[otherGridIndex] = {
              ...newGrids[otherGridIndex],
              prices: [...newGrids[gridIndex].prices],
            };
          }
        }
      }
      
      return newGrids;
    });
    
    setEditingGrid(null);
    setEditedPrices({});
  };

  const handlePriceHTChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const ttcValue = calculateTTC(sanitizedValue);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: sanitizedValue,
        ttc: ttcValue
      },
    }));
  };

  const handlePriceTTCChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const htValue = calculateHT(sanitizedValue);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: htValue,
        ttc: sanitizedValue
      },
    }));
  };

  return {
    priceGrids,
    editingGrid,
    editedPrices,
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
  };
};
