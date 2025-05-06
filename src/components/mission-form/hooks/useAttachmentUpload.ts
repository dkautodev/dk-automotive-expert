
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { mockMissionService } from "@/services/mission/mockMissionService";

export const useAttachmentUpload = () => {
  const { user } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);

  const uploadAttachments = async (missionId: string, attachments: File[]) => {
    if (!attachments || attachments.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const success = await mockMissionService.uploadAttachments(missionId, attachments);
      
      if (success) {
        toast.success("Fichiers téléchargés avec succès");
      } else {
        toast.error("Une erreur est survenue lors du téléchargement des fichiers");
      }
      
      return success;
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
