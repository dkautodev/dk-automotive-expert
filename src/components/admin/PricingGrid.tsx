
import React from 'react';
import { usePricingGrids, distanceRanges } from '@/hooks/usePricingGrids';
import SinglePricingGrid from './SinglePricingGrid';

const PricingGrid: React.FC = () => {
  const {
    priceGrids,
    editingGrid,
    editedPrices,
    handleEditGrid,
    handleSaveGrid,
    handlePriceHTChange,
    handlePriceTTCChange,
  } = usePricingGrids();

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
