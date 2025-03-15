
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFormProps {
  index: number;
}

const FUEL_TYPES = ["Essence", "Diesel", "Électrique", "Hybride", "GPL"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export const VehicleForm = ({ index }: VehicleFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB
        alert("Le fichier est trop volumineux. Maximum 10 Mo.");
        event.target.value = '';
        return;
      }
      if (file.type !== 'application/pdf') {
        alert("Seuls les fichiers PDF sont acceptés.");
        event.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h3 className="font-semibold text-lg">Véhicule {index + 1}</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`brand-${index}`}>Marque du véhicule *</Label>
          <Input
            id={`brand-${index}`}
            required
          />
        </div>

        <div>
          <Label htmlFor={`model-${index}`}>Modèle du véhicule *</Label>
          <Input
            id={`model-${index}`}
            required
          />
        </div>

        <div>
          <Label htmlFor={`year-${index}`}>Année *</Label>
          <Select required>
            <SelectTrigger id={`year-${index}`}>
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`fuel-${index}`}>Carburant *</Label>
          <Select required>
            <SelectTrigger id={`fuel-${index}`}>
              <SelectValue placeholder="Sélectionnez le carburant" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`file-${index}`}>Documents (PDF, max 10 Mo) *</Label>
          <Input
            id={`file-${index}`}
            type="file"
            accept=".pdf"
            required
            onChange={handleFileChange}
          />
          {selectedFile && (
            <p className="text-sm text-gray-500 mt-1">
              Fichier sélectionné : {selectedFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
