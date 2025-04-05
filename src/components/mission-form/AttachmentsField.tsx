
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Paperclip, Trash2, File } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";

interface AttachmentsFieldProps {
  form: UseFormReturn<MissionFormValues>;
}

const AttachmentsField = ({ form }: AttachmentsFieldProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Check file types (allow only images and PDFs)
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== files.length) {
      alert("Seuls les fichiers image et PDF sont acceptés");
    }
    
    // Check total size (10MB limit)
    const currentSize = attachments.reduce((sum, file) => sum + file.size, 0);
    const newSize = validFiles.reduce((sum, file) => sum + file.size, 0);
    const totalSize = currentSize + newSize;
    
    if (totalSize > 10 * 1024 * 1024) { // 10MB in bytes
      alert("La taille totale des fichiers ne peut pas dépasser 10 Mo");
      return;
    }

    // Ajouter une validation des noms de fichiers
    const cleanedFiles = validFiles.map(file => {
      // Si le nom contient des caractères problématiques, créer un Blob avec le même contenu mais un nom nettoyé
      if (/[\/\\:*?"<>|']/g.test(file.name)) {
        const cleanName = file.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')  // Supprimer les accents
          .replace(/[\/\\:*?"<>|']/g, '_')  // Remplacer caractères spéciaux
          .replace(/\s+/g, '_');            // Remplacer espaces par _
        
        // Créer un nouveau Blob avec le même contenu mais un nom différent
        return new File([file], cleanName, { type: file.type });
      }
      return file;
    });
    
    // Add valid files
    setAttachments(prev => [...prev, ...cleanedFiles]);
    
    // Update form value
    form.setValue("attachments", [...attachments, ...cleanedFiles]);
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    form.setValue("attachments", newAttachments);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };
  
  const getTotalSize = () => {
    return formatFileSize(attachments.reduce((sum, file) => sum + file.size, 0));
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    return '📎';
  };

  return (
    <FormField
      control={form.control}
      name="attachments"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Pièces jointes (10 Mo max)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  id="file-upload"
                  accept="image/*,.pdf"
                  onChange={handleAttachmentChange}
                  className="hidden"
                  multiple
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md"
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Ajouter des fichiers
                </label>
                {attachments.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {attachments.length} fichier(s) - {getTotalSize()}
                  </span>
                )}
              </div>
              
              {/* File list */}
              {attachments.length > 0 && (
                <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-1 px-2 text-sm bg-background hover:bg-muted/50 rounded">
                      <div className="flex items-center gap-2 truncate">
                        <span>{getFileIcon(file.type)}</span>
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <span className="text-muted-foreground text-xs">{formatFileSize(file.size)}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeAttachment(index)}
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default AttachmentsField;
