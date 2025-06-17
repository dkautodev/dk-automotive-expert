
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PageContent } from '@/hooks/usePageContents';

interface UseLogoUploadProps {
  uploadImage: (file: File, blockKey: string) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<PageContent>) => Promise<void>;
  refetch: () => Promise<void>;
  contents: PageContent[];
  onSuccess: () => void;
}

export const useLogoUpload = ({
  uploadImage,
  updateContent,
  refetch,
  contents,
  onSuccess
}: UseLogoUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const deleteOldLogo = async (logoUrl: string) => {
    try {
      if (logoUrl && logoUrl.includes('page-images')) {
        const fileName = logoUrl.split('page-images/')[1];
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('page-images')
            .remove([fileName]);
          
          if (deleteError) {
            console.error('Erreur lors de la suppression de l\'ancien logo:', deleteError);
          } else {
            console.log('Ancien logo supprimé avec succès');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ancien logo:', error);
    }
  };

  const handleUpload = async (selectedFile: File, logoContent: PageContent) => {
    setUploading(true);
    try {
      const oldLogoUrl = logoContent.content_value || '';
      
      const imageUrl = await uploadImage(selectedFile, 'logo');
      
      if (imageUrl && logoContent) {
        await updateContent(logoContent.id, { content_value: imageUrl });
        
        if (oldLogoUrl && oldLogoUrl !== imageUrl) {
          await deleteOldLogo(oldLogoUrl);
        }
        
        onSuccess();
        await refetch();
        toast.success('Logo mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour du logo');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    handleUpload
  };
};
