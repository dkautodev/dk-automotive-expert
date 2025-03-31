
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeFirstLetter, toUpperCase } from "@/utils/textFormatters";

interface VehicleFormFieldsProps {
  index: number;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFuelChange: (value: string) => void;
  onLicensePlateChange: (value: string) => void;
}

export const VehicleFormFields = ({
  index,
  brand,
  model,
  year,
  fuel,
  licensePlate,
  onBrandChange,
  onModelChange,
  onYearChange,
  onFuelChange,
  onLicensePlateChange
}: VehicleFormFieldsProps) => {
  
  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBrandChange(toUpperCase(e.target.value));
  };

  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onModelChange(capitalizeFirstLetter(e.target.value));
  };

  const handleLicensePlateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLicensePlateChange(toUpperCase(e.target.value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor={`brand-${index}`}>Marque du véhicule *</Label>
        <Input 
          id={`brand-${index}`} 
          value={brand} 
          onChange={handleBrandInputChange}
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
          onChange={handleModelInputChange}
          placeholder="Clio"
          required 
        />
      </div>

      <div>
        <Label htmlFor={`license-${index}`}>Immatriculation *</Label>
        <Input 
          id={`license-${index}`} 
          value={licensePlate} 
          onChange={handleLicensePlateInputChange}
          placeholder="AA-123-BB"
          className="uppercase"
          required 
        />
      </div>

      <div>
        <Label htmlFor={`year-${index}`}>Année *</Label>
        <Select value={year} onValueChange={onYearChange} required>
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
        <Select value={fuel} onValueChange={onFuelChange} required>
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
    </div>
  );
};
