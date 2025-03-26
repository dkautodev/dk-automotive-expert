
import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { distanceRanges, initialPriceGrids } from "@/hooks/usePricingGrids";
import { calculateTTC } from "@/utils/priceCalculations";

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
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 border-r">Distance</TableHead>
                      {vehicleTypes.map((vehicleType, index) => (
                        <React.Fragment key={vehicleType.id}>
                          {index > 0 && (
                            <TableHead className="p-0 w-1 border-0">
                              <div className="h-full flex justify-center">
                                <Separator orientation="vertical" className="h-full absolute" />
                              </div>
                            </TableHead>
                          )}
                          <TableHead colSpan={2} className="text-center w-40">
                            {vehicleType.name}
                          </TableHead>
                        </React.Fragment>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 border-r text-center">
                        km
                      </TableHead>
                      {vehicleTypes.map((vehicleType, index) => (
                        <React.Fragment key={`header-${vehicleType.id}`}>
                          {index > 0 && (
                            <TableHead className="p-0 w-1 border-0">
                              <div className="h-full flex justify-center">
                                <Separator orientation="vertical" className="h-full absolute" />
                              </div>
                            </TableHead>
                          )}
                          <TableHead className="text-center w-40">Prix HT</TableHead>
                          <TableHead className="text-center w-40">Prix TTC</TableHead>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distanceRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell className="font-medium sticky left-0 bg-background z-10 border-r">
                          {range.label.replace(' km', '')}
                          {range.perKm && <span className="text-gray-500 italic font-light ml-1">(€/km)</span>}
                        </TableCell>
                        {vehicleTypes.map((vehicleType, index) => {
                          const grid = priceGrids.find(g => g.vehicleTypeId === vehicleType.id);
                          const price = grid?.prices.find(p => p.rangeId === range.id);
                          const priceHT = price?.priceHT || "0.00";
                          const priceTTC = calculateTTC(priceHT);
                          
                          return (
                            <React.Fragment key={`${range.id}-${vehicleType.id}`}>
                              {index > 0 && (
                                <TableCell className="p-0 w-1 border-0 relative">
                                  <div className="h-full flex justify-center">
                                    <Separator orientation="vertical" className="h-full absolute" />
                                  </div>
                                </TableCell>
                              )}
                              <TableCell className="text-center w-40">{priceHT}</TableCell>
                              <TableCell className="text-center w-40">{priceTTC}</TableCell>
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
