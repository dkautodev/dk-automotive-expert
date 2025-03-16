
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { FileUploadProps } from "./types";

export const FileUpload = ({ index, files, onFilesChange }: FileUploadProps) => {
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
      
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, i) => i !== indexToRemove));
  };

  return (
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
  );
};

