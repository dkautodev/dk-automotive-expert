
import React, { useState } from 'react';
import { Edit, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicleTypes } from '@/lib/vehicleTypes';

// Define the distance ranges
const distanceRanges = [
  { id: '1-10', label: '1 - 10 km' },
  { id: '11-20', label: '11 - 20 km' },
  { id: '21-30', label: '21 - 30 km' },
  { id: '31-40', label: '31 - 40 km' },
  { id: '41-50', label: '41 - 50 km' },
  { id: '51-60', label: '51 - 60 km' },
  { id: '61-70', label: '61 - 70 km' },
  { id: '71-80', label: '71 - 80 km' },
  { id: '81-90', label: '81 - 90 km' },
  { id: '91-100', label: '91 - 100 km' },
  { id: '101-200', label: '101 - 200 km' },
  { id: '201-300', label: '201 - 300 km' },
  { id: '301-400', label: '301 - 400 km' },
  { id: '401-500', label: '401 - 500 km' },
  { id: '501-600', label: '501 - 600 km' },
  { id: '601-700', label: '601 - 700 km' },
  { id: '701+', label: '+ de 701 km' },
];

// Sample price grid data - in a real app this would come from the database
const initialPriceGrids = vehicleTypes.map((vehicleType) => ({
  vehicleTypeId: vehicleType.id,
  vehicleTypeName: vehicleType.name,
  prices: distanceRanges.map((range) => ({
    rangeId: range.id,
    price: ((Math.random() * 50) + 50).toFixed(2), // Random price between 50 and 100€
  })),
}));

const PricingGrid: React.FC = () => {
  const [priceGrids, setPriceGrids] = useState(initialPriceGrids);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, string>>({});

  const handleEditGrid = (vehicleTypeId: string) => {
    setEditingGrid(vehicleTypeId);
    
    // Initialize edited prices with current values
    const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
    if (grid) {
      const prices: Record<string, string> = {};
      grid.prices.forEach(p => {
        prices[p.rangeId] = p.price.toString();
      });
      setEditedPrices(prices);
    }
  };

  const handleSaveGrid = (vehicleTypeId: string) => {
    setPriceGrids(prevGrids => 
      prevGrids.map(grid => {
        if (grid.vehicleTypeId === vehicleTypeId) {
          return {
            ...grid,
            prices: grid.prices.map(price => ({
              ...price,
              price: editedPrices[price.rangeId] || price.price,
            })),
          };
        }
        return grid;
      })
    );
    setEditingGrid(null);
    setEditedPrices({});
  };

  const handlePriceChange = (rangeId: string, value: string) => {
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {priceGrids.map((grid) => (
        <Card key={grid.vehicleTypeId} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle>{grid.vehicleTypeName}</CardTitle>
              {editingGrid === grid.vehicleTypeId ? (
                <Button 
                  onClick={() => handleSaveGrid(grid.vehicleTypeId)}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEditGrid(grid.vehicleTypeId)}
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
                    <TableHead className="font-bold">Prix (HT)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grid.prices.map((price) => {
                    const range = distanceRanges.find(r => r.id === price.rangeId);
                    return (
                      <TableRow key={price.rangeId}>
                        <TableCell>{range?.label}</TableCell>
                        <TableCell>
                          {editingGrid === grid.vehicleTypeId ? (
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editedPrices[price.rangeId] || price.price}
                              onChange={(e) => handlePriceChange(price.rangeId, e.target.value)}
                              className="w-32"
                            />
                          ) : (
                            `${price.price} €`
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingGrid;
