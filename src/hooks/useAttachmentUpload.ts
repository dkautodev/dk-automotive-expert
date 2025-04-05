
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAttachmentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  /**
   * Convertit un fichier en chaîne base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  /**
   * Télécharge un fichier sur Google Drive via Edge Function
   */
  const uploadToGoogleDrive = async (missionId: string, file: File, userId: string): Promise<boolean> => {
    try {
      console.log("Début du téléchargement vers Google Drive");
      
      // Convertir le fichier en base64
      const fileData = await fileToBase64(file);
      
      // Appeler l'Edge Function pour Google Drive
      const { data, error } = await supabase.functions.invoke('upload_to_google_drive', {
        body: {
          missionId,
          fileData,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: userId
        }
      });
      
      if (error) {
        console.error("Erreur lors de l'appel à l'Edge Function Google Drive:", error);
        throw error;
      }
      
      console.log("Réponse de Google Drive:", data);
      
      // Créer l'enregistrement en base de données avec les informations de Google Drive
      const { error: dbError } = await supabase
        .from('mission_attachments')
        .insert({
          mission_id: missionId,
          file_name: file.name,
          file_path: data.fileId, // Utiliser l'ID du fichier Google Drive
          file_type: file.type,
          file_size: file.size,
          uploaded_by: userId,
          storage_provider: 'google_drive',
          provider_file_id: data.fileId,
          provider_view_url: data.webViewLink,
          provider_download_url: data.webContentLink
        });
      
      if (dbError) {
        console.error("Erreur lors de l'enregistrement en base de données:", dbError);
        throw dbError;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement vers Google Drive:", error);
      return false;
    }
  };

  /**
   * Télécharge un fichier directement via l'API Supabase Storage
   */
  const uploadViaStorage = async (missionId: string, file: File, userId: string): Promise<boolean> => {
    try {
      // Préparer le nom du fichier
      const fileName = file.name;
      const fileExt = fileName.split('.').pop();
      const sanitizedName = fileName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_')
        .replace(/\s+/g, '_');
      
      const uniqueId = Date.now();
      const filePath = `missions/${missionId}/${uniqueId}_${sanitizedName}`;
      
      // Télécharger le fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mission-attachments')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Créer l'enregistrement en base de données
      const { error: dbError } = await supabase
        .from('mission_attachments')
        .insert({
          mission_id: missionId,
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: userId,
          storage_provider: 'supabase'
        });
      
      if (dbError) {
        // Nettoyer le fichier si l'enregistrement échoue
        await supabase.storage.from('mission-attachments').remove([filePath]);
        throw dbError;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur de téléchargement direct:", error);
      return false;
    }
  };

  /**
   * Télécharge un fichier en utilisant Edge Function
   */
  const uploadViaEdgeFunction = async (missionId: string, file: File, userId: string): Promise<boolean> => {
    try {
      // Convertir le fichier en base64
      const fileData = await fileToBase64(file);
      
      // Appeler l'Edge Function
      const { data, error } = await supabase.functions.invoke('upload_mission_attachments', {
        body: {
          missionId,
          fileData,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: userId
        }
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur Edge Function:", error);
      return false;
    }
  };

  /**
   * Télécharge des fichiers pour une mission
   */
  const uploadAttachments = async (missionId: string, files: File[], userId: string): Promise<boolean> => {
    if (!files.length) return true;
    if (!missionId) {
      toast.error("ID de mission manquant");
      return false;
    }
    
    setIsUploading(true);
    let allSucceeded = true;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
        
        // Essayer d'abord la méthode Google Drive
        setUploadProgress(prev => ({ ...prev, [file.name]: 30 }));
        let success = await uploadToGoogleDrive(missionId, file, userId);
        
        // Si Google Drive échoue, essayer la méthode Storage directe
        if (!success) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
          success = await uploadViaStorage(missionId, file, userId);
          
          // Si la méthode directe échoue aussi, essayer via Edge Function
          if (!success) {
            setUploadProgress(prev => ({ ...prev, [file.name]: 70 }));
            success = await uploadViaEdgeFunction(missionId, file, userId);
          }
        }
        
        if (!success) {
          allSucceeded = false;
          toast.error(`Échec du téléchargement pour ${file.name}`);
        } else {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        }
      }
      
      if (allSucceeded) {
        toast.success("Tous les fichiers ont été téléchargés avec succès");
      } else if (files.length > 1) {
        toast.warning("Certains fichiers n'ont pas pu être téléchargés");
      }
      
      return allSucceeded;
    } catch (error) {
      console.error("Erreur lors du téléchargement des pièces jointes:", error);
      toast.error("Erreur lors du téléchargement des fichiers");
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  return {
    uploadAttachments,
    isUploading,
    uploadProgress
  };
};
