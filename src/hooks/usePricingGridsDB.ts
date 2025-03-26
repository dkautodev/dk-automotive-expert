
import { useEffect } from 'react';
import { usePriceGridState } from './pricing/usePriceGridState';
import { usePriceEditing } from './pricing/usePriceEditing';
import { usePriceQuery } from './pricing/usePriceQuery';

export const usePricingGridsDB = () => {
  const {
    priceGrids,
    setPriceGrids,
    editingGrid,
    setEditingGrid,
    editedPrices,
    setEditedPrices,
    loading,
    setLoading,
    savingGrid,
    setSavingGrid,
    isAdmin,
    loadPriceGrids
  } = usePriceGridState();

  const {
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange
  } = usePriceEditing(
    priceGrids,
    setPriceGrids,
    editingGrid,
    setEditingGrid,
    editedPrices,
    setEditedPrices,
    savingGrid,
    setSavingGrid,
    isAdmin
  );

  const { getPriceForVehicleAndDistance } = usePriceQuery();

  // Load price grids on component mount
  useEffect(() => {
    loadPriceGrids();
  }, []);

  return {
    priceGrids,
    editingGrid,
    editedPrices,
    loading,
    savingGrid,
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
    getPriceForVehicleAndDistance
  };
};
