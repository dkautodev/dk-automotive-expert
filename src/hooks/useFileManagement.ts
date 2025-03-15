
import { useState } from "react";

export const useFileManagement = () => {
  const [newFiles, setNewFiles] = useState<{ [key: number]: File[] }>({});

  const handleFileChange = (vehicleIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.type === 'image/jpeg'
      );
      
      if (validFiles.length !== files.length) {
        alert("Seuls les fichiers PDF et JPG sont acceptés.");
      }
      
      setNewFiles(prev => ({
        ...prev,
        [vehicleIndex]: [...(prev[vehicleIndex] || []), ...validFiles]
      }));
    }
  };

  const handleRemoveFile = (vehicleIndex: number, fileIndex: number) => {
    setNewFiles(prev => ({
      ...prev,
      [vehicleIndex]: prev[vehicleIndex].filter((_, i) => i !== fileIndex)
    }));
  };

  const clearVehicleFiles = (vehicleIndex: number) => {
    setNewFiles(prev => {
      const updated = { ...prev };
      delete updated[vehicleIndex];
      return updated;
    });
  };

  return {
    newFiles,
    handleFileChange,
    handleRemoveFile,
    clearVehicleFiles
  };
};
