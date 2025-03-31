
import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { VehicleFormProps } from "./types";
import { VehicleFormFields } from "./components/VehicleFormFields";
import { VehicleFormActions } from "./components/VehicleFormActions";

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
      <VehicleFormActions 
        onDelete={onDelete} 
        onQuoteRequest={onQuoteRequest} 
      />

      <VehicleFormFields
        index={index}
        brand={brand}
        model={model}
        year={year}
        fuel={fuel}
        licensePlate={licensePlate}
        onBrandChange={setBrand}
        onModelChange={setModel}
        onYearChange={setYear}
        onFuelChange={setFuel}
        onLicensePlateChange={setLicensePlate}
      />

      <FileUpload 
        index={index}
        files={files}
        onFilesChange={setFiles}
      />
    </div>
  );
};
