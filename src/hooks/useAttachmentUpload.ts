
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAttachmentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  /**
   * Obtient le numéro de mission à partir de l'ID
   */
  const getMissionNumber = async (missionId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('mission_number')
        .eq('id', missionId)
        .single();
      
      if (error || !data) {
        console.error("Erreur lors de la récupération du numéro de mission:", error);
        return null;
      }
      
      return data.mission_number;
    } catch (error) {
      console.error("Erreur lors de la récupération du numéro de mission:", error);
      return null;
    }
  };

  /**
   * Télécharge un fichier directement via l'API Supabase Storage
   */
  const uploadViaStorage = async (missionId: string, missionNumber: string, file: File, userId: string, fileIndex: number): Promise<boolean> => {
    try {
      // Générer un nom de fichier simple
      const extension = file.name.split('.').pop() || '';
      const paddedIndex = fileIndex.toString().padStart(2, '0');
      const simpleFileName = `fichier${paddedIndex}${extension ? `.${extension}` : ''}`;
      
      // Créer le chemin de fichier avec le numéro de mission comme dossier
      const filePath = `missions/${missionNumber}/${simpleFileName}`;
      
      console.log("Téléchargement direct: Chemin de fichier =", filePath);
      
      // Télécharger le fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mission-attachments')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Erreur détaillée du téléchargement:", uploadError);
        throw uploadError;
      }
      
      // Créer l'enregistrement en base de données
      const { error: dbError } = await supabase
        .from('mission_attachments')
        .insert({
          mission_id: missionId,
          file_name: file.name, // Garder le nom original pour l'affichage
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
  const uploadViaEdgeFunction = async (missionId: string, missionNumber: string, file: File, userId: string, fileIndex: number): Promise<boolean> => {
    try {
      // Convertir le fichier en base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      // Générer un nom de fichier simple
      const extension = file.name.split('.').pop() || '';
      const paddedIndex = fileIndex.toString().padStart(2, '0');
      const simpleFileName = `fichier${paddedIndex}${extension ? `.${extension}` : ''}`;
      
      console.log("Téléchargement via Edge Function: nom de fichier =", simpleFileName);
      
      // Appeler l'Edge Function
      const { data, error } = await supabase.functions.invoke('upload_mission_attachments', {
        body: {
          missionId,
          missionNumber,
          fileData,
          fileName: simpleFileName,
          originalFileName: file.name, // Conserver le nom original pour l'affichage
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: userId
        }
      });
      
      if (error) {
        console.error("Erreur détaillée Edge Function:", error);
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
      // Récupérer le numéro de mission
      const missionNumber = await getMissionNumber(missionId);
      
      if (!missionNumber) {
        toast.error("Impossible de récupérer le numéro de mission");
        return false;
      }
      
      console.log(`Téléchargement pour la mission ${missionId} (${missionNumber})`);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileIndex = i + 1; // Index du fichier (1-based)
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
        
        console.log(`Tentative de téléchargement du fichier "${file.name}" (index: ${fileIndex}) pour la mission ${missionNumber}`);
        
        // Essayer la méthode Storage directe
        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        let success = await uploadViaStorage(missionId, missionNumber, file, userId, fileIndex);
          
        if (success) {
          console.log(`Fichier ${file.name} téléchargé avec succès vers Supabase Storage`);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          toast.success(`Fichier ${file.name} téléchargé avec succès`);
          continue; // Passer au fichier suivant si Storage a réussi
        }
        
        // Si la méthode directe échoue, essayer via Edge Function
        console.log("Échec Storage direct, tentative via Edge Function");
        setUploadProgress(prev => ({ ...prev, [file.name]: 70 }));
        success = await uploadViaEdgeFunction(missionId, missionNumber, file, userId, fileIndex);
        
        if (success) {
          console.log(`Fichier ${file.name} téléchargé avec succès via Edge Function`);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          toast.success(`Fichier ${file.name} téléchargé avec succès`);
        } else {
          allSucceeded = false;
          console.error(`Échec du téléchargement pour ${file.name}`);
          toast.error(`Échec du téléchargement pour ${file.name}`);
        }
      }
      
      if (allSucceeded && files.length > 1) {
        toast.success("Tous les fichiers ont été téléchargés avec succès");
      } else if (!allSucceeded && files.length > 1) {
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
