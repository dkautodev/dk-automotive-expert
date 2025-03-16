
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormActions as FormActionsProps } from "./types";

export const FormActions = ({ handleSubmit, isFormValid, globalFiles, setGlobalFiles }: FormActionsProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      file => file.type === 'application/pdf' || file.type.startsWith('image/jpeg')
    );
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers PDF et JPG sont acceptés",
        variant: "destructive"
      });
      return;
    }
    
    setGlobalFiles(prev => [...prev, ...validFiles]);
  };

  return (
    <div className="flex justify-end gap-4 mt-6 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="cursor-pointer">
            <Input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg"
              multiple
            />
            <Button variant="outline" type="button" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>PDF ou JPG uniquement</p>
        </TooltipContent>
      </Tooltip>
      <Button onClick={handleSubmit} disabled={!isFormValid}>
        Générer le devis
      </Button>
    </div>
  );
};
