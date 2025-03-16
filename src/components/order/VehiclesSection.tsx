
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/VehicleForm";
import { Calculator } from "lucide-react";

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
}

export const VehiclesSection = ({
  vehicleFormsValidity,
  onVehicleValidityChange,
  onDeleteVehicle,
  onVehicleUpdate,
  onQuoteRequest,
  canRequestQuote
}: VehiclesSectionProps) => {
  return <Card>
      <CardHeader>
        <CardTitle>Véhicule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 1 }).map((_, index) => (
          <VehicleForm
            key={index}
            index={index}
            onDelete={() => onDeleteVehicle(index)}
            onChange={isValid => onVehicleValidityChange(index, isValid)}
            onVehicleUpdate={vehicle => onVehicleUpdate(index, vehicle)}
          />
        ))}
        
        <div className="flex justify-end">
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
    </Card>;
};
