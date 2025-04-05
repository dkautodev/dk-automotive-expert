
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
   * Vérifie si le type de fichier est autorisé
   */
  const isFileTypeAllowed = (fileType: string): boolean => {
    // Liste des types MIME autorisés
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Documents
      'application/pdf', 
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/plain', // .txt
      'text/csv' // .csv
    ];
    
    return allowedTypes.includes(fileType);
  };

  /**
   * Génère un nom de fichier unique
   */
  const generateUniqueFileName = (fileIndex: number, originalName: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || '';
    const paddedIndex = fileIndex.toString().padStart(2, '0');
    
    return `fichier${paddedIndex}_${timestamp}_${randomString}${extension ? `.${extension}` : ''}`;
  };

  /**
   * Télécharge un fichier directement via l'API Supabase Storage
   */
  const uploadViaStorage = async (missionId: string, missionNumber: string, file: File, userId: string, fileIndex: number): Promise<boolean> => {
    try {
      // Vérifier le type de fichier
      if (!isFileTypeAllowed(file.type)) {
        console.error(`Type de fichier non autorisé: ${file.type}`);
        toast.error(`Le type de fichier "${file.type}" n'est pas autorisé`);
        return false;
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
        // On ne supprime pas le fichier car il pourrait être référencé ailleurs
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
      // Vérifier le type de fichier
      if (!isFileTypeAllowed(file.type)) {
        console.error(`Type de fichier non autorisé: ${file.type}`);
        toast.error(`Le type de fichier "${file.type}" n'est pas autorisé`);
        return false;
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
      
      return true;
    } catch (error) {
      console.error("Erreur Edge Function:", error);
      return false;
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
   * Télécharge des fichiers pour une mission
   */
  const uploadAttachments = async (missionId: string, files: File[], userId: string, maxRetries = 2): Promise<boolean> => {
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
        let success = false;
        let retries = 0;
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
        
        console.log(`Tentative de téléchargement du fichier "${file.name}" (index: ${fileIndex}) pour la mission ${missionNumber}`);
        
        // Essayer la méthode Storage directe avec quelques tentatives
        while (!success && retries <= maxRetries) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 30 + (retries * 10) }));
          success = await uploadViaStorage(missionId, missionNumber, file, userId, fileIndex);
          
          if (success) {
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
        if (!success) {
          console.log("Toutes les tentatives Storage directes ont échoué, tentative via Edge Function");
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
    isUploading,
    uploadProgress
  };
};
