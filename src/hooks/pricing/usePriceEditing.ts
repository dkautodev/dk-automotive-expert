
import { calculateTTC } from '@/utils/priceCalculations';
import { toast } from 'sonner';
import { PriceGrid } from '@/components/admin/pricingTypes';
import { updatePriceInDB } from '@/services/pricingGridsService';

export const usePriceEditing = (
  priceGrids: PriceGrid[],
  setPriceGrids: React.Dispatch<React.SetStateAction<PriceGrid[]>>,
  editingGrid: string | null,
  setEditingGrid: React.Dispatch<React.SetStateAction<string | null>>,
  editedPrices: Record<string, { ht: string, ttc: string }>,
  setEditedPrices: React.Dispatch<React.SetStateAction<Record<string, { ht: string, ttc: string }>>>,
  savingGrid: boolean,
  setSavingGrid: React.Dispatch<React.SetStateAction<boolean>>,
  isAdmin: boolean
) => {
  const handleEditGrid = (vehicleTypeId: string) => {
    if (!isAdmin) {
      toast.error('You do not have permission to edit price grids');
      return;
    }
    
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

  const handleSaveGrid = async (vehicleTypeId: string) => {
    if (!isAdmin) {
      toast.error('You do not have permission to edit price grids');
      return;
    }

    setSavingGrid(true);

    try {
      // Update prices in database
      const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
      if (grid) {
        const updatePromises = grid.prices.map(async (price) => {
          const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
          return updatePriceInDB(
            vehicleTypeId, 
            price.rangeId, 
            parseFloat(newPriceHT)
          );
        });
        
        await Promise.all(updatePromises);
        
        // If current grid is Citadine or Berline, update the other one too
        if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
          const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
          
          // Also update in database for other vehicle
          const updateOtherPromises = grid.prices.map(async (price) => {
            const newPriceHT = editedPrices[price.rangeId]?.ht || price.priceHT;
            return updatePriceInDB(
              otherGridId, 
              price.rangeId, 
              parseFloat(newPriceHT)
            );
          });
          
          await Promise.all(updateOtherPromises);
        }
      }

      // Now that all DB operations are complete, update local state
      const updatedGrids = [...priceGrids];
      const gridIndex = updatedGrids.findIndex(g => g.vehicleTypeId === vehicleTypeId);
      
      if (gridIndex !== -1) {
        // Update current grid with new prices
        updatedGrids[gridIndex] = {
          ...updatedGrids[gridIndex],
          prices: updatedGrids[gridIndex].prices.map(price => ({
            ...price,
            priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
          })),
        };
        
        // If current grid is Citadine or Berline, update the other one too
        if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
          const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
          const otherGridIndex = updatedGrids.findIndex(g => g.vehicleTypeId === otherGridId);
          
          if (otherGridIndex !== -1) {
            // Copy prices from current grid to other grid
            updatedGrids[otherGridIndex] = {
              ...updatedGrids[otherGridIndex],
              prices: [...updatedGrids[gridIndex].prices],
            };
          }
        }
      }
      
      // Update state
      setPriceGrids(updatedGrids);

      toast.success('Price grid saved successfully');
      setEditingGrid(null);
      setEditedPrices({});
    } catch (error: any) {
      console.error('Error saving price grid:', error);
      toast.error('Error saving price grid');
    } finally {
      setSavingGrid(false);
    }
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
    const htValue = (parseFloat(sanitizedValue) / 1.2).toFixed(2);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: htValue,
        ttc: sanitizedValue
      },
    }));
  };

  return {
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange
  };
};
