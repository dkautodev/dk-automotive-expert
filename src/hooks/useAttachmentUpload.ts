import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { isFileTypeAllowed, generateUniqueFileName, formatFileSize } from "@/utils/fileUtils";
import { missionService } from "@/services/missionService";
import { UserRole } from "@/hooks/auth/types";

// Types for the hook
type UploadProgressMap = { [key: string]: number };

interface AttachmentUploadResult {
  success: boolean;
  filePath?: string;
  error?: Error;
}

interface DeleteAttachmentResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook that provides functionality to upload and manage attachments
 */
export const useAttachmentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressMap>({});
  const { user, role } = useAuthContext();

  /**
   * Télécharge un fichier directement via l'API Supabase Storage
   */
  const uploadViaStorage = async (
    missionId: string, 
    missionNumber: string, 
    file: File, 
    userId: string, 
    fileIndex: number
  ): Promise<AttachmentUploadResult> => {
    try {
      // Vérifier le type de fichier
      if (!isFileTypeAllowed(file.type)) {
        console.error(`Type de fichier non autorisé: ${file.type}`);
        toast.error(`Le type de fichier "${file.type}" n'est pas autorisé`);
        return { success: false, error: new Error(`Type de fichier non autorisé: ${file.type}`) };
      }
      
      // Générer un nom de fichier unique
      const uniqueFileName = generateUniqueFileName(fileIndex, file.name);
      
      // Créer le chemin de fichier avec le numéro de mission comme dossier
      const filePath = `missions/${missionNumber}/${uniqueFileName}`;
      
      console.log("Téléchargement direct: Chemin de fichier =", filePath);
      
      // Télécharger le fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mission-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Ne pas écraser les fichiers existants
        });
      
      if (uploadError) {
        console.error("Erreur détaillée du téléchargement:", uploadError);
        
        // Vérifier si c'est une erreur de conflit (fichier existe déjà)
        if (uploadError.message === "The resource already exists" || 
            uploadError.message.includes("409") || 
            uploadError.message.includes("already exists")) {
          console.log("Fichier déjà existant, utilisation du chemin existant");
          // On continue avec la création de l'enregistrement
        } else {
          throw uploadError;
        }
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
        console.error("Erreur lors de la création de l'enregistrement:", dbError);
        throw dbError;
      }
      
      return { success: true, filePath };
    } catch (error) {
      console.error("Erreur de téléchargement direct:", error);
      return { success: false, error: error as Error };
    }
  };

  /**
   * Télécharge un fichier en utilisant Edge Function
   */
  const uploadViaEdgeFunction = async (
    missionId: string, 
    missionNumber: string, 
    file: File, 
    userId: string, 
    fileIndex: number
  ): Promise<AttachmentUploadResult> => {
    try {
      // Vérifier le type de fichier
      if (!isFileTypeAllowed(file.type)) {
        console.error(`Type de fichier non autorisé: ${file.type}`);
        toast.error(`Le type de fichier "${file.type}" n'est pas autorisé`);
        return { success: false, error: new Error(`Type de fichier non autorisé: ${file.type}`) };
      }
      
      // Convertir le fichier en base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      // Générer un nom de fichier unique
      const uniqueFileName = generateUniqueFileName(fileIndex, file.name);
      
      console.log("Téléchargement via Edge Function: nom de fichier =", uniqueFileName);
      
      // Appeler l'Edge Function
      const { data, error } = await supabase.functions.invoke('upload_mission_attachments', {
        body: {
          missionId,
          missionNumber,
          fileData,
          fileName: uniqueFileName,
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
      
      return { success: true, filePath: data?.filePath };
    } catch (error) {
      console.error("Erreur Edge Function:", error);
      return { success: false, error: error as Error };
    }
  };

  /**
   * Obtient une URL de téléchargement pour un fichier
   */
  const getFileDownloadUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('mission-attachments')
        .createSignedUrl(filePath, 60); // URL valide pendant 60 secondes
      
      if (error) {
        console.error("Erreur lors de la création de l'URL signée:", error);
        return null;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error("Erreur lors de la création de l'URL signée:", error);
      return null;
    }
  };

  /**
   * Supprime un fichier joint à une mission
   */
  const deleteAttachment = async (attachmentId: string, filePath: string): Promise<DeleteAttachmentResult> => {
    setIsDeleting(true);
    
    try {
      console.log("Suppression du fichier avec ID:", attachmentId, "et chemin:", filePath);

      // Vérifier si l'utilisateur est un chauffeur (driver ou chauffeur)
      if (role === ('driver' as UserRole) || role === ('chauffeur' as UserRole)) {
        console.error("Les chauffeurs n'ont pas le droit de supprimer des fichiers");
        toast.error("Vous n'avez pas l'autorisation de supprimer des fichiers");
        return { success: false, error: new Error("Accès refusé - chauffeurs non autorisés à supprimer des fichiers") };
      }
      
      // Supprimer d'abord l'enregistrement de la base de données
      const { error: dbError } = await supabase
        .from('mission_attachments')
        .delete()
        .eq('id', attachmentId);
        
      if (dbError) {
        console.error("Erreur lors de la suppression de l'enregistrement:", dbError);
        toast.error(`Erreur lors de la suppression: ${dbError.message}`);
        throw dbError;
      }
      
      console.log("Enregistrement supprimé de la base de données, suppression du fichier de storage...");
      
      // Ensuite supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from('mission-attachments')
        .remove([filePath]);
      
      if (storageError) {
        console.error("Erreur lors de la suppression du fichier de storage:", storageError);
        // Afficher plus de détails sur l'erreur de storage
        console.error("Détails de l'erreur storage:", JSON.stringify(storageError));
        
        // On continue même si la suppression du storage échoue, l'enregistrement a été supprimé
        toast.warning("Le fichier a été supprimé de la base de données mais pas du stockage");
        return { success: true };
      }
      
      console.log("Fichier supprimé avec succès du storage");
      toast.success("Fichier supprimé avec succès");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur complète lors de la suppression:", error);
      console.error("Détails de l'erreur:", JSON.stringify(error, null, 2));
      toast.error(`Erreur lors de la suppression: ${error.message || "Erreur inconnue"}`);
      return { success: false, error: error as Error };
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Télécharge des fichiers pour une mission
   */
  const uploadAttachments = async (
    missionId: string, 
    files: File[], 
    userId: string, 
    maxRetries = 2
  ): Promise<boolean> => {
    if (!files.length) return true;
    if (!missionId) {
      toast.error("ID de mission manquant");
      return false;
    }
    
    setIsUploading(true);
    let allSucceeded = true;
    
    try {
      // Récupérer le numéro de mission
      const missionNumber = await missionService.getMissionNumber(missionId);
      
      if (!missionNumber) {
        toast.error("Impossible de récupérer le numéro de mission");
        return false;
      }
      
      console.log(`Téléchargement pour la mission ${missionId} (${missionNumber})`);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileIndex = i + 1; // Index du fichier (1-based)
        let uploadResult: AttachmentUploadResult = { success: false };
        let retries = 0;
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
        
        console.log(`Tentative de téléchargement du fichier "${file.name}" (index: ${fileIndex}) pour la mission ${missionNumber}`);
        
        // Essayer la méthode Storage directe avec quelques tentatives
        while (!uploadResult.success && retries <= maxRetries) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 30 + (retries * 10) }));
          uploadResult = await uploadViaStorage(missionId, missionNumber, file, userId, fileIndex);
          
          if (uploadResult.success) {
            console.log(`Fichier ${file.name} téléchargé avec succès vers Supabase Storage`);
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
            toast.success(`Fichier ${file.name} téléchargé avec succès`);
            break; // Sortir de la boucle si succès
          }
          
          retries++;
          
          if (retries <= maxRetries) {
            console.log(`Tentative ${retries}/${maxRetries} échouée, nouvelle tentative...`);
          }
        }
        
        // Si toutes les tentatives directes ont échoué, essayer via Edge Function
        if (!uploadResult.success) {
          console.log("Toutes les tentatives Storage directes ont échoué, tentative via Edge Function");
          setUploadProgress(prev => ({ ...prev, [file.name]: 70 }));
          uploadResult = await uploadViaEdgeFunction(missionId, missionNumber, file, userId, fileIndex);
          
          if (uploadResult.success) {
            console.log(`Fichier ${file.name} téléchargé avec succès via Edge Function`);
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
            toast.success(`Fichier ${file.name} téléchargé avec succès`);
          } else {
            allSucceeded = false;
            console.error(`Échec du téléchargement pour ${file.name}`);
            toast.error(`Échec du téléchargement pour ${file.name}`);
          }
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
    getFileDownloadUrl,
    deleteAttachment,
    isUploading,
    isDeleting,
    uploadProgress
  };
};
