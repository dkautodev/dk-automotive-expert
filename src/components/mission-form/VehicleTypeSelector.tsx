
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { vehicleTypes } from "@/lib/vehicleTypes";

interface VehicleTypeSelectorProps {
  form: UseFormReturn<MissionFormValues>;
}

const VehicleTypeSelector = ({ form }: VehicleTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="vehicle_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de véhicule</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de véhicule" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VehicleTypeSelector;
