
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const useAttachmentUpload = () => {
  const { user } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);

  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_') // Replace special characters with _
      .replace(/\s+/g, '_'); // Replace spaces with _
  };

  const uploadAttachments = async (missionId: string, attachments: File[]) => {
    if (!attachments || attachments.length === 0) return;
    
    setIsUploading(true);
    const results = [];
    
    try {
      for (const file of attachments) {
        try {
          const sanitizedFileName = sanitizeFileName(file.name);
          const uniqueId = Date.now().toString();
          const filePath = `missions/${missionId}/${uniqueId}_${sanitizedFileName}`;
          
          console.log("Uploading file:", file.name, "to path:", filePath);
          
          const { data: fileData, error: uploadError } = await supabase.storage
            .from('mission-attachments')
            .upload(filePath, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            throw uploadError;
          }

          console.log("File uploaded successfully, saving record in database");

          const { error: dbError } = await supabase
            .from('mission_attachments')
            .insert({
              mission_id: missionId,
              file_name: file.name,
              file_path: filePath,
              file_type: file.type,
              file_size: file.size,
              uploaded_by: user!.id,
              storage_provider: 'supabase'
            });

          if (dbError) {
            console.error("Database error when saving attachment:", dbError);
            throw dbError;
          }
          
          results.push({ success: true, file: file.name });
        } catch (error: any) {
          console.error("Error processing attachment:", error);
          results.push({ success: false, file: file.name, error: error.message });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      if (successCount === attachments.length) {
        console.log("Tous les fichiers ont été téléchargés avec succès");
      } else if (successCount > 0) {
        console.warn(`${successCount}/${attachments.length} fichiers téléchargés avec succès`);
        toast.warning(`${successCount}/${attachments.length} pièces jointes ont été téléchargées`);
      } else {
        console.error("Aucun fichier n'a pu être téléchargé");
        toast.error("Aucune pièce jointe n'a pu être téléchargée");
      }
      
      return successCount > 0;
    } catch (error: any) {
      console.error("Error in attachment upload process:", error);
      toast.error(`Erreur lors du téléchargement des pièces jointes: ${error.message}`);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAttachments, isUploading };
};
