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
  setVehicleCount: React.Dispatch<React.SetStateAction<number>>;
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
  const handleAddVehicle = () => {
    setVehicleCount(prev => prev + 1);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Véhicules à transporter</CardTitle>
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
          {vehicleCount === 0 && (
            <Button 
              variant="outline" 
              onClick={handleAddVehicle}
              className="border-dashed border-2 gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un véhicule
            </Button>
          )}

          {canRequestQuote && (
            <Button onClick={onQuoteRequest} className="gap-2">
              <Calculator className="h-4 w-4" />
              Obtenir votre devis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
