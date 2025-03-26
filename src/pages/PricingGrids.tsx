
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import PricingGrid from "@/components/admin/PricingGrid";
import { usePricingGridsDB } from "@/hooks/usePricingGridsDB";
import { Loader } from "@/components/ui/loader";
import UpdatePriceGridsButton from "@/components/admin/UpdatePriceGridsButton";

const PricingGrids = () => {
  const { priceGrids, loading } = usePricingGridsDB();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des grilles tarifaires</h1>
        <div className="flex gap-2">
          <UpdatePriceGridsButton />
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle grille
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grilles tarifaires par type de véhicule</CardTitle>
          <CardDescription>
            Configurez les tarifs pour chaque type de véhicule en fonction des tranches kilométriques
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Loader className="w-8 h-8" />
              <span className="ml-2 text-muted-foreground">Chargement des grilles tarifaires...</span>
            </div>
          ) : (
            <PricingGrid />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingGrids;
