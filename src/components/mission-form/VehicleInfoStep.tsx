
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MissionFormValues } from "./missionFormSchema";
import VehicleTypeSelector from "./VehicleTypeSelector";
import { vehicleTypes, getVehiclesByCategory } from "@/lib/vehicleTypes";
import { useEffect, useState } from "react";

interface VehicleInfoStepProps {
  form: UseFormReturn<MissionFormValues>;
  onNext: () => void;
  onPrevious: () => void;
}

const VehicleInfoStep = ({ form, onNext, onPrevious }: VehicleInfoStepProps) => {
  const selectedVehicleType = form.watch("vehicle_type");
  const [suggestedVehicles, setSuggestedVehicles] = useState<string[]>([]);
  
  useEffect(() => {
    if (selectedVehicleType) {
      const vehicles = getVehiclesByCategory(selectedVehicleType);
      setSuggestedVehicles(vehicles);
      
      // Reset brand and model when changing vehicle type
      form.setValue("brand", "");
      form.setValue("model", "");
    }
  }, [selectedVehicleType, form]);
  
  const handleVehicleSelection = (value: string) => {
    if (value) {
      const [brand, ...modelParts] = value.split(" ");
      const model = modelParts.join(" ");
      
      form.setValue("brand", brand);
      form.setValue("model", model);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Informations du véhicule</div>
      <p className="text-muted-foreground">
        Veuillez fournir les informations détaillées du véhicule à convoyer
      </p>

      <div className="space-y-4">
        <VehicleTypeSelector form={form} />
        
        {selectedVehicleType && suggestedVehicles.length > 0 && (
          <FormField
            control={form.control}
            name="suggested_vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Véhicule suggéré</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleVehicleSelection(value);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suggestedVehicles.map((vehicle) => (
                      <SelectItem key={vehicle} value={vehicle}>
                        {vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Marque du véhicule" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Modèle du véhicule" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de carburant</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de carburant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="essence">Essence</SelectItem>
                  <SelectItem value="electrique">Électrique</SelectItem>
                  <SelectItem value="hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation</FormLabel>
              <FormControl>
                <Input
                  placeholder="AB-123-CD"
                  {...field}
                  className="uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Précédent
        </Button>
        <Button
          type="button"
          onClick={onNext}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default VehicleInfoStep;
