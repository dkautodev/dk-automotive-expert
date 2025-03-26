
import React from 'react';
import { TableBody } from '@/components/ui/table';
import PriceTableRow from './PriceTableRow';
import { PriceRange, PriceData } from './pricingTypes';
import { calculateTTC } from '@/utils/priceCalculations';
import { distanceRanges } from '@/hooks/usePricingGrids';

interface PricingTableBodyProps {
  prices: PriceData[];
  distanceRanges: PriceRange[];
  isEditing: boolean;
  editedPrices: Record<string, { ht: string, ttc: string }>;
  onPriceHTChange: (rangeId: string, value: string) => void;
  onPriceTTCChange: (rangeId: string, value: string) => void;
}

const PricingTableBody: React.FC<PricingTableBodyProps> = ({
  prices,
  distanceRanges,
  isEditing,
  editedPrices,
  onPriceHTChange,
  onPriceTTCChange,
}) => {
  // Créer un map des prix pour un accès facile
  const priceMap = prices.reduce<Record<string, PriceData>>((acc, price) => {
    acc[price.rangeId] = price;
    return acc;
  }, {});

  return (
    <TableBody>
      {distanceRanges.map((range) => {
        const price = priceMap[range.id];
        
        // S'assurer que nous avons un prix valide pour cette plage de distance
        if (!price) return null;
        
        return (
          <PriceTableRow
            key={range.id}
            priceData={price}
            range={range}
            isEditing={isEditing}
            editedPrices={editedPrices}
            onPriceHTChange={onPriceHTChange}
            onPriceTTCChange={onPriceTTCChange}
            calculateTTC={calculateTTC}
          />
        );
      })}
    </TableBody>
  );
};

export default PricingTableBody;
