
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Calculator } from "lucide-react";
import { capitalizeFirstLetter, toUpperCase } from "@/utils/textFormatters";
import { FileUpload } from "./FileUpload";
import { VehicleFormProps } from "./types";

export const VehicleForm = ({
  index,
  onDelete,
  onChange,
  onVehicleUpdate,
  onQuoteRequest
}: VehicleFormProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuel, setFuel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(toUpperCase(e.target.value));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(capitalizeFirstLetter(e.target.value));
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensePlate(toUpperCase(e.target.value));
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

        <FileUpload 
          index={index}
          files={files}
          onFilesChange={setFiles}
        />
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

