import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/vehicle/VehicleForm";
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
  return <Card className="border-0 shadow-none">
      
      <CardContent className="space-y-8 p-0">
        {Array.from({
        length: vehicleCount
      }).map((_, index) => <div key={index} className="relative">
            <VehicleForm index={index} onDelete={() => onDeleteVehicle(index)} onChange={isValid => onVehicleValidityChange(index, isValid)} onVehicleUpdate={vehicle => onVehicleUpdate(index, vehicle)} onQuoteRequest={onQuoteRequest} />
          </div>)}
        
        <div className="flex flex-col gap-4">
          {vehicleCount === 0}
        </div>
      </CardContent>
    </Card>;
};