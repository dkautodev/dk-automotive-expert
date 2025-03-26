
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import PricingGrid from "@/components/admin/PricingGrid";

const PricingGrids = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des grilles tarifaires</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle grille
        </Button>
      </div>
      
      <Tabs defaultValue="by-vehicle" className="w-full">
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
            <CardContent>
              <p className="text-gray-500">
                Cette vue est en cours de développement. Veuillez utiliser la vue par véhicule pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingGrids;
