
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleSelectorProps {
  selectedVehicle: string;
  setSelectedVehicle: (value: string) => void;
  vehicleTypes: Array<{ id: string; name: string }>;
}

export const VehicleSelector = ({ 
  selectedVehicle, 
  setSelectedVehicle,
  vehicleTypes 
}: VehicleSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Type de véhicule
      </label>
      <Select
        value={selectedVehicle}
        onValueChange={setSelectedVehicle}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un véhicule" />
        </SelectTrigger>
        <SelectContent>
          {vehicleTypes.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
