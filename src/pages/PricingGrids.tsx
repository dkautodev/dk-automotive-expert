
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import PricingGrid from "@/components/admin/PricingGrid";
import { usePricingGridsDB } from "@/hooks/usePricingGridsDB";
import { Loader } from "@/components/ui/loader";

const PricingGrids = () => {
  const { priceGrids, loading } = usePricingGridsDB();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des grilles tarifaires</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle grille
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Grilles tarifaires par type de véhicule</h2>
            <p className="text-muted-foreground">
              Configurez les tarifs pour chaque type de véhicule en fonction des tranches kilométriques
            </p>
          </div>
          
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
