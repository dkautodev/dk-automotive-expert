import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Calculator } from "lucide-react";
import { capitalizeFirstLetter, toUpperCase } from "@/utils/textFormatters";

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
  onQuoteRequest?: () => void;
}

export const VehicleForm = ({
  index,
  onDelete,
  onChange,
  onVehicleUpdate
}: VehicleFormProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const capitalizeFirstLetter = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(toUpperCase(e.target.value));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(capitalizeFirstLetter(e.target.value));
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensePlate(toUpperCase(e.target.value));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const filesArray = Array.from(newFiles);
      const validFiles = filesArray.filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'image/jpeg' || 
        file.type === 'image/jpg'
      );
      
      if (validFiles.length !== filesArray.length) {
        alert("Seuls les fichiers PDF et JPG sont acceptés.");
        return;
      }
      
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, i) => i !== indexToRemove));
  };

  const onQuoteRequest = () => {
    // Implement quote request logic here
  };

  useEffect(() => {
    const isValid = brand !== "" && model !== "" && year !== "" && fuel !== "" && licensePlate !== "";
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
    <div className="space-y-4 bg-white rounded-lg p-6 border">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={onDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor={`brand-${index}`}>Marque du véhicule *</Label>
          <Input 
            id={`brand-${index}`} 
            value={brand} 
            onChange={handleBrandChange}
            placeholder="RENAULT"
            className="uppercase"
            required 
          />
        </div>

        <div>
          <Label htmlFor={`model-${index}`}>Modèle du véhicule *</Label>
          <Input 
            id={`model-${index}`} 
            value={model} 
            onChange={handleModelChange}
            placeholder="Clio"
            required 
          />
        </div>

        <div>
          <Label htmlFor={`license-${index}`}>Immatriculation *</Label>
          <Input 
            id={`license-${index}`} 
            value={licensePlate} 
            onChange={handleLicensePlateChange}
            placeholder="AA-123-BB"
            className="uppercase"
            required 
          />
        </div>

        <div>
          <Label htmlFor={`year-${index}`}>Année *</Label>
          <Select value={year} onValueChange={setYear} required>
            <SelectTrigger id={`year-${index}`}>
              <SelectValue placeholder="Sélectionnez l'année" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i)
                .map(y => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`fuel-${index}`}>Carburant *</Label>
          <Select value={fuel} onValueChange={setFuel} required>
            <SelectTrigger id={`fuel-${index}`}>
              <SelectValue placeholder="Sélectionnez le carburant" />
            </SelectTrigger>
            <SelectContent>
              {["Essence", "Diesel", "Électrique", "Hybride"].map(f => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor={`file-${index}`}>Documents (PDF ou JPG uniquement)</Label>
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer border rounded-md p-3 hover:bg-gray-50">
              <Upload className="h-5 w-5" />
              <span>Ajouter des documents</span>
              <Input 
                id={`file-${index}`} 
                type="file" 
                accept=".pdf,.jpg,.jpeg" 
                onChange={handleFileChange} 
                multiple 
                className="hidden"
              />
            </label>
          </div>
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

      <div className="flex justify-end mt-6">
        <Button variant="default" className="gap-2" onClick={onQuoteRequest}>
          <Calculator className="h-4 w-4" />
          Votre devis
        </Button>
      </div>
    </div>
  );
};
