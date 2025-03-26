
import React from 'react';
import { TableBody } from '@/components/ui/table';
import PriceTableRow from './PriceTableRow';
import { PriceRange, PriceData } from './pricingTypes';
import { calculateTTC } from '@/utils/priceCalculations';

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
  return (
    <TableBody>
      {prices.map((price) => {
        const range = distanceRanges.find(r => r.id === price.rangeId);
        return range && (
          <PriceTableRow
            key={price.rangeId}
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
