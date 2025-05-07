
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface LogoUploadProps {
  currentLogo?: string | null;
  onUploadSuccess: (url: string) => void;
}

export const LogoUpload = ({ currentLogo, onUploadSuccess }: LogoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image.");
      return;
    }

    try {
      setIsUploading(true);
      
      // Mock implementation - in a real app, this would upload to a server
      // Here we just create a local object URL
      const objectUrl = URL.createObjectURL(file);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadSuccess(objectUrl);
      toast.success("Votre logo a été mis à jour.");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue lors du téléchargement.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentLogo || ''} alt="Logo" />
        <AvatarFallback>LOGO</AvatarFallback>
      </Avatar>
      <Button variant="outline" disabled={isUploading} asChild>
        <label className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Téléchargement...' : 'Changer le logo'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
};
