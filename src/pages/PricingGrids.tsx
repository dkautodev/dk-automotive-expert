
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import PricingGrid from "@/components/admin/PricingGrid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { useState } from "react";

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

const PricingGrids = () => {
  const [activeTab, setActiveTab] = useState("by-vehicle");
  const [priceGrids, setPriceGrids] = useState(initialPriceGrids);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des grilles tarifaires</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle grille
        </Button>
      </div>
      
      <Tabs defaultValue="by-vehicle" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="by-vehicle">Par véhicule</TabsTrigger>
          <TabsTrigger value="all-grids">Toutes les grilles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="by-vehicle">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Grilles tarifaires par type de véhicule</CardTitle>
              <CardDescription>
                Configurez les tarifs pour chaque type de véhicule en fonction des tranches kilométriques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PricingGrid />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all-grids">
          <Card>
            <CardHeader>
              <CardTitle>Vue complète des grilles tarifaires</CardTitle>
              <CardDescription>
                Aperçu de toutes les grilles tarifaires en un seul tableau
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10">Distance</TableHead>
                      {vehicleTypes.map((vehicleType) => (
                        <TableHead key={vehicleType.id} colSpan={2} className="text-center">
                          {vehicleType.name}
                        </TableHead>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10"></TableHead>
                      {vehicleTypes.map((vehicleType) => (
                        <React.Fragment key={`header-${vehicleType.id}`}>
                          <TableHead className="text-center">Prix HT</TableHead>
                          <TableHead className="text-center">Prix TTC</TableHead>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distanceRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10">
                          {range.label}
                          {range.perKm && <span className="text-gray-500 italic font-light ml-1">(€/km)</span>}
                        </TableCell>
                        {vehicleTypes.map((vehicleType) => {
                          const grid = priceGrids.find(g => g.vehicleTypeId === vehicleType.id);
                          const price = grid?.prices.find(p => p.rangeId === range.id);
                          const priceHT = price?.priceHT || "0.00";
                          const priceTTC = calculateTTC(priceHT);
                          
                          return (
                            <React.Fragment key={`${range.id}-${vehicleType.id}`}>
                              <TableCell className="text-center">{priceHT} €</TableCell>
                              <TableCell className="text-center">{priceTTC} €</TableCell>
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingGrids;
