
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface PriceRange {
  id: string;
  label: string;
  perKm?: boolean;
}

interface PriceData {
  rangeId: string;
  priceHT: string;
}

interface PriceTableRowProps {
  priceData: PriceData;
  range: PriceRange;
  isEditing: boolean;
  editedPrices: Record<string, { ht: string; ttc: string }>;
  onPriceHTChange: (rangeId: string, value: string) => void;
  onPriceTTCChange: (rangeId: string, value: string) => void;
  calculateTTC: (priceHT: string) => string;
}

const PriceTableRow: React.FC<PriceTableRowProps> = ({
  priceData,
  range,
  isEditing,
  editedPrices,
  onPriceHTChange,
  onPriceTTCChange,
  calculateTTC
}) => {
  return (
    <TableRow>
      <TableCell>
        {range?.label}
        {range?.perKm && <span className="text-gray-500 italic font-light ml-1">(€/km)</span>}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            min="0"
            step="0.01"
            value={editedPrices[priceData.rangeId]?.ht || priceData.priceHT}
            onChange={(e) => onPriceHTChange(priceData.rangeId, e.target.value)}
            className="w-32"
          />
        ) : (
          `${priceData.priceHT} €`
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            min="0"
            step="0.01"
            value={editedPrices[priceData.rangeId]?.ttc || calculateTTC(priceData.priceHT)}
            onChange={(e) => onPriceTTCChange(priceData.rangeId, e.target.value)}
            className="w-32"
          />
        ) : (
          `${calculateTTC(priceData.priceHT)} €`
        )}
      </TableCell>
    </TableRow>
  );
};

export default PriceTableRow;
