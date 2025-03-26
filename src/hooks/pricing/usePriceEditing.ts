
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
    console.log("Saving grid for vehicle type:", vehicleTypeId);
    console.log("Edited prices:", editedPrices);

    try {
      // Update prices in database first, before updating UI
      const updatePromises = [];
      
      // Get all ranges we need to update
      for (const rangeId in editedPrices) {
        const newPriceHT = editedPrices[rangeId]?.ht;
        if (newPriceHT) {
          console.log(`Updating price for ${vehicleTypeId}, range ${rangeId}: ${newPriceHT}`);
          updatePromises.push(
            updatePriceInDB(
              vehicleTypeId, 
              rangeId, 
              parseFloat(newPriceHT)
            )
          );
          
          // If current grid is Citadine or Berline, update the other one too
          if (vehicleTypeId === 'citadine' || vehicleTypeId === 'berline') {
            const otherGridId = vehicleTypeId === 'citadine' ? 'berline' : 'citadine';
            console.log(`Also updating price for ${otherGridId}, range ${rangeId}: ${newPriceHT}`);
            updatePromises.push(
              updatePriceInDB(
                otherGridId, 
                rangeId, 
                parseFloat(newPriceHT)
              )
            );
          }
        }
      }
      
      // Wait for all database updates to complete
      await Promise.all(updatePromises);
      console.log("All database updates completed successfully");

      // Now that all DB operations are complete, update local state
      setPriceGrids(prevGrids => {
        const updatedGrids = [...prevGrids];
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
                prices: updatedGrids[otherGridIndex].prices.map(price => ({
                  ...price,
                  priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
                })),
              };
            }
          }
        }
        
        return updatedGrids;
      });

      toast.success('Price grid saved successfully');
      setEditingGrid(null);
      setEditedPrices({});
    } catch (error: any) {
      console.error('Error saving price grid:', error);
      toast.error('Error saving price grid: ' + (error.message || 'Unknown error'));
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
