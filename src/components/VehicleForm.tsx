import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface VehicleFormProps {
  index: number;
  onDelete: () => void;
  onChange: (isValid: boolean) => void;
  onVehicleUpdate: (vehicle: {
    brand: string;
    model: string;
    year: string;
    fuel: string;
    licensePlate: string;
    files: File[];
  }) => void;
}

const FUEL_TYPES = ["Essence", "Diesel", "Électrique", "Hybride", "GPL"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export const VehicleForm = ({ index, onDelete, onChange, onVehicleUpdate }: VehicleFormProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const filesArray = Array.from(newFiles);
      const validFiles = filesArray.filter(file => 
        file.type === 'application/pdf' || file.type === 'image/jpeg'
      );
      
      if (validFiles.length !== filesArray.length) {
        alert("Seuls les fichiers PDF et JPG sont acceptés.");
      }
      
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    const isValid = brand !== "" && 
                   model !== "" && 
                   year !== "" && 
                   fuel !== "" && 
                   licensePlate !== "";
    onChange(isValid);
    
    if (isValid) {
      onVehicleUpdate({
        brand,
        model,
        year,
        fuel,
        licensePlate,
        files
      });
    }
  }, [brand, model, year, fuel, licensePlate, files, onChange, onVehicleUpdate]);

  return (
    <div className="space-y-4 border p-4 rounded-lg relative">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Véhicule {index + 1}</h3>
        <Button
          variant="destructive"
          size="icon"
          onClick={onDelete}
          className="absolute top-4 right-4"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`brand-${index}`}>Marque du véhicule *</Label>
          <Input
            id={`brand-${index}`}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor={`model-${index}`}>Modèle du véhicule *</Label>
          <Input
            id={`model-${index}`}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor={`year-${index}`}>Année *</Label>
          <Select
            value={year}
            onValueChange={setYear}
            required
          >
            <SelectTrigger id={`year-${index}`}>
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`fuel-${index}`}>Carburant *</Label>
          <Select
            value={fuel}
            onValueChange={setFuel}
            required
          >
            <SelectTrigger id={`fuel-${index}`}>
              <SelectValue placeholder="Sélectionnez le carburant" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`license-${index}`}>Immatriculation *</Label>
          <Input
            id={`license-${index}`}
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="AA-123-BB"
            required
          />
        </div>

        <div>
          <Label htmlFor={`file-${index}`}>Documents (PDF ou JPG)</Label>
          <Input
            id={`file-${index}`}
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={handleFileChange}
            multiple
          />
          <div className="mt-2 space-y-2">
            {files.map((file, fileIndex) => (
              <div key={fileIndex} className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <span>{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(fileIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
