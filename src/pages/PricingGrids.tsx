
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Grilles tarifaires</CardTitle>
          <CardDescription>Configurez les différentes grilles tarifaires pour les devis clients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type de véhicule</TableHead>
                <TableHead>Prix de base (HT)</TableHead>
                <TableHead>Prix par km (HT)</TableHead>
                <TableHead>TVA (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Voiture particulière</TableCell>
                <TableCell>Citadine</TableCell>
                <TableCell>100 €</TableCell>
                <TableCell>0.50 €</TableCell>
                <TableCell>20%</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Modifier</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Utilitaire léger</TableCell>
                <TableCell>Camionnette</TableCell>
                <TableCell>150 €</TableCell>
                <TableCell>0.75 €</TableCell>
                <TableCell>20%</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Modifier</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Ces tarifs sont utilisés pour calculer automatiquement le prix des devis clients.
        </CardFooter>
      </Card>
    </div>
  );
};

export default PricingGrids;
