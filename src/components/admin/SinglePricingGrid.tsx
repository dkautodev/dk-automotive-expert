
import React from 'react';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceGrid, PriceRange } from './pricingTypes';
import PricingTableHeader from './PricingTableHeader';
import PricingTableBody from './PricingTableBody';
import PricingActionButton from './PricingActionButton';

interface SinglePricingGridProps {
  grid: PriceGrid;
  distanceRanges: PriceRange[];
  editingGrid: string | null;
  editedPrices: Record<string, { ht: string, ttc: string }>;
  onEditGrid: (vehicleTypeId: string) => void;
  onSaveGrid: (vehicleTypeId: string) => void;
  onPriceHTChange: (rangeId: string, value: string) => void;
  onPriceTTCChange: (rangeId: string, value: string) => void;
}

const SinglePricingGrid: React.FC<SinglePricingGridProps> = ({
  grid,
  distanceRanges,
  editingGrid,
  editedPrices,
  onEditGrid,
  onSaveGrid,
  onPriceHTChange,
  onPriceTTCChange,
}) => {
  const isEditing = editingGrid === grid.vehicleTypeId;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle>{grid.vehicleTypeName}</CardTitle>
          <PricingActionButton 
            isEditing={isEditing}
            onEdit={() => onEditGrid(grid.vehicleTypeId)}
            onSave={() => onSaveGrid(grid.vehicleTypeId)}
          />
        </div>
        <CardDescription>
          Grille tarifaire pour {grid.vehicleTypeName.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <PricingTableHeader />
            <PricingTableBody 
              prices={grid.prices}
              distanceRanges={distanceRanges}
              isEditing={isEditing}
              editedPrices={editedPrices}
              onPriceHTChange={onPriceHTChange}
              onPriceTTCChange={onPriceTTCChange}
            />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SinglePricingGrid;
