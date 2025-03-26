
import React from 'react';
import { usePricingGridsDB } from '@/hooks/usePricingGridsDB';
import { distanceRanges } from '@/hooks/usePricingGrids';
import SinglePricingGrid from './SinglePricingGrid';
import { Loader } from '@/components/ui/loader';

const PricingGrid: React.FC = () => {
  const {
    priceGrids,
    editingGrid,
    editedPrices,
    loading,
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
  } = usePricingGridsDB();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader className="w-8 h-8" />
        <span className="ml-2 text-muted-foreground">Chargement des grilles tarifaires...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {priceGrids.map((grid) => (
        <SinglePricingGrid
          key={grid.vehicleTypeId}
          grid={grid}
          distanceRanges={distanceRanges}
          editingGrid={editingGrid}
          editedPrices={editedPrices}
          onEditGrid={handleEditGrid}
          onSaveGrid={handleSaveGrid}
          onPriceHTChange={handlePriceHTChange}
          onPriceTTCChange={handlePriceTTCChange}
        />
      ))}
    </div>
  );
};

export default PricingGrid;
