import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/VehicleForm";
import { Calculator, Plus } from "lucide-react";

interface VehicleInfo {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
}

interface VehiclesSectionProps {
  vehicleCount: number;
  vehicleFormsValidity: boolean[];
  onVehicleValidityChange: (index: number, isValid: boolean) => void;
  onDeleteVehicle: (index: number) => void;
  onVehicleUpdate: (index: number, vehicle: VehicleInfo) => void;
  onQuoteRequest?: () => void;
  canRequestQuote?: boolean;
  setVehicleCount: (count: number) => void;
}

export const VehiclesSection = ({
  vehicleCount,
  vehicleFormsValidity,
  onVehicleValidityChange,
  onDeleteVehicle,
  onVehicleUpdate,
  onQuoteRequest,
  canRequestQuote,
  setVehicleCount
}: VehiclesSectionProps) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Véhicule{vehicleCount > 1 ? 's' : ''}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-0">
        {Array.from({ length: vehicleCount }).map((_, index) => (
          <div key={index} className="relative">
            <h3 className="text-lg font-medium mb-4">
              Véhicule {index + 1}
            </h3>
            <VehicleForm
              index={index}
              onDelete={() => onDeleteVehicle(index)}
              onChange={isValid => onVehicleValidityChange(index, isValid)}
              onVehicleUpdate={vehicle => onVehicleUpdate(index, vehicle)}
            />
          </div>
        ))}
        
        <div className="flex flex-col gap-4">
          <Button 
            variant="outline" 
            className="w-full gap-2 border-dashed"
            onClick={() => setVehicleCount(prev => prev + 1)}
          >
            <Plus className="h-4 w-4" />
            Ajouter un véhicule
          </Button>

          {canRequestQuote && (
            <Button 
              onClick={onQuoteRequest}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Obtenir votre devis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
