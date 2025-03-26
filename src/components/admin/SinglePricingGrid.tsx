
import React from 'react';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PriceTableRow from './PriceTableRow';
import { calculateTTC } from '@/utils/priceCalculations';

interface PriceRange {
  id: string;
  label: string;
  perKm?: boolean;
}

interface PriceData {
  rangeId: string;
  priceHT: string;
}

interface PriceGrid {
  vehicleTypeId: string;
  vehicleTypeName: string;
  prices: PriceData[];
}

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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle>{grid.vehicleTypeName}</CardTitle>
          {editingGrid === grid.vehicleTypeId ? (
            <Button 
              onClick={() => onSaveGrid(grid.vehicleTypeId)}
              size="sm"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          ) : (
            <Button 
              onClick={() => onEditGrid(grid.vehicleTypeId)}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
        <CardDescription>
          Grille tarifaire pour {grid.vehicleTypeName.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Distance</TableHead>
                <TableHead className="font-bold">Prix HT</TableHead>
                <TableHead className="font-bold">Prix TTC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.prices.map((price) => {
                const range = distanceRanges.find(r => r.id === price.rangeId);
                return range && (
                  <PriceTableRow
                    key={price.rangeId}
                    priceData={price}
                    range={range}
                    isEditing={editingGrid === grid.vehicleTypeId}
                    editedPrices={editedPrices}
                    onPriceHTChange={onPriceHTChange}
                    onPriceTTCChange={onPriceTTCChange}
                    calculateTTC={calculateTTC}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SinglePricingGrid;
