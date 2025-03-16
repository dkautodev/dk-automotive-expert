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
  return <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        
      </CardHeader>
      <CardContent className="space-y-8 p-0">
        {Array.from({
        length: vehicleCount
      }).map((_, index) => <div key={index} className="relative">
            <h3 className="text-lg font-medium mb-4">
              Véhicule {index + 1}
            </h3>
            <VehicleForm index={index} onDelete={() => onDeleteVehicle(index)} onChange={isValid => onVehicleValidityChange(index, isValid)} onVehicleUpdate={vehicle => onVehicleUpdate(index, vehicle)} />
          </div>)}
        
        <div className="flex flex-col gap-4">
          

          {canRequestQuote && <Button onClick={onQuoteRequest} className="gap-2">
              <Calculator className="h-4 w-4" />
              Obtenir votre devis
            </Button>}
        </div>
      </CardContent>
    </Card>;
};