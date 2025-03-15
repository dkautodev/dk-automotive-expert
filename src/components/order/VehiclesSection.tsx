
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/VehicleForm";
import { Plus, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  onAddVehicle: () => void;
  onVehicleUpdate: (index: number, vehicle: VehicleInfo) => void;
}

export const VehiclesSection = ({
  vehicleCount,
  vehicleFormsValidity,
  onVehicleValidityChange,
  onDeleteVehicle,
  onAddVehicle,
  onVehicleUpdate
}: VehiclesSectionProps) => {
  const canAddNewVehicle = vehicleCount === 0 || vehicleFormsValidity[vehicleCount - 1] === true;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Véhicule.s</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            {vehicleCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: vehicleCount }).map((_, index) => (
          <VehicleForm
            key={index}
            index={index}
            onDelete={() => onDeleteVehicle(index)}
            onChange={isValid => onVehicleValidityChange(index, isValid)}
            onVehicleUpdate={(vehicle) => onVehicleUpdate(index, vehicle)}
          />
        ))}
        
        <div className="flex justify-end">
          <Button
            onClick={onAddVehicle}
            variant="outline"
            className="gap-2"
            disabled={!canAddNewVehicle}
          >
            <Plus className="h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
