
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
  const uploadToGoogleDrive = async (missionId: string, missionNumber: string, file: File, userId: string, fileIndex: number): Promise<boolean> => {
    try {
      console.log("Début du téléchargement vers Google Drive");
      
      // Convertir le fichier en base64
      const fileData = await fileToBase64(file);
      console.log("Fichier converti en base64, taille:", fileData.length);
      
      // Appeler l'Edge Function pour Google Drive
      console.log("Appel de l'Edge Function Google Drive");
      const { data, error } = await supabase.functions.invoke('upload_to_google_drive', {
        body: {
          missionId,
          missionNumber,
          fileData,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: userId,
          fileIndex
        }
      });
      
      if (error) {
        console.error("Erreur lors de l'appel à l'Edge Function Google Drive:", error);
        throw error;
      }
      
      console.log("Réponse de Google Drive:", data);
      
      if (!data || !data.fileId) {
        console.error("Aucun ID de fichier reçu de Google Drive", data);
        throw new Error("Aucun ID de fichier reçu de Google Drive");
      }
      
      // Vérifier si le tableau existe et contient les colonnes nécessaires
      try {
        // Créer l'enregistrement en base de données avec les informations de Google Drive
        const dbData = {
          mission_id: missionId,
          file_name: file.name,
          file_path: data.fileId, // Utiliser l'ID du fichier Google Drive
          file_type: file.type,
          file_size: file.size,
          uploaded_by: userId,
          storage_provider: 'google_drive',
          provider_file_id: data.fileId
        };
        
        // Ajouter conditionnellement les URLs si elles sont disponibles
        if (data.webViewLink) {
          Object.assign(dbData, { provider_view_url: data.webViewLink });
        }
        
        if (data.webContentLink) {
          Object.assign(dbData, { provider_download_url: data.webContentLink });
        }
        
        const { error: dbError } = await supabase
          .from('mission_attachments')
          .insert(dbData);
        
        if (dbError) {
          console.error("Erreur lors de l'enregistrement en base de données:", dbError);
          throw dbError;
        }
        
        console.log("Enregistrement en base de données réussi");
        return true;
      } catch (dbError) {
        console.error("Erreur détaillée lors de l'enregistrement en BDD:", dbError);
        
        // Fallback: Enregistrer sans les colonnes problématiques
        const { error: fallbackError } = await supabase
          .from('mission_attachments')
          .insert({
            mission_id: missionId,
            file_name: file.name,
            file_path: data.fileId,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: userId,
            storage_provider: 'google_drive'
          });
          
        if (fallbackError) {
          console.error("Erreur lors de l'enregistrement fallback:", fallbackError);
          return false;
        }
        
        console.log("Enregistrement fallback réussi");
        return true;
      }
    } catch (error) {
      console.error("Erreur détaillée lors du téléchargement vers Google Drive:", error);
      return false;
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
      const fileData = await fileToBase64(file);
      
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
        
        // Priorité à la méthode Google Drive
        setUploadProgress(prev => ({ ...prev, [file.name]: 30 }));
        console.log("Tentative de téléchargement via Google Drive");
        let success = await uploadToGoogleDrive(missionId, missionNumber, file, userId, fileIndex);
        
        if (success) {
          console.log(`Fichier ${file.name} téléchargé avec succès vers Google Drive`);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          toast.success(`Fichier ${file.name} téléchargé avec succès`);
          continue; // Passer au fichier suivant si Google Drive a réussi
        }
        
        // Si Google Drive échoue, essayer la méthode Storage directe
        console.log("Échec Google Drive, tentative via Storage direct");
        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        success = await uploadViaStorage(missionId, missionNumber, file, userId, fileIndex);
          
        if (success) {
          console.log(`Fichier ${file.name} téléchargé avec succès vers Supabase Storage`);
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          toast.success(`Fichier ${file.name} téléchargé avec succès`);
          continue; // Passer au fichier suivant si Storage a réussi
        }
        
        // Si la méthode directe échoue aussi, essayer via Edge Function
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
