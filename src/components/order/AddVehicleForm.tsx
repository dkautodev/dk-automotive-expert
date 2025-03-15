
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vehicle {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
}

interface AddVehicleFormProps {
  onSubmit: (vehicle: Vehicle) => void;
  onCancel: () => void;
}

export const AddVehicleForm = ({ onSubmit, onCancel }: AddVehicleFormProps) => {
  const [vehicle, setVehicle] = useState<Vehicle>({
    brand: "",
    model: "",
    year: "",
    fuel: "",
    licensePlate: "",
    files: []
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vehicle);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brand">Marque du véhicule *</Label>
        <Input
          id="brand"
          value={vehicle.brand}
          onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Modèle du véhicule *</Label>
        <Input
          id="model"
          value={vehicle.model}
          onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Année *</Label>
        <Select
          value={vehicle.year}
          onValueChange={(value) => setVehicle({ ...vehicle, year: value })}
          required
        >
          <SelectTrigger id="year">
            <SelectValue placeholder="Sélectionnez l'année" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Ajouter le véhicule
        </Button>
      </div>
    </form>
  );
};
