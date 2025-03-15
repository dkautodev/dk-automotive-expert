
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf' || file.type.startsWith('image/')
      );
      
      if (validFiles.length !== e.target.files.length) {
        alert("Seuls les fichiers PDF et images sont acceptés.");
        return;
      }
      
      setVehicle({ ...vehicle, files: validFiles });
    }
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

      <div className="space-y-2">
        <Label htmlFor="fuel">Carburant *</Label>
        <Select
          value={vehicle.fuel}
          onValueChange={(value) => setVehicle({ ...vehicle, fuel: value })}
          required
        >
          <SelectTrigger id="fuel">
            <SelectValue placeholder="Sélectionnez le carburant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="essence">Essence</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybride">Hybride</SelectItem>
            <SelectItem value="electrique">Électrique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licensePlate">Immatriculation *</Label>
        <Input
          id="licensePlate"
          value={vehicle.licensePlate}
          onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
          placeholder="AA-123-BB"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="files">Documents (facultatif)</Label>
        <Input
          id="files"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,image/*"
          multiple
          className="cursor-pointer"
        />
        <p className="text-sm text-gray-500">Formats acceptés : PDF, images</p>
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
