
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
  { id: '101-200', label: '101 - 200 km', perKm: true },
  { id: '201-300', label: '201 - 300 km', perKm: true },
  { id: '301-400', label: '301 - 400 km', perKm: true },
  { id: '401-500', label: '401 - 500 km', perKm: true },
  { id: '501-600', label: '501 - 600 km', perKm: true },
  { id: '601-700', label: '601 - 700 km', perKm: true },
  { id: '701+', label: '+ de 701 km', perKm: true },
];

// Sample price grid data - in a real app this would come from the database
const initialPriceGrids = vehicleTypes.map((vehicleType) => ({
  vehicleTypeId: vehicleType.id,
  vehicleTypeName: vehicleType.name,
  prices: distanceRanges.map((range) => ({
    rangeId: range.id,
    priceHT: ((Math.random() * 50) + 50).toFixed(2), // Random price between 50 and 100€
  })),
}));

// VAT rate (20%)
const VAT_RATE = 0.20;

// Calculate TTC from HT
const calculateTTC = (priceHT: string): string => {
  const ht = parseFloat(priceHT);
  return (ht + (ht * VAT_RATE)).toFixed(2);
};

// Calculate HT from TTC
const calculateHT = (priceTTC: string): string => {
  const ttc = parseFloat(priceTTC);
  return (ttc / (1 + VAT_RATE)).toFixed(2);
};

interface PriceData {
  rangeId: string;
  priceHT: string;
}

const PricingGrid: React.FC = () => {
  const [priceGrids, setPriceGrids] = useState(initialPriceGrids);
  const [editingGrid, setEditingGrid] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, { ht: string, ttc: string }>>({});

  const handleEditGrid = (vehicleTypeId: string) => {
    setEditingGrid(vehicleTypeId);
    
    // Initialize edited prices with current values
    const grid = priceGrids.find(g => g.vehicleTypeId === vehicleTypeId);
    if (grid) {
      const prices: Record<string, { ht: string, ttc: string }> = {};
      grid.prices.forEach(p => {
        prices[p.rangeId] = { 
          ht: p.priceHT, 
          ttc: calculateTTC(p.priceHT) 
        };
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
              priceHT: editedPrices[price.rangeId]?.ht || price.priceHT,
            })),
          };
        }
        return grid;
      })
    );
    setEditingGrid(null);
    setEditedPrices({});
  };

  const handlePriceHTChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const ttcValue = calculateTTC(sanitizedValue);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: sanitizedValue,
        ttc: ttcValue
      },
    }));
  };

  const handlePriceTTCChange = (rangeId: string, value: string) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    const htValue = calculateHT(sanitizedValue);
    
    setEditedPrices(prev => ({
      ...prev,
      [rangeId]: { 
        ht: htValue,
        ttc: sanitizedValue
      },
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
                    <TableHead className="font-bold">Prix HT</TableHead>
                    <TableHead className="font-bold">Prix TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grid.prices.map((price) => {
                    const range = distanceRanges.find(r => r.id === price.rangeId);
                    return (
                      <TableRow key={price.rangeId}>
                        <TableCell>
                          {range?.label}
                          {range?.perKm && " /km"}
                        </TableCell>
                        <TableCell>
                          {editingGrid === grid.vehicleTypeId ? (
                            <Input
                              type="text"
                              min="0"
                              step="0.01"
                              value={editedPrices[price.rangeId]?.ht || price.priceHT}
                              onChange={(e) => handlePriceHTChange(price.rangeId, e.target.value)}
                              className="w-32"
                            />
                          ) : (
                            `${price.priceHT} €`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingGrid === grid.vehicleTypeId ? (
                            <Input
                              type="text"
                              min="0"
                              step="0.01"
                              value={editedPrices[price.rangeId]?.ttc || calculateTTC(price.priceHT)}
                              onChange={(e) => handlePriceTTCChange(price.rangeId, e.target.value)}
                              className="w-32"
                            />
                          ) : (
                            `${calculateTTC(price.priceHT)} €`
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
