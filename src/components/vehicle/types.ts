
export interface VehicleFormProps {
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

export interface FileUploadProps {
  index: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

