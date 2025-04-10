
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAttachmentUpload = () => {
  const { user } = useAuthContext();

  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_') // Replace special characters with _
      .replace(/\s+/g, '_'); // Replace spaces with _
  };

  const uploadAttachments = async (missionId: string, attachments: File[]) => {
    if (!attachments || attachments.length === 0) return;
    
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
            uploaded_by: user!.id
          });

        if (dbError) {
          console.error("Database error when saving attachment:", dbError);
          throw dbError;
        }
      } catch (error: any) {
        console.error("Error processing attachment:", error);
        toast.error(`Erreur lors de l'ajout de la pièce jointe ${file.name}: ${error.message}`);
      }
    }
  };

  return { uploadAttachments };
};
