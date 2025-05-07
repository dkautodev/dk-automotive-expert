
import { useState } from 'react';
import { toast } from 'sonner';
import { mockMissionService } from '@/services/mission/mockMissionService';

export const useAttachmentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadAttachments = async (missionId: string, files: File[], userId: string) => {
    if (!files.length) return false;

    setIsUploading(true);
    setUploadProgress({});

    try {
      // Initialiser le progress pour chaque fichier
      const initialProgress: Record<string, number> = {};
      files.forEach(file => {
        initialProgress[file.name] = 0;
      });
      setUploadProgress(initialProgress);

      // Simuler la progression pour chaque fichier
      files.forEach(file => {
        simulateProgress(file.name);
      });

      // Appeler le service mocké
      await mockMissionService.uploadAttachments(missionId, files);

      // Marquer tous les fichiers comme complétés
      const completedProgress: Record<string, number> = {};
      files.forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(completedProgress);

      toast.success(`${files.length} fichier(s) téléchargé(s) avec succès`);
      return true;
    } catch (error: any) {
      console.error('Erreur de téléchargement:', error);
      toast.error(`Erreur lors du téléchargement: ${error.message || 'Erreur inconnue'}`);
      return false;
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress({});
      }, 500);
    }
  };

  const simulateProgress = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 95) {
        progress = 95; // On laisse le service confirmer les 100%
        clearInterval(interval);
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: progress
      }));
    }, 300);
  };

  const getFileDownloadUrl = async (filePath: string) => {
    return `mock-download-url/${filePath}`;
  };

  const deleteAttachment = async (attachmentId: string) => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Document supprimé avec succès');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    uploadAttachments,
    isUploading,
    isDeleting,
    uploadProgress,
    getFileDownloadUrl,
    deleteAttachment
  };
};
