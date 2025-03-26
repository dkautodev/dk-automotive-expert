
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
  // Create a map of prices for easy access
  const priceMap = prices.reduce<Record<string, PriceData>>((acc, price) => {
    acc[price.rangeId] = price;
    return acc;
  }, {});

  return (
    <TableBody>
      {distanceRanges.map((range) => {
        // Find the price for this range, or create a default one if it doesn't exist
        const price = priceMap[range.id] || { rangeId: range.id, priceHT: "0.00" };
        
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
